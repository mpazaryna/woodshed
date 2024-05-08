// Building up from the match-single example, we can write regexes that match only certain character by using sets:

// A set is one or more characters enclosed in brackets [abc]. It matches only one of those characters – in this 
// example only a, b or c. You can negate a set with ^. [^abc] will match any character that is not a, b or c. 
// You can also specify a range [0-9], [a-z], which will match everything in the range.
// There are built-in sets that make writing regexes easier (they are called shorthand). 
// Instead of [0-9] you can write \d and for [^0-9] you can write \D. There are also sets for 
// word characters (a through z with digits and underscore) – \w and \W, and spaces (including tabs and new lines) - \s and \S.


// Match only "cat" and "can", but not "car".

var text = 'cat car can';

console.log( text.match(/ca[tn]/g) );

// Match everything BUT cat and can (notice the ^ symbol)

console.log( text.match(/ca[^tn]/g) );

// Here is another example, which matches only the number

text = 'I would like 8 cups of coffee, please.';

console.log('How many cups: ' + text.match( /[0-9]/g ));

// A better, shorter way to write it, using the \d character class

console.log('How many cups: ' + text.match( /\d/g ));

// Matching everything BUT the number (will return an array of chars)

console.log( text.match(/\D/g) );