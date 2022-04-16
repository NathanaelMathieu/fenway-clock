
declare module 'mlb-stats-api' {
    type GenGameOperations = import("./generated-types/game").operations;

    type GamePathParams = GenGameOperations["liveGameV1"]["parameters"]["path"];
    type GameParams = GenGameOperations["liveGameV1"]["parameters"]["query"];
    type GameDataResponse = GenGameOperations["liveGameV1"]["responses"]["200"]["content"]["application/json;charset=UTF-8"];

    type GameDiffPatchPathParams = GenGameOperations["liveGameDiffPatchV1"]["parameters"]["path"];
    type GameDiffPatchDataResponse = GenGameOperations["liveGameDiffPatchV1"]["responses"]["200"]["content"]["application/json;charset=UTF-8"];

    type GameTimestampv11PathParams = GenGameOperations["liveTimestampv11"]["parameters"]["path"];
    type GameParams = GenGameOperations["liveTimestampv11"]["query"];
    type GameDataResponse = GenGameOperations["liveTimestampv11"]["responses"]["200"]["content"]["application/json;charset=UTF-8"];

    type GameLinescorePathParams = GenGameOperations["linescore"]["parameters"]["path"];
    type GameLinescoreParams = GenGameOperations["linescore"]["query"];
    type GameLinescoreDataResponse = GenGameOperations["linescore"]["responses"]["200"]["content"]["application/json;charset=UTF-8"];

    type GamePlayByPlayPathParams = GenGameOperations["liveGameV1"]["parameters"]["path"];
    type GamePlayByPlayParams = GenGameOperations["liveGameV1"]["query"];
    type GamePlayByPlayDataResponse = GenGameOperations["liveGameV1"]["responses"]["200"]["content"]["application/json;charset=UTF-8"];
    
    type TeamsDataResponse = any;
    type ScheduleDataResponse = any;

    // type GamePathParams = GenGameOperations["liveGameV1"]["parameters"]["path"];
    // type GameParams = GenGameOperations["liveGameV1"]["query"];
    // type GameDataResponse = GenGameOperations["liveGameV1"]["responses"]["200"]["content"]["application/json;charset=UTF-8"];

    interface MLBStatsAPI {
        new (): MLBStatsAPI;

        /**
         * **Description:**
         * This endpoint returns the Gumbo Live Feed for a specific gamePk.
         *
         * **Return Includes:** Team information, live play by play data, and player information.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * **Hydrations:** This endpoint can accept the hydrations query parameter.
         *
         * <br></br>
         *
         * ---
         * **Example of call with required parameters:**
         *
         * https://statsapi.mlb.com/api/v1.1/game/534196/feed/live
         *
         * ---
         * **Example of call with all parameters:**
         *
         * https://statsapi.mlb.com/api/v1.1/game/534196/feed/live?timecode=20180323_014415&hydrate=alignment
         */
        getGame(queryParams: {pathParams: GamePathParams, params?: GameParams}): Promise<{data: GameDataResponse}>;

        /**
         * **Description:**
         * This endpoint returns the difference/discrepancies between two timecodes in the Gumbo Live Feed using the Diff Patch System.
         *
         * **Return Includes:** Play by play data and player information.
         * <br/><br/><b>Diff/Patch
         * System:</b> startTimecode and endTimecode can be used for getting
         * diffs.<br/>Expected usage:  <br/> 1) Request full payload by not passing
         * startTimecode or endTimecode.  This will return the most recent game
         * state.<br/> 2) Find the latest timecode in this response.  <br/> 3) Wait
         * X seconds<br/> 4) Use the timecode from step 2 above as the startTimecode.  This
         * will give you a diff of everything that has happened since
         * startTimecode.  <br/> 5) If no data is returned, wait X seconds and do
         * the same request.  <br/> 6) If data is returned, get a new timeStamp
         * from the response, and use that for the next call as startTimecode.
         * <br></br>
         * **Required Parameters:** all parameters are required to run this call. If incorrectly called the call will default to http://statsapi.mlb.com/api/v1.1/game/531304/feed/live
         * <br></br>
         *
         * ---
         * **Example of call with required parameters:**
         *
         * http://statsapi.mlb.com/api/v1.1/game/531321/feed/live/diffPatch?startTimecode=20180823_193704&endTimecode=20180823_193711
         */

         getGameDiffPatch(queryParams: {pathParams: GameDiffPatchPathParams}): Promise<{data: GameDiffPatchDataResponse}>;
        /**
         * **Description:**
         * This endpoint returns timecodes for a specific gamePk.
         *
         * **Return Includes:** timecodes.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters:**
         *
         * https://statsapi.mlb.com/api/v1.1/game/531060/feed/live/timestamps
         */
         getGameTimestampv11(queryParams: {pathParams: GenGameOperations["liveTimestampv11"]["parameters"]["path"]}): Promise<{data: GenGameOperations["liveTimestampv11"]["responses"]["200"]["content"]["application/json;charset=UTF-8"]}>;
         
