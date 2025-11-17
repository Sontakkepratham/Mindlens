import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Alert } from './ui/alert';
import { Camera, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

/**
 * Simple camera test screen to diagnose camera access issues
 */
export function CameraTestScreen() {
  const [testing, setTesting] = useState(false);
  const [cameraWorking, setCameraWorking] = useState<boolean | null>(null);
  const [errorDetails, setErrorDetails] = useState('');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const testCamera = async () => {
    setTesting(true);
    setCameraWorking(null);
    setErrorDetails('');

    try {
      // Step 1: Check browser support
      console.log('Step 1: Checking browser support...');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser does not support camera access. Use Chrome, Firefox, or Safari.');
      }
      console.log('✓ Browser supports camera access');

      // Step 2: List available devices
      console.log('Step 2: Enumerating devices...');
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      console.log('✓ Found video devices:', videoDevices.length);

      if (videoDevices.length === 0) {
        throw new Error('No camera devices found on this computer.');
      }

      // Step 3: Request camera access
      console.log('Step 3: Requesting camera permission...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      console.log('✓ Camera permission granted');

      // Step 4: Display video
      console.log('Step 4: Starting video stream...');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error('Video element not found'));
            return;
          }

          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
              .then(() => {
                console.log('✓ Video playing successfully');
                setStream(mediaStream);
                setCameraWorking(true);
                resolve();
              })
              .catch(reject);
          };

          videoRef.current.onerror = () => {
            reject(new Error('Video element error'));
          };
        });
      }

    } catch (err: any) {
      // Suppress console error for permission denied (expected behavior)
      if (err.name !== 'NotAllowedError' && err.name !== 'PermissionDeniedError') {
        console.error('Camera test failed:', err);
      }
      
      setCameraWorking(false);
      
      let userMessage = '';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userMessage = '🔒 Camera Permission Denied\n\n';
        userMessage += 'You need to allow camera access for facial analysis.\n\n';
        userMessage += 'How to fix:\n\n';
        userMessage += '1️⃣ Click the 🔒 or 🎥 icon in your browser address bar\n';
        userMessage += '2️⃣ Find "Camera" or "Permissions"\n';
        userMessage += '3️⃣ Change to "Allow" or "Ask"\n';
        userMessage += '4️⃣ Refresh this page\n';
        userMessage += '5️⃣ Click "Allow" when prompted\n\n';
        userMessage += '💡 Tip: Look for a camera icon with an X through it in the address bar';
      } else if (err.name === 'NotFoundError') {
        userMessage = '📷 No Camera Found\n\n';
        userMessage += 'Please ensure:\n\n';
        userMessage += '• A camera is connected to your device\n';
        userMessage += '• The camera is enabled in system settings\n';
        userMessage += '• No other app is using the camera\n';
        userMessage += '• Try a different browser if the issue persists';
      } else if (err.name === 'NotReadableError') {
        userMessage = '⚠️ Camera Already in Use\n\n';
        userMessage += 'Your camera is being used by another application.\n\n';
        userMessage += 'Please:\n\n';
        userMessage += '• Close Zoom, Teams, Skype, or similar apps\n';
        userMessage += '• Close other browser tabs using the camera\n';
        userMessage += '• Restart your browser if needed';
      } else if (err.message.includes('not support')) {
        userMessage = err.message;
      } else {
        userMessage = `Camera Error\n\n`;
        userMessage += `${err.name || 'Unknown error'}: ${err.message || 'Something went wrong'}\n\n`;
        userMessage += 'Try:\n\n';
        userMessage += '• Using Chrome, Firefox, or Safari\n';
        userMessage += '• Refreshing the page\n';
        userMessage += '• Checking your camera settings';
      }
      
      setErrorDetails(userMessage);
    } finally {
      setTesting(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraWorking(null);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <h2 className="text-slate-900 mb-1">Camera Diagnostic Test</h2>
        <p className="text-slate-600">
          Test if your camera is working properly
        </p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <div className="p-4">
            <h3 className="text-blue-900 mb-2">📋 How to Test</h3>
            <ol className="space-y-1 text-blue-800 text-sm list-decimal list-inside">
              <li>Click "Test Camera" button</li>
              <li>Allow camera access when prompted</li>
              <li>Check if you can see yourself</li>
            </ol>
          </div>
        </Card>

        {/* Permission Help - Show before testing */}
        {!stream && cameraWorking === null && (
          <Card className="border-cyan-200 bg-cyan-50">
            <div className="p-4">
              <h3 className="text-cyan-900 mb-2">🎯 Important: Camera Permission</h3>
              <p className="text-cyan-800 text-sm mb-3">
                When you click "Test Camera", your browser will ask for permission.
              </p>
              <div className="space-y-2 text-cyan-800 text-sm">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0">✓</span>
                  <span>Click "Allow" when the permission popup appears</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0">✓</span>
                  <span>Look for a camera icon in the address bar</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0">✓</span>
                  <span>If you clicked "Block", you'll need to reset permissions</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Video Preview */}
        <Card className="border-slate-200 bg-white overflow-hidden">
          <div className="relative aspect-video bg-slate-900">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300">Camera preview will appear here</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Test Result */}
        {cameraWorking === true && (
          <Alert className="border-green-200 bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="text-green-900 mb-1">✓ Camera Working!</h3>
                <p className="text-green-800 text-sm">
                  Your camera is functioning correctly. You can proceed with the facial analysis.
                </p>
              </div>
            </div>
          </Alert>
        )}

        {cameraWorking === false && (
          <Alert className="border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-900 mb-2">Camera Access Failed</h3>
                <pre className="text-red-800 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {errorDetails}
                </pre>
                
                {/* Visual guide for permission fix */}
                {errorDetails.includes('Permission Denied') && (
                  <div className="mt-4 p-3 bg-white rounded border border-red-200">
                    <p className="text-red-900 text-sm mb-2">
                      <strong>Quick Fix Guide:</strong>
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-red-800">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          1
                        </div>
                        <span>Look for 🔒 or 🎥 icon in browser address bar (top left)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-800">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          2
                        </div>
                        <span>Click it and select "Site Settings" or "Permissions"</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-800">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          3
                        </div>
                        <span>Find "Camera" and change to "Allow"</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-800">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          4
                        </div>
                        <span>Refresh page and click "Test Camera" again</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        {/* Device Info */}
        {devices.length > 0 && (
          <Card className="border-slate-200 bg-white">
            <div className="p-4">
              <h3 className="text-slate-900 mb-3">Available Cameras ({devices.length})</h3>
              <div className="space-y-2">
                {devices.map((device, index) => (
                  <div key={device.deviceId} className="text-sm">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-cyan-600" />
                      <span className="text-slate-900">
                        {device.label || `Camera ${index + 1}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Browser Info */}
        <Card className="border-slate-200 bg-white">
          <div className="p-4">
            <h3 className="text-slate-900 mb-3">System Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Browser Support:</span>
                <span className="text-slate-900">
                  {navigator.mediaDevices ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">User Agent:</span>
                <span className="text-slate-900 text-xs truncate max-w-[200px]">
                  {navigator.userAgent.split(' ')[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">HTTPS:</span>
                <span className="text-slate-900">
                  {window.location.protocol === 'https:' ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 space-y-3">
        {!stream ? (
          <Button
            onClick={testCamera}
            disabled={testing}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing Camera...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Test Camera
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="outline"
            className="w-full border-slate-300"
          >
            Stop Camera
          </Button>
        )}
      </div>
    </div>
  );
}