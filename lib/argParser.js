var argumentParser = require("argparse").ArgumentParser;

var parser = new argumentParser({version: "0.0.1", addHelp: true, description: "Boilerplate"});

parser.addArgument(
	["-s", "--suiteDirectory"],
	{
		help: "Path to test suite directory, seperated by , if multiple paths"
	}
);
parser.addArgument(
	["-r", "--resultDirectory"],
	{
		help: "Path to result directory"
	}
);
parser.addArgument(
	["-j", "--seleniumJar"],
	{
		help: "Full Path to Selenium Jar"
	}
);

parser.addArgument(
	["-u", "--url"],
	{
		help: "Selenium suite base url"
	}
);

parser.addArgument(
	["-p", "--port"],
	{
		help: "Port for the selenium server"
	}
);

parser.addArgument(
	["-b", "--browser"],
	{
		help: "The respective browser (e.g. *firefox)"
	}
);

module.exports = function(){
	console.log("Arguments have priority over userConfig.json, userConfig.json updates when arguments are used.")
	return parser.parseArgs();
}