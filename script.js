const GAME_FALLBACK = [
  "Strinova | APAC | Fuyuki/2338894 | assets/games/strinova.png",
  "Genshin Impact | ASIA | 821913008 | assets/games/genshin.png",
  "Honkai: Star Rail | ASIA | 802186409 | assets/games/hsr.png",
  "Zenless Zone Zero | ASIA | 1300360900 | assets/games/zzz.png",
  "Honkai Impact 3 | SEA | 19571141 | assets/games/honkai3.png",
  "Wuthering Waves | SEA | 902325263 | assets/games/wutheringwaves.png",
  "Arknights Endfield | ASIA | 4188693877 | assets/games/a9e.png",
  "Neverness to Everness | SEA | 218215404445 | assets/games/nte.png",
  "Nikke | SEA | 06120920 | assets/games/nikke.png",
  "Blue Archive | SEA | AYYORDSP | assets/games/ba.png",
];

const SOCIAL_FALLBACK = [
  "Facebook | https://facebook.com/nagashitafuyuki | Nagashita Fuyuki | assets/social/facebook.png",
  "YouTube | https://youtube.com/@nagashitafuyuki | Nagashita Fuyuki | assets/social/youtube.png",
  "Steam | https://steamcommunity.com/profiles/76561199244163472/ | Nagashita Fuyuki | assets/social/steam.png",
  "Epic Games | https://store.epicgames.com/u/nagashitafuyuki | Nagashita Fuyuki | assets/social/epic.png",
  "X | https://x.com/NagashitaFuyuki | Nagashita Fuyuki | assets/social/x.png",
  "Twitch | https://twitch.tv/nagashitafuyuki | Nagashita Fuyuki | assets/social/twitch.png",
  "GitHub | https://github.com/nagashitafuyuki | Nagashita Fuyuki | assets/social/github.png",
  "Discord | https://discord.com/users/700149641403957349 | Nagashita Fuyuki | assets/social/discord.png",
];

const GEAR_FALLBACK = [
  "Mouse | Attack shark x11 | assets/gear/mouse.png",
  "Keyboard | DareU EK87 Black (Multi-LED) | assets/gear/keyboard.png",
  "Headphone | Moxpad x3 | assets/gear/headphone.png",
  "Gamepad | Gamesir Nova 2 Lite | assets/gear/gamepad.png",
];

const socialGrid = document.getElementById("social-grid");
const grid = document.getElementById("games-grid");
const gearGrid = document.getElementById("gear-grid");
const socialTemplate = document.getElementById("social-card-template");
const template = document.getElementById("game-card-template");
const gearTemplate = document.getElementById("gear-card-template");
const toast = document.getElementById("toast");

function parseLine(line) {
  const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 3) return null;

  const [title, server, uid, icon] = parts;

  return {
    title,
    icon: icon || "assets/avatar.png",
    server,
    uid,
  };
}

function parseGearLine(line) {
  const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  const [title, value, icon] = parts;

  return {
    title,
    icon: icon || "assets/avatar.png",
    value,
  };
}

function parseSocialLine(line) {
  const parts = line.split("|").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 3) return null;

  const [name, url, subtitle, icon] = parts;

  return {
    name,
    url,
    subtitle: subtitle || "Nagashita Fuyuki",
    icon: icon || "assets/avatar.png",
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
      icon.alt = social.name;

      node.querySelector(".social-name").textContent = social.name;
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

async function loadGame() {
  try {
    const response = await fetch("game.txt", { cache: "no-store" });
    if (!response.ok) throw new Error("game.txt not available");
    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    renderGames(lines.length ? lines : GAME_FALLBACK);
  } catch {
    renderGames(GAME_FALLBACK);
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
loadGame();
loadGear();
