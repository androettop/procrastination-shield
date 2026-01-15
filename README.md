# 🛡️ Procrastination Shield

Stop procrastination with real-time face detection monitoring. This app uses your webcam to detect when you're looking down at your phone and alerts you to stay focused.

**Try it now:** https://androettop.github.io/procrastination-shield/

## ✨ Features

- **Real-time Face Detection**: Uses MediaPipe Face Mesh to track your head position
- **Smart Phone Detection**: Detects when you're looking down at your phone
- **Picture-in-Picture Mode**: Monitor your focus while working in other applications
- **Audio Alerts**: Plays sound alerts when procrastination is detected
- **Procrastination Tracking**: Logs all instances with timestamps and durations
- **Statistics Dashboard**: Track total procrastination count and time

## 🎯 How to Use

1. Visit https://androettop.github.io/procrastination-shield/
2. Grant camera permission when prompted
3. Click "Start Detection" to begin monitoring
4. The app enters Picture-in-Picture mode so you can work in other applications
5. Stay focused - if you look down at your phone, you'll get an alert!

## 🔒 Privacy

All face detection processing happens locally in your browser. No video or data is transmitted to any server.

## 🛠️ Development

### Setup

```bash
git clone https://github.com/androettop/procrastination-shield.git
cd procrastination-shield
npm install
npm start
```

### Configuration

Adjust sensitivity in `app.js`:

```javascript
const DOWN_ANGLE_THRESHOLD = 0.09; // Lower = more sensitive
const ALERT_INTERVAL_MS = 2000;    // Alert frequency in milliseconds
```

## 📄 License

ISC License
