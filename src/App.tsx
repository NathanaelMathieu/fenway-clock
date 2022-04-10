import React from 'react';
import './App.css';

function scoreboardRow(teamName: string) {
  return (
    <>
    <div className={teamName + " scoreboardRow"}>
      <div className="card player-number">00</div>
      <div className="card team-name">{teamName}</div>
      <div className="card">1</div>
      <div className="card">2</div>
      <div className="card">3</div>
      <div className="spacer"></div>
      <div className="card">4</div>
      <div className="card">5</div>
      <div className="card">6</div>
      <div className="spacer"></div>
      <div className="card">7</div>
      <div className="card">8</div>
      <div className="card">9</div>
      <div className="spacer"></div>
      <div className="card">10</div>
      <div className="spacer"></div>
      <div className="spacer"></div>
      <div className="card">R</div>
      <div className="spacer"></div>
      <div className="card">H</div>
      <div className="spacer"></div>
      <div className="card">E</div>
      <div className="spacer"></div>
    </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      {scoreboardRow("")}
      {scoreboardRow("VISITOR")}
      {scoreboardRow("BOSTON")}
    </div>
  );
}

export default App;
