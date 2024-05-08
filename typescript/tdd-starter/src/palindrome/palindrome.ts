export class PalindromeChecker {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private getReversedString(str: string) {
    return str
      .split('')
      .reverse()
      .join('');
  }

  private stripSpaces(str: string): string {
    return str.split(' ').join('');
  }

  isAPalindrome(str: string): boolean {
    const reversed = this.getReversedString(str);
    return (
      this.stripSpaces(str).toLowerCase() ===
      this.stripSpaces(reversed).toLowerCase()
    );
  }
}
