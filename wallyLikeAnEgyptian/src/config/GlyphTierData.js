import { DIFICULTADES } from './MinigameData.js'; //esto remplaza al rewards by difficulty que ya estaba hecho en el minigamedata emberdad

export default class GlyphTierData {
  
  // === DEFINICIÓN DE TIER DATA ===
  static TIER_DATA = [
    { tier: "B", img: "ankh" },
    { tier: "A", img: "ba" },
    { tier: "S", img: "uraeus" },
  ]


  // === COSTE PARA DESBLOQUEAR DIFICULTADES (si ya se ha jugado antes) ===
  static unlockCosts = {
    MEDIA: {A: 1, B: 3},
    DIFICIL: {S: 1, A: 2, B: 5 }
  };

   // === METODO: Comprobar si el jugador puede acceder a una dificultad ===
  static canUnlockDifficulty(playerInventory, difficulty) {
    // Si es facil, siempre se puede
    if (difficulty === 'FACIL') return true;

    const cost = this.unlockCosts[difficulty];
    if (!cost) return true; // si no hay coste definido, se puede

    // Revisa inventario del jugador
    const hasEnough =
      (playerInventory.S >= (cost.S || Infinity)) ||
      (playerInventory.A >= (cost.A || Infinity)) ||
      (playerInventory.B >= (cost.B || Infinity));

    return hasEnough;
  }

  // === METODO: Aplicar coste al desbloquear dificultad ===
  static applyUnlockCost(playerInventory, difficulty) {
    const cost = this.unlockCosts[difficulty];
    if (!cost) return;

    // Restamos jeroglificos segun lo que tenga el jugador
    if (playerInventory.S >= (cost.S || Infinity)) {
      playerInventory.S -= cost.S;
    } else if (playerInventory.A >= (cost.A || Infinity)) {
      playerInventory.A -= cost.A;
    } else if (playerInventory.B >= (cost.B || Infinity)) {
      playerInventory.B -= cost.B;
    }
  }

  // === MÉTODO: Dar jeroglífico al jugador tras ganar ===
  static grantGlyphReward(playerInventory, difficulty) {
    const tier = this.getRewardTier(difficulty);
    playerInventory[tier] = (playerInventory[tier] || 0) + 1;
    return tier;
  }

  static getMultipleRewards(difficulty, count) {
    // 1. Normalizamos (FACIL, MEDIA, DIFICIL)
    const diffKey = difficulty.toUpperCase();

    // 2. Obtenemos configuración en DIFICULTADES
    const difficultyData = DIFICULTADES[diffKey];

    if (!difficultyData) {
        console.error(`[GlyphTierData] Dificultad desconocida: ${diffKey}`);
        return {};
    }

    // 3. Cogemos las probabilidades reales
    const probabilities = difficultyData.probJeroglificos;

    if (!probabilities) {
        console.error(`[GlyphTierData] No hay probJeroglificos para ${diffKey}`);
        return {};
    }

    // 4. Generamos jeroglíficos
    const rewards = {};

    for (let i = 0; i < count; i++) {
        const tier = this.getRewardTier(probabilities);
        rewards[tier] = (rewards[tier] || 0) + 1;
    }

    return rewards;
  }

static getRewardTier(probabilities) {
  const rand = Math.random();
  let cumulative = 0;
  for (const [tier, prob] of Object.entries(probabilities)) {
    cumulative += prob;
    if (rand <= cumulative) return tier;
  }
  return 'B'; // fallback
}

static difficultyMap = {
  FACIL: 'easy',
  MEDIA: 'medium',
  DIFICIL: 'hard'
};

}