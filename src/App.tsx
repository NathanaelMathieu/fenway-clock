import React, { useEffect } from 'react';
import teamsResponse from './teams-response';
import './App.css';
import { GameAPI, TeamAPI, ScheduleAPI } from 'mlb-stats-typescript-api';

const text = (t: string|number) => <p>{t}</p>;

function createScoreboardRow(linescore?: MinimalLinescore, currentInning?: number, teamIsUp?: boolean) {
  if (!linescore) {
    return scoreboardRowCreateJSX(["P","",1,2,3,4,5,6,7,8,9,10,"R","H","E"]);
  }
  
  let innings: (string|number)[] = [];
  if (linescore.innings) {
    // When past the 10th inning, the 11th goes in the 1 spot. So, we mod by 10 and take a slice from the back
    innings = linescore.innings.slice(-((currentInning ?? 0) % 10 - (linescore.home && !teamIsUp ? 1 : 0)));
  }

  return scoreboardRowCreateJSX([
    linescore.pitcher ?? 0,
    linescore.teamAbbreviation === "BOS" ? "BOSTON" : linescore.teamAbbreviation,
    innings[0],
    innings[1],
    innings[2],
    innings[3],
    innings[4],
    innings[5],
    innings[6],
    innings[7],
    innings[8],
    innings[9],
    linescore.runs ?? 0,
    linescore.hits ?? 0,
    linescore.errors ?? 0,
  ], currentInning, teamIsUp);
}

type ScoreboardRowData = [
  (string|number),
  string?, 
  (string|number)?,
  (string|number)?,
  (string|number)?,
  (string|number)?, 
  (string|number)?,
  (string|number)?,
  (string|number)?, 
  (string|number)?,
  (string|number)?,
  (string|number)?,
  (string|number)?,
  (string|number)?,
  (string|number)?,
];

function scoreboardRowCreateJSX(data: ScoreboardRowData, currentInning?: number, teamIsUp?: boolean) {
  const teamAbbreviation = data[1] ?? "";
  let cardClasses = "card ";
  const teamClasses = (teamAbbreviation === "BOSTON" || teamAbbreviation.length === 0) ? cardClasses : cardClasses + "visitor-team ";
  if (teamAbbreviation.length !== 0) {
    cardClasses = cardClasses + "inset ";
  }
  let indexToTurnYellow = -1;
  // The active inning should show as blank unless there is a score, in which case it should be yellow
  if (currentInning) {
    // Handles more than 10 innings
    indexToTurnYellow = currentInning % 10 - 1;
  }
  const colorCard = (score?: (number|string), i?: number) => {
    let classes = cardClasses;
    if ((i ?? -1) === indexToTurnYellow && teamIsUp && score && score > 0) {
      classes = classes + "active ";
    }
    return  <div className={classes} id="inning">{text(score ?? "")}</div>;
  };
  const inningCards: JSX.Element[] = data.slice(2, 12).map(colorCard);
  return (
    <>
    <div id={teamAbbreviation} className={"scoreboardRow"}>
      <div id="player-number" className={cardClasses}>{text(data[0] ?? "P")}</div>
      <div className={teamClasses} id="team-name">{text(teamAbbreviation)}</div>
      <div className="inning-group">
        {inningCards.slice(0,3)}
      </div>
      <div className="inning-group">
        {inningCards.slice(3,6)}
      </div>
      <div className="inning-group">
        {inningCards.slice(6,9)}
      </div>
      <div className="inning-group">
        {inningCards.slice(9,10)}
      </div>
      <div className="rhe-group">
        <div className={cardClasses} id="rhe">{text(data[12] ?? "")}</div>
        <div className={cardClasses} id="rhe">{text(data[13] ?? "")}</div>
        <div className={cardClasses} id="rhe">{text(data[14] ?? "")}</div>
      </div>
    </div>
    </>
  );
}

