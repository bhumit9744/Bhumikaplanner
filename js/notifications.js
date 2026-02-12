export function showToast(message) {
  const center = document.getElementById("notification-center");

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i data-lucide="bell"></i><span>${message}</span>`;

  center.appendChild(toast);

  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
