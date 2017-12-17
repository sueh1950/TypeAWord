window.onload = restoreSettings();//startUp();		//setTimeout(getSettings, 2000);
var fullVersion = true;
var lines = ["1234567890","qwertyuiop","asdfghjkln", "zxcvbnm"];

var buttons =[];
var	lineColor = [];
 var home = true;
var cChar = "a";
var cIndex;  //index to character in line
var cLine = "";
var lIndex=0;
var errorCount=0;
var startTime=0;
const alphabet = "abcdefghijklmnopqrstuvwxyz";
var timer;
//this is for spanish language and keyboard
var lang="en";
const EN = 0;
const ES = 1;
var langIdx = EN;
var buttonTextEn = ["English"];
var buttonTextEs = ["Espa&ntilde;ol"];
var langtext = ["en", "es"];
var buttonIdx = [buttonTextEn, buttonTextEs];

const adultTextEn = "For Adults: <br> Type the word to be spelled here, then press go. The child will be given prompts for each letter.</P>";
const adultTextEs = "Para Adultos: <br> Escriba la palabra que se escribe ayu&iacute;. Pulse 'VA'. Los Ni&ntilde;os se lea dar&aacute; indicaciones para cada una de las letras";
var adultTextArray = [adultTextEn, adultTextEs];

const typeWordEn = "Please type the word to be spelled here:" ;
const typeWordEs = "Por favor, escriba la palabra a escribirse aqu&iacute;:" ;
var   typeWordArray = [typeWordEn,typeWordEs];

const spellEn = "I can type: "
const spellEs = "Puedo teclear: ";
var iCanSpell = [spellEn,spellEs];
var touch = true;
function log (s) {
	var b=  document.getElementById("log");
	//b.innerHTML = s; 
	console.log(s);
}
function doSuccess(){
    playSound(lang + "/Sounds/success.wav");
	document.getElementById("keyPicture").src = lang + "/graphics/success.png";
	document.getElementById("pictureBox").src = "en/Images/blank.png"
	document.getElementById("keyPicture").className = "white";
	document.getElementById("showtime").innerHTML = "";
	deactivateKeyPicture();
	if (touch) {
		document.getElementById("keyPicture").addEventListener("click", goTouch);
	} else document.getElementById("keyPicture").addEventListener("click", goKybd);
}
function setStaticListeners()
{
	document.getElementById("box").addEventListener("click", setFocus);
	document.getElementById("buttons").addEventListener("click", setFocus);
	document.getElementById("home").addEventListener("click", refreshHome);	
	if (fullVersion) {
		document.getElementById("data").addEventListener("click", goToDataCollection);  
		document.getElementById("settings").addEventListener("click", goToSettings);   
	}   
}
function setHomeListeners(){
	clearEventListeners();
	document.getElementById("keyPicture").addEventListener("click", goKybd);
	document.getElementById("pictureBox").addEventListener("click", goTouch);		
    document.getElementById("lang").addEventListener("click", doLang); 
	document.getElementById("inBox").addEventListener("keyup", noProcess); 
	//chrome.app.window.addListener("resize", function (){log("size changed");});
	window.onresize = resize;
}
function clearEventListeners(){
	try {
		document.getElementById("keyPicture").removeEventListener("click", goKybd);
	} catch (err) {log(err);}
	try {
		document.getElementById("keyPicture").removeEventListener("click", goTouch);
	} catch (err) {log(err);}
	try {
		document.getElementById("keyPicture").removeEventListener("click", process);		
	} catch (err) {log(err);}
	try {
		document.getElementById("keyPicture").removeEventListener("click", sayKey);		
	} catch (err) {log(err);}
	try {
		document.getElementById("pictureBox").removeEventListener("click", goTouch);		
	} catch (err) {log(err);}
	try {
		document.getElementById("lang").removeEventListener("click", doLang); 
	} catch (err) {log(err);}
	try {
		document.getElementById("lang").removeEventListener("click", doCaps); 
	} catch (err) {log(err);}
	try {
		document.getElementById("inBox").removeEventListener("keyup", process); 
	} catch (err) {log(err);}
	try {
		document.getElementById("inBox").removeEventListener("keyup", noProcess); 
	} catch (err) {log(err);}
}
function goKybd ()
{
	touch = false;
	clearEventListeners();
	document.getElementById("inBox").addEventListener("keyup", process); 
	document.getElementById("keyPicture").addEventListener("click", sayKey );
	go ();
}
function goTouch()
{
	touch = true;
	clearEventListeners();
	document.getElementById("inBox").addEventListener("keyup", noProcess); 	
	document.getElementById("keyPicture").addEventListener("click", process );
	go ();
}

