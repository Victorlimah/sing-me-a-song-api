/* eslint-disable no-undef */
/// <reference types="cypress" />

beforeEach(() => {
  cy.clearDatabase();
});

describe("Recommendations test suite", () => {
  describe("Create a song recommendation", () => {
    it("should add a song recommendation", () => {
      cy.visit("http://localhost:3000/");

      cy.get("input[placeholder='Name']").type(
        "Diego Pinho - Caractere mais frequente"
      );
      cy.get("input[placeholder='https://youtu.be/...']").type(
        "https://youtu.be/q08oqgoSTSo"
      );

      cy.intercept("POST", "http://localhost:5000/recommendations").as(
        "createRecommendation"
      );
      cy.get("button").click();

      cy.wait("@createRecommendation").then((res) => {
        expect(res.response.statusCode).to.equals(201);
      });
    });

    it("should not create a duplicated song recommendation", () => {
      const song = {
        name: "Diego Pinho - Caractere mais frequente",
        youtubeLink: "https://youtu.be/q08oqgoSTSo",
      };

      cy.addSong(song);

      cy.visit("http://localhost:3000");

      cy.get("input[placeholder='Name']").type(song.name);
      cy.get("input[placeholder='https://youtu.be/...']").type(
        song.youtubeLink
      );

      cy.intercept("POST", "http://localhost:5000/recommendations").as(
        "createRecommendation"
      );
      cy.get("button").click();

      cy.wait("@createRecommendation").then((res) => {
        expect(res.response.statusCode).to.equals(409);
      });
    });
  });
});
