//Namespace for media utilities
media = {
  //Volume levels that will be used
  //volumes : [2, 4, 6, 8, 10, 12, 14, 16], //intense
  volumes : [2, 4, 10, 16],
  //volumes : [2, 8],
  //volumes : [2],
  //Key assignments in order for A-Z, a-z, AA-ZZ, 0-9
  keys88 : [
                                                 ['a',0], ['b',0],
    ['c',1], ['d',1], ['e',1], ['f',1], ['g',1], ['a',1], ['b',1],
    ['c',2], ['d',2], ['e',2], ['f',2], ['g',2], ['a',2], ['b',2],
    ['c',3], ['d',3], ['e',3], ['f',3], ['g',3], ['a',3], ['b',3],
    ['c',4], ['d',4], ['e',4], ['f',4], ['g',4], ['a',4], ['b',4],
    ['c',5], ['d',5], ['e',5], ['f',5], ['g',5], ['a',5], ['b',5],
    ['c',6], ['d',6], ['e',6], ['f',6], ['g',6], ['a',6], ['b',6],
    ['c',7], ['d',7], ['e',7], ['f',7], ['g',7], ['a',7], ['b',7],
    ['c',8],
                                            ['as',0],
    ['cs',1], ['ds',1], ['fs',1], ['gs',1], ['as',1],
    ['cs',2], ['ds',2], ['fs',2], ['gs',2], ['as',2],
    ['cs',3], ['ds',3], ['fs',3], ['gs',3], ['as',3],
    ['cs',4], ['ds',4], ['fs',4], ['gs',4], ['as',4],
    ['cs',5], ['ds',5], ['fs',5], ['gs',5], ['as',5],
    ['cs',6], ['ds',6], ['fs',6], ['gs',6], ['as',6],
    ['cs',7], ['ds',7], ['fs',7], ['gs',7], ['as',7]
  ],

  getSpecialURL : function(filename) {
    var b = BrowserDetect.browser
    if(b == "Firefox" || b == "Opera") {
      return 'media/ogg/Special-' + filename + '.ogg'
    }
    else {
      return 'media/m4a/Special-' + filename + '.m4a'
    }
  },
  
  //Gets the URL to the media file.
  getMediaUrl : function(letter, octave, volume) {
    volume--
    if(volume == 10) volume = 'a'
    if(volume == 11) volume = 'b'
    if(volume == 12) volume = 'c'
    if(volume == 13) volume = 'd'
    if(volume == 14) volume = 'e'
    if(volume == 15) volume = 'f'
    
    if(letter == 'c')  letter = '0-Cn'
    if(letter == 'cs') letter = '0-Cs'
    if(letter == 'd')  letter = '1-Dn'
    if(letter == 'ds') letter = '1-Ds'
    if(letter == 'e')  letter = '2-En'
    if(letter == 'f')  letter = '4-Fn'
    if(letter == 'fs') letter = '4-Fs'
    if(letter == 'g')  letter = '5-Gn'
    if(letter == 'gs') letter = '5-Gs'
    if(letter == 'a')  letter = '6-An'
    if(letter == 'as') letter = '6-As'
    if(letter == 'b')  letter = '6-Bn'
    var b = BrowserDetect.browser
    if(b == "Firefox" || b == "Opera") {
      return 'media/ogg/Piano-' + octave + '-' + letter + '-' + volume + '.ogg'
    }
    else {
      return 'media/m4a/Piano-' + octave + '-' + letter + '-' + volume + '.m4a'
    }
  },
  
  //Stores the handles to the buffers.
  buffers : [],
  
  //Handle to the audio context.
  context : null,
  
  //Handle to the buffer loader.
  bufferLoader : null,
  
  //Set to true, when media is ready to play.
  initialized : false,

  //Remembers where each of the special buffers is.
  specialBuffers : {},
  
  //Called when the buffers have been loaded.
  loadedAllBuffers : function (bufferList) {
    media.buffers = bufferList
    media.initialized = true
    //Disable the cached progress function once all the buffers are finished.
    media.bufferLoader.progress = media.progress = function(x) {}
    media.ready()

    //Start the player by playing a silent note.
    //media.play(30, 0, 1.0)
    media.playSilence()
  },

  //--------------------------------------------------------------------------//
  
  addSpecialBuffer : function (mediaToLoad, filename) {
    var index = mediaToLoad.length
    media.specialBuffers[filename] = index
    mediaToLoad.push(media.getSpecialURL(filename))
  },

  //Initializes the media utility.
  initialize : function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    media.context = new AudioContext();
    media.context.createGain = media.context.createGain ||
      media.context.createGainNode
    media.context.createConvolver = media.context.createConvolver ||
      media.context.createConvolverNode
    media.context.createDynamicsCompressor =
      media.context.createDynamicsCompressor ||
      media.context.createDynamicsCompressorNode

    media.compressNode = media.context.createDynamicsCompressor()
    media.compressNode.connect(media.context.destination)
    media.compressNode.threshold.value = -15
    media.compressNode.knee.value = 4
    media.compressNode.ratio.value = 3.5
    media.compressNode.attack.value = 0.003
    media.compressNode.release.value = 0.250
    media.maxCompress = 0
    setInterval(function() {
    	if(media.compressNode.reduction.value < media.maxCompress) {
    		media.maxCompress = media.compressNode.reduction.value
//    		console.log("Max Compression: " + media.maxCompress)
    	}
		}, 100) 
      
    var mediaToLoad = []
    var k = 0;
    for(var i = 0; i < media.volumes.length; i++)
      for(var j = 0; j < media.keys88.length; j++)
        mediaToLoad[k++] = media.getMediaUrl(
          media.keys88[j][0], media.keys88[j][1], media.volumes[i])

    //Add the remaining ones at the end.
    media.addSpecialBuffer(mediaToLoad, "IR")
    media.addSpecialBuffer(mediaToLoad, "Knock1")
    media.addSpecialBuffer(mediaToLoad, "Knock2")
    media.addSpecialBuffer(mediaToLoad, "Knock3")
    media.addSpecialBuffer(mediaToLoad, "Knock4")
    media.addSpecialBuffer(mediaToLoad, "Knock5")
    media.addSpecialBuffer(mediaToLoad, "Knock6")
    media.addSpecialBuffer(mediaToLoad, "Bell")
    
    media.bufferLoader = new BufferLoader(media.context, mediaToLoad,
      media.loadedAllBuffers, media.progress);
      
    media.bufferLoader.load();
  },
  
  /*This is replaced by the caller of initialize() and indicates when all the
  buffers have been loaded.*/
  ready : function () {
    console.log("media.ready()")
  },
  
  /*This is replaced by the caller of initialize() and indicates the progress of
  the buffer loading.*/
  progress : function (x) {
    console.log("media.progress(" + x + ")")
  },

  //Returns key index for special buffer.
  special : function (s) {
    return media.specialBuffers[s]
  },
  
  //Returns key index for A-Z.
  upperKey : function (s) {
    s = '' + s
    if(s.length > 1)
      return
    if(s.charCodeAt(0) >= 48 && s.charCodeAt(0) <= 57)
      return media.numberKey(s)
    var x = s.toUpperCase().charCodeAt(0) - 65
    if(x < 0 || x >= 26)
      return
    return x
  },
  
  //Returns key index for a-z.
  lowerKey : function (s) {
    s = '' + s
    if(s.length > 1)
      return
    if(s.charCodeAt(0) >= 48 && s.charCodeAt(0) <= 57)
      return media.numberKey(s)
    var x = s.toUpperCase().charCodeAt(0) - 65
    if(x < 0 || x >= 26)
      return
    return x + 26
  },
  
  //Returns key index for AA-ZZ.
  boldKey : function (s) {
    s = '' + s
    if(s.length > 1)
      return
    if(s.charCodeAt(0) >= 48 && s.charCodeAt(0) <= 57)
      return media.numberKey(s)

    var x = s.toUpperCase().charCodeAt(0) - 65
    if(x < 0 || x >= 26)
      return

    return x + 26 + 26
  },
  
  //Returns key index for 0-9.
  numberKey : function (s) {
    s = '' + s
    if(s.length > 1)
      return
    if(s.charCodeAt(0) < 48 || s.charCodeAt(0) > 57)
      return
    var asInt = s.charCodeAt(0) - 48
    return 26 + 26 + 26 + asInt
  },

  //Returns a white key
  whiteKey : function(s) {
    s = '' + s
    var sLower = s.toLowerCase()
    var sUpper = s.toUpperCase()
    if(!(sUpper.charCodeAt(0) >= 65 && sUpper.charCodeAt(0) < 91))
      return

    if(s == s.toLowerCase())
      return media.lowerKey(s)
    else
      return media.upperKey(s)
  },

  //Returns whether the key is a letter note key
  isLetterKey : function(s) {
    var s = '' + s
    if(s.length > 1)
      return false
    var c = s.toUpperCase().charCodeAt(0)
    if(c >= 65 && c < 91)
      return true
    else if(c >= 48 && c <= 57)
      return true
    return false
  },

  initializeConvolution : function () {
    if(media.convo === undefined) {
      media.convoGain = media.context.createGain()
      media.convoGain.gain.value = 0.2
      media.convoGain.connect(media.compressNode)
      media.convo = media.context.createConvolver()
      media.convo.buffer = media.buffers[media.special("IR")]
      media.convo.connect(media.convoGain)
    }
  },
  
  //Plays the key index at a time and desired volume.
  play : function (keyIndex, when, desiredVolume, noteLength) {
    if(!media.initialized || keyIndex === undefined)
      return
    media.initializeConvolution()
 
    var volumeToUse = Math.floor(desiredVolume * media.volumes.length)
    var volumeExtra = desiredVolume * media.volumes.length - volumeToUse
    volumeExtra = volumeExtra * 0.5 + 1.0
    if(volumeToUse == media.volumes.length)
      volumeToUse--
    var bufferToUse = keyIndex + media.keys88.length * volumeToUse
    
    var source = media.context.createBufferSource()
    source.buffer = media.buffers[bufferToUse]
    var g = media.context.createGain()

    //Ensure that nodes get cleaned up after they finish sounding...
    var timeBeforeDisconnect
    if(noteLength !== undefined)
      timeBeforeDisconnect = (when + noteLength + 1) - scheduler.time()
    else
      timeBeforeDisconnect = scheduler.time() + 20
    setTimeout(
      function(data) { return function() {
        data.sourceNode.disconnect(0)
        data.gainNode.disconnect(0)
      }}({
        sourceNode:source,
        gainNode:g
      }), timeBeforeDisconnect * 1000)

    g.gain.value = 1.0
    source.connect(g)
    g.connect(media.convo)
    g.connect(media.compressNode)
    source.start = source.start || source.noteOn
    source.start(when)
    if(noteLength !== undefined)
      media.noteOff(g.gain, when + noteLength)
    else if(!(keyIndex >= 40 && keyIndex <= 51) && !(keyIndex >= 80 && keyIndex <= 87))
      return g.gain
  },

  //Plays the special.
  playSpecial : function(tag, when, vol) {
    if(!media.initialized || tag === undefined)
      return
    if(vol === undefined)
      vol = 1.0
    media.initializeConvolution()

    var source = media.context.createBufferSource()
    source.buffer = media.buffers[media.special(tag)]
    var g = media.context.createGain()
    g.gain.value = vol
    source.connect(g)
    g.connect(media.convo)
    g.connect(media.compressNode)
    source.start = source.start || source.noteOn
    source.start(when)
  },

  noteOff : function(gainObject, when) {
    if(gainObject === undefined)
      return
    var currentTime = scheduler.time()
    if(when !== undefined)
      currentTime = when
    var initialOffset = 0.1
    var cutoffTime = 0.35

    gainObject.setValueAtTime(1.0, currentTime + initialOffset)
    gainObject.linearRampToValueAtTime(0.0, currentTime + cutoffTime)


  },
  
  //Plays a note at zero volume. This helps get the audio engine stabilized.
  playSilence: function(when) {
    if(!media.initialized)
      return
    
    var g = media.context.createGain()
    g.gain.value = 0
    g.connect(media.context.destination)
    
    var source = media.context.createBufferSource()
    source.buffer = media.buffers[0]
    source.connect(g)
    source.start = source.start || source.noteOn
    source.start(when)
  }
}
