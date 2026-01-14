/* Sección Home */ 

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo");
  const playBtn = document.querySelector(".play-btn");

  // Paso 1: mostrar logo
  setTimeout(() => {
    logo.classList.add("show");
  }, 300);

  // Paso 2: mostrar botón después
  setTimeout(() => {
    playBtn.classList.add("show");
  }, 1500);

  // Paso 3: reducimos tamaño del Logo
  setTimeout(() => {
    logo.classList.add("shrink");
  }, 3000);
});

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById('playBtn');
  const target = document.getElementById('game');

  if (!playBtn || !target) return;

  playBtn.addEventListener('click', (e) => {

    // Scroll suave al elemento
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Carrousel imagenes controles
const track = document.getElementById("controlsTrack");
const slides = document.querySelectorAll(".controls-slide");
const nextBtn = document.getElementById("controlsNext");
const prevBtn = document.getElementById("controlsPrev");
const viewport = document.querySelector(".controls-viewport");

let index = 0;

function updateCarousel() {
  const slideWidth = viewport.offsetWidth;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
} 

nextBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});


// Sección NEWS
// Scroll al ultimo mensaje
const chat = document.querySelector(".news .chat");

function scrollChatToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

// Al cargar la página
window.addEventListener("load", scrollChatToBottom);