//Namespace for scheduler utilities
scheduler = {
  frame : 0,
  queue : [],

  process : function () {
    if(scheduler.queue.length > 0 && scheduler.queue[0][0] < scheduler.time()) {
      scheduler.queue.shift()[1]()
    }
  },
  
  start : function () {
    setInterval(scheduler.process, 10)
  },

  time : function () {
    return media.context.currentTime
  },

  schedule : function (keyIndex, desiredVolume, callback, when, noteLength) {
    if(keyIndex === undefined)
      return
    var gainObject = media.play(keyIndex, when, desiredVolume, noteLength)
    if(callback === undefined)
      callback = function() {}
    scheduler.queue.push([when, callback, gainObject])
    return gainObject
  }
}
