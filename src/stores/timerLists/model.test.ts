import { getNullItem, normalize } from "./model";

describe("timerLists", () => {
  describe("model", () => {
    describe("normalize", () => {
      it("should make sure items is not empty", () => {
        const normalized = normalize({ index: 0, items: [] });
        expect(normalized.items).toHaveLength(1);
        expect(normalized.index).toBe(0);
      });
      it("should make sure index is at leat 0", () => {
        expect(normalize({ index: -1, items: [getNullItem()] }).index).toBe(0);
      });
      it("should make sure index do not point past last element", () => {
        expect(
          normalize({ index: 2, items: [getNullItem(), getNullItem()] }).index,
        ).toBe(1);
      });
    });
  });
});
