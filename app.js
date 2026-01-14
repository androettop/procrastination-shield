const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusText = document.getElementById("status");
const alertSound = document.getElementById("alertSound");
const totalCountEl = document.getElementById("totalCount");
const totalTimeEl = document.getElementById("totalTime");
const logEl = document.getElementById("log");

// 🔧 CONFIGURATION
const DOWN_ANGLE_THRESHOLD = 0.07; // Adjust sensitivity
const ALERT_INTERVAL_MS = 2000; // Play sound every second

// Tracking variables
let isLookingDown = false;
let lookDownStartTime = null;
let lastAlertTime = 0;
let procrastinationCount = 0;
let totalProcrastinationTime = 0; // in seconds
let procrastinationLog = [];

// FaceMesh
const faceMesh = new FaceMesh({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6
});

faceMesh.onResults(results => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fix: verify that multiFaceLandmarks exists and has at least one face
  if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
    statusText.textContent = "No face detected";
    statusText.className = "status-text error";
    return;
  }

  const landmarks = results.multiFaceLandmarks[0];

  // Key points
  const noseTip = landmarks[1];
  const chin = landmarks[152];

  const verticalDiff = chin.y - noseTip.y;

  const now = Date.now();

  // Alert only when the difference is LESS than the threshold (looking down)
  if (verticalDiff < DOWN_ANGLE_THRESHOLD) {
    if (!isLookingDown) {
      // Started looking down
      isLookingDown = true;
      lookDownStartTime = now;
      lastAlertTime = now;
      alertSound.play();
      statusText.textContent = "PROCRASTINATING";
      statusText.className = "status-text warning";
    } else {
      // Still looking down - update duration and play sound repeatedly
      const duration = Math.floor((now - lookDownStartTime) / 1000);
      statusText.textContent = `Procrastinating (${duration}s)`;
      statusText.className = "status-text warning";
      
      // Play alert sound repeatedly
      if (now - lastAlertTime >= ALERT_INTERVAL_MS) {
        alertSound.currentTime = 0;
        alertSound.play();
        lastAlertTime = now;
      }
    }
  } else {
    if (isLookingDown) {
      // Stopped looking down - log the event
      const duration = Math.floor((now - lookDownStartTime) / 1000);
      logProcrastination(duration);
      isLookingDown = false;
      lookDownStartTime = null;
    }
    statusText.textContent = "Focused";
    statusText.className = "status-text active";
  }
});

