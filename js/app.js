/**
 * Application Entry Point
 * Coordinates and boots all prototype sub-modules.
 */

import { LayoutManager } from "./layout.js";
import { PlanetManager } from "./planet.js";
import { UIManager } from "./ui.js";
import { FullscreenManager } from "./fullscreen.js";

document.addEventListener("DOMContentLoaded", () => {
  const appShell = document.getElementById("app");
  const gameplayCanvas = document.getElementById("gameplay-canvas");
  const planet = document.getElementById("planet");
  const slotStrip = document.getElementById("slot-strip");
  const storageBtn = document.getElementById("storage-open-btn");
  const storageDialog = document.getElementById("storage-dialog");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const toastElement = document.getElementById("toast");

  // Non-intrusive toast helper
  let toastTimer = null;
  const showToast = (message) => {
    if (!toastElement) return;
    toastElement.textContent = message;
    toastElement.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastElement.classList.remove("show");
    }, 2800);
  };

  // 1. Initialize Layout Stability
  new LayoutManager();

  // 2. Initialize Empty Planet Presentation
  new PlanetManager(planet, gameplayCanvas);

  // 3. Initialize 10-Slot Strip & Storage UI
  new UIManager(slotStrip, storageBtn, storageDialog, showToast);

  // 4. Initialize Fullscreen Controller
  new FullscreenManager(appShell, fullscreenBtn, showToast);

  console.log("TinyVibes Prototype 0.1 (Empty Planet) initialized successfully.");
});
