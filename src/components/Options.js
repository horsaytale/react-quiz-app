function Options({ question, dispatch, answer, status }) {
  const hasAnswered = answer !== null || status === "verify";
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          //Once clicked, it will direct to the case (newAnswer) that instantly assigned the index as the selected answer AND now it is comparing each index under .map with the selected ANSWER and assign a proper class to it
          //   Answer = NULL switch to an index
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
