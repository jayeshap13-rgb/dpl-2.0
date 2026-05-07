const STORAGE_KEY = "dpl-admin-data-v2";
const ADMIN_AUTH_KEY = "dpl-admin-authenticated";
const DEFAULT_ADMIN_PASSWORD = "DPL@2026";

const defaultData = {
  league: {
    title: "Diorite Premier League 2.0",
    subtitle: "Where Networking Meets Competition",
    eyebrow: "Business Cricket League",
    auctionDate: "15 May 2026",
    startDate: "19 May 2026",
    finale: "Cricket Match",
    totalPlayers: 36,
    totalTeams: 4,
    leagueWeeks: 6,
    matchesPerWeek: 2,
  },

  security: {
    adminPassword: DEFAULT_ADMIN_PASSWORD,
  },

  scoring: {
    powerplayMultiplier: 2,
    finalFormula: "Final Score = Runs - (Wickets × 2)",
    battingRules: [
      { label: "Referral", value: "1 Run", points: 1, accent: "green" },
      { label: "Visitor", value: "4 Runs", points: 4, accent: "orange" },
      { label: "Closed Business", value: "6 Runs", points: 6, accent: "red" },
    ],
    bowlingRules: [
      { label: "No referral", value: "1 Wicket", points: 1, accent: "purple" },
      { label: "Absent", value: "1 Wicket", points: 1, accent: "purple" },
    ],
  },

  weeklyMatches: [
    {
      week: 1,
      matchNo: 1,
      teamA: "Titans",
      teamB: "Warriors",
      battingTeam: "Titans",
      bowlingTeam: "Warriors",
      teamARuns: 48,
      teamAWickets: 3,
      teamBRuns: 30,
      teamBWickets: 2,
      day: 2,
      powerplay: true,
      status: "Live",
      performances: [
        {
          name: "Aarav Mehta",
          team: "Titans",
          runs: 18,
          referrals: 2,
          visitors: 2,
          closures: 1,
          wickets: 0,
          note: "Strong opening innings.",
        },
      ],
    },
    {
      week: 1,
      matchNo: 2,
      teamA: "Royals",
      teamB: "Blasters",
      battingTeam: "Royals",
      bowlingTeam: "Blasters",
      teamARuns: 22,
      teamAWickets: 1,
      teamBRuns: 18,
      teamBWickets: 2,
      day: 1,
      powerplay: true,
      status: "Live",
      performances: [],
    },
  ],

  completedMatches: [],

  leaderboard: [
    { team: "Titans", matches: 1, wins: 1, points: 2, nrr: "+1.20" },
    { team: "Warriors", matches: 1, wins: 0, points: 0, nrr: "-1.20" },
    { team: "Royals", matches: 1, wins: 1, points: 2, nrr: "+0.80" },
    { team: "Blasters", matches: 1, wins: 0, points: 0, nrr: "-0.80" },
  ],

  players: [
    { name: "Aarav Mehta", team: "Titans", runs: 66, visitors: 8, closures: 3, wickets: 3 },
    { name: "Nisha Rao", team: "Warriors", runs: 58, visitors: 11, closures: 2, wickets: 4 },
    { name: "Kabir Shah", team: "Royals", runs: 72, visitors: 5, closures: 4, wickets: 6 },
    { name: "Tara Kapoor", team: "Blasters", runs: 61, visitors: 7, closures: 5, wickets: 5 },
  ],

  auctionPlayers: [
    { name: "Aarav Mehta", role: "Referrals", rating: 92 },
    { name: "Nisha Rao", role: "Visitors", rating: 88 },
    { name: "Kabir Shah", role: "Closures", rating: 95 },
    { name: "Tara Kapoor", role: "Finisher", rating: 90 },
  ],

  teams: [
    {
      name: "Titans",
      captain: "Aarav Mehta",
      players: ["Aarav Mehta", "Maya Iyer", "Vivaan Joshi"],
    },
    {
      name: "Warriors",
      captain: "Nisha Rao",
      players: ["Nisha Rao", "Rohan Desai", "Neil Dutta"],
    },
    {
      name: "Royals",
      captain: "Kabir Shah",
      players: ["Kabir Shah", "Ira Sen", "Arjun Rao"],
    },
    {
      name: "Blasters",
      captain: "Tara Kapoor",
      players: ["Tara Kapoor", "Dev Malhotra", "Nikhil Roy"],
    },
  ],

  commentary: [
    { time: "12:42", text: "SIX! New visitor added." },
    { time: "12:35", text: "POWERPLAY activated. Runs count double." },
    { time: "12:28", text: "WICKET! No referral recorded." },
  ],
};

let dplData = loadLeagueData();
let autosaveTimer;

/* ---------- UTILS ---------- */

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function numberValue(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeScore(value, fallback = 0) {
  return Math.max(0, numberValue(value, fallback));
}

function clamp(value, min, max) {
  return Math.min(Math.max(numberValue(value), min), max);
}

function getValue(id, fallback = "") {
  const input = document.getElementById(id);
  return input ? input.value.trim() : fallback;
}

function getNumber(id, fallback = 0) {
  return safeScore(getValue(id, fallback), fallback);
}

function initials(name) {
  return String(name || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ---------- STORAGE ---------- */

function loadLeagueData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return clone(defaultData);
    return normalizeData({ ...clone(defaultData), ...JSON.parse(saved) });
  } catch {
    return clone(defaultData);
  }
}

function saveLeagueData(showToastMessage = true) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dplData));
    if (showToastMessage) showToast("Updates saved");
    return true;
  } catch {
    if (showToastMessage) showToast("Could not save locally");
    return false;
  }
}

