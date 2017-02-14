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

		if(items.length === iteration) {
			finishRun();
			return;
		}

		var suite = items[iteration];
		var suiteName = path.basename(suite);
		var resultFile = path.join(resultPath, suiteName);

		log.info(`Running test suite ${suiteName}`);

		var cmd = `java -jar "${values.seleniumJar}"  ${values.timeout} -htmlSuite "${values.browser}" ${values.url} "${suite}" "${resultFile}" -port ${values.port}`;
		log.info(`Command executing: ${cmd}`);

		var testRunTimer = new Date();
		
		var stopLoader = util.loader();

		var proc = cp.exec(cmd, function(err, stdout, stderr){
			stopLoader();

			var obj = {};
			iteration++;
			obj.runNum = iteration;
			obj.name = suiteName;
			obj.runTime = util.getTimeDiff(testRunTimer);

			if(err){
				if(stderr.includes("Launching a standalone Selenium Server")){
					//Because of unfamiliarity with error output from selenium standalone server we make sure that the test failed by checking output
					obj.pass = !(stderr.includes("Tests failed, see result file for details:") || stderr.includes("HTML suite exception seen"));
					log.warn(color.red(`Test failed while executing ${obj.name}`));
					log.debug(stderr);
				} else {
					obj.pass = false;
					log.error(color.red(`Error while executing ${obj.name}, See log for details`));
					log.debug(stderr);
					log.error(`Error before launching standalone server error obj:`, err);
				}
			} else {
				obj.pass = true;
				log.info(`Test ${obj.name} ran successfully`);
				log.debug(stdout);
			}
			var output = `${obj.name} was ${(obj.pass ? "successfully": "")} executed in ${obj.runTime} ${(obj.pass ? "" : "but failed, see report for details")}`;
			var col = (obj.pass ? color.green : color.red);
			log.info(output);

			results.runs.push(obj);

			log.info("\n\n");

			runTests(items, iteration);
		});
	}

	function finishRun(){
		results.runTime = util.getTimeDiff(totalRunTime);
		log.info(`Total execution time was ${results.runTime}`);
		cb(results);
	}

	runTests(suites, 0);
}