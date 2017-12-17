var dataCollectionFile;
var storage;
var fileObj;
var settingsObj;
var fullVersion = true;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'] 

var settings = {  //new object
 audioCue: true,
 beep:true,
 bigKeys:false,
 bodyColor:"white",
 caps:"caps/",
 CC:false,
 dataCollection:"No Data",
 firstTime:true,  //.getTime(),
 hide:false,
 jump:false,
 kybType:"standard",
 lang:"en",
 left_right:false,
 leftColor:"green",
 lIndex:"1",
 lineColor0:"white",
 lineColor1:"white",
 lineColor2:"white",
 lineColor3:"white",
 qwerty:true,
 rightColor:"red",
 sayKBLetter:false,
 sayLetter:false,
 settingsChanged: false, 
 showTime:true,
 Spanish:false,
 standard:true,
 timer:"2",
 word:"cat",
 zee:true,
}
function fail(e) {
    console.log("settings.js FileSystem Error");
    console.log(e);
}

function getFiles( ) {
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
		dir.getFile( "dataCollection.txt", {create:true}, function(file) {
			fileObj=file;	});
			dir.getFile("settings.txt", {create:true}, function(file) {
			readFile(file);	
	     	settingsObj=file;	});
	});
}
function readFile(fileEntry ) {
	if (!fileEntry) return;
	var key,value, para, i; 
	fileEntry.file(function(file) {
		var reader = new FileReader();
		reader.onloadend = function(e) {
			var keyPairs = this.result.split(",");
			for (i = 0; i < keyPairs.length; i++) {
				para = keyPairs[i].split(":");
				setData(para[0], para[1]); 
				}
				useSettings();
		};
		reader.readAsText(file);
	}, fail);
}
function successWrite(evt) {
				var b = document.body.id;
				if (b != "IcanSpell") {
					window.alert("Settings saved...");
					window.open("index.html", "_parent");
				}
}
function writeFile( fileObj, str) {
	if (!fullVersion) {return;}
	
	var b = document.body.id;

	try{
		fileObj.createWriter(function(fileWriter) {
			fileWriter.onwriteend = successWrite;
			//var blob = new Blob([str], {type:'text/plain'});
			fileWriter.write(str);
			}, fail);
	} catch (err) {
			window.alert("Write failed: " + err);
		}
}
function writeDataFile( str) {
	if (!fullVersion) {return;}
	
	try{
		fileObj.createWriter(function(fileWriter) {
			fileWriter.onwriteend = function(evt) {
				};
			fileWriter.onwrite = function(evt) {
				};	
			fileWriter.seek(fileWriter.length);		
			//var blob = new Blob([str], {type:'text/plain'});
			fileWriter.write(str);
		}, fail);
		} catch (err) {
			window.alert("Write failed");
		}
}
function setLetterTimestamp(cChar, startTime, endTime, errorCount){
	var seconds = (endTime-startTime)/1000;	
	var s, secs;
	s= "<P><b>"+cChar +"</b>: ";
	if (getData("lang")=="en"){
			s+= " You took "
			secs = " seconds";
	} 	else {
			s+= "Tard&oacute; "
			secs = " segundos";		
	}
	s +=  seconds.toFixed(0)+ secs + ", "+errorCount +" errors</P> " ;  
	updateDataCollection(s); // will append to file

	if (getBoolean("showTime") ){
		try {
			document.getElementById("showtime").innerHTML = s;
		} catch (err) {}
	}

}
function setSessionTimestamp(){
	var d = new Date();
	var day = d.getDate(); 
	var month = d.getMonth();
	var year = d.getFullYear();
	var hours = d.getHours();
	var mins = d.getMinutes();
	var secs = d.getSeconds();
	var ampm = " a.m.";
	var s;
	
	if (hours > 12) {
		hours -= 12;
		ampm = " p.m.";
	}
	if (mins <10) {
		mins = "0" + mins;
	}
	
	if (getData("lang")=="en"){
		s =  "<P>Session started at " ;
	} else {
		s =  "<P>La sesi&oacute;n comenz&oacute;: " ;
	}
	s +=  hours + ":" + mins + ampm +", "+ months[month] +" " + day + " " + year +  ": <\P>";
   
	updateDataCollection(s);
}

