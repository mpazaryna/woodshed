// Another common task that often calls for the use of regular expressions is searching and replacing text. There are two basic ideas here:
// A group is a set of patterns enclosed in braces (). Each group collects the text that was matched by the patterns inside it. The text matched by each group can be addressed later with indexes prefixed with dollar signs (starting from $1 for the first group).
// Each group is available in the pattern itself as a back reference – backward slash followed by the group index, starting from \1 (see the example below). This is only rarely used, so you can blissfully forget about this feature.

// Using backreferences
// Find the words which consist only of the same letters

var text = 'Abc ddefg, hijk lllll mnopqr ssss. Tuv wxyyy z.';
var sameLetterRegex = /\b(\w)\1*\b/g;

console.log( text.match(sameLetterRegex) );

// Let's turn "John Smith" into "Smith, John"
// Each group (\w+) matches a single word. Each group is assigned 
// an index, starting from $1

var name = 'John Smith';
var nameRegex = /(\w+) (\w+)/;

console.log( name.replace(nameRegex, '$2, $1') );

// For more advanced manipulations, we need to provide a JS callback. 
// For example, lets make the surname uppercase

var upcasename = name.replace(nameRegex, function(string, group1, group2){
	return group2.toUpperCase() + ', ' + group1;
});

console.log( upcasename );