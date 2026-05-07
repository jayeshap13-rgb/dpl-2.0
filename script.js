const STORAGE_KEY = "dpl-admin-data-v1";
const ADMIN_AUTH_KEY = "dpl-admin-authenticated";
const DEFAULT_ADMIN_PASSWORD = "DPL@2026";

const defaultData = {
  league: {
    title: "Diorite Premier League",
    subtitle: "Where Networking Meets Competition",
    eyebrow: "Business Cricket League",
    auctionDate: "15 May",
    startDate: "19 May",
    finale: "Cricket Match",
    totalPlayers: 36,
    totalTeams: 4,
    auctionLabel: "Bid",
    leagueWeeks: 6,
    matchesPerWeek: 2,
  },
  security: {
    adminPassword: DEFAULT_ADMIN_PASSWORD,
  },
  match: {
    teamA: { name: "Titans", runs: 48, wickets: 3 },
    teamB: { name: "Warriors", runs: 30, wickets: 2 },
    day: 2,
    powerplay: true,
  },
  auctionPlayers: [
    { name: "Aarav Mehta", role: "Referrals", rating: 92 },
    { name: "Nisha Rao", role: "Visitors", rating: 88 },
    { name: "Kabir Shah", role: "Closures", rating: 95 },
    { name: "Maya Iyer", role: "Referrals", rating: 84 },
    { name: "Rohan Desai", role: "Visitors", rating: 80 },
    { name: "Tara Kapoor", role: "Closures", rating: 90 },
    { name: "Dev Malhotra", role: "Referrals", rating: 78 },
    { name: "Ira Sen", role: "Visitors", rating: 86 },
  ],
  leaderboard: [
    { team: "Titans", matches: 3, wins: 3, points: 6, nrr: "+1.82" },
    { team: "Warriors", matches: 3, wins: 2, points: 4, nrr: "+0.64" },
    { team: "Royals", matches: 3, wins: 1, points: 2, nrr: "-0.28" },
    { team: "Blasters", matches: 3, wins: 0, points: 0, nrr: "-2.18" },
  ],
  scoring: {
    powerplayMultiplier: 2,
    finalFormula: "Final Score = Runs - (Wickets x 2)",
    rules: [
      { label: "Referral", value: "1 Run", points: 1, type: "runs", accent: "green" },
      { label: "Visitor", value: "4 Runs", points: 4, type: "runs", accent: "orange" },
      { label: "Business", value: "6 Runs", points: 6, type: "runs", accent: "red" },
      { label: "No referral / absent", value: "1 Wicket", points: 1, type: "wicket", accent: "purple" },
    ],
  },
  weeklyMatches: [
    {
      week: 1,
      matchNo: 1,
      teamA: "Titans",
      teamB: "Warriors",
      teamARuns: 48,
      teamAWickets: 3,
      teamBRuns: 30,
      teamBWickets: 2,
      day: 2,
      powerplay: true,
      status: "Live",
      performances: [
        { name: "Aarav Mehta", team: "Titans", runs: 18, referrals: 2, visitors: 2, closures: 1, wickets: 0, note: "Opened the innings with a closure and two visitors." },
        { name: "Maya Iyer", team: "Titans", runs: 14, referrals: 2, visitors: 3, closures: 0, wickets: 0, note: "Kept the Titans run rate moving." },
        { name: "Nisha Rao", team: "Warriors", runs: 16, referrals: 1, visitors: 2, closures: 1, wickets: 0, note: "Best response from Warriors so far." },
        { name: "Rohan Desai", team: "Warriors", runs: 8, referrals: 0, visitors: 2, closures: 0, wickets: 1, note: "Visitor points, but one wicket for no referral." },
      ],
    },
    {
      week: 1,
      matchNo: 2,
      teamA: "Royals",
      teamB: "Blasters",
      teamARuns: 22,
      teamAWickets: 1,
      teamBRuns: 18,
      teamBWickets: 2,
      day: 1,
      powerplay: true,
      status: "Live",
      performances: [
        { name: "Kabir Shah", team: "Royals", runs: 12, referrals: 2, visitors: 1, closures: 1, wickets: 0, note: "Fast start in the powerplay." },
        { name: "Ira Sen", team: "Royals", runs: 10, referrals: 2, visitors: 2, closures: 0, wickets: 0, note: "Strong visitor contribution." },
        { name: "Tara Kapoor", team: "Blasters", runs: 14, referrals: 1, visitors: 2, closures: 1, wickets: 0, note: "Blasters finisher keeping the chase alive." },
        { name: "Dev Malhotra", team: "Blasters", runs: 4, referrals: 0, visitors: 1, closures: 0, wickets: 1, note: "One visitor, one wicket pressure point." },
      ],
    },
  ],
  completedMatches: [
    {
      week: 0,
      matchNo: 1,
      teamA: "Titans",
      teamB: "Royals",
      teamARuns: 64,
      teamAWickets: 4,
      teamBRuns: 52,
      teamBWickets: 5,
      day: 6,
      powerplay: false,
      status: "Completed",
      result: "Titans won by 12 runs",
      performances: [
        { name: "Aarav Mehta", team: "Titans", runs: 24, referrals: 4, visitors: 2, closures: 2, wickets: 0, note: "Match-winning all-round business push." },
        { name: "Kabir Shah", team: "Royals", runs: 22, referrals: 2, visitors: 2, closures: 2, wickets: 0, note: "Top scorer for Royals in the chase." },
        { name: "Maya Iyer", team: "Titans", runs: 16, referrals: 2, visitors: 2, closures: 1, wickets: 0, note: "Important middle-overs acceleration." },
        { name: "Ira Sen", team: "Royals", runs: 12, referrals: 0, visitors: 3, closures: 0, wickets: 1, note: "Visitor boost, but one wicket hurt the chase." },
      ],
    },
    {
      week: 0,
      matchNo: 2,
      teamA: "Warriors",
      teamB: "Blasters",
      teamARuns: 58,
      teamAWickets: 3,
      teamBRuns: 60,
      teamBWickets: 4,
      day: 6,
      powerplay: false,
      status: "Completed",
      result: "Blasters won by 2 runs",
      performances: [
        { name: "Tara Kapoor", team: "Blasters", runs: 26, referrals: 2, visitors: 2, closures: 3, wickets: 0, note: "Best finisher with three closures." },
        { name: "Nisha Rao", team: "Warriors", runs: 20, referrals: 3, visitors: 2, closures: 1, wickets: 0, note: "Kept Warriors within touching distance." },
        { name: "Dev Malhotra", team: "Blasters", runs: 14, referrals: 2, visitors: 3, closures: 0, wickets: 0, note: "Visitor-heavy support innings." },
        { name: "Rohan Desai", team: "Warriors", runs: 12, referrals: 0, visitors: 3, closures: 0, wickets: 1, note: "Useful runs, one wicket penalty." },
      ],
    },
  ],
  players: [
    { name: "Kabir Shah", runs: 72, visitors: 5, closures: 4 },
    { name: "Nisha Rao", runs: 58, visitors: 11, closures: 2 },
    { name: "Tara Kapoor", runs: 61, visitors: 7, closures: 5 },
    { name: "Aarav Mehta", runs: 66, visitors: 8, closures: 3 },
    { name: "Ira Sen", runs: 44, visitors: 9, closures: 1 },
  ],
  teams: [
    {
      name: "Titans",
      captain: "Aarav Mehta",
      players: ["Aarav Mehta", "Maya Iyer", "Kabir Shah", "Ira Sen", "Vivaan Joshi", "Reva Nair", "Om Bhatia", "Sara Khan"],
    },
    {
      name: "Warriors",
      captain: "Nisha Rao",
      players: ["Nisha Rao", "Rohan Desai", "Tara Kapoor", "Dev Malhotra", "Anya Bose", "Neil Dutta", "Riya Jain", "Yash Sinha"],
    },
    {
      name: "Royals",
      captain: "Kabir Shah",
      players: ["Kabir Shah", "Ira Sen", "Arjun Rao", "Mira Shah", "Kunal Jain", "Pia Menon", "Zoya Ali", "Rudra Patel"],
    },
    {
      name: "Blasters",
      captain: "Tara Kapoor",
      players: ["Tara Kapoor", "Dev Malhotra", "Nikhil Roy", "Meera Nair", "Vihaan Gupta", "Kiara Das", "Reyansh S", "Diya Lal"],
    },
  ],
  commentary: [
    { time: "12:42", text: "SIX! New visitor added by Team A." },
    { time: "12:39", text: "WICKET! No referrals submitted in the last session." },
    { time: "12:35", text: "POWERPLAY activated. Every run counts double." },
    { time: "12:28", text: "FOUR! Visitor points push Warriors closer." },
    { time: "12:21", text: "Finisher alert: closure recorded under pressure." },
    { time: "12:15", text: "Strategic timeout. Captains reviewing day targets." },
  ],
};

