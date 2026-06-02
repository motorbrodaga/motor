const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const requestForm = document.querySelector(".request-form");

menuToggle?.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => document.body.classList.remove("menu-open"));
});

requestForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const note = requestForm.querySelector(".form-note");
  if (note) {
    note.textContent = "Прототип: здесь будет отправка заявки. В реальном сайте сообщение уйдет менеджеру.";
  }
});
