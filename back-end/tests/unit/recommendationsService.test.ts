import { jest } from "@jest/globals";

import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";

describe("recommendationService test suite", () => {

  describe("Create recommendation tests suites", () => {
    it("Sucess in create recommendation", async () => {
      const name = "Test";
      const youtubeLink = "https://www.youtube.com/watch";

      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValueOnce(null);

      jest
        .spyOn(recommendationRepository, "create")
        .mockResolvedValueOnce(null);

      await recommendationService.insert({name, youtubeLink});
      expect(recommendationRepository.findByName).toHaveBeenCalledWith(name);
      expect(recommendationRepository.create).toHaveBeenCalledTimes(1);
    });

    it("Fail in create recommendation", async () => {
      const id = 1;
      const name = "Test";
      const youtubeLink = "https://www.youtube.com/watch";
      const score = 10;

      const recommendation = { id, name, youtubeLink, score };

      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValueOnce(recommendation);

      expect(recommendationService.insert({name, youtubeLink})).rejects.toEqual(
        { message: "Recommendations names must be unique", type: "conflict" }
      );
    });

  });

});