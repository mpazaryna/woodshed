// Most of the time, you will want to match entire words, instead of single characters. This is done by using 
// modifiers which repeat a character or a character set. These are:
//
// +, which repeats the preceding character or set one or more times
// *, which repeats the preceding character or set zero or more times
// {x} for an exact number of repetitions, {x,y} for varying number of repetitions (where x and y are numbers)
// Also, there is the special \b pattern which matches the boundaries at the ends of words (not a real symbol).

var text = 'Hello people of 1974. I come from the future. In 2014 we have laser guns, hover boards and live on the moon!';

// Find the years. \d+ will match one or more chars

var yearRegex = /\d+/g;

console.log('Years: ', text.match( yearRegex ) );

// Find all sentences. Our sentences begin with a capital letter and end in either a dot or an exclamation mark.
// The question mark makes the regex non-greedy. Try removing it.

var sentenceRegex = /[A-Z].+?(\.|!)/g;

console.log('Sentences: ', text.match(sentenceRegex) );

// Find all words that begin with h. We want to match both lower and upper case, so we include the i modifier.
// Notice the \b for word boundary. Try removing it.

var hWords = /\bh\w+/ig;

console.log('H Words: ', text.match(hWords) );

// Find all words between four and six characters

var findWords = /\b\w{4,6}\b/g;

console.log( 'Words between 4 and 6 chars: ', text.match(findWords) );

// Find words longer than 5 chars

console.log( 'Words 5 chars or longer: ', text.match(/\b\w{5,}\b/g) );

// Find words exactly 6 chars long

console.log( 'Words exactly 6 chars long: ', text.match(/\b\w{6}\b/g) );