function go ()
{
	var bodyColor;
	cIndex = 0;
	home = false;

	try{
		cLine =  document.getElementById("wordBox").value;
	} catch (err) {}
	// no word added? 
	if (cLine == "") {
		refreshHome();
		document.getElementById("text").innerHTML = typeWordArray[langIdx];
		return;
	}
	
	cChar = convertChar(cLine.charAt(cIndex));
	try {
		document.getElementById("lang").addEventListener("click", doCaps);
	} catch (err) {log("go:"+err);}
	document.getElementById("lang").innerHTML = "Caps";
	
	setData("word", cLine);
	storeSettings();
	document.getElementById("word").innerHTML = iCanSpell[langIdx] + cLine;
	document.getElementById("remove").innerHTML = "";
	document.getElementById("text").innerHTML = "";
	refreshImages();
}	

function resize()
{
 	var w = window.innerWidth;
	var h = window.innerHeight;
	if (home) {
		refreshHome();
	} else {
		refreshImages();
	}
}

function startUp () {
	 chrome.storage.local.set({'settingsChanged': false}, function() {
          // Notify that we saved.
		   });
	if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
	} else {
		alert("Sorry! No Web Storage support..");
	}
	getSettings()
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

	setFocus();
	errorCount = 0;
	var temp = "en/Images/blank.png";

	document.getElementById("pictureBox").src = temp;   
	bodyColor = getTextColor(cChar); //ForBG();
	temp = bodyColor +getData("caps") + "letters/" + cChar + ".png";

	document.getElementById("keyPicture").src = temp;

	var bgcolor=getData(cChar+"Color");
	document.getElementById("keyPicture").className = bgcolor;
	playLetterSound();
	startTime=getTimestamp(); 
	setButtons();
}

function refreshHome(){
	clearEventListeners();
	clearTimeout(timer);
	home =true;
	setHomeListeners();
	try {
		document.getElementById("text").innerHTML = adultTextArray[langIdx];
		document.getElementById("remove").innerHTML ="<input type='text' id='wordBox'  value='"+cLine+"'  >";
	} catch (err) {}
	var temp = lang +"/graphics/goButton.png";
	document.getElementById("keyPicture").src = temp;
	temp = lang +"/graphics/goButton2.png"
	document.getElementById("pictureBox").src = temp; 
	document.getElementById("showtime").innerHTML = "";
	document.getElementById("word").innerHTML = "";		
	document.getElementById("lang").innerHTML  = buttonIdx[langIdx][0];
}
function setLang(_langIdx)
{	var s;
	langIdx = _langIdx;	
	lang = langtext[langIdx];
	var x =	window.document.getElementById("lang");
	x.innerHTML  = buttonIdx[langIdx][0];
	x.style.backgroundColor = "lightgray";	
	s = lines[2];
	lines[2] = s.slice(0,9);  // remove '~' if it's there
	if ((langIdx == ES) && (getBoolean("Spanish"))) {
			lines[2] += "~";	
	} 
}
function doLang() {
	if (lang =="en") {
		lang= "es";
		langIdx=ES;			
	} else {
		lang ="en";
		langIdx=EN;
	}
	setLang(langIdx);
	setData("lang",  lang);	
	storeSettings();
	refreshHome();
}

function setButtons() {
	var b = document.getElementById("lang");
	b.style.backgroundColor = "lightgray";
	if (!home){ 
		if (getData("caps")=="") {	b.style.backgroundColor = "lightgray";
		} else {
			b.style.backgroundColor ="darkgray";
		}
	}
}

function doCaps() {
	var b=	document.getElementById("lang")
	var caps = getData("caps");
	if (caps =="caps/") {
		caps= "";
		b.style.backgroundColor = "lightgray";
	} else {
		caps ="caps/";
		b.style.backgroundColor = "darkgray";
	}
	setData("caps",  caps);	
	chrome.storage.local.set({'caps': caps}, function() {   });
	refreshImages();
}

 function playLetterSound(){
	var c = cChar;
	lang=getData("lang");
	if (getBoolean("audioCue") == true){
		if ((c == 'z') && (!getBoolean("zee"))){
			c = 'zed';
		}
	    playSound(lang + "/Sounds/" + c + ".wav");
	}
}	
function convertChar(_cChar)
{
	var c = _cChar.toLowerCase();
	try{
		if (c.charCodeAt(0) == 241)  {	c='~';}
	}catch (err) { }
	
	try{
		if (c  == " ") { c = "@";}
	} catch (err) { }

	return c;
}

function playSound(snd){
	var x = document.getElementById("myAudio")
	x.src = snd;
	x.play();
}
 
