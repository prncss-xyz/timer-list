import { insert } from "./arrays";

describe("arrays", () => {
  describe("insert", () => {
    it("should insert an element", () => {
      expect(insert([0, 1, 2], 0, 3)).toEqual([3, 0, 1, 2]);
      expect(insert([0, 1, 2], 1, 3)).toEqual([0, 3, 1, 2]);
      expect(insert([0, 1, 2], 2, 3)).toEqual([0, 1, 3, 2]);
    });
  });
});
