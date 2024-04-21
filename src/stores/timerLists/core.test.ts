import { duplicateId, removeId } from "./core";

const timerList = {
  active: "b",
  items: [
    { seconds: 1, id: "a" },
    { seconds: 2, id: "b" },
    { seconds: 3, id: "c" },
  ],
};
jest.mock("@/utils/uuid", () => ({
  getUUID: () => "x",
}));

describe("core", () => {
  describe("duplicateId", () => {
    it("does nothing when element do not exist", () => {
      expect(duplicateId("zzz")(timerList)).toEqual(timerList);
    });
    it("duplicates active element", () => {
      expect(duplicateId("b")(timerList)).toEqual({
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
      expect(duplicateId("a")(timerList)).toEqual({
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
      expect(removeId("b")(timerList)).toEqual({
        active: "c",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 3, id: "c" },
        ],
      });
    });
    it("when removing active element which is last element of the list, moves active element next", () => {
      expect(
        removeId("c")({
          active: "c",
          items: [
            { seconds: 1, id: "a" },
            { seconds: 2, id: "b" },
            { seconds: 3, id: "c" },
          ],
        }),
      ).toEqual({
        active: "b",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 2, id: "b" },
        ],
      });
    });
    test("when removing non-active element, keeps active element", () => {
      expect(removeId("c")(timerList)).toEqual({
        active: "b",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 2, id: "b" },
        ],
      });
    });
  });
});
