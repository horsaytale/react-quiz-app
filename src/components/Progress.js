function Progress({ numQuestions, index, points, maxPossiblePoints, answer }) {
  return (
    <header className="progress">
      {/* Number(false)=0 / Number(true)=1 */}
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
