# 🛡️ Procrastination Shield

Stop procrastination with real-time face detection monitoring. This app uses your webcam to detect when you're looking down at your phone and alerts you to stay focused.

## ✨ Features

- **Real-time Face Detection**: Uses MediaPipe Face Mesh to track your head position
- **Smart Phone Detection**: Detects when you're looking down at your phone
- **Picture-in-Picture Mode**: Monitor your focus while working in other applications
- **Audio Alerts**: Plays sound alerts when procrastination is detected
- **Procrastination Tracking**: Logs all instances with timestamps and durations
- **Statistics Dashboard**: Track total procrastination count and time
- **Clean, Dark UI**: Modern interface with live status updates

## 🚀 How It Works

1. The app accesses your webcam and uses MediaPipe Face Mesh to detect facial landmarks
2. It calculates the vertical difference between your nose tip and chin
3. When you look down (typical phone-checking posture), it triggers an alert
4. The app logs each procrastination session with timestamp and duration
5. All stats are displayed in real-time, including in Picture-in-Picture mode

## 📦 Installation

### Prerequisites

- Node.js and npm installed on your system
- A modern browser with webcam access and Picture-in-Picture support

### Setup

1. Clone the repository:
```bash
git clone https://github.com/androettop/procrastination-shield.git
cd procrastination-shield
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to the local server URL (usually `http://localhost:3000`)

## 🎯 Usage

1. **Grant Camera Permission**: When prompted, allow the app to access your webcam
2. **Start Detection**: Click the "Start Detection" button to begin monitoring
3. **Enable Picture-in-Picture**: The app automatically enters PiP mode, allowing you to monitor your focus while working in other applications
4. **Stay Focused**: Keep your head up and eyes on your screen
5. **Get Alerted**: If you look down at your phone, the app will play an alert sound
6. **Review Stats**: Check your procrastination log and statistics to track your progress

## ⚙️ Configuration

You can adjust the sensitivity in `app.js`:

```javascript
const DOWN_ANGLE_THRESHOLD = 0.09; // Adjust sensitivity (lower = more sensitive)
const ALERT_INTERVAL_MS = 2000;    // Play sound every 2 seconds (milliseconds)
```

## 🌐 Browser Requirements

- **Chrome/Edge**: Full support (recommended)
- **Safari**: Supports Picture-in-Picture on macOS and iOS
- **Firefox**: Limited PiP support

Note: The browser must support:
- WebRTC for camera access
- Picture-in-Picture API
- Canvas API
- MediaPipe Face Mesh

## 🔒 Privacy

All face detection processing happens locally in your browser. No video or data is transmitted to any server. Your privacy is fully protected.

## 📄 License

ISC License

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 🙏 Acknowledgments

- Built with [MediaPipe Face Mesh](https://google.github.io/mediapipe/solutions/face_mesh.html)
- Uses Picture-in-Picture API for seamless monitoring
