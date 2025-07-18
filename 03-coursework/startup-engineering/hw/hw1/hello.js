#!/usr/bin/env node
// this is the first node program of the course
var fs = require('fs');
var outfile = "hello.txt";
var out = "A startup is a business built to grow rapidly.\n";
fs.writeFileSync(outfile, out);  
console.log("The output of the script: " + __filename + "\nWrote: " + out + "To: " + outfile);
