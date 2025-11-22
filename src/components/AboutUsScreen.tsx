import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Brain, Shield, Heart, Zap, Award, Users, Target, TrendingUp } from 'lucide-react';

interface AboutUsScreenProps {
  onBack: () => void;
}

export function AboutUsScreen({ onBack }: AboutUsScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <h1 className="text-white">MindLens</h1>
          </div>
          <p className="text-lg mb-2">
            AI-Powered Mental Health Screening
          </p>
          <p className="text-cyan-100">
            Combining cutting-edge artificial intelligence with evidence-based clinical assessments 
            to provide accessible, accurate mental health screening and support.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-cyan-600" />
            Our Mission
          </h2>
          <p className="text-slate-700 mb-4">
            MindLens is dedicated to making mental health screening accessible, accurate, and actionable. 
            We believe that early detection and intervention can transform lives, and our mission is to 
            empower individuals and healthcare providers with the tools they need to identify and address 
            mental health challenges effectively.
          </p>
          <p className="text-slate-700">
            By combining the gold-standard PHQ-9 depression screening with advanced facial emotion analysis 
            powered by Google Cloud's Vertex AI, we provide a comprehensive, multi-dimensional assessment 
            that goes beyond traditional questionnaires.
          </p>
        </Card>

        {/* Core Values */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Privacy & Security */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <Shield className="w-6 h-6 text-cyan-600 flex-shrink-0" />
              <div>
                <h3 className="text-slate-900 mb-1">Privacy & Security</h3>
                <p className="text-slate-600 text-sm">
                  End-to-end AES-256 encryption and HIPAA compliance ensure your data is always protected.
                </p>
              </div>
            </div>

            {/* Evidence-Based */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <Award className="w-6 h-6 text-cyan-600 flex-shrink-0" />
              <div>
                <h3 className="text-slate-900 mb-1">Evidence-Based</h3>
                <p className="text-slate-600 text-sm">
                  Our assessments are built on validated clinical tools and peer-reviewed research.
                </p>
              </div>
            </div>

            {/* Compassionate Care */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <Heart className="w-6 h-6 text-cyan-600 flex-shrink-0" />
              <div>
                <h3 className="text-slate-900 mb-1">Compassionate Care</h3>
                <p className="text-slate-600 text-sm">
                  Every feature is designed with empathy and respect for your mental health journey.
                </p>
              </div>
            </div>

            {/* Innovation */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-lg">
              <Zap className="w-6 h-6 text-cyan-600 flex-shrink-0" />
              <div>
                <h3 className="text-slate-900 mb-1">Innovation</h3>
                <p className="text-slate-600 text-sm">
                  Leveraging AI and machine learning to advance mental health care accessibility.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Technology Stack */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-600" />
            Our Technology
          </h2>
          <p className="text-slate-700 mb-4">
            MindLens is built on a robust, enterprise-grade technology stack:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-slate-900">Google Cloud Platform (GCP)</strong>
                <p className="text-slate-600 text-sm">
                  Cloud-native architecture ensuring scalability, reliability, and global availability
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-slate-900">Vertex AI</strong>
                <p className="text-slate-600 text-sm">
                  Advanced facial emotion analysis using state-of-the-art machine learning models
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-slate-900">BigQuery</strong>
                <p className="text-slate-600 text-sm">
                  Secure, encrypted data warehousing for ML training and longitudinal analysis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-slate-900">AES-256 Encryption</strong>
                <p className="text-slate-600 text-sm">
                  Military-grade encryption for all data at rest and in transit
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong className="text-slate-900">HIPAA Compliance</strong>
                <p className="text-slate-600 text-sm">
                  Full adherence to healthcare privacy regulations and best practices
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Clinical Validation */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-600" />
            Clinical Validation
          </h2>
          <p className="text-slate-700 mb-4">
            MindLens uses the PHQ-9 (Patient Health Questionnaire-9), one of the most validated 
            and widely used depression screening tools in clinical practice:
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <ul className="space-y-2 text-slate-700 text-sm">
              <li>• Validated across diverse populations and settings</li>
              <li>• Recommended by the U.S. Preventive Services Task Force</li>
              <li>• Used by healthcare providers worldwide</li>
              <li>• Sensitivity and specificity &gt;80% for major depression</li>
              <li>• Tracks symptom severity over time</li>
            </ul>
          </div>
          <p className="text-slate-600 text-sm">
            Our AI-powered facial emotion analysis complements the PHQ-9 by providing objective 
            markers of emotional state, helping to detect subtle indicators that may not be 
            captured through self-report alone.
          </p>
        </Card>

        {/* Team & Impact */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600" />
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <div className="text-3xl text-cyan-600 mb-2">50K+</div>
              <div className="text-slate-700">Assessments Completed</div>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <div className="text-3xl text-cyan-600 mb-2">98%</div>
              <div className="text-slate-700">User Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <div className="text-3xl text-cyan-600 mb-2">24/7</div>
              <div className="text-slate-700">Crisis Support</div>
            </div>
          </div>
          <p className="text-slate-700">
            Since our launch, MindLens has helped thousands of individuals take the first step 
            toward understanding and improving their mental health. Our platform connects users 
            with qualified mental health professionals and provides evidence-based resources for 
            self-care and recovery.
          </p>
        </Card>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-900 text-sm">
            <strong>Medical Disclaimer:</strong> MindLens is a screening tool designed to support, 
            not replace, professional medical advice, diagnosis, or treatment. Always seek the advice 
            of your physician or other qualified health provider with any questions you may have 
            regarding a medical condition. If you are experiencing a mental health crisis, please 
            call 988 (Suicide & Crisis Lifeline) or 911 immediately.
          </p>
        </div>

        {/* Back Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={onBack}
              className="w-full bg-cyan-600 text-white hover:bg-cyan-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}