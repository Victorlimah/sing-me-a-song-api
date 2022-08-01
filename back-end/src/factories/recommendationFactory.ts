import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

import { prisma } from "../database.js";

type FactoryRecommendationData = Omit<Recommendation, "id">;

export const recommendationFactory = {
  createData(
    name = "Test name",
    youtubeLink = "https://www.youtube.com/watch",
    score = 0
  ): FactoryRecommendationData {
    return {
      name,
      youtubeLink,
      score,
    };
  },
  createRandomData(score = 0): FactoryRecommendationData {
    return {
      name: faker.random.alphaNumeric(10),
      youtubeLink: "https://www.youtube.com/watch",
      score,
    };
  },

  insertData(data: FactoryRecommendationData) {
    return prisma.recommendation.create({ data });
  },
};
