/**
 * This is an implmentation of the article found at
 * https://www.freecodecamp.org/news/javascript-tolowercase-how-to-convert-a-string-to-lowercase-and-uppercase-in-js/
 */
export class CaseChange {
  /**
   * Strings in JavaScript are immutable. The toLowerCase() method converts the string specified into
   * a new one that consists of only lowercase letters and returns that value.
   *
   * It means that the old, original string is not changed or affected in any way.
   *
   * @param str
   * @returns {str}
   */
  convertLower(str: string): string {
    const a = str.toLowerCase();
    return a;
  }
  /**
   * The toUpperCase() method is similar to the toLowerCase() method but
   * it instead converts the string value to uppercase.
   *
   * @param str
   * @returns {str}
   */
  convertUpper(str: string): string {
    const a = str.toUpperCase();
    return a;
  }
  /**
   * You first locate and extract the first letter of that string by using its index.
   * Then you call the toUpperCase() method on that specific letter. As a reminder,
   * indexing in JavaScript (and most programming languages) starts at 0,
   * so the first letter has an index of 0.
   *
   * Save this operation in a new variable called capFirstLetter.
   *
   * Next, you want to isolate and cut off that first character and keep the remainder of the string.
   * One way to do this is by using the slice() method. This creates a new string starting from the
   * index specified until the end of the word.You want to start from the second letter until the end
   * of the value. In this case, the argument you should pass to slice() is an index of 1
   * since that is the index of the second letter.
   *
   * This way, the first character is excluded altogether. A new string is returned without it but
   * containing the rest of the characters – minus that first letter. Then save that operation to a new variable.
   *
   * @param str
   * @returns {str}
   */
  convertFirst(str: string): string {
    const capFirstLetter = str[0].toUpperCase();
    const restOfString = str.slice(1);
    const newGreeting = capFirstLetter + restOfString;
    return newGreeting;
  }
}
