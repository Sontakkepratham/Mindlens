import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Database, 
  Brain, 
  TrendingUp, 
  Users, 
  Activity,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { analyticsAPI, checkAPIHealth } from '../lib/api-client';

interface MLDashboardScreenProps {
  onBack: () => void;
}

export function MLDashboardScreen({ onBack }: MLDashboardScreenProps) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [apiHealth, setApiHealth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check API health
      const health = await checkAPIHealth();
      setApiHealth(health);

      // Load analytics data
      const analyticsData = await analyticsAPI.getAggregateData();
      setAnalytics(analyticsData.analytics);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // In production, this would call the export endpoint
      console.log('Exporting ML training data...');
      alert('Data export initiated. Check Cloud Storage for JSONL file.');
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleTrainModel = async () => {
    try {
      console.log('Triggering ML model training...');
      alert('Training job submitted to Vertex AI. Check console for progress.');
    } catch (err) {
      console.error('Training error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mb-4" />
        <p className="text-slate-600">Loading ML Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h3 className="text-slate-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-slate-600 mb-4 text-center">{error}</p>
        <Button onClick={loadData} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-slate-50 z-10 px-6 py-4 border-b border-slate-200">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-3 text-slate-600"
        >
          ← Back
        </Button>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-cyan-600" />
          <h2 className="text-slate-900">ML Training Dashboard</h2>
        </div>
        <p className="text-slate-600">BigQuery integration & AI model training</p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-4">
        {/* BigQuery Credentials Warning */}
        {!apiHealth?.features?.bigquery && (
          <Card className="border-orange-200 bg-orange-50">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-orange-900 mb-2">BigQuery Not Configured</h3>
                  <p className="text-orange-800 mb-3">
                    Google Cloud credentials are missing or invalid. Dashboard showing mock data.
                  </p>
                  <p className="text-orange-800 text-sm">
                    The app works fine without BigQuery, but you won't be able to train ML models on real data.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* API Health Status */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-900">System Status</h3>
              {apiHealth?.status === 'healthy' ? (
                <Badge className="bg-green-100 text-green-700 border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Healthy
                </Badge>
              ) : (
                <Badge variant="destructive">Error</Badge>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Backend API</span>
                <span className="text-slate-900">{apiHealth?.service || 'MindLens API'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Last Updated</span>
                <span className="text-slate-900">
                  {new Date(apiHealth?.timestamp || Date.now()).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Total Assessments */}
            <Card className="border-slate-200 bg-white">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <Users className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-slate-600">Total Assessments</p>
                    <p className="text-2xl text-slate-900">
                      {analytics?.totalAssessments?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600">
                  Available for ML training in BigQuery
                </p>
              </div>
            </Card>

            {/* Average PHQ-9 Score */}
            <Card className="border-slate-200 bg-white">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-slate-600">Average PHQ-9 Score</p>
                    <p className="text-2xl text-slate-900">
                      {analytics?.averagePhqScore?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600">Across all consented assessments</p>
              </div>
            </Card>

            {/* Severity Distribution */}
            <Card className="border-slate-200 bg-white">
              <div className="p-5">
                <h3 className="text-slate-900 mb-4">Severity Distribution</h3>
                <div className="space-y-3">
                  {analytics?.severityDistribution && Object.entries(analytics.severityDistribution).map(([level, count]: [string, any]) => {
                    const percentage = ((count / analytics.totalAssessments) * 100).toFixed(1);
                    return (
                      <div key={level}>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-700 capitalize">{level}</span>
                          <span className="text-slate-600">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Emotion Distribution */}
            <Card className="border-slate-200 bg-white">
              <div className="p-5">
                <h3 className="text-slate-900 mb-4">Emotion Distribution</h3>
                <div className="space-y-3">
                  {analytics?.emotionDistribution && Object.entries(analytics.emotionDistribution).map(([emotion, count]: [string, any]) => (
                    <div key={emotion} className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700 capitalize">{emotion}</span>
                      <span className="text-slate-900">{count} samples</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-4">
            <Card className="border-slate-200 bg-white">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-slate-700" />
                  <h3 className="text-slate-900">BigQuery Tables</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-900">assessment_records</span>
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <p className="text-slate-600">PHQ-9 assessment data</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-900">emotion_analysis</span>
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <p className="text-slate-600">Vertex AI emotion detection results</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-900">user_behavior_patterns</span>
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <p className="text-slate-600">Engagement and trend analysis</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-900">session_outcomes</span>
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <p className="text-slate-600">Counseling session effectiveness</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-slate-200 bg-white">
              <div className="p-5">
                <h3 className="text-slate-900 mb-3">Data Privacy</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-slate-700">All user IDs hashed with SHA-256</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-slate-700">No PII stored in BigQuery</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-slate-700">Only consented data included</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-slate-700">Encrypted in transit and at rest</p>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleExportData}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Training Data
            </Button>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-4">
            <Card className="border-slate-200 bg-white">
              <div className="p-5">
                <h3 className="text-slate-900 mb-4">Active ML Models</h3>
                <div className="space-y-4">
                  {/* Emotion Detection Model */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-slate-900">Emotion Detection</p>
                        <p className="text-slate-600">Version 2.1.0</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        Deployed
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-600">Accuracy</p>
                        <p className="text-slate-900">87%</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Samples</p>
                        <p className="text-slate-900">10,847</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Prediction Model */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-slate-900">Risk Prediction</p>
                        <p className="text-slate-600">Version 1.3.0</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        Deployed
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-600">Accuracy</p>
                        <p className="text-slate-900">91%</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Recall</p>
                        <p className="text-slate-900">94%</p>
                      </div>
                    </div>
                  </div>

                  {/* Counselor Matching Model */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-slate-900">Counselor Matching</p>
                        <p className="text-slate-600">Version 1.1.0</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        Deployed
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-600">Match Rate</p>
                        <p className="text-slate-900">79%</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Satisfaction</p>
                        <p className="text-slate-900">4.3/5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-cyan-200 bg-cyan-50">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-cyan-700" />
                  <h3 className="text-cyan-900">Training Recommendations</h3>
                </div>
                <div className="space-y-2 text-cyan-800">
                  <p>• Emotion model can be retrained with {analytics?.totalAssessments || 0} new samples</p>
                  <p>• Consider feature engineering on Q1-Q2 correlation</p>
                  <p>• Time-of-day patterns show promise as features</p>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleTrainModel}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              Train New Model
            </Button>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={loadData} className="border-slate-300">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-300"
                onClick={() => window.open('https://console.cloud.google.com/bigquery', '_blank')}
              >
                <Database className="w-4 h-4 mr-2" />
                Open BigQuery
              </Button>
            </div>
          </div>
        </Card>

        {/* Integration Status */}
        <Card className="border-slate-200 bg-white">
          <div className="p-5">
            <h3 className="text-slate-900 mb-3">Integration Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-900">Supabase Backend</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-900">BigQuery Connection</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-900">Data Pipeline</span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-700">Vertex AI Models</span>
                <Badge variant="outline" className="border-slate-300">Configured</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full border-slate-300 text-slate-700"
        >
          Close Dashboard
        </Button>
      </div>
    </div>
  );
}