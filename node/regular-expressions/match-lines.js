// In JavaScript, this is the type of patterns you would use to validate user input from text fields. 
// It is just a ordinary regex, but anchored to the start and end of the text using ^ (start of line),
// $ (end of line) expressions. This will make sure that the pattern that you write spans the entire 
// length of the text, and doesn’t only match a part of it.

// Also, in this case we use the test() method of the regex object, which returns either true or false if the regex matches the string.

// We have an array with strings. Let's extract only the URLs!

var strings = [
	'http://tutorialzine.com/posts/',
	'this is not a URL',
	'https://google.com/',
	'123461',
	'http://tutorialzine.com/?search=jquery',
	'http://not a valid url',
	'abc http://invalid.url/'
];

// Here is a simple regex that will do the job. Note the ^ and $ symbols for beggining and end of line. 
// Try removing them and see which URLs are detected.

var regex = /^https?:\/\/[\w\/?.&-=]+$/;

var urls = [];

for( var i = 0; i < strings.length; i++ ){
	if( regex.test(strings[i]) ){
	  // This is a valid URL
	  urls.push(strings[i]);
	}
}

console.log('Valid URLs: ', urls);