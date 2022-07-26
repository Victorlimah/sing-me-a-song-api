import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database.js";

export default async function recommendationFactory() {
  const name = faker.name.findName();
  const youtubeLink = `https://www.youtube.com/watch`;

  return { name, youtubeLink };
}