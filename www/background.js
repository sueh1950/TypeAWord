chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {

   state: 'fullscreen',
   outerBounds: {
      width: 800,
      height:  600
    },
  id: 'Keyboard Fun',  
	 
  });
  
});

 