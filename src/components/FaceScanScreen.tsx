import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Camera, Loader2, CheckCircle2, AlertCircle, Video, VideoOff } from 'lucide-react';

interface FaceScanScreenProps {
  onCapture: (emotionData: EmotionAnalysis) => void;
}

interface EmotionAnalysis {
  dominant_emotion: string;
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    neutral: number;
    surprised: number;
    fearful: number;
    disgusted: number;
  };
  confidence: number;
  timestamp: string;
}

export function FaceScanScreen({ onCapture }: FaceScanScreenProps) {
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [currentEmotions, setCurrentEmotions] = useState<EmotionAnalysis['emotions'] | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  // Start camera
  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        startEmotionDetection();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please grant camera permissions and try again.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setCameraActive(false);
    setFaceDetected(false);
    setCurrentEmotions(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Simulated emotion detection (replace with actual ML model)
  const detectEmotions = (): EmotionAnalysis['emotions'] => {
    // In production, this would call your Vertex AI model
    // For now, return random values for demonstration
    const emotions = {
      happy: Math.random() * 100,
      sad: Math.random() * 100,
      angry: Math.random() * 100,
      neutral: Math.random() * 100,
      surprised: Math.random() * 100,
      fearful: Math.random() * 100,
      disgusted: Math.random() * 100,
    };

    // Normalize to sum to 100
    const total = Object.values(emotions).reduce((a, b) => a + b, 0);
    Object.keys(emotions).forEach(key => {
      emotions[key as keyof typeof emotions] = (emotions[key as keyof typeof emotions] / total) * 100;
    });

    return emotions;
  };

  // Start continuous emotion detection
  const startEmotionDetection = () => {
    const detect = () => {
      if (!videoRef.current || !cameraActive) return;

      // Face detection - always true when camera is active for demo
      const hasFace = true;
      setFaceDetected(hasFace);

      if (hasFace) {
        const emotions = detectEmotions();
        setCurrentEmotions(emotions);
      } else {
        setCurrentEmotions(null);
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  // Handle capture with countdown
  const handleCapture = async () => {
    if (!faceDetected || scanning) return;

    setScanning(true);

    // 3-second countdown
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setCountdown(null);

    // Capture and analyze
    const canvas = document.createElement('canvas');
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');

        // Analyze emotions (in production, send to Vertex AI)
        const emotions = detectEmotions();
        const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
          emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b
        )[0];

        const analysis: EmotionAnalysis = {
          dominant_emotion: dominantEmotion,
          emotions,
          confidence: 75 + Math.random() * 20, // 75-95% confidence
          timestamp: new Date().toISOString(),
        };

        // Stop camera
        stopCamera();

        // Pass results to parent
        onCapture(analysis);
      }
    }

    setScanning(false);
  };

  return (
    <Card className="bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-1">Facial Expression Analysis</h2>
            <p className="text-sm text-cyan-100">
              Step 3 of 3 • Emotion Detection
            </p>
          </div>
          <Camera className="w-8 h-8 text-cyan-200" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Instructions */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
          <h3 className="text-cyan-900 mb-2">📋 Instructions</h3>
          <ul className="space-y-1 text-sm text-cyan-800">
            <li>• Find a well-lit area</li>
            <li>• Look directly at the camera</li>
            <li>• Keep a neutral, natural expression</li>
            <li>• Stay still during the 3-second countdown</li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <div className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-900 mb-1">Camera Access Required</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Camera Feed */}
        <div className="relative bg-slate-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
          {!cameraActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
              <Video className="w-16 h-16 mb-3 text-slate-400" />
              <p className="text-sm">Camera is off</p>
              <p className="text-xs text-slate-400 mt-1">Click "Start Camera" to begin</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Face Detection Indicator */}
              {faceDetected && (
                <Badge className="absolute top-4 left-4 bg-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Face Detected
                </Badge>
              )}

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-8xl font-bold animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Face Guide Circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="border-4 border-cyan-400 rounded-full"
                  style={{ width: '60%', aspectRatio: '1/1' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Live Emotion Analysis */}
        {cameraActive && currentEmotions && (
          <Card className="border-slate-200 bg-slate-50">
            <div className="p-4">
              <h3 className="text-slate-900 mb-3 text-sm">Live Emotion Detection</h3>
              <div className="space-y-2">
                {Object.entries(currentEmotions).map(([emotion, value]) => (
                  <div key={emotion}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span className="capitalize">{emotion}</span>
                      <span>{value.toFixed(1)}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Ready to Capture */}
        {cameraActive && faceDetected && !scanning && (
          <Card className="border-green-200 bg-green-50">
            <div className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-green-900 mb-1">✓ Ready to Capture</h3>
                <p className="text-green-800 text-sm">
                  Face detected! Click "Capture & Analyze" below when ready.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 space-y-3">
        {!cameraActive ? (
          <>
            <Button
              onClick={startCamera}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
            <p className="text-xs text-center text-slate-600">
              📌 Click "Allow" when your browser asks for camera permission
            </p>
          </>
        ) : (
          <>
            <Button
              onClick={handleCapture}
              disabled={!faceDetected || scanning}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Capture & Analyze
                </>
              )}
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
              disabled={scanning}
              className="w-full border-slate-300"
            >
              <VideoOff className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
