function PreviousButton({ dispatch, index = null }) {
  if (index === 0) return <span></span>;
  return (
    <button
      className="btn btn-ui"
      onClick={() => dispatch({ type: "prevQuestion" })}
    >
      Previous
    </button>
  );
}

export default PreviousButton;
