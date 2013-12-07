//Simple browser detection
var BrowserDetect = {
  init: function () {
    this.browser = "Unknown"
    this.hasAudio = false
    var a = ""
    if(navigator !== undefined) {
      if(navigator.userAgent !== undefined) {
        a = navigator.userAgent
      }
    }
    console.log(a)
    if(a.indexOf("OPR") != -1)
      this.browser = "Opera"
    else if(a.indexOf("Chrome") != -1)
      this.browser = "Chrome"
    else if(a.indexOf("Firefox") != -1)
      this.browser = "Firefox"
    else if(a.indexOf("Safari") != -1)
      this.browser = "Safari"
    else
      this.browser = "Unknown"
    
    if(!window.AudioContext && !window.webkitAudioContext)
      this.hasAudio = false
    else
      this.hasAudio = true
  }
};
BrowserDetect.init();
