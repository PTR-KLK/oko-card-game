import { changeValue } from "./App";

const objectsToConvert = [
  { value: "JACK" },
  { value: "QUEEN" },
  { value: "KING" },
  { value: "ACE" },
  { value: 10 },
];
const convertedObjects = [
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 11 },
  { value: 10 },
];

describe("Value conversion function", () => {
  test("it should convert text value of jack to number value", () => {
    expect(changeValue(objectsToConvert[0]).value).toEqual(
      convertedObjects[0].value
    );
  });
  test("it should convert text value of queen to number value", () => {
    expect(changeValue(objectsToConvert[1]).value).toEqual(
      convertedObjects[1].value
    );
  });
  test("it should convert text value of king to number value", () => {
    expect(changeValue(objectsToConvert[2]).value).toEqual(
      convertedObjects[2].value
    );
  });
  test("it should convert text value of queen to number value", () => {
    expect(changeValue(objectsToConvert[3]).value).toEqual(
      convertedObjects[3].value
    );
  });
  test("it should retain number value", () => {
    expect(changeValue(objectsToConvert[4]).value).toEqual(
      convertedObjects[4].value
    );
  });
});

const updatePlayer = (player, draw, points) => {
  return {
    ...player,
    cards: [...player.cards, ...draw],
    points: player.points + parseInt(points),
    draws: player.draws + 1,
  };
};

const mockPlayer = { cards: [], points: 0, draws: 0 };
const mockDraw = [
  { code: "6C", value: "6" },
  { code: "0C", value: "10" },
];

describe("Update player function", () => {
  test("it should return object", () => {
    expect(typeof updatePlayer(mockPlayer, mockDraw, 6)).toEqual("object");
  });
  test("updated player points should be number", () => {
    expect(typeof updatePlayer(mockPlayer, mockDraw, 6).points).toEqual(
      "number"
    );
  });
  test("it should update player points", () => {
    expect(updatePlayer(mockPlayer, mockDraw, 6).points).toEqual(6);
  });
  test("updated player draws should be number", () => {
    expect(typeof updatePlayer(mockPlayer, mockDraw, 6).draws).toEqual(
      "number"
    );
  });
  test("it should update player draws by 1", () => {
    expect(updatePlayer(mockPlayer, mockDraw, 6).draws).toEqual(1);
  });
  test("updated player cards should be array", () => {
    expect(Array.isArray(updatePlayer(mockPlayer, mockDraw, 6).cards)).toEqual(
      true
    );
  });
  test("it should update player cards", () => {
    expect(updatePlayer(mockPlayer, mockDraw, 6).cards.length).toEqual(2);
  });
});