let dplData = loadLeagueData();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadLeagueData() {
  const fallback = clone(defaultData);

  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return fallback;

    return normalizeData({ ...fallback, ...JSON.parse(savedData) });
  } catch (error) {
    return fallback;
  }
}

function normalizeData(data) {
  const fallback = clone(defaultData);

  return {
    league: normalizeLeague(data.league, fallback.league),
    security: { ...fallback.security, ...(data.security || {}) },
    match: {
      ...fallback.match,
      ...(data.match || {}),
      teamA: { ...fallback.match.teamA, ...((data.match && data.match.teamA) || {}) },
      teamB: { ...fallback.match.teamB, ...((data.match && data.match.teamB) || {}) },
    },
    auctionPlayers: Array.isArray(data.auctionPlayers) ? data.auctionPlayers : fallback.auctionPlayers,
    leaderboard: Array.isArray(data.leaderboard) ? data.leaderboard : fallback.leaderboard,
    scoring: normalizeScoring(data.scoring, fallback.scoring),
    weeklyMatches: normalizeTwoWeeklyMatches(data.weeklyMatches, fallback.weeklyMatches),
    completedMatches: normalizeWeeklyMatches(data.completedMatches, fallback.completedMatches),
    players: Array.isArray(data.players) ? data.players : fallback.players,
    teams: Array.isArray(data.teams) ? data.teams : fallback.teams,
    commentary: Array.isArray(data.commentary) ? data.commentary : fallback.commentary,
  };
}

function normalizeLeague(league, fallbackLeague) {
  return {
    ...fallbackLeague,
    ...(league || {}),
    matchesPerWeek: 2,
  };
}

function normalizeScoring(scoring, fallbackScoring) {
  const merged = { ...fallbackScoring, ...(scoring || {}) };

  return {
    powerplayMultiplier: numberValue(merged.powerplayMultiplier, fallbackScoring.powerplayMultiplier),
    finalFormula: merged.finalFormula || fallbackScoring.finalFormula,
    rules: Array.isArray(merged.rules) ? merged.rules.map(normalizeScoringRule) : fallbackScoring.rules.map(normalizeScoringRule),
  };
}

function normalizeScoringRule(rule = {}) {
  return {
    label: rule.label || "Scoring Criteria",
    value: rule.value || "0 Runs",
    points: numberValue(rule.points),
    type: rule.type || "runs",
    accent: rule.accent || "blue",
  };
}

function normalizeWeeklyMatches(matches, fallbackMatches) {
  const source = Array.isArray(matches) ? matches : fallbackMatches;

  return source.map((fixture = {}, index) => {
    const fallbackFixture = fallbackMatches[index] || fallbackMatches[0] || {};
    const mergedFixture = { ...fallbackFixture, ...fixture };

    return {
      ...mergedFixture,
      performances: Array.isArray(fixture.performances)
        ? fixture.performances.map(normalizePerformance)
        : Array.isArray(fallbackFixture.performances)
          ? fallbackFixture.performances.map(normalizePerformance)
          : [],
    };
  });
}

function normalizeTwoWeeklyMatches(matches, fallbackMatches) {
  const normalized = normalizeWeeklyMatches(matches, fallbackMatches);
  const fallbackNormalized = normalizeWeeklyMatches(fallbackMatches, fallbackMatches);

  while (normalized.length < 2) {
    normalized.push(clone(fallbackNormalized[normalized.length] || fallbackNormalized[0]));
  }

  return normalized.slice(0, 2).map((fixture, index) => ({
    ...fixture,
    week: numberValue(fixture.week, 1),
    matchNo: index + 1,
    status: "Live",
  }));
}

function normalizePerformance(player = {}) {
  return {
    name: player.name || "Member",
    team: player.team || "",
    runs: numberValue(player.runs),
    referrals: numberValue(player.referrals),
    visitors: numberValue(player.visitors),
    closures: numberValue(player.closures),
    wickets: numberValue(player.wickets),
    note: player.note || "",
  };
}

