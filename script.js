const statsTemplate = [
  { key: "logic", label: "Logic" },
  { key: "engineering", label: "Engineering" },
  { key: "empathy", label: "Empathy" },
  { key: "resolve", label: "Resolve" },
  { key: "vitality", label: "Vitality" }
];

const state = {
  name: "Astra Vale",
  level: 1,
  xp: 0,
  xpToNext: 100,
  hull: 100,
  stats: {
    logic: 12,
    engineering: 10,
    empathy: 11,
    resolve: 12,
    vitality: 10
  },
  inventory: ["Flux Lantern", "Tidal Cipher", "Triage Kit"],
  chapterIndex: 0,
  log: ["Hull breach stabilized. Black Veil anomaly detected."],
  chapterUnlocks: {
    0: true,
    1: false,
    2: false,
    3: false
  }
};

const chapters = [
  {
    title: "Chapter I — Driftwake",
    story:
      "Your frigate, the Ilyra, drifts between a field of shattered comets. The gravity locks pulse like a heartbeat. A derelict station beckons beyond the fog, but its airlock has sealed itself behind a lock code made from a cosmic riddle. The crew needs you to interpret the pattern before the hull fails.",
    threat: "A pressure collapse is spreading through the dorsal cargo deck.",
    choices: [
      {
        text: "Study the lock glyphs and match the sequence by logic.",
        effect: { type: "check", stat: "logic", value: 13, xp: 35, next: "relay" },
        description: "Solve the stellar cipher."
      },
      {
        text: "Rewire the airlock via engineering improvisation.",
        effect: { type: "check", stat: "engineering", value: 11, xp: 25, next: "relay" },
        description: "Force a manual bypass."
      },
      {
        text: "Negotiate with the station's dormant AI using empathy and calm.",
        effect: { type: "check", stat: "empathy", value: 12, xp: 30, next: "relay" },
        description: "Convince the station to open."
      }
    ]
  },
  {
    title: "Chapter II — Relay of Echoes",
    story:
      "The airlock opens into a memory vault. A chorus of dead voices floods the corridor. To continue, the crew must decode a sacrificial ritual hidden in the station's public archive. The wrong choice would trigger a cascade of debris through the central spine.",
    threat: "The station is replaying old tragedies and manipulating passengers' memories.",
    choices: [
      {
        text: "Compare each voice to its ship log and identify the lie.",
        effect: { type: "check", stat: "logic", value: 14, xp: 40, next: "forge" },
        description: "Spot the false narrative."
      },
      {
        text: "Mend the damaged archive by restoring the circuit map.",
        effect: { type: "check", stat: "engineering", value: 12, xp: 35, next: "forge" },
        description: "Repair the archival engine."
      },
      {
        text: "Appeal to the station's guilt and salvage the lost crew's records.",
        effect: { type: "check", stat: "empathy", value: 13, xp: 45, next: "forge" },
        description: "Use compassion to reach the archive."
      }
    ]
  },
  {
    title: "Chapter III — The Void Forge",
    story:
      "At the heart of the station sprawls a forge that turns broken asteroid fragments into starship armor. The forge asks a single question: what kind of future do you want to build from grief? The ship cannot leave until you solve the pattern of rebirth and resource sacrifice.",
    threat: "The forge is consuming equipment and fuel to stabilize the station's core.",
    choices: [
      {
        text: "Reframe the process as a cycle of renewal rather than destruction.",
        effect: { type: "check", stat: "empathy", value: 14, xp: 55, next: "astral" },
        description: "Redirect the forge's destructive logic."
      },
      {
        text: "Defuse the furnace by calculating the exact thermal balance.",
        effect: { type: "check", stat: "engineering", value: 14, xp: 60, next: "astral" },
        description: "Solve the energy equations."
      },
      {
        text: "Use your resolve to accept risk and force the forge to yield.",
        effect: { type: "check", stat: "resolve", value: 13, xp: 50, next: "astral" },
        description: "Step through the flame and command it."
      }
    ]
  },
  {
    title: "Finale — The Astral Ledger",
    story:
      "The station's final chamber contains the Astral Ledger, a vault of lost routes and surviving colonies. The only way to save the crew is to resolve an ancient paradox: every starship that survives the void must choose whether to protect memory or abandon it. Your decision changes the fate of the sector.",
    threat: "The ledger is collapsing into a singularity while the void tears at your hull.",
    choices: [
      {
        text: "Archive a map of safe routes for every colony and preserve memory.",
        effect: { type: "ending", label: "The Archivist's Dawn", xp: 80 },
        description: "Guide fellow travelers home."
      },
      {
        text: "Destroy the ledger and chart a new path beyond old limits.",
        effect: { type: "ending", label: "The Horizon Breaker", xp: 80 },
        description: "Forge a future outside the known map."
      }
    ]
  }
];

