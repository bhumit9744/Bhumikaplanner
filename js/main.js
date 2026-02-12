import { generateGuestUID, debounce } from "./utils.js";
import { showToast } from "./notifications.js";

import { addMission, deleteMission, getMissions, listenMissions } from "./missions.js";
import { getScratchpad, updateScratchpad, listenScratchpad } from "./scratchpad.js";
import { addReminder, deleteReminder, getReminders, listenReminders } from "./reminders.js";
import { updatePresence, getPresence } from "./presence.js";

let currentUID = generateGuestUID();
let scratchpadId = null;
let isTyping = false;
let activeReminders = [];

function setUserUI() {
  document.getElementById("display-name").textContent = `Member ${currentUID.substring(0, 8)}`;
  document.getElementById("display-uid").textContent = currentUID;
}

function hideLoading() {
  document.getElementById("loading-overlay").style.display = "none";
}

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark";

  root.setAttribute("data-theme", isDark ? "light" : "dark");

  const icon = document.querySelector("#theme-toggle i");
  icon.setAttribute("data-lucide", isDark ? "moon" : "sun");

  lucide.createIcons();
}

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

/* ---------------- MISSIONS UI ---------------- */

async function refreshMissions() {
  const { data, error } = await getMissions();
  const list = document.getElementById("shared-tasks-list");
  const empty = document.getElementById("empty-state");

  list.innerHTML = "";

  if (error) {
    showToast("Failed to load missions");
    return;
  }

  if (!data || data.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  data.forEach((task) => {
    const row = document.createElement("tr");
    row.className = "task-row";

    row.innerHTML = `
      <td style="font-weight:700">${task.title}</td>
      <td style="color:var(--text-muted)">${task.subject}</td>
      <td style="font-weight:600">${task.deadline?.slice(0,10)}</td>
      <td>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <span class="badge">${task.type}</span>
          ${task.resource_link ? `<a href="${task.resource_link}" target="_blank" class="file-link"><i data-lucide="link" size="12"></i> Link</a>` : ""}
        </div>
      </td>
      <td><span style="font-size:0.7rem; color:var(--text-muted); font-family:monospace;">${task.created_by?.substring(0,6)}</span></td>
      <td>
        <button class="delete-mission-btn" data-id="${task.id}" style="background:none; color:var(--text-muted)">
          <i data-lucide="trash-2" size="14"></i>
        </button>
      </td>
    `;

    list.appendChild(row);
  });

  document.querySelectorAll(".delete-mission-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteMission(btn.dataset.id);
      showToast("Mission deleted");
    });
  });

  lucide.createIcons();
}

document.getElementById("shared-task-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("m-name").value,
    subject: document.getElementById("m-subject").value,
    deadline: document.getElementById("m-date").value,
    type: document.getElementById("m-category").value,
    resource_link: document.getElementById("m-file-url").value,
    created_by: currentUID
  };

  await addMission(data);
  showToast("Mission posted to ledger");

  e.target.reset();
  document.getElementById("m-category").value = "Assignment";
});

/* ---------------- SCRATCHPAD UI ---------------- */

const debouncedSaveScratchpad = debounce(async (content) => {
  if (!scratchpadId) return;

  try {
    await updateScratchpad(scratchpadId, content, currentUID);
    document.getElementById("notepad-status").textContent = "Synced";
    isTyping = false;
  } catch (err) {
    document.getElementById("notepad-status").textContent = "Error";
  }
}, 800);

async function initScratchpad() {
  const { data, error } = await getScratchpad();
  if (error || !data) return;

  scratchpadId = data.id;

  const notepad = document.getElementById("public-notepad");
  notepad.value = data.content || "";

  document.getElementById("notepad-user").textContent =
    data.last_edited_by && data.last_edited_by !== currentUID
      ? `Edited by Member ${data.last_edited_by.substring(0, 6)}`
      : "Last edit by you";

  notepad.addEventListener("input", () => {
    isTyping = true;
    document.getElementById("notepad-status").textContent = "Saving...";
    debouncedSaveScratchpad(notepad.value);
  });

  listenScratchpad((newPad) => {
    if (!isTyping) {
      notepad.value = newPad.content || "";
    }

    document.getElementById("notepad-user").textContent =
      newPad.last_edited_by && newPad.last_edited_by !== currentUID
        ? `Edited by Member ${newPad.last_edited_by.substring(0, 6)}`
        : "Last edit by you";
  });
}

/* ---------------- REMINDERS UI ---------------- */

async function refreshReminders() {
  const { data, error } = await getReminders(currentUID);

  if (error) {
    showToast("Failed to load reminders");
    return;
  }

  activeReminders = data || [];

  const list = document.getElementById("reminders-list");
  list.innerHTML = "";

  activeReminders.forEach((rem) => {
    const el = document.createElement("div");
    el.className = "reminder-item";

    const dateDisplay = rem.remind_at
      ? new Date(rem.remind_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
      : "No schedule";

    el.innerHTML = `
      <div class="reminder-content">
        <span style="font-weight:600">${rem.title}</span>
        <span class="reminder-time"><i data-lucide="clock" size="10"></i> ${dateDisplay}</span>
      </div>
      <button class="delete-reminder-btn" data-id="${rem.id}" style="background:none; color:var(--text-muted); cursor:pointer">
        <i data-lucide="x" size="14"></i>
      </button>
    `;

    list.appendChild(el);
  });

  document.querySelectorAll(".delete-reminder-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await deleteReminder(btn.dataset.id);
      showToast("Reminder deleted");
    });
  });

  lucide.createIcons();
}

document.getElementById("add-reminder").addEventListener("click", async () => {
  const input = document.getElementById("reminder-text");
  const dateInput = document.getElementById("reminder-datetime");

  if (!input.value.trim()) return;

  await addReminder({
    user_uid: currentUID,
    title: input.value.trim(),
    remind_at: dateInput.value,
    done: false
  });

  input.value = "";
  dateInput.value = "";
  showToast("Reminder saved");
});

/* ---------------- REMINDER NOTIFICATION ENGINE ---------------- */

function startNotificationEngine() {
  setInterval(() => {
    const now = new Date();
    const nowStr = now.toISOString().slice(0, 16);

    activeReminders.forEach((rem) => {
      const remindStr = rem.remind_at ? rem.remind_at.slice(0, 16) : "";

      if (remindStr === nowStr && !rem.notified) {
        showToast(`Reminder: ${rem.title}`);
        rem.notified = true;
      }
    });
  }, 60000);
}

/* ---------------- PRESENCE UI ---------------- */

async function refreshPresence() {
  const users = await getPresence();
  const list = document.getElementById("users-list");
  list.innerHTML = "";

  users.forEach((u) => {
    const item = document.createElement("div");
    item.className = "user-list-item";
    item.innerHTML = `
      <div class="status-dot"></div>
      <span style="font-size:0.8rem; font-weight:600">
        USR-${u.uid.substring(0, 4)} ${u.uid === currentUID ? "(Me)" : ""}
      </span>
    `;
    list.appendChild(item);
  });
}

/* ---------------- INIT APP ---------------- */

async function initApp() {
  setUserUI();
  hideLoading();

  await updatePresence(currentUID);
  await refreshPresence();

  await refreshMissions();
  await initScratchpad();
  await refreshReminders();

  listenMissions(refreshMissions);
  listenReminders(refreshReminders);

  startNotificationEngine();

  setInterval(updatePresence, 30000, currentUID);
  setInterval(refreshPresence, 10000);

  lucide.createIcons();
}

initApp();
