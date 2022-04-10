import React from 'react';
import './App.css';

function text(text: string|number) {
  return <p>{text}</p>;
}

function scoreboardRow(boxScoreRow = ["P","",1,2,3,4,5,6,7,8,9,10,"R","H","E"]) {
  const teamName = boxScoreRow[1].toString();
  let cardClasses = "card ";
  const teamClasses = teamName === "BOSTON" || teamName.length === 0 ? cardClasses : cardClasses + "visitor-team ";
  if (teamName.length !== 0) cardClasses = cardClasses + "inset ";
  return (
    <>
    <div id={teamName} className={"scoreboardRow"}>
      <div id="player-number" className={cardClasses}>{text(boxScoreRow[0])}</div>
      <div className={teamClasses} id="team-name">{text(boxScoreRow[1])}</div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(boxScoreRow[2])}</div>
        <div className={cardClasses} id="inning">{text(boxScoreRow[3])}</div>
        <div className={cardClasses} id="inning">{text(boxScoreRow[4])}</div>
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(boxScoreRow[5])}</div>
        <div className={cardClasses} id="inning">{text(boxScoreRow[6])}</div>
        <div className={cardClasses} id="inning">{text(boxScoreRow[7])}</div>
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(boxScoreRow[8])}</div>
        <div className={cardClasses} id="inning">{text(boxScoreRow[9])}</div>
        <div className={cardClasses} id="inning">{text(boxScoreRow[10])}</div>
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(boxScoreRow[11])}</div>
      </div>
      <div className="rhe-group">
        <div className={cardClasses} id="rhe">{text(boxScoreRow[12])}</div>
        <div className={cardClasses} id="rhe">{text(boxScoreRow[13])}</div>
        <div className={cardClasses} id="rhe">{text(boxScoreRow[14])}</div>
      </div>
    </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <div className="name">{text("FENWAY PARK")}</div>
      <div className="scores">
        {scoreboardRow()}
        {scoreboardRow([39,"TB",2,0,3,0,0,0,2,0,0,"",7,8,1])}
        {scoreboardRow([63,"BOSTON",0,0,0,0,0,0,4,3,1,"",8,11,0])}
      </div>
    </div>
  );
}

export default App;