function soundKey(event){
	lang=getData("lang");
	var s=event.target.id;
	var key =  s.charAt(3);
	if ((key == 'z') && (!getBoolean("zee"))){
			key = 'zed';
	}
	playSound(lang + "/Sounds/" + key + ".wav");
	setFocus();
}
function doNext(){	
	document.getElementById("showtime").innerHTML = "";
	activateKeyPicture();

	cIndex +=1;

	if (cIndex >= cLine.length){
		//success!
		doSuccess();
		cIndex=0;
		return;
	}
		// get next key
	cChar = convertChar(cLine[cIndex]);
	refreshImages();
}
function sayKey () {
	var key = cChar;
	if ((key == 'z') && (!getBoolean("zee"))){
			key = 'zed';
	}
	playSound(lang + "/Sounds/" + key + ".wav");
}
function noProcess() {
	inBox.value = "";
}
function deactivateKeyPicture() {
	try {
		document.getElementById("inBox").removeEventListener("keyup", process); 
	} catch (err) {}
	try {
		document.getElementById("keyPicture").removeEventListener("click", sayKey); 
	} catch (err) {}
	try {
		document.getElementById("keyPicture").removeEventListener("click", process); 
	} catch (err) {}
}
function activateKeyPicture() {
	if (touch) {
		document.getElementById("keyPicture").addEventListener("click", process); 
	}
	else {	
		document.getElementById("inBox").addEventListener("keyup", process);
		document.getElementById("keyPicture").addEventListener("click", sayKey); 
	}
}
function process() {	
	var inBox;
	var key;
	var keyPressed;
	inBox = document.getElementById("inBox");
	deactivateKeyPicture();

	if (!touch) {
		key = inBox.value.charAt(0); 
	} else { key = cChar;}
	keyPressed = key;	
	
	//ignore non alpha codes
	if (!isNaN(key.charCodeAt(0))) {
		//enye character for Spanish keyboard
		key = convertChar(key);
		processKey(keyPressed, key.toLowerCase());
	} else {

		activateKeyPicture(); //ignore non alphnumericcharacters 

	}
	inBox.value = "";
}

function processKey(keyPressed, key){
	lang=getData("lang");
	try {
		if (key == cChar.toLowerCase()) {//Success!!
				document.getElementById("pictureBox").src = lang +"/Images/" + key + ".png";
				if ((key == 'z') && (!getBoolean("zee"))){
					key = 'zed';
				}
				if (getBoolean("sayLetter")==true){						
					playSound(lang + "/Sounds/" + key + ".wav");
				} else {
					playSound(lang + "/letterSounds/" + key + ".wav");
				}
				endTime=getTimestamp();
				setLetterTimestamp(keyPressed, startTime, endTime, errorCount);
				inBox.value = "";
				errorCount = 0;
				secs = getData("timer");
				timer = setTimeout(doNext, secs*1000);
		}
		else {
			errorCount += 1;
			if (getBoolean("beep") == true){
				playSound("misc/beep.wav");
			}
			activateKeyPicture();
		}
	}
	catch (err)
	{
	  	activateKeyPicture();
	}
}
function setFocus (){
	if (!touch) {
		document.getElementById("inBox").focus();
	}
	document.getElementById("inBox").value="";
}
function processEvent() {

	procesKey(event.key);
  	event.preventDefault();
}
var linesLeft;
var linesRight;
function doAlpha(){
	lines[0] = "1234567890";
	lines[1] = "abcdefghij";
	lines[2] = "klmnopqrs~";
	lines[3] = "tuvwxyz";
	linesLeft = "12345abcdelmnotuvwx";
	linesRight= "67890fghijkpqrsyz~"
}
//these set the keys in the appropriate lines
function doQwerty(){
	lines[0] = "1234567890";
	lines[1] = "qwertyuiop";
	lines[2] = "asdfghjkl~";	//~ is there so Ntilde gets colored
	lines[3] = "zxcvbnm";
	linesLeft = "12345qwertasdfgzxcvb";
	linesRight= "67890yuiophjklnm~"
}
function setUpColorArrays() {
	for (c=0; c < 4; c++) {
		lineColor[c] = getData("lineColor"+c);
	}
}
//these color the keys
function doStandardKB(){
	if (getBoolean("left_right")== false){
		for (i=0; i<4; i++) {
			setLineColor(lines[i], lineColor[i]);
		}
	} else {
		setLineColor(linesLeft,getData("leftColor"));
		setLineColor(linesRight,getData("rightColor"));
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
function goToDataCollection (){
		//window.location.assign("support/dataCollection.htm")
	var lines = (getData("dataCollection").length);
	lines *= 2;
	if (lines >600){lines = 600;}
	chrome.app.window.create('support/dataCollection.htm', {
    'outerBounds': {
      'width': 600,
      'height': 500
    }

  });
	 
}
function goToSettings (){
 chrome.app.window.create('support/settings'+lang+'.htm', {
	// state: 'fullscreen',
    'outerBounds': {
      'width': 800,
      'height': 1000
    }
  });
}


 