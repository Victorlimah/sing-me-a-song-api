/* eslint-disable no-undef */
/// <reference types="cypress" />

describe("Recommendations test suite", () => {
  it("should add a song recommendation", () => {
    cy.visit("http://localhost:3000/");

    cy.get("input[placeholder='Name']").type("Diego Pinho - Caractere mais frequente");
    cy.get("input[placeholder='https://youtu.be/...']").type("https://youtu.be/q08oqgoSTSo");

    cy.intercept("POST", "http://localhost:5000/recommendations").as("createRecommendation");
    cy.get("button").click();

    cy.wait("@createRecommendation");
    
  });

});