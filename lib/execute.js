var util = require("./util.js");
var path = require("path");
var cp = require("child_process");
var log = require("./winston.js");
var color = require("colors");

module.exports = function(values, cb){
	var runtime;
	var suites = util.htmlFilesInDir(values.suiteDirectory);
	var resultPath = util.creatOutputFolder(values.resultDirectory);
	log = log(resultPath);
	log.info("Initiating testing sequence\n"); 

	var totalRunTime = new Date();

	var results = {
		runs: [],
		resultPath: resultPath, 

	};
	
	function runTests(items, iteration){
		if(items.length === 0) {
			finishRun();
			return;
		}

		var suite = items[0];
		var suiteName = path.basename(suite)
		var resultFile = path.join(resultPath, suiteName);

		log.info(`Running test suite ${suiteName}`);

		var cmd = `java -jar "${values.seleniumJar}" -htmlSuite "${values.browser}" ${values.url} "${suite}" "${resultFile}" -port ${values.port}`;
		log.info(`Command executing: ${cmd}`);

		var testRunTimer = new Date();
		
		var stop = util.loader();

		cp.exec(cmd, function(err, stdout, stderr){
			stop();

			var obj = {};
			obj.runNum = iteration;
			obj.name = suiteName;
			obj.runTime = util.getTimeDiff(testRunTimer);

			if(err){
				if(stderr.includes("Launching a standalone Selenium Server")){
					obj.pass = !stderr.includes("Tests failed, see result file for details:");
					log.warn(color.red(`Test failed while executing ${obj.name}`));
					log.debug(stderr);
				} else {
					obj.pass = false;
					log.error(color.red(`Error while executing ${obj.name}`));
					log.debug(stderr);
					log.error(`Error before launching standalone server error obj:`, err);
				}
			} else {
				obj.pass = true;
				log.info(`Test ${obj.name} ran successfully`);
				log.debug(stdout);
			}
			var output = `${obj.name} was ${(obj.pass ? "successfully": "")} executed in ${obj.runtime} ${(obj.pass ? "" : "But failed, see report for details")}`;
			var col = (obj.pass ? color.green : color.red);
			log.info(output);


			items.splice(0,1);
			results.runs.push(obj);

			runTests(items, iteration);
		});
	}

	function finishRun(){
		results.runTime = util.getTimeDiff(totalRunTime);
		log.info(`Total execution time was ${results.runTime}`);
		cb(results);
	}

	runTests(suites, 1);
}