/* Barra lateral */ 
const sidebar = document.getElementById("sidebar");

// Mostrar barra si el ratón toca el borde izquierdo (0–10px)
document.addEventListener("mousemove", (e) => {
  if (e.clientX <= 10) {
    sidebar.classList.add("expanded");
  }
});

// Ocultar barra al salir de ella
sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.remove("expanded");
});

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