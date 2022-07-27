import { prisma } from "../../src/database.js";

export async function deleteAllData() {
  await prisma.recommendation.deleteMany({});
}
