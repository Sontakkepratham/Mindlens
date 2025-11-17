import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';

interface CredentialsHelpScreenProps {
  onClose: () => void;
}

export function CredentialsHelpScreen({ onClose }: CredentialsHelpScreenProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <h2 className="text-slate-900 mb-1">BigQuery Setup Help</h2>
        <p className="text-slate-600">How to configure Google Cloud credentials</p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* Error Explanation */}
        <Card className="border-red-200 bg-red-50">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-red-900 mb-2">CRITICAL: Credentials Are Hashed!</h3>
                <p className="text-red-800 mb-3">
                  The GOOGLE_CLOUD_CREDENTIALS variable contains a hash (encrypted text), 
                  not the actual JSON. This means it was uploaded incorrectly.
                </p>
                <div className="bg-red-900 text-red-100 p-2 rounded font-mono text-xs mb-3">
                  Current value starts with: 993a77256e1621257a364b788520a143...
                </div>
                <p className="text-red-800">
                  <strong>You MUST re-upload the credentials as raw JSON!</strong>
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Solution */}
        <Card className="border-cyan-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Quick Solution</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 text-sm">
                  1
                </div>
                <div>
                  <p className="text-slate-900 mb-1">Get Service Account JSON</p>
                  <p className="text-slate-600">
                    Go to Google Cloud Console → IAM & Admin → Service Accounts → Create Key → JSON
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-cyan-600"
                    onClick={() => window.open('https://console.cloud.google.com/iam-admin/serviceaccounts', '_blank')}
                  >
                    Open Google Cloud Console <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 text-sm">
                  2
                </div>
                <div>
                  <p className="text-slate-900 mb-1">Copy ENTIRE JSON File Contents</p>
                  <p className="text-slate-600">
                    Open the downloaded JSON file and copy everything from the opening &#123; to closing &#125;
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 text-sm">
                  3
                </div>
                <div>
                  <p className="text-slate-900 mb-1">Paste into Environment Variable</p>
                  <p className="text-slate-600">
                    Upload to GOOGLE_CLOUD_CREDENTIALS exactly as-is (no extra quotes or formatting)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Example JSON */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Example: Valid JSON Format</h3>
            <div className="bg-slate-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
              <pre>{`{
  "type": "service_account",
  "project_id": "mindlens-production",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
  "client_email": "service@project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}`}</pre>
            </div>
          </div>
        </Card>

        {/* Common Mistakes */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Common Mistakes</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-1">❌</span>
                <div>
                  <p className="text-slate-900">Wrapping JSON in quotes</p>
                  <code className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                    "&#123; \"type\": \"service_account\" &#125;"
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-1">❌</span>
                <div>
                  <p className="text-slate-900">Adding extra characters</p>
                  <code className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                    KEY=&#123;...&#125;
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600 mt-1">❌</span>
                <div>
                  <p className="text-slate-900">Incomplete copy (missing fields)</p>
                  <code className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded">
                    &#123; "type": "service_account" &#125;
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✅</span>
                <div>
                  <p className="text-slate-900">Raw JSON content only</p>
                  <code className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                    &#123; "type": "service_account", "project_id": ... &#125;
                  </code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Alternative: Skip BigQuery */}
        <Card className="border-green-200 bg-green-50">
          <div className="p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-green-900 mb-2">App Works Without BigQuery!</h3>
                <p className="text-green-800 mb-3">
                  You can use MindLens without Google Cloud credentials. The app will:
                </p>
                <ul className="space-y-1 text-green-800">
                  <li>• Store data in Supabase (encrypted)</li>
                  <li>• Use mock ML training data</li>
                  <li>• Provide all core features</li>
                  <li>• Allow BigQuery setup later</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Required Permissions */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Required IAM Roles</h3>
            <p className="text-slate-600 mb-3">
              Your service account must have these permissions:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700">BigQuery Data Editor</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700">BigQuery Job User</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                <CheckCircle2 className="w-4 h-4 text-slate-600" />
                <span className="text-slate-700">Storage Object Creator</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 space-y-3">
        <Button
          onClick={() => window.open('https://console.cloud.google.com/iam-admin/serviceaccounts', '_blank')}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Google Cloud Console
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full border-slate-300"
        >
          Close Help
        </Button>
      </div>
    </div>
  );
}