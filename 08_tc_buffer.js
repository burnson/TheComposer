//
// BufferLoader class
//

function BufferLoader(context, urlList, callback, progress) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.progress = progress;
  this.loadCount = 0;
}

BufferLoader.prototype.loadReceivedData = function(data, url, index) {
  var loader = this
  console.log(url)
  this.context.decodeAudioData(data,
    function(buffer) {
      if(!buffer) {
        alert('Error decoding audio file data: ' + url);
        return;
      }
      loader.bufferList[index] = buffer;
      if(++loader.loadCount == loader.urlList.length)
        loader.onload(loader.bufferList);
      loader.progress(loader.loadCount / loader.urlList.length)
    },
    function(error) {
      console.error('loadReceivedData error', error);
    }
  );
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  //Load buffer asynchronously
  var request;
  request = new XMLHttpRequest()
  request.open("GET", url, true)
  request.responseType = "arraybuffer"
  
  var loader = this
  
  request.onload = function() {
    //Asynchronously decode the audio file data in request.response
    loader.loadReceivedData(request.response, url, index)
  }
  
  request.onerror = function() {
    console.log("Could not access " + url + ". Trying again in one second.")
    
    //Restart load buffer in one second.
    setTimeout(loader.loadBuffer(url, index), 1000)
  }
  
  request.send()
}

BufferLoader.prototype.load = function() {
  for(var i = 0; i < this.urlList.length; i++)
    this.loadBuffer(this.urlList[i], i)
}
