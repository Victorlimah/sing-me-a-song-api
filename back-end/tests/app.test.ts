import supertest from "supertest";

import app from "../src/app.js";
import * as scenario from "./factories/scenarioFactory.js";
import recommendationFactory from "./factories/recommendationFactory.js";

import { prisma } from "../src/database.js";

beforeEach(async () => {
  await scenario.deleteAllData();
})

const agent = supertest.agent(app);

describe("Recommendation", () => {
  it("POST /recommendation 201", async () => {
    const body = await recommendationFactory();

    const response = await agent.post("/recommendations").send(body);
    console.log(response);
    expect(response.status).toBe(201);


    const { name, youtubeLink } = body;
    const checkUser = await prisma.recommendation.findFirst({
      where: { name, youtubeLink }
    });

    expect(checkUser).not.toBeNull();
  });



});