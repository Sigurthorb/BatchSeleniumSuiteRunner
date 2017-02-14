var fs = require("fs-extra");
var path = require("path");
require("sugar/date").extend({namespace: [Date]});

module.exports = {
	loader: function(){	
		var con = true;
		var load = function(){
			if(con){
				process.stdout.write(".");
				setTimeout(load,1000);
			}
		};

		var stop = function(){
			con = false;
			process.stdout.write("\n");
		};

		load();

		return stop;
	},

	getTimeDiff: function(earlier){
		var ms = new Date().getTime() - earlier.getTime();

		var seconds = Math.floor((ms / 1000) % 60);
		var minutes = Math.floor((ms / 1000 / 60) % 60);
		var hours = Math.floor((ms / 1000 / 60 / 60 ) % 24);
		var days = Math.floor((ms / 1000 / 60 / 60 / 24));

		var str = "";

		if(days !== 0){
			str += days + " day";
			if(days !== 1){
				str +="s";
			}
			str += ", ";
		}

		if(hours !== 0){
			str += hours + " hour";
			if(hours !== 1){
				str +="s";
			}
			str += ", ";
		}

		if(minutes !== 0){
			str += minutes + " minute";
			if(minutes !== 1){
				str +="s";
			}
			str += ", ";
		}

		if(str !== ""){
			str += "and ";
		}

		str += seconds + " second";
		if(seconds !== 1){
			str +="s";
		}

		str += "";

		return str;
	},
	
	htmlFilesInDir: function(suitePath){

		if(!(suitePath instanceof Array)){
			suitePath =  [suitePath];
		}

		var items = [];

		for(var i = 0; i < suitePath.length; i++){
			items.push(fs.readdirSync(suitePath[i]));
		}

		var files = [];
		for(var i = 0; i < items.length; i++){
			for(var j = 0; j < items[i].length; j++){
				if(path.extname(items[i][j]) === ".html" && fs.statSync(path.join(suitePath[i], items[i][j])).isFile()){
					files.push(path.join(suitePath[i], items[i][j]));
				}
			}
		}
		return files;
	},
	creatOutputFolder: function(resultPath){
		var dateStamp = new Date().format('%y-%m-%d@%H-%M-%S');
		resultPath = path.join(resultPath, dateStamp);
		fs.mkdirsSync(resultPath);

		return resultPath;
	}
};

