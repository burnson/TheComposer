textSize = 14
chapterSize = 30
textSpacing = 20
paperWidth = 800
paperHeight = 600
paperWidth_2 = paperWidth / 2
paperHeight_2 = paperHeight / 2
twoPi = 3.141592654 * 2
requestedFullScreen = false
renderer = null
keyState = {}
buttonOpacity = 0.0
trademarkElement = null
performanceMode = false
globalGlow = undefined
sceneProgress = {}
copyrightActive = false
scene4_foxcat = null

document.onmouseup = function() {
	if(globalGlow !== undefined)
		globalGlow.remove()
}

function keyToText(event) {
  var key = event.keyCode
  var shift = event.shiftKey
	var offset = 0
	if(shift == false)
		offset = 97 - 65
	if(key >= 65 && key <= 90)
		return String.fromCharCode(key + offset) //A-Z
	if(shift == false) {
		if(key >= 48 && key <= 57)
			return String.fromCharCode(key) //0-9
		else if(key == 192) return '`' // `
		else if(key == 189) return '-' // -
		else if(key == 187) return '=' // =
		else if(key == 219) return '[' // [
		else if(key == 221) return ']' // ]
		else if(key == 220) return '\\' // \
		else if(key == 186) return ';' // ;
		else if(key == 222) return "'" // '
		else if(key == 188) return ',' // ,
		else if(key == 190) return '.' // .
		else if(key == 191) return '/' // /
	}
	if(key == 32) return ' ' //space
	else if(key == 37) return 'left'
	else if(key == 38) return 'up'
	else if(key == 39) return 'right'
	else if(key == 40) return 'down'
	else if(key == 16) return 'shift'
	else if(key == 13 || key == 10) return '\n'
	return ""
}

function setKeyHandlers(down, up) {
	keyState = {downFunction:down, upFunction:up}
	document.onkeydown = function(ev) {
		var k = keyToText(ev)
		var kl = k.toLowerCase()
		if(k == "")
			return
		if(keyState[kl] != true) {
			keyState[kl] = true
			keyState.downFunction(k)
		}
	}
	document.onkeyup = function(ev) {
		var k = keyToText(ev)
		var kl = k.toLowerCase()
		if(k == "")
			return
		if(keyState[kl] == true)
			keyState.upFunction(k)
		keyState[kl] = false		
	}
}

function clearKeyHandlers() {
	document.onkeydown = function() {}
	document.onkeyup = function() {}
	keyState = {}
}

function setRenderer(callback) {
	clearRenderer()
	callback()
	renderer = setInterval(callback, 50)
}

function clearRenderer() {
	clearInterval(renderer)
}

function init() {
  createPaper()
  //splashScreen()
  startMedia()
}

function createPaper() {
  paper = Raphael(0, 0, window.innerWidth, window.innerHeight)
  paper.setViewBox(0, 0, 800, 600, true)
  window.onresize = function(e) {
    if(paper === undefined)
      return
    paper.setSize(window.innerWidth, window.innerHeight)
  }

  //Load global images
  var img_w = 365, img_h = 508
  img_w *= 0.5
  img_h *= 0.5
  scene4_foxcat = paper.image("media/jpg/scene4.jpg", paperWidth_2 - img_w / 2,
    paperHeight_2 - img_h / 2, img_w, img_h)
  scene4_foxcat.attr({opacity:0.0})
}

function drawGrid() {
  var s = ""
  for(var x = 0; x <= 800; x += 100) {
    s = s + "M" + x + ",0L" + x + ",600"
  }
  for(var y = 0; y <= 600; y += 100) {
    s = s + "M0," + y + "L800," + y
  }
  paper.path(s).attr({"stroke-width":1, "stroke-opacity":0.2})

  var s = ""
  for(var x = 0; x <= 800; x += 50) {
    s = s + "M" + x + ",0L" + x + ",600"
  }
  for(var y = 0; y <= 600; y += 50) {
    s = s + "M0," + y + "L800," + y
  }
  paper.path(s).attr({"stroke-width":1, "stroke-opacity":0.1})

  var s = ""
  for(var x = 0; x <= 800; x += 10) {
    s = s + "M" + x + ",0L" + x + ",600"
  }
  for(var y = 0; y <= 600; y += 10) {
    s = s + "M0," + y + "L800," + y
  }
  paper.path(s).attr({"stroke-width":1, "stroke-opacity":0.05})
}

function clearPaper(callback) {
  paper.clear()
  //drawGrid()
  trademark(callback)
}

function addCircle(white) {
	var p = paper.circle(0, 0, 5)
	if(white)
		p.attr({stroke:"#000", "stroke-width":1, fill:"none"})
	else
		p.attr({stroke:"none", fill:"#000"})
	return p
}

function addSquare(white) {
	var p = paper.path("M5,5L-5,5L-5,-5L5,-5Z")
	if(white)
		p.attr({stroke:"#000", "stroke-width":1, fill:"none"})
	else
		p.attr({stroke:"none", fill:"#000"})
	return p
}

function addUpTriangle(white) {
	var p = paper.path("M5,5L-5,5L0,-5Z")
	if(white)
		p.attr({stroke:"#000", "stroke-width":1, fill:"none"})
	else
		p.attr({stroke:"none", fill:"#000"})
	return p
}

function addDownTriangle(white) {
	var p = paper.path("M5,-5L-5,-5L0,5Z")
	if(white)
		p.attr({stroke:"#000", "stroke-width":1, fill:"none"})
	else
		p.attr({stroke:"none", fill:"#000"})
	return p
}

function addTextButton(text, size, style, click) {
  //Determine the weight.
  var weight = 0
  if(style == "bold")
    weight = 900
  else if(style == "italic")
    weight = 500

  //Print out the text.
  var text = paper.print(0, 0, text, paper.getFont("Minion", weight), size)

  //Create a clicking rectangle box.
  var bounds = text.getBBox()
  var button
  if(click !== undefined) {
  	button = paper.rect(
    bounds.x - 2.5, bounds.y - 2.5, bounds.width + 5, bounds.height + 5, 5).attr(
    {stroke: "none", fill: "none"})
  	button.attr({fill:"#000", "fill-opacity":buttonOpacity})
    button.mouseover(
      function(data) { return function() {
      	if(globalGlow === undefined) {
	        globalGlow = data.text.glow()
      	}
      }}({
        obj:button,
        text:text
      })
    )
    button.mouseout(
      function(data) { return function() {
      	if(globalGlow !== undefined) {
      		globalGlow.remove()
      		globalGlow = undefined
      	}
      }}({
        obj:button,
        text:text
      })
    )
    /*
    button.mousedown(
      function(data) { return function() {
        globalGlow = data.text.glow()
      }}({
        obj:button,
        text:text
      })
    )*/
    button.mouseup(
      function(data) { return function() {
        globalGlow.remove()     
        click()
      }}({
        obj:button,
        text:text
      })
    )
  }

  return {text:text, bounds:bounds, button:button}
}

function fullScreenButton() {
  if(screenfull.enabled && requestedFullScreen != true) {
    screenfull.onchange = function() {
      if(screenfull.isFullscreen) {
        fullScreenObject.text.remove()
        fullScreenObject.button.remove()
      }
      else {
        requestedFullScreen = false
        fullScreenButton()
      }
    }
    fullScreenObject = addTextButton("full screen", 12, "italic", function() {
      requestedFullScreen = true
      screenfull.request()
    })
    var copy = addTextButton("copyright", 12, "italic", copyright)
    relocateTo(fullScreenObject, paperWidth_2 - (fullScreenObject.bounds.width + copy.bounds.width + 80) / 2, 580)
    relocateTo(copy, paperWidth_2 - (fullScreenObject.bounds.width + copy.bounds.width + 80) / 2 + (fullScreenObject.bounds.width + 80), 580)
  }
}

function translation(x, y)
{
  return "t" + x + "," + y
}


function rotateTranslation(r, x, y)
{
  return "r" + r + "t" + x + "," + y
}

function relocateTo(textObject, x, y, alpha)
{
  if(alpha === undefined)
    alpha = 1.0
  textObject.text.transform(translation(x, y)).attr({"fill-opacity":alpha})
  if(textObject.button !== undefined)
	  textObject.button.transform(translation(x, y))
	return textObject
}

function animateTo(textObject, x, y, speed, easing, callback, alpha)
{
  if(speed === undefined)
    speed = 1000
  if(easing === undefined)
    easing = "elastic"
  if(callback === undefined)
    callback = function() {}
  if(alpha === undefined)
    alpha = 1.0

  textObject.text.animate({transform:translation(x, y),"fill-opacity":alpha}, speed, easing, callback)
  if(textObject.button !== undefined)
	  textObject.button.animate({transform:translation(x, y)}, speed, easing)
	return textObject
}

function relocateElementTo(element, x, y)
{
  element.transform(translation(x, y))
}

function animateElementTo(element, x, y, speed, easing, callback)
{
  if(speed === undefined)
    speed = 1000
  if(easing === undefined)
    easing = "elastic"
  if(callback === undefined)
    callback = function() {}

  element.animate({transform:translation(x, y)}, speed, easing, callback)
}

function getStyle(s) {
  if(s == "l" || s == "U")
  	return "italic"
  else
  	return "bold"
}

function bell() {
	media.playSpecial("Bell", scheduler.time(), 1.0)
	//scheduler.schedule(media.boldKey("9"), 1.0, function() {}, scheduler.time())
}


function chapterHeading(obj) {
  relocateTo(obj, 0, 100, 0.01)
  animateTo(obj, paperWidth_2 - obj.bounds.width / 2, 100, 5000, "elastic")
}

function trademark(callback) {
  trademarkElement = addTextButton("The Composer", 16, "bold", callback)
  relocateTo(trademarkElement, 650, 550)
}

function checkBrowser() {
	if(!BrowserDetect.hasAudio) {
		clearPaper()
		if(BrowserDetect.browser != "Unknown" && BrowserDetect.browser !== undefined) {
			var outOfDate = addTextButton("Update your browser!", textSize, "italic")
			relocateTo(outOfDate, paperWidth_2 - outOfDate.bounds.width / 2, paperHeight_2)
		} else {
			var badBrowser = addTextButton("Get a better browser!", textSize, "italic")
			relocateTo(badBrowser, paperWidth_2 - badBrowser.bounds.width / 2, paperHeight_2)
		}
		return false
	}
	return true
}

function startMedia() {
	if(!checkBrowser())
		return
  document.onkeydown = function() {}
  media.progress = progress
  media.ready = function() {
    if(copyrightActive == true)
      setTimeout(tableOfContents, 20 * 1000)
    else
      tableOfContents()
  }
  media.initialize()
  scheduler.start()
}

////////////////////////////////////////////////////////////////////////////////

//passthrough wrap in:
/*
  function(data) { return function() {
    ...
  }}({
    foo:bar
  })
*/

////////////////////////////////////////////////////////////////////////////////

function splashScreen() {
  var b = BrowserDetect.browser
  //if(b == "Firefox" || b == "Chrome" || b == "Safari" || b == "Opera")
  //  return
  
  paper.clear()
  var p = paper.print(350, 250, "Coming soon!",
    paper.getFont("Minion", 0), 16)
  paper.path(p)
  
  var p = paper.print(335, 280, "(Check        out for now...)",
    paper.getFont("Minion", 500), 12)
  paper.path(p)
  
  var p = paper.print(335, 280, "             this",
    paper.getFont("Minion", 500), 12)
  paper.path(p)
  
  var bbox = p.getBBox()
  var p_underline = paper.path(Raphael.format("M{0},{1}L{2},{3}",
    bbox.x, bbox.y+bbox.height + 2, bbox.x+bbox.width, bbox.y+bbox.height + 2));
  p_underline.attr({"stroke-width":1,"stroke-linecap":"round"});
  p_underline.insertBefore(p)
  
  paper.rect(0, 0, 800, 600).attr(
    {stroke: "none", fill: "fff", "fill-opacity": .0}).click(
      function () {window.location='http://the.mposer.co/fornow'})

  trademark(startMedia)
}

