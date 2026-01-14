import { DIFICULTADES } from './MinigameData.js'; 

export default class GlyphTierData {

  static TIER_DATA = [
    { tier: "B", img: "ankh" },
    { tier: "A", img: "ba" },
    { tier: "S", img: "uraeus" },
  ];

  //=== PROBABILIDADES POR DIFICULTAD ===
  static rewardsByDifficulty = {
    easy: {
      probabilities: { B: 0.8, A: 0.2, S: 0.0 },
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

  //=== RECOMPENSAS BASE POR DIFICULTAD ===
  static baseRewards = {
    easy:  { B: 2 },
    medium:{ A: 1, B: 1 },
    hard:  { A: 1, B: 2 }
  };

  //=== COSTES PARA DESBLOQUEAR DIFICULTAD ===
  static unlockCosts = {
    medium: { A: 1, B: 3 },
    hard:   { S: 1, A: 2, B: 5 }
  };

  //=== MÉTODO: comprobar si tiene recursos para desbloquear ===
  static canUnlockDifficulty(playerInventory, difficulty) {
    if (difficulty === 'easy') return true;

    const cost = this.unlockCosts[difficulty];
    if (!cost) return true;

    return (
      (playerInventory.S >= (cost.S || Infinity)) ||
      (playerInventory.A >= (cost.A || Infinity)) ||
      (playerInventory.B >= (cost.B || Infinity))
    );
  }

  //=== METODO: Aplicar coste al desbloquear dificultad ===
  static applyUnlockCost(playerInventory, difficulty) {
    const cost = this.unlockCosts[difficulty];
    if (!cost) return;

    if (playerInventory.S >= (cost.S || Infinity)) playerInventory.S -= cost.S;
    else if (playerInventory.A >= (cost.A || Infinity)) playerInventory.A -= cost.A;
    else if (playerInventory.B >= (cost.B || Infinity)) playerInventory.B -= cost.B;
  }

  // -------------------------------
  //      NUEVA LÓGICA DE RECOMPENSAS
  // -------------------------------

  // Recompensas aleatorias
  static getRandomReward(difficulty) {
    const probabilities = this.rewardsByDifficulty[difficulty].probabilities;
    return this.getRewardTier(probabilities);
  }

  // Recompensas aleatorias múltiples
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

  // BONUS por perfect score
  static getBonusReward(difficulty) {
    const tier = this.getRandomReward(difficulty);
    return { [tier]: 1 };
  }

  static difficultyMap = {
    FACIL: 'easy',
    MEDIA: 'medium',
    DIFICIL: 'hard'
  };

  static getRewardTier(probabilities) {
    const rand = Math.random();
    let cumulative = 0;

    for (const [tier, prob] of Object.entries(probabilities)) {
      cumulative += prob;
      if (rand <= cumulative) return tier;
    }

    return "B"; // seguridad por flotantes
  }
}