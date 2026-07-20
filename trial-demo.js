(() => {
  "use strict";

  const LOCKED_TABS = new Set(["tab3", "tab4"]);
  const EXPORT_PATTERN = /export|excel|pdf|word|print/i;

  function dialog() {
    let element = document.getElementById("trialDialog");
    if (element) return element;
    element = document.createElement("dialog");
    element.id = "trialDialog";
    element.innerHTML = `
      <div class="trial-dialog-body">
        <h2>Full calculator feature</h2>
        <p>This public VivaTEQ trial demonstrates ETTV and RETV calculations. RTTV, U-Value, drawing upload, file storage and report exports are available in the full company edition.</p>
        <p>Contact VivaTEQ to request full company trial access.</p>
        <button type="button" data-close-trial-dialog>Close</button>
      </div>`;
    document.body.appendChild(element);
    element.querySelector("[data-close-trial-dialog]").addEventListener("click", () => element.close());
    return element;
  }

  function showRestriction() {
    const element = dialog();
    if (!element.open) element.showModal();
  }

  function addBanner() {
    if (document.querySelector(".trial-banner")) return;
    const banner = document.createElement("div");
    banner.className = "trial-banner";
    banner.setAttribute("role", "status");
    banner.innerHTML = `
      <div>
        <strong>VivaTEQ Public Trial Demo</strong>
        <span>ETTV and RETV are available. RTTV, U-Value, storage and exports are disabled.</span>
      </div>
      <span class="trial-badge">LIMITED TRIAL</span>`;
    const target = document.querySelector(".update-banner") || document.querySelector(".tabs");
    target?.parentNode.insertBefore(banner, target);
  }

  function applyRestrictions() {
    document.querySelectorAll(".tab-btn").forEach((button) => {
      if (LOCKED_TABS.has(button.dataset.tab)) {
        button.classList.add("trial-locked");
        button.setAttribute("aria-disabled", "true");
        button.title = "Available in the full company edition";
      }
    });

    document.querySelectorAll("button").forEach((button) => {
      const signature = `${button.textContent || ""} ${button.getAttribute("onclick") || ""}`;
      if (EXPORT_PATTERN.test(signature)) {
        button.classList.add("trial-locked");
        button.setAttribute("aria-disabled", "true");
        button.title = "Exports are disabled in the public trial";
      }
    });

    document.querySelectorAll('input[type="file"]').forEach((input) => {
      input.disabled = true;
      input.closest(".drawing-upload")?.classList.add("trial-locked");
    });

    document.querySelectorAll(".simple-folder-storage, .connection-controls").forEach((element) => {
      element.hidden = true;
    });
  }

  document.addEventListener("click", (event) => {
    const tab = event.target.closest?.(".tab-btn");
    const button = event.target.closest?.("button");
    const lockedTab = tab && LOCKED_TABS.has(tab.dataset.tab);
    const signature = button ? `${button.textContent || ""} ${button.getAttribute("onclick") || ""}` : "";
    if (lockedTab || (button && EXPORT_PATTERN.test(signature))) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showRestriction();
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "p") {
      event.preventDefault();
      showRestriction();
    }
  }, true);

  window.exportExcel = showRestriction;
  window.exportFullPDF = showRestriction;

  window.addEventListener("load", () => {
    addBanner();
    applyRestrictions();
    new MutationObserver(applyRestrictions).observe(document.body, { childList: true, subtree: true });
  });
})();
