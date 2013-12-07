function lookupSortedWord(s) {
  var i = words.indexOf(s)
  if(i != -1)
    return words_sorted[i]
}

function wordManipulationSort(word) {
  word = word.toLowerCase()
  var characterArray = []
  for(var i = 0; i < word.length; i++) {
    characterArray.push(word.charAt(i))
  }
  characterArray.sort()

  var sortedWord = ''
  for(var i = 0; i < characterArray.length; i++) {
    sortedWord += characterArray[i]
  }
  return sortedWord;
}

function wordManipulationMinus(word, indexOfCharacterToSkip) {
  var outWord = ''
  for(var i = 0; i < word.length; i++) {
    if(i == indexOfCharacterToSkip)
      continue
    outWord += word.charAt(i)
  }
  return wordManipulationSort(outWord)
}

function wordManipulationPlus(word, characterToAdd) {
  return wordManipulationSort(word + characterToAdd)
}

function wordManipulationSame(word) {
  return wordManipulationSort(word)
}

function wordManipulationReplace(word, characterToAdd, indexOfCharacterToReplace) {
  return wordManipulationPlus(wordManipulationMinus(word, indexOfCharacterToReplace), characterToAdd)
}

function wordPossibilities(word) {
  possibilities = []
  for(var i = 0; i < word.length; i++) {
    possibilities.push(wordManipulationMinus(word, i))
  }
  possibilities.push(wordManipulationSame(word))
  for(var i = 0; i < 26; i++) {
    possibilities.push(wordManipulationPlus(word, String.fromCharCode(i + 'a'.charCodeAt(0))))
  }
  for(var i = 0; i < word.length; i++) {
    for(var j = 0; j < 26; j++) {
      possibilities.push(wordManipulationReplace(word, String.fromCharCode(j + 'a'.charCodeAt(0)), i))
    }
  }
  
  possibilities.sort()
  for(var i = 1; i < possibilities.length; i++) {
    if(possibilities[i] == possibilities[i - 1]) {
      possibilities.splice(i, 1)
      i--
    }
  }
  return possibilities;
}

function wordPivots(word) {
  pivots = []
  possibilities = wordPossibilities(word)
  for(var i = 0; i < words.length; i++) {
    for(var j = 0; j < possibilities.length; j++) {
      if(words_sorted[i] == possibilities[j]) {
        pivots.push(words[i])
      }
    }
  }
  return pivots
}

function randomPivot(word) {
  var pivots = wordPivots(word)
  return pivots[Math.floor(Math.random() * pivots.length)]
}

function randomLeadingSpace(x) {
  var s = ''
  var l = x.length + Math.floor(Math.random() * 5) - 2
  if(l < 0)
    l = 0
  if(l > 8)
    l = 8
  for(var i = 0; i < l; i++)
    s = s + ' '
  return s
}

function randomPoem(stanzas, upper) {
  var poem = []
  console.log("")
  console.log("Here's my new poem.")
  console.log("")
  var w = 'a'
  var sp = ''
  for(var s = 0; s < stanzas; s++) {
    var l = Math.floor(Math.random() * 9 + 1);
    poem[s] = []
    for(var i = 0; i < l; i++) {
      poem[s][i] = (sp + w)
      if(upper)
        poem[s][i] = poem[s][i].toUpperCase()
      console.log(poem[s][i])
      w = randomPivot(w)
      sp = randomLeadingSpace(sp)
    }
    console.log("")
  }
  console.log("Hope you liked it.")
  console.log("")
  return poem
}

function theAntAndTheBats() {
  return [
    [
    "an",
    " ant",
    "  ran",
    "   near",
    "    rain"
    ],
    
    [
    "arid",
    " dirt",
    "  drift",
    "  trifid",
    " frigid",
    "rigid"
    ],
    
    [
    "riding",
    "     riding",
    " diving",
    "riding",
    "   diving",
    "diving"
    ],
    
    [
    "indigo",
    "iodine",
    "inside",
    "shined",
    "behind",
    "hidden",
    "    dinted",
    "dipnet"
    ],
    
    [
    "tepid",
    " tides"
    ],
    
    [
    "misted"
    ],
    
    [
    "items"
    ],
    
    [
    "islet",
    "     silt",
    "         bits",
    "            bait",
    "              bats"
    ]
  ]
}