        /**
         * **Description:**
         * This endpoint returns a directory of games with non Statcast data corrections. These changes include, scoring/pitching decisions,etc...
         *
         * **Return Includes:** biographical information.
         *
         * **Required Parameters:** updatedSince.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/changes?sportId=1&updatedSince=2020-03-17T15:34:43
         */
         getGameChanges(queryParams: {pathParams: GenGameOperations["traditionalChanges"]["parameters"]["path"], params?: GenGameOperations["traditionalChanges"]["query"]}): Promise<{data: GenGameOperations["traditionalChanges"]["responses"]["200"]["content"]["application/json;charset=UTF-8"]}>;

        /**
         * **Description:**
         * This endpoint returns timestamps reflecting the most recent data corrections made to games. This return is limited to 1000 objects.
         *
         * **Return Includes:** timestamps.
         *
         * **Required Parameters:** No parameters are required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * http://statsapi.mlb.com/api/v1/analytics/game
         *
         * ---
         *
         * **Example of call with all parameters**
         *
         * http://statsapi.mlb.com/api/v1/analytics/game?lastMetricsUpdatedTime=2019-01-04T00:00:00.007380Z&gameModeId=2&limit=1
         */
            getGameTimestamps(queryParams: {pathParams: GenGameOperations["colortimecodes"]["parameters"]["path"], params?: GenGameOperations["colortimecodes"]["query"]}): Promise<{data: GenGameOperations["colortimecodes"]["responses"]["200"]["content"]["application/json;charset=UTF-8"]}>;

            /**
             * **Description:**
             * This endpoint returns timestamps reflecting the most recent data corrections made to GUIDS. This return is limited to 1000 objects.
             *
             * **Return Includes:** timestamps.
             *
             * **Required Parameters:** No parameters are required to run this call.
             *
             * ---
             * **Example of call with required parameters**
             *
             * http://statsapi.mlb.com/api/v1/analytics/guids
             *
             * ---
             *
             * **Example of call with all parameters**
             *
             * http://statsapi.mlb.com/api/v1/analytics/guids?lastMetricsUpdatedTime=2019-01-04T00:00:00.007380Z&gameModeId=2&sortBy=lastMetricsUpdatedTime&limit=1
             */
            //  getGameContextMetrics(queryParams: {pathParams: GenGameOperations["updateGameGuids"]["parameters"]["path"], params?: GenGameOperations["updateGameGuids"]["query"]}): Promise<{data: GenGameOperations["updateStatcastGames"]["responses"]["200"]["content"]["application/json;charset=UTF-8"]}>;

        /**
         * **Description:**
         * This endpoint returns Statcast data forall plays in a specific game.
         *
         * **Return Includes:** timestamps.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/566685/guids?
         *
         * ---
         *
         * **Call with all parameters**
         *
         * http://statsapi.mlb.com/api/v1/game/566685/guids?lastUpdatedTime=2019-05-13T14:15:14.005620Z&gameModeId=2&isPitch=true&isHit=true&isPickoff=false&hydrate=analytics(result,hit,pitch,metrics,video,metaData)
         */
        // getGameStatcastData(queryParams: {pathParams: GenGameOperations["updateGameGuids"]["parameters"]["path"], params?: GenGameOperations["updateGameGuids"]["query"]}): Promise<{data: GenGameOperations["updateStatcastGames"]["responses"]["200"]["content"]["application/json;charset=UTF-8"]}>;

            /**
             * **Description:**
             * This endpoint returns Statcast data for a specific play. Video is only available for MLB in this endpoint.
             *
             * **Return Includes:** timestamps.
             *
             * **Required Parameters:** gamePk and GUID are required to run this call.
             *
             * ---
             * **Example of call with required parameters**
             *
             * https://statsapi.mlb.com/api/v1/game/567434/621dc1d1-aa75-4aed-b449-403bd4bcd3fa/analytics
             *
             * ---
             *
             * **Example of call with hydration parameters**
             *
             * https://statsapi.mlb.com/api/v1/game/567434/621dc1d1-aa75-4aed-b449-403bd4bcd3fa/analytics?hydrate=hydrations,analytics(ball,metrics,video,positions,diagram,contextMetrics)
             */
        // getGameStatcastDataForPlay(queryParams: {pathParams: GenGameOperations["updateGameGuids"]["parameters"]["path"], params?: GenGameOperations["updateGameGuids"]["query"]}): Promise<{data: GenGameOperations["updateStatcastGames"]["responses"]["200"]["content"]["application/json;charset=UTF-8"]}>;


