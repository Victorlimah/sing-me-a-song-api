import supertest from "supertest";

import app from "../src/app.js";
import * as scenario from "./factories/scenarioFactory.js";
import { recommendationFactory } from "./factories/recommendationFactory.js";

import { prisma } from "../src/database.js";

beforeEach(async () => {
  await scenario.deleteAllData();
})

const agent = supertest.agent(app);

describe("🌱 ~ POST /recommendations", () => {
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

describe("🌱 ~ GET /recommendations", () => {
  it("✨ 200 ~ Get all recommendations", async () => {
    const recommendation1 = recommendationFactory();
    const recommendation2 = recommendationFactory();
    
    await agent.post("/recommendations").send(recommendation1);
    await agent.post("/recommendations").send(recommendation2);

    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);

    expect(response.body[0].name).toBe(recommendation2.name);
    expect(response.body[0].youtubeLink).toBe(recommendation2.youtubeLink);

    expect(response.body[1].name).toBe(recommendation1.name);
    expect(response.body[1].youtubeLink).toBe(recommendation1.youtubeLink);
  });

  it("✨ 200 ~ Get empty recommendations", async () => {
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});