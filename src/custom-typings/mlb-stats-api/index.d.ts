declare module 'mlb-stats-api' {

    export interface Venue {
        id: number;
        name: string;
        link: string;
    }

    export interface League {
        id?: number;
        name?: string;
        link: string;
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

    export interface SpringLeague {
        id: number;
        name: string;
        link: string;
        abbreviation: string;
    }

    export interface SpringVenue {
        id: number;
        link: string;
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
        springLeague?: SpringLeague;
        springVenue?: SpringVenue;
    }

    export interface TeamsResponse {
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

    export interface Pitcher {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Catcher {
        id: number;
        fullName: string;
        link: string;
    }

    export interface First {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Second {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Third {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Shortstop {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Left {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Center {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Right {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Batter {
        id: number;
        fullName: string;
        link: string;
    }

    export interface OnDeck {
        id: number;
        fullName: string;
        link: string;
    }

    export interface InHole {
        id: number;
        fullName: string;
        link: string;
    }

    export interface Defense {
        pitcher: Pitcher;
        catcher: Catcher;
        first: First;
        second: Second;
        third: Third;
        shortstop: Shortstop;
        left: Left;
        center: Center;
        right: Right;
        batter: Batter;
        onDeck: OnDeck;
        inHole: InHole;
        battingOrder: number;
        team: Team;
    }

    export interface Offense {
        batter: Batter;
        onDeck: OnDeck;
        inHole: InHole;
        first: First;
        pitcher: Pitcher;
        battingOrder: number;
        team: Team;
    }

    export interface LinescoreResponse {
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

    export interface Status {
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

    export interface Teams {
        away: Away;
        home: Home;
    }

    export interface Venue {
        id: number;
        name: string;
        link: string;
    }

    export interface Content {
        link: string;
    }

    export interface Game {
        gamePk: number;
        link: string;
        gameType: string;
        season: string;
        gameDate: string;
        officialDate: string;
        status: Status;
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