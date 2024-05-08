// Every programming language has a way of defining and using regular expressions. They have some differences, but the basics 
// which are covered in this article should work anywhere. 
// 
// The most basic regexes are those that match a single character. Here are the rules:
// 
// The dot (.) matches any character. If you want to match the dot as a character, escape it like this: \.
// A question mark (?) means that the preceding character is optional. If you want to match an actual question mark, escape it: \?

var text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit lest. Donec convallis dignissim ligula, et rutrum est elat vistibulum eu.';

// Will match both "elit" and "elat". The dot can match any character.
var regex = /el.t/g;

console.log( text.match(regex) );

// Will match both "est" and "lest". The question mark makes "l" optional.
var regex2 = /l?est/g;

console.log( text.match(regex2) );