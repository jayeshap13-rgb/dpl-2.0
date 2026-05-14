const STORAGE_KEY = "dpl-2-advanced-engine-v2";
const ADMIN_AUTH_KEY = "dpl-admin-auth";
const ADMIN_PASSWORD = "DPL@2026";

const DEFAULT_PLAYER_SCORING_RULES = {
  present: { label: "Present", runs: 6, balls: 1 },
  substitute: { label: "Substitute", runs: 4, balls: 1 },
  medical: { label: "Medical", runs: 2, balls: 1 },
  testimonial: { label: "Testimonial", runs: 1, balls: 1 },
  oneToOne: { label: "1-2-1", runs: 2, balls: 1 },
  referralInside: { label: "Referral Inside", runs: 2, balls: 1 },
  referralOutside: { label: "Referral Outside", runs: 4, balls: 1 },
  paidVisitor: { label: "Paid Visitor Registered", runs: 6, balls: 1 },
  training: { label: "Training Attended", runs: 6, balls: 1 },
  tyfcb: { label: "TYFCB ₹1 Lakh", runs: 1, balls: 1 },
  visitorAttended: { label: "Visitor Attended After Registration", runs: 25, balls: 6 },
  induction: { label: "Induction", runs: 100, balls: 25 },
};

const DEFAULT_TEAM_EXTRA_RULES = {
  meetup: { label: "Team Meetup / Sports / Café", runs: 5 },
  powerDate: { label: "Power Date", runs: 7 },
};

const defaultData = {
  league: {
    title: "Diorite Premier League 2.0",
    subtitle: "Where Networking Meets Cricket",
    eyebrow: "BNI Diorite Chapter",
    auctionDate: "19 May 2026",
    duration: "5 Weeks",
    totalTeams: 4,
    totalPlayers: 36,
    totalMatches: 10,
  },

  scoringRules: clonePlain(DEFAULT_PLAYER_SCORING_RULES),
  extraRules: clonePlain(DEFAULT_TEAM_EXTRA_RULES),

  teams: [
    {
      name: "Spark Syndicate",
      owner: "Owner 1",
      group: "A",
      players: ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9"],
    },
    {
      name: "Invincible Titans",
      owner: "Owner 2",
      group: "A",
      players: ["Player 10", "Player 11", "Player 12", "Player 13", "Player 14", "Player 15", "Player 16", "Player 17", "Player 18"],
    },
    {
      name: "Stellar Strikers",
      owner: "Owner 3",
      group: "B",
      players: ["Player 19", "Player 20", "Player 21", "Player 22", "Player 23", "Player 24", "Player 25", "Player 26", "Player 27"],
    },
    {
      name: "Cover Drive Champions",
      owner: "Owner 4",
      group: "B",
      players: ["Player 28", "Player 29", "Player 30", "Player 31", "Player 32", "Player 33", "Player 34", "Player 35", "Player 36"],
    },
  ],

  matches: [],

  completedMatches: [],

  commentary: [
    { time: "10:00", text: "DPL 2.0 auction and league setup begins." },
    { time: "10:15", text: "Team owners ready for toss, imposters, openers and bowlers." },
  ],
};

defaultData.matches = [
  createMatch(1, 1, "Spark Syndicate", "Invincible Titans"),
  createMatch(1, 2, "Stellar Strikers", "Cover Drive Champions"),
];

let dpl = loadData();

/* ---------------- BASIC HELPERS ---------------- */

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function cssId(id) {
  if (window.CSS && CSS.escape) return CSS.escape(id);
  return String(id).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

function val(id, fallback = "") {
  const el = qs(`#${cssId(id)}`);
  return el ? el.value.trim() : fallback;
}

function valNum(id, fallback = 0) {
  return num(val(id, fallback), fallback);
}

function checked(id) {
  return Boolean(qs(`#${cssId(id)}`)?.checked);
}

function initials(name = "") {
  return (
    String(name)
      .split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NA"
  );
}

function strikeRate(runs, balls) {
  return balls ? ((runs / balls) * 100).toFixed(1) : "0.0";
}

function runRate(runs, balls) {
  return balls ? (runs / balls).toFixed(2) : "0.00";
}

function economy(runs, balls) {
  return balls ? (runs / balls).toFixed(2) : "0.00";
}

function splitLines(value) {
  return String(value || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function teamByName(name) {
  return dpl.teams.find((t) => t.name === name);
}

function playersOfTeam(teamName) {
  return teamByName(teamName)?.players || [];
}

function createMatch(week, matchNo, teamA, teamB) {
  return {
    id: `M${Date.now()}${Math.floor(Math.random() * 9999)}`,
    week,
    matchNo,
    teamA,
    teamB,
    battingTeam: teamA,
    bowlingTeam: teamB,
    day: 1,
    innings: "1st Innings",
    tossWinner: "",
    tossDecision: "Bat",
    powerplay: true,

    teamAImposter: "",
    teamBImposter: "",

    teamAOpeners: [],
    teamBOpeners: [],

    teamABowlers: [],
    teamBBowlers: [],

    teamExtras: {
      [teamA]: {},
      [teamB]: {},
    },

    teamAExtraAdjustment: 0,
    teamBExtraAdjustment: 0,

    battingStats: [],
    bowlingStats: [],

    motm: "",
    mvp: "",
    status: "Live",
  };
}

/* ---------------- STORAGE ---------------- */

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return normalizeData(clone(defaultData));
    return normalizeData(JSON.parse(saved));
  } catch {
    return normalizeData(clone(defaultData));
  }
}

function saveData(show = true) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dpl));
  if (show) showToast("Saved");
}

function normalizeData(data) {
  const merged = {
    ...clone(defaultData),
    ...data,
    league: { ...defaultData.league, ...(data.league || {}) },
    scoringRules: { ...clone(DEFAULT_PLAYER_SCORING_RULES), ...(data.scoringRules || {}) },
    extraRules: { ...clone(DEFAULT_TEAM_EXTRA_RULES), ...(data.extraRules || {}) },
    teams: Array.isArray(data.teams) ? data.teams : clone(defaultData.teams),
    matches: Array.isArray(data.matches) ? data.matches : clone(defaultData.matches),
    completedMatches: Array.isArray(data.completedMatches) ? data.completedMatches : [],
    commentary: Array.isArray(data.commentary) ? data.commentary : clone(defaultData.commentary),
  };

  delete merged.scoringRules.meetup;
  delete merged.scoringRules.powerDate;

  merged.matches = merged.matches.map((m, i) => ({
    ...createMatch(m.week || 1, m.matchNo || i + 1, m.teamA || "", m.teamB || ""),
    ...m,
    teamABowlers: Array.isArray(m.teamABowlers) ? m.teamABowlers.slice(0, 3) : [],
    teamBBowlers: Array.isArray(m.teamBBowlers) ? m.teamBBowlers.slice(0, 3) : [],
    battingStats: Array.isArray(m.battingStats) ? m.battingStats : [],
    bowlingStats: Array.isArray(m.bowlingStats) ? m.bowlingStats : [],
    teamExtras: m.teamExtras || {},
  }));

  merged.completedMatches = merged.completedMatches.map((m) => ({
    ...m,
    battingStats: Array.isArray(m.battingStats) ? m.battingStats : [],
    bowlingStats: Array.isArray(m.bowlingStats) ? m.bowlingStats : [],
    teamExtras: m.teamExtras || {},
  }));

  return merged;
}