function progress(x) {
  if(copyrightActive)
    return
	var slow_x = Math.pow(x, 2)
	var fast_x = 1 - Math.pow(1 - x, 2)

  var y = Math.floor(slow_x * 100)
  
  if(sceneProgress.progress !== undefined) {
  	sceneProgress.progress.remove()
  	sceneProgress.progress = undefined
  }
  if(sceneProgress.circle !== undefined) {
  	sceneProgress.circle.remove()
  	sceneProgress.circle = undefined
  }

  if(sceneProgress.init != true) {
  	paper.clear()
	  fullScreenButton()
	  trademark()
    if(BrowserDetect.browser == "Firefox" || BrowserDetect.browser == "Opera") {
      var ff = addTextButton("Support for this browser is experimental! Mileage may vary.", textSize, "italic")
      relocateTo(ff, paperWidth_2 - ff.bounds.width / 2, 550)
    }
  	sceneProgress.init = true
  }

  var cx = 400, cy = 300
  
  var p = paper.print(cx - 15, cy, y + "%", paper.getFont("Minion", 500), 16)
  p.attr({fill:"#000", "fill-opacity":(1 - slow_x)})
  
  var circle = paper.circle(cx, cy, (1 - slow_x) * (cy - 60) + 1);
  circle.attr({stroke:"#000", "stroke-opacity":fast_x})

  sceneProgress.progress = p
  sceneProgress.circle = circle
}

////////////////////////////////////////////////////////////////////////////////
//
//                             TABLE OF CONTENTS
//
////////////////////////////////////////////////////////////////////////////////

function tableOfContents(chapter) {
	clearKeyHandlers()
	clearRenderer()
	if(chapter !== undefined && performanceMode == true) {
		if(chapter == 1) {
			scene2design()
			return
		}
		else if(chapter == 2) {
			scene3design()
			return
		}
		else if(chapter == 3) {
			scene4design()
			return
		}
		else if(chapter == 4) {
			scene5design()
			return
		}
		else if(chapter == 5) {
			scene6design()
			return
		}
		else if(chapter == 6) {
			scene7design()
      return
		}
		else if(chapter == 7) {
			scene8design()
      return
		}
		else
			performanceMode = false;
	} else {
		performanceMode = false;
	}
  clearPaper(bio)
  toc = {}
  var headingSize = 16
  toc.forewordsubtitle = addTextButton("About this piece", textSize, "italic")
  toc.foreword = addTextButton("Foreword", headingSize, "regular",
    function(data) { return function() {
      sceneForeword()
    }}({
    })
  )
  toc.chapter1subtitle = addTextButton("In the beginning...", textSize, "italic")
  toc.chapter1 = addTextButton("Scene One", headingSize, "regular",
    function(data) { return function() {
      scene1design()
    }}({
    })
  )
  toc.chapter2subtitle = addTextButton("Eureka!", textSize, "italic")
  toc.chapter2 = addTextButton("Scene Two", headingSize, "regular",
    function(data) { return function() {
      scene2design()
    }}({
    })
  )
  toc.chapter3subtitle = addTextButton("Whether 'tis nobler in the mind to suffer...", textSize, "italic")
  toc.chapter3 = addTextButton("Scene Three", headingSize, "regular",
    function(data) { return function() {
      scene3design()
    }}({
    })
  )
  toc.chapter4subtitle = addTextButton("Common sense is worth more than cunning", textSize, "italic")
  toc.chapter4 = addTextButton("Scene Four", headingSize, "regular",
    function(data) { return function() {
      scene4design()
    }}({
    })
  )
  toc.chapter5subtitle = addTextButton("Zzzzzz...", textSize, "italic")
  toc.chapter5 = addTextButton("Scene Five", headingSize, "regular",
    function(data) { return function() {
      scene5design()
    }}({
    })
  )
  toc.chapter6subtitle = addTextButton("when an unstoppable force meets an impassable object...", textSize, "italic")
  toc.chapter6 = addTextButton("Scene Six", headingSize, "regular",
    function(data) { return function() {
      scene6design()
    }}({
    })
  )
  toc.chapter7subtitle = addTextButton("1...11...21...1211...111221...312211...", textSize, "italic")
  toc.chapter7 = addTextButton("Scene Seven", headingSize, "regular",
    function(data) { return function() {
      scene7design()
    }}({
    })
  )
  toc.chapter8subtitle = addTextButton("Reduce. Reuse. Recycle.", textSize, "italic")
  toc.chapter8 = addTextButton("Scene Eight", headingSize, "regular",
    function(data) { return function() {
      scene8design()
    }}({
    })
  )
  toc.afterwordsubtitle = addTextButton("\"About that piece...\"", textSize, "italic")
  toc.afterword = addTextButton("Afterword", headingSize, "regular",
    function(data) { return function() {
      sceneAfterword()
    }}({
    })
  )

  var contents = [toc.foreword, toc.chapter1, toc.chapter2, toc.chapter3, toc.chapter4,
    toc.chapter5, toc.chapter6, toc.chapter7, toc.chapter8, toc.afterword]
  var subtitles = [toc.forewordsubtitle, toc.chapter1subtitle, toc.chapter2subtitle,
  	toc.chapter3subtitle, toc.chapter4subtitle, toc.chapter5subtitle,
  	toc.chapter6subtitle, toc.chapter7subtitle, toc.chapter8subtitle,
  	toc.afterwordsubtitle]
  for(var i = 0; i < contents.length; i++) {
  	if(Math.random() < 0.5)
	    relocateTo(contents[i], -1000 + Math.random() * 500, 100 + i * 40)
	  else
	  	relocateTo(contents[i], 1000 + Math.random() * 500, 100 + i * 40)
  }

  for(var i = 0; i < subtitles.length; i++) {
  	if(Math.random() < 0.5)
	    relocateTo(subtitles[i], -1000 + Math.random() * 500, 100 + i * 40 + 18)
	  else
	  	relocateTo(subtitles[i], 1000 + Math.random() * 500, 100 + i * 40 + 18)
  }

  for(var i = 0; i < contents.length; i++)
    animateTo(contents[i], 200, 100 + i * 40, 2000)
  for(var i = 0; i < subtitles.length; i++)
    animateTo(subtitles[i], 220, 100 + i * 40 + 18, 2000)

  var perform = addTextButton("perform", textSize, "italic",
  	function() {
  		performanceMode = true
  		scene1design()
  	})
  relocateTo(perform, paperWidth_2 - perform.bounds.width / 2, 700)
  setTimeout(function(){animateTo(perform, paperWidth_2 - perform.bounds.width / 2, 500)}, 2000)
}

////////////////////////////////////////////////////////////////////////////////
//
//                                 SCENE 1
//
////////////////////////////////////////////////////////////////////////////////

function scene1keyassigned (key) {
	for(var i = 0; i < scene1.keyAssignment.length; i++) {
		if(scene1.keyAssignment[i].toLowerCase() == key.toLowerCase())
			return true
	}
	return false
}

function scene1keyindex (key) {
	for(var i = 0; i < scene1.keyAssignment.length; i++) {
		if(scene1.keyAssignment[i].toLowerCase() == key.toLowerCase())
			return i
	}
}

function scene1keydown(key) {
	if(scene1.design) {
		key = key.toLowerCase()
		var l = (key.charCodeAt(0) % 6) + 1

		if(scene1.keyAssignment[scene1.symbolAssignIndex] != key) {
			if(scene1keyassigned(key))
				return
			scene1.keyAssignment[scene1.symbolAssignIndex] = key
			if(scene1.assignment[scene1.symbolAssignIndex] !== undefined)
				scene1.assignment[scene1.symbolAssignIndex].text.remove()
			scene1.assignment[scene1.symbolAssignIndex] = addTextButton(key, textSize, "regular")
			scene1.volIndex = 0
			scene1designsymbols()
		}

		if(scene1.symbolAssignIndex < 6) {
			media.playSpecial("Knock" + (scene1.symbolAssignIndex + 1), scheduler.time(), Math.pow(2, -scene1.volIndex))
			scene1.playKey[scene1.symbolAssignIndex] = "Knock" + l
		}
		else if(scene1.symbolAssignIndex == 6) {
			media.play(media.boldKey("A"), scheduler.time(), 0.4, 0.3)
			scene1.playKey[scene1.symbolAssignIndex] = media.boldKey("A")
		}
		else {
			media.play(media.boldKey("9"), scheduler.time(), 0.4, 0.3)
			scene1.playKey[scene1.symbolAssignIndex] = media.boldKey("9")
		}

		scene1.volIndex = scene1.volIndex + 1
		if(scene1.volIndex == 4) {
			scene1.volIndex = 0
			scene1.symbolAssignIndex++
		}

		if(scene1.symbolAssignIndex == 8) {
			scene1.design = false
			scene1designstanza()
			scene1.directions.text.remove()
		}
	}
	else {
		var v = scene1.keys[0]
		if(v == key.toLowerCase()) {
			scene1.keys.shift()
			var ki = scene1keyindex(key)
			var t = scheduler.time()
			var elapsed = t - scene1.lastTime
			scene1.lastTime = t
			if(ki < 6) {
				media.playSpecial("Knock" + (ki + 1), t,
					Math.pow(2, -scene1.volIndex))
			} else if(ki == 6) {
				media.play(media.boldKey("A"), t, 1.0, 0.3)
			} else {
				media.play(media.boldKey("9"), t, 1.0, 0.3)
			}
			scene1.volIndex = (scene1.volIndex + 1) % 4
			if(scene1.keys.length == 0) {
				scene1.stanzaIndex++
				if(scene1.stanzaIndex == 4) {
					setTimeout(function() {
						bell()
						clearKeyHandlers()
						tableOfContents(1)
					}, elapsed * 1000)
					return
				}
				scene1designstanza()
			}
		}
	}
}

function scene1keyup(key) {
}

function scene1designsymbols() {
	var x = 0, y = 10
	if(!scene1.design)
		x = -300
	
	for(var i = 0; i < 8; i++) {
		relocateElementTo(scene1.symbol[i], 370 + x, y + 150 + i * textSpacing * 2)
		relocateTo(scene1.equals[i], 400 + x - scene1.equals[i].bounds.width / 2,
			y + 150 + i * textSpacing * 2)
	}

	for(var i = 0; i < scene1.assignment.length; i++) {
		relocateTo(scene1.assignment[i], 430 + x -
			scene1.equals[i].bounds.width / 2, y + 150 + i * textSpacing * 2)
	}
}

function scene1designstanza() {
	if(scene1.stanzaIndex > 0) {
		paper.clear()
		if(!performanceMode)
			trademark(tableOfContents)
	}
	scene1designsymbols()
	scene1.volIndex = 0
	for(var i = 0; i < 5; i++) {
		for(var j = 0; j < 8; j++) {
			var s = scene1.lines[scene1.stanzaIndex][i][j]
			var x = paperWidth_2 + (j / 7) * 300 - 150
			var y = paperHeight_2 + (i / 4) * 300 - 150
			var isWhite = (j % 2) == 1
			var offset = (isWhite ? 1 : 0)
			if(s == "u") {
				relocateElementTo(addUpTriangle(isWhite), x, y)
				for(k = 0; k < 4; k++)
					scene1.keys.push(scene1.keyAssignment[0 + offset])
			}
			else if(s == "d") {
				relocateElementTo(addDownTriangle(isWhite), x, y)
				for(k = 0; k < 4; k++)
					scene1.keys.push(scene1.keyAssignment[2 + offset])
			}
			else if(s == "s") {
				relocateElementTo(addSquare(isWhite), x, y)
				for(k = 0; k < 4; k++)
					scene1.keys.push(scene1.keyAssignment[4 + offset])
			}
			else if(s == "c") {
				relocateElementTo(addCircle(isWhite), x, y)
				for(k = 0; k < 4; k++)
					scene1.keys.push(scene1.keyAssignment[6 + offset])
			}
		}
	}
}

