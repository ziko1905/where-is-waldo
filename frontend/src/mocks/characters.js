import { v4 as uuid } from "uuid";

class Character {
  constructor(name) {
    this.name = name;
    this.id = uuid();
  }
}

class CharacterList {
  constructor(charArr) {
    this.charList = charArr;
  }
  getCharsNames() {
    return this.charList.map((char) => char.name);
  }
  getChars() {
    // Avoids json parsing error
    return JSON.parse(JSON.stringify(this.charList));
  }
}

export const mockLeftChars = new CharacterList([
  new Character("Waldo"),
  new Character("Wizard"),
  new Character("Odlaw"),
  new Character("Woof"),
]);
