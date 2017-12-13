document.addEventListener("deviceready", start, false);

function start(){
 
window.document.getElementById("return").addEventListener("click",closeWindow);
window.document.getElementById('save' ).addEventListener("click",saveSettings); 	
window.document.getElementById('menu1').addEventListener("click",doGeneral); 
window.document.getElementById('menu2').addEventListener("click",doColorLines); 
window.document.getElementById('menu3').addEventListener("click",doColorLR); 

 	 
window.document.getElementById('body1').addEventListener("click",function(){setBodyColor('lightgrey');});
window.document.getElementById('body2').addEventListener("click",function(){setBodyColor('gray');});
window.document.getElementById('body3').addEventListener("click",function(){setBodyColor('darkgray');});
window.document.getElementById('body4').addEventListener("click",function(){setBodyColor('black');});
window.document.getElementById('body5').addEventListener("click",function(){setBodyColor('white');});
window.document.getElementById('body6').addEventListener("click",function(){setBodyColor('yellow');});

window.document.getElementById('key01').addEventListener("click",function(){setColorLines(0, 'red');});
window.document.getElementById('key02').addEventListener("click",function(){setColorLines(0, 'yellow');});
window.document.getElementById('key03').addEventListener("click",function(){setColorLines(0, 'green');});
window.document.getElementById('key04').addEventListener("click",function(){setColorLines(0, 'blue');});
window.document.getElementById('key05').addEventListener("click",function(){setColorLines(0, 'purple');});
window.document.getElementById('key06').addEventListener("click",function(){setColorLines(0, 'white');});
window.document.getElementById('key07').addEventListener("click",function(){setColorLines(0, 'black');});
	
window.document.getElementById('key11').addEventListener("click",function(){setColorLines(1, 'red');});
window.document.getElementById('key12').addEventListener("click",function(){setColorLines(1, 'yellow');});
window.document.getElementById('key13').addEventListener("click",function(){setColorLines(1, 'green');});
window.document.getElementById('key14').addEventListener("click",function(){setColorLines(1, 'blue');});
window.document.getElementById('key15').addEventListener("click",function(){setColorLines(1, 'purple');});
window.document.getElementById('key16').addEventListener("click",function(){setColorLines(1, 'white');});
window.document.getElementById('key17').addEventListener("click",function(){setColorLines(1, 'black');});
 
window.document.getElementById('key21').addEventListener("click",function(){setColorLines(2, 'red');});
window.document.getElementById('key22').addEventListener("click",function(){setColorLines(2, 'yellow');});
window.document.getElementById('key23').addEventListener("click",function(){setColorLines(2, 'green');});
window.document.getElementById('key24').addEventListener("click",function(){setColorLines(2, 'blue');});
window.document.getElementById('key25').addEventListener("click",function(){setColorLines(2, 'purple');});
window.document.getElementById('key26').addEventListener("click",function(){setColorLines(2, 'white');});
window.document.getElementById('key27').addEventListener("click",function(){setColorLines(2, 'black');});
 
window.document.getElementById('key31').addEventListener("click",function(){setColorLines(3, 'red');});
window.document.getElementById('key32').addEventListener("click",function(){setColorLines(3, 'yellow');});
window.document.getElementById('key33').addEventListener("click",function(){setColorLines(3, 'green');});
window.document.getElementById('key34').addEventListener("click",function(){setColorLines(3, 'blue');});
window.document.getElementById('key35').addEventListener("click",function(){setColorLines(3, 'purple');});
window.document.getElementById('key36').addEventListener("click",function(){setColorLines(3, 'white');});
window.document.getElementById('key37').addEventListener("click",function(){setColorLines(3, 'black');});
 
window.document.getElementById('L1').addEventListener("click",function(){setLeftLines('red');});
window.document.getElementById('L2').addEventListener("click",function(){setLeftLines('yellow');});
window.document.getElementById('L3').addEventListener("click",function(){setLeftLines('green');});
window.document.getElementById('L4').addEventListener("click",function(){setLeftLines('blue');});
window.document.getElementById('L5' ).addEventListener("click",function(){setLeftLines('purple');});
window.document.getElementById('L6').addEventListener("click",function(){setLeftLines('white');});
window.document.getElementById('L7').addEventListener("click",function(){setLeftLines('black');});

window.document.getElementById('R1').addEventListener("click",function(){setRightLines('red');});
window.document.getElementById('R2').addEventListener("click",function(){setRightLines( 'yellow');});
window.document.getElementById('R3').addEventListener("click",function(){setRightLines( 'green');});
window.document.getElementById('R4').addEventListener("click",function(){setRightLines( 'blue');});
window.document.getElementById('R5').addEventListener("click",function(){setRightLines( 'purple');});
window.document.getElementById('R6').addEventListener("click",function(){setRightLines( 'white');});
window.document.getElementById('R7').addEventListener("click",function(){setRightLines( 'black');});
window.document.getElementById('qwerty').addEventListener("click",function(){setABC(true);});
window.document.getElementById('alpha').addEventListener("click",function(){setABC(false);});

getSettingsFile( );

}

