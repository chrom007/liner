// Example run: 
// node counter.js C:\Web\domains\mysite
// Warning! Only LATINS words in path!!!

const fs = require("fs");
const colors = require("colors");
const args = process.argv.slice(2);

if (args.length <= 0) {
	console.log("Enter PATH of Project folder in CMD".red);
	console.log("Example: 'node counter.js C:\\Web\\domains\\mysite'".yellow);
	process.exit();
}

var files_array = [];
var counts = [];
var access_types = ["php", "js", "html", "css", "vue"];
var denied_files = ["node_modules", "libs", ".git", ".vscode", ".idea", "dist", "build", "package-lock.json", "package.json"];


function readDir(foldername) {
	var files = fs.readdirSync(foldername);

	files.forEach(function(filename){
		if (denied_files.indexOf(filename) >= 0) return false;
		var filepath = foldername + "/" + filename;
		var filestat = fs.statSync(filepath);

		if (filestat && filestat.isDirectory()) {
			readDir(filepath);
		}
		else {
			var file = fs.readFileSync(filepath, "utf8");
			var lines = file.split("\n").length;
			var filetype_temp = filename.split(".");
			var filetype = filetype_temp[filetype_temp.length - 1];

			if (access_types.indexOf(filetype) > -1) {
				if (!counts[filetype]) {
					counts[filetype] = lines;
				}
				else {
					counts[filetype] += lines;
				}

				files_array.push({
					filename,
					lines,
					filetype
				});
				// console.log('File: ', nameFix(filename).yellow, `  \tLines: `, (lines.toString()).cyan, `\tType: `, (filetype.toUpperCase()).green);
			}
		}
	});
}

function nameFix(name) {
	if (name.length < 25) {
		while(name.length < 25) {
			name += " ";
		}
	}
	else {
		name = name.substr(0, 22) + "...";
	}

	return name;
}

// Start counting 
readDir(args[0]);

files_array = files_array.sort((a, b) => {
	return b.lines - a.lines;
});
files_array.forEach(({filename, lines, filetype}) => {
	console.log('File: ', nameFix(filename).yellow, `  \tLines: `, (lines.toString()).cyan, `\tType: `, (filetype.toUpperCase()).green);
});

console.log("=================================================================");
console.log("Counts of lines: ", counts);