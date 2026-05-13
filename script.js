const STORAGE_KEY = "dpl-2-full-engine";
const ADMIN_PASSWORD = "DPL@2026";

const scoringRules = {
  present: { runs: 6, balls: 1 },
  substitute: { runs: 4, balls: 1 },
  medical: { runs: 2, balls: 1 },
  testimonial: { runs: 1, balls: 1 },
  oneToOne: { runs: 2, balls: 1 },
  referralInside: { runs: 2, balls: 1 },
  referralOutside: { runs: 4, balls: 1 },
  paidVisitor: { runs: 6, balls: 1 },
  training: { runs: 6, balls: 1 },
  tyfcb: { runs: 1, balls: 1 },
  visitorAttended: { runs: 25, balls: 6 },
  induction: { runs: 100, balls: 25 },
  meetup: { runs: 5, balls: 0 },
  powerDate: { runs: 7, balls: 0 },
};

const defaultData = {
  league: {
    title: "Diorite Premier League 2.0",
    subtitle: "Where Networking Meets Cricket",
  },

  teams: [
    {
      name: "Spark Syndicate",
      owner: "Owner 1",
      group: "A",
      players: [],
    },
    {
      name: "Invincible Titans",
      owner: "Owner 2",
      group: "A",
      players: [],
    },
    {
      name: "Stellar Strikers",
      owner: "Owner 3",
      group: "B",
      players: [],
    },
    {
      name: "Cover Drive Champions",
      owner: "Owner 4",
      group: "B",
      players: [],
    },
  ],

  players: [],

  matches: [],

  completedMatches: [],

  commentary: [],
};

let dpl = loadData();

/* ---------------- STORAGE ---------------- */

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultData;

  try {
    return JSON.parse(saved);
  } catch {
    return defaultData;
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dpl));
}

/* ---------------- HELPERS ---------------- */

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

function number(v) {
  return Number(v || 0);
}

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function strikeRate(runs, balls) {
  if (!balls) return 0;
  return ((runs / balls) * 100).toFixed(1);
}

function economy(runs, balls) {
  if (!balls) return 0;
  return (runs / balls).toFixed(1);
}

function calculatePlayer(player) {
  let runs = 0;
  let balls = 0;

  Object.keys(scoringRules).forEach((key) => {
    const qty = number(player.activities?.[key]);

    runs += qty * scoringRules[key].runs;
    balls += qty * scoringRules[key].balls;
  });

  if (player.out) {
    runs = Math.floor(runs / 2);
  }

  return {
    runs,
    balls,
    sr: strikeRate(runs, balls),
  };
}

function getTeamPlayers(teamName) {
  return dpl.players.filter((p) => p.team === teamName);
}

function calculateTeam(teamName) {
  const players = getTeamPlayers(teamName);

  let runs = 0;
  let wickets = 0;
  let balls = 0;

  players.forEach((p) => {
    const calc = calculatePlayer(p);

    runs += calc.runs;
    balls += calc.balls;

    if (p.out) wickets++;
  });

  return {
    runs,
    wickets,
    balls,
    rr: balls ? (runs / balls).toFixed(2) : "0.00",
  };
}

/* ---------------- HOME ---------------- */

function renderHome() {
  const title = qs("#leagueTitle");
  const subtitle = qs("#leagueSubtitle");

  if (title) title.textContent = dpl.league.title;
  if (subtitle) subtitle.textContent = dpl.league.subtitle;
}

/* ---------------- DASHBOARD ---------------- */

function renderDashboard() {
  renderLiveMatches();
  renderCompletedMatches();
  renderPointsTable();
  renderAwards();
  renderTeams();
  renderCommentary();
}

function renderLiveMatches() {
  const wrap = qs("#weeklyFixtures");
  const scoreboard = qs("#scoreboard");

  if (!wrap || !scoreboard) return;

  scoreboard.innerHTML = "";
  wrap.innerHTML = "";

  dpl.matches.forEach((match, index) => {
    const teamA = calculateTeam(match.teamA);
    const teamB = calculateTeam(match.teamB);

    const liveCard = `
      <div class="score-panel">
        <div class="scoreboard-header">
          <span class="live-badge">LIVE</span>
          <span class="powerplay-chip">
            Week ${match.week} • Match ${match.matchNo}
          </span>
        </div>

        <div class="fixture-score-row">
          <div>
            <strong>${match.teamA}</strong>
            <div class="score-number">
              ${teamA.runs}<span class="wickets">/${teamA.wickets}</span>
            </div>
          </div>

          <div class="score-center">
            <strong>VS</strong>
            <span class="status-line">
              ${match.powerplay ? "POWERPLAY 🔥" : "LIVE"}
            </span>
          </div>

          <div>
            <strong>${match.teamB}</strong>
            <div class="score-number">
              ${teamB.runs}<span class="wickets">/${teamB.wickets}</span>
            </div>
          </div>
        </div>

        <div class="score-meta">
          <span>Batting: ${match.battingTeam}</span>
          <span>Bowling: ${match.bowlingTeam}</span>
          <span>Innings Day ${match.day}</span>
        </div>

        <button class="btn btn-outline"
          onclick="openMatch(${index})">
          View Details
        </button>
      </div>
    `;

    wrap.innerHTML += liveCard;
  });
}

