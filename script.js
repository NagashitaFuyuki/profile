const GAME_META = {
  strinova: { title: "Strinova", icon: "assets/games/strinova.png" },
  gi: { title: "Genshin Impact", icon: "assets/games/genshin.png" },
  hsr: { title: "Honkai: Star Rail", icon: "assets/games/hsr.png" },
  zzz: { title: "Zenless Zone Zero", icon: "assets/games/zzz.png" },
  hi3: { title: "Honkai Impact 3", icon: "assets/games/honkai3.png" },
  wuwa: { title: "Wuthering Waves", icon: "assets/games/wutheringwaves.png" },
  a9e: { title: "Arknights Endfield", icon: "assets/games/a9e.png" },
  nte: { title: "Neverness to Everness", icon: "assets/games/nte.png" },
  nikke: { title: "Nikke", icon: "assets/games/nikke.png" },
  ba: { title: "Blue Archive", icon: "assets/games/ba.png" },
};

const SOCIAL_META = {
  facebook: { title: "Facebook", icon: "assets/social/facebook.png" },
  youtube: { title: "YouTube", icon: "assets/social/youtube.png" },
  steam: { title: "Steam", icon: "assets/social/steam.png" },
  epicgames: { title: "Epic Games", icon: "assets/social/epic.png" },
  epic: { title: "Epic Games", icon: "assets/social/epic.png" },
  x: { title: "X", icon: "assets/social/x.png" },
  twitter: { title: "X", icon: "assets/social/x.png" },
  twitch: { title: "Twitch", icon: "assets/social/twitch.png" },
  github: { title: "GitHub", icon: "assets/social/github.png" },
  discord: { title: "Discord", icon: "assets/social/discord.png" },
};

const PROFILE_FALLBACK = [
  "Strinova - APAC - Fuyuki/2338894",
  "GI - ASIA - 821913008",
  "HSR - ASIA - 802186409",
  "ZZZ - ASIA - 1300360900",
  "HI3 - SEA - 19571141",
  "WuWa - SEA - 902325263",
  "A9E - ASIA - 4188693877",
  "NTE - SEA - 218215404445",
  "Nikke - SEA - 06120920",
  "BA - SEA - AYYORDSP",
];

const SOCIAL_FALLBACK = [
  "facebook | Facebook | https://facebook.com/nagashitafuyuki",
  "youtube | YouTube | https://youtube.com/@nagashitafuyuki",
  "steam | Steam | https://steamcommunity.com/profiles/76561199244163472/",
  "epic | Epic Games | https://store.epicgames.com/u/nagashitafuyuki",
  "x | X | https://x.com/NagashitaFuyuki",
  "twitch | Twitch | https://twitch.tv/nagashitafuyuki",
  "github | GitHub | https://github.com/nagashitafuyuki",
  "discord | Discord | https://discord.com/users/700149641403957349",
];

const GEAR_META = {
  mouse: { title: "Mouse", icon: "assets/gear/mouse.png" },
  keyboard: { title: "Keyboard", icon: "assets/gear/keyboard.png" },
  headphone: { title: "Headphone", icon: "assets/gear/headphone.png" },
  gamepad: { title: "Gamepad", icon: "assets/gear/gamepad.png" },
};

const GEAR_FALLBACK = [
  "Mouse: Attack shark x11",
  "Keyboard: DareU EK87 Black (Multi-LED)",
  "Headphone: Moxpad x3",
  "Gamepad: Gamesir Nova 2 Lite",
];

const socialGrid = document.getElementById("social-grid");
const grid = document.getElementById("games-grid");
const gearGrid = document.getElementById("gear-grid");
const socialTemplate = document.getElementById("social-card-template");
const template = document.getElementById("game-card-template");
const gearTemplate = document.getElementById("gear-card-template");
const toast = document.getElementById("toast");

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseLine(line) {
  const parts = line.split("-").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 3) return null;

  const [rawName, server, ...uidParts] = parts;
  const uid = uidParts.join(" - ").trim();
  const meta = GAME_META[normalizeKey(rawName)] || {
    title: rawName,
    icon: "assets/avatar.png",
  };

  return {
    title: meta.title,
    icon: meta.icon,
    server,
    uid,
  };
}

