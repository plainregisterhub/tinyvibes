/**
 * Planet Presentation Module
 * Enforces the visual stability of the empty planet.
 * Target: exactly 63% of the gameplay canvas width.
 */

export class PlanetManager {
  constructor(planetElement, canvasContainer) {
    this.planetElement = planetElement;
    this.canvasContainer = canvasContainer;
    this.init();
  }

  init() {
    this.ensureVisualStability();
  }

  ensureVisualStability() {
    if (!this.planetElement || !this.canvasContainer) return;
    // Pure CSS manages the strict 63% width and 1/1 aspect ratio.
    // This method guards against DOM attributes or accidental mutations.
    this.planetElement.style.pointerEvents = "none"; // Board is non-interactive in 0.1
  }
}
