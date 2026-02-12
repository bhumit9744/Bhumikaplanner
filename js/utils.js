export function generateGuestUID() {
  let uid = localStorage.getItem("guest_uid");
  if (!uid) {
    uid = "GUEST-" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("guest_uid", uid);
  }
  return uid;
}

export function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
