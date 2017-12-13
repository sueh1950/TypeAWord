//window.onload=start();
document.addEventListener("deviceready", start, false);

var    fileObj;
function fail(e) {
 console.log("dataCollect FileSystem Error");
 console.log(e);
}

function start(){
	self.name = "DataCollect";
	window.document.getElementById("clear").addEventListener("click",clearData);
	window.document.getElementById("return").addEventListener("click",closeWindow);
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "dataCollection.txt", printData, fail);
}

function closeWindow() {
	window.open("index.html", "_parent");
}
function clearData(){
	setData("dataCollection", "");
	window.document.getElementById("data").innerHTML=""
	writeDataFile("", false);
}
function writeDataFile(str, append) {
	fileObj.createWriter(function(fileWriter) {if (append){
		fileWriter.seek(fileWriter.length);	}	
		//var blob = new Blob([str], {type:'text/plain'});
		fileWriter.write(str);
	}, fail);
}

function printData(fileEntry){

	fileObj=fileEntry;
	fileEntry.file(function(file) {
		var reader = new FileReader();
		reader.onloadend = function(e) {
			window.document.getElementById("data").innerHTML = this.result;
		}
		reader.readAsText(file);
	});

}

