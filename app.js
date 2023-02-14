const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

app.use(express.json());

let dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

let initilizingDbWithExpress = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The server is running: http://localhost:3000/");
    });
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }
};

initilizingDbWithExpress();

app.get("/", (request, response) => {
  response.send("Hi");
});

//GET PLAYERS

app.get("/players/", async (request, response) => {
  let dbGetQuery = await `SELECT * FROM cricket_team;`;
  let dbPlayers = await db.all(dbGetQuery);
  response.send(dbPlayers);
});

// POST PLAYERS

app.post("/players/", async (request, response) => {
  let userDb = request.body;
  let { playerName, jerseyNumber, role } = userDb;
  let postPeopleQuery = await `INSERT INTO cricket_team (player_name, jersey_number, role) 
  VALUES ( '${playerName}', ${jerseyNumber}, '${role}');`;
  await db.run(postPeopleQuery);
  response.send("Player Added to Team");
});

// GET BY PLAYERID

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let getByIdQuery = await `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  let player = await db.get(getByIdQuery);
  response.send(player);
});

// UPDATE PLAYER PUT

app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let userChange = request.body;
  let { playerName, jerseyNumber, role } = userChange;
  let updateQuery = await `UPDATE cricket_team 
    SET player_name = '${playerName}', 
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE player_id = ${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

// DELETE PLAYER API

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  let deleteQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