function clearLeagueData() {
  localStorage.removeItem(STORAGE_KEY);
}

function isAdminAuthed() {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

function setAdminAuthed(value) {
  if (value) sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
  else sessionStorage.removeItem(ADMIN_AUTH_KEY);
}

/* ---------- NORMALIZE ---------- */

function normalizeData(data) {
  data.scoring = {
    ...defaultData.scoring,
    ...(data.scoring || {}),
    battingRules: Array.isArray(data.scoring?.battingRules)
      ? data.scoring.battingRules
      : defaultData.scoring.battingRules,
    bowlingRules: Array.isArray(data.scoring?.bowlingRules)
      ? data.scoring.bowlingRules
      : defaultData.scoring.bowlingRules,
  };

  data.weeklyMatches = Array.isArray(data.weeklyMatches) ? data.weeklyMatches : [];
  data.completedMatches = Array.isArray(data.completedMatches) ? data.completedMatches : [];

  data.weeklyMatches = data.weeklyMatches.map((match, index) => ({
    ...match,
    matchNo: match.matchNo || index + 1,
    battingTeam: match.battingTeam || match.teamA,
    bowlingTeam: match.bowlingTeam || match.teamB,
    status: "Live",
    performances: Array.isArray(match.performances) ? match.performances : [],
  }));

  return data;
}

/* ---------- TOAST + UI HELPERS ---------- */

function showToast(message) {
  const existing = document.querySelector(".dpl-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "dpl-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function injectUpgradeCss() {
  if (document.querySelector("#dpl-js-styles")) return;

  const style = document.createElement("style");
  style.id = "dpl-js-styles";
  style.textContent = `
    .dpl-toast {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 99999;
      padding: 14px 18px;
      border-radius: 14px;
      background: linear-gradient(135deg, #ff8a1f, #a855f7);
      color: white;
      font-weight: 900;
      opacity: 0;
      transform: translateY(18px);
      transition: .28s ease;
      box-shadow: 0 0 28px rgba(255,138,31,.35);
    }

    .dpl-toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    .live-clock {
      padding: .55rem .75rem;
      border-radius: 999px;
      background: rgba(35,213,255,.12);
      border: 1px solid rgba(35,213,255,.34);
      color: #23d5ff;
      font-size: .76rem;
      font-weight: 900;
    }

    .match-detail-panel {
      animation: dplModalIn .32s ease;
      max-height: 90vh;
      overflow-y: auto;
    }

    @keyframes dplModalIn {
      from { opacity: 0; transform: translateY(28px) scale(.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (max-width: 768px) {
      .dpl-toast {
        left: 12px;
        right: 12px;
        bottom: 12px;
        text-align: center;
      }
    }
  `;

  document.head.appendChild(style);
}

function addLiveClock() {
  const target = document.querySelector(".dashboard-top-actions, .admin-page-actions, .broadcast-topline");
  if (!target || document.querySelector("#liveClock")) return;

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

/* ---------- PUBLIC RENDER ---------- */

function renderLeagueShell() {
  const league = dplData.league;

  const title = document.querySelector("#leagueTitle");
  const subtitle = document.querySelector("#leagueSubtitle");
  const eyebrow = document.querySelector("#heroEyebrow");
  const fixtureStrip = document.querySelector("#fixtureStrip");
  const overviewGrid = document.querySelector("#overviewGrid");
  const homeScore = document.querySelector("#homeBroadcastScore");
  const homeLower = document.querySelector("#homeBroadcastLower");

  if (title) title.textContent = league.title;
  if (subtitle) subtitle.textContent = league.subtitle;
  if (eyebrow) eyebrow.textContent = league.eyebrow;

  if (fixtureStrip) {
    fixtureStrip.innerHTML = `
      <div><span>Auction</span><strong>${escapeHtml(league.auctionDate)}</strong></div>
      <div><span>League Start</span><strong>${escapeHtml(league.startDate)}</strong></div>
      <div><span>Finale</span><strong>${escapeHtml(league.finale)}</strong></div>
    `;
  }

  if (overviewGrid) {
    overviewGrid.innerHTML = `
      <article class="glass-stat"><span class="stat-number">${league.totalPlayers}</span><strong>Members</strong></article>
      <article class="glass-stat"><span class="stat-number">${league.totalTeams}</span><strong>Teams</strong></article>
      <article class="glass-stat"><span class="stat-number">12</span><strong>Total Matches</strong></article>
      <article class="glass-stat"><span class="stat-number">${league.leagueWeeks}</span><strong>Weeks League</strong></article>
      <article class="glass-stat"><span class="stat-number">${league.matchesPerWeek}</span><strong>Matches / Week</strong></article>
    `;
  }

  if (homeScore) {
    const match = dplData.weeklyMatches[0];
    if (match) {
      homeScore.dataset.matchIndex = "0";
      homeScore.dataset.matchCollection = "weeklyMatches";
      homeScore.innerHTML = `
        <span>${match.teamARuns}<span class="wicket">/${match.teamAWickets}</span></span>
        <small>${escapeHtml(match.teamA)} vs ${escapeHtml(match.teamB)} • Day ${match.day}</small>
      `;
    }
  }

  if (homeLower) {
    homeLower.innerHTML = `
      <strong>${league.totalPlayers} Members • ${league.totalTeams} Teams</strong>
      <span>${league.matchesPerWeek} matches every week. ${league.leagueWeeks} weeks. One champion.</span>
    `;
  }
}

function renderAuctionPlayers() {
  const container = document.querySelector("#auctionPlayers");
  if (!container) return;

  container.innerHTML = dplData.auctionPlayers
    .map(
      (player) => `
        <article class="player-card">
          <strong>${escapeHtml(player.name)}</strong>
          <span>Role: ${escapeHtml(player.role)}</span>
          <div class="rating-track">
            <i class="rating-bar" style="width:${clamp(player.rating, 0, 100)}%"></i>
          </div>
        </article>
      `
    )
    .join("");
}

function renderScoreboard() {
  const container = document.querySelector("#scoreboard");
  if (!container) return;

  container.innerHTML = `
    <div class="scoreboard-header">
      <span class="live-badge">LIVE</span>
      <span class="powerplay-badge">${dplData.weeklyMatches.length} LIVE MATCHES</span>
    </div>

    <div class="scoreboard-fixtures weekly-fixtures">
      ${dplData.weeklyMatches.map((match, index) => renderFixtureCard(match, index, "weeklyMatches")).join("")}
    </div>
  `;
}

function renderWeeklyFixtures() {
  document.querySelectorAll("#weeklyFixtures, #homeWeeklyFixtures").forEach((container) => {
    container.innerHTML =
      dplData.weeklyMatches.map((match, index) => renderFixtureCard(match, index, "weeklyMatches")).join("") ||
      `<div class="loading-card">No live matches available.</div>`;
  });
}

function renderCompletedMatches() {
  document.querySelectorAll("#completedMatches, #homeCompletedMatches").forEach((container) => {
    container.innerHTML =
      dplData.completedMatches.map((match, index) => renderFixtureCard(match, index, "completedMatches")).join("") ||
      `<div class="loading-card">No previous matches yet.</div>`;
  });
}

function renderFixtureCard(match, index, collection) {
  const result = collection === "completedMatches" ? match.result || getMatchResult(match) : getLiveStatus(match);

  return `
    <button class="fixture-card ${collection === "weeklyMatches" ? "is-live" : "is-completed"}"
      type="button"
      data-match-index="${index}"
      data-match-collection="${collection}">
      
      <div class="fixture-card-top">
        <span class="fixture-tag">Week ${match.week} / Match ${match.matchNo}</span>
        <span class="fixture-status">${escapeHtml(match.status)}</span>
      </div>

      <div class="fixture-score-row">
        <div>
          <strong>${escapeHtml(match.teamA)}</strong>
          <span>${match.teamARuns}/${match.teamAWickets}</span>
        </div>
        <em>vs</em>
        <div>
          <strong>${escapeHtml(match.teamB)}</strong>
          <span>${match.teamBRuns}/${match.teamBWickets}</span>
        </div>
      </div>

      <div class="score-meta">
        <span>Day ${match.day}</span>
        <span>Batting: ${escapeHtml(match.battingTeam || match.teamA)}</span>
        <span>Bowling: ${escapeHtml(match.bowlingTeam || match.teamB)}</span>
        ${match.powerplay ? "<span>Powerplay</span>" : ""}
        <span>${escapeHtml(result)}</span>
      </div>
    </button>
  `;
}

function getLiveStatus(match) {
  const lead = safeScore(match.teamARuns) - safeScore(match.teamBRuns);
  if (lead === 0) return "Scores level";
  return `${lead > 0 ? match.teamA : match.teamB} +${Math.abs(lead)} runs`;
}

function getMatchResult(match) {
  const lead = safeScore(match.teamARuns) - safeScore(match.teamBRuns);
  if (lead === 0) return "Match tied";
  return `${lead > 0 ? match.teamA : match.teamB} won by ${Math.abs(lead)} runs`;
}

function renderScoringRules() {
  const grid = document.querySelector("#scoringRulesGrid");
  const formula = document.querySelector("#scoringFormula");

  if (grid) {
    grid.innerHTML = `
      <article class="score-tile accent-blue"><span>Batting</span><strong>Run Scoring</strong></article>
      ${dplData.scoring.battingRules
        .map(
          (rule) => `
            <article class="score-tile accent-${escapeHtml(rule.accent)}">
              <span>${escapeHtml(rule.value)}</span>
              <strong>${escapeHtml(rule.label)}</strong>
            </article>
          `
        )
        .join("")}

      <article class="score-tile accent-purple"><span>Bowling</span><strong>Wickets / Pressure</strong></article>
      ${dplData.scoring.bowlingRules
        .map(
          (rule) => `
            <article class="score-tile accent-${escapeHtml(rule.accent)}">
              <span>${escapeHtml(rule.value)}</span>
              <strong>${escapeHtml(rule.label)}</strong>
            </article>
          `
        )
        .join("")}
    `;
  }

  if (formula) {
    formula.textContent = `${dplData.scoring.finalFormula} | Powerplay = ${dplData.scoring.powerplayMultiplier}X Runs`;
  }
}

function renderLeaderboard() {
  const body = document.querySelector("#leaderboardBody");
  if (!body) return;

  body.innerHTML = dplData.leaderboard
    .map(
      (row, index) => `
        <tr class="${index === 0 ? "top-team" : ""}">
          <td><span class="rank-dot"></span><strong>${escapeHtml(row.team)}</strong></td>
          <td>${row.matches}</td>
          <td>${row.wins}</td>
          <td>${row.points}</td>
          <td>${escapeHtml(row.nrr)}</td>
        </tr>
      `
    )
    .join("");
}

function renderCaps() {
  const container = document.querySelector("#capsStack");
  if (!container) return;

  const awards = [
    ["Orange Cap", "runs", "runs"],
    ["Purple Cap", "wickets", "wickets"],
    ["Power Player", "visitors", "visitors"],
    ["Best Finisher", "closures", "closures"],
  ];

  container.innerHTML = awards
    .map(([title, metric, label]) => {
      const player = [...dplData.players].sort((a, b) => safeScore(b[metric]) - safeScore(a[metric]))[0];
      return `
        <article class="cap-card">
          <div class="avatar">${escapeHtml(initials(player?.name || "NA"))}</div>
          <div>
            <span>${title}</span>
            <strong>${escapeHtml(player?.name || "No Player")}</strong>
            <div class="metric">${safeScore(player?.[metric])} ${label}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTeams() {
  const container = document.querySelector("#teamsGrid");
  if (!container) return;

  container.innerHTML = dplData.teams
    .map(
      (team) => `
        <article class="team-card">
          <strong>${escapeHtml(team.name)}</strong>
          <span>Captain: ${escapeHtml(team.captain)}</span>
          <ul>${team.players.map((player) => `<li>${escapeHtml(player)}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
}

function renderCommentary() {
  const container = document.querySelector("#commentaryFeed");
  if (!container) return;

  container.innerHTML = `
    <div class="commentary-list">
      ${dplData.commentary
        .map(
          (item) => `
            <div class="commentary-item">
              <span class="commentary-time">${escapeHtml(item.time)}</span>
              <span>${escapeHtml(item.text)}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

/* ---------- MODAL ---------- */

function openMatchDetails(index, collection) {
  const match = dplData[collection]?.[index];
  if (!match) return;

  let modal = document.querySelector("#matchDetailModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "matchDetailModal";
    modal.className = "match-modal";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="match-modal-backdrop" data-close-modal></div>
    <section class="match-detail-panel">
      <div class="match-detail-header">
        <div>
          <p class="eyebrow">Match Details</p>
          <h2>${escapeHtml(match.teamA)} vs ${escapeHtml(match.teamB)}</h2>
        </div>
        <button class="icon-btn" data-close-modal>Close</button>
      </div>

      <div class="match-detail-score">
        ${renderDetailTeamScore(match.teamA, match.teamARuns, match.teamAWickets)}
        <div class="match-detail-center">
          <span class="fixture-tag">Week ${match.week} / Match ${match.matchNo}</span>
          <strong>${escapeHtml(collection === "completedMatches" ? match.result : getLiveStatus(match))}</strong>
          <small>Batting: ${escapeHtml(match.battingTeam || match.teamA)} | Bowling: ${escapeHtml(match.bowlingTeam || match.teamB)}</small>
        </div>
        ${renderDetailTeamScore(match.teamB, match.teamBRuns, match.teamBWickets)}
      </div>
    </section>
  `;

  modal.hidden = false;
  document.body.classList.add("modal-open");
}

function renderDetailTeamScore(team, runs, wickets) {
  return `
    <article class="detail-team-score">
      <span>${escapeHtml(team)}</span>
      <strong>${safeScore(runs)}<small>/${safeScore(wickets)}</small></strong>
    </article>
  `;
}

function closeMatchDetails() {
  const modal = document.querySelector("#matchDetailModal");
  if (!modal) return;
  modal.hidden = true;
  modal.innerHTML = "";
  document.body.classList.remove("modal-open");
}

/* ---------- ADMIN ---------- */

function field(label, id, value, type = "text") {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <input id="${escapeHtml(id)}" type="${type}" value="${escapeHtml(value)}" />
    </label>
  `;
}

function textarea(label, id, value) {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <textarea id="${escapeHtml(id)}" rows="4">${escapeHtml(value)}</textarea>
    </label>
  `;
}

function renderAdminPanel(message = "") {
  const form = document.querySelector("#adminForm");
  if (!form) return;

  if (!isAdminAuthed()) {
    renderAdminLogin(message);
    return;
  }

  form.innerHTML = `
    <div class="admin-toolbar">
      <div>
        <p class="eyebrow">DPL 2.0 Admin</p>
        <h2>League Control Panel</h2>
      </div>
      <div class="admin-toolbar-actions">
        <div class="admin-status" id="adminStatus">${escapeHtml(message)}</div>
        <button class="mini-btn" type="button" id="exportBackupBtn">Export Backup</button>
        <button class="mini-btn" type="button" id="logoutAdmin">Logout</button>
      </div>
    </div>

    ${adminSection("01", "League Identity", renderLeagueEditor())}
    ${adminSection("02", "Live Matches", renderLiveMatchesEditor(), "Add/remove live matches, change batting/bowling team, and complete match.")}
    ${adminSection("03", "Previous Matches", renderCompletedEditor(), "Completed live matches appear here.")}
    ${adminSection("04", "Batting Criteria", renderCriteriaEditor("battingRules"), "Add/remove batting scoring rules.")}
    ${adminSection("05", "Bowling / Wicket Criteria", renderCriteriaEditor("bowlingRules"), "Add/remove bowling and wicket rules.")}
    ${adminSection("06", "Leaderboard", renderLeaderboardEditor())}
    ${adminSection("07", "Players / Awards", renderPlayersEditor())}
    ${adminSection("08", "Auction Players", renderAuctionEditor())}
    ${adminSection("09", "Teams", renderTeamsEditor())}
    ${adminSection("10", "Commentary", renderCommentaryEditor())}

    <div class="admin-actions">
      <button class="btn btn-live" type="submit">Save Updates</button>
      <button class="btn btn-outline" type="button" id="resetData">Reset Demo Data</button>
    </div>
  `;

  form.onsubmit = handleAdminSubmit;
  form.onclick = handleAdminClick;
}

function adminSection(no, title, content, helper = "") {
  return `
    <section class="admin-panel-card">
      <div class="admin-section-title"><span>${no}</span><h3>${title}</h3></div>
      ${helper ? `<p class="admin-helper">${helper}</p>` : ""}
      ${content}
    </section>
  `;
}

function renderAdminLogin(message = "") {
  const form = document.querySelector("#adminForm");
  if (!form) return;

  form.innerHTML = `
    <section class="admin-login-card">
      <div class="admin-section-title"><span>PW</span><h3>Password Required</h3></div>
      <p class="admin-note">Enter admin password to edit DPL data.</p>
      ${field("Password", "adminLoginPassword", "", "password")}
      <div class="admin-status">${escapeHtml(message)}</div>
      <div class="admin-actions static-actions">
        <button class="btn btn-live" type="submit">Unlock Admin Panel</button>
      </div>
    </section>
  `;

  form.onsubmit = handleAdminLogin;
}

function renderLeagueEditor() {
  return `
    <div class="admin-grid">
      ${field("Title", "league-title", dplData.league.title)}
      ${field("Subtitle", "league-subtitle", dplData.league.subtitle)}
      ${field("Auction Date", "league-auction", dplData.league.auctionDate)}
      ${field("Start Date", "league-start", dplData.league.startDate)}
      ${field("Finale", "league-finale", dplData.league.finale)}
    </div>
  `;
}

function renderLiveMatchesEditor() {
  return `
    <div class="admin-rows">
      ${dplData.weeklyMatches.map(renderLiveMatchRow).join("")}
    </div>
    <button class="mini-btn" type="button" data-add="liveMatch">Add Live Match</button>
  `;
}

function renderLiveMatchRow(match, index) {
  return `
    <div class="admin-row admin-row-fixture">
      ${field("Week", `live-${index}-week`, match.week, "number")}
      ${field("Match No", `live-${index}-matchNo`, match.matchNo, "number")}
      ${field("Team A", `live-${index}-teamA`, match.teamA)}
      ${field("A Runs", `live-${index}-teamARuns`, match.teamARuns, "number")}
      ${field("A Wickets", `live-${index}-teamAWickets`, match.teamAWickets, "number")}
      ${field("Team B", `live-${index}-teamB`, match.teamB)}
      ${field("B Runs", `live-${index}-teamBRuns`, match.teamBRuns, "number")}
      ${field("B Wickets", `live-${index}-teamBWickets`, match.teamBWickets, "number")}
      ${field("Batting Team", `live-${index}-battingTeam`, match.battingTeam || match.teamA)}
      ${field("Bowling Team", `live-${index}-bowlingTeam`, match.bowlingTeam || match.teamB)}
      ${field("Day", `live-${index}-day`, match.day, "number")}

      <label class="field checkbox-field">
        <input type="checkbox" id="live-${index}-powerplay" ${match.powerplay ? "checked" : ""} />
        <span>Powerplay</span>
      </label>

      <button class="mini-btn" type="button" data-complete="${index}">Complete</button>
      <button class="icon-btn danger" type="button" data-remove="weeklyMatches" data-index="${index}">Remove</button>
    </div>
  `;
}

function renderCompletedEditor() {
  return `
    <div class="admin-rows">
      ${dplData.completedMatches.map(renderCompletedRow).join("") || `<div class="loading-card">No previous matches yet.</div>`}
    </div>
    <button class="mini-btn" type="button" data-add="completedMatch">Add Previous Match</button>
  `;
}

function renderCompletedRow(match, index) {
  return `
    <div class="admin-row admin-row-fixture">
      ${field("Week", `completed-${index}-week`, match.week, "number")}
      ${field("Match No", `completed-${index}-matchNo`, match.matchNo, "number")}
      ${field("Team A", `completed-${index}-teamA`, match.teamA)}
      ${field("A Runs", `completed-${index}-teamARuns`, match.teamARuns, "number")}
      ${field("A Wickets", `completed-${index}-teamAWickets`, match.teamAWickets, "number")}
      ${field("Team B", `completed-${index}-teamB`, match.teamB)}
      ${field("B Runs", `completed-${index}-teamBRuns`, match.teamBRuns, "number")}
      ${field("B Wickets", `completed-${index}-teamBWickets`, match.teamBWickets, "number")}
      ${field("Result", `completed-${index}-result`, match.result || getMatchResult(match))}
      <button class="icon-btn danger" type="button" data-remove="completedMatches" data-index="${index}">Remove</button>
    </div>
  `;
}

function renderCriteriaEditor(type) {
  return `
    <div class="admin-rows">
      ${dplData.scoring[type].map((rule, index) => `
        <div class="admin-row">
          ${field("Criteria", `${type}-${index}-label`, rule.label)}
          ${field("Display", `${type}-${index}-value`, rule.value)}
          ${field("Points", `${type}-${index}-points`, rule.points, "number")}
          ${field("Accent", `${type}-${index}-accent`, rule.accent)}
          <button class="icon-btn danger" type="button" data-remove-criteria="${type}" data-index="${index}">Remove</button>
        </div>
      `).join("")}
    </div>
    <button class="mini-btn" type="button" data-add-criteria="${type}">
      Add ${type === "battingRules" ? "Batting" : "Bowling"} Criteria
    </button>
  `;
}

function renderLeaderboardEditor() {
  return `
    <div class="admin-rows">
      ${dplData.leaderboard.map((row, index) => `
        <div class="admin-row">
          ${field("Team", `leader-${index}-team`, row.team)}
          ${field("Matches", `leader-${index}-matches`, row.matches, "number")}
          ${field("Wins", `leader-${index}-wins`, row.wins, "number")}
          ${field("Points", `leader-${index}-points`, row.points, "number")}
          ${field("NRR", `leader-${index}-nrr`, row.nrr)}
          <button class="icon-btn danger" type="button" data-remove="leaderboard" data-index="${index}">Remove</button>
        </div>
      `).join("")}
    </div>
    <button class="mini-btn" type="button" data-add="leaderboard">Add Team Row</button>
  `;
}

function renderPlayersEditor() {
  return `
    <div class="admin-rows">
      ${dplData.players.map((player, index) => `
        <div class="admin-row">
          ${field("Name", `player-${index}-name`, player.name)}
          ${field("Team", `player-${index}-team`, player.team || "")}
          ${field("Runs", `player-${index}-runs`, player.runs, "number")}
          ${field("Visitors", `player-${index}-visitors`, player.visitors, "number")}
          ${field("Closures", `player-${index}-closures`, player.closures, "number")}
          ${field("Wickets", `player-${index}-wickets`, player.wickets, "number")}
          <button class="icon-btn danger" type="button" data-remove="players" data-index="${index}">Remove</button>
        </div>
      `).join("")}
    </div>
    <button class="mini-btn" type="button" data-add="players">Add Player</button>
  `;
}

function renderAuctionEditor() {
  return `
    <div class="admin-rows">
      ${dplData.auctionPlayers.map((player, index) => `
        <div class="admin-row">
          ${field("Name", `auction-${index}-name`, player.name)}
          ${field("Role", `auction-${index}-role`, player.role)}
          ${field("Rating", `auction-${index}-rating`, player.rating, "number")}
          <button class="icon-btn danger" type="button" data-remove="auctionPlayers" data-index="${index}">Remove</button>
        </div>
      `).join("")}
    </div>
    <button class="mini-btn" type="button" data-add="auctionPlayers">Add Auction Player</button>
  `;
}

function renderTeamsEditor() {
  return `
    <div class="admin-rows">
      ${dplData.teams.map((team, index) => `
        <div class="admin-row admin-row-wide">
          ${field("Team Name", `team-${index}-name`, team.name)}
          ${field("Captain", `team-${index}-captain`, team.captain)}
          ${textarea("Players, one per line", `team-${index}-players`, team.players.join("\n"))}
          <button class="icon-btn danger" type="button" data-remove="teams" data-index="${index}">Remove</button>
        </div>
      `).join("")}
    </div>
    <button class="mini-btn" type="button" data-add="teams">Add Team</button>
  `;
}

function renderCommentaryEditor() {
  return `
    <div class="admin-rows">
      ${dplData.commentary.map((item, index) => `
        <div class="admin-row">
          ${field("Time", `commentary-${index}-time`, item.time)}
          ${field("Text", `commentary-${index}-text`, item.text)}
          <button class="icon-btn danger" type="button" data-remove="commentary" data-index="${index}">Remove</button>
        </div>
      `).join("")}
    </div>
    <button class="mini-btn" type="button" data-add="commentary">Add Commentary</button>
  `;
}

/* ---------- ADMIN ACTIONS ---------- */

function handleAdminLogin(event) {
  event.preventDefault();

  if (getValue("adminLoginPassword") === dplData.security.adminPassword) {
    setAdminAuthed(true);
    renderAdminPanel("Admin unlocked.");
    showToast("Admin unlocked");
  } else {
    renderAdminLogin("Incorrect password.");
  }
}

function handleAdminSubmit(event) {
  event.preventDefault();
  dplData = collectAdminFormData();
  saveLeagueData();
  renderAll();
  renderAdminPanel("Saved successfully.");
}

function handleAdminClick(event) {
  const completeBtn = event.target.closest("[data-complete]");
  if (completeBtn) {
    completeMatch(Number(completeBtn.dataset.complete));
    return;
  }

  const removeBtn = event.target.closest("[data-remove]");
  if (removeBtn) {
    dplData = collectAdminFormData();
    dplData[removeBtn.dataset.remove].splice(Number(removeBtn.dataset.index), 1);
    saveLeagueData();
    renderAll();
    renderAdminPanel("Removed successfully.");
    return;
  }

  const addBtn = event.target.closest("[data-add]");
  if (addBtn) {
    dplData = collectAdminFormData();
    addItem(addBtn.dataset.add);
    saveLeagueData();
    renderAll();
    renderAdminPanel("Added successfully.");
    return;
  }

  const addCriteriaBtn = event.target.closest("[data-add-criteria]");
  if (addCriteriaBtn) {
    dplData = collectAdminFormData();
    dplData.scoring[addCriteriaBtn.dataset.addCriteria].push({
      label: "New Criteria",
      value: "1",
      points: 1,
      accent: "blue",
    });
    saveLeagueData();
    renderAll();
    renderAdminPanel("Criteria added.");
    return;
  }

  const removeCriteriaBtn = event.target.closest("[data-remove-criteria]");
  if (removeCriteriaBtn) {
    dplData = collectAdminFormData();
    dplData.scoring[removeCriteriaBtn.dataset.removeCriteria].splice(Number(removeCriteriaBtn.dataset.index), 1);
    saveLeagueData();
    renderAll();
    renderAdminPanel("Criteria removed.");
    return;
  }

  if (event.target.closest("#logoutAdmin")) {
    setAdminAuthed(false);
    renderAdminPanel("Logged out.");
    return;
  }

  if (event.target.closest("#resetData")) {
    dplData = clone(defaultData);
    clearLeagueData();
    setAdminAuthed(false);
    renderAll();
    renderAdminPanel("Demo data restored.");
    return;
  }

  if (event.target.closest("#exportBackupBtn")) {
    exportLeagueData();
  }
}

function completeMatch(index) {
  dplData = collectAdminFormData();

  const match = dplData.weeklyMatches[index];
  if (!match) return;

  const completed = {
    ...match,
    status: "Completed",
    day: 6,
    powerplay: false,
    result: getMatchResult(match),
  };

  dplData.completedMatches.unshift(completed);
  dplData.weeklyMatches.splice(index, 1);

  saveLeagueData();
  renderAll();
  renderAdminPanel("Match completed and moved to Previous Matches.");
  showToast("Match completed");
}

function addItem(type) {
  const map = {
    liveMatch: {
      week: 1,
      matchNo: dplData.weeklyMatches.length + 1,
      teamA: "Team A",
      teamB: "Team B",
      battingTeam: "Team A",
      bowlingTeam: "Team B",
      teamARuns: 0,
      teamAWickets: 0,
      teamBRuns: 0,
      teamBWickets: 0,
      day: 1,
      powerplay: false,
      status: "Live",
      performances: [],
    },
    completedMatch: {
      week: 1,
      matchNo: dplData.completedMatches.length + 1,
      teamA: "Team A",
      teamB: "Team B",
      battingTeam: "Team A",
      bowlingTeam: "Team B",
      teamARuns: 0,
      teamAWickets: 0,
      teamBRuns: 0,
      teamBWickets: 0,
      day: 6,
      powerplay: false,
      status: "Completed",
      result: "Result pending",
      performances: [],
    },
    leaderboard: { team: "New Team", matches: 0, wins: 0, points: 0, nrr: "+0.00" },
    players: { name: "New Player", team: "Team", runs: 0, visitors: 0, closures: 0, wickets: 0 },
    auctionPlayers: { name: "New Player", role: "Role", rating: 80 },
    teams: { name: "New Team", captain: "Captain", players: ["Player 1"] },
    commentary: { time: "00:00", text: "New update." },
  };

  if (type === "liveMatch") dplData.weeklyMatches.push(map.liveMatch);
  else if (type === "completedMatch") dplData.completedMatches.push(map.completedMatch);
  else dplData[type].push(map[type]);
}

/* ---------- FORM COLLECTION ---------- */

function collectAdminFormData() {
  return {
    ...dplData,

    league: {
      ...dplData.league,
      title: getValue("league-title", dplData.league.title),
      subtitle: getValue("league-subtitle", dplData.league.subtitle),
      auctionDate: getValue("league-auction", dplData.league.auctionDate),
      startDate: getValue("league-start", dplData.league.startDate),
      finale: getValue("league-finale", dplData.league.finale),
    },

    weeklyMatches: dplData.weeklyMatches.map((match, index) => ({
      ...match,
      week: getNumber(`live-${index}-week`, match.week),
      matchNo: getNumber(`live-${index}-matchNo`, match.matchNo),
      teamA: getValue(`live-${index}-teamA`, match.teamA),
      teamB: getValue(`live-${index}-teamB`, match.teamB),
      teamARuns: getNumber(`live-${index}-teamARuns`, match.teamARuns),
      teamAWickets: getNumber(`live-${index}-teamAWickets`, match.teamAWickets),
      teamBRuns: getNumber(`live-${index}-teamBRuns`, match.teamBRuns),
      teamBWickets: getNumber(`live-${index}-teamBWickets`, match.teamBWickets),
      battingTeam: getValue(`live-${index}-battingTeam`, match.battingTeam),
      bowlingTeam: getValue(`live-${index}-bowlingTeam`, match.bowlingTeam),
      day: clamp(getNumber(`live-${index}-day`, match.day), 1, 6),
      powerplay: Boolean(document.getElementById(`live-${index}-powerplay`)?.checked),
      status: "Live",
    })),

    completedMatches: dplData.completedMatches.map((match, index) => ({
      ...match,
      week: getNumber(`completed-${index}-week`, match.week),
      matchNo: getNumber(`completed-${index}-matchNo`, match.matchNo),
      teamA: getValue(`completed-${index}-teamA`, match.teamA),
      teamB: getValue(`completed-${index}-teamB`, match.teamB),
      teamARuns: getNumber(`completed-${index}-teamARuns`, match.teamARuns),
      teamAWickets: getNumber(`completed-${index}-teamAWickets`, match.teamAWickets),
      teamBRuns: getNumber(`completed-${index}-teamBRuns`, match.teamBRuns),
      teamBWickets: getNumber(`completed-${index}-teamBWickets`, match.teamBWickets),
      result: getValue(`completed-${index}-result`, match.result),
      status: "Completed",
    })),

    scoring: {
      ...dplData.scoring,
      battingRules: dplData.scoring.battingRules.map((rule, index) => ({
        label: getValue(`battingRules-${index}-label`, rule.label),
        value: getValue(`battingRules-${index}-value`, rule.value),
        points: getNumber(`battingRules-${index}-points`, rule.points),
        accent: getValue(`battingRules-${index}-accent`, rule.accent),
      })),
      bowlingRules: dplData.scoring.bowlingRules.map((rule, index) => ({
        label: getValue(`bowlingRules-${index}-label`, rule.label),
        value: getValue(`bowlingRules-${index}-value`, rule.value),
        points: getNumber(`bowlingRules-${index}-points`, rule.points),
        accent: getValue(`bowlingRules-${index}-accent`, rule.accent),
      })),
    },

    leaderboard: dplData.leaderboard.map((row, index) => ({
      team: getValue(`leader-${index}-team`, row.team),
      matches: getNumber(`leader-${index}-matches`, row.matches),
      wins: getNumber(`leader-${index}-wins`, row.wins),
      points: getNumber(`leader-${index}-points`, row.points),
      nrr: getValue(`leader-${index}-nrr`, row.nrr),
    })),

    players: dplData.players.map((player, index) => ({
      name: getValue(`player-${index}-name`, player.name),
      team: getValue(`player-${index}-team`, player.team),
      runs: getNumber(`player-${index}-runs`, player.runs),
      visitors: getNumber(`player-${index}-visitors`, player.visitors),
      closures: getNumber(`player-${index}-closures`, player.closures),
      wickets: getNumber(`player-${index}-wickets`, player.wickets),
    })),

    auctionPlayers: dplData.auctionPlayers.map((player, index) => ({
      name: getValue(`auction-${index}-name`, player.name),
      role: getValue(`auction-${index}-role`, player.role),
      rating: getNumber(`auction-${index}-rating`, player.rating),
    })),

    teams: dplData.teams.map((team, index) => ({
      name: getValue(`team-${index}-name`, team.name),
      captain: getValue(`team-${index}-captain`, team.captain),
      players: getValue(`team-${index}-players`, team.players.join("\n"))
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    })),

    commentary: dplData.commentary.map((item, index) => ({
      time: getValue(`commentary-${index}-time`, item.time),
      text: getValue(`commentary-${index}-text`, item.text),
    })),
  };
}

/* ---------- BACKUP + AUTOSAVE ---------- */

function exportLeagueData() {
  const blob = new Blob([JSON.stringify(dplData, null, 2)], {
    type: "application/json",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dpl-2-backup.json";
  link.click();

  URL.revokeObjectURL(link.href);
  showToast("Backup downloaded");
}

function triggerAutosave() {
  if (!document.querySelector("#adminForm") || !isAdminAuthed()) return;

  clearTimeout(autosaveTimer);

  autosaveTimer = setTimeout(() => {
    try {
      dplData = collectAdminFormData();
      saveLeagueData(false);
      renderAll();
      const status = document.querySelector("#adminStatus");
      if (status) status.textContent = "Autosaved";
    } catch {}
  }, 1200);
}

/* ---------- BOOT ---------- */

function renderAll() {
  renderLeagueShell();
  renderAuctionPlayers();
  renderScoreboard();
  renderWeeklyFixtures();
  renderCompletedMatches();
  renderScoringRules();
  renderLeaderboard();
  renderCaps();
  renderTeams();
  renderCommentary();
  addLiveClock();
}

document.addEventListener("click", (event) => {
  const fixture = event.target.closest("[data-match-index]");
  if (fixture) {
    openMatchDetails(Number(fixture.dataset.matchIndex), fixture.dataset.matchCollection);
    return;
  }

  if (event.target.closest("[data-close-modal]")) closeMatchDetails();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMatchDetails();
});

document.addEventListener("input", (event) => {
  if (event.target.closest("#adminForm")) triggerAutosave();
});

document.addEventListener("change", (event) => {
  if (event.target.closest("#adminForm")) triggerAutosave();
});

injectUpgradeCss();
renderAll();
renderAdminPanel();
