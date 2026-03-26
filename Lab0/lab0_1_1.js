const firstName = prompt("Введите ваше имя:");
const lastName = prompt("Введите вашу фамилию:");

const greeting = (firstName && lastName)
  ? `Здравствуй, ${firstName} ${lastName}!`
  : "Здравствуй, Гость!";

document.getElementById("greeting").textContent = greeting;