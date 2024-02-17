

let videoStream = null , 
    audioStream = null ,
    blob = null ,
    recorder = null,
    chunks = [];
let screen1 = document.querySelector('.video');
let screen2 = document.querySelector('.screen2');
let videoScreen2 = document.querySelector('.videoScreen2');
let startBtn = document.querySelector('.start');
let stopBtn = document.querySelector('.stop');
let downloadBtn = document.querySelector('.download');

async function getmedia(){
  videoScreen2.classList.add('active');
  screen2.srcObject = null;
  try{
     videoStream = await navigator.mediaDevices.getDisplayMedia({
      video:true,
     });
     audioStream = await navigator.mediaDevices.getUserMedia({
      audio:true,
     });
     displayMedia();
  }
  catch(err){
    console.log(err);
  }
}

startBtn.addEventListener('click',getmedia);

function displayMedia(){
  if(videoStream){
    screen1.srcObject = videoStream;
    recordMedia();
  }
  else{
   console.log("Recording not started");   
  }  
}

async function recordMedia(){
  let mixstream = new MediaStream([...videoStream.getTracks() , ...audioStream.getTracks()]);
  console.log('mix' , mixstream);
  recorder = new MediaRecorder(mixstream);
  console.log('recorder',recorder);
  recorder.ondataavailable = (e)=>{
    chunks.push(e.data);
    console.log('ssss',e.data);
  }
  recorder.onstop = ()=>{
     blob = new Blob(chunks , {
      type:'webm',
    })
    console.log(blob);
    screen2.src = URL.createObjectURL(blob);
    screen2.play();
    downloadBtn.href  =URL.createObjectURL(blob);
    downloadBtn.download = 'video.webm';
  }
  recorder.start();
}
stopBtn.addEventListener('click',stopRecording);


// ondataavailable and onstop event will be occure when stop() method fired
function stopRecording(){
  recorder.stop();
  screen1.srcObject = null;
  videoScreen2.classList.remove('active');
}