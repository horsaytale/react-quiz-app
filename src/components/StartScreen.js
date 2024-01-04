function StartScreen({ numQuestions, dispatch, highscore, difficulty }) {
  return (
    <div className="start">
      <span>Current Highscore : {highscore}</span>
      <h2>Welcome to The React Quiz</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <div className="difficulty-selection">
        <p>Choose the difficulty of the questions: </p>
        <select
          value={difficulty}
          onChange={(e) =>
            dispatch({ type: "setDifficulty", payload: e.target.value })
          }
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
