import React, { useEffect } from 'react';
import teamsResponse from './teams-response';
import './App.css';
import { GameAPI, TeamAPI, ScheduleAPI } from 'mlb-stats-typescript-api';

const text = (t: string|number) => <p>{t}</p>;

function createScoreboardRow(linescore?: MinimalLinescore, currentInning?: number) {
  if (!linescore) {
    return scoreboardRowCreateJSX(["P","",1,2,3,4,5,6,7,8,9,10,"R","H","E"]);
  }
  
  let innings: (string|number)[] = [];
  if (linescore.innings) {
    // When past the 10th inning, the 11th goes in the 1 spot. So, we mod by 10 and take a slice from the back
    innings = linescore.innings.slice(-((currentInning ?? 0) % 10));
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
  ]);
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

function scoreboardRowCreateJSX(data: ScoreboardRowData, currentInning?: number) {
  const teamAbbreviation = data[1] ?? "";
  let cardClasses = "card ";
  const teamClasses = teamAbbreviation === "BOSTON" || teamAbbreviation.length === 0 ? cardClasses : cardClasses + "visitor-team ";
  if (teamAbbreviation.length !== 0) cardClasses = cardClasses + "inset ";
  let indexToTurnYellow = 0;
  // The active inning should show as blank unless there is a score, in which case it should be yellow
  if (currentInning) {
    indexToTurnYellow = currentInning % 10 + 1;
    // The mod 10 handles more than 10 innings
  }
  
  return (
    <>
    <div id={teamAbbreviation} className={"scoreboardRow"}>
      <div id="player-number" className={cardClasses}>{text(data[0] ?? "P")}</div>
      <div className={teamClasses} id="team-name">{text(teamAbbreviation)}</div>
      <div className="inning-group">
        {/** TODO: Make this work, turn the correct numbers yellow */}
        {data.slice(2,5).map(d => {
          let id = "inning";
          if (d && d === indexToTurnYellow) {
            id.concat(" active")
          }
          return <div className={cardClasses} id={id}>{text(d ?? "")}</div>;
        })}
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(data[5] ?? "")}</div>
        <div className={cardClasses} id="inning">{text(data[6] ?? "")}</div>
        <div className={cardClasses} id="inning">{text(data[7] ?? "")}</div>
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(data[8] ?? "")}</div>
        <div className={cardClasses} id="inning">{text(data[9] ?? "")}</div>
        <div className={cardClasses} id="inning">{text(data[10] ?? "")}</div>
      </div>
      <div className="inning-group">
        <div className={cardClasses} id="inning">{text(data[11] ?? "")}</div>
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
  const away: MinimalLinescore = {innings: []};
  const home: MinimalLinescore = {innings: []};
  
  // TODO: Get pitcher number
  away.pitcher = 0;
  home.pitcher = 0;

  if (teamsRes && teamsRes.teams && teamsRes.teams.length > 0) {
    const getAbbreviation = (teamId: number) => teamsRes.teams?.find((team: any) => team.id === teamId)?.abbreviation;
    away.teamAbbreviation = getAbbreviation(linescoreRes.defense?.team?.id ?? 0) ?? "";
    home.teamAbbreviation = getAbbreviation(linescoreRes.offense?.team?.id ?? 0) ?? "";
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

const soxTeamId = 133; // Athletics
// const soxTeamId = 111;

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
        {(linescores.away && linescores.home) ? <> {createScoreboardRow(linescores.away, linescores.currentInning)} {createScoreboardRow(linescores.home, linescores.currentInning)} </> : <div className='errorLinescore'> Error: No Linescore Data </div> }
      </div>
    </div>
  );
}

export default App;
