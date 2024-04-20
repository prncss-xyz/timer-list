import { normalize } from "./model";

describe("timerLists", () => {
  describe("model", () => {
    describe("normalize", () => {
      it("should make sure items is not empty", () => {
        const normalized = normalize({ active: "", items: [] });
        expect(normalized.items).toHaveLength(1);
        expect(
          normalized.items.findIndex((item) => item.id === normalized.active),
        ).toBe(0);
      });
    });
  });
});
