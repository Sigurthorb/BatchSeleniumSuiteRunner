var args = require("./lib/argParser")();
var values = require("./lib/getValues")(args);

require("./lib/execute.js")(values, function(results){
	require("./lib/htmlGenerator.js").saveResultsSummary(results);
});



