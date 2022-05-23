import React, { useEffect } from 'react';
import teamsResponse from './teams-response';
import './App.css';
import { GameAPI, TeamAPI, ScheduleAPI } from 'mlb-stats-typescript-api';

function text(text: string|number) {
  return <p>{text}</p>;
}

function scoreboardRow(linescore = ["P","",1,2,3,4,5,6,7,8,9,10,"R","H","E"]) {
  if (linescore.length !== 15) {
    return;
  };
  const teamName = linescore[1].toString();
  let cardClasses = "card ";
  const teamClasses = teamName === "BOSTON" || teamName.length === 0 ? cardClasses : cardClasses + "visitor-team ";
  if (teamName.length !== 0) cardClasses = cardClasses + "inset ";
  return (
    <>
    <div id={teamName} className={"scoreboardRow"}>
      <div id="player-number" className={cardClasses}>{text(linescore[0])}</div>
      <div className={teamClasses} id="team-name">{text(linescore[1])}</div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(linescore[2])}</div>
        <div className={cardClasses} id="inning">{text(linescore[3])}</div>
        <div className={cardClasses} id="inning">{text(linescore[4])}</div>
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(linescore[5])}</div>
        <div className={cardClasses} id="inning">{text(linescore[6])}</div>
        <div className={cardClasses} id="inning">{text(linescore[7])}</div>
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(linescore[8])}</div>
        <div className={cardClasses} id="inning">{text(linescore[9])}</div>
        <div className={cardClasses} id="inning">{text(linescore[10])}</div>
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(linescore[11])}</div>
      </div>
      <div className="rhe-group">
        <div className={cardClasses} id="rhe">{text(linescore[12])}</div>
        <div className={cardClasses} id="rhe">{text(linescore[13])}</div>
        <div className={cardClasses} id="rhe">{text(linescore[14])}</div>
      </div>
    </div>
    </>
  );
}

// function checkForScores(setBoxscore: void) {
  // const interval = setInterval( function() {
  //   //do something
  // }
  // , 5000)
  // clearInterval();
// }

enum Team {
  AwayTeam = "away",
  HomeTeam = "home",
}

function extractLinescoreForTeam(linescore: GameAPI.Linescore, teamsRes: any, team: Team): (number|string)[] {
  if (!linescore) {
    return [];
  }
  let linescoreList: (number|string)[] = [];
  
  linescoreList.push(0);

  if (teamsRes && teamsRes.teams.length > 0) {
    let teamId = team === Team.HomeTeam ? linescore.defense?.team?.id : linescore.offense?.team?.id; 
    let teams: [any] = teamsRes.teams;
    linescoreList.push(teams.find((team) => team.id === teamId).abbreviation);
  }
  // TODO: Handle extra innings
  
  for (let i = linescoreList.length - 1; i < 11; i++) {
    if (linescore.innings && i < linescore.innings.length) {
      const runs = linescore.innings[i].home?.runs ?? "";
      linescoreList.push(runs);
    } else {
      linescoreList.push("");
    }
  }
  
  if (linescore.teams) {
    const thisTeam = team === Team.HomeTeam ? linescore.teams.home : linescore.teams.away;
    if (thisTeam && thisTeam.runs && thisTeam.hits && thisTeam.errors) {
      linescoreList.push(thisTeam.runs);
      linescoreList.push(thisTeam.hits);
      linescoreList.push(thisTeam.errors);
    } else {
      linescoreList.push("","","");
    }
  }

  return linescoreList;
}

const soxTeamId = 134; // Pirates
// const soxTeamId = 111;

function App() {
  const [awayList, setAwayList] = React.useState<(string | number)[]>([]);
  const [homeList, setHomeList] = React.useState<(string | number)[]>([]);
  const [linescoreRes, setLinescoreRes] = React.useState<GameAPI.Linescore | undefined>();
  const [teamsRes, setTeamsRes] = React.useState<TeamAPI.TeamsRestObject | undefined>();
  //eslint-disable-next-line
  const [scheduleRes, setScheduleRes] = React.useState<ScheduleAPI.ScheduleRestObject | undefined>();

  useEffect(() => {
    ScheduleAPI.ScheduleService.schedule(1, undefined, {teamId: soxTeamId}).then((res) => {
      setScheduleRes(res);
    });
    // TODO: Cache this in storage, also do an actual call
    setTeamsRes(teamsResponse);
  }, []);

  useEffect(() => {
    // TODO: If no game today, load previous day's game
    if (scheduleRes && scheduleRes.totalGames && scheduleRes.totalGames > 0
        && scheduleRes.dates && scheduleRes.dates.length > 0
        && scheduleRes.dates[0] && scheduleRes.dates[0].games) {
      // TODO: Check for the time of the game, we want to leave the previous game up for a while
      // TODO: What about double headers?
      const gamePk = scheduleRes.dates[0]?.games[0]?.gamePk;

      if (gamePk) {
        GameAPI.GameService.linescore(gamePk).then((res: GameAPI.Linescore) => {
          setLinescoreRes(res);
        });
      }
    }
  }, [scheduleRes])

  useEffect(() => {
    if (linescoreRes && teamsRes) {
      setAwayList(extractLinescoreForTeam(linescoreRes, teamsRes, Team.AwayTeam));
      setHomeList(extractLinescoreForTeam(linescoreRes, teamsRes, Team.HomeTeam));
    }
  }, [linescoreRes, teamsRes, setAwayList, setHomeList]);

  return (
    <div className="App">
      <div className="name">{text("FENWAY PARK")}</div>
      <div className="scores">
        {scoreboardRow()}
        {(awayList.length === 0 || homeList.length === 0) ? <div className='errorLinescore'>Error: No Linescore Data</div> : <> {scoreboardRow(awayList)} {scoreboardRow(homeList)} </> }
      </div>
    </div>
  );
}

export default App;
