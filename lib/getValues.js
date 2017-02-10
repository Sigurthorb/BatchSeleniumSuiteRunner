var path = require("path");
var fs = require("fs");
var userCfg;

var userCfgPath = path.join(process.cwd(), "userConfig.json");
//for nexe
if(false){
	userCfgPath = "willNeverHappen";
}

try{
	userCfg = require(userCfgPath);
}
catch(e){
	fs.writeFileSync(userCfgPath, "{}");
	userCfg = {};
}


var getArg = function(key, arg){
	if(arg && key === "suiteDirectory"){
		arg = arg.split(",");
	}

	if(arg){
		userCfg[key] = arg;
	} else if(userCfg[key]){
		arg = userCfg[key];
	} else {
		console.log(key + " missing from arguments and config, please add to continue");
		process.exit(1);
	}



	return arg;
}

module.exports = function(args){
	var keys = Object.keys(args);
	for(var i = 0; i < keys.length; i++){
		args[keys[i]] = getArg(keys[i], args[keys[i]]);
	}

	fs.writeFileSync(userCfgPath, JSON.stringify(userCfg, null, 4));

	return args;
};

