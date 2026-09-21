/**
 * Layout Module
 * Handles viewport height consistency (dvb/dvh) without camera shifts.
 */

export class LayoutManager {
  constructor() {
    this.init();
  }

  init() {
    this.syncViewportUnits();
    window.addEventListener("resize", () => this.syncViewportUnits(), { passive: true });
    window.addEventListener("orientationchange", () => this.syncViewportUnits(), { passive: true });
  }

  syncViewportUnits() {
    // Sets custom CSS property for fallback in browsers where dvh is unsupported
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--app-vh", `${vh}px`);
  }
}
