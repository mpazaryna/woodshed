import { PalindromeChecker } from './palindrome';

describe('palindrome checker', () => {
  let palindromeChecker: PalindromeChecker;
  beforeEach(() => {
    palindromeChecker = new PalindromeChecker();
  });

  it('exists', () => {
    expect(palindromeChecker).toBeDefined();
  });

  it('should be able to tell that "mom" is a palindrome', () => {
    expect(palindromeChecker.isAPalindrome('mom')).toBeTruthy();
  });

  it('should be able to tell that "bill" isnt a palindrome', () => {
    expect(palindromeChecker.isAPalindrome('bill')).toBeFalsy();
  });

  it('should be able to tell that "MoM" is a palindrome', () => {
    expect(palindromeChecker.isAPalindrome('MoM')).toBeTruthy();
  });

  it('should be able to tell that "Was it a rat" is a palindrome', () => {
    expect(palindromeChecker.isAPalindrome('was it a rat i saw')).toBeTruthy();
  });

  it('should be able to tell that "Was it a rat" is a palindrome', () => {
    expect(palindromeChecker.isAPalindrome('was it a rat i saw')).toBeTruthy();
  });

  it('should be able to tell that "almostomla" isnt a palindrome', () => {
    expect(palindromeChecker.isAPalindrome('almostomla')).toBeFalsy();
  });
});
