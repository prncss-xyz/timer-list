import { insert, remove, replace } from "./arrays";

describe("arrays", () => {
  describe("replace", () => {
    it("should replace an element", () => {
      expect(replace([0, 1, 2], 0, 3)).toEqual([3, 1, 2]);
      expect(replace([0, 1, 2], 1, 3)).toEqual([0, 3, 2]);
      expect(replace([0, 1, 2], 2, 3)).toEqual([0, 1, 3]);
    });
  });
  describe("insert", () => {
    it("should insert an element", () => {
      expect(insert([0, 1, 2], 0, 3)).toEqual([3, 0, 1, 2]);
      expect(insert([0, 1, 2], 1, 3)).toEqual([0, 3, 1, 2]);
      expect(insert([0, 1, 2], 2, 3)).toEqual([0, 1, 3, 2]);
    });
  });
  describe("remove", () => {
    it("should remove an element", () => {
      expect(remove([0, 1, 2], 0)).toEqual([1, 2]);
      expect(remove([0, 1, 2], 1)).toEqual([0, 2]);
      expect(remove([0, 1, 2], 2)).toEqual([0, 1]);
    });
  });
});
