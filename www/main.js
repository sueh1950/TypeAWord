var lines = [];
var buttons =[];
var	lineColor = [];

window.onload =  setTimeout(startUp, 1000);  	
 
var cChar = "a";
var cIndex;  //index to character in line
var cLine = "";
var lIndex=0;
var lang="en";
//var caps="";
//var jump=false;
var startTime=0;
const alphabet = "abcdefghijklmnopqrstuvwxyz";
function setButtonListeners(){

	document.getElementById("next").addEventListener("click", doNext);	
	document.getElementById("caps").addEventListener("click", doCaps);
	document.getElementById("jump").addEventListener("click", doJump);
	document.getElementById("hide").addEventListener("click", doHide);

	document.getElementById("box").addEventListener("click", setFocus);
    document.getElementById("buttons").addEventListener("click", setFocus);
    document.getElementById("arrow").addEventListener("click", setFocus);
	document.getElementById("buttons").addEventListener("click", setFocus);
    document.getElementById("lang").addEventListener("click", doLang);  
	document.getElementById("inBox").addEventListener("keyup", process);  
	
	window.onresize = resize;
}

function resize()
{
 console.log("resize event detected!");
 	var w = window.innerWidth;
	var h = window.innerHeight;
 console.log("w= "+w +" ,h=" + h);
	refreshScreen(lIndex);
}

function startUp () {
 
	if (getSettings())  
	{
		lIndex = getNumber("lIndex");
		for (i=0; i < 4; i++)
		{	//put line buttons in array for clearing
			buttons[i] = document.getElementById("line" + i);
		}
		doLine(lIndex);
		setButtons();
	
		var s = ".prompt { background-color:" + getData("promptColor") + "; border: 5px solid black;}"
		document.getElementById("prompt").innerHTML=s;
	
		s = ".bodyColor { background-color:" + getData("bodyColor") + ";}"
		document.getElementById("bg").innerHTML=s;
	
		setTimeout(setFocus, 4*1000);
		setSessionTimestamp();
	} else {
		document.getElementById("buttons").innerHTML="Trial Period has expired";
	}
	setButtonListeners();
}

function refreshScreen(lIdx){	

	var color;
	var text = "<table id='table1'> <tr>"  ;
	var s = "";
	var key = "";

	lIndex = lIdx
	setData("lIndex",  lIndex);
 
	cLine = lines[lIndex];
	//var w = window.screen.availWidth/10;
	//var h = window.screen.availHeight/10;
	var keyHeight = (Math.floor(window.innerWidth/110))*10;  //(drop it down to integer that is 1/10th of width)

	for (c=0; c < cLine.length; c++)
	{
		key=cLine[c];
		s = setUpKeyBlock(key);
		color=getData(key+"Color");
		if (key == cChar){
			cIndex = c;  //save current char
		}
		text += "<td id=key" + key + " class=" + color+ ">"
		text +="<img src="+s+ " id=img" +key +  " style='height:" + keyHeight +"px;' > </td>";
	}
	text += " </tr></table>"  
	//console.log(text);
	document.getElementById("keyline").innerHTML = text;
	
	//add event listeners
	var letter, s;

	for (c=0; c < cLine.length; c++)
	{
		letter = cLine[c];
		s = 'key' + letter;
		try {
			document.getElementById(s).removeEventListener('click',function(){soundKey(event);});
		} catch (err){

		}
		document.getElementById(s).addEventListener('click',function(){soundKey(event);});
	}
	refreshImages();
	
}
function setUpKeyBlock(keyName){
	var s;
	var textColor = getTextColor(keyName);

	if (getBoolean("hide") ) {
			s=  lang+ "/Images/blank.png";
		} else {
			s = textColor  +getData("caps") + 'letters/' +keyName +'.png';
		}
	return s;
}
function getTextColor(key){
	var textColor = "black/";
	var color=getData(key+"Color");
	if (color=="black"){
		textColor="white/";
	}
	return textColor;
}

