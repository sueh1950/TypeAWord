var settings = {};
 
 
function setDefaults(){

 var d = new Date();
setData("qwerty",true);
setData("firstTime",d.getTime());
setData("settingsChanged", false); 
setData("audioCue", true);
setData("bodyColor","white");
setData("bigKeys",false);
setData("standard",true);
setData("CC",false);

setData("beep",true);
setData("caps","caps/");
setData("dataCollection","No Data");
setData("hide",false);
setData("promptColor","fuchsia");
setData("prompt",true);
setData("jump",false);
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


}

function getSettings(){
	var x;
	
 
	setDefaults();
 console.log("lines", lines);
 
	if (getBoolean("qwerty")==true){ 	
		doQwerty();
	}else{
		doAlpha();
	}

	setUpColorArrays();
 
	//if (getBoolean("standard")==true){ 	doStandardKB();}
	if (getBoolean("bigKeys")==true){ 	doBigKeysKB();
	}else {	if (getBoolean("CC")==true){ 	doChesterCreekKB();
		}	else { 	doStandardKB();}
	}
 
	return true;
}

 
function setData(cname, cvalue ) {
	//console.log("name:"+cname + " val:" + cvalue);
	//localStorage.setItem(cname, cvalue);
	settings[cname ]=cvalue;
}

 
 
 
function getData(cname) {
	var x = "";
	x=settings[cname];
	//console.log(settings);
//console.log (cname+"="+ x);	
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

	if ((x == "true") || (x == true)){bool = true;}
	
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
	var s = "<P><b>"+cChar +"</b>: You took "+ seconds.toFixed(0)+ " seconds, "+errorCount +" errors</P> " ;  
	var dataCollection = getData("dataCollection");
	dataCollection += s;
	setData("dataCollection", dataCollection);
	setDataCollection(dataCollection);
}
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'] 
function setSessionTimestamp(){
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth();
	var year = d.getFullYear();
	var hours = d.getHours();
	var mins = d.getMinutes();
	var dataCollection = getData("dataCollection");
	dataCollection +=  "<P>Session started at " + hours + ":" + mins +" on "+ months[month] +" " + day + " " + year +  ": <\P>";
   setData("dataCollection", dataCollection);	
   	//storeSettings(); //##
//#setDataCollection(dataCollection);
	}



function returnToMain (){
		window.location.assign("../index.html")
}
function setColorLines(lineNumber, color){
	var b;
	document.getElementById("cline").checked = true;
	document.getElementById("colorLeftRight").checked = false;
	document.getElementById("key" + lineNumber).className=color;	
//if (color== "black"){
	//document.getElementById("key"+
//console.log ("black");	
//}
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
function setColorPrompt(color){
	console.log("Color "+color);
	if (color == "none") {
		setBoolean("prompt", false);
		document.getElementById("promptKey").className="";
		document.getElementById("promptKey").innerHTML = "No Prompt";
	} else 	{
		document.getElementById("promptKey").className=color;
		document.getElementById("promptKey").innerHTML = "Prompt Color";
		setBoolean("prompt", true);
	}
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

 
