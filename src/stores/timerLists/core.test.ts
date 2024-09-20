import { duplicate, remove } from "./core";

const timerList = {
  active: "b",
  items: [
    { seconds: 1, id: "a" },
    { seconds: 2, id: "b" },
    { seconds: 3, id: "c" },
  ],
};

describe("core", () => {
  describe("duplicateId", () => {
    it("does nothing when element do not exist", () => {
      expect(duplicate({ source: "zzz", target: "x" }, timerList)).toEqual(
        timerList,
      );
    });
    it("duplicates active element", () => {
      expect(duplicate({ source: "b", target: "x" }, timerList)).toEqual({
        active: "x",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 2, id: "b" },
          { seconds: 2, id: "x" },
          { seconds: 3, id: "c" },
        ],
      });
    });
    it("duplicates non-active element", () => {
      expect(duplicate({ source: "a", target: "x" }, timerList)).toEqual({
        active: "b",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 1, id: "x" },
          { seconds: 2, id: "b" },
          { seconds: 3, id: "c" },
        ],
      });
    });
  });
  describe("removeId", () => {
    it("when removing active element which is not last element of the list, moves active element next", () => {
      expect(remove({ source: "b", target: "x" }, timerList)).toEqual({
        active: "c",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 3, id: "c" },
        ],
      });
    });
    it("when removing active element which is last element of the list, moves active element next", () => {
      expect(
        remove(
          { source: "c", target: "x" },
          {
            active: "c",
            items: [
              { seconds: 1, id: "a" },
              { seconds: 2, id: "b" },
              { seconds: 3, id: "c" },
            ],
          },
        ),
      ).toEqual({
        active: "b",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 2, id: "b" },
        ],
      });
    });
    test("when removing non-active element, keeps active element", () => {
      expect(remove({ source: "c", target: "x" }, timerList)).toEqual({
        active: "b",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 2, id: "b" },
        ],
      });
    });
  });
});