function refreshImages(){ 
	//if hide is on, need to re-display letter
	if (getBoolean("hide") || !getBoolean("prompt")) {
		document.getElementById("img"+cChar).src = getTextColor(cChar)  +getData("caps") + 'letters/' +cChar +'.png';
	} else { //set prompt color
		document.getElementById("key"+cChar).className = 'prompt';  // highlight new key
	}
	document.getElementById("inBox").focus();
	inBox.value = "";
	errorCount = 0;
	var temp = lang + "/Images/blank.png";
	document.getElementById("pictureBox").src = temp; 
	bodyColor = getTextColor(cChar); //ForBG();
	temp = bodyColor +getData("caps") + "letters/" + cChar + ".png";
	document.getElementById("keyPicture").src = temp;
	var bgcolor=getData(cChar+"Color");
	document.getElementById("keyPicture").className = bgcolor;
	playLetterSound();
	startTime=getTimestamp(); 
}
function playLetterSound(){
	if (getBoolean("audioCue") == true){
	    playSound(lang + "/Sounds/" + cChar + ".wav");
	}

}
function clearButtons(){
	for (i = 0; i < buttons.length; i++){
		buttons[i].style.backgroundColor ="lightgray";
	}
}

function doHide(){
 	var x = document.getElementsByTagName("div");
	var h =getBoolean("hide");
	var b = document.getElementById("hide")

	if (h ){
		h=false ;
		b.style.backgroundColor = "lightgray";
	} else {
		h=true;
		b.style.backgroundColor ="darkgray";
		}
	setBoolean("hide", h);
	refreshScreen(lIndex);
}

function doJump(){
	var b = document.getElementById("jump")
	var jump = getBoolean("jump")
	if (jump ) {
		jump=false ;
		b.style.backgroundColor = "lightgray";
	} else {
		jump=true;
		b.style.backgroundColor ="darkgray";
	}
	refreshScreen(lIndex);
	setBoolean("jump",  jump);
 
}

function setButtons() {
	var b = document.getElementById("jump");
	if (getBoolean("jump")) {	b.style.backgroundColor = "darkgray";
	} else {
		b.style.backgroundColor ="lightgray";
	}
	b = document.getElementById("hide");

	if (getBoolean("hide")) {	b.style.backgroundColor = "darkgray";
	} else {
		b.style.backgroundColor ="lightgray";
	}
		var b = document.getElementById("caps")
	if (getData("caps")=="") {	b.style.backgroundColor = "lightgray";
	} else {
		b.style.backgroundColor ="darkgray";
	}
		
}
function doLang() {
	lang = getData("lang");
	if (lang =="en") {
		lang= "es";
		document.getElementById("lang").innerHTML = "Espa&ntilde;ol";
		document.getElementById("click").innerHTML = "Haga clic aqu&iacute; para mostrar el teclado";
		
	} else {
		lang ="en";
		document.getElementById("lang").innerHTML = "English";
		document.getElementById("click").innerHTML = "Click here to bring up keyboard";
	}
	setData("lang",  lang);	
	
	refreshScreen(lIndex);
}

function doCaps() {
	var b=	document.getElementById("caps")
	var caps = getData("caps");
	if (caps =="caps/") {
		caps= "";
		b.style.backgroundColor = "lightgray";
	} else {
		caps ="caps/";
		b.style.backgroundColor = "darkgray";
	}
	setData("caps",  caps);	
 
	
	refreshScreen(lIndex);
}
function doLine(lIndex){
	cLine = lines[lIndex];
	cChar = cLine[0];
	clearButtons();
 
	var b = buttons[lIndex];//change button selected
	b.style.backgroundColor ="darkgray";
	refreshScreen(lIndex);
}

