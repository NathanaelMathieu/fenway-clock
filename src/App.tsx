import React, { useEffect } from 'react';
import response from './linescore-gamePk-534196-response';
import scheduleResponse from './schedule-response';
import teamsResponse from './teams-response';
import './App.css';
import { LinescoreData, TeamsData, ScheduleResponse } from 'mlb-stats-api';

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

function checkForScores(setBoxscore: void) {
  // const interval = setInterval( function() {
  //   //do something
  // }
  // , 5000)
  // clearInterval();
}

enum Team {
  AwayTeam,
  HomeTeam
}

function extractLinescoreForTeam(linescore: any, teamsRes: any, team: Team): (number|string)[] {
  if (!linescore) {
    return emptyLinescoreArray();
  }
  let linescoreList: (number|string)[] = [];
  
  linescoreList.push(0);

  if (linescore.isTopInning !== undefined && teamsRes && teamsRes.teams.length > 0) {
    let teamId: number;
    if (linescore.isTopInning) {
      teamId = team === Team.HomeTeam ? linescore.defense.team.id : linescore.offense.team.id;
    } else {
      teamId = team === Team.AwayTeam ? linescore.defense.team.id : linescore.offense.team.id;
    }
    let teams: [any] = teamsRes.teams;
    linescoreList.push(teams.find((team) => team.id === teamId).abbreviation);
  }

  if (linescore.innings) {
    for (let i = 0; i < linescore.innings.length; i++) {
      linescoreList.push(team === Team.HomeTeam ? linescore.innings[i]["home"]["runs"] : linescore.innings[i]["away"]["runs"])
    }
  }

  for (let i = linescoreList.length - 1; i < 11; i++) {
    linescoreList.push("");
  }
  
  if (linescore.teams) {
    linescoreList.push(team === Team.HomeTeam ? linescore.teams.home.runs : linescore.teams.away.runs);
    linescoreList.push(team === Team.HomeTeam ? linescore.teams.home.hits : linescore.teams.away.hits);
    linescoreList.push(team === Team.HomeTeam ? linescore.teams.home.errors : linescore.teams.away.errors);
  }

  return linescoreList;
}

const soxTeamId = 111;

function emptyLinescoreArray() {
  return Array(15).fill("");
}

function App() {
  const MLBStatsAPI = require('mlb-stats-api');

  const [awayList, setAwayList] = React.useState<(string | number)[]>(emptyLinescoreArray());
  const [homeList, setHomeList] = React.useState<(string | number)[]>(emptyLinescoreArray());
  const [linescoreRes, setLinescoreRes] = React.useState<LinescoreData | undefined>();
  const [teamsRes, setTeamsRes] = React.useState<TeamsData | undefined>();
  const [scheduleRes, setScheduleRes] = React.useState<ScheduleResponse | undefined>();

  useEffect(() => {
    // get sox schedule for today
      // TODO: how frequently should we do this?
    // if there is a game today, get the game data
    // if that game is warmup or otherwise live, fill the data in. Otherwise leave the info from the cache
      // get player data for pitcher number
          // TODO: Figure out cache mechanics. Do we need to call this every time or wait until we don't hit on a lookup?
          // TODO: Should we keep a minimal copy locally aka only pitchers that have previously appeared in games? simple dict
      // get team abbreviations (already implemented)
        // TODO: Not sure this should be in that linescore function. Evaluate and split off as needed
      // Save the linescore data in a cache until the next game time
        // TODO: LocalStorage? useLocalState type thing (a component I built for something previously)?
    const mlbStats = new MLBStatsAPI();
    mlbStats.getGame({pathParams: {gamePk: 661316}}).then((res: any) => {
      console.log(res)// res.data
    });
    mlbStats.getGameLinescore({pathParams: {gamePk: 661316}}).then((res: any) => {
      setLinescoreRes(res.data);
    });
    // setLinescoreRes(response);
    setScheduleRes(scheduleResponse);
    setTeamsRes(teamsResponse);
  }, [setLinescoreRes, setScheduleRes, setTeamsRes, MLBStatsAPI]);

  useEffect(() => {
    setAwayList(extractLinescoreForTeam(linescoreRes, teamsRes, Team.AwayTeam));
    setHomeList(extractLinescoreForTeam(linescoreRes, teamsRes, Team.HomeTeam));
  }, [linescoreRes, setAwayList, setHomeList, teamsRes])

  // useEffect(() => {
  //   let newList = awayList;
  //   newList[1] = scheduleRes.dates[0].games[0].teams.away
  //   setAwayList()
  // }, [scheduleRes]);

  return (
    <div className="App">
      <div className="name">{text("FENWAY PARK")}</div>
      <div className="scores">
        {scoreboardRow()}
        {scoreboardRow(awayList)}
        {scoreboardRow(homeList)}
      </div>
    </div>
  );
}

export default App;