function saveLeagueData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dplData));
    return true;
  } catch (error) {
    return false;
  }
}

function clearLeagueData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    return false;
  }

  return true;
}

function isAdminAuthed() {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
  } catch (error) {
    return false;
  }
}

function setAdminAuthed(value) {
  try {
    if (value) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch (error) {
    return false;
  }

  return true;
}

function escapeHtml(value) {
  return String(value)
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getValue(id, fallback = "") {
  const input = document.getElementById(id);
  return input ? input.value.trim() : fallback;
}

function getNumber(id, fallback = 0) {
  return numberValue(getValue(id, fallback), fallback);
}

function initials(name) {
  return String(name)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function animateNumber(element, target) {
  const duration = 850;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function renderLeagueShell() {
  const { league } = dplData;
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
      <article class="glass-stat"><span class="stat-number">${escapeHtml(league.totalPlayers)}</span><strong>Players</strong></article>
      <article class="glass-stat"><span class="stat-number">${escapeHtml(league.totalTeams)}</span><strong>Teams</strong></article>
      <article class="glass-stat"><span class="stat-number">${escapeHtml(league.auctionLabel)}</span><strong>Auction System</strong></article>
      <article class="glass-stat"><span class="stat-number">${escapeHtml(league.leagueWeeks)}</span><strong>Weeks League</strong></article>
      <article class="glass-stat"><span class="stat-number">${escapeHtml(league.matchesPerWeek)}</span><strong>Matches / Week</strong></article>
    `;
  }

  if (homeScore) {
    const featuredFixture = dplData.weeklyMatches[0];
    homeScore.dataset.matchIndex = "0";
    homeScore.dataset.matchCollection = "weeklyMatches";
    homeScore.setAttribute("role", "button");
    homeScore.tabIndex = 0;
    homeScore.setAttribute("aria-label", "Open featured match details");
    homeScore.innerHTML = featuredFixture
      ? `
        <span>${escapeHtml(featuredFixture.teamARuns)}<span class="wicket">/${escapeHtml(featuredFixture.teamAWickets)}</span></span>
        <small>${escapeHtml(featuredFixture.teamA)} vs ${escapeHtml(featuredFixture.teamB)} - Day ${escapeHtml(featuredFixture.day)}${featuredFixture.powerplay ? " Powerplay" : ""}</small>
      `
      : "<span>0<span class=\"wicket\">/0</span></span><small>No live match added</small>";
  }

  if (homeLower) {
    homeLower.innerHTML = `
      <strong>${escapeHtml(league.totalPlayers)} Players</strong>
      <span>${escapeHtml(league.totalTeams)} teams. ${escapeHtml(league.leagueWeeks)} weeks. One champion.</span>
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
          <div class="rating-track" aria-label="${escapeHtml(player.name)} rating ${escapeHtml(player.rating)}%">
            <i class="rating-bar" style="width: ${clamp(numberValue(player.rating, 0), 0, 100)}%"></i>
          </div>
        </article>
      `
    )
    .join("");
}

function renderScoreboard() {
  const container = document.querySelector("#scoreboard");
  if (!container) return;

  const visibleMatches = dplData.weeklyMatches.slice(0, numberValue(dplData.league.matchesPerWeek, 2));
  const anyPowerplay = visibleMatches.some((fixture) => fixture.powerplay);

  container.innerHTML = `
    <div class="scoreboard-header">
      <span class="live-badge">LIVE</span>
      <span class="powerplay-badge">${escapeHtml(visibleMatches.length)} MATCHES THIS WEEK</span>
      ${anyPowerplay ? '<span class="powerplay-badge">POWERPLAY - 2X RUNS</span>' : ""}
    </div>
    <div class="scoreboard-fixtures weekly-fixtures">
      ${visibleMatches.map((fixture, index) => renderFixtureCard(fixture, index, "weeklyMatches")).join("")}
    </div>
  `;
}

function renderLeaderboard() {
  const body = document.querySelector("#leaderboardBody");
  if (!body) return;

  const rankedRows = [...dplData.leaderboard].sort((a, b) => {
    const pointsGap = numberValue(b.points) - numberValue(a.points);
    if (pointsGap) return pointsGap;
    return numberValue(parseFloat(b.nrr)) - numberValue(parseFloat(a.nrr));
  });

  body.innerHTML = rankedRows
    .map((row, index) => {
      const rankClass = index === 0 ? "top-team" : index === rankedRows.length - 1 ? "bottom-team" : "";
      return `
        <tr class="${rankClass}">
          <td><span class="rank-dot"></span><strong>${escapeHtml(row.team)}</strong></td>
          <td>${escapeHtml(row.matches)}</td>
          <td>${escapeHtml(row.wins)}</td>
          <td>${escapeHtml(row.points)}</td>
          <td>${escapeHtml(row.nrr)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderScoringRules() {
  const rulesGrid = document.querySelector("#scoringRulesGrid");
  const formula = document.querySelector("#scoringFormula");

  if (rulesGrid) {
    rulesGrid.innerHTML = dplData.scoring.rules
      .map(
        (rule) => `
          <article class="score-tile accent-${escapeHtml(rule.accent)}">
            <span>${escapeHtml(rule.value)}</span>
            <strong>${escapeHtml(rule.label)}</strong>
          </article>
        `
      )
      .join("");
  }

  if (formula) {
    formula.textContent = `${dplData.scoring.finalFormula} | Powerplay = ${dplData.scoring.powerplayMultiplier}X runs`;
  }
}

function renderWeeklyFixtures() {
  const containers = document.querySelectorAll("#weeklyFixtures, #homeWeeklyFixtures");
  if (!containers.length) return;

  const fixtureCards = dplData.weeklyMatches.map((fixture, index) => renderFixtureCard(fixture, index, "weeklyMatches")).join("");
  containers.forEach((container) => {
    container.innerHTML = fixtureCards;
  });
}

function renderCompletedMatches() {
  const containers = document.querySelectorAll("#completedMatches, #homeCompletedMatches");
  if (!containers.length) return;

  const resultCards = dplData.completedMatches.map((fixture, index) => renderFixtureCard(fixture, index, "completedMatches")).join("");
  containers.forEach((container) => {
    container.innerHTML = resultCards || '<p class="admin-note">No completed results added yet.</p>';
  });
}

function renderFixtureCard(fixture, index, collection = "weeklyMatches") {
  const lead = numberValue(fixture.teamARuns) - numberValue(fixture.teamBRuns);
  const leader = lead === 0 ? "Level" : `${lead > 0 ? fixture.teamA : fixture.teamB} +${Math.abs(lead)}`;
  const status = String(fixture.status).toLowerCase();
  const result = fixture.result || (status === "completed" ? getMatchResult(fixture) : leader);

  return `
    <button class="fixture-card ${status === "live" ? "is-live" : ""} ${status === "completed" ? "is-completed" : ""}" type="button" data-match-index="${index}" data-match-collection="${escapeHtml(collection)}" aria-label="Open details for ${escapeHtml(fixture.teamA)} versus ${escapeHtml(fixture.teamB)}">
      <div class="fixture-card-top">
        <span class="fixture-tag">Week ${escapeHtml(fixture.week)} / Match ${escapeHtml(fixture.matchNo)}</span>
        <span class="fixture-status">${escapeHtml(fixture.status)}</span>
      </div>
      <div class="fixture-score-row">
        <div>
          <strong>${escapeHtml(fixture.teamA)}</strong>
          <span>${escapeHtml(fixture.teamARuns)}/${escapeHtml(fixture.teamAWickets)}</span>
        </div>
        <em>vs</em>
        <div>
          <strong>${escapeHtml(fixture.teamB)}</strong>
          <span>${escapeHtml(fixture.teamBRuns)}/${escapeHtml(fixture.teamBWickets)}</span>
        </div>
      </div>
      <div class="score-meta">
        <span>Day ${escapeHtml(fixture.day)}</span>
        <span>${escapeHtml(result)}</span>
        ${fixture.powerplay ? "<span>Powerplay</span>" : ""}
        <span>Tap for details</span>
      </div>
    </button>
  `;
}

function getMatchResult(fixture) {
  const lead = numberValue(fixture.teamARuns) - numberValue(fixture.teamBRuns);
  if (lead === 0) return "Match tied";

  return `${lead > 0 ? fixture.teamA : fixture.teamB} won by ${Math.abs(lead)} runs`;
}

function openMatchDetails(index, collection = "weeklyMatches") {
  const matchCollection = Array.isArray(dplData[collection]) ? dplData[collection] : dplData.weeklyMatches;
  const fixture = matchCollection[index];
  if (!fixture) return;

  const modal = ensureMatchModal();
  modal.innerHTML = renderMatchDetails(fixture, index, collection);
  modal.hidden = false;
  document.body.classList.add("modal-open");

  const closeButton = modal.querySelector("[data-close-modal]");
  if (closeButton) closeButton.focus();
}

function ensureMatchModal() {
  let modal = document.querySelector("#matchDetailModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "matchDetailModal";
  modal.className = "match-modal";
  modal.hidden = true;
  document.body.appendChild(modal);

  return modal;
}

function renderMatchDetails(fixture, index, collection = "weeklyMatches") {
  const performances = Array.isArray(fixture.performances) ? fixture.performances : [];
  const topPerformer = [...performances].sort((a, b) => numberValue(b.runs) - numberValue(a.runs))[0];
  const lead = numberValue(fixture.teamARuns) - numberValue(fixture.teamBRuns);
  const status = String(fixture.status).toLowerCase() === "completed"
    ? fixture.result || getMatchResult(fixture)
    : lead === 0
      ? "Scores level"
      : `${lead > 0 ? fixture.teamA : fixture.teamB} leading by ${Math.abs(lead)} runs`;

  return `
    <div class="match-modal-backdrop" data-close-modal></div>
    <section class="match-detail-panel" role="dialog" aria-modal="true" aria-labelledby="matchDetailTitle">
      <div class="match-detail-header">
        <div>
          <p class="eyebrow">Match Detail</p>
          <h2 id="matchDetailTitle">${escapeHtml(fixture.teamA)} vs ${escapeHtml(fixture.teamB)}</h2>
        </div>
        <button class="icon-btn" type="button" data-close-modal>Close</button>
      </div>

      <div class="match-detail-score">
        ${renderDetailTeamScore(fixture.teamA, fixture.teamARuns, fixture.teamAWickets)}
        <div class="match-detail-center">
          <span class="fixture-tag">Week ${escapeHtml(fixture.week)} / Match ${escapeHtml(fixture.matchNo)}</span>
          <strong>${escapeHtml(status)}</strong>
          <small>Day ${escapeHtml(fixture.day)}${fixture.powerplay ? " - Powerplay active" : ""}</small>
        </div>
        ${renderDetailTeamScore(fixture.teamB, fixture.teamBRuns, fixture.teamBWickets)}
      </div>

      <div class="performance-summary">
        <article>
          <span>Total Runs</span>
          <strong>${escapeHtml(numberValue(fixture.teamARuns) + numberValue(fixture.teamBRuns))}</strong>
        </article>
        <article>
          <span>Total Wickets</span>
          <strong>${escapeHtml(numberValue(fixture.teamAWickets) + numberValue(fixture.teamBWickets))}</strong>
        </article>
        <article>
          <span>Top Performer</span>
          <strong>${escapeHtml(topPerformer ? topPerformer.name : "Not added")}</strong>
        </article>
      </div>

      <div class="section-heading compact">
        <p class="eyebrow">Member Performances</p>
        <h2>Player sheet for this match</h2>
      </div>
      <div class="performance-table-wrap">
        <table class="performance-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Team</th>
              <th>Runs</th>
              <th>Ref</th>
              <th>Visitors</th>
              <th>Closures</th>
              <th>Wkts</th>
              <th>Impact</th>
            </tr>
          </thead>
          <tbody>
            ${performances.map(renderPerformanceRow).join("") || '<tr><td colspan="8">No performance details added yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderDetailTeamScore(team, runs, wickets) {
  return `
    <article class="detail-team-score">
      <span>${escapeHtml(team)}</span>
      <strong>${escapeHtml(runs)}<small>/${escapeHtml(wickets)}</small></strong>
    </article>
  `;
}

function renderPerformanceRow(player) {
  return `
    <tr>
      <td><strong>${escapeHtml(player.name)}</strong></td>
      <td>${escapeHtml(player.team)}</td>
      <td>${escapeHtml(player.runs)}</td>
      <td>${escapeHtml(player.referrals)}</td>
      <td>${escapeHtml(player.visitors)}</td>
      <td>${escapeHtml(player.closures)}</td>
      <td>${escapeHtml(player.wickets)}</td>
      <td>${escapeHtml(player.note || "")}</td>
    </tr>
  `;
}

function closeMatchDetails() {
  const modal = document.querySelector("#matchDetailModal");
  if (!modal) return;

  modal.hidden = true;
  modal.innerHTML = "";
  document.body.classList.remove("modal-open");
}

function getTopPlayer(metric) {
  return [...dplData.players].sort((a, b) => numberValue(b[metric]) - numberValue(a[metric]))[0] || {
    name: "No player",
    [metric]: 0,
  };
}

function renderCaps() {
  const container = document.querySelector("#capsStack");
  if (!container) return;

  const awards = [
    { title: "Orange Cap", metric: "runs", label: "runs" },
    { title: "Most Visitors", metric: "visitors", label: "visitors" },
    { title: "Best Finisher", metric: "closures", label: "closures" },
  ];

  container.innerHTML = awards
    .map((award) => {
      const player = getTopPlayer(award.metric);
      return `
        <article class="cap-card">
          <div class="avatar">${escapeHtml(initials(player.name))}</div>
          <div>
            <span>${escapeHtml(award.title)}</span>
            <strong>${escapeHtml(player.name)}</strong>
            <div class="metric">${escapeHtml(player[award.metric] || 0)} ${escapeHtml(award.label)}</div>
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
          <ul>
            ${(team.players || []).map((player) => `<li>${escapeHtml(player)}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderCommentary() {
  const container = document.querySelector("#commentaryFeed");
  if (!container) return;
  const loopedFeed = [...dplData.commentary, ...dplData.commentary];

  container.innerHTML = `
    <div class="commentary-list">
      ${loopedFeed
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
        <p class="eyebrow">Editable Data</p>
        <h2>League Control Panel</h2>
      </div>
      <div class="admin-toolbar-actions">
        <div class="admin-status" id="adminStatus">${escapeHtml(message)}</div>
        <button class="mini-btn" type="button" id="logoutAdmin">Logout</button>
      </div>
    </div>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>01</span>
        <h3>Admin Security</h3>
      </div>
      <div class="admin-grid">
        ${passwordField("Change Password", "adminPasswordInput", "Leave blank to keep current password")}
      </div>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>02</span>
        <h3>League Identity</h3>
      </div>
      <div class="admin-grid">
        ${field("Title", "leagueTitleInput", dplData.league.title)}
        ${field("Subtitle", "leagueSubtitleInput", dplData.league.subtitle)}
        ${field("Eyebrow", "leagueEyebrowInput", dplData.league.eyebrow)}
        ${field("Auction Date", "leagueAuctionInput", dplData.league.auctionDate)}
        ${field("League Start", "leagueStartInput", dplData.league.startDate)}
        ${field("Finale", "leagueFinaleInput", dplData.league.finale)}
        ${field("Total Players", "leaguePlayersInput", dplData.league.totalPlayers, "number")}
        ${field("Total Teams", "leagueTeamsInput", dplData.league.totalTeams, "number")}
        ${field("Auction Tile Label", "leagueAuctionLabelInput", dplData.league.auctionLabel)}
        ${field("League Weeks", "leagueWeeksInput", dplData.league.leagueWeeks, "number")}
      </div>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>03</span>
        <h3>Scoring Criteria</h3>
      </div>
      <div class="admin-grid">
        ${field("Powerplay Multiplier", "scoringPowerplayInput", dplData.scoring.powerplayMultiplier, "number", 'min="1"')}
        ${field("Final Formula", "scoringFormulaInput", dplData.scoring.finalFormula)}
      </div>
      <div class="admin-rows scoring-editor" id="scoringRulesEditor">
        ${dplData.scoring.rules.map(renderScoringRuleEditorRow).join("")}
      </div>
      <button class="mini-btn" type="button" data-add="scoringRules">Add Scoring Rule</button>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>04</span>
        <h3>Weekly Live Fixtures</h3>
      </div>
      <p class="admin-helper">DPL has exactly 2 live fixtures per week. Match 1 and Match 2 cover all 4 teams.</p>
      <div class="admin-rows" id="weeklyMatchesEditor">
        ${dplData.weeklyMatches.map(renderWeeklyMatchEditorRow).join("")}
      </div>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>05</span>
        <h3>Completed Match Results</h3>
      </div>
      <p class="admin-helper">Completed matches appear in the results archive and use the same tappable detail scorecard.</p>
      <div class="admin-rows" id="completedMatchesEditor">
        ${dplData.completedMatches.map(renderCompletedMatchEditorRow).join("")}
      </div>
      <button class="mini-btn" type="button" data-add="completedMatches">Add Completed Result</button>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>06</span>
        <h3>Leaderboard</h3>
      </div>
      <div class="admin-rows" id="leaderboardEditor">
        ${dplData.leaderboard.map(renderLeaderboardEditorRow).join("")}
      </div>
      <button class="mini-btn" type="button" data-add="leaderboard">Add Team Row</button>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>07</span>
        <h3>Caps Players</h3>
      </div>
      <div class="admin-rows" id="playersEditor">
        ${dplData.players.map(renderPlayerEditorRow).join("")}
      </div>
      <button class="mini-btn" type="button" data-add="players">Add Player Stat</button>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>08</span>
        <h3>Auction Cards</h3>
      </div>
      <div class="admin-rows" id="auctionEditor">
        ${dplData.auctionPlayers.map(renderAuctionEditorRow).join("")}
      </div>
      <button class="mini-btn" type="button" data-add="auctionPlayers">Add Auction Player</button>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>09</span>
        <h3>Teams</h3>
      </div>
      <div class="admin-rows" id="teamsEditor">
        ${dplData.teams.map(renderTeamEditorRow).join("")}
      </div>
      <button class="mini-btn" type="button" data-add="teams">Add Team</button>
    </section>

    <section class="admin-panel-card">
      <div class="admin-section-title">
        <span>10</span>
        <h3>Commentary Feed</h3>
      </div>
      <div class="admin-rows" id="commentaryEditor">
        ${dplData.commentary.map(renderCommentaryEditorRow).join("")}
      </div>
      <button class="mini-btn" type="button" data-add="commentary">Add Commentary</button>
    </section>

    <div class="admin-actions">
      <button class="btn btn-live" type="submit">Save Updates</button>
      <button class="btn btn-outline" type="button" id="resetData">Reset Demo Data</button>
    </div>
  `;

  form.onsubmit = handleAdminSubmit;
  form.onclick = handleAdminClick;
}

function renderAdminLogin(message = "") {
  const form = document.querySelector("#adminForm");
  if (!form) return;

  form.innerHTML = `
    <section class="admin-login-card">
      <div class="admin-section-title">
        <span>PW</span>
        <h3>Password Required</h3>
      </div>
      <p class="admin-note">Enter the admin password to edit DPL scores, fixtures, teams, and commentary.</p>
      <label class="field">
        <span>Password</span>
        <input id="adminLoginPassword" type="password" autocomplete="current-password" placeholder="Enter admin password" />
      </label>
      <div class="admin-status ${message ? "" : "is-hidden"}">${escapeHtml(message)}</div>
      <div class="admin-actions static-actions">
        <button class="btn btn-live" type="submit">Unlock Admin Panel</button>
      </div>
    </section>
  `;

  form.onsubmit = handleAdminLogin;
  form.onclick = null;
}

function field(label, id, value, type = "text", attributes = "") {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <input id="${escapeHtml(id)}" type="${escapeHtml(type)}" value="${escapeHtml(value)}" ${attributes} />
    </label>
  `;
}

function passwordField(label, id, placeholder) {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <input id="${escapeHtml(id)}" type="password" value="" placeholder="${escapeHtml(placeholder)}" autocomplete="new-password" />
    </label>
  `;
}

function textarea(label, id, value) {
  return `
    <label class="field">
      <span>${escapeHtml(label)}</span>
      <textarea id="${escapeHtml(id)}" rows="5">${escapeHtml(value)}</textarea>
    </label>
  `;
}

function performancesToText(performances = []) {
  return performances
    .map((player) =>
      [
        player.name,
        player.team,
        player.runs,
        player.referrals,
        player.visitors,
        player.closures,
        player.wickets,
        player.note || "",
      ].join(" | ")
    )
    .join("\n");
}

function parsePerformances(value) {
  return String(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, team, runs, referrals, visitors, closures, wickets, ...noteParts] = line.split("|").map((part) => part.trim());

      return normalizePerformance({
        name,
        team,
        runs,
        referrals,
        visitors,
        closures,
        wickets,
        note: noteParts.join(" | "),
      });
    });
}

function removeButton(collection, index) {
  return `<button class="icon-btn danger" type="button" data-remove="${escapeHtml(collection)}" data-index="${index}" aria-label="Remove row">Remove</button>`;
}

function renderLeaderboardEditorRow(row, index) {
  return `
    <div class="admin-row">
      ${field("Team", `leaderboard-${index}-team`, row.team)}
      ${field("M", `leaderboard-${index}-matches`, row.matches, "number")}
      ${field("W", `leaderboard-${index}-wins`, row.wins, "number")}
      ${field("PTS", `leaderboard-${index}-points`, row.points, "number")}
      ${field("NRR", `leaderboard-${index}-nrr`, row.nrr)}
      ${removeButton("leaderboard", index)}
    </div>
  `;
}

function renderPlayerEditorRow(player, index) {
  return `
    <div class="admin-row">
      ${field("Name", `player-${index}-name`, player.name)}
      ${field("Runs", `player-${index}-runs`, player.runs, "number")}
      ${field("Visitors", `player-${index}-visitors`, player.visitors, "number")}
      ${field("Closures", `player-${index}-closures`, player.closures, "number")}
      ${removeButton("players", index)}
    </div>
  `;
}

function renderScoringRuleEditorRow(rule, index) {
  return `
    <div class="admin-row scoring-row">
      ${field("Criteria", `scoring-${index}-label`, rule.label)}
      ${field("Display Value", `scoring-${index}-value`, rule.value)}
      ${field("Points", `scoring-${index}-points`, rule.points, "number")}
      ${field("Type", `scoring-${index}-type`, rule.type)}
      ${field("Accent", `scoring-${index}-accent`, rule.accent)}
      ${removeButton("scoringRules", index)}
    </div>
  `;
}

function renderWeeklyMatchEditorRow(fixture, index) {
  return `
    <div class="admin-row admin-row-fixture">
      ${field("Week", `weekly-${index}-week`, fixture.week, "number", 'min="1"')}
      ${field("Match", `weekly-${index}-matchNo`, index + 1, "number", 'min="1" readonly')}
      ${field("Team A", `weekly-${index}-teamA`, fixture.teamA)}
      ${field("A Runs", `weekly-${index}-teamARuns`, fixture.teamARuns, "number")}
      ${field("A Wickets", `weekly-${index}-teamAWickets`, fixture.teamAWickets, "number")}
      ${field("Team B", `weekly-${index}-teamB`, fixture.teamB)}
      ${field("B Runs", `weekly-${index}-teamBRuns`, fixture.teamBRuns, "number")}
      ${field("B Wickets", `weekly-${index}-teamBWickets`, fixture.teamBWickets, "number")}
      ${field("Day", `weekly-${index}-day`, fixture.day, "number", 'min="1" max="6"')}
      <label class="field checkbox-field">
        <input type="checkbox" id="weekly-${index}-powerplay" ${fixture.powerplay ? "checked" : ""} />
        <span>Powerplay</span>
      </label>
      <div class="performance-field">
        ${textarea("Member performances: Name | Team | Runs | Referrals | Visitors | Closures | Wickets | Note", `weekly-${index}-performances`, performancesToText(fixture.performances))}
      </div>
    </div>
  `;
}

function renderCompletedMatchEditorRow(fixture, index) {
  return `
    <div class="admin-row admin-row-fixture">
      ${field("Week", `completed-${index}-week`, fixture.week, "number", 'min="0"')}
      ${field("Match", `completed-${index}-matchNo`, fixture.matchNo, "number", 'min="1"')}
      ${field("Team A", `completed-${index}-teamA`, fixture.teamA)}
      ${field("A Runs", `completed-${index}-teamARuns`, fixture.teamARuns, "number")}
      ${field("A Wickets", `completed-${index}-teamAWickets`, fixture.teamAWickets, "number")}
      ${field("Team B", `completed-${index}-teamB`, fixture.teamB)}
      ${field("B Runs", `completed-${index}-teamBRuns`, fixture.teamBRuns, "number")}
      ${field("B Wickets", `completed-${index}-teamBWickets`, fixture.teamBWickets, "number")}
      ${field("Day", `completed-${index}-day`, fixture.day, "number", 'min="1" max="6"')}
      ${field("Result", `completed-${index}-result`, fixture.result || getMatchResult(fixture))}
      <label class="field checkbox-field">
        <input type="checkbox" id="completed-${index}-powerplay" ${fixture.powerplay ? "checked" : ""} />
        <span>Powerplay</span>
      </label>
      <div class="performance-field">
        ${textarea("Member performances: Name | Team | Runs | Referrals | Visitors | Closures | Wickets | Note", `completed-${index}-performances`, performancesToText(fixture.performances))}
      </div>
      ${removeButton("completedMatches", index)}
    </div>
  `;
}

function renderAuctionEditorRow(player, index) {
  return `
    <div class="admin-row">
      ${field("Name", `auction-${index}-name`, player.name)}
      ${field("Role", `auction-${index}-role`, player.role)}
      ${field("Rating", `auction-${index}-rating`, player.rating, "number", 'min="0" max="100"')}
      ${removeButton("auctionPlayers", index)}
    </div>
  `;
}

function renderTeamEditorRow(team, index) {
  return `
    <div class="admin-row admin-row-wide">
      ${field("Team Name", `team-${index}-name`, team.name)}
      ${field("Captain", `team-${index}-captain`, team.captain)}
      ${textarea("Players, one per line", `team-${index}-players`, (team.players || []).join("\n"))}
      ${removeButton("teams", index)}
    </div>
  `;
}

function renderCommentaryEditorRow(item, index) {
  return `
    <div class="admin-row">
      ${field("Time", `commentary-${index}-time`, item.time)}
      ${field("Commentary", `commentary-${index}-text`, item.text)}
      ${removeButton("commentary", index)}
    </div>
  `;
}

function handleAdminSubmit(event) {
  event.preventDefault();
  dplData = collectAdminFormData();
  const saved = saveLeagueData();
  renderAll();
  renderAdminPanel(saved ? "Saved. Public pages now use the updated data." : "Saved in memory, but localStorage was blocked.");
}

function handleAdminLogin(event) {
  event.preventDefault();
  const password = getValue("adminLoginPassword", "");

  if (password === dplData.security.adminPassword) {
    setAdminAuthed(true);
    renderAdminPanel("Admin unlocked.");
    return;
  }

  renderAdminLogin("Incorrect password.");
}

function handleAdminClick(event) {
  const logoutButton = event.target.closest("#logoutAdmin");
  if (logoutButton) {
    setAdminAuthed(false);
    renderAdminPanel("Logged out.");
    return;
  }

  const resetButton = event.target.closest("#resetData");
  if (resetButton) {
    dplData = clone(defaultData);
    clearLeagueData();
    setAdminAuthed(false);
    renderAll();
    renderAdminPanel("Demo data restored. Login again with the default password.");
    return;
  }

  const removeButtonEl = event.target.closest("[data-remove]");
  if (removeButtonEl) {
    dplData = collectAdminFormData();
    const collection = removeButtonEl.dataset.remove;
    const index = Number(removeButtonEl.dataset.index);

    if (collection === "scoringRules") {
      dplData.scoring.rules.splice(index, 1);
      saveLeagueData();
      renderAll();
      renderAdminPanel("Scoring rule removed.");
    } else if (Array.isArray(dplData[collection])) {
      dplData[collection].splice(index, 1);
      saveLeagueData();
      renderAll();
      renderAdminPanel("Row removed.");
    }
    return;
  }

  const addButton = event.target.closest("[data-add]");
  if (!addButton) return;

  dplData = collectAdminFormData();
  addDefaultRow(addButton.dataset.add);
  saveLeagueData();
  renderAll();
  renderAdminPanel("New row added. Edit it and save updates.");
}

function addDefaultRow(collection) {
  const rowMap = {
    leaderboard: { team: "New Team", matches: 0, wins: 0, points: 0, nrr: "+0.00" },
    completedMatches: {
      week: 1,
      matchNo: dplData.completedMatches.length + 1,
      teamA: "Team A",
      teamB: "Team B",
      teamARuns: 0,
      teamAWickets: 0,
      teamBRuns: 0,
      teamBWickets: 0,
      day: 6,
      powerplay: false,
      status: "Completed",
      result: "Team A won by 0 runs",
      performances: [
        { name: "New Member", team: "Team A", runs: 0, referrals: 0, visitors: 0, closures: 0, wickets: 0, note: "Add match impact here." },
      ],
    },
    players: { name: "New Player", runs: 0, visitors: 0, closures: 0 },
    auctionPlayers: { name: "New Player", role: "Referrals", rating: 75 },
    teams: { name: "New Team", captain: "Captain Name", players: ["Player 1", "Player 2", "Player 3"] },
    commentary: { time: "00:00", text: "New commentary update." },
  };

  if (Array.isArray(dplData[collection]) && rowMap[collection]) {
    dplData[collection].push(rowMap[collection]);
  } else if (collection === "scoringRules") {
    dplData.scoring.rules.push({ label: "New Criteria", value: "0 Runs", points: 0, type: "runs", accent: "blue" });
  }
}

function collectAdminFormData() {
  const newPassword = getValue("adminPasswordInput", "");

  return {
    league: {
      title: getValue("leagueTitleInput", dplData.league.title),
      subtitle: getValue("leagueSubtitleInput", dplData.league.subtitle),
      eyebrow: getValue("leagueEyebrowInput", dplData.league.eyebrow),
      auctionDate: getValue("leagueAuctionInput", dplData.league.auctionDate),
      startDate: getValue("leagueStartInput", dplData.league.startDate),
      finale: getValue("leagueFinaleInput", dplData.league.finale),
      totalPlayers: getNumber("leaguePlayersInput", dplData.league.totalPlayers),
      totalTeams: getNumber("leagueTeamsInput", dplData.league.totalTeams),
      auctionLabel: getValue("leagueAuctionLabelInput", dplData.league.auctionLabel),
      leagueWeeks: getNumber("leagueWeeksInput", dplData.league.leagueWeeks),
      matchesPerWeek: 2,
    },
    security: {
      adminPassword: newPassword || dplData.security.adminPassword || DEFAULT_ADMIN_PASSWORD,
    },
    match: {
      teamA: {
        name: getValue("matchTeamAName", dplData.match.teamA.name),
        runs: getNumber("matchTeamARuns", dplData.match.teamA.runs),
        wickets: getNumber("matchTeamAWickets", dplData.match.teamA.wickets),
      },
      teamB: {
        name: getValue("matchTeamBName", dplData.match.teamB.name),
        runs: getNumber("matchTeamBRuns", dplData.match.teamB.runs),
        wickets: getNumber("matchTeamBWickets", dplData.match.teamB.wickets),
      },
      day: clamp(getNumber("matchDay", dplData.match.day), 1, 6),
      powerplay: Boolean(document.getElementById("matchPowerplay") && document.getElementById("matchPowerplay").checked),
    },
    scoring: {
      powerplayMultiplier: getNumber("scoringPowerplayInput", dplData.scoring.powerplayMultiplier),
      finalFormula: getValue("scoringFormulaInput", dplData.scoring.finalFormula),
      rules: dplData.scoring.rules.map((rule, index) =>
        normalizeScoringRule({
          label: getValue(`scoring-${index}-label`, rule.label),
          value: getValue(`scoring-${index}-value`, rule.value),
          points: getNumber(`scoring-${index}-points`, rule.points),
          type: getValue(`scoring-${index}-type`, rule.type),
          accent: getValue(`scoring-${index}-accent`, rule.accent),
        })
      ),
    },
    leaderboard: dplData.leaderboard.map((row, index) => ({
      team: getValue(`leaderboard-${index}-team`, row.team),
      matches: getNumber(`leaderboard-${index}-matches`, row.matches),
      wins: getNumber(`leaderboard-${index}-wins`, row.wins),
      points: getNumber(`leaderboard-${index}-points`, row.points),
      nrr: getValue(`leaderboard-${index}-nrr`, row.nrr),
    })),
    weeklyMatches: dplData.weeklyMatches.map((fixture, index) => ({
      week: getNumber(`weekly-${index}-week`, fixture.week),
      matchNo: getNumber(`weekly-${index}-matchNo`, fixture.matchNo),
      teamA: getValue(`weekly-${index}-teamA`, fixture.teamA),
      teamB: getValue(`weekly-${index}-teamB`, fixture.teamB),
      teamARuns: getNumber(`weekly-${index}-teamARuns`, fixture.teamARuns),
      teamAWickets: getNumber(`weekly-${index}-teamAWickets`, fixture.teamAWickets),
      teamBRuns: getNumber(`weekly-${index}-teamBRuns`, fixture.teamBRuns),
      teamBWickets: getNumber(`weekly-${index}-teamBWickets`, fixture.teamBWickets),
      day: clamp(getNumber(`weekly-${index}-day`, fixture.day), 1, 6),
      powerplay: Boolean(document.getElementById(`weekly-${index}-powerplay`) && document.getElementById(`weekly-${index}-powerplay`).checked),
      status: "Live",
      performances: parsePerformances(getValue(`weekly-${index}-performances`, performancesToText(fixture.performances))),
    })),
    completedMatches: dplData.completedMatches.map((fixture, index) => ({
      week: getNumber(`completed-${index}-week`, fixture.week),
      matchNo: getNumber(`completed-${index}-matchNo`, fixture.matchNo),
      teamA: getValue(`completed-${index}-teamA`, fixture.teamA),
      teamB: getValue(`completed-${index}-teamB`, fixture.teamB),
      teamARuns: getNumber(`completed-${index}-teamARuns`, fixture.teamARuns),
      teamAWickets: getNumber(`completed-${index}-teamAWickets`, fixture.teamAWickets),
      teamBRuns: getNumber(`completed-${index}-teamBRuns`, fixture.teamBRuns),
      teamBWickets: getNumber(`completed-${index}-teamBWickets`, fixture.teamBWickets),
      day: clamp(getNumber(`completed-${index}-day`, fixture.day), 1, 6),
      powerplay: Boolean(document.getElementById(`completed-${index}-powerplay`) && document.getElementById(`completed-${index}-powerplay`).checked),
      status: "Completed",
      result: getValue(`completed-${index}-result`, fixture.result || getMatchResult(fixture)),
      performances: parsePerformances(getValue(`completed-${index}-performances`, performancesToText(fixture.performances))),
    })),
    players: dplData.players.map((player, index) => ({
      name: getValue(`player-${index}-name`, player.name),
      runs: getNumber(`player-${index}-runs`, player.runs),
      visitors: getNumber(`player-${index}-visitors`, player.visitors),
      closures: getNumber(`player-${index}-closures`, player.closures),
    })),
    auctionPlayers: dplData.auctionPlayers.map((player, index) => ({
      name: getValue(`auction-${index}-name`, player.name),
      role: getValue(`auction-${index}-role`, player.role),
      rating: clamp(getNumber(`auction-${index}-rating`, player.rating), 0, 100),
    })),
    teams: dplData.teams.map((team, index) => ({
      name: getValue(`team-${index}-name`, team.name),
      captain: getValue(`team-${index}-captain`, team.captain),
      players: getValue(`team-${index}-players`, (team.players || []).join("\n"))
        .split("\n")
        .map((player) => player.trim())
        .filter(Boolean),
    })),
    commentary: dplData.commentary.map((item, index) => ({
      time: getValue(`commentary-${index}-time`, item.time),
      text: getValue(`commentary-${index}-text`, item.text),
    })),
  };
}

function renderAll() {
  renderLeagueShell();
  renderAuctionPlayers();
  renderScoreboard();
  renderLeaderboard();
  renderScoringRules();
  renderWeeklyFixtures();
  renderCompletedMatches();
  renderCaps();
  renderTeams();
  renderCommentary();
}

document.addEventListener("click", (event) => {
  const fixtureCard = event.target.closest("[data-match-index]");
  if (fixtureCard) {
    openMatchDetails(Number(fixtureCard.dataset.matchIndex), fixtureCard.dataset.matchCollection || "weeklyMatches");
    return;
  }

  if (event.target.closest("[data-close-modal]")) {
    closeMatchDetails();
  }
});

document.addEventListener("keydown", (event) => {
  const fixtureCard = event.target.closest && event.target.closest("[data-match-index]");
  if (fixtureCard && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openMatchDetails(Number(fixtureCard.dataset.matchIndex), fixtureCard.dataset.matchCollection || "weeklyMatches");
    return;
  }

  if (event.key === "Escape") closeMatchDetails();
});

renderAll();
renderAdminPanel();