function scene1design() {
	paper.clear()
	if(!performanceMode)
		trademark(tableOfContents)

  scene1 = {}
  scene1.volIndex = 0

  scene1.directions = addTextButton(
  	"For each symbol, pick a key and play four times...", textSize, "regular")

  scene1.back = addTextButton(
  	"reset", textSize, "italic", function() {scene1design()})
  relocateTo(scene1.back, paperWidth_2 - scene1.back.bounds.width / 2, 500)


  relocateTo(scene1.directions, paperWidth_2 - scene1.directions.bounds.width / 2, 100)

  lines =
  [
  	[
	  	["u", "u", "u", "u", "u", "u", "u", "u"],
	  	["u", "d", "d", "u", "u", "d", "d", "u"],
	  	["u", "s", "s", "u", "u", "s", "s", "u"],
	  	["u", "c", "u", "c", "u", "d", "d", "u"],
	  	["u", "c", "u", "c", "c", "d", "d", "u"]
	  ],
  	[
	  	["d", "d", "d", "d", "d", "d", "d", "d"],
	  	["u", "d", "d", "u", "u", "d", "d", "u"],
	  	["u", "s", "s", "u", "c", "s", "c", "u"],
	  	["c", "c", "u", "u", "u", "d", "d", "u"],
	  	["u", "c", "u", "c", "c", "d", "d", "u"]
	  ],
  	[
	  	["s", "s", "s", "s", "s", "s", "s", "s"],
	  	["u", "d", "d", "u", "u", "c", "u", "c"],
	  	["c", "c", "s", "u", "u", "s", "s", "u"],
	  	["u", "c", "u", "c", "u", "d", "d", "u"],
	  	["u", "c", "u", "c", "c", "d", "d", "u"]
	  ],
  	[
	  	["u", "c", "u", "c", "u", "u", "u", "u"],
	  	["u", "d", "d", "u", "c", "d", "c", "u"],
	  	["u", "c", "s", "u", "u", "s", "s", "u"],
	  	["u", "c", "u", "c", "u", "d", "d", "u"],
	  	["u", "c", "u", "c", "u", "c", "d", "d"]
	  ]
  ]

  scene1.symbol = []
	scene1.symbol[0] = addUpTriangle(false)
	scene1.symbol[1] = addUpTriangle(true)
  scene1.symbol[2] = addDownTriangle(false)
  scene1.symbol[3] = addDownTriangle(true)
  scene1.symbol[4] = addSquare(false)
  scene1.symbol[5] = addSquare(true)
  scene1.symbol[6] = addCircle(false)
  scene1.symbol[7] = addCircle(true)

  scene1.equals = []
  for(var i = 0; i < 8; i++)
	  scene1.equals[i] = addTextButton("=", textSize, "regular")

	scene1.assignment = []
	scene1.keyAssignment = []
	scene1.design = true
	scene1.symbolAssignIndex = 0
	scene1.stanzaIndex = 0
	scene1.keys = []
	scene1.playKey = []
	scene1.lines = lines
	scene1designsymbols()

  setKeyHandlers(scene1keydown, scene1keyup)
}

////////////////////////////////////////////////////////////////////////////////
//
//                                 SCENE 2
//
////////////////////////////////////////////////////////////////////////////////

function scene2keydown(key) {
	if(key == 'shift') {
		scene2.keyBank = (scene2.keyBank + 1) % 3
		return
	}
	else if(key == ' ') {
		scene2.spacebar = true
		return
	}
	else if(key == '\n')
	{
		clearKeyHandlers()
		bell()
		scene2.timer = setInterval(function() {
			scene2ball()
			if(scene2.ballX > 1100) {
				clearInterval(scene2.timer)
				tableOfContents(2)
			}
		}, 50)
		return
	}
	else if(!media.isLetterKey(key))
		return
	var f
	var s
	var k = '' + key
	if(scene2.keyBank == 0) {
		f = media.upperKey
		s = "italic"
		k = k.toUpperCase()
	}
	else if(scene2.keyBank == 1) {
		f = media.lowerKey
		s = "italic"
		k = k.toLowerCase()
	}
	else {
		f = media.boldKey
		s = "bold"
		k = k.toUpperCase()
	}
  if(k.charCodeAt(0) >= 48 && k.charCodeAt(0) <= 57)
    s = "bold"
  if(scene2.keyGain[key.toLowerCase()] !== undefined && scene2.spacebar == true) {
    media.noteOff(scene2.keyGain[key.toLowerCase()])
    scene2.keyGain[key.toLowerCase()] = undefined
	}
  scene2.keyGain[key.toLowerCase()] = scheduler.schedule(f(key), 0.5, undefined,
    scheduler.time())
  var ang = scene2.previousAngle + (Math.random() - 0.5) * 3.141592654 * 2 * 0.25
  scene2.previousAngle = ang
  var cx = paperWidth_2
  var cy = 200
  var x = (scene2.previousX + (Math.cos(ang) * 30)) * 0.90 + (cx * 0.1)
  var y = (scene2.previousY + (Math.sin(ang) * 30)) * 0.90 + (cy * 0.1)

  var angleRadians = Math.atan2(y - cy, x - cx)
  var dist = Math.sqrt((y - cy) * (y - cy) + (x - cx) * (x - cx))

  var line = paper.path("M" + (scene2.previousX - cx) + "," + (scene2.previousY - cy) + "L" + (x - cx) + "," + (y - cy)).attr({"stroke":"#000", "stroke-opacity":0.3})
  scene2.ball.push(
  	[line, 0, 0]
  )
  var letter = addTextButton(k, textSize, s)

  var x2 = x - letter.bounds.width / 2
  //var angleRadians2 = Math.atan2(y - cy, x2 - cx)
  //var dist2 = Math.sqrt((y - cy) * (y - cy) + (x2 - cx) * (x2 - cx))
  scene2.ball.push([letter.text, x2 - cx, y - cy])
  relocateTo(letter, x2, y)
  line.transform(translation(cx, cy))
  scene2.previousX = x
  scene2.previousY = y
}

function scene2ball() {
	scene2.ballX += 30
	scene2.ballAngle += 0.3
	for(var i = 0; i < scene2.ball.length; i++) {
		var r = (scene2.ballAngle / 3.141592654 * 180)
		var x = scene2.ball[i][1]
		var y = scene2.ball[i][2]
		var t = "t" + (paperWidth_2 + scene2.ballX) + ",200" + "r" + r + ",0,0" + "t" + x + "," + y
		scene2.ball[i][0].transform(t)
	}
}

function scene2keyup(key) {
  if(scene2.keyGain[key.toLowerCase()] !== undefined && scene2.spacebar != true) {
    media.noteOff(scene2.keyGain[key.toLowerCase()])
    scene2.keyGain[key.toLowerCase()] = undefined
  }
  else if(key == ' ') {
  	scene2.spacebar = false
	  for(var key in scene2.keyGain) {
	    media.noteOff(scene2.keyGain[key.toLowerCase()])
	    scene2.keyGain[key.toLowerCase()] = undefined
	  }
  }
}

function scene2design() {
	paper.clear()
	if(!performanceMode) {
		clearKeyHandlers()
		trademark(tableOfContents)
	}
  var whiteKeys = paper.path(getWhiteKeySVG()).attr({stroke:"black", "stroke-width":1.0, fill:"none"})
  var blackKeys = paper.path(getBlackKeySVG()).attr({stroke:"none", fill:"#000"})
  var whiteText = paper.path(getWhiteTextSVG()).attr({stroke:"none", fill:"#000"})
  var blackText = paper.path(getBlackTextSVG()).attr({stroke:"none", fill:"#000"})
  whiteKeys.transform(translation(0, -70))
  blackKeys.transform(translation(0, -70))
  whiteText.transform(translation(0, -70))
  blackText.transform(translation(0, -70))
  scene2 = {}
  scene2.controls = addTextButton("shift case | space hold | return bell", textSize, "italic")
  relocateTo(scene2.controls, paperWidth_2 - scene2.controls.bounds.width / 2, 540)
  scene2.keyGain = {}
  scene2.keyBank = 0
  scene2.previousX = paperWidth_2
  scene2.previousY = 200
  scene2.previousAngle = 0.6
  scene2.ball = []
  scene2.ballX = 0
  scene2.ballAngle = 0
  setKeyHandlers(scene2keydown, scene2keyup)
}

////////////////////////////////////////////////////////////////////////////////
//
//                                 SCENE 3
//
////////////////////////////////////////////////////////////////////////////////

function scene3playword() {
	var w = scene3.words[scene3.currentWord]
	var keyFunc = media.lowerKey
	var vol = 0.4
	if(w == w.toUpperCase()) {
		keyFunc = media.boldKey
		vol = 0.5
	}
	var t = scheduler.time()
	for(var i = 0; i < w.length; i++) {
		scheduler.schedule(keyFunc(w[i]), vol, undefined, t, 0.3)
	}
	scene3.lastTime = t
}

function scene3keydown(key) {
	if(!media.isLetterKey(key))
		return

	scene3.word = scene3.word.replace(key.toLowerCase(), "")

	if(scene3.word == "") {
		//word is finished
		var timePoint = scene3.lastTime
		scene3playword()
		var noteLength
		if(timePoint !== undefined)
			noteLength = scene3.lastTime - timePoint
		scene3.currentWord++
		if(scene3.currentWord >= scene3.words.length) {
			scene3.currentLine++
			if(scene3.directions !== undefined) {
				scene3.directions.text.remove()
				scene3.directions = undefined
			}
			if(scene3.currentLine >= scene3.lines.length) {
				//piece is over
				clearKeyHandlers()
				setTimeout(function() {
					bell()
					paper.clear()
					var x = addTextButton("--that is the question.", textSize, "regular")
					relocateTo(x, paperWidth_2 - x.bounds.width / 2, paperHeight_2)
					setTimeout(function() {tableOfContents(3)}, 3000)
				}, noteLength * 1000)
				return
			}
			scene3text()
		}
		else {
			scene3.word = scene3.words[scene3.currentWord].toLowerCase()
			scene3.dot.attr({cx: scene3.pos[scene3.currentWord][0],
				cy: scene3.pos[scene3.currentWord][1]})
		}
	} else {
		//keep going...
	}
}

function scene3keyup(key) {
}

function scene3text() {
	var lineNumber = scene3.currentLine
	var top = scene3.lines[lineNumber][0]
	var bot = scene3.lines[lineNumber][1]

	while(scene3.textObjects.length > 0) {
		scene3.textObjects.pop().text.remove()
	}

	scene3.words = []
	scene3.pos = []
	scene3.currentWord = 0

	for(var i = 0; i < 8; i++) {
		var t = top[i]
		var b = bot[i]
		if(b !== null) {
			var bObj = addTextButton(b, textSize, "bold")
			scene3.textObjects.push(bObj)
			var x = (i * 2 + 0) / 16 * 300 - 150 - bObj.bounds.width / 2 +
				paperWidth_2
			var y = 300 + textSpacing
			relocateTo(bObj, x, y)
			scene3.words.push(b)
			scene3.pos.push([x + bObj.bounds.width / 2, y + textSpacing])
		}
		if(t !== null) {
			var tObj = addTextButton(t, textSize, "italic")
			scene3.textObjects.push(tObj)
			var x = (i * 2 + 1) / 16 * 300 - 150 - tObj.bounds.width / 2 +
				paperWidth_2
			var y = 300 - textSpacing
			relocateTo(tObj, x, y)
			scene3.words.push(t)
			scene3.pos.push([x + tObj.bounds.width / 2, y - textSpacing])
		}
	}
	scene3.word = scene3.words[0].toLowerCase()
	scene3.dot.attr({cx: scene3.pos[scene3.currentWord][0],
		cy: scene3.pos[scene3.currentWord][1]})
}

