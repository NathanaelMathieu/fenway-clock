import React, { useCallback, useEffect } from 'react';
import useInterval from 'use-interval';
import teamsResponse from './teams-response';
import './App.css';
import MLBStatsAPI from 'mlb-stats-typescript-api';

const text = (t: string|number) => <p>{t}</p>;

function createScoreboardRow(pitcherNumber?: number, linescore?: MinimalLinescore, currentInning?: number, teamIsUp?: boolean) {
  if (!linescore) {
    return scoreboardRowCreateJSX(["P","",1,2,3,4,5,6,7,8,9,10,"R","H","E"]);
  }
  
  let innings: (string|number)[] = [];
  if (linescore.innings) {
    // When past the 10th inning, the 11th goes in the 1 spot. So, we mod by 10 and take a slice from the back
    innings = linescore.innings.slice(-((currentInning ?? 0) % 10 - (linescore.home && !teamIsUp ? 1 : 0)));
  }

  return scoreboardRowCreateJSX([
    pitcherNumber ?? 0,
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

  // TODO: seems to have false positive if game is over and home team scored in last inning. See BOS/BAL 2nd game of 2022/05/28
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

function extractLinescores(currentLinescores: Linescores, linescoreRes: MLBStatsAPI.Linescore, teamsRes: MLBStatsAPI.TeamsRestObject): Linescores {
  const away: MinimalLinescore = currentLinescores.away ? currentLinescores.away : {innings: [], home: false};
  const home: MinimalLinescore = currentLinescores.home ? currentLinescores.home : {innings: [], home: true};

  if ((!away.teamAbbreviation || !home.teamAbbreviation) && teamsRes && teamsRes.teams && teamsRes.teams.length > 0) {
    const getAbbreviation = (teamId: number) => teamsRes.teams?.find((team: any) => team.id === teamId)?.abbreviation;
    const defenseTeam = getAbbreviation(linescoreRes.defense?.team?.id ?? 0) ?? "";
    const offenseTeam = getAbbreviation(linescoreRes.offense?.team?.id ?? 0) ?? ""
    away.teamAbbreviation = (linescoreRes.isTopInning ?? true) ? offenseTeam : defenseTeam; // Default is home team, top of inning
    home.teamAbbreviation = (linescoreRes.isTopInning ?? true) ? defenseTeam : offenseTeam;
  }
  if (linescoreRes.innings && linescoreRes.currentInning && away.innings && home.innings) {
    if (linescoreRes.currentInning > away.innings.length) {
      for (let i = away.innings?.length; i < linescoreRes.currentInning; i++) {
        away.innings?.push(linescoreRes.innings[i].away?.runs ?? 0);
      }
    }
    if (home.innings.length < linescoreRes.currentInning - 1 || (linescoreRes.isTopInning !== undefined && !linescoreRes.isTopInning && home.innings.length < linescoreRes.currentInning)) {
      for (let i = home.innings?.length; i < linescoreRes.currentInning; i++) {
        home.innings?.push(linescoreRes.innings[i].home?.runs ?? 0);
      }    
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

/**
 * Currently this considers pregame games to be live. They often are in pregame for several hours before the game.
 * @param {MLBStatsAPI.ScheduleRestObject} res
 * @returns {number}
 */
 function getLiveGamePk(res: MLBStatsAPI.ScheduleRestObject) : {gamePk?: number, statusCode?: string} {
  if (res.dates && res.dates.length > 0 && res.dates[0].games) {
    for (let i = res.dates[0].games.length - 1; i >= 0; i--) {
      const game = res.dates[0].games[i];
      if (game.status && game.status.statusCode && game.status.statusCode !== "S") {
        return {gamePk: game.gamePk, statusCode: game.status.statusCode};
      }
    }
  }
  return {};
}

/**
 * Currently this considers pregame games to be live. They often are in pregame for several hours before the game.
 * @param {MLBStatsAPI.ScheduleRestObject} res
 * @returns {number}
 */
function getGameStatus(game: MLBStatsAPI.ScheduleRestGameObject) : string | undefined {
  if (game.status && game.status.statusCode) {
    return game.status.statusCode;
  }
}

// const SOX_TEAM_ID = 133; // Athletics
const SOX_TEAM_ID = 111;
const API_DELAY = 5000;

function App() {
  const [gameDate, setGameDate] = React.useState<Date>(new Date());
  const [currentGame, setCurrentGame] = React.useState<MLBStatsAPI.ScheduleRestGameObject | undefined>();
  const [gameLive, setGameLive] = React.useState(false);
  const [apiCounter, setApiCounter] = React.useState<number>(0);
  const [linescores, setLinescores] = React.useState<Linescores>({});
  const [teamsRes, setTeamsRes] = React.useState<MLBStatsAPI.TeamsRestObject | undefined>();
  const [activeGamePk, setActiveGamePk] = React.useState<number | undefined>();
  const [homePitcherId, setHomePitcherId] = React.useState<number | undefined>();
  const [awayPitcherId, setAwayPitcherId] = React.useState<number | undefined>();
  const [homePitcherNumber, setHomePitcherNumber] = React.useState<number | undefined>();
  const [awayPitcherNumber, setAwayPitcherNumber] = React.useState<number | undefined>();
  const [isTopInning, setIsTopInning] = React.useState<boolean>();
  const [delay, setDelay] = React.useState<number>(API_DELAY);

  useEffect(() => {
    const dateString = gameDate.getFullYear() + "-" + (gameDate.getMonth() + 1) + "-" + (gameDate.getDate());
    // const dateString = "2022-5-28";
    setTeamsRes(teamsResponse);
    MLBStatsAPI.ScheduleService.schedule(1, undefined, {teamId: SOX_TEAM_ID, date: dateString, fields: ["dates", "date", "games", "gamePk", "status", "statusCode"]}).then((res) => {
      const {gamePk, statusCode} = getLiveGamePk(res);
      if (!gamePk) {
        const newDate = new Date(gameDate);
        newDate.setDate(newDate.getDate() - 1)
        setGameDate(newDate);
      } else {
        setActiveGamePk(gamePk);
      }
    });
  }, [gameDate]);

  useInterval(() => {
    if (activeGamePk) {
      MLBStatsAPI.GameService.liveGameV1(activeGamePk, {fields: ["gameDate", "status", "statusCode"]}).then((res) => {
        console.log(res);
      });
    }
    if (activeGamePk && teamsRes) {
      MLBStatsAPI.GameService.linescore(activeGamePk, { fields: ["innings", "currentInning", "isTopInning", "home", "away", "runs", "hits", "errors", "defense", "offense", "team", "teams", "id", "pitcher"] }).then((res: MLBStatsAPI.Linescore) => {
        if (res.isTopInning !== undefined) {
          setIsTopInning(res.isTopInning);
        }
        if (res.defense?.pitcher?.id) {
          if (res.isTopInning) {
            setHomePitcherId(res.defense.pitcher.id);
          } else {
            setAwayPitcherId(res.defense.pitcher.id);
          }
        }
        if (res.offense?.pitcher?.id) {
          if (res.isTopInning) {
            setAwayPitcherId(res.offense.pitcher.id);
          } else {
            setHomePitcherId(res.offense.pitcher.id);
          }
        }
        setLinescores(extractLinescores(linescores, res, teamsRes));
      });
    }
  }, delay, true);

  useEffect(() => {
    if (awayPitcherId) {
      MLBStatsAPI.PeopleService.GetPeople(awayPitcherId, {fields: ["people", "primaryNumber"]}).then((res) => {
        if (res.people && res.people[0] && res.people[0].primaryNumber) {
          setAwayPitcherNumber(res.people[0].primaryNumber);
        }
      });
    }
  }, [awayPitcherId])

  useEffect(() => {
    if (homePitcherId) {
      MLBStatsAPI.PeopleService.GetPeople(homePitcherId, {fields: ["people", "primaryNumber"]}).then((res) => {
        if (res.people && res.people[0] && res.people[0].primaryNumber) {
          setHomePitcherNumber(res.people[0].primaryNumber);
        }
      });
    }
  }, [homePitcherId])

  return (
    <div className="App">
      <div className="name">{text("FENWAY PARK")}</div>
      <div className="scores">
        {createScoreboardRow()}
        {(linescores.away && linescores.home) ? <> {createScoreboardRow(awayPitcherNumber, linescores.away, linescores.currentInning, linescores.isTopInning)} {createScoreboardRow(homePitcherNumber, linescores.home, linescores.currentInning, !linescores.isTopInning)} </> : <div className='errorLinescore'> Loading... </div> }
      </div>
    </div>
  );
}

export default App;
