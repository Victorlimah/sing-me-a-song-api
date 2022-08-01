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

  describe("Vote for a song recommendation", () => {
    it("should upvote for a song recommendation", () => {
      const song = {
        name: "Diego Pinho - Caractere mais frequente",
        youtubeLink: "https://youtu.be/q08oqgoSTSo",
      };

      cy.addSong(song);

      cy.intercept("GET", "/recommendations").as("getRecommendations");
      cy.visit("http://localhost:3000");
      cy.wait("@getRecommendations");

      cy.intercept("POST", `/recommendations/1/upvote`).as("buttonClick");
      cy.get("article>div:nth-child(3)").then((div) => {
        const voteCountBefore = Number(div.text());
        cy.log("Votes before: " + voteCountBefore);
        cy.get(".vote-up-arrow").click();

        cy.wait("@buttonClick").then(({ response }) => {
          expect(response.statusCode).to.equal(200);

          cy.intercept("GET", "/recommendations").as("getRecommendations");
          cy.visit("http://localhost:3000");
          cy.wait("@getRecommendations");

          cy.get("article>div:nth-child(3)").then((div) => {
            const voteCountAfter = Number(div.text());
            cy.log("Votes after: " + voteCountAfter);
            expect(voteCountAfter).to.equal(voteCountBefore + 1);
          });
        });
      });
    });

    it("should downvote for a song recommendation", () => {
      const song = {
        name: "Diego Pinho - Caractere mais frequente",
        youtubeLink: "https://youtu.be/q08oqgoSTSo",
      };

      cy.addSong(song);

      cy.intercept("GET", "/recommendations").as("getRecommendations");
      cy.visit("http://localhost:3000");
      cy.wait("@getRecommendations");

      cy.intercept("POST", `/recommendations/1/downvote`).as("buttonClick");
      cy.get("article>div:nth-child(3)").then((div) => {
        const voteCountBefore = Number(div.text());
        cy.get(".vote-down-arrow").click();

        cy.wait("@buttonClick").then(({ response }) => {
          expect(response.statusCode).to.equal(200);

          cy.intercept("GET", "/recommendations").as("getRecommendations");
          cy.visit("http://localhost:3000");
          cy.wait("@getRecommendations");

          cy.get("article>div:nth-child(3)").then((div) => {
            const voteCountAfter = Number(div.text());
            expect(voteCountAfter).to.equal(voteCountBefore - 1);
          });
        });
      });
    });

    it("should remove a song recommendation with -5 votes", () => {
      const score = -5;

      cy.addLowScoreSong(score);

      cy.visit("http://localhost:3000");
      cy.intercept("POST", `/recommendations/1/downvote`).as("buttonClick");

      cy.get("article>div:nth-child(3)").then((div) => {
        cy.get(".vote-down-arrow").click();

        cy.wait("@buttonClick").then(({ response }) => {
          expect(response.statusCode).to.equal(200);

          cy.intercept("GET", "/recommendations").as("getRecommendations");
          cy.visit("http://localhost:3000");
          cy.wait("@getRecommendations");

          cy.wait(1000).then(() => {
            cy.get("article>div:nth-child(3)").should("not.exist");
          });
        });
      });
    });
  });

  describe("Random screen test suit", () => {
    it("should load ten tests", () => {
      const amount = 50;
      const highScorePercentage = 70;
      cy.seedDatabase(amount, highScorePercentage);

      cy.intercept("GET", "/recommendations/random").as(
        "getRandomRecommendation"
      );
      cy.visit("http://localhost:3000/random");
      cy.wait("@getRandomRecommendation").then(({ response }) => {
        cy.log(response);
        expect(response.body).to.haveOwnProperty("name");
        expect(response.body).to.haveOwnProperty("youtubeLink");
        expect(response.body).to.haveOwnProperty("score");
      });
    });
  });

  describe("Top screen test suit", () => {
    it("should load ten random song recommendations", () => {
      const amount = 50;
      const highScorePercentage = 70;
      cy.seedDatabase(amount, highScorePercentage);

      cy.intercept("GET", "/recommendations/top/10").as(
        "getTopRecommendations"
      );
      cy.visit("http://localhost:3000/top");
      cy.wait("@getTopRecommendations").then(({ response }) => {
        cy.log(response);
        expect(response.body.length).to.equal(10);
        expect(response.body[0]).to.haveOwnProperty("name");
        expect(response.body[0]).to.haveOwnProperty("youtubeLink");
        expect(response.body[0]).to.haveOwnProperty("score");
        expect(response.body[0].score).to.gte(response.body[9].score);
      });
    });
  });
});
