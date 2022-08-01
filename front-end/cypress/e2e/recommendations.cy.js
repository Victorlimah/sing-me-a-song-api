/* eslint-disable no-undef */
/// <reference types="cypress" />

beforeEach(() => {
  cy.clearDatabase();
});

describe("Recommendations test suite", () => {
  // describe("Create a song recommendation", () => {
  //   it("should add a song recommendation", () => {
  //     cy.visit("http://localhost:3000/");

  //     cy.get("input[placeholder='Name']").type(
  //       "Diego Pinho - Caractere mais frequente"
  //     );
  //     cy.get("input[placeholder='https://youtu.be/...']").type(
  //       "https://youtu.be/q08oqgoSTSo"
  //     );

  //     cy.intercept("POST", "http://localhost:5000/recommendations").as(
  //       "createRecommendation"
  //     );
  //     cy.get("button").click();

  //     cy.wait("@createRecommendation").then((res) => {
  //       expect(res.response.statusCode).to.equals(201);
  //     });
  //   });

  //   it("should not create a duplicated song recommendation", () => {
  //     const song = {
  //       name: "Diego Pinho - Caractere mais frequente",
  //       youtubeLink: "https://youtu.be/q08oqgoSTSo",
  //     };

  //     cy.addSong(song);

  //     cy.visit("http://localhost:3000");

  //     cy.get("input[placeholder='Name']").type(song.name);
  //     cy.get("input[placeholder='https://youtu.be/...']").type(
  //       song.youtubeLink
  //     );

  //     cy.intercept("POST", "http://localhost:5000/recommendations").as(
  //       "createRecommendation"
  //     );
  //     cy.get("button").click();

  //     cy.wait("@createRecommendation").then((res) => {
  //       expect(res.response.statusCode).to.equals(409);
  //     });
  //   });
  // });

  describe("Vote for a song recommendation", () => {
    it("should upvote for a song recommendation", () => {
      const song = {
        name: "Diego Pinho - Caractere mais frequente",
        youtubeLink: "https://youtu.be/q08oqgoSTSo",
      }

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
  });
});