function renderCompletedMatches() {
  const wrap = qs("#completedMatches");
  if (!wrap) return;

  wrap.innerHTML = "";

  dpl.completedMatches.forEach((match) => {
    wrap.innerHTML += `
      <div class="fixture-card">
        <div class="fixture-card-top">
          <span class="fixture-tag">
            Match ${match.matchNo}
          </span>

          <span class="fixture-status">
            COMPLETED
          </span>
        </div>

        <div class="fixture-score-row">
          <div>
            <strong>${match.teamA}</strong>
            <span>${match.teamARuns}/${match.teamAWickets}</span>
          </div>

          <em>VS</em>

          <div>
            <strong>${match.teamB}</strong>
            <span>${match.teamBRuns}/${match.teamBWickets}</span>
          </div>
        </div>

        <div class="score-meta">
          <span>${match.result}</span>
        </div>
      </div>
    `;
  });
}

/* ---------------- MATCH DETAILS ---------------- */

function openMatch(index) {
  const match = dpl.matches[index];

  const modal = document.createElement("div");
  modal.className = "match-modal";

  const battingPlayers = getTeamPlayers(match.battingTeam);
  const bowlingPlayers = getTeamPlayers(match.bowlingTeam);

  modal.innerHTML = `
    <div class="match-modal-backdrop" onclick="closeModal()"></div>

    <div class="match-detail-panel">

      <div class="match-detail-header">
        <h2>${match.teamA} vs ${match.teamB}</h2>

        <button class="btn btn-outline" onclick="closeModal()">
          Close
        </button>
      </div>

      <h3>Batting Scorecard</h3>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>SR</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          ${battingPlayers
            .map((p) => {
              const calc = calculatePlayer(p);

              return `
                <tr>
                  <td>${p.name}</td>
                  <td>${calc.runs}</td>
                  <td>${calc.balls}</td>
                  <td>${calc.sr}</td>
                  <td>${p.out ? "OUT" : "NOT OUT"}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>

      <h3>Bowling Scorecard</h3>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Wickets</th>
          </tr>
        </thead>

        <tbody>
          ${bowlingPlayers
            .map((p) => {
              return `
                <tr>
                  <td>${p.name}</td>
                  <td>${number(p.wickets)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>

    </div>
  `;

  document.body.appendChild(modal);
}

function closeModal() {
  const modal = qs(".match-modal");
  if (modal) modal.remove();
}

/* ---------------- POINTS TABLE ---------------- */

function renderPointsTable() {
  const body = qs("#leaderboardBody");
  if (!body) return;

  body.innerHTML = "";

  dpl.teams.forEach((team) => {
    const played = dpl.completedMatches.filter(
      (m) => m.teamA === team.name || m.teamB === team.name
    ).length;

    const wins = dpl.completedMatches.filter(
      (m) => m.winner === team.name
    ).length;

    const points = wins * 2;

    body.innerHTML += `
      <tr>
        <td>${team.name}</td>
        <td>${played}</td>
        <td>${wins}</td>
        <td>${points}</td>
        <td>+0.00</td>
      </tr>
    `;
  });
}

/* ---------------- AWARDS ---------------- */

function renderAwards() {
  const caps = qs("#capsStack");
  if (!caps) return;

  const orange = [...dpl.players]
    .sort((a, b) => calculatePlayer(b).runs - calculatePlayer(a).runs)[0];

  const purple = [...dpl.players]
    .sort((a, b) => number(b.wickets) - number(a.wickets))[0];

  const striker = [...dpl.players]
    .sort((a, b) => calculatePlayer(b).sr - calculatePlayer(a).sr)[0];

  caps.innerHTML = `
    ${awardCard("🟠 Orange Cap", orange?.name, calculatePlayer(orange || {}).runs)}
    ${awardCard("🟣 Purple Cap", purple?.name, purple?.wickets || 0)}
    ${awardCard("⚡ Super Striker", striker?.name, calculatePlayer(striker || {}).sr)}
  `;
}

function awardCard(title, player, value) {
  return `
    <div class="cap-card">
      <div class="avatar">${initials(player || "NA")}</div>

      <div>
        <span>${title}</span>
        <strong>${player || "No Player"}</strong>
        <div class="metric">${value}</div>
      </div>
    </div>
  `;
}

/* ---------------- TEAMS ---------------- */

function renderTeams() {
  const grid = qs("#teamsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  dpl.teams.forEach((team) => {
    grid.innerHTML += `
      <div class="team-card">
        <strong>${team.name}</strong>
        <span>Owner: ${team.owner}</span>

        <ul>
          ${team.players
            .map((p) => `<li>${p}</li>`)
            .join("")}
        </ul>
      </div>
    `;
  });
}

/* ---------------- COMMENTARY ---------------- */

function renderCommentary() {
  const feed = qs("#commentaryFeed");
  if (!feed) return;

  feed.innerHTML = dpl.commentary
    .map(
      (c) => `
      <div class="commentary-item">
        <span class="commentary-time">${c.time}</span>
        <span>${c.text}</span>
      </div>
    `
    )
    .join("");
}

/* ---------------- ADMIN ---------------- */

function renderAdmin() {
  const form = qs("#adminForm");
  if (!form) return;

  const auth = sessionStorage.getItem("dpl-auth");

  if (!auth) {
    form.innerHTML = `
      <div class="admin-login">
        <h2>Admin Login</h2>

        <input
          id="adminPassword"
          type="password"
          placeholder="Enter Password"
        />

        <button class="btn btn-live" onclick="loginAdmin()">
          Login
        </button>
      </div>
    `;

    return;
  }

  form.innerHTML = `
    <div class="admin-toolbar">
      <h2>DPL Control Room</h2>

      <button class="btn btn-outline"
        onclick="logoutAdmin()">
        Logout
      </button>
    </div>

    <div class="admin-actions">
      <button class="btn btn-live"
        onclick="addMatch()">
        Add Match
      </button>

      <button class="btn btn-outline"
        onclick="addPlayer()">
        Add Player
      </button>
    </div>

    <div id="adminMatches"></div>
  `;

  renderAdminMatches();
}

function loginAdmin() {
  const pass = qs("#adminPassword").value;

  if (pass === ADMIN_PASSWORD) {
    sessionStorage.setItem("dpl-auth", "1");
    renderAdmin();
  } else {
    alert("Wrong Password");
  }
}

function logoutAdmin() {
  sessionStorage.removeItem("dpl-auth");
  renderAdmin();
}

/* ---------------- ADMIN MATCHES ---------------- */

function renderAdminMatches() {
  const wrap = qs("#adminMatches");
  if (!wrap) return;

  wrap.innerHTML = "";

  dpl.matches.forEach((match, index) => {
    wrap.innerHTML += `
      <div class="admin-match-card">

        <h3>
          Match ${match.matchNo}
          •
          ${match.teamA} vs ${match.teamB}
        </h3>

        <div class="admin-actions">

          <button class="btn btn-live"
            onclick="completeMatch(${index})">
            Complete Match
          </button>

          <button class="btn btn-outline"
            onclick="deleteMatch(${index})">
            Delete
          </button>

        </div>

      </div>
    `;
  });
}

/* ---------------- MATCH ACTIONS ---------------- */

function addMatch() {
  const teamA = prompt("Team A");
  const teamB = prompt("Team B");

  if (!teamA || !teamB) return;

  dpl.matches.push({
    week: 1,
    matchNo: dpl.matches.length + 1,
    teamA,
    teamB,
    battingTeam: teamA,
    bowlingTeam: teamB,
    powerplay: true,
    day: 1,
  });

  saveData();
  renderDashboard();
  renderAdmin();
}

function deleteMatch(index) {
  dpl.matches.splice(index, 1);

  saveData();
  renderDashboard();
  renderAdmin();
}

function completeMatch(index) {
  const match = dpl.matches[index];

  const teamA = calculateTeam(match.teamA);
  const teamB = calculateTeam(match.teamB);

  match.teamARuns = teamA.runs;
  match.teamAWickets = teamA.wickets;

  match.teamBRuns = teamB.runs;
  match.teamBWickets = teamB.wickets;

  match.winner =
    teamA.runs > teamB.runs ? match.teamA : match.teamB;

  match.result =
    `${match.winner} won by ${
      Math.abs(teamA.runs - teamB.runs)
    } runs`;

  dpl.completedMatches.push(match);

  dpl.matches.splice(index, 1);

  saveData();

  renderDashboard();
  renderAdmin();
}

/* ---------------- PLAYERS ---------------- */

function addPlayer() {
  const name = prompt("Player Name");
  const team = prompt("Team Name");

  if (!name || !team) return;

  dpl.players.push({
    name,
    team,
    activities: {},
    wickets: 0,
    out: false,
  });

  const teamObj = dpl.teams.find((t) => t.name === team);

  if (teamObj) {
    teamObj.players.push(name);
  }

  saveData();

  renderDashboard();
  renderAdmin();
}

/* ---------------- INIT ---------------- */

function init() {
  renderHome();
  renderDashboard();
  renderAdmin();
}

document.addEventListener("DOMContentLoaded", init);
