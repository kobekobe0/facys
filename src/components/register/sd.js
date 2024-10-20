const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/facemodels'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/facemodels'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/facemodels'),
  faceapi.nets.faceExpressionNet.loadFromUri('/facemodels')
]).then(startVideo)

function startVideo() {

  if (navigator.userAgent.match(/iPhone|iPad|Android/)) { ///iPhone|Android.+Mobile/
    console.log("Mobile");
     video.width = 400; //1080;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      if ('srcObject' in video) {
        video.srcObject = localMediaStream;
      } else {
        video.src = window.URL.createObjectURL(localMediaStream);
      }
      video.play();
    })
    .catch(err => {
      console.error(`Not available!!!!`, err);
    });

  } 
  else {
    console.log("PC");
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
      )    
  }
  console.log("video:"+[video.width, video.height]);

  // let div = document.createElement('div')
  // div.innerText = 'video size:'+video.width+', '+video.height
  // console.log(div.innerText);
  // document.body.appendChild(div)
}

video.addEventListener('play', () => {

  var canvas_bg = document.createElement("canvas");
  canvas_bg.width = video.width;
  canvas_bg.height = video.height;
  document.body.append(canvas_bg)
  var ctx_bg = canvas_bg.getContext('2d');
  // ctx_bg.fillStyle = "rgb(0,0,0)";
  // ctx_bg.fillRect(0, 0, video.width, video.height/2);

  var canvas_face = document.createElement("canvas");
  canvas_face.width = video.width;
  canvas_face.height = video.height;
  var ctx_face = canvas_face.getContext('2d');

  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  
  var t1 = performance.now();
  var irisC = [];
  let nowBlinking = false;
  let blinkCount = 0;

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

    const landmarks = resizedDetections[0].landmarks;
    const landmarkPositions = landmarks.positions;

    ctx_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height)
    var x_ = landmarkPositions[38-1].x
    var y_ = landmarkPositions[38-1].y
    var w_ = landmarkPositions[39-1].x - landmarkPositions[38-1].x
    var h_ = landmarkPositions[42-1].y - landmarkPositions[38-1].y
    ctx_bg.fillStyle = "rgb(255,0,0)";
    ctx_bg.fillRect(x_, y_, w_, h_)

    x_ = landmarkPositions[44-1].x
    y_ = landmarkPositions[44-1].y
    w_ = landmarkPositions[45-1].x - landmarkPositions[44-1].x
    h_ = landmarkPositions[48-1].y - landmarkPositions[44-1].y
    ctx_bg.fillRect(x_, y_, w_, h_)

    ctx_face.clearRect(0, 0, canvas_face.width, canvas_face.height)
    ctx_face.drawImage(video, 0, 0, video.width, video.height);
    var frame = ctx_face.getImageData(0, 0, video.width, video.height);
    var p_ = Math.floor(x_+w_/2) + Math.floor(y_+h_/2) * video.width

    var v_ = Math.floor( (frame.data[p_*4+0] + frame.data[p_*4+1] + frame.data[p_*4+2])/3 );
    console.log("irisC:"+v_);

    irisC.push(v_);
    if(irisC.length>100){
        irisC.shift();
    }//

    let meanIrisC = irisC.reduce(function(sum, element){
      return sum + element;
    }, 0);
    meanIrisC = meanIrisC / irisC.length;
    let vThreshold = 1.5;

    let currentIrisC = irisC[irisC.length-1];
    if(irisC.length==100){
       if(nowBlinking==false){
          if(currentIrisC>=meanIrisC*vThreshold){
              nowBlinking = true;
          }//
       }//
       else{
          if(currentIrisC<meanIrisC*vThreshold){
              nowBlinking = false;
              blinkCount += 1;
          }//
       }//

    }//

    ctx_bg.strokeStyle = 'red';
    ctx_bg.lineWidth = 5;
    var Ox = 0;
    var Oy = canvas_bg.height/2;
    var Lx = canvas_bg.width;
    var Ly = canvas_bg.height/2;
    var vx = 0/irisC.length * Lx;
    var vy = irisC[0]/255 * Ly;
    ctx_bg.beginPath();
    ctx_bg.moveTo(Ox+vx, Oy-vy);
    for(var i=1;i<irisC.length;i++){
      vx = i/irisC.length * Lx;
      vy = irisC[i]/255 * Ly;
      ctx_bg.lineTo(Ox+vx, Oy-vy);
    }
    ctx_bg.stroke();

    ctx_bg.strokeStyle = 'rgb(0,255,0)';
    ctx_bg.lineWidth = 2;
    ctx_bg.beginPath();
    vx = 0 * Lx;
    vy = meanIrisC*vThreshold/255 * Ly;
    ctx_bg.moveTo(Ox+vx, Oy-vy);
    vx = 1 * Lx;
    ctx_bg.lineTo(Ox+vx, Oy-vy);
    ctx_bg.stroke();

    var ctx = canvas.getContext('2d');
    var t2 = performance.now();//ms
    ctx.font = "48px serif";
    ctx.fillText("FPS:"+ Math.floor(1000.0/(t2-t1)), 10, 50);
    ctx.fillText("Count:"+blinkCount, 10, 100);
    if(nowBlinking){
      ctx.fillText("Blinking", 10, 150);
    }
    t1 = t2;

  }, 33)

})