function scene3design() {
	paper.clear()
	if(!performanceMode) {
		clearKeyHandlers()
		trademark(tableOfContents)
	}
  var lines = [
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 [null, null, null, null, null, null, null, null]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", "TO", "TO", "TO", "TO"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 [null, null, null, null, "OR", "OR", "OR", "OR"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["OR", "OR", "OR", "OR", "NOT","NOT","NOT","NOT"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["NOT","NOT","NOT","NOT","NOT","NOT","NOT","NOT"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", null, null, null, null]
  	],

  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 [null, null, null, null, null, null, null, null]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", "TO", "TO", "TO", "TO"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 [null, null, null, null, "OR", "OR", "OR", "OR"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["NOT","NOT","NOT","NOT","NOR","NOR","NOR","NOR"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["NOR","NOR","NOR","NOR","NOR","NOR","NOR","NOR"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", null, null, null, null]
  	],

  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 [null, null, null, null, "TO", "TO", "TO", "TO"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", null, null, null, null]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["OR", "OR", "OR", "OR", "NOT","NOT","NOT","NOT"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["NOR","NOR","NOR","NOR","SO","SO","SO","SO"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["SO", "SO", "SO", "SO", "SO", "SO", "SO", "SO"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", null, null, null, null]
  	],

  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 [null, null, null, null, null, null, null, null]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["SO", "SO", "SO", "SO", "SO", "SO", "SO", "SO"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", null, null, null, null]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["OR", "OR", "OR", "OR", "NOT","NOT","NOT","NOT"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["NOT","NOT","NOT","NOT","NOT","NOT","NOT","NOT"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", null, null, null, null]
  	],

  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 [null, null, null, null, null, null, null, null]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["NOR", "SO", "OR", "SO", "OR", "SO", "OR", "SO"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["TO", "SO", "TO", "SO", "TO", "SO", "TO", "SO"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", null, null, null, null]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 ["OR", "OR", "OR", "OR", "NOT","NOT","NOT","NOT"]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", null],
  	 ["TO", "TO", "TO", "TO", null, null, null, null]
  	],
  	[
  			["be", "be", "be", "be", "be", "be", "be", "be"],
  	 [null, null, null, null, null, null, null, null]
  	]
  ]

  scene3 = {}
  scene3.lines = lines
  scene3.currentLine = 0
  scene3.textObjects = []
  scene3.words = []
  scene3.dot = paper.circle(0, 0, 3)
  scene3.dot.attr({stroke:"none", fill:"#000"})
  scene3.currentWord = 0
  scene3.directions = addTextButton("Type with letters together.", textSize, "regular")
  relocateTo(scene3.directions, paperWidth_2 - scene3.directions.bounds.width / 2, 400)
  setKeyHandlers(scene3keydown, scene3keyup)
  scene3text()
}

////////////////////////////////////////////////////////////////////////////////
//
//                                 SCENE 4
//
////////////////////////////////////////////////////////////////////////////////

function scene4playword(keyfunc) {
	if(scene4.word.length == 0)
		return
	scene4clearword()
	var t = scheduler.time()
	var sortedWord = []
	for(var i = 0; i < scene4.word.length; i++) {
		sortedWord.push(scene4.word[i])
	}
	sortedWord.sort()
	for(var i = 0; i < scene4.word.length; i++) {
		var l = scene4.lines[scene4.currentLine][1]
		var vol
		var offset = 0
		if(l == "narrator")
			vol = 0.1
		else if(l == "cat")
			vol = 0.5
		else if(l == "fox") {
			vol = 0.8
			offset = i * 0.02
		}
		scene4.active.push(scheduler.schedule(keyfunc(sortedWord[i]), vol, undefined, t + offset))
	}
	if(scene4.startTyping !== undefined) {
		scene4.startTyping.text.remove()
		scene4.startTyping = undefined
	}
	scene4.word = []
}

function scene4clearword() {
	while(scene4.active.length > 0) {
		media.noteOff(scene4.active.pop())
	}
}

function scene4keydown(key) {
	if(key == 'shift')
		scene4.keyBank = (scene4.keyBank + 1) % 3
	else if(!media.isLetterKey(key))
		return

	var line = scene4.lines[scene4.currentLine]
	var keyFunc = line[0]
	var placement = line[1]
	var style = line[2]
	var text = line[3]
	var c = scene4.currentCharacter
	if(text[c].toLowerCase() == key.toLowerCase()) {
		scene4.word.push(text[c])

		while(true) {
			scene4.currentCharacter++
			if(scene4.currentCharacter >= text.length) {
				//play word
				scene4playword(keyFunc)
				//new line
				scene4.currentCharacter = 0
				scene4.currentLine++
				if(scene4.currentLine == 1) {
					scene4.foxcat.animate({opacity:1.0}, 1500, "<")
				}
				if(scene4.currentLine == scene4.lines.length) {
					clearKeyHandlers()
					scene4clearword()
					setTimeout(bell, 700)
					setTimeout(function() {tableOfContents(4)}, 3000)
					return
				}
				scene4text(scene4.currentLine)
				break
			}
			else if(text[scene4.currentCharacter] == ' ' ||
				text[scene4.currentCharacter] == ',' ||
				text[scene4.currentCharacter] == '-') {
				//play word
				scene4playword(keyFunc)
				//advance character
			}
			else if(text[scene4.currentCharacter] == '?' ||
				text[scene4.currentCharacter] == '.' ||
				text[scene4.currentCharacter] == '!') {
				//play word
				scene4playword(keyFunc)
				scene4clearword() //punctuate sentence
				//advance character
			}
			else if(text[scene4.currentCharacter] == "'") {
				//advance character
			}
			else
				break
		}
	}
}

function scene4keyup(key) {
	if(!media.isLetterKey(key))
		return
  if(scene4.keyGain[key.toLowerCase()] !== undefined)
    media.noteOff(scene4.keyGain[key.toLowerCase()])
}

function scene4text(lineNumber) {
	var placement = scene4.lines[lineNumber][1]
	var x = 0, y = 0
	if(scene4.text !== undefined) {
		scene4.text.text.remove()
	}
	scene4.text = addTextButton(scene4.lines[lineNumber][3], textSize, scene4.lines[lineNumber][2])
	if(placement == "narrator") {
		y = 450
		x = paperWidth_2 - scene4.text.bounds.width / 2
	}
	else if(placement == "cat") {
		y = 210
		x = 425
	}
	else {
		y = 330 
		x = 475// - scene4.text.bounds.width
	}
	relocateTo(scene4.text, x, y)
}

function scene4design() {
	paper.clear()
	if(!performanceMode) {
		clearKeyHandlers()
		trademark(tableOfContents)
	}
	//drawGrid()
  
  var lines = [
	  [media.boldKey, "narrator", "bold", "THE FOX AND THE CAT"],
	  [media.whiteKey, "narrator", "italic", "It hap-pen-'d tha' the cat met the fox in a for-est,"],
		[media.whiteKey, "narrator", "italic", "and as she thoug' to her-self,"],
		[media.whiteKey, "narrator", "italic", "he is clev-er and fu'l of ex-peri-ence,"],
		[media.whiteKey, "narrator", "italic", "and much est-'em'd in the worl',"],
		[media.whiteKey, "narrator", "italic", "she spoke to him in a friend-ly way."],
		[media.whiteKey, "cat", "italic", "G'OD DAY, DEAR M-R FOX,"],
		[media.whiteKey, "cat", "italic", "HOW ARE YOU?"],
		[media.whiteKey, "cat", "italic", "HOW IS AL' WITH YOU?"],
		[media.whiteKey, "cat", "italic", "HOW ARE YOU GET-'ING ON"],
		[media.whiteKey, "cat", "italic", "IN THES' HARD TIMES?"],
		[media.whiteKey, "narrator", "italic", "The fox, ful' of al' kind' of a'-ro-gance,"],
		[media.whiteKey, "narrator", "italic", "look'd at the cat from head to foot"],
		[media.whiteKey, "narrator", "italic", "and for a long time did not know"],
		[media.whiteKey, "narrator", "italic", "whe-ther he would give an an-swer or not."],
		[media.whiteKey, "narrator", "italic", "At last he said,"],
		[media.boldKey, "fox", "bold", "OH, YOU WRETCH-ED BEARD-CLEAN-ER"],
		[media.boldKey, "fox", "bold", "YOU PIE-BALD F'OL"],
		[media.boldKey, "fox", "bold", "YOU HUN-GRY MOUSE-HUNT'R"],
		[media.boldKey, "fox", "bold", "WHAT CAN YOU BE THINK-IN' OF?"],
		[media.boldKey, "fox", "bold", "HAVE YOU THE CHEEK TO ASK"],
		[media.boldKey, "fox", "bold", "HOW I AM GET-TIN' ON?"],
		[media.boldKey, "fox", "bold", "WHAT HAVE YOU LEARNT"],
		[media.boldKey, "fox", "bold", "HOW MANY ARTS DO YOU UN-DER-STAN'?"],
		[media.whiteKey, "cat", "italic", "I UN-DER-STAND BUT ONE"],
		[media.whiteKey, "narrator", "italic", "re-pli-ed the cat, mo-dest-ly."],
		[media.boldKey, "fox", "bold", "WH'T ART IS THA'?"],
		[media.whiteKey, "narrator", "italic", "ask-ed the fox"],
		[media.whiteKey, "cat", "italic", "WHEN THE HOU-NDS ARE FOL-'OW-IN' ME,"],
		[media.whiteKey, "cat", "italic", "I CAN SPRING IN-TO A TRE'"],
		[media.whiteKey, "cat", "italic", "AND SAVE MY-SELF"],
		[media.boldKey, "fox", "bold", "IS THA' AL'?"],
		[media.whiteKey, "narrator", "italic", "said the fox."],
		[media.boldKey, "fox", "bold", "I AM MAS-TER OF A HUN-'RED ARTS"],
		[media.boldKey, "fox", "bold", "AND HAVE IN-TO THE BAR-GA'N"],
		[media.boldKey, "fox", "bold", "A SACK-FUL OF CUN-'ING"],
		[media.boldKey, "fox", "bold", "YOU MAKE ME SO'-RY FOR YOU"],
		[media.boldKey, "fox", "bold", "COME WITH ME,"],
		[media.boldKey, "fox", "bold", "I WILL TEACH YOU HOW PEO-PL'"],
		[media.boldKey, "fox", "bold", "GET A-WAY FROM THE HOU-NDS"],
		[media.whiteKey, "narrator", "italic", "Just then came a hun-ter with"],
		[media.boldKey, "narrator", "bold", "4"],
		[media.whiteKey, "narrator", "italic", "dogs."],
		[media.whiteKey, "narrator", "italic", "The cat spran' nim-bly up a tre',"],
		[media.whiteKey, "narrator", "italic", "and sat down on top of it,"],
		[media.whiteKey, "narrator", "italic", "wher' the bran-ches and fol-iage"],
		[media.whiteKey, "narrator", "italic", "quite con-ceal'd her"],
		[media.whiteKey, "cat", "italic", "OP-EN YOUR SACK, M-R FOX!"],
		[media.whiteKey, "cat", "italic", "OP-EN YOUR SACK!"],
		[media.whiteKey, "narrator", "italic", "cri-ed the cat to him,"],
		[media.whiteKey, "narrator", "italic", "but the dogs had al-rea-dy seiz'd him,"],
		[media.whiteKey, "narrator", "italic", "and were hold-ing him fast."],
		[media.whiteKey, "cat", "italic", "AH, M-R FOX,"],
		[media.whiteKey, "narrator", "italic", "cri-ed the cat."],
		[media.whiteKey, "cat", "italic", "YOU WITH YOUR HUN-'RED ARTS"],
		[media.whiteKey, "cat", "italic", "ARE LEFT IN THE LURCH"],
		[media.whiteKey, "cat", "italic", "HAD YOU BEEN AB-LE TO CLIMB LIKE ME,"],
		[media.whiteKey, "cat", "italic", "YOU WOULD NOT HAVE LOST YOUR LIFE!"],
  ]

  scene4 = {}
  var img_w = 365, img_h = 508
  img_w *= 0.5
  img_h *= 0.5
  scene4.foxcat = paper.image("media/jpg/scene4.jpg", paperWidth_2 - img_w / 2,
    paperHeight_2 - img_h / 2, img_w, img_h)
  scene4.foxcat.attr({opacity:0.0})
  scene4.keyGain = {}
  scene4.keyBank = 0
  scene4.lines = lines
  scene4.currentLine = 0
  scene4.currentCharacter = 0
  scene4.word = []
  scene4.active = []
  scene4.startTyping = addTextButton("Start typing.", textSize, "regular")
  relocateTo(scene4.startTyping,
  	paperWidth_2 - scene4.startTyping.bounds.width / 2, 300)
  setKeyHandlers(scene4keydown, scene4keyup)
  scene4text(scene4.currentLine)
}

