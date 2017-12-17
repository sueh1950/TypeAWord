var settings = {};
var storage;

try {storage = chrome.storage.local;
} catch (err){
}
var settings = {  //new object
 audioCue: true,
 beep:true,
 bigKeys:false,
 bodyColor:"white",
 caps:"caps/",
 CC:false,
 dataCollection:"No Data",
 firstTime:true,  //.getTime(),
 lang:"en",
 left_right:false,
 leftColor:"green",
 lIndex:"1",
 lineColor0:"white",
 lineColor1:"white",
 lineColor2:"white",
 lineColor3:"white",
 kybType:"standard",
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

function setDefaults(){
setData("qwerty",true);
setData("settingsChanged", false); 
setData("audioCue", true);
setData("bodyColor","white");
setData("bigKeys",false);
setData("standard",true);
setData("CC",false);
setData("showTime",true);
setData("lang", "en");
setData("beep",true);
setData("caps","");
setData("dataCollection","No Data");
setData("timer","2");
setData("left_right",false);
setData("leftColor","green");
setData("lIndex","1");
setData("rightColor","red");
setData("lineColor1","white");
setData("lineColor2","white");
setData("lineColor3","white");
setData("lineColor0","white");
setData("sayLetter",false);
setData("sayKBLetter",false);
setData("Spanish",false);
setData("word", "");
setData("zee", true);

 storeSettings();
}
 
function getSettings(){
	var langIdx = EN;
	var x,s;
	//Data has been read in by this time, overwriting the defaults, if any

	var first =  getData("firstTime");
	var d = new Date();
	if (first==true) {
		setData("firstTime",d.getTime());
		setDefaults();
		//storeSettings();
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

	//Spanish keyboard?
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

	//lIndex = getNumber("lIndex");
	//for (i=0; i < 4; i++)
	//{	//put line buttons in array for clearing
		//buttons[i] = document.getElementById("line" + i);
	//}
	//doLine(lIndex);
	setButtons();
	//var pc = getData("promptColor");
	// set prompt color if any 
	//if (pc != "none") {
		//var s = ".prompt { background-color:" + pc  + "; border: 5px solid black;}"
		//document.getElementById("prompt").innerHTML=s;
	//}
	s = ".bodyColor { background-color:" + getData("bodyColor") + ";}"
	document.getElementById("bg").innerHTML=s;
	
	setTimeout(setFocus, 4*1000);
	setSessionTimestamp();
	setStaticListeners();
	cLine = getData("word");
	refreshHome();
}

function setDataCollection(newValue){
	if (fullVersion) {
		chrome.storage.local.set({'dataCollection': newValue}, function() {
		   });
	}
	
}
function setData(cname, cvalue ) {
	settings[cname ]=cvalue;
//log("setdata " + cname + ":" + cvalue); 	
}

function storeSettings () {
	if (fullVersion) {
		try{
			storage.set(settings);
		}
		catch(err){
			log("storage error: " + err);
		//local storage
		}
	}
}
 
function restoreSettings(){
	try{
		storage.get( function(result){
			for (x in result) {
				settings[x] =  result[x];
			}
		startUp();
		});
	}
	catch(err){
		log(err);
	}
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
	} //####
	setData(cname, cvalue);
}
function getTimestamp(){
		var d = new Date();
		return d.getTime();
}
function setLetterTimestamp(cChar, startTime, endTime, errorCount){
	var seconds = (endTime-startTime)/1000;	
	var s, secs;
	s= "<P><b>"+cChar +"</b>: ";
		if (getData("lang")=="en"){
			s+= " You took "
			secs = " seconds";
		} else {
			s+= "Tard&oacute; "
			secs = " segundos";
		}
	s +=  seconds.toFixed(0)+ secs + ", "+errorCount +" errors</P> " ;  	

	var dataCollection = getData("dataCollection");
	dataCollection += s;
	setData("dataCollection", dataCollection);
	setDataCollection(dataCollection);
	if (getBoolean("showTime") ){
		try {
			document.getElementById("showtime").innerHTML = s;
		} catch (err) {}
	}
}
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'] 
function setSessionTimestamp(){
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth();
	var year = d.getFullYear();
	var hours = d.getHours();
	var mins = d.getMinutes();
	var ampm = " a.m.";
	var dataCollection = getData("dataCollection");
	
	if (hours > 12) {
		hours -= 12;
		ampm = " p.m.";
	}
	if (mins <10 ) { mins = "0" + mins};
	
	if (getData("lang")=="en"){
		dataCollection +=  "<P>Session started at " ;
	} else {
		dataCollection +=  "<P>La sesi&oacute;n comenz&oacute;: " ;
	}
   dataCollection +=  hours + ":" + mins + ampm + ", "+ months[month] +" " + day + " " + year +  ": <\P>";
   
   setData("dataCollection", dataCollection);	
   	//storeSettings(); //##
	setDataCollection(dataCollection);
	}


function returnToMain (){
	window.location.assign("../index.html");
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

chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {
          var storageChange = changes[key];
          /*console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);*/
		  if ( (key == "dataCollection") && (storageChange.newValue =="")){
			setData(key, "");
			setSessionTimestamp()
		  } 
		  if ((key == "settingsChanged")&& (storageChange.newValue== true)) {
			   chrome.storage.local.set({'settingsChanged': false}, function() {
          // Notify that we saved.
          //log('settingsChanged');
		   });
	
			  restoreSettings();
		  }
        }
      });