function logProcrastination(duration) {
  procrastinationCount++;
  totalProcrastinationTime += duration;
  
  // Update stats
  totalCountEl.textContent = procrastinationCount;
  totalTimeEl.textContent = formatTime(totalProcrastinationTime);
  
  // Add to log
  const timestamp = new Date().toLocaleTimeString();
  const entry = { timestamp, duration };
  procrastinationLog.unshift(entry);
  
  // Update log display
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `
    <span class="log-time">${timestamp}</span>
    <span class="log-duration">${formatTime(duration)}</span>
  `;
  logEl.insertBefore(logEntry, logEl.firstChild);
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

// Camera
const camera = new Camera(video, {
  onFrame: async () => {
    await faceMesh.send({ image: video });
  },
  width: 640,
  height: 480
});

// Don't start camera automatically - wait for PiP mode
let cameraStarted = false;

// Create PiP canvas for stats only
const pipCanvas = document.createElement('canvas');
const pipCtx = pipCanvas.getContext('2d');
pipCanvas.width = 400;
pipCanvas.height = 200;

let pipVideo = null;
let pipStream = null;
let pipAnimationFrame = null;

function drawPipFrame() {
  // Background
  pipCtx.fillStyle = '#0a0a0a';
  pipCtx.fillRect(0, 0, pipCanvas.width, pipCanvas.height);
  
  // Title
  pipCtx.fillStyle = '#e0e0e0';
  pipCtx.font = 'bold 20px -apple-system, sans-serif';
  pipCtx.fillText('Procrastination Shield', 20, 35);
  
  // Stats background
  pipCtx.fillStyle = '#1a1a1a';
  pipCtx.fillRect(20, 55, 360, 60);
  
  // Stats text
  pipCtx.fillStyle = '#888';
  pipCtx.font = '14px -apple-system, sans-serif';
  pipCtx.fillText('TIMES CHECKED', 30, 75);
  pipCtx.fillText('TOTAL TIME', 220, 75);
  
  pipCtx.fillStyle = '#ff4444';
  pipCtx.font = 'bold 28px -apple-system, sans-serif';
  pipCtx.fillText(`${procrastinationCount}`, 30, 105);
  pipCtx.fillText(`${formatTime(totalProcrastinationTime)}`, 220, 105);
  
  // Status
  let displayStatus = statusText.textContent;
  const statusClass = statusText.className;
  
  // If procrastinating, show uppercase with duration
  if (statusClass.includes('warning') && isLookingDown && lookDownStartTime) {
    const duration = Math.floor((Date.now() - lookDownStartTime) / 1000);
    displayStatus = `PROCRASTINATING (${duration}s)`;
  }
  
  // Determine color based on status class
  if (statusClass.includes('error')) {
    pipCtx.fillStyle = '#ff4444';
  } else if (statusClass.includes('warning')) {
    pipCtx.fillStyle = '#ff4444';
  } else if (statusClass.includes('active')) {
    pipCtx.fillStyle = '#4caf50';
  } else {
    pipCtx.fillStyle = '#888';
  }
  
  pipCtx.font = 'bold 24px -apple-system, sans-serif';
  pipCtx.fillText(displayStatus, 20, 155);
  
  pipAnimationFrame = requestAnimationFrame(drawPipFrame);
}

// Picture-in-Picture functionality
const pipButton = document.getElementById('pipButton');

// Check if PiP is supported
if (!document.pictureInPictureEnabled) {
  pipButton.disabled = true;
  pipButton.textContent = 'PiP not supported';
}

pipButton.addEventListener('click', async () => {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      pipButton.textContent = 'Start Detection';
      
      // Stop PiP rendering
      if (pipAnimationFrame) {
        cancelAnimationFrame(pipAnimationFrame);
        pipAnimationFrame = null;
      }
      if (pipStream) {
        pipStream.getTracks().forEach(track => track.stop());
        pipStream = null;
      }
      
      // Stop camera
      if (cameraStarted) {
        camera.stop();
        cameraStarted = false;
        statusText.textContent = 'Detection stopped';
        statusText.className = 'status-text';
      }
    } else {
      // Start camera if not already started
      if (!cameraStarted) {
        camera.start();
        cameraStarted = true;
        statusText.textContent = 'Starting detection...';
        statusText.className = 'status-text';
        // Wait a bit for camera to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Start drawing PiP frames
      drawPipFrame();
      
      // Create video element from canvas stream
      pipStream = pipCanvas.captureStream(30);
      pipVideo = document.createElement('video');
      pipVideo.srcObject = pipStream;
      pipVideo.muted = true;
      await pipVideo.play();
      
      // Request PiP on the composite video
      await pipVideo.requestPictureInPicture();
      pipButton.textContent = 'Stop Detection';
      
      // Add listener to stop when PiP window is closed
      pipVideo.addEventListener('leavepictureinpicture', () => {
        stopDetection();
      }, { once: true });
    }
  } catch (error) {
    console.error('PiP error:', error);
  }
});

// Function to stop detection
function stopDetection() {
  // Stop PiP rendering
  if (pipAnimationFrame) {
    cancelAnimationFrame(pipAnimationFrame);
    pipAnimationFrame = null;
  }
  if (pipStream) {
    pipStream.getTracks().forEach(track => track.stop());
    pipStream = null;
  }
  
  // Stop camera
  if (cameraStarted) {
    camera.stop();
    cameraStarted = false;
    statusText.textContent = 'Detection stopped';
    statusText.className = 'status-text';
  }
  
  pipButton.textContent = 'Start Detection';
}

// Update button text when PiP mode changes
document.addEventListener('enterpictureinpicture', () => {
  pipButton.textContent = 'Stop Detection';
});

document.addEventListener('leavepictureinpicture', () => {
  stopDetection();
});
