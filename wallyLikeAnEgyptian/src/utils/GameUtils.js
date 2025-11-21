// clase con funciones utiles para exportar en el proyecto

export function obtenerJeroglifico(dificultad) {
  const probs = DIFICULTADES[dificultad].probJeroglificos;
  const rand = Math.random();

  if (rand < probs.S) return "S"; // Jeroglífico Élite
  if (rand < probs.S + probs.A) return "A"; // Jeroglífico Raro
  return "B"; // Jeroglífico Común
}
