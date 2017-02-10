var createHTML = require('create-html');
var fs = require("fs-extra");
var path = require("path");
var openFile = require("open");

var createRow = function(obj){
	return `<tr style="background-color: ${(obj.pass ? "#c2fca9" : "#ffa5a5")};"><td>${obj.runNum}</td><td><a href='${obj.name}'>${obj.name}</a></td><td>${(obj.pass ? "Pass" : "Fail")}</td><td>${obj.runTime}</td></tr>`;
}

var createAllRows = function(runs){
	var rows = "";
	for(var i = 0; i < runs.length; i++){
		rows += createRow(runs[i]);
	}

	return rows;
}


module.exports = function(results){
	console.log(results);
	var htmlRows = createAllRows(results.runs);

	var summaryPath = path.join(results.resultPath, "ResultSummary.html");
	fs.writeFileSync(summaryPath, createHTML({
		head: "<style>table, th, td {border: 1px solid black;}</style>",
		title: "Selenium Test Result Summary",
		body: `<table ><thead><tr><td>Run #</td><td>Test Summary Link</td><td>Pass/Fail</td><td>Runtime</td></thead><tbody>${htmlRows}</tbody></table><a href='Execution.log'>View Run Log</a>`
	}));

	openFile(summaryPath);

}