////////////////////////////////////////////////////////////////////////////////
//
//                                 SCENE 5
//
////////////////////////////////////////////////////////////////////////////////

function scene5style(s) {
	if(s == null || s == undefined)
		return "regular"
	if(s[0] == "*")
		return "bold"
	else
		return "italic"
}

function scene5letters(s) {
	if(s == null || s == undefined)
		return ""
	return s.replace("*", "")
}

function scene5range(s) {
	if(s == null || s == undefined)
		return []
	var x = []

	var l = scene5letters(s)

	var low, high
	if(scene5style(s) == "bold") {
		low = media.boldKey(l[0])
		high = low
		if(l.length == 3)
			high = media.boldKey(l[2])
	} else {
		low = media.whiteKey(l[0])
		high = low
		if(l.length == 3)
			high = media.whiteKey(l[2])
	}

	for(var i = low; i <= high; i++) {
		x.push(i)
	}

	return x
}

function scene5schedulenext() {
	if(scene5.end == true)
		return
	var speed = 0.35
	if(scene5.line >= scene5.text.length) {
		scene5.end = true
		setTimeout(function() {
			bell()
			tableOfContents(5)
		}, speed * 1000)
		return
	}

	var word1 = scene5.text[scene5.line][0][scene5.word]
	var word2 = scene5.text[scene5.line][1][scene5.word]
	var vol = scene5.text[scene5.line][2][scene5.word]

	var range1 = scene5range(word1)
	var range2 = scene5range(word2)

	scene5.time += speed
	var setCallback = false
	for(var i = 0; i < range1.length; i++) {
		if(setCallback != true) {
			setCallback = true
			scheduler.schedule(range1[i], vol / 11,function(data) { return function() {
				if(data.wordIndex == 0) {
					for(var i = 0; i < scene5.displayed.length; i++) {
						scene5.displayed[i].text.remove()
					}
					scene5.displayed = []
				}
				var w1 = addTextButton(scene5letters(data.word1), 8 + data.vol * 30, scene5style(data.word1))
				var w2 = addTextButton(scene5letters(data.word2), 8 + data.vol * 30, scene5style(data.word2))
				scene5.displayed.push(w1)
				scene5.displayed.push(w2)
				relocateTo(w1, 100 + 50 * data.wordIndex - w1.bounds.width / 2, paperHeight_2 - textSpacing)
				relocateTo(w2, 100 + 50 * data.wordIndex - w2.bounds.width / 2, paperHeight_2 + textSpacing)

				scene5schedulenext()
			}}({
		    word1:word1,
		    word2:word2,
		    wordIndex:scene5.word,
		    vol:(vol / 11)
		  }), scene5.time, 0.2)
		}
		else {
			scheduler.schedule(range1[i], vol / 11, undefined, scene5.time, 0.2)			
		}
	}
	for(var i = 0; i < range2.length; i++) {
		if(setCallback != true) {
			setCallback = true
			scheduler.schedule(range2[i], vol / 11,
			function(data) { return function() {
				if(data.wordIndex == 0) {
					for(var i = 0; i < scene5.displayed.length; i++) {
						scene5.displayed[i].text.remove()
					}
					scene5.displayed = []
				}
				var w1 = addTextButton(scene5letters(data.word1), 8 + data.vol * 30, scene5style(data.word1))
				var w2 = addTextButton(scene5letters(data.word2), 8 + data.vol * 30, scene5style(data.word2))
				scene5.displayed.push(w1)
				scene5.displayed.push(w2)
				relocateTo(w1, 100 + 50 * data.wordIndex - w1.bounds.width / 2, paperHeight_2 - textSpacing)
				relocateTo(w2, 100 + 50 * data.wordIndex - w2.bounds.width / 2, paperHeight_2 + textSpacing)

				scene5schedulenext()
			}}({
		    word1:word1,
		    word2:word2,
		    wordIndex:scene5.word,
		    vol:(vol / 11)
		  }), scene5.time, 0.2)
		}
		else
			scheduler.schedule(range2[i], vol / 11, undefined, scene5.time, 0.2)
	}
	if(!setCallback)
		setTimeout(scene5schedulenext, speed * 1000)

	scene5.word++
	if(scene5.word >= scene5.text[scene5.line][0].length) {
		//new line
		scene5.word = 0
		scene5.line++
	}
}