function process() {
	try {
		document.getElementById("inBox").removeEventListener("keyup", process); 
	} catch (err) {}
	var inBox = document.getElementById("inBox"); 
	var key = inBox.value; 
	//ignore non alpha codes
	processKey(key.toLowerCase());
	inBox.value = "";
}
function getMediaURL(snd) {
	if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + snd;
		return  snd;
}
function log (s) {
var b=  document.getElementById("log");
b.innerHTML = s; 
}
function playSound(snd){

	s = getMediaURL(snd); // add android prefix to filename if necessary
		
	var my_media= new Media(s,
            // success callback
             function () { //console.log("playAudio():Audio Success");
			 },
            // error callback
             function (err) { console.log("playAudio():Audio Error: " + err.code +":" + err.message); }
    );
	// Play audio 
	my_media.play();
	//release the object
	setTimeout(function(){ my_media.release(); }, 4*1000);
}
function soundKey(event){
	var s=event.target.id; //= 'imgx'
	var key =  s.charAt(3);
	playSound(lang + "/Sounds/" + key + ".wav");
	setFocus();
}
function doNext(){	
	try {
		document.getElementById("inBox").addEventListener("keyup", process);
	} catch (err) {}

    if (getBoolean("jump")) {
		cIndex = Math.floor((Math.random() * cLine.length) + 1);
    } else
    {
	   cIndex +=1;
    }

	if (cIndex >= cLine.length){
		cIndex = 0;
	}
	var s = "key"+cChar;
	document.getElementById(s).className = getData(cChar+"Color"); // put key back to original color
 
	if (getBoolean("hide")) {
		document.getElementById("img"+cChar).src =  lang + "/Images/blank.png";
	}

	cChar = cLine[cIndex];			// get next key
	startTime=getTimestamp();		// timestamp
	refreshImages();
}

function processKey(key){

	try {
		if (key.toLowerCase() == cChar.toLowerCase()) {//Success!!
				document.getElementById("pictureBox").src = lang +"/Images/" + cChar + ".png";
				if (getBoolean("sayLetter")==true){
					playSound(lang + "/Sounds/" + cChar + ".wav");
				} else {
					playSound(lang + "/letterSounds/" + cChar + ".wav");
				}
				//endTime=getTimestamp();
				//setLetterTimestamp(cChar, startTime, endTime, errorCount);
				inBox.value = "";
				errorCount = 0;
				secs = getData("timer");
				setTimeout(doNext, secs*1000);
		}
		else {
				errorCount += 1;
				if (getBoolean("beep") == true){
					playSound("misc/beep.wav");
				}
				try {
				document.getElementById("inBox").addEventListener("keyup", process); 
				} catch (err) {}
			}
	}
	catch (err)
	{
		try {
			document.getElementById("inBox").addEventListener("keyup", process); 
		} catch (err) {}
	}
}
function setFocus (){
	var b = document.getElementById("inBox");
	b.focus();
	b.value = "";
	try {
		b.removeEventListener("keyup", process); 
	} catch (err) {}
	b.addEventListener("keyup", process);
}
function processEvent() {

	procesKey(event.key);
  	event.preventDefault();
}

function doAlpha(){
 
 lines[0] = "1234567890";
 lines[1] = "abcdefghij";
 lines[2] = "klmnopqrs";
 lines[3] = "tuvwxyz";

}
function doQwerty(){
 lines[0] = "1234567890";
 lines[1] = "qwertyuiop";
 lines[2] = "asdfghjkl";
 lines[3] = "zxcvbnm";
 

}
function setUpColorArrays() {
	for (c=0; c < 4; c++) {
		lineColor[c] = getData("lineColor"+c);
	}

}
function doStandardKB(){
	if (getBoolean("left_right")== false){
		for (i=0; i<4; i++) {
			setLineColor(lines[i], lineColor[i]);
		}
	} else {
		setLineColor("12345qwertasdfgzxcvb", getData("leftColor"));
		setLineColor("67890yuiophjklnm",getData("rightColor"));
	}
}
function doBigKeysKB(){  
setLineColor("rdjlxv", "red");
setLineColor("gszn","green");
setLineColor("aeiouy","yellow");
setLineColor( "qtfbm",  "blue");
setLineColor( "1234567890whkcp",  "white");
}
function doChesterCreekKB(){

setLineColor("1qaz0p", "red");
setLineColor("2wsx9ol","green");
setLineColor("3edc8ik","yellow");
setLineColor( "4567rtyufghjvbnm",  "blue");
} 

 
 