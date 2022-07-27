import supertest from "supertest";

import app from "../src/app.js";
import * as scenario from "./factories/scenarioFactory.js";
import { recommendationFactory } from "./factories/recommendationFactory.js";

import { prisma } from "../src/database.js";

beforeEach(async () => {
  await scenario.deleteAllData();
})

const agent = supertest.agent(app);

describe("POST /recommendations", () => {
  it("✨ 201 ~ Create a new recommendation", async () => {
    const body = recommendationFactory();

    const response = await agent.post("/recommendations").send(body);
    expect(response.status).toBe(201);

    const { name, youtubeLink } = body;
    const checkUser = await prisma.recommendation.findFirst({
      where: { name, youtubeLink },
    });

    expect(checkUser).not.toBeNull();
  });

  it("✨ 409 ~ Create a new recommendation with a conflict", async () => {
    const body = recommendationFactory();

    const create = await agent.post("/recommendations").send(body);
    expect(create.status).toBe(201);

    const conflict = await agent.post("/recommendations").send(body);
    expect(conflict.status).toBe(409);
  });

  it("✨ 422 ~ Create a new recommendation with a invalid data", async () => {
    const response = await agent.post("/recommendations").send({});
    expect(response.status).toBe(422);
  });

});