function getSettingsFile( ) {
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
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
				populatePage();
		};
		reader.readAsText(file);
	}, fail);
}
function fail(e) {
    console.log("settings2.js FileSystem Error");
    console.log(e);
}
function setABC(qwerty){
	if (qwerty) {
		document.getElementById("line0").innerHTML = "Color: 123" ;
		document.getElementById("line1").innerHTML = "Color: QWE" ;
		document.getElementById("line2").innerHTML = "Color: ASD" ;
		document.getElementById("line3").innerHTML = "Color: ZXC" ;			
		} else {
		document.getElementById("line0").innerHTML = "Color: 123" ;
		document.getElementById("line1").innerHTML = "Color: ABC" ;
		document.getElementById("line2").innerHTML = "Color: KLM" ;
		document.getElementById("line3").innerHTML = "Color: TUV" ;			
	}	
}
function populatePage(){
	document.getElementById("Standard").checked=(getData("kybType") == "standard");
	document.getElementById("BigKeys").checked=(getData("kybType") == "bigKeys");
	document.getElementById("ChesterCreek").checked=(getData("kybType") == "CC");

	document.getElementById("qwerty").checked=getBoolean("qwerty");	
	document.getElementById("alpha").checked=!getBoolean("qwerty");	
	document.getElementById("beep").checked=getBoolean("beep");
	document.getElementById("showtime").checked = getBoolean("showTime");
	setABC(getBoolean("qwerty"));
	if (getData("lang") == "en") {
		document.getElementById("zee").checked=getBoolean("zee");
		document.getElementById("zed").checked=!getBoolean("zee");
	} else {   // Spanish
		document.getElementById("Spanish").checked=getBoolean("Spanish");
	}
	document.getElementById("sayLetter").checked=getBoolean("sayLetter");
    document.getElementById("audioCue").checked=getBoolean("audioCue");
	document.getElementById("timer").value = getNumber("timer");
	
	document.getElementById("cline").checked = !getBoolean("left_right");
	document.getElementById("colorLeftRight").checked = getBoolean("left_right");

	for (c=0; c<4; c++){
		document.getElementById("line" + c).className=getData("lineColor" + c);
	}
	setBodyColor(getData("bodyColor"));
	document.getElementById("keyRight").className = getData("rightColor") ;			
	document.getElementById("keyLeft").className = getData("leftColor") ;	

	setMenuActive('menu1');
}
function saveSettings(){
	if (document.getElementById("Standard").checked) 
		{setData("kybType", "standard");}
	if (document.getElementById("BigKeys").checked) 
		{setData("kybType", "bigKeys");}
	if (document.getElementById("ChesterCreek").checked) 
		{setData("kybType", "CC");}

	setData("qwerty", document.getElementById("qwerty").checked);
	setData("beep", document.getElementById("beep").checked);
	setData("showTime", document.getElementById("showtime").checked);	
	setData("sayLetter", document.getElementById("sayLetter").checked);
	setData("audioCue", document.getElementById("audioCue").checked);
	setData("timer", document.getElementById("timer").value);
	setData("left_right", 	document.getElementById("colorLeftRight").checked);

	if (getData("lang") == "en") {
		setData("zee", document.getElementById("zee").checked);
		}else {
			setData("Spanish",document.getElementById("Spanish").checked);
	} 
	
	for (c=0; c<4; c++){
		var color = document.getElementById("line" + c).className;
		setData("lineColor" + c, color);
	}
	setData("bodyColor", document.getElementById("bodyColor").className);
	setData("rightColor", document.getElementById("keyRight").className);			
	setData("leftColor", document.getElementById("keyLeft").className);	
	setData("settingsChanged", true);

	storeSettings(settingsObj);
}


function closeWindow() {
	window.open("index.html", "_parent");
}
