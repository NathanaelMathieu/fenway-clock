import { Team } from "mlb-stats-typescript-api/output/team";
import { Server } from "socket.io";

interface ServerToClientEvents {
    // things like update commands, game over commands, game on, etc.
    setLED: (led: string, value: number) => void;
    setNext: (datetime: string) => void;
    getTeam: (callback: (team: Team) => void) => void;
}

interface ClientToServerEvents {
    // things like ask for next game
    getAll: () => void;
    getOne: (led: string) => number;
    getNext: () => void;
}

interface InterServerEvents {
    // maybe nothing?
    ping: () => void;
}

interface SocketData {
    // things to record about each unique connection
    team: Team;
    platform: string;
    name: string;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>();

io.on("connection", (socket) => {
    // what to do when a new connection arrives
    socket.emit("getTeam", (team: Team) => {
        socket.data.team = team;
    });
});

io.serverSideEmit("ping");

io.on("ping", () => {
  console.log("Received socket ping!")
});

io.listen(3000);
