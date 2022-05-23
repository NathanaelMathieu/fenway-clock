# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `fetch-MLBStatsAPI-docs.sh args`

Runs a script that fetches the JSON documentation for endpoints of the MLBStatsAPI, converts them to a TypeScript typings file, and places them in the appropriate folder. Replace `args` with a space-separated list of endpoints (`team`, `game`, etc). If an endpoint fetch fails, the command will continue regardless.

Regex attempts:
(\/\*\*\n.*?Description[\S\s]*?\*\/\n)
