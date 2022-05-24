import { io } from "socket.io-client";

const socket = io("https://nathanaelmathieu.github.io/fenway-clock");

const teamId = 111;
var nextGameDate = "";

socket.on("connect", () => {
    console.log(socket.id);
});
  
socket.on("disconnect", () => {
    console.log("Disconnected from socket.");
});

socket.on("setLED", (led, value) => {
    console.log("Setting", led, "to", value);
});

socket.on("setNext", (datetime) => {
    nextGameDate = datetime;
});

socket.on("getTeam", (callback) => {
    callback(teamId);
})