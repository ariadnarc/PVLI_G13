export default class GlyphTierData {
  
  // === DEFINICIÓN DE TIER DATA ===
  static TIER_DATA = [
    { tier: "B", img: "ankh" },
    { tier: "A", img: "ba" },
    { tier: "S", img: "uraeus" },
  ]

  // === RECOMPENSAS POR DIFICULTAD ===
  static rewardsByDifficulty = {
    easy: {
      probabilities: { B: 0.8, A: 0.2, S: 0.0 }, // 80% B, 20% A, 0% S
      description: 'Desafío básico — puedes obtener jeroglíficos comunes o raros.'
    },
    medium: {
      probabilities: { B: 0.5, A: 0.4, S: 0.1 },
      description: 'Desafío intermedio — mayor posibilidad de jeroglíficos de alto valor.'
    },
    hard: {
      probabilities: { B: 0.2, A: 0.5, S: 0.3 },
      description: 'Desafío supremo — más riesgo, pero también mayor recompensa.'
    }
  };

  // === COSTE PARA DESBLOQUEAR DIFICULTADES (si ya se ha jugado antes) ===
  static unlockCosts = {
    medium: {
      A: 1,
      B: 3
    },
    hard: {
      S: 1,
      A: 2,
      B: 5
    }
  };

   // === MÉTODO: Comprobar si el jugador puede acceder a una dificultad ===
  static canUnlockDifficulty(playerInventory, difficulty) {
    // Si es fácil, siempre se puede
    if (difficulty === 'easy') return true;

    const cost = this.unlockCosts[difficulty];
    if (!cost) return true; // si no hay coste definido, se puede

    // Revisa inventario del jugador
    const hasEnough =
      (playerInventory.S >= (cost.S || Infinity)) ||
      (playerInventory.A >= (cost.A || Infinity)) ||
      (playerInventory.B >= (cost.B || Infinity));

    return hasEnough;
  }

  // === MÉTODO: Aplicar coste al desbloquear dificultad ===
  static applyUnlockCost(playerInventory, difficulty) {
    const cost = this.unlockCosts[difficulty];
    if (!cost) return;

    // Restamos jeroglíficos según lo que tenga el jugador
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
  const rewards = {};
  const { probabilities } = this.rewardsByDifficulty[difficulty];

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