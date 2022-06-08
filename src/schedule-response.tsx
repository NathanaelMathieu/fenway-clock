import MLBStatsAPI from 'mlb-stats-typescript-api';

const scheduleResponse: MLBStatsAPI.ScheduleRestObject = {
    "copyright" : "Copyright 2022 MLB Advanced Media, L.P.  Use of any content on this page acknowledges agreement to the terms posted here http://gdx.mlb.com/components/copyright.txt",
    "totalItems" : 1,
    "totalEvents" : 0,
    "totalGames" : 1,
    "totalGamesInProgress" : 1,
    "dates" : [ {
      "date" : "2022-04-10",
      "totalItems" : 1,
      "totalEvents" : 0,
      "totalGames" : 1,
      "totalGamesInProgress" : 1,
      "games" : [ {
        "gamePk" : 661316,
        "link" : "/api/v1.1/game/661316/feed/live",
        "gameType" : "R",
        "season" : "2022",
        "gameDate" : "2022-04-10T23:08:00Z",
        "officialDate" : "2022-04-10",
        "status" : {
          "abstractGameState" : "Live",
          "codedGameState" : "I",
          "detailedState" : "In Progress",
          "statusCode" : "I",
          "startTimeTBD" : false,
          "abstractGameCode" : "L"
        },
        "teams" : {
          "away" : {
            "leagueRecord" : {
              "wins" : 0,
              "losses" : 2,
              "pct" : ".000"
            },
            "score" : 2,
            "team" : {
              "id" : 111,
              "name" : "Boston Red Sox",
              "link" : "/api/v1/teams/111"
            },
            "splitSquad" : false,
            "seriesNumber" : 1
          },
          "home" : {
            "leagueRecord" : {
              "wins" : 2,
              "losses" : 0,
              "pct" : "1.000"
            },
            "score" : 0,
            "team" : {
              "id" : 147,
              "name" : "New York Yankees",
              "link" : "/api/v1/teams/147"
            },
            "splitSquad" : false,
            "seriesNumber" : 1
          }
        },
        "venue" : {
          "id" : 3313,
          "name" : "Yankee Stadium",
          "link" : "/api/v1/venues/3313"
        },
        "content" : {
          "link" : "/api/v1/game/661316/content"
        },
        "gameNumber" : 1,
        "publicFacing" : true,
        "doubleHeader" : "N",
        "gamedayType" : "P",
        "tiebreaker" : "N",
        "calendarEventID" : "14-661316-2022-04-10",
        "seasonDisplay" : "2022",
        "dayNight" : "night",
        "scheduledInnings" : 9,
        "reverseHomeAwayStatus" : false,
        "inningBreakLength" : 145,
        "gamesInSeries" : 3,
        "seriesGameNumber" : 3,
        "seriesDescription" : "Regular Season",
        "recordSource" : "S",
        "ifNecessary" : "N",
        "ifNecessaryDescription" : "Normal Game"
      } ],
      "events" : [ ]
    } ]
  };

  export default scheduleResponse;