/* ---------------- SCORE ENGINE ---------------- */

function emptyActivities() {
  const obj = {};
  Object.keys(dpl.scoringRules || DEFAULT_PLAYER_SCORING_RULES).forEach((key) => {
    obj[key] = 0;
  });
  return obj;
}

function ensureMatchExtras(match) {
  match.teamExtras = match.teamExtras || {};
  match.teamExtras[match.teamA] = match.teamExtras[match.teamA] || {};
  match.teamExtras[match.teamB] = match.teamExtras[match.teamB] || {};

  Object.keys(dpl.extraRules || {}).forEach((key) => {
    match.teamExtras[match.teamA][key] = num(match.teamExtras[match.teamA][key]);
    match.teamExtras[match.teamB][key] = num(match.teamExtras[match.teamB][key]);
  });

  match.teamAExtraAdjustment = num(match.teamAExtraAdjustment);
  match.teamBExtraAdjustment = num(match.teamBExtraAdjustment);
}

function ensureScorecards(match) {
  match.teamABowlers = (match.teamABowlers || []).slice(0, 3);
  match.teamBBowlers = (match.teamBBowlers || []).slice(0, 3);

  ensureMatchExtras(match);

  const matchTeams = [match.teamA, match.teamB];

  matchTeams.forEach((teamName) => {
    playersOfTeam(teamName).forEach((playerName) => {
      if (!match.battingStats.some((p) => p.name === playerName && p.team === teamName)) {
        match.battingStats.push({
          name: playerName,
          team: teamName,
          activities: emptyActivities(),
          out: false,
          wicketReason: "",
          penaltyRuns: 0,
          manualBonusRuns: 0,
          manualBalls: 0,
        });
      }
    });
  });

  match.battingStats.forEach((player) => {
    player.activities = player.activities || {};
    Object.keys(dpl.scoringRules || {}).forEach((key) => {
      player.activities[key] = num(player.activities[key]);
    });
    Object.keys(player.activities).forEach((key) => {
      if (!dpl.scoringRules[key]) delete player.activities[key];
    });
  });

  if (!match.teamABowlers.length) {
    match.teamABowlers = playersOfTeam(match.teamA).slice(0, 3);
  }

  if (!match.teamBBowlers.length) {
    match.teamBBowlers = playersOfTeam(match.teamB).slice(0, 3);
  }

  const selectedBowlers = [
    ...match.teamABowlers.slice(0, 3).map((name) => ({ name, team: match.teamA })),
    ...match.teamBBowlers.slice(0, 3).map((name) => ({ name, team: match.teamB })),
  ].filter((b) => b.name);

  selectedBowlers.forEach((bowler) => {
    if (!match.bowlingStats.some((p) => p.name === bowler.name && p.team === bowler.team)) {
      match.bowlingStats.push({
        name: bowler.name,
        team: bowler.team,
        day: "",
        wickets: 0,
        specificWickets: 0,
        ballsBowled: 0,
        runsConceded: 0,
      });
    }
  });

  match.battingStats = match.battingStats.filter((p) => matchTeams.includes(p.team));

  match.bowlingStats = match.bowlingStats.filter((p) =>
    selectedBowlers.some((b) => b.name === p.name && b.team === p.team)
  );
}

function calculatePlayerBatting(player, match) {
  let runs = 0;
  let balls = 0;

  const rules = dpl.scoringRules || DEFAULT_PLAYER_SCORING_RULES;
  const activities = player.activities || {};

  Object.entries(rules).forEach(([key, rule]) => {
    const qty = num(activities[key]);
    runs += qty * num(rule.runs);
    balls += qty * num(rule.balls);
  });

  runs += num(player.manualBonusRuns);
  balls += num(player.manualBalls);

  const isOpener =
    match.powerplay &&
    ((player.team === match.teamA && (match.teamAOpeners || []).includes(player.name)) ||
      (player.team === match.teamB && (match.teamBOpeners || []).includes(player.name)));

  if (isOpener) runs *= 2;

  if (player.out) runs = Math.floor(runs / 2);

  runs -= num(player.penaltyRuns);

  runs = Math.max(0, runs);

  return {
    runs,
    balls,
    sr: strikeRate(runs, balls),
    isOpener,
  };
}

function calculateTeamExtras(match, teamName) {
  ensureMatchExtras(match);

  const extras = match.teamExtras?.[teamName] || {};
  let total = 0;

  Object.entries(dpl.extraRules || {}).forEach(([key, rule]) => {
    total += num(extras[key]) * num(rule.runs);
  });

  if (teamName === match.teamA) total += num(match.teamAExtraAdjustment);
  if (teamName === match.teamB) total += num(match.teamBExtraAdjustment);

  return total;
}

function calculateTeamScore(match, teamName) {
  ensureScorecards(match);

  const players = match.battingStats.filter((p) => p.team === teamName);
  const allOut = players.length > 0 && players.every((p) => p.out);

  let runs = 0;
  let balls = 0;
  let wickets = 0;

  players.forEach((p) => {
    const calc = calculatePlayerBatting(p, match);
    runs += calc.runs;
    balls += calc.balls;
    if (p.out) wickets += 1;
  });

  const extras = calculateTeamExtras(match, teamName);
  runs += extras;

  const opponent = teamName === match.teamA ? match.teamB : match.teamA;
  const opponentImposter = teamName === match.teamA ? match.teamBImposter : match.teamAImposter;

  let imposterGain = 0;

  if (opponentImposter) {
    const imposter = match.battingStats.find((p) => p.name === opponentImposter && p.team === opponent);

    if (imposter) {
      imposterGain = Math.floor(calculatePlayerBatting(imposter, match).runs * 0.5);
      runs += imposterGain;
    }
  }

  runs = Math.max(0, runs);

  return {
    runs,
    balls,
    wickets,
    rr: runRate(runs, balls),
    allOut,
    extras,
    imposterGain,
  };
}

function getWinner(match) {
  const a = calculateTeamScore(match, match.teamA);
  const b = calculateTeamScore(match, match.teamB);

  if (a.runs === b.runs) return "Tie";
  return a.runs > b.runs ? match.teamA : match.teamB;
}

function getResultText(match) {
  const a = calculateTeamScore(match, match.teamA);
  const b = calculateTeamScore(match, match.teamB);

  if (a.runs === b.runs) return "Match tied";
  const winner = a.runs > b.runs ? match.teamA : match.teamB;
  return `${winner} won by ${Math.abs(a.runs - b.runs)} runs`;
}

/* ---------------- UI HELPERS ---------------- */

