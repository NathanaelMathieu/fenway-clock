declare module 'mlb-stats-api' {

    type MLBStatsAPI = {
        new (): MLBStatsAPI;
        getGame(queryParams: GameQueryParams): Promise<{data: GameData}>;
        getGameLinescore(queryParams: LinescoreQueryParams): Promise<{data: LinescoreData}>;
        getTeams(queryParams: TeamsQueryParams): Promise<{data: TeamsData}>;
    }

    export interface GameQueryParams {
        pathParams: {
            gamePk: number,
            timecode?: string;
            hydration?: string[];
            fields?: string[];
        }
    }

    export interface TeamsQueryParams {
        pathParams: {
            season?: string;
            activeStatus?: string;
            allStarStatuses?: string;
            leagueIds?: string;
            sportIds?: string;
            gameType?: string;
            hydrate?: string[];
            fields?: string[];
        }
    }

    export interface LinescoreQueryParams {
        pathParams: {
            gamePk: number;
            timecode?: string;
            fields?: string[];
        }
    }

    export interface LiveGameData {
        copyright: string;
        gamePk: number;
        link: string;
        metaData: MetaData;
        gameData: GameData;
        liveData: LiveData;
      }

      export interface MetaData {
        wait: number;
        timeStamp: string;
        gameEvents?: (string)[] | null;
        logicalEvents?: (string)[] | null;
      }

      export interface ProbablePitchers {
        away: Player;
        home: Player;
        }

      export interface Datetime {
        dateTime: string;
        originalDate: string;
        officialDate: string;
        dayNight: string;
        time: string;
        ampm: string;
      }
      export interface GameStatus {
        abstractGameState: string;
        codedGameState: string;
        detailedState: string;
        statusCode: string;
        startTimeTBD: boolean;
        abstractGameCode: string;
      }

      export interface OfficialScorer {
          id: number;
          fullName: string;
          link: string;
      }

      export interface PrimaryDatacaster {
          id: number;
          fullName: string;
          link: string;
      }

    export interface Venue {
        id: number;
        name?: string;
        link: string;
    }

    export interface League {
        id?: number;
        name?: string;
        link: string;
        abbreviation?: string;
    }

    export interface Division {
        id: number;
        name: string;
        link: string;
    }

    export interface Sport {
        id: number;
        link: string;
        name: string;
    }

    export interface  Team {
        allStarStatus?: string;
        id: number;
        name: string;
        link: string;
        season?: number;
        venue?: Venue;
        teamCode?: string;
        fileCode?: string;
        abbreviation?: string;
        teamName?: string;
        locationName?: string;
        firstYearOfPlay?: string;
        league?: League;
        division?: Division;
        sport?: Sport;
        shortName?: string;
        parentOrgName?: string;
        parentOrgId?: number;
        franchiseName?: string;
        clubName?: string;
        active?: boolean;
        springLeague?: League;
        springVenue?: Venue;
    }

    export interface TeamsData {
        copyright: string;
        teams: Team[];
    }

    
    export interface TeamGameResults {
        runs: number;
        hits: number;
        errors: number;
        leftOnBase: number;
    }

    export interface Innings {
        num: number;
        ordinalNum: string;
        home: TeamGameResults;
        away: TeamGameResults;
    }

    export interface Teams {
        home: Home;
        away: Away;
    }

    export interface Player {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Defense {
        pitcher: Player;
        catcher: Player;
        first: Player;
        second: Player;
        third: Player;
        shortstop: Player;
        left: Player;
        center: Player;
        right: Player;
        batter: Player;
        onDeck: Player;
        inHole: Player;
        battingOrder: number;
        team: Team;
    }

    export interface Offense {
        batter: Player;
        onDeck: Player;
        inHole: Player;
        first: Player;
        pitcher: Player;
        battingOrder: number;
        team: Team;
    }

    export interface LinescoreData {
        copyright: string;
        currentInning: number;
        currentInningOrdinal: string;
        inningState: string;
        inningHalf: string;
        isTopInning: boolean;
        scheduledInnings: number;
        innings: Innings[];
        teams: Teams;
        defense: Defense;
        offense: Offense;
        balls: number;
        strikes: number;
        outs: number;
    }

    export interface GameStatus {
        abstractGameState: string;
        codedGameState: string;
        detailedState: string;
        statusCode: string;
        startTimeTBD: boolean;
        abstractGameCode: string;
    }

    export interface LeagueRecord {
        wins: number;
        losses: number;
        pct: string;
    }

    export interface LinescoreTeam {
        leagueRecord: LeagueRecord;
        score: number;
        team: Team;
        splitSquad: boolean;
        seriesNumber: number;
    }

    export interface Venue {
        id: number;
        name: string;
        link: string;
    }

    export interface Content {
        link: string;
    }

    export interface GameData {
        gamePk: number;
        link: string;
        gameType: string;
        season: string;
        gameDate: string;
        officialDate: string;
        status: GameStatus;
        teams: Teams;
        venue: Venue;
        content: Content;
        gameNumber: number;
        publicFacing: boolean;
        doubleHeader: string;
        gamedayType: string;
        tiebreaker: string;
        calendarEventID: string;
        seasonDisplay: string;
        dayNight: string;
        scheduledInnings: number;
        reverseHomeAwayStatus: boolean;
        inningBreakLength: number;
        gamesInSeries: number;
        seriesGameNumber: number;
        seriesDescription: string;
        recordSource: string;
        ifNecessary: string;
        ifNecessaryDescription: string;
        game: GameData;
        datetime: Datetime;
        status: GameStatus;
        teams: Teams;
        players: Player[];
        venue: Venue;
        officialVenue?: Venue;
        weather?: Weather;
        gameInfo?: GameInfo;
        review?: Review;
        flags?: Flags;
        alerts?: any[];
        probablePitchers?: ProbablePitchers;
        officialScorer?: OfficialScorer;
        primaryDatacaster?: PrimaryDatacaster;
    }

    export interface Weather {
        condition: string;
        temp: string;
        wind: string;
    }

    export interface GameInfo {
        attendance: number;
        firstPitch: string;
        gameDurationMinutes: number;
    }

    export interface Review {
        hasChallenges: boolean;
        away: {used: number, remaining: number};
        home: {used: number, remaining: number};
    }

    export interface Flags {
        noHitter: boolean;
        perfectGame: boolean;
        awayTeamNoHitter: boolean;
        awayTeamPerfectGame: boolean;
        homeTeamNoHitter: boolean;
        homeTeamPerfectGame: boolean;
    }

    export interface ScheduleDate {
        date: string;
        totalItems: number;
        totalEvents: number;
        totalGames: number;
        totalGamesInProgress: number;
        games: Game[];
        events: any[];
    }

    export interface ScheduleResponse {
        copyright: string;
        totalItems: number;
        totalEvents: number;
        totalGames: number;
        totalGamesInProgress: number;
        dates: ScheduleDate[];
    }
}