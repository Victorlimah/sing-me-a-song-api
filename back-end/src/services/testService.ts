
import * as scenario from "../factories/scenariosFactory.js";

export const testsService = {
  async resetDatabase() {
    await scenario.deleteAllData();
  },

  async seedDatabase(amount: number, highScorePercentage: number) {
    await scenario.createScenarioWithNAmountAndDistribuitedScore(
      amount,
      highScorePercentage
    );
  },

  async seedLowScoreSong(score: number) {
    await scenario.createScenarioWithRecommendationDownVoted(score);
  },
};
