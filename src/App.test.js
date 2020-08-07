import { changeValue } from "./App";

const objectsToConvert = [
  { value: "JACK" },
  { value: "QUEEN" },
  { value: "KING" },
  { value: "ACE" },
  { value: 10 }
];
const convertedObjects = [
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 11 },
  { value: 10 }
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
