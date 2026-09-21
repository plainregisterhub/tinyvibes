/**
 * Fullscreen Module
 * Handles browser Fullscreen API requests, state sync, and graceful fallbacks.
 */

export class FullscreenManager {
  constructor(appElement, buttonElement, onMessage) {
    this.appElement = appElement;
    this.buttonElement = buttonElement;
    this.onMessage = onMessage || (() => {});
    this.init();
  }

  init() {
    if (!this.buttonElement) return;

    this.buttonElement.addEventListener("click", () => this.toggleFullscreen());
    document.addEventListener("fullscreenchange", () => this.syncButtonState());
    document.addEventListener("webkitfullscreenchange", () => this.syncButtonState());

    this.syncButtonState();
  }

  isSupported() {
    return Boolean(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled
    );
  }

  isFullscreen() {
    return Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement
    );
  }

  async toggleFullscreen() {
    if (!this.isSupported()) {
      this.onMessage("Fullscreen is not supported on this browser.");
      return;
    }

    try {
      if (!this.isFullscreen()) {
        if (this.appElement.requestFullscreen) {
          await this.appElement.requestFullscreen();
        } else if (this.appElement.webkitRequestFullscreen) {
          await this.appElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      // Graceful fallback for rejected fullscreen (e.g. iframe policy or user cancel)
      this.onMessage("Fullscreen request was declined by browser.");
      console.warn("Fullscreen toggle prevented:", err);
    }
  }

  syncButtonState() {
    if (!this.buttonElement) return;
    const active = this.isFullscreen();
    const label = active ? "Exit Fullscreen" : "Enter Fullscreen";

    this.buttonElement.setAttribute("aria-label", label);
    this.buttonElement.title = label;

    // Minimal SVG icon swap
    if (active) {
      this.buttonElement.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      `;
    } else {
      this.buttonElement.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      `;
    }
  }
}