function showToast(message) {
  let toast = qs(".dpl-toast");
  if (toast) toast.remove();

  toast = document.createElement("div");
  toast.className = "dpl-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function addLiveClock() {
  const target = qs(".dashboard-top-actions, .admin-page-actions, .broadcast-topline");
  if (!target || qs("#liveClock")) return;

  const clock = document.createElement("span");
  clock.id = "liveClock";
  clock.className = "live-clock";
  target.appendChild(clock);

  setInterval(() => {
    clock.textContent = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, 1000);
}

/* ---------------- PUBLIC RENDER ---------------- */

function renderAll() {
  dpl.matches.forEach(ensureScorecards);
  renderHome();
  renderScoreboard();
  renderLiveFixtures();
  renderCompletedMatches();
  renderLeaderboard();
  renderAwards();
  renderTeams();
  renderCommentary();
  renderRules();
  addLiveClock();
}

function renderHome() {
  const title = qs("#leagueTitle");
  const subtitle = qs("#leagueSubtitle");
  const eyebrow = qs("#heroEyebrow");
  const overview = qs("#overviewGrid");
  const homeScore = qs("#homeBroadcastScore");
  const homeLower = qs("#homeBroadcastLower");
  const fixtureStrip = qs("#fixtureStrip");

  if (title) title.textContent = dpl.league.title;
  if (subtitle) subtitle.textContent = dpl.league.subtitle;
  if (eyebrow) eyebrow.textContent = dpl.league.eyebrow;

  if (fixtureStrip) {
    fixtureStrip.innerHTML = `
      <div><span>Auction</span><strong>${escapeHTML(dpl.league.auctionDate)}</strong></div>
      <div><span>Duration</span><strong>${escapeHTML(dpl.league.duration)}</strong></div>
      <div><span>Format</span><strong>${dpl.league.totalMatches} Matches</strong></div>
    `;
  }

  if (overview) {
    overview.innerHTML = `
      <article class="glass-stat"><span class="stat-number">${dpl.league.totalPlayers}</span><strong>Members</strong></article>
      <article class="glass-stat"><span class="stat-number">${dpl.league.totalTeams}</span><strong>Teams</strong></article>
      <article class="glass-stat"><span class="stat-number">${dpl.league.totalMatches}</span><strong>Total Matches</strong></article>
      <article class="glass-stat"><span class="stat-number">5</span><strong>Weeks</strong></article>
      <article class="glass-stat"><span class="stat-number">1</span><strong>Champion</strong></article>
    `;
  }

  const match = dpl.matches[0];

  if (homeScore && match) {
    const score = calculateTeamScore(match, match.battingTeam);
    homeScore.innerHTML = `
      <span>${score.runs}<span class="wicket">/${score.wickets}</span></span>
      <small>${score.balls} Balls • RR ${score.rr} • Extras ${score.extras}</small>
    `;
  }

  if (homeLower && match) {
    homeLower.innerHTML = `
      <strong>${escapeHTML(match.battingTeam)} batting</strong>
      <span>${escapeHTML(match.bowlingTeam)} bowling • ${match.powerplay ? "Powerplay Active" : "Normal Play"}</span>
    `;
  }
}

function renderScoreboard() {
  const board = qs("#scoreboard");
  if (!board) return;

  board.innerHTML = `
    <div class="scoreboard-header">
      <span class="live-badge">LIVE</span>
      <span class="powerplay-badge">${dpl.matches.length} LIVE MATCHES</span>
    </div>
    <div class="scoreboard-fixtures">
      ${dpl.matches.map((match, index) => renderLiveScorePanel(match, index)).join("")}
    </div>
  `;
}

function renderLiveScorePanel(match, index) {
  ensureScorecards(match);

  const a = calculateTeamScore(match, match.teamA);
  const b = calculateTeamScore(match, match.teamB);

  return `
    <article class="score-panel">
      <div class="fixture-card-top">
        <span class="fixture-tag">Week ${match.week} • Match ${match.matchNo}</span>
        <span class="fixture-status">${match.status}</span>
      </div>

      <div class="fixture-score-row">
        <div>
          <strong>${escapeHTML(match.teamA)}</strong>
          <div class="score-number">${a.runs}<span class="wickets">/${a.wickets}</span></div>
          <small>${a.balls} Balls • RR ${a.rr} • Extras ${a.extras}</small>
        </div>

        <div class="score-center">
          <strong>VS</strong>
          <span class="status-line">${match.powerplay ? "POWERPLAY 🔥" : match.innings}</span>
        </div>

        <div>
          <strong>${escapeHTML(match.teamB)}</strong>
          <div class="score-number">${b.runs}<span class="wickets">/${b.wickets}</span></div>
          <small>${b.balls} Balls • RR ${b.rr} • Extras ${b.extras}</small>
        </div>
      </div>

      <div class="score-meta">
        <span>Batting: ${escapeHTML(match.battingTeam)}</span>
        <span>Bowling: ${escapeHTML(match.bowlingTeam)}</span>
        <span>Day ${match.day}</span>
        <span>${match.innings}</span>
        ${a.allOut || b.allOut ? `<span>All Out Alert</span>` : ""}
      </div>

      <button class="btn btn-outline" type="button" data-open-match="${index}" data-collection="matches">
        View Full Scorecard
      </button>
    </article>
  `;
}

function renderLiveFixtures() {
  qsa("#weeklyFixtures, #homeWeeklyFixtures").forEach((wrap) => {
    wrap.innerHTML = dpl.matches.length
      ? dpl.matches.map((match, index) => renderFixtureCard(match, index, "matches")).join("")
      : `<div class="loading-card">No live matches available.</div>`;
  });
}

function renderCompletedMatches() {
  qsa("#completedMatches, #homeCompletedMatches").forEach((wrap) => {
    wrap.innerHTML = dpl.completedMatches.length
      ? dpl.completedMatches.map((match, index) => renderFixtureCard(match, index, "completedMatches")).join("")
      : `<div class="loading-card">No previous results yet.</div>`;
  });
}

function renderFixtureCard(match, index, collection) {
  const a = collection === "matches" ? calculateTeamScore(match, match.teamA) : match.finalA;
  const b = collection === "matches" ? calculateTeamScore(match, match.teamB) : match.finalB;

  return `
    <button class="fixture-card" type="button" data-open-match="${index}" data-collection="${collection}">
      <div class="fixture-card-top">
        <span class="fixture-tag">Week ${match.week} • Match ${match.matchNo}</span>
        <span class="fixture-status">${collection === "matches" ? "LIVE" : "COMPLETED"}</span>
      </div>

      <div class="fixture-score-row">
        <div>
          <strong>${escapeHTML(match.teamA)}</strong>
          <span>${a.runs}/${a.wickets}</span>
        </div>
        <em>vs</em>
        <div>
          <strong>${escapeHTML(match.teamB)}</strong>
          <span>${b.runs}/${b.wickets}</span>
        </div>
      </div>

      <div class="score-meta">
        <span>${collection === "matches" ? match.innings : match.result}</span>
        <span>Tap for details</span>
      </div>
    </button>
  `;
}

function renderLeaderboard() {
  const body = qs("#leaderboardBody");
  if (!body) return;

  const rows = dpl.teams.map((team) => {
    const completed = dpl.completedMatches.filter((m) => m.teamA === team.name || m.teamB === team.name);
    const wins = completed.filter((m) => m.winner === team.name).length;

    const runsFor = completed.reduce((sum, m) => {
      if (m.teamA === team.name) return sum + m.finalA.runs;
      if (m.teamB === team.name) return sum + m.finalB.runs;
      return sum;
    }, 0);

    const runsAgainst = completed.reduce((sum, m) => {
      if (m.teamA === team.name) return sum + m.finalB.runs;
      if (m.teamB === team.name) return sum + m.finalA.runs;
      return sum;
    }, 0);

    return {
      team: team.name,
      matches: completed.length,
      wins,
      points: wins * 2,
      nrr: runsFor - runsAgainst,
    };
  });

  rows.sort((a, b) => b.points - a.points || b.nrr - a.nrr);

  body.innerHTML = rows
    .map(
      (row, i) => `
        <tr class="${i === 0 ? "top-team" : ""}">
          <td><span class="rank-dot"></span><strong>${escapeHTML(row.team)}</strong></td>
          <td>${row.matches}</td>
          <td>${row.wins}</td>
          <td>${row.points}</td>
          <td>${row.nrr}</td>
        </tr>
      `
    )
    .join("");
}

function allBattingRows() {
  const rows = [];
  [...dpl.matches, ...dpl.completedMatches].forEach((match) => {
    (match.battingStats || []).forEach((p) => {
      rows.push({ ...p, calc: calculatePlayerBatting(p, match), match });
    });
  });
  return rows;
}

function allBowlingRows() {
  const rows = [];
  [...dpl.matches, ...dpl.completedMatches].forEach((match) => {
    (match.bowlingStats || []).forEach((p) => rows.push(p));
  });
  return rows;
}

function renderAwards() {
  const caps = qs("#capsStack");
  if (!caps) return;

  const batting = allBattingRows();
  const bowling = allBowlingRows();

  const orange = [...batting].sort((a, b) => b.calc.runs - a.calc.runs)[0];
  const striker = [...batting].sort((a, b) => Number(b.calc.sr) - Number(a.calc.sr))[0];
  const purple = [...bowling].sort((a, b) => num(b.wickets) + num(b.specificWickets) - (num(a.wickets) + num(a.specificWickets)))[0];
  const economyBest = [...bowling]
    .filter((b) => num(b.ballsBowled) > 0)
    .sort((a, b) => Number(economy(a.runsConceded, a.ballsBowled)) - Number(economy(b.runsConceded, b.ballsBowled)))[0];

  caps.innerHTML = `
    ${awardCard("🟠 Orange Cap", orange?.name, orange?.calc.runs || 0)}
    ${awardCard("🟣 Purple Cap", purple?.name, num(purple?.wickets) + num(purple?.specificWickets))}
    ${awardCard("⚡ Best Strike Rate", striker?.name, striker?.calc.sr || "0.0")}
    ${awardCard("🎯 Best Economy", economyBest?.name, economyBest ? economy(economyBest.runsConceded, economyBest.ballsBowled) : "0.00")}
    ${awardCard("🏅 MVP", orange?.name || purple?.name, "Impact")}
    ${awardCard("🔥 MOTM", dpl.completedMatches[0]?.motm || "Pending", "")}
  `;
}

function awardCard(title, player, value) {
  return `
    <article class="cap-card">
      <div class="avatar">${initials(player)}</div>
      <div>
        <span>${title}</span>
        <strong>${escapeHTML(player || "Pending")}</strong>
        <div class="metric">${escapeHTML(value)}</div>
      </div>
    </article>
  `;
}

function renderTeams() {
  const grid = qs("#teamsGrid");
  if (!grid) return;

  grid.innerHTML = dpl.teams
    .map(
      (team) => `
        <article class="team-card">
          <strong>${escapeHTML(team.name)}</strong>
          <span>Owner: ${escapeHTML(team.owner)} • Group ${escapeHTML(team.group)}</span>
          <ul>${(team.players || []).map((p) => `<li>${escapeHTML(p)}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
}

function renderCommentary() {
  const feed = qs("#commentaryFeed");
  if (!feed) return;

  feed.innerHTML = dpl.commentary
    .map(
      (item) => `
        <div class="commentary-item">
          <span class="commentary-time">${escapeHTML(item.time)}</span>
          <span>${escapeHTML(item.text)}</span>
        </div>
      `
    )
    .join("");
}

function renderRules() {
  const grid = qs("#scoringRulesGrid");
  const formula = qs("#scoringFormula");
  if (!grid) return;

  grid.innerHTML = `
    ${Object.values(dpl.scoringRules || {})
      .map(
        (rule) => `
          <article class="score-tile">
            <span>${rule.runs}R</span>
            <strong>${escapeHTML(rule.label)} / ${rule.balls} Ball</strong>
          </article>
        `
      )
      .join("")}
    ${Object.values(dpl.extraRules || {})
      .map(
        (rule) => `
          <article class="score-tile accent-blue">
            <span>${rule.runs}R</span>
            <strong>${escapeHTML(rule.label)} / Team Extra</strong>
          </article>
        `
      )
      .join("")}
  `;

  if (formula) formula.textContent = "Runs, Balls, Wickets, Powerplay, Imposter, Team Extras & Half-Score Engine Active";
}

/* ---------------- MODAL ---------------- */

function openMatchModal(index, collection) {
  const match = collection === "matches" ? dpl.matches[index] : dpl.completedMatches[index];
  if (!match) return;

  ensureScorecards(match);

  const a = collection === "matches" ? calculateTeamScore(match, match.teamA) : match.finalA;
  const b = collection === "matches" ? calculateTeamScore(match, match.teamB) : match.finalB;

  const modal = document.createElement("div");
  modal.className = "match-modal";

  modal.innerHTML = `
    <div class="match-modal-backdrop" data-close-modal></div>

    <section class="match-detail-panel">
      <div class="match-detail-header">
        <div>
          <p class="eyebrow">Full Scorecard</p>
          <h2>${escapeHTML(match.teamA)} vs ${escapeHTML(match.teamB)}</h2>
        </div>
        <button class="icon-btn" type="button" data-close-modal>Close</button>
      </div>

      <div class="match-detail-score">
        ${detailScore(match.teamA, a)}
        <div class="match-detail-center">
          <span class="fixture-tag">Week ${match.week} • Match ${match.matchNo}</span>
          <strong>${collection === "matches" ? match.innings : match.result}</strong>
          <small>Batting: ${escapeHTML(match.battingTeam)} | Bowling: ${escapeHTML(match.bowlingTeam)}</small>
        </div>
        ${detailScore(match.teamB, b)}
      </div>

      <h3>Batting Scorecard</h3>
      ${battingTable(match)}

      <h3>Bowling Scorecard — 3 Bowlers Per Team</h3>
      ${bowlingTable(match)}

      <h3>Team Extras</h3>
      ${teamExtrasTable(match)}

      <h3>Strategy</h3>
      <div class="score-meta">
        <span>Toss: ${escapeHTML(match.tossWinner || "Pending")}</span>
        <span>Decision: ${escapeHTML(match.tossDecision || "-")}</span>
        <span>Team A Imposter: ${escapeHTML(match.teamAImposter || "-")}</span>
        <span>Team B Imposter: ${escapeHTML(match.teamBImposter || "-")}</span>
        <span>Team A Openers: ${(match.teamAOpeners || []).map(escapeHTML).join(", ") || "-"}</span>
        <span>Team B Openers: ${(match.teamBOpeners || []).map(escapeHTML).join(", ") || "-"}</span>
      </div>
    </section>
  `;

  document.body.appendChild(modal);
  document.body.classList.add("modal-open");
}

function detailScore(team, score) {
  return `
    <article class="detail-team-score">
      <span>${escapeHTML(team)}</span>
      <strong>${score.runs}<small>/${score.wickets}</small></strong>
      <small>${score.balls} Balls • RR ${score.rr} • Extras ${score.extras}</small>
    </article>
  `;
}

function battingTable(match) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Team</th>
            <th>Runs</th>
            <th>Balls</th>
            <th>SR</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${(match.battingStats || [])
            .map((p) => {
              const calc = calculatePlayerBatting(p, match);
              return `
                <tr>
                  <td><strong>${escapeHTML(p.name)}</strong></td>
                  <td>${escapeHTML(p.team)}</td>
                  <td>${calc.runs}</td>
                  <td>${calc.balls}</td>
                  <td>${calc.sr}</td>
                  <td>${p.out ? "OUT / HALF SCORE" : calc.isOpener ? "OPENER POWERPLAY" : "ACTIVE"}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bowlingTable(match) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Bowler</th>
            <th>Team</th>
            <th>Day</th>
            <th>Wickets</th>
            <th>Specific Wkts</th>
            <th>Balls</th>
            <th>Runs Conceded</th>
            <th>Economy</th>
          </tr>
        </thead>
        <tbody>
          ${(match.bowlingStats || [])
            .map(
              (p) => `
                <tr>
                  <td><strong>${escapeHTML(p.name)}</strong></td>
                  <td>${escapeHTML(p.team)}</td>
                  <td>${escapeHTML(p.day || "-")}</td>
                  <td>${num(p.wickets)}</td>
                  <td>${num(p.specificWickets)}</td>
                  <td>${num(p.ballsBowled)}</td>
                  <td>${num(p.runsConceded)}</td>
                  <td>${economy(p.runsConceded, p.ballsBowled)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function teamExtrasTable(match) {
  const rows = [match.teamA, match.teamB]
    .map((team) => {
      const total = calculateTeamExtras(match, team);
      return `<tr><td>${escapeHTML(team)}</td><td>${total}</td></tr>`;
    })
    .join("");

  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>Team</th><th>Extra Runs</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function closeModal() {
  qsa(".match-modal").forEach((m) => m.remove());
  document.body.classList.remove("modal-open");
}

/* ---------------- ADMIN HELPERS ---------------- */

function isAuthed() {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "yes";
}

function field(label, id, value = "", type = "text") {
  return `
    <label class="field">
      <span>${escapeHTML(label)}</span>
      <input id="${escapeHTML(id)}" type="${type}" value="${escapeHTML(value)}" />
    </label>
  `;
}

function textarea(label, id, value = "") {
  return `
    <label class="field">
      <span>${escapeHTML(label)}</span>
      <textarea id="${escapeHTML(id)}" rows="4">${escapeHTML(value)}</textarea>
    </label>
  `;
}

function section(no, title, content) {
  return `
    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>${no}</span>
        <h3>${escapeHTML(title)}</h3>
      </div>
      ${content}
    </section>
  `;
}

/* ---------------- ADMIN RENDER ---------------- */

function renderAdmin() {
  const form = qs("#adminForm");
  if (!form) return;

  dpl.matches.forEach(ensureScorecards);

  if (!isAuthed()) {
    form.innerHTML = `
      <div class="admin-login-card">
        <div class="admin-section-title"><span>PW</span><h3>Admin Login</h3></div>
        <p class="admin-note">Enter password to manage complete DPL 2.0 scoring.</p>
        ${field("Password", "adminPassword", "", "password")}
        <button class="btn btn-live" type="button" data-login>Unlock Admin Panel</button>
      </div>
    `;
    return;
  }

  form.innerHTML = `
    <div class="admin-toolbar">
      <div>
        <p class="eyebrow">Advanced Control Room</p>
        <h2>DPL 2.0 Full Editable Engine</h2>
      </div>
      <div class="admin-toolbar-actions">
        <button class="mini-btn" type="button" data-export>Export</button>
        <button class="mini-btn" type="button" data-import>Import</button>
        <button class="mini-btn" type="button" data-reset>Reset</button>
        <button class="mini-btn" type="button" data-logout>Logout</button>
      </div>
    </div>

    ${section("01", "Website & League Settings", renderLeagueAdmin())}
    ${section("02", "Teams, Owners & Members", renderTeamsAdmin())}
    ${section("03", "Editable Individual Scoring Criteria", renderScoringCriteriaAdmin())}
    ${section("04", "Team Extras Scoring", renderTeamExtrasAdmin())}
    ${section("05", "Live Matches, Toss, Openers, Imposters & 3 Bowlers", renderMatchesAdmin())}
    ${section("06", "Player Batting Scorecards", renderBattingAdmin())}
    ${section("07", "Only 3 Bowlers Per Team", renderBowlingAdmin())}
    ${section("08", "Previous Results", renderCompletedAdmin())}
    ${section("09", "Commentary", renderCommentaryAdmin())}

    <div class="admin-actions">
      <button class="btn btn-live" type="submit">Save All Updates</button>
      <a class="btn btn-outline" href="dashboard.html">View Dashboard</a>
    </div>
  `;

  form.onsubmit = (event) => {
    event.preventDefault();
    collectAdminData();
    saveData();
    renderAll();
    renderAdmin();
  };
}

function renderLeagueAdmin() {
  return `
    <div class="admin-grid">
      ${field("Title", "league-title", dpl.league.title)}
      ${field("Subtitle", "league-subtitle", dpl.league.subtitle)}
      ${field("Eyebrow", "league-eyebrow", dpl.league.eyebrow)}
      ${field("Auction Date", "league-auction", dpl.league.auctionDate)}
      ${field("Duration", "league-duration", dpl.league.duration)}
      ${field("Total Matches", "league-matches", dpl.league.totalMatches, "number")}
      ${field("Total Players", "league-players", dpl.league.totalPlayers, "number")}
    </div>
  `;
}

function renderTeamsAdmin() {
  return `
    <div class="admin-rows">
      ${dpl.teams
        .map(
          (team, i) => `
          <div class="admin-row admin-row-wide">
            ${field("Team Name", `team-${i}-name`, team.name)}
            ${field("Owner", `team-${i}-owner`, team.owner)}
            ${field("Group", `team-${i}-group`, team.group)}
            ${textarea("Players - one per line", `team-${i}-players`, (team.players || []).join("\n"))}
            <button class="icon-btn" type="button" data-remove-team="${i}">Remove</button>
          </div>
        `
        )
        .join("")}
    </div>
    <button class="mini-btn" type="button" data-add-team>Add Team</button>
  `;
}

function renderScoringCriteriaAdmin() {
  return `
    <p class="admin-note">These criteria apply only to individual member batting score. Team Meetup and Power Date are handled separately as team extras.</p>
    <div class="admin-rows">
      ${Object.entries(dpl.scoringRules || {})
        .map(
          ([key, rule]) => `
          <div class="admin-row">
            ${field("Rule Key", `rule-${key}-key`, key)}
            ${field("Label", `rule-${key}-label`, rule.label)}
            ${field("Runs", `rule-${key}-runs`, rule.runs, "number")}
            ${field("Balls", `rule-${key}-balls`, rule.balls, "number")}
            <button class="icon-btn" type="button" data-remove-rule="${key}">Remove</button>
          </div>
        `
        )
        .join("")}
    </div>
    <button class="mini-btn" type="button" data-add-rule>Add Scoring Criteria</button>
  `;
}

function renderTeamExtrasAdmin() {
  return `
    <p class="admin-note">Team extras are added directly to the team total, not to individual member score.</p>

    <h3>Extra Rules</h3>
    <div class="admin-rows">
      ${Object.entries(dpl.extraRules || {})
        .map(
          ([key, rule]) => `
          <div class="admin-row">
            ${field("Extra Key", `extra-rule-${key}-key`, key)}
            ${field("Label", `extra-rule-${key}-label`, rule.label)}
            ${field("Runs", `extra-rule-${key}-runs`, rule.runs, "number")}
            <button class="icon-btn" type="button" data-remove-extra-rule="${key}">Remove</button>
          </div>
        `
        )
        .join("")}
    </div>
    <button class="mini-btn" type="button" data-add-extra-rule>Add Team Extra Criteria</button>

    <h3>Match-wise Team Extras</h3>
    <div class="admin-rows">
      ${dpl.matches
        .map(
          (match, mi) => `
          <div class="admin-row admin-row-wide">
            <strong>Match ${match.matchNo}: ${escapeHTML(match.teamA)} vs ${escapeHTML(match.teamB)}</strong>
            ${Object.entries(dpl.extraRules || {})
              .map(
                ([key, rule]) => `
                ${field(`${match.teamA} - ${rule.label}`, `extra-${mi}-A-${key}`, match.teamExtras?.[match.teamA]?.[key] || 0, "number")}
                ${field(`${match.teamB} - ${rule.label}`, `extra-${mi}-B-${key}`, match.teamExtras?.[match.teamB]?.[key] || 0, "number")}
              `
              )
              .join("")}
            ${field(`${match.teamA} Manual +/- Runs`, `extra-${mi}-teamA-adjust`, match.teamAExtraAdjustment || 0, "number")}
            ${field(`${match.teamB} Manual +/- Runs`, `extra-${mi}-teamB-adjust`, match.teamBExtraAdjustment || 0, "number")}
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

function renderMatchesAdmin() {
  return `
    <div class="admin-rows">
      ${dpl.matches
        .map(
          (m, i) => `
          <div class="admin-row admin-row-wide">
            ${field("Week", `match-${i}-week`, m.week, "number")}
            ${field("Match No", `match-${i}-matchNo`, m.matchNo, "number")}
            ${field("Team A", `match-${i}-teamA`, m.teamA)}
            ${field("Team B", `match-${i}-teamB`, m.teamB)}
            ${field("Batting Team", `match-${i}-battingTeam`, m.battingTeam)}
            ${field("Bowling Team", `match-${i}-bowlingTeam`, m.bowlingTeam)}
            ${field("Day", `match-${i}-day`, m.day, "number")}
            ${field("Innings", `match-${i}-innings`, m.innings)}
            ${field("Toss Winner", `match-${i}-tossWinner`, m.tossWinner)}
            ${field("Toss Decision", `match-${i}-tossDecision`, m.tossDecision)}
            ${textarea("Team A Openers", `match-${i}-teamAOpeners`, (m.teamAOpeners || []).join("\n"))}
            ${textarea("Team B Openers", `match-${i}-teamBOpeners`, (m.teamBOpeners || []).join("\n"))}
            ${textarea("Team A Bowlers - Only 3", `match-${i}-teamABowlers`, (m.teamABowlers || []).slice(0, 3).join("\n"))}
            ${textarea("Team B Bowlers - Only 3", `match-${i}-teamBBowlers`, (m.teamBBowlers || []).slice(0, 3).join("\n"))}
            ${field("Team A Imposter", `match-${i}-teamAImposter`, m.teamAImposter)}
            ${field("Team B Imposter", `match-${i}-teamBImposter`, m.teamBImposter)}

            <label class="field checkbox-field">
              <input id="match-${i}-powerplay" type="checkbox" ${m.powerplay ? "checked" : ""} />
              <span>Powerplay Active</span>
            </label>

            <button class="mini-btn" type="button" data-complete-match="${i}">Complete Match</button>
            <button class="icon-btn" type="button" data-remove-match="${i}">Remove</button>
          </div>
        `
        )
        .join("")}
    </div>
    <button class="mini-btn" type="button" data-add-match>Add Live Match</button>
  `;
}

function renderBattingAdmin() {
  return dpl.matches
    .map(
      (match, mi) => `
      <h3>Match ${match.matchNo}: ${escapeHTML(match.teamA)} vs ${escapeHTML(match.teamB)}</h3>
      <div class="admin-rows">
        ${(match.battingStats || [])
          .map(
            (p, pi) => `
            <div class="admin-row admin-row-wide">
              ${field("Player", `bat-${mi}-${pi}-name`, p.name)}
              ${field("Team", `bat-${mi}-${pi}-team`, p.team)}

              ${Object.entries(dpl.scoringRules || {})
                .map(([key, rule]) => field(rule.label, `bat-${mi}-${pi}-${key}`, p.activities?.[key] || 0, "number"))
                .join("")}

              ${field("Penalty Runs", `bat-${mi}-${pi}-penaltyRuns`, p.penaltyRuns || 0, "number")}
              ${field("Manual Bonus Runs", `bat-${mi}-${pi}-manualBonusRuns`, p.manualBonusRuns || 0, "number")}
              ${field("Manual Balls", `bat-${mi}-${pi}-manualBalls`, p.manualBalls || 0, "number")}
              ${field("Wicket Reason", `bat-${mi}-${pi}-wicketReason`, p.wicketReason || "")}

              <label class="field checkbox-field">
                <input id="bat-${mi}-${pi}-out" type="checkbox" ${p.out ? "checked" : ""} />
                <span>OUT / Future Score Half</span>
              </label>
            </div>
          `
          )
          .join("")}
      </div>
    `
    )
    .join("");
}

function renderBowlingAdmin() {
  return dpl.matches
    .map(
      (match, mi) => `
      <h3>Match ${match.matchNo}: ${escapeHTML(match.teamA)} vs ${escapeHTML(match.teamB)}</h3>
      <p class="admin-note">Only selected 3 bowlers per team appear here.</p>

      <div class="admin-rows">
        ${(match.bowlingStats || [])
          .map(
            (p, pi) => `
            <div class="admin-row">
              ${field("Bowler", `bowl-${mi}-${pi}-name`, p.name)}
              ${field("Team", `bowl-${mi}-${pi}-team`, p.team)}
              ${field("Bowling Day", `bowl-${mi}-${pi}-day`, p.day || "")}
              ${field("Wickets", `bowl-${mi}-${pi}-wickets`, p.wickets || 0, "number")}
              ${field("Specific Wickets", `bowl-${mi}-${pi}-specificWickets`, p.specificWickets || 0, "number")}
              ${field("Balls Bowled", `bowl-${mi}-${pi}-ballsBowled`, p.ballsBowled || 0, "number")}
              ${field("Runs Conceded", `bowl-${mi}-${pi}-runsConceded`, p.runsConceded || 0, "number")}
            </div>
          `
          )
          .join("")}
      </div>
    `
    )
    .join("");
}

function renderCompletedAdmin() {
  return `
    <div class="admin-rows">
      ${dpl.completedMatches
        .map(
          (m, i) => `
          <div class="admin-row">
            ${field("Match No", `completed-${i}-matchNo`, m.matchNo, "number")}
            ${field("Team A", `completed-${i}-teamA`, m.teamA)}
            ${field("Team B", `completed-${i}-teamB`, m.teamB)}
            ${field("Winner", `completed-${i}-winner`, m.winner || "")}
            ${field("Result", `completed-${i}-result`, m.result || "")}
            ${field("MOTM", `completed-${i}-motm`, m.motm || "")}
            <button class="icon-btn" type="button" data-remove-completed="${i}">Remove</button>
          </div>
        `
        )
        .join("") || `<div class="loading-card">No previous results yet.</div>`}
    </div>
  `;
}

function renderCommentaryAdmin() {
  return `
    <div class="admin-rows">
      ${dpl.commentary
        .map(
          (c, i) => `
          <div class="admin-row">
            ${field("Time", `commentary-${i}-time`, c.time)}
            ${field("Commentary", `commentary-${i}-text`, c.text)}
            <button class="icon-btn" type="button" data-remove-commentary="${i}">Remove</button>
          </div>
        `
        )
        .join("")}
    </div>
    <button class="mini-btn" type="button" data-add-commentary>Add Commentary</button>
  `;
}

/* ---------------- ADMIN COLLECT ---------------- */

function collectAdminData() {
  dpl.league.title = val("league-title", dpl.league.title);
  dpl.league.subtitle = val("league-subtitle", dpl.league.subtitle);
  dpl.league.eyebrow = val("league-eyebrow", dpl.league.eyebrow);
  dpl.league.auctionDate = val("league-auction", dpl.league.auctionDate);
  dpl.league.duration = val("league-duration", dpl.league.duration);
  dpl.league.totalMatches = valNum("league-matches", dpl.league.totalMatches);
  dpl.league.totalPlayers = valNum("league-players", dpl.league.totalPlayers);

  dpl.teams = dpl.teams.map((team, i) => ({
    name: val(`team-${i}-name`, team.name),
    owner: val(`team-${i}-owner`, team.owner),
    group: val(`team-${i}-group`, team.group),
    players: splitLines(val(`team-${i}-players`, "")),
  }));

  const nextRules = {};
  Object.keys(dpl.scoringRules || {}).forEach((oldKey) => {
    const newKey = val(`rule-${oldKey}-key`, oldKey);
    if (!newKey) return;
    nextRules[newKey] = {
      label: val(`rule-${oldKey}-label`, dpl.scoringRules[oldKey].label),
      runs: valNum(`rule-${oldKey}-runs`, dpl.scoringRules[oldKey].runs),
      balls: valNum(`rule-${oldKey}-balls`, dpl.scoringRules[oldKey].balls),
    };
  });
  dpl.scoringRules = nextRules;

  const nextExtraRules = {};
  Object.keys(dpl.extraRules || {}).forEach((oldKey) => {
    const newKey = val(`extra-rule-${oldKey}-key`, oldKey);
    if (!newKey) return;
    nextExtraRules[newKey] = {
      label: val(`extra-rule-${oldKey}-label`, dpl.extraRules[oldKey].label),
      runs: valNum(`extra-rule-${oldKey}-runs`, dpl.extraRules[oldKey].runs),
    };
  });
  dpl.extraRules = nextExtraRules;

  dpl.matches = dpl.matches.map((m, i) => {
    const updated = {
      ...m,
      week: valNum(`match-${i}-week`, m.week),
      matchNo: valNum(`match-${i}-matchNo`, m.matchNo),
      teamA: val(`match-${i}-teamA`, m.teamA),
      teamB: val(`match-${i}-teamB`, m.teamB),
      battingTeam: val(`match-${i}-battingTeam`, m.battingTeam),
      bowlingTeam: val(`match-${i}-bowlingTeam`, m.bowlingTeam),
      day: valNum(`match-${i}-day`, m.day),
      innings: val(`match-${i}-innings`, m.innings),
      tossWinner: val(`match-${i}-tossWinner`, m.tossWinner),
      tossDecision: val(`match-${i}-tossDecision`, m.tossDecision),
      teamAOpeners: splitLines(val(`match-${i}-teamAOpeners`, "")),
      teamBOpeners: splitLines(val(`match-${i}-teamBOpeners`, "")),
      teamABowlers: splitLines(val(`match-${i}-teamABowlers`, "")).slice(0, 3),
      teamBBowlers: splitLines(val(`match-${i}-teamBBowlers`, "")).slice(0, 3),
      teamAImposter: val(`match-${i}-teamAImposter`, m.teamAImposter),
      teamBImposter: val(`match-${i}-teamBImposter`, m.teamBImposter),
      powerplay: checked(`match-${i}-powerplay`),
    };

    updated.teamExtras = updated.teamExtras || {};
    updated.teamExtras[updated.teamA] = updated.teamExtras[updated.teamA] || {};
    updated.teamExtras[updated.teamB] = updated.teamExtras[updated.teamB] || {};

    Object.keys(dpl.extraRules || {}).forEach((key) => {
      updated.teamExtras[updated.teamA][key] = valNum(`extra-${i}-A-${key}`, updated.teamExtras?.[updated.teamA]?.[key] || 0);
      updated.teamExtras[updated.teamB][key] = valNum(`extra-${i}-B-${key}`, updated.teamExtras?.[updated.teamB]?.[key] || 0);
    });

    updated.teamAExtraAdjustment = valNum(`extra-${i}-teamA-adjust`, updated.teamAExtraAdjustment || 0);
    updated.teamBExtraAdjustment = valNum(`extra-${i}-teamB-adjust`, updated.teamBExtraAdjustment || 0);

    updated.battingStats = (m.battingStats || []).map((p, pi) => {
      const activities = {};
      Object.keys(dpl.scoringRules || {}).forEach((key) => {
        activities[key] = valNum(`bat-${i}-${pi}-${key}`, p.activities?.[key] || 0);
      });

      return {
        name: val(`bat-${i}-${pi}-name`, p.name),
        team: val(`bat-${i}-${pi}-team`, p.team),
        activities,
        out: checked(`bat-${i}-${pi}-out`),
        wicketReason: val(`bat-${i}-${pi}-wicketReason`, ""),
        penaltyRuns: valNum(`bat-${i}-${pi}-penaltyRuns`, 0),
        manualBonusRuns: valNum(`bat-${i}-${pi}-manualBonusRuns`, 0),
        manualBalls: valNum(`bat-${i}-${pi}-manualBalls`, 0),
      };
    });

    updated.bowlingStats = (m.bowlingStats || []).map((p, pi) => ({
      name: val(`bowl-${i}-${pi}-name`, p.name),
      team: val(`bowl-${i}-${pi}-team`, p.team),
      day: val(`bowl-${i}-${pi}-day`, p.day),
      wickets: valNum(`bowl-${i}-${pi}-wickets`, 0),
      specificWickets: valNum(`bowl-${i}-${pi}-specificWickets`, 0),
      ballsBowled: valNum(`bowl-${i}-${pi}-ballsBowled`, 0),
      runsConceded: valNum(`bowl-${i}-${pi}-runsConceded`, 0),
    }));

    ensureScorecards(updated);
    return updated;
  });

  dpl.completedMatches = dpl.completedMatches.map((m, i) => ({
    ...m,
    matchNo: valNum(`completed-${i}-matchNo`, m.matchNo),
    teamA: val(`completed-${i}-teamA`, m.teamA),
    teamB: val(`completed-${i}-teamB`, m.teamB),
    winner: val(`completed-${i}-winner`, m.winner),
    result: val(`completed-${i}-result`, m.result),
    motm: val(`completed-${i}-motm`, m.motm),
  }));

  dpl.commentary = dpl.commentary.map((c, i) => ({
    time: val(`commentary-${i}-time`, c.time),
    text: val(`commentary-${i}-text`, c.text),
  }));
}

/* ---------------- ACTIONS ---------------- */

document.addEventListener("click", (event) => {
  if (event.target.matches("[data-login]")) {
    if (val("adminPassword") === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "yes");
      renderAdmin();
    } else {
      alert("Wrong password");
    }
  }

  if (event.target.matches("[data-logout]")) {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    renderAdmin();
  }

  if (event.target.matches("[data-add-team]")) {
    collectAdminData();
    dpl.teams.push({ name: "New Team", owner: "Owner", group: "A", players: [] });
    saveData();
    renderAdmin();
  }

  if (event.target.matches("[data-remove-team]")) {
    collectAdminData();
    dpl.teams.splice(num(event.target.dataset.removeTeam), 1);
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-add-rule]")) {
    collectAdminData();
    const key = `rule${Date.now()}`;
    dpl.scoringRules[key] = { label: "New Criteria", runs: 1, balls: 1 };
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-remove-rule]")) {
    collectAdminData();
    delete dpl.scoringRules[event.target.dataset.removeRule];
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-add-extra-rule]")) {
    collectAdminData();
    const key = `extra${Date.now()}`;
    dpl.extraRules[key] = { label: "New Team Extra", runs: 1 };
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-remove-extra-rule]")) {
    collectAdminData();
    delete dpl.extraRules[event.target.dataset.removeExtraRule];
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-add-match]")) {
    collectAdminData();
    dpl.matches.push(createMatch(1, dpl.matches.length + 1, dpl.teams[0]?.name || "Team A", dpl.teams[1]?.name || "Team B"));
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-remove-match]")) {
    collectAdminData();
    dpl.matches.splice(num(event.target.dataset.removeMatch), 1);
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-complete-match]")) {
    collectAdminData();
    completeMatch(num(event.target.dataset.completeMatch));
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-remove-completed]")) {
    collectAdminData();
    dpl.completedMatches.splice(num(event.target.dataset.removeCompleted), 1);
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-add-commentary]")) {
    collectAdminData();
    dpl.commentary.unshift({
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      text: "New DPL update.",
    });
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-remove-commentary]")) {
    collectAdminData();
    dpl.commentary.splice(num(event.target.dataset.removeCommentary), 1);
    saveData();
    renderAll();
    renderAdmin();
  }

  if (event.target.matches("[data-export]")) {
    const blob = new Blob([JSON.stringify(dpl, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dpl-2-backup.json";
    link.click();
  }

  if (event.target.matches("[data-import]")) {
    const pasted = prompt("Paste backup JSON:");
    if (!pasted) return;

    try {
      dpl = normalizeData(JSON.parse(pasted));
      saveData();
      renderAll();
      renderAdmin();
    } catch {
      alert("Invalid JSON");
    }
  }

  if (event.target.matches("[data-reset]")) {
    if (!confirm("Reset all DPL data?")) return;
    localStorage.removeItem(STORAGE_KEY);
    dpl = normalizeData(clone(defaultData));
    renderAll();
    renderAdmin();
  }

  const openBtn = event.target.closest("[data-open-match]");
  if (openBtn) {
    openMatchModal(num(openBtn.dataset.openMatch), openBtn.dataset.collection);
  }

  if (event.target.closest("[data-close-modal]")) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

function completeMatch(index) {
  const match = dpl.matches[index];
  if (!match) return;

  ensureScorecards(match);

  const finalA = calculateTeamScore(match, match.teamA);
  const finalB = calculateTeamScore(match, match.teamB);

  const completed = {
    ...clone(match),
    status: "Completed",
    finalA,
    finalB,
    winner: getWinner(match),
    result: getResultText(match),
    completedAt: new Date().toISOString(),
  };

  dpl.completedMatches.unshift(completed);
  dpl.matches.splice(index, 1);

  dpl.commentary.unshift({
    time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    text: `${completed.result}. Match moved to previous results.`,
  });
}

/* ---------------- INIT ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  renderAdmin();
});
/* =====================================================
   DPL ADMIN PANEL SECTION TABS
   Paste at END of script.js
===================================================== */

let activeAdminTab = "league";

function adminTabButton(id, label) {
  return `
    <button
      class="mini-btn ${activeAdminTab === id ? "admin-tab-active" : ""}"
      type="button"
      data-admin-tab="${id}"
    >
      ${label}
    </button>
  `;
}

const oldRenderAdmin = renderAdmin;

renderAdmin = function () {
  const form = qs("#adminForm");
  if (!form) return;

  dpl.matches.forEach(ensureScorecards);

  if (!isAuthed()) {
    form.innerHTML = `
      <div class="admin-login-card">
        <div class="admin-section-title"><span>PW</span><h3>Admin Login</h3></div>
        <p class="admin-note">Enter password to manage complete DPL 2.0 scoring.</p>
        ${field("Password", "adminPassword", "", "password")}
        <button class="btn btn-live" type="button" data-login>Unlock Admin Panel</button>
      </div>
    `;
    return;
  }

  const tabContent = {
    league: section("01", "Website & League Settings", renderLeagueAdmin()),
    teams: section("02", "Teams, Owners & Members", renderTeamsAdmin()),
    scoring: section("03", "Editable Individual Scoring Criteria", renderScoringCriteriaAdmin()),
    extras: section("04", "Team Extras Scoring", renderTeamExtrasAdmin()),
    matches: section("05", "Live Matches, Toss, Openers, Imposters & 3 Bowlers", renderMatchesAdmin()),
    batting: section("06", "Player Batting Scorecards", renderBattingAdmin()),
    bowling: section("07", "Only 3 Bowlers Per Team", renderBowlingAdmin()),
    results: section("08", "Previous Results", renderCompletedAdmin()),
    commentary: section("09", "Commentary", renderCommentaryAdmin()),
  };

  form.innerHTML = `
    <div class="admin-toolbar">
      <div>
        <p class="eyebrow">Advanced Control Room</p>
        <h2>DPL 2.0 Admin Panel</h2>
        <p class="admin-note">Select one section below to edit. No more long scrolling.</p>
      </div>

      <div class="admin-toolbar-actions">
        <button class="mini-btn" type="button" data-export>Export</button>
        <button class="mini-btn" type="button" data-import>Import</button>
        <button class="mini-btn" type="button" data-reset>Reset</button>
        <button class="mini-btn" type="button" data-logout>Logout</button>
      </div>
    </div>

    <div class="admin-tabs">
      ${adminTabButton("league", "League")}
      ${adminTabButton("teams", "Teams")}
      ${adminTabButton("scoring", "Scoring")}
      ${adminTabButton("extras", "Team Extras")}
      ${adminTabButton("matches", "Matches")}
      ${adminTabButton("batting", "Batting")}
      ${adminTabButton("bowling", "Bowling")}
      ${adminTabButton("results", "Results")}
      ${adminTabButton("commentary", "Commentary")}
    </div>

    <div class="admin-tab-content">
      ${tabContent[activeAdminTab] || tabContent.league}
    </div>

    <div class="admin-actions">
      <button class="btn btn-live" type="submit">Save Updates</button>
      <a class="btn btn-outline" href="dashboard.html">View Dashboard</a>
    </div>
  `;

  form.onsubmit = (event) => {
    event.preventDefault();
    collectAdminData();
    saveData();
    renderAll();
    renderAdmin();
  };
};

document.addEventListener("click", function (event) {
  const tab = event.target.closest("[data-admin-tab]");
  if (!tab) return;

  collectAdminData();
  activeAdminTab = tab.dataset.adminTab;
  saveData(false);
  renderAdmin();
});

renderAdmin();