function updateDataCollection(newValue){
	writeDataFile( newValue );
}


function useSettings( ){
	var x;
	var langIdx = EN;	
	var first =  getBoolean("firstTime");
 
	var d = new Date();
	 if (first) {
		setData("firstTime",d.getTime());
	}
	var elapsed = d.getTime() - getData("firstTime");
	var days =  elapsed/(1000*60*60*24);
 
	//do this first to setup line letters
	if (getBoolean("qwerty")==true){ 	
		doQwerty();
	}else{
		doAlpha();
	}

	setUpColorArrays();
		
	if (getData("kybType") == "bigKeys")
		{ doBigKeysKB();
		}else {	if (getData("kybType") =="CC"){ 	doChesterCreekKB();
			}	else { 	doStandardKB();}
		}

	langIdx=EN;
	if (getData("lang") =="es") {
		langIdx=ES;	
	} 
	setLang(langIdx);
 	setButtons();
	s = ".bodyColor { background-color:" + getData("bodyColor") + ";}"
	document.getElementById("bg").innerHTML=s;
	setTimeout(setFocus, 2*1000);
	setSessionTimestamp();  //**
	setStaticListeners();
	cLine = getData("word");
	refreshHome();
}

function setData(cname, cvalue ) { 
	settings[cname ]=cvalue;
}

function storeSettings (fileObj) {
	var line="";
	try{
		for (x in settings) {
			line+= x + ":" + settings[x] + ",";
		}
		writeFile(fileObj,line);
	}
	catch(err){	}
}

function restoreSettings(){
}
function getData(cname) {
	var x = "";
	x=settings[cname];
	if (x == null ) { x=""; }
	return x;
}
function getNumber(cname) {
	x= getData(cname);
	if (x == null ) {
		x="0";
	}
	return x;
}
function setLineColor(cLine, cColor){
var c;
for (c=0; c < cLine.length; c++)
	{
		setData(cLine[c]+"Color", cColor);
	}	
}

function getBoolean(cname) {
	var x = getData(cname);	
	var bool = false;
	try{
		if ((x == "true") || (x == true)){bool = true;}
		}catch (err) {//bool is false if doesn't exist
	}
	return bool;
}
function setBoolean(cname, cvalue) {
	var cvalueS=true;
	if (cvalue == "false"){
		cvalueS = false;
	} 
	setData(cname, cvalue);
}
function getTimestamp(){
		var d = new Date();
		return d.getTime();
}

function returnToMain (){
		window.location.assign("../index.html")
}
function setColorLines(lineNumber, color){
	var b;
	document.getElementById("cline").checked = true;
	document.getElementById("colorLeftRight").checked = false;
	document.getElementById("line" + lineNumber).className=color;	
}
function setLeftLines( color){
	document.getElementById("cline").checked = false;
	document.getElementById("colorLeftRight").checked = true;
	document.getElementById("keyLeft").className=color;			
}
function setRightLines( color){
	document.getElementById("cline").checked = false;
	document.getElementById("colorLeftRight").checked = true;
	document.getElementById("keyRight" ).className=color;			
}

function setBodyColor(color){

	document.getElementById("bodyColor").className=color;
}
function doGeneral(){
	setMenuActive('menu1');
	window.location.assign("#General")		
}
function doColorLines(){
	setMenuActive('menu2');
	window.location.assign("#colors")		
}
function doColorLR(){
	setMenuActive('menu3');
	window.location.assign("#colorLR")		
}
function doKeyPics(){
	setMenuActive('menu4');
	window.location.assign("#keyPics")		
}
function 	clearMenuItems() {
	document.getElementById('menu1').className="notActive";
	document.getElementById('menu2').className="notActive";
	document.getElementById('menu3').className="notActive";
	//document.getElementById('keyPics').className="notActive";
}
function setMenuActive(menuItem){
	clearMenuItems();
	document.getElementById(menuItem).className="active";
}
