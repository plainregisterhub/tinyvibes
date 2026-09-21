/**
 * UI Module
 * Controls the 10-slot single-row toolbar and the Storage modal dialog.
 */

export class UIManager {
  constructor(slotContainer, storageTriggerBtn, storageDialog, onToast) {
    this.slotContainer = slotContainer;
    this.storageTriggerBtn = storageTriggerBtn;
    this.storageDialog = storageDialog;
    this.onToast = onToast;

    this.selectedSlotIndex = 1; // Slot 1 selected by default (1-indexed)
    this.lastFocusedElement = null;

    this.initSlots();
    this.initStorage();
  }

  /* ---------------- 10-Slot Strip ---------------- */
  initSlots() {
    if (!this.slotContainer) return;
    this.slotContainer.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.dataset.slotIndex = i.toString();
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", `Slot ${i}`);
      btn.setAttribute("aria-selected", i === this.selectedSlotIndex ? "true" : "false");
      btn.textContent = i.toString();

      btn.addEventListener("click", () => this.selectSlot(i));
      btn.addEventListener("keydown", (e) => this.handleSlotKeyNav(e, i));

      this.slotContainer.appendChild(btn);
    }
  }

  selectSlot(index) {
    if (index < 1 || index > 10) return;
    this.selectedSlotIndex = index;

    const slots = this.slotContainer.querySelectorAll(".slot-btn");
    slots.forEach((slot) => {
      const isSelected = slot.dataset.slotIndex === index.toString();
      slot.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
  }

  handleSlotKeyNav(e, currentIndex) {
    let target = null;
    if (e.key === "ArrowRight") {
      target = currentIndex < 10 ? currentIndex + 1 : 1;
    } else if (e.key === "ArrowLeft") {
      target = currentIndex > 1 ? currentIndex - 1 : 10;
    }

    if (target) {
      e.preventDefault();
      this.selectSlot(target);
      const targetBtn = this.slotContainer.querySelector(`[data-slot-index="${target}"]`);
      if (targetBtn) targetBtn.focus();
    }
  }

  /* ---------------- Storage Dialog ---------------- */
  initStorage() {
    if (!this.storageTriggerBtn || !this.storageDialog) return;

    const closeBtn = document.getElementById("storage-close-btn");
    const confirmBtn = document.getElementById("storage-confirm-btn");

    this.storageTriggerBtn.addEventListener("click", () => this.openStorage());
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeStorage());
    if (confirmBtn) confirmBtn.addEventListener("click", () => this.closeStorage());

    // Backdrop click to dismiss
    this.storageDialog.addEventListener("click", (e) => {
      if (e.target === this.storageDialog) {
        this.closeStorage();
      }
    });

    // Escape key handling
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.storageDialog.hidden) {
        this.closeStorage();
      }
    });
  }

  openStorage() {
    this.lastFocusedElement = document.activeElement;
    this.storageDialog.hidden = false;
    this.storageTriggerBtn.setAttribute("aria-expanded", "true");

    const closeBtn = document.getElementById("storage-close-btn");
    if (closeBtn) closeBtn.focus();
  }

  closeStorage() {
    this.storageDialog.hidden = true;
    this.storageTriggerBtn.setAttribute("aria-expanded", "false");

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === "function") {
      this.lastFocusedElement.focus();
    }
  }
}