type MinimalLinescore = {
  home: boolean,
  pitcher?: number,
  teamAbbreviation?: string,
  innings?: number[],
  runs?: number,
  hits?: number,
  errors?: number,
}

type Linescores = {
  home?: MinimalLinescore,
  away?: MinimalLinescore,
  currentInning?: number,
  isTopInning?: boolean,
};

function extractLinescores(linescoreRes: GameAPI.Linescore, teamsRes: TeamAPI.TeamsRestObject): Linescores {
  const away: MinimalLinescore = {innings: [], home: false};
  const home: MinimalLinescore = {innings: [], home: true};
  
  // TODO: Get pitcher number
  away.pitcher = 0;
  home.pitcher = 0;

  if (teamsRes && teamsRes.teams && teamsRes.teams.length > 0) {
    const getAbbreviation = (teamId: number) => teamsRes.teams?.find((team: any) => team.id === teamId)?.abbreviation;
    const defenseTeam = getAbbreviation(linescoreRes.defense?.team?.id ?? 0) ?? "";
    const offenseTeam = getAbbreviation(linescoreRes.offense?.team?.id ?? 0) ?? ""
    away.teamAbbreviation = (linescoreRes.isTopInning ?? true) ? offenseTeam : defenseTeam; // Default is home team, top of inning
    home.teamAbbreviation = (linescoreRes.isTopInning ?? false) ? defenseTeam : offenseTeam;
  }
  if (linescoreRes.innings) {
    for (let i = 0; i < linescoreRes.innings.length; i++) {
      away.innings?.push(linescoreRes.innings[i].away?.runs ?? 0);
      home.innings?.push(linescoreRes.innings[i].home?.runs ?? 0);
    }
  }
  
  if (linescoreRes.teams) {
    away.hits = linescoreRes.teams.away?.hits ?? 0;
    away.runs = linescoreRes.teams.away?.runs ?? 0;
    away.errors = linescoreRes.teams.away?.errors ?? 0;
    home.hits = linescoreRes.teams.home?.hits ?? 0;
    home.runs = linescoreRes.teams.home?.runs ?? 0;
    home.errors = linescoreRes.teams.home?.errors ?? 0;
  }

  return {
    away: away,
    home: home, 
    currentInning: linescoreRes.currentInning ?? 0,
    isTopInning: linescoreRes.isTopInning ?? false,
  };
}

// const soxTeamId = 133; // Athletics
const soxTeamId = 111;

function App() {
  const [linescores, setLinescores] = React.useState<Linescores>({});
  const [linescoreRes, setLinescoreRes] = React.useState<GameAPI.Linescore | undefined>();
  const [teamsRes, setTeamsRes] = React.useState<TeamAPI.TeamsRestObject | undefined>();
  const [scheduleRes, setScheduleRes] = React.useState<ScheduleAPI.ScheduleRestObject | undefined>();

  useEffect(() => {
    // TODO: If no game today, load the most recent game. Add a date param or startDate/endDate
    ScheduleAPI.ScheduleService.schedule(1, undefined, {teamId: soxTeamId}).then((res) => {
      setScheduleRes(res);
    });
    // TODO: Cache this in storage, also do an actual call
    setTeamsRes(teamsResponse);
  }, []);

  useEffect(() => {
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
      setLinescores(extractLinescores(linescoreRes, teamsRes));
    }
  }, [linescoreRes, teamsRes, setLinescores]);

  return (
    <div className="App">
      <div className="name">{text("FENWAY PARK")}</div>
      <div className="scores">
        {createScoreboardRow()}
        {(linescores.away && linescores.home && linescores.currentInning && linescores.isTopInning !== undefined) ? <> {createScoreboardRow(linescores.away, linescores.currentInning, linescores.isTopInning)} {createScoreboardRow(linescores.home, linescores.currentInning, !linescores.isTopInning)} </> : <div className='errorLinescore'> Error: No Linescore Data </div> }
      </div>
    </div>
  );
}

export default App;