function parseGearLine(line) {
  const parts = line.split(":");
  if (parts.length < 2) return null;

  const rawName = parts.shift().trim();
  const value = parts.join(":").trim();
  const meta = GEAR_META[normalizeKey(rawName)] || {
    title: rawName,
    icon: "assets/avatar.png",
  };

  return {
    title: meta.title,
    icon: meta.icon,
    value,
  };
}

function parseSocialLine(line) {
  const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 3) return null;

  const [rawKey, name, url, subtitle] = parts;
  const meta = SOCIAL_META[normalizeKey(rawKey)] || {
    title: name,
    icon: "assets/avatar.png",
  };

  return {
    title: meta.title,
    icon: meta.icon,
    name,
    url,
    subtitle: subtitle || "Nagashita Fuyuki",
  };
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1400);
}

function renderGames(lines) {
  if (!grid || !template) return;
  grid.innerHTML = "";

  lines
    .map(parseLine)
    .filter(Boolean)
    .forEach((game, index) => {
      const node = template.content.firstElementChild.cloneNode(true);
      node.querySelector(".card-index").textContent = String(index + 1).padStart(2, "0");

      const icon = node.querySelector(".game-icon");
      icon.src = game.icon;
      icon.alt = game.title;

      node.querySelector(".game-title").textContent = game.title;
      node.querySelector(".game-server").textContent = game.server;
      node.querySelector(".uid-value").textContent = game.uid || "-";

      const copyButton = node.querySelector(".uid-copy");
      copyButton.addEventListener("click", async () => {
        const value = game.uid || "";
        if (!value) return;
        try {
          await navigator.clipboard.writeText(value);
          showToast("Copied UID");
        } catch {
          showToast("Copy failed");
        }
      });

      grid.appendChild(node);
    });
}

function renderSocial(lines) {
  if (!socialGrid || !socialTemplate) return;
  socialGrid.innerHTML = "";

  lines
    .map(parseSocialLine)
    .filter(Boolean)
    .forEach((social) => {
      const node = socialTemplate.content.firstElementChild.cloneNode(true);
      node.href = social.url;

      const icon = node.querySelector(".social-icon");
      icon.src = social.icon;
      icon.alt = social.title;

      node.querySelector(".social-name").textContent = social.name || social.title;
      node.querySelector(".social-handle").textContent = social.subtitle;

      socialGrid.appendChild(node);
    });
}

function renderGear(lines) {
  if (!gearGrid || !gearTemplate) return;
  gearGrid.innerHTML = "";

  lines
    .map(parseGearLine)
    .filter(Boolean)
    .forEach((gear) => {
      const node = gearTemplate.content.firstElementChild.cloneNode(true);
      const icon = node.querySelector(".gear-icon");
      icon.src = gear.icon;
      icon.alt = gear.title;

      node.querySelector(".gear-title").textContent = gear.title;
      node.querySelector(".gear-value").textContent = gear.value || "-";

      gearGrid.appendChild(node);
    });
}

async function loadProfile() {
  try {
    const response = await fetch("profile.txt", { cache: "no-store" });
    if (!response.ok) throw new Error("profile.txt not available");
    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    renderGames(lines.length ? lines : PROFILE_FALLBACK);
  } catch {
    renderGames(PROFILE_FALLBACK);
  }
}

async function loadSocial() {
  try {
    const response = await fetch("social.txt", { cache: "no-store" });
    if (!response.ok) throw new Error("social.txt not available");
    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    renderSocial(lines.length ? lines : SOCIAL_FALLBACK);
  } catch {
    renderSocial(SOCIAL_FALLBACK);
  }
}

async function loadGear() {
  try {
    const response = await fetch("gear.txt", { cache: "no-store" });
    if (!response.ok) throw new Error("gear.txt not available");
    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    renderGear(lines.length ? lines : GEAR_FALLBACK);
  } catch {
    renderGear(GEAR_FALLBACK);
  }
}

loadSocial();
loadProfile();
loadGear();
