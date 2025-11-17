import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { AlertCircle, CheckCircle2, Copy, Eye, EyeOff } from 'lucide-react';

interface CredentialsUploadScreenProps {
  onClose: () => void;
}

export function CredentialsUploadScreen({ onClose }: CredentialsUploadScreenProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [showJson, setShowJson] = useState(false);

  const validateJson = (text: string) => {
    if (!text.trim()) {
      setIsValid(null);
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(text);
      
      // Check required fields
      const required = ['type', 'project_id', 'private_key', 'client_email'];
      const missing = required.filter(field => !parsed[field]);
      
      if (missing.length > 0) {
        setIsValid(false);
        setError(`Missing required fields: ${missing.join(', ')}`);
        return;
      }

      if (parsed.type !== 'service_account') {
        setIsValid(false);
        setError('Invalid type. Must be "service_account"');
        return;
      }

      setIsValid(true);
      setError('');
    } catch (err: any) {
      setIsValid(false);
      setError(err.message);
    }
  };

  const handleInputChange = (value: string) => {
    setJsonInput(value);
    validateJson(value);
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then(text => {
      handleInputChange(text);
    });
  };

  const copyInstructions = () => {
    const instructions = `1. Go to https://console.cloud.google.com/iam-admin/serviceaccounts
2. Create a new service account or select existing
3. Grant roles: BigQuery Data Editor, BigQuery Job User
4. Click "Add Key" → "Create New Key" → "JSON"
5. Download the JSON file
6. Open the file in a text editor
7. Copy ALL contents (from { to })
8. Paste into the text area below`;
    
    navigator.clipboard.writeText(instructions);
    alert('Instructions copied to clipboard!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <h2 className="text-slate-900 mb-1">Upload Service Account JSON</h2>
        <p className="text-slate-600">Paste your Google Cloud credentials</p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Current Issue */}
        <Card className="border-orange-200 bg-orange-50">
          <div className="p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-orange-900 mb-1">Current Problem</h3>
                <p className="text-orange-800 text-sm">
                  The GOOGLE_CLOUD_CREDENTIALS variable contains a hash instead of JSON.
                  You need to upload the raw JSON content from your service account key file.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="border-slate-200 bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-900">Step-by-Step Instructions</h3>
              <Button variant="outline" size="sm" onClick={copyInstructions}>
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
            <ol className="space-y-2 text-sm text-slate-700">
              <li>1. Download JSON key from Google Cloud Console</li>
              <li>2. Open the file in a text editor</li>
              <li>3. Copy <strong>ALL</strong> contents</li>
              <li>4. Paste into the text area below</li>
              <li>5. Verify it shows "Valid JSON" ✅</li>
            </ol>
          </div>
        </Card>

        {/* JSON Input */}
        <Card className="border-slate-200 bg-white">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-900">Service Account JSON</label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePaste}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Paste
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJson(!showJson)}
                >
                  {showJson ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
            </div>
            
            <Textarea
              value={jsonInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder='{"type":"service_account","project_id":"your-project",...}'
              className={`font-mono text-xs min-h-[200px] ${
                showJson ? '' : 'filter blur-sm'
              } ${
                isValid === true ? 'border-green-500' :
                isValid === false ? 'border-red-500' :
                ''
              }`}
            />

            {/* Validation Status */}
            <div className="mt-2">
              {isValid === true && (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Valid JSON - Ready to upload!</span>
                </div>
              )}
              {isValid === false && (
                <div className="flex items-start gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="text-sm">Invalid JSON</p>
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                </div>
              )}
              {isValid === null && jsonInput && (
                <p className="text-xs text-slate-600">
                  Paste your service account JSON here...
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Example */}
        <details>
          <summary className="text-sm text-slate-600 cursor-pointer mb-2">
            Show example JSON structure
          </summary>
          <Card className="border-slate-200 bg-slate-900">
            <div className="p-3">
              <pre className="text-green-400 text-xs overflow-x-auto">
{`{
  "type": "service_account",
  "project_id": "mindlens-production",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "service@project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/..."
}`}
              </pre>
            </div>
          </Card>
        </details>

        {/* Warning */}
        <Card className="border-slate-200 bg-white">
          <div className="p-4">
            <h3 className="text-slate-900 mb-2">⚠️ Important Notes</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>• Do NOT add quotes around the JSON</li>
              <li>• Do NOT encode or encrypt it</li>
              <li>• Paste the raw content exactly as-is</li>
              <li>• The JSON must start with &#123; and end with &#125;</li>
            </ul>
          </div>
        </Card>

        {/* Next Steps */}
        {isValid && (
          <Card className="border-green-200 bg-green-50">
            <div className="p-4">
              <h3 className="text-green-900 mb-2">✅ Next: Upload to Supabase</h3>
              <ol className="space-y-2 text-sm text-green-800">
                <li>1. Copy the validated JSON above</li>
                <li>2. Go to your Supabase project dashboard</li>
                <li>3. Navigate to: Settings → Edge Functions → Secrets</li>
                <li>4. Find or create: GOOGLE_CLOUD_CREDENTIALS</li>
                <li>5. Paste the JSON (exactly as shown above)</li>
                <li>6. Save and redeploy the server function</li>
              </ol>
            </div>
          </Card>
        )}
      </div>

      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 space-y-3">
        {isValid && (
          <Button
            onClick={() => {
              navigator.clipboard.writeText(jsonInput);
              alert('Validated JSON copied to clipboard!\n\nNow paste it into Supabase environment variable GOOGLE_CLOUD_CREDENTIALS');
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Validated JSON
          </Button>
        )}
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full border-slate-300"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
