/**
 * script.js
 * Scripts de interacción para la página web del proyecto.
 * Controla animaciones iniciales, scroll al juego y carrusel
 * de imágenes de controles.
 */

/* =========================================================
   ANIMACIÓN INICIAL (LOGO + BOTÓN PLAY)
   ========================================================= */

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
  }, 1000);

  // Paso 3: reducimos tamaño del Logo
  setTimeout(() => {
    logo.classList.add("shrink");
  }, 3000);
});

/* =========================================================
   SCROLL SUAVE AL JUEGO (BOTÓN PLAY)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById('playBtn');
  const target = document.getElementById('game');

  if (!playBtn || !target) return;

  playBtn.addEventListener('click', (e) => {

    // Scroll suave al elemento
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =========================================================
   CARRUSEL DE IMÁGENES DE CONTROLES
   ========================================================= */
const track = document.getElementById("controlsTrack");
const slides = document.querySelectorAll(".controls-slide");
const nextBtn = document.getElementById("controlsNext");
const prevBtn = document.getElementById("controlsPrev");
const viewport = document.querySelector(".controls-viewport");

/**
 * Índice actual del carrusel.
 * @type {number}
 */
let index = 0;

/**
 * Actualiza la posición del carrusel en función del índice actual.
 */
function updateCarousel() {
  const slideWidth = viewport.offsetWidth;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
} 

// Botón siguiente
nextBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});

// Botón anterior
prevBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});