function scene5design() {
  paper.clear();

  scene5 = {}
  scene5.line = 0
  scene5.word = 0
  scene5.time = scheduler.time()
  scene5.displayed = []
  scene5.text = 
  [
  	[
  		[null , null,  null, null,   null, null,  null, null,  null, null,   null, null],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[   11,   10,     9,    8,      7,    6,     5,    4,     3,    2,      1,    0]
	  ],


  	[
  		[  "z",  "z",   "z",  "z",    "z",  "z",   "z",  "z",   "z",  "z",    "z",  "z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    0,    1,     2,    3,      4,    5,     6,    7,     8,    9,     10,   11]
	  ],
  	[
  		[  "z", null,  null, null,   null, null,  null, null,  null, null,   null,  "Z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[   11,   10,     9,    8,      7,    6,     5,    4,     3,    2,      1,    0]
	  ],
  	[
  		[ null,  "Z",  null,  "Z",   null,  "Z",  null,  "Z",  null,  "Z",   null, null],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    0,    0,     0,    0,      0,    0,     0,    0,     0,    0,      0,    0]
	  ],
  	[
  		[ "*Z", "*Z",  "*Z", null,   "*Z", "*Z","*2-4", "*Z",  "*Z", "*Z",   null, "*Z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    0,    2,     4,    6,      8,   11,    11,   11,    11,   11,     11,   11]
	  ],
  	[
  		["*2-4", "*Z",  "*Z", "*Z",   "*Z", "*Z","*2-4", null,  "*Z", null,   null, null],
	  	[ "A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[   11,    11,    11,   11,     11,   11,    10,    8,     6,    4,      2,    0]
	  ],
  	[
  		[ null, null, "a-e", null, "*V-Z", null, "v-z", null, "a-e", null, "*V-Z", null],
	  	["A-E", null, "V-Z", null, "*A-E", null, "A-E", null, "V-Z", null, "*A-E", null],
	  	[   0,    0,    4,      4,      8,    8,    12,   12,    0,     0,      8,    8]
	  ],
  	[
  		["v-z",  "z",   "z", null,  "a-e", null, "v-z",  "z",   "z", null,  "a-e", null],
	  	["A-E", null, "V-Z", null, "*A-E",  "A", "A-E", null, "V-Z", null, "*A-E",  "A"],
	  	[   12,    8,    4,     4,      4,    4,    12,    8,    4,     4,      4,    4]
	  ],


  	[
  		[ "*Z", "*Z",  "*Z", null,   "*Z", "*Z","*0-4", "*Z",  "*Z", "*Z",   null, "*Z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    8,    8,     8,    8,      8,   10,    11,    8,     8,    8,      8,    8]
	  ],
  	[
  		["*0-4", "*Z",  "*Z", "*Z",   "*Z", "*Z","*0-4", null,  "*Z", null,   null, null],
	  	[ "A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[     8,    8,     8,    8,      8,   10,    11,    8,     8,    8,     10,   10]
	  ],
  	[
  		["v-z",  "z",   "z", "a-e",    "a", null, "v-z",  "z",   "z", "a-e",    "a", "Z"],
	  	["A-E", null, "V-Z",  null, "*A-E",  "A", "A-E", null, "V-Z",  null, "*A-E", "A"],
	  	[   12,    8,     8,    8,       8,    8,    12,    8,     8,     8,      8,   8]
	  ],
  	[
  		[ null,  "Z",  null,  "Z",   null,  "Z",  null,  "Z",  null,  "Z",   null, null],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    0,    0,     0,    0,      0,    0,     0,    0,     0,    0,      0,    0]
	  ],
  	[
  		[ "*Z", "*Z",  "*Z", null,   "*Z", "*Z",  "*0", "*Z",  "*Z", "*Z",   "*Z", "*Z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    4,    4,     4,    4,      4,    4,     8,    4,     4,    4,      4,    4]
	  ],
  	[
  		["*0-9", "*Z",  "*Z", "*Z",   null, "*Z","*0-9", null,  "*Z", null,   null, null],
	  	[ "A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[   11,     8,     8,    8,     10,   10,    11,    8,     8,    4,      4,    4]
	  ],
  	[
  		[null , null,   null, null,  null, null,  null, null,  null, null],
	  	["L-P", null, "*L-P", null, "l-p", null, "L-P", null,"*L-P", null],
	  	[   0,     0,      0,    0,     0,    0,     0,    0,     0,    0]
	  ],

//////////


  	[
  		[  "z",  "z",   "z",  "z",    "z",  "z",   "z",  "z",   "z",  "z",    "z",  "z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    0,    1,     2,    3,      4,    5,     6,    7,     8,    9,     10,   11]
	  ],
  	[
  		[  "z", null,  null, null,   null, null,  null, null,  null, null,   null,  "Z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[   11,   10,     9,    8,      7,    6,     5,    4,     3,    2,      1,    0]
	  ],
  	[
  		[ null,  "Z",  null,  "Z",   null,  "Z",  null,  "Z",  null,  "Z",   null, null],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    0,    0,     0,    0,      0,    0,     0,    0,     0,    0,      0,    0]
	  ],
  	[
  		[ "*Z", "*Z",  "*Z", null,   "*Z", "*Z","*2-4", "*Z",  "*Z", "*Z",   null, "*Z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    0,    2,     4,    6,      8,   11,    11,   11,    11,   11,     11,   11]
	  ],
  	[
  		["*2-4", "*Z",  "*Z", "*Z",   "*Z", "*Z","*2-4", null,  "*Z", null,   null, null],
	  	[ "A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[   11,    11,    11,   11,     11,   11,    10,    8,     6,    4,      2,    0]
	  ],
  	[
  		[ null, null, "a-e", null, "*V-Z", null, "v-z", null, "a-e", null, "*V-Z", null],
	  	["A-E", null, "V-Z", null, "*A-E", null, "A-E", null, "V-Z", null, "*A-E", null],
	  	[   0,    0,    4,      4,      8,    8,    12,   12,    0,     0,      8,    8]
	  ],
  	[
  		["v-z",  "z",   "z", null,  "a-e", null, "v-z",  "z",   "z", null,  "a-e", null],
	  	["A-E", null, "V-Z", null, "*A-E",  "A", "A-E", null, "V-Z", null, "*A-E",  "A"],
	  	[   12,    8,    4,     4,      4,    4,    12,    8,    4,     4,      4,    4]
	  ],


  	[
  		[ "*Z", "*Z",  "*Z", null,   "*Z", "*Z","*0-4", "*Z",  "*Z", "*Z",   null, "*Z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    8,    8,     8,    8,      8,   10,    11,    8,     8,    8,      8,    8]
	  ],
  	[
  		["*0-4", "*Z",  "*Z", "*Z",   "*Z", "*Z","*0-4", null,  "*Z", null,   null, null],
	  	[ "A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[     8,    8,     8,    8,      8,   10,    11,    8,     8,    8,     10,   10]
	  ],
  	[
  		["v-z",  "z",   "z", "a-e",    "a", null, "v-z",  "z",   "z", "a-e",    "a", "Z"],
	  	["A-E", null, "V-Z",  null, "*A-E",  "A", "A-E", null, "V-Z",  null, "*A-E", "A"],
	  	[   12,    8,     8,    8,       8,    8,    12,    8,     8,     8,      8,   8]
	  ],
  	[
  		[ null,  "Z",  null,  "Z",   null,  "Z",  null,  "Z",  null,  "Z",   null, null],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    0,    0,     0,    0,      0,    0,     0,    0,     0,    0,      0,    0]
	  ],
  	[
  		[ "*Z", "*Z",  "*Z", null,   "*Z", "*Z",  "*0", "*Z",  "*Z", "*Z",   "*Z", "*Z"],
	  	["A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[    4,    4,     4,    4,      4,    4,     8,    4,     4,    4,      4,    4]
	  ],
  	[
  		["*0-9", "*Z",  "*Z", "*Z",   null, "*Z","*0-9", null,  "*Z", null,   null, null],
	  	[ "A-E", null, "a-e", null, "*A-E", null, "A-E", null, "a-e", null, "*A-E", null],
	  	[   11,     8,     8,    8,     10,   10,    11,    8,     8,    4,      4,    4]
	  ],
  	[
  		[null , null,   null, null,  null, null,  null, null,   null, null],
	  	["L-P", null, "*L-P", null, "l-p", null, "L-P", null, "*L-P", null],
	  	[   0,     0,      0,    0,     0,    0,     0,    0,      0,    0]
	  ]
  ]

	if(!performanceMode) {
		clearKeyHandlers()
		clearRenderer()
		trademark(function() {
				scene5.end = true
				tableOfContents()
			}
		)
	}
  scene5schedulenext()
}

////////////////////////////////////////////////////////////////////////////////
//
//                                 SCENE 6
//
////////////////////////////////////////////////////////////////////////////////

function scene6DrawCircleText(elements, gradian, alpha, radius) {
	if(alpha < 0)
		alpha = 0
	if(alpha > 1)
		alpha = 1
	for(var i = 0; i < elements.length; i++) {
		var angle = (i / elements.length + gradian) * twoPi
		var cx = Math.cos(angle) * radius
		var cy = Math.sin(angle) * radius
		relocateTo(elements[i], paperWidth_2 + cx, paperHeight_2 + cy, alpha*scene6.fadein)
	}
	relocateElementTo(scene6.arrow, paperWidth_2 + 0, paperHeight_2 - radius - 10)
	scene6.arrow.attr({"fill-opacity":(alpha*scene6.fadein)})
}

function scene6render() {
	scene6.fadein += 0.03
	if(scene6.fadein > 1)
		scene6.fadein = 1
	var currentTime = scheduler.time()
	var elapsedTime = currentTime - scene6.previousTime

	//Sanity check for elapsed time.
	if(elapsedTime <= 0.01)
		elapsedTime = 0.01
	else if(elapsedTime > 0.2)
		elapsedTime = 0.2

	scene6.part1progress = (scene6.progress - 0.5) * 2.0
	if(scene6.part1progress < 0)
		scene6.part1progress = 0
	scene6.part2progress = (scene6.progress - 0.75) * 4.0
	if(scene6.part2progress < 0)
		scene6.part2progress = 0
	scene6.noteDuration = 0.5 + Math.pow(scene6.part1progress, 2) * 0.5
	var delta = elapsedTime / scene6.noteDuration / scene6.circleText.length * -1
	scene6.angle += delta
	while(scene6.angle < 0)
		scene6.angle += 1
	while(scene6.angle >= 1)
		scene6.angle -= 1
	scene6DrawCircleText(scene6.circleText, scene6.angle,
		scene6.progress * 1.00 + 0.0, scene6.part1progress * 100 + 100)
	trademarkElement.text.attr({"fill-opacity":(scene6.progress*scene6.fadein)})
	if(trademarkElement.button !== undefined)
		trademarkElement.button.attr({"fill-opacity":(scene6.progress*buttonOpacity*scene6.fadein)})
	for(var i = 0; i < 3; i++) {
		scene6.force[i].text.attr({"fill-opacity":(scene6.part2progress*scene6.fadein)})
	}
	scene6.previousTime = currentTime
	var circlePosition = Math.floor(
		((-scene6.angle + 1.75 + 0.5 / scene6.circleText.length) % 1) *
		scene6.circleText.length)
	var circlePosition2 = Math.floor(
		((-scene6.angle + 1.75) % 1) * scene6.circleText.length)
	var newLetters = scene6.letters[circlePosition]
	var newLetters2 = scene6.letters[circlePosition2]
	if(scene6.currentLetters != newLetters) {
		if(!scene6.playedNoteAlready && !scene6.win)
			scene6mistake()
		scene6.playedNoteAlready = false
		scene6.currentLetters = newLetters
		scene6.currentCase = scene6.casing[circlePosition]
	}
	if(scene6.currentLetters2 != newLetters2) {
		scene6.currentLetters2 = newLetters2
		if(scene6.win) {
			scene6keydown(scene6.currentLetters[0].toLowerCase())
			if(scene6.progress == 0) {
				if(scene6.currentLetters2 == "4/E")
					scene6.aroundCount++
				if(scene6.aroundCount == 2) {
					relocateTo(scene6.donotclick[0], paperWidth_2 - scene6.donotclick[0].bounds.width / 2, paperHeight_2 - 36)
					relocateTo(scene6.donotclick[1], paperWidth_2 - scene6.donotclick[1].bounds.width / 2, paperHeight_2)
					relocateTo(scene6.donotclick[2], paperWidth_2 - scene6.donotclick[2].bounds.width / 2, paperHeight_2 + 36)
					scene6stopsign()
				}
			}
		}
	}
	if(scene6.mistake > 0 && !scene6.win) {
		scene6.mistake--
		if(scene6.progress < 0.5)
			scene6.progress = 0.5
		scene6.progress += 0.002
		if(scene6.progress > 1)
			scene6.progress = 1
	}
	if(scene6.corrects > 0) {
		scene6.corrects--
		scene6.progress -= 0.001
		if(scene6.progress < 0)
			scene6.progress = 0
		if(scene6.progress < 0.20 && !scene6.win) {
			scene6.win = true
			clearKeyHandlers()
			scene6.aroundCount = 0
		}
	}
}

function scene6stopsign() {
	var s = paper.path("M 309.75,82.062498 C 267.1875,124.625 224.625,167.1875 182.0625,209.75 c 0,60.17708 0,120.35417 0,180.53125 42.5625,42.55208 85.125,85.10417 127.6875,127.65625 60.17708,0 120.35417,0 180.53125,0 42.55208,-42.55208 85.10417,-85.10417 127.65625,-127.65625 0,-60.17708 0,-120.35417 0,-180.53125 -42.55208,-42.5625 -85.10417,-85.125 -127.65625,-127.687502 -60.17708,0 -120.35417,0 -180.53125,0 z m 3.4375,8.375 c 57.875,0 115.75,0 173.625,0 40.91667,40.916672 81.83333,81.833332 122.75,122.750002 0,57.875 0,115.75 0,173.625 -40.91667,40.91667 -81.83333,81.83333 -122.75,122.75 -57.875,0 -115.75,0 -173.625,0 -40.91667,-40.91667 -81.83333,-81.83333 -122.75,-122.75 0,-57.875 0,-115.75 0,-173.625 40.91667,-40.91667 81.83333,-81.83333 122.75,-122.750002 z m 3.0625,7.28125 C 276.73958,137.22917 237.22917,176.73958 197.71875,216.25 c 0,55.85417 0,111.70833 0,167.5625 39.51042,39.48958 79.02083,78.97917 118.53125,118.46875 55.85417,0 111.70833,0 167.5625,0 39.48958,-39.48958 78.97917,-78.97917 118.46875,-118.46875 0,-55.85417 0,-111.70833 0,-167.5625 -39.48958,-39.51042 -78.97917,-79.02083 -118.46875,-118.531252 -55.85417,0 -111.70833,0 -167.5625,0 z m 1.28125,3.156252 c 54.97917,0 109.95833,0 164.9375,0 38.89583,38.88542 77.79167,77.77083 116.6875,116.65625 0,54.97917 0,109.95833 0,164.9375 -38.89583,38.89583 -77.79167,77.79167 -116.6875,116.6875 -54.97917,0 -109.95833,0 -164.9375,0 -38.88542,-38.89583 -77.77083,-77.79167 -116.65625,-116.6875 0,-54.97917 0,-109.95833 0,-164.9375 38.88542,-38.88542 77.77083,-77.77083 116.65625,-116.65625 z")
	s.attr({stroke:"none", fill:"#000"})
}

function scene6mistake() {
	scene6.mistake = 40
}

function scene6keydown(key) {
	if(scene6.currentLetters.toLowerCase().indexOf(key.toLowerCase()) != -1 &&
		!scene6.playedNoteAlready) {
		//the correct key was pressed
		var t
		if(scene6.currentCase == "B")
			t = media.boldKey
		else if(scene6.currentCase == "l")
			t = media.lowerKey
		else if(scene6.currentCase == "U")
			t = media.upperKey

		var l = scene6.currentLetters
		for(var i = 0; i < l.length; i++) {
			if(l[i] == "/")
				continue
			var loudness = scene6.progress * 0.95 + 0.05
			if(scene6.progress == 0 && Math.random() < (1 / 17))
				loudness = 0.5
			scheduler.schedule(t(l[i]), loudness, function() {}, scheduler.time())
		}
		scene6.corrects += 5
		
		scene6.playedNoteAlready = true
	}
	else if(!scene6.playedNoteAlready) {
		scene6mistake()
	}
}

function scene6keyup(key) {
}

function scene6finish() {
	paper.clear()
	clearKeyHandlers()
	clearRenderer()
	var hmph = addTextButton("Hmph!", textSize, "regular")
	relocateTo(hmph, paperWidth_2 - hmph.bounds.width / 2, paperHeight_2)
	bell()
	setTimeout(function() {tableOfContents(6)}, 5000)
}

function scene6design() {
	paper.clear()
	if(!performanceMode) {
		clearKeyHandlers()
		clearRenderer()
		trademark(tableOfContents)
	}
	var letters = ["d", "b", "N", "a", "V", "P", "i", "h", "T", "M", "W", "Z",
		"t", "C", "f", "k", "o", "4/E"]
	var casing =  ["l", "l", "B", "l", "B", "U", "l", "l", "B", "U", "B", "U",
	  "l", "B", "l", "l", "l", "B"]
	scene6 = {}
	scene6.circleText = []
	scene6.letters = letters
	scene6.casing = casing
	for(var i = 0; i < letters.length; i++) {
		scene6.circleText[i] = addTextButton(letters[i], 18, getStyle(casing[i]))
	}
	scene6.donotclick = []
	scene6.donotclick[0] = addTextButton("Do not click", textSize, "regular")
	scene6.donotclick[1] = addTextButton("THE IMPASSE", textSize, "regular", scene6finish)
	scene6.donotclick[2] = addTextButton("under any circumstance", textSize, "regular")
	for(var i = 0; i < scene6.donotclick.length; i++) {
		relocateTo(scene6.donotclick[i], 0, -100)
	}

	scene6.force = []
	scene6.force[0] = addTextButton("Pick any starting point and", textSize, "regular")
	scene6.force[1] = addTextButton("THE FORCE", textSize, "regular")
	scene6.force[2] = addTextButton("play clockwise quietly", textSize, "regular")
	relocateTo(scene6.force[0], paperWidth_2 - scene6.force[0].bounds.width / 2, paperHeight_2 - 36)
	relocateTo(scene6.force[1], paperWidth_2 - scene6.force[1].bounds.width / 2, paperHeight_2)
	relocateTo(scene6.force[2], paperWidth_2 - scene6.force[2].bounds.width / 2, paperHeight_2 + 36)

	scene6.arrow = paper.path("M0,0L10,-10L-10,-10").attr({stroke:"none", fill:"#000"})
	scene6.angle = Math.random()
	scene6.noteDuration = 1.0
	scene6.previousTime = scheduler.time()
	scene6.notesPlayed = 0
	scene6.lastNoteTime = 0
	scene6.totalNoteTime = 0
	scene6.mistake = 0
	scene6.corrects = 0
	scene6.currentLetters = ""
	scene6.currentLetters2 = ""
	scene6.currentCase = ""
	scene6.playedNoteAlready = false
	scene6.win = false
	scene6.progress = 1
	scene6.fadein = 0
	setKeyHandlers(scene6keydown, scene6keyup)
	setRenderer(scene6render) 
}

////////////////////////////////////////////////////////////////////////////////
//
//                                 SCENE 7
//
////////////////////////////////////////////////////////////////////////////////

function scene7keydown(key) {
	var word = scene7.text[scene7.word]
	var exiting = false
	if((key == "a" || key == "A")) {
		if(word != "A")
			exiting = true
	} else {
		if(word == "A")
			exiting = true
	}

	if(scene7.word == 0) {
		var scene7oldvol = scene7.volume
		scene7.volume = (scene7.volume + (1 / 15) * 0.99) % 1
		scene7.vol = scene7.volume
		if(scene7.volume < scene7oldvol)
			exiting = true
	}

	for(var i = 0; i < scene7.active.length; i++) {
		media.noteOff(scene7.active[i])
	}

	scene7.active = []

	if(exiting) {
    bell()
    clearKeyHandlers()
    setTimeout(function() {
      tableOfContents(7)
    }, 5000)
		return
	}

	for(var i = 0; i < word.length; i++) {
		var wordlen = 0.1 + scene7.volume * 0.7
		if(word == "A")
			wordlen = 0.35
		scene7.active.push(scheduler.schedule(
			media.whiteKey(word[i]), scene7.vol, undefined,
			scheduler.time(), wordlen))
	}

	if(word == "A")
		scene7.vol = scene7.volume
	else {
		scene7.vol += (0.1) * (1.0 - scene7.volume * 0.7)
		if(scene7.vol > 1)
			scene7.vol = 1
	}

	scene7.word = (scene7.word + 1) % scene7.text.length

	if(word == "A" || word == "that") {
		scene7.lineFrames += 10
	}
}

function scene7render() {
	for(var i = 0; i < scene7.lines.length; i++) {
		var x = paperWidth_2 - scene7.lines[i].bounds.width / 2
		var dy = (((i - scene7.line + 3) + 7) % 7) - 3
		var y = paperHeight_2 + dy * 50
		var alpha = 1.0 - Math.abs(dy) / 2
		if(alpha < 0)
			alpha = 0

		if(scene7.actualLine < 95 + 7) {
			if(scene7.line > 6 && i == 6) {
				x -= (scene7.line % 1) * scene7.lines[i].bounds.width / 2 + 15
			} else if(scene7.line < 1 && i == 6) {
				x -= scene7.lines[i].bounds.width / 2 + 15
				y += (scene7.line % 1) * 50
			} else if(scene7.line < 2 && i == 6) {
				x -= scene7.lines[i].bounds.width / 2 + 15
				y += 50
			}
		}

		if(scene7.actualLine < 2 && i >= 5)
			alpha = 0
		if(scene7.actualLine > (95 + 7) && i < 2)
			alpha = 0

		relocateTo(scene7.lines[i], x, y, alpha)
	}

	var directionsAlpha = 1 - scene7.actualLine / 7
	if(directionsAlpha < 0)
		directionsAlpha = 0
	scene7.directions1.text.attr({"fill-opacity":directionsAlpha})
	//scene7.directions2.text.attr({"fill-opacity":directionsAlpha})
	var p = scene7.line
	var q = scene7.actualLine % 7
	var q_2 = q - 7
	var q_3 = q + 7
	var PQ = Math.abs(p - q)
	var PQ2 = Math.abs(p - q_2)
	var PQ3 = Math.abs(p - q_3)
	var x = (PQ < PQ2 ? PQ : PQ2)
	x = (x < PQ3 ? x : PQ3)
	var x_alpha = 1.0
	if(x < 2.0)
		x_alpha = x / 2.0
	x_alpha = Math.pow(x_alpha, 2)
	scene7.dont.text.attr({"fill-opacity":x_alpha})

	if(scene7.lineFrames > 0) {
		if(scene7.actualLine > 6.99) {
			scene7.line += 0.1 * 1.07
		}
		else {
			scene7.line += 0.1
		}
		scene7.actualLine += 0.1
		scene7.line = scene7.line % 7
		scene7.lineFrames--
	}
}

function scene7keyup(key) {
}

function scene7design() {
	paper.clear()
	if(!performanceMode) {
		clearKeyHandlers()
		clearRenderer()
		trademark(tableOfContents)
	}

	var text = [
		"A",
		"an", "A",
		"an", "an", "and", "A",
		"the", "ans", "the", "and", "the", "A",
		"three", "thes", "ans", "and", "and", "and", "A",
		"three", "thes", "and", "ands", "ans", "A",
		"those", "three", "thes", "and", "ands", "those", "ans", "that"
	]

	var lineText = [
		"A",
		"an A",
		"an an and A",
		"the an's, the and, the A",
		"three the's, an's, and and and A",
		"three the's and and's, an's, A",
		"those three the's and and's, those an's, that"
	]

  scene7 = {}

	scene7.look = addTextButton("look", textSize, "regular")
	scene7.dont = addTextButton("Do not", textSize, "bold")
	scene7.directions1 = addTextButton("and say with any key; play A for A only.",
		textSize, "regular")
	//scene7.directions2 = addTextButton("play A for A only.", textSize, "regular")
	scene7.lineText = lineText
	scene7.lines = []
	for(var i = 0; i < lineText.length; i++) {
		scene7.lines[i] = addTextButton(lineText[i], 24, "italic")
	}
	scene7.line = 0
	scene7.actualLine = 0
	scene7.lineFrames = 0

	relocateTo(scene7.look, paperWidth_2 - scene7.look.bounds.width / 2, 450 - textSpacing)
	relocateTo(scene7.dont, paperWidth_2 - scene7.dont.bounds.width / 2, 450 - textSpacing * 2)
	scene7.dont.text.attr({"fill-opacity": 0.0})
	relocateTo(scene7.directions1, paperWidth_2 - scene7.directions1.bounds.width / 2, 450)
	//relocateTo(scene7.directions2, 300, 450 + textSpacing)

  scene7.text = text
  scene7.word = 0
  scene7.active = []
  scene7.volume = 0.0
  setKeyHandlers(scene7keydown, scene7keyup)
  setRenderer(scene7render)
}

////////////////////////////////////////////////////////////////////////////////
//
//                                 SCENE 8
//
////////////////////////////////////////////////////////////////////////////////

function scene8playWord(word) {
	var s = word
	var ts = scheduler.time()
	var w = 0
  for(var k = 0; k < s.length; k++) {
    var c = s.charAt(k)
    var friction = 1.0
    if(c != " ") {
      scene8.current = s.charCodeAt(k)
      var weight = (Math.abs(scene8.current - scene8.previous) / (122 - 97))
      scheduler.schedule(media.lowerKey(c), 0.4 * weight, undefined, ts + w)
      friction = 1.0 + 0.4 * weight
      scene8.previous = scene8.current
    }
    w += scene8.d * friction
  }
}

function scene8stanza(stanza, style, howMany) {
	while(scene8.poemLetters.length > 0) {
		var x = scene8.poemLetters.pop()
		x.remove()
	}

	var weight = 0
  if(style == "bold")
    weight = 900
  else if(style == "italic")
    weight = 500

  var cx = 100, cy = 150, d = 30, s = 16
  var characterNumber = 0
  for(var i = 0; i < stanza.length; i++) {
    for(var j = 0; j < stanza[i].length; j++) {
      if(howMany === undefined || characterNumber < howMany) {
      	var p = paper.print(cx + j * d, cy, stanza[i][j],
          paper.getFont("Minion", weight), s)
      	scene8.poemLetters.push(p)
      }
      characterNumber++
    }
    cy += d
  }
}

function scene8drawoptions() {
	while(scene8.wordOptions.length > 0) {
		var x = scene8.wordOptions.pop()
		x.text.remove()
		x.button.remove()
	}

	var from = scene8.lastWord
	var pivots = wordPivots(from)
	pivots.push("new stanza")
	pivots.push("finish")

	var x = 300, y = 150
	scene8.locked = true
	var timeout = 0
	for(var i = 0; i < pivots.length; i++) {
		setTimeout(
			function(d) { return function() {
				var o = addTextButton(d.word, textSize, "italic",
							function(data) { return function() {
									if(scene8.locked == true)
										return
									if(scene8.poem[0].length > 10)
										scene8.poem[0] = []
									if(data.word == "new stanza") {
										scene8.poem[0] = []
							      scene8stanza(scene8.poem[0], "italic")
									} else if(data.word == "finish") {
										paper.clear()
										var te = addTextButton("The End", textSize, "regular")
										relocateTo(te, paperWidth_2 - te.bounds.width / 2, paperHeight_2, 1)
										te.text.animate({"fill-opacity":0.0}, 10000, "<")
										clearKeyHandlers()
										if(!performanceMode) {
											setTimeout(function() {
												tableOfContents()
											}, 10000)
										}
										return
									}
									else {
										scene8.lastWord = data.word
										scene8playWord(data.word)
								    scene8.poem[scene8.poem.length - 1].push(data.word)
							      scene8stanza(scene8.poem[0], "italic")
							      scene8drawoptions()
						    	}
							  }}({
							    word:d.word
							  })
						)
				scene8.wordOptions.push(o)
				relocateTo(o, d.x, d.y, 0.1)
				if(d.word == "finish") {
					scene8.locked = false
					for(var m = 0; m < scene8.wordOptions.length; m++) {
						scene8.wordOptions[m].text.animate({"fill-opacity":0.7}, 300, "<")
					}
				}
		  }}({
		    x:x,
		    y:y,
		    word:pivots[i]
		  }), timeout)
		timeout += 25
		x += pivots[i].length / 6 * 50 + 10
		if(x > 750 || pivots[i + 1] == "new stanza" || pivots[i + 1] == "finish") {
			x = 300
			y += textSpacing
		}
		if(pivots[i + 1] == "new stanza")
			y += textSpacing
		if(y > 500 && i < pivots.length - 2) {
			i = pivots.length - 3
		}
	}
}

function scene8design() {
  paper.clear()

  scene8 = {}
  scene8.wordOptions = []
  scene8.poemLetters = []
  scene8.poem = [["an"]]//theAntAndTheBats()
  scene8.lastWord = "an"

  scene8.ts = scheduler.time()
  scene8.t = media.lowerKey
  scene8.d = 0.7
  scene8.w = 0
  scene8.previous = 97
  scene8.current = 0
  scene8.directions = addTextButton("A poem by virtue of adding, removing, or replacing a letter of the previous word.", textSize, "regular")
  relocateTo(scene8.directions, paperWidth_2 - scene8.directions.bounds.width / 2, 100)
  scene8stanza(scene8.poem[0], "italic")
  scene8drawoptions()
  trademark()
  scene8playWord(scene8.lastWord)
}

////////////////////////////////////////////////////////////////////////////////
//
//                                  OTHER
//
////////////////////////////////////////////////////////////////////////////////

function copyright() {
  copyrightActive = true
  paper.clear()
  var blurb = [
  addTextButton("CC0 1.0 Universal (a public domain work)", textSize, "regular"),
  addTextButton("Released to the public domain by                               with the following exceptions.", textSize, "regular"),
  addTextButton("", textSize, "regular"),
  addTextButton("Illustrations in public domain:", textSize, "regular"),
  addTextButton("The Cat and the Fox by Milo Winter, Aesop for Children, 1919.", textSize, "regular"),
  addTextButton("", textSize, "regular"),
  addTextButton("Foreword (Ecclesiastes 1:2-11)", textSize, "regular"),
  addTextButton("THE HOLY BIBLE, NEW INTERNATIONAL VERSION (R), NIV (R),", textSize, "regular"),
  addTextButton("Copyright 1973, 1978, 1984, 2011 by Biblica, Inc. (TM),", textSize, "regular"),
  addTextButton("Used by permission. All rights reserved worldwide.", textSize, "regular"),
  addTextButton("", textSize, "regular"),
  addTextButton("Afterword (based on The Gateless Gate,", textSize, "regular"),
  addTextButton("11. Joshu Examines a Monk in Meditation):", textSize, "regular"),
  addTextButton("The Gateless Gate, Ekai, called Mu-mon", textSize, "regular"),
  addTextButton("tr. by Nyogen Senzki and Paul Reps, 1934.", textSize, "regular"),
  addTextButton("Public domain in U.S.A. due to copyright non-renewal.", textSize, "regular"),
  addTextButton("", textSize, "regular"),
  addTextButton("Piano samples derived from Salamander Grand Piano V2", textSize, "regular"),
  addTextButton("by Alexander Holm (CC by 3.0, http://creativecommons.org/licenses/by/3.0/)", textSize, "regular"),
  addTextButton("", textSize, "regular"),
  addTextButton("All characters appearing in this work are fictitious.", textSize, "regular"),
  addTextButton("Any resemblance to real persons, living or dead, is purely coincidental.", textSize, "regular")
  ]
  var blurbBold = [
  null,
  addTextButton("                                                                    The Composer", textSize, "bold"),
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
  ]
  //chapterHeading(addTextButton("The Composer", chapterSize, "bold"))

  for(var i = 0; i < blurb.length; i++) {
    relocateTo(blurb[i], 200, 350 + i * (textSpacing * 4), 0)
    if(blurbBold[i] !== null)
      relocateTo(blurbBold[i], 200, 350 + i * (textSpacing * 4), 0)
  }

  for(var i = 0; i < blurb.length; i++) {
    animateTo(blurb[i], 200, 100 + i * textSpacing, 2000, "backOut")
    if(blurbBold[i] !== null)
      animateTo(blurbBold[i], 200, 100 + i * textSpacing, 2000, "backOut")
  }
}

function bio() {
  paper.clear()
  //drawGrid()
  //fullScreenButton()
  relocateTo(addTextButton("back", 16, "italic", tableOfContents), 650, 550)

  var dimmers = [
  	[0, 465, 550],
  	[1, 223, 352],
		[2, 200, 264],
		[3, 410, 511],
		[4, 220, 262],
		[6, 395, 440],
		[8, 465, 610],
		[10, 385, 468],
		[10, 555, 600],
		[11, 200, 230],
		[11, 244, 261],
		[13, 365, 448],
		[13, 500, 555]
  ]
  var blurb = [
  addTextButton("    . . .was the recipient of a Grawemeyer Award rejection letter in 2011,", textSize, "regular"),
  addTextButton("and had it not been for not receiving the Pulitzer Prize in 2010, also", textSize, "regular"),
  addTextButton("might have won First Place in several critically-acclaimed competitions.", textSize, "regular"),
  addTextButton("                            's music is performed virtually nowhere worldwide and", textSize, "regular"),
  addTextButton("has not yet been recorded on several major labels such as BMI, Decca,", textSize, "regular"),
  addTextButton("Deutsche Grammophon, Naxos, Sony, and Teldec.", textSize, "regular"),
  addTextButton("                                has studied with none of the biggest names in the", textSize, "regular"),
  addTextButton("field: John Cage, Pierre Boulez, Iannis Xenakis, Karlheinz Stockhausen,", textSize, "regular"),
  addTextButton("Olivier Messiaen, Sofia Gubaidulina, and holds the thought of obtaining", textSize, "regular"),
  addTextButton("a D.M.A. from The Juilliard School, as well as six honorary degrees from", textSize, "regular"),
  addTextButton("conservatories around the world (all imaginary), and is actively seeking", textSize, "regular"),
  addTextButton("to sit in on masterclasses by John Zorn, Morton Feldman, and Nadia", textSize, "regular"),
  addTextButton("Boulanger.", textSize, "regular"),
  addTextButton("                                is currently applying for a full-time residency at", textSize, "regular"),
  addTextButton("Princeton University.", textSize, "regular")
  ]
  var blurbBold = [
  null,
  null,
  null,
  addTextButton("The Composer", textSize, "bold"),
  null,
  null,
  addTextButton("    The Composer", textSize, "bold"),
  null,
  null,
  null,
  null,
  null,
  null,
  addTextButton("    The Composer", textSize, "bold"),
  null
  ]
  chapterHeading(addTextButton("The Composer", chapterSize, "bold"))

  for(var i = 0; i < blurb.length; i++) {
    relocateTo(blurb[i], 200, 350 + i * (textSpacing * 4), 0)
    if(blurbBold[i] !== null)
	    relocateTo(blurbBold[i], 200, 350 + i * (textSpacing * 4), 0)
  }
  for(var i = 0; i < blurb.length; i++) {
    animateTo(blurb[i], 200, 150 + i * textSpacing, 2000, "backOut")
    if(blurbBold[i] !== null)
	    animateTo(blurbBold[i], 200, 150 + i * textSpacing, 2000, "backOut")
  }
  for(var i = 0; i < dimmers.length; i++) {
  	var d = paper.rect(0, 0,
  		dimmers[i][2] - dimmers[i][1], textSpacing).attr({fill:"white", "fill-opacity":0.9, stroke:"none"})
    relocateElementTo(d, dimmers[i][1], 350 + dimmers[i][0] * textSpacing * 4 - textSpacing * 0.5, 2000, "backOut")
  	animateElementTo(d, dimmers[i][1], 150 + dimmers[i][0] * textSpacing - textSpacing * 0.5, 2000, "backOut")
  }
}

function sceneAfterword() {
  paper.clear()
  relocateTo(addTextButton("back", 16, "italic", function() {
  	tableOfContents()
  	if(afterword.timer !== undefined) {
  		clearInterval(afterword.timer)
  	}
  }), 650, 550)

  var blurb = [
  addTextButton("Joshu examined a composer in a hut:", textSize, "regular"),
  addTextButton("      \"What is 'is what'\"?", textSize, "regular"),
  addTextButton("                             raised her fist.", textSize, "regular"),
  addTextButton("Joshu said:", textSize, "regular"),
  addTextButton("      \"Ugh! A ship can not sail", textSize, "regular"),
  addTextButton("      in such shallow water.\"", textSize, "regular"),
  addTextButton("And he stomped out.", textSize, "regular"),
  addTextButton("      \"Well given, well taken,", textSize, "regular"),
  addTextButton("      well killed, well saved,", textSize, "regular"),
  addTextButton("      and well done!\"", textSize, "regular"),
  addTextButton("He bowed with respect.", textSize, "regular")
  ]
  var blurbBold = [addTextButton("The Composer", textSize, "bold")]

  var x = 300, y = 150
  relocateTo(blurb[0], x, y + 0 * textSpacing)
  relocateTo(blurb[1], x, y + 1 * textSpacing)
  relocateTo(blurb[2], x, y + 3 * textSpacing)
  relocateTo(blurbBold[0], x, y + 3 * textSpacing)
  relocateTo(blurb[3], x, y + 5 * textSpacing)

  afterword = {}
  var initial = (Math.random() < 0.5 ? 1 : 0)
  afterword.good = [
  	relocateTo(blurb[4], x, y + 6 * textSpacing, initial),
		relocateTo(blurb[5], x, y + 7 * textSpacing, initial),
		relocateTo(blurb[6], x, y + 8 * textSpacing, initial)]

  afterword.bad = [
  	relocateTo(blurb[7], x, y + 6 * textSpacing, 1 - initial),
		relocateTo(blurb[8], x, y + 7 * textSpacing, 1 - initial),
		relocateTo(blurb[9], x, y + 8 * textSpacing, 1 - initial),
		relocateTo(blurb[10], x, y + 9 * textSpacing, 1 - initial)]
	afterword.wait = 200
	afterword.timer = setInterval(function() {
		var r = Math.random() * 100
		afterword.wait--
		if(r < 98) {
		} else if(r < 99 && afterword.wait < 0) {
			for(var i = 0; i < afterword.good.length; i++)
				afterword.good[i].text.animate({"fill-opacity":1.0}, 100)
			for(var i = 0; i < afterword.bad.length; i++)
				afterword.bad[i].text.animate({"fill-opacity":0.0}, 100)
			afterword.wait = 200
		} else if(afterword.wait < 0) {
			for(var i = 0; i < afterword.good.length; i++)
				afterword.good[i].text.animate({"fill-opacity":0.0}, 100)
			for(var i = 0; i < afterword.bad.length; i++)
				afterword.bad[i].text.animate({"fill-opacity":1.0}, 100)
			afterword.wait = 200
		}
	}, 30)
}

function sceneForeword() {
  paper.clear()
  relocateTo(addTextButton("back", 16, "italic", function() {
  	for(var i = 0; i < foreword.timer.length; i++)
  		clearTimeout(foreword.timer[i])
  	tableOfContents()
  }), 650, 550)

  foreword = {}
  foreword.timer = []

  var blurb = [
  	"\"Meaningless! Meaningless!\"",
  	"      says",
  	"\"Utterly meaningless!",
  	"      Everything is meaningless.\"",
  	"What do people gain from all their labors",
  	"      at which they toil under the sun?",
  	"Generations come and generations go,",
  	"      but the earth remains forever.",
  	"The sun rises and the sun sets,",
  	"      and hurries back to where it rises.",
  	"The wind blows to the south",
  	"      and turns to the north;",
  	"round and round it goes,",
  	"      ever returning on its course.",
  	"All streams flow into the sea,",
  	"      yet the sea is never full.",
  	"To the place the streams come from,",
  	"      there they return again.",
  	"All things are wearisome,",
  	"      more than one can say.",
  	"The eye never has enough of seeing,",
  	"      nor the ear its fill of hearing.",
  	"What has been will be again,",
  	"      what has been done will be done again;",
  	"      there is nothing new under the sun.",
  	"Is there anything of which one can say,",
  	"      \"Look! This is something new\"?",
  	"It was here already, long ago;",
  	"      It was here before our time.",
  	"No one remembers the former generations,",
  	"      and even those yet to come",
  	"      will not be remembered",
  	"      by those who follow them."
  ]

	var x = 150
	var y = 100
  for(var i = 0; i < blurb.length; i++) {
  	if(i == 18) {
  		y = 100 
  		x += 250
  	}
  	foreword.timer.push(setTimeout(
			function(data) { return function() {
					if(data.i == 1) {
						var tc = addTextButton("The Composer.", textSize, "bold")
						relocateTo(tc, data.x + 45, data.y, 0)
				    animateTo(tc, data.x + 45, data.y, 400, "<", undefined, 1)
					}
			    var t = addTextButton(data.text, textSize, "regular")
			    relocateTo(t, data.x, data.y, 0)
			    animateTo(t, data.x, data.y, 400, "<", undefined, 1)
			  }}({
			  	i:i,
			    x:x,
			    y:y,
			    text:blurb[i]
			  }), i * 2500))
  	y += textSpacing
  }
}