        /**
         * **Description:**
         * This endpoint returns links for skeletalData for specific play.
         *
         * **Return Includes:** skeletalData.
         *
         * **Required Parameters:** gamePk and GUID are required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/631105/b030086b-cc1e-4842-8941-def2c5c4d94f/analytics/skeletalData/files
         */
        

        /**
         * **Description:**
         * This endpoint returns Context Metrics for a specific gamePk.
         *
         * **Return Includes:** Context Metircs, team information, venue information.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters:**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/contextMetrics
         *
         * ---
         * **Example of call with all parameters:**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/contextMetrics?timecode=20180803_182458
         */
        

        /**
         * **Description:**
         * This endpoint returns complete game data with win probabilities after each at bat for a specific game.
         *
         * **Return Includes:** Win probability and play by play data.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/winProbability
         *
         * ---
         * **Example of call with all parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/winProbability?timecode=20180803_182458
         */
        

        /**
         * **Description:**
         * This endpoint returns boxscore data for a specific gamePk.
         *
         * **Return Includes:** Boxscore,play by play, and team data.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/boxscore
         *
         * ---
         * **Example of call with all parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/boxscore?timecode=20180803_182458
         */
         getGameBoxscore(queryParams: {pathParams: GenGameOperations["boxscore"]["parameters"]["path"], params?: GenGameOperations["boxscore"]["query"]}): Promise<{data: GenGameOperations["boxscore"]["responses"]["200"]["content"]["application/json;charset=UTF-8"]}>;


        /**
         * **Description:**
         * This endpoint returns editorial content for a specific gamePk.
         *
         * **Return Includes:** Editorial pieces, highlights, images, game summary and game notes.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/content
         *
         * ---
         * **Example of call with all parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/content?highlightLimit=5
         */
        

        /**
         * **Description:**
         * This endpoint returns the color feed for a specific gamePk.
         *
         * **Return Includes:** Play by play, video, and pitch data.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531321/feed/color
         *
         * ---
         * **Example of call with all parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531321/feed/color?timecode=20180803_182458
         */
        

        /**
         * **Description:**
         * This endpoint returns the difference/discrepancies between two timecodes in the Color Feed using the Diff Patch System.
         *
         * **Return Includes:** Play by play data and player information.
         * <br/><br/><b>Diff/Patch
         * System:</b> startTimecode and endTimecode can be used for getting
         * diffs.<br/>Expected usage:  <br/> 1) Request full payload by not passing
         * startTimecode or endTimecode.  This will return the most recent game
         * state.<br/> 2) Find the latest timecode in this response.  <br/> 3) Wait
         * X seconds<br/> 4) Use the timecode from step 2 above as the startTimecode.  This
         * will give you a diff of everything that has happened since
         * startTimecode.  <br/> 5) If no data is returned, wait X seconds and do
         * the same request.  <br/> 6) If data is returned, get a new timeStamp
         * from the response, and use that for the next call as startTimecode.
         * <br></br>
         * **Required Parameters:** all parameters are required to run this call. If incorrectly called the call will default to http://statsapi.mlb.com/api/v1/game/531304/feed/color
         * <br></br>
         *
         * ---
         * **Example of call with required parameters:**
         *
         * http://statsapi.mlb.com/api/v1.1/game/531321/feed/live/diffPatch?startTimecode=20180822_163853&endTimecode=20180822_163938
         */
        

        /**
         * **Description:**
         * This endpoint returns timecodes for a specific gamePk.
         *
         * **Return Includes:** timecodes.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/534101/feed/color/timestamps
         */
        

        /**
         * **Description:**
         * This endpoint returns linescore data from a specific gamePk.
         *
         * **Return Includes:** Linescore, play by play, and team data.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/linescore
         *
         * ---
         * **Example of call with all parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/linescore?timecode=20180803_182458
         */
        getGameLinescore(queryParams: {pathParams: GameLinescorePathParams, params?: GameLinescoreParams}): Promise<{data: GameLinescoreDataResponse}>;

        /**
         * **Description:**
         * This endpoint returns play by play data for a specific gamePk.
         *
         * **Return Includes:** play by play data.
         *
         * **Required Parameters:** gamePk is required to run this call.
         *
         * ---
         * **Example of call with required parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/playByPlay
         *
         * ---
         *
         * **Example of call with all parameters**
         *
         * https://statsapi.mlb.com/api/v1/game/531060/playByPlay?timecode=20180803_182458
         */
         getGamePlayByPlay(queryParams: {pathParams: GamePlayByPlayPathParams, params?: GamePlayByPlayParams}): Promise<{data: GamePlayByPlayDataResponse}>;
    }
}