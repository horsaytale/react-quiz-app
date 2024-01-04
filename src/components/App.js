import DateCounter from "./DateCounter";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import { useEffect, useReducer } from "react";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import PreviousButton from "./PreviousButton";

const initialState = {
  questions: [],
  selectedQuestions: [],
  // it can be in any of these status: "loading", "error", "ready", "active", "finished"
  status: "loading",
  index: 0,
  answer: null,
  answers: [],
  points: 0,
  highscore: JSON.parse(localStorage.getItem("highscore")) ?? 0,
  secondsRemaining: null,
  difficulty: "all",
};

function reducer(state, action) {
  switch (action.type) {
    // 2 states are being updated
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        selectedQuestions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.selectedQuestions.length * 30,
      };
    case "newAnswer":
      const question = state.selectedQuestions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
        answers: [...state.answers, action.payload],
      };
    case "nextQuestion":
      const iterator =
        state.index + 1 < state.selectedQuestions.length
          ? state.index + 1
          : state.index;

      return {
        ...state,
        index: iterator,
        answer: state.answers.at(iterator) ? state.answers.at(iterator) : null,
      };

    case "prevQuestion":
      const index = state.index - 1 >= 0 ? state.index - 1 : state.index;

      return {
        ...state,
        index,
        answer: state.answers.at(index) ? state.answers.at(index) : null,
      };

    case "finish":
      const highscore =
        state.points > state.highscore ? state.points : state.highscore;

      localStorage.setItem("highscore", JSON.stringify(highscore));

      return {
        ...state,
        status: "finished",
        highscore,
      };
    case "reset":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        selectedQuestions: state.selectedQuestions,
        difficulty: state.difficulty,
        highscore: state.highscore,
      };
    // return {
    //   ...state,
    //   status: "ready",
    //   index: 0,
    //   answer: null,
    //   points: 0,
    //   highscore: 0,
    // };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    case "seeAnswer":
      return { ...state, answer: state.answers[state.index], status: "verify" };

    case "setDifficulty":
      return {
        ...state,
        difficulty: action.payload,
        selectedQuestions:
          action.payload === "all"
            ? state.questions
            : state.questions.filter(
                (question) => question.difficulty === action.payload
              ),
      };

    default:
      throw new Error("Action Unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      selectedQuestions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = selectedQuestions.length;
  const maxPossiblePoints = selectedQuestions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
            highscore={highscore}
            difficulty={difficulty}
          />
        )}
        {(status === "active" || status === "verify") && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
              status={status}
            />
            <footer>
              {status !== "verify" && (
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />
              )}

              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
              {status === "verify" && (
                <PreviousButton dispatch={dispatch} index={index} />
              )}
            </footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
