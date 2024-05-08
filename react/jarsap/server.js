var express = require('express');
var app = express();

// Constants
const PORT = 3000;

app.use(express.static(__dirname + '/public'));
// app.listen(process.env.PORT || 3000);

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