const statEl = document.getElementById("stat-list");
const storyText = document.getElementById("story-text");
const choicesEl = document.getElementById("choices");
const logEl = document.getElementById("log");
const inventoryEl = document.getElementById("inventory");
const threatText = document.getElementById("threat-text");
const chapterBanner = document.getElementById("chapter-banner");
const levelEl = document.getElementById("level");
const hullEl = document.getElementById("hull");
const xpFill = document.getElementById("xp-fill");
const xpText = document.getElementById("xp-text");

function renderStats() {
  statEl.innerHTML = statsTemplate
    .map(
      (stat) => `
        <div class="stat-row">
          <span>${stat.label}</span>
          <strong>${state.stats[stat.key]}</strong>
        </div>
      `
    )
    .join("");
}

function renderInventory() {
  inventoryEl.innerHTML = state.inventory.map((item) => `<li>${item}</li>`).join("");
}

function updateXPBar() {
  const ratio = Math.min((state.xp / state.xpToNext) * 100, 100);
  xpFill.style.width = `${ratio}%`;
  xpText.textContent = `${state.xp} / ${state.xpToNext} XP`;
  levelEl.textContent = state.level;
}

function renderLog() {
  logEl.innerHTML = state.log.slice(-5).map((entry) => `<li>${entry}</li>`).join("");
}

function renderChapter() {
  const chapter = chapters[state.chapterIndex];
  chapterBanner.textContent = chapter.title;
  storyText.textContent = chapter.story;
  threatText.textContent = chapter.threat;

  choicesEl.innerHTML = chapter.choices
    .map(
      (choice, index) => `
        <button class="choice-btn" data-choice-index="${index}">
          ${choice.text}<br><small>${choice.description}</small>
        </button>
      `
    )
    .join("");

  choicesEl.querySelectorAll(".choice-btn").forEach((button) => {
    button.addEventListener("click", handleChoice);
  });
}

function addXp(amount) {
  state.xp += amount;
  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = Math.round(state.xpToNext * 1.35);
    state.stats.logic += 1;
    state.stats.engineering += 1;
    state.stats.resolve += 1;
    state.log.push(`Level up! ${state.name} is now level ${state.level}.`);
  }
  updateXPBar();
}

function triggerOutcome(success, choice) {
  if (success) {
    addXp(choice.effect.xp || 0);
    state.log.push(`Success: ${choice.text}`);
    if (choice.effect.type === "ending") {
      const ending = choice.effect.label;
      storyText.textContent = `Ending reached: ${ending}. The sector survives by choosing a path of memory, adaptation, and hope. Your crew lives to carry the star charts into the next age.`;
      choicesEl.innerHTML = '<button class="choice-btn">New expedition begins...</button>';
      choicesEl.querySelector(".choice-btn").addEventListener("click", () => {
        window.location.reload();
      });
      return;
    }
    state.chapterIndex += 1;
    state.chapterUnlocks[state.chapterIndex] = true;
    if (state.chapterIndex >= chapters.length) {
      state.chapterIndex = chapters.length - 1;
    }
    state.log.push(`Chapter clear. Heading to ${chapters[state.chapterIndex].title}.`);
    renderChapter();
  } else {
    state.hull = Math.max(0, state.hull - 12);
    hullEl.textContent = state.hull;
    state.log.push(`Hazard worsened. Hull integrity fell to ${state.hull}%.`);
    if (state.hull <= 0) {
      storyText.textContent = "The ship fails before the solution stabilizes. The void swallows your crew, and the region becomes another lost whisper in the dark.";
      choicesEl.innerHTML = '<button class="choice-btn">Restart voyage</button>';
      choicesEl.querySelector(".choice-btn").addEventListener("click", () => window.location.reload());
    }
  }
  renderLog();
  renderStats();
}

function handleChoice(event) {
  const index = Number(event.currentTarget.dataset.choiceIndex);
  const choice = chapters[state.chapterIndex].choices[index];
  const requirement = choice.effect.value;
  const statKey = choice.effect.stat;
  const skillValue = state.stats[statKey] ?? 0;

  const success = skillValue >= requirement || choice.effect.type === "ending";

  if (success) {
    triggerOutcome(true, choice);
  } else {
    triggerOutcome(false, choice);
  }
}

function initialize() {
  renderStats();
  renderInventory();
  renderLog();
  updateXPBar();
  hullEl.textContent = state.hull;
  renderChapter();
}

initialize();
