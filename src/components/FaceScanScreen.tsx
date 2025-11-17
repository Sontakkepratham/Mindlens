import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera } from 'lucide-react';

interface FaceScanScreenProps {
  onCapture: () => void;
}

export function FaceScanScreen({ onCapture }: FaceScanScreenProps) {
  const [scanning, setScanning] = useState(false);

  const handleCapture = () => {
    setScanning(true);
    // Simulate capture delay
    setTimeout(() => {
      setScanning(false);
      onCapture();
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-[80vh] px-6 py-8">
      <div className="mb-6">
        <h2 className="text-slate-900 mb-2">Face Scan</h2>
        <p className="text-slate-600">
          Scan your face for emotional markers.
        </p>
      </div>

      <Card className="border-slate-200 bg-white mb-8 flex-1 flex items-center justify-center">
        <div className="p-6 w-full">
          <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center relative overflow-hidden">
            {scanning ? (
              <div className="text-center">
                <div className="animate-pulse mb-4">
                  <Camera className="w-16 h-16 text-cyan-600 mx-auto" />
                </div>
                <p className="text-slate-600">Analyzing...</p>
              </div>
            ) : (
              <div className="text-center">
                <Camera className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Position your face in frame</p>
              </div>
            )}
            
            {/* Frame guide overlay */}
            <div className="absolute inset-8 border-2 border-cyan-600/30 rounded-full pointer-events-none" />
          </div>
        </div>
      </Card>

      <Button
        onClick={handleCapture}
        disabled={scanning}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
      >
        {scanning ? 'Processing...' : 'Capture Photo'}
      </Button>
    </div>
  );
}
