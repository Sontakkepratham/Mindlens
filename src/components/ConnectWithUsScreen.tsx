import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Mail, Phone, MapPin, MessageCircle, Send, Globe, Twitter, Linkedin, Github, Clock, HelpCircle } from 'lucide-react';

interface ConnectWithUsScreenProps {
  onBack: () => void;
}

export function ConnectWithUsScreen({ onBack }: ConnectWithUsScreenProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const [submitted, setSubmitted] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '', inquiryType: 'general' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h1 className="text-white">Connect With Us</h1>
          </div>
          <p className="text-cyan-100">
            We're here to help! Reach out to our team for support, feedback, or partnership inquiries.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Email */}
          <Card className="bg-white border-slate-200 p-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-slate-900 mb-2">Email Us</h3>
            <p className="text-slate-600 text-sm mb-3">
              For general inquiries and support
            </p>
            <a href="mailto:info.mindlens@gmail.com" className="text-cyan-600 hover:text-cyan-700 text-sm">
              info.mindlens@gmail.com
            </a>
          </Card>

          {/* Phone */}
          <Card className="bg-white border-slate-200 p-6">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-slate-900 mb-2">Call Us</h3>
            <p className="text-slate-600 text-sm mb-3">
              Monday - Friday, 9am - 5pm EST
            </p>
            <a href="tel:+91 93214 08094" className="text-cyan-600 hover:text-cyan-700 text-sm">
              +91 93214 08094
            </a>
          </Card>

          {/* Crisis Line */}
          <Card className="bg-red-50 border-red-200 p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-red-900 mb-2">Crisis Support</h3>
            <p className="text-red-700 text-sm mb-3">
              24/7 immediate assistance
            </p>
            <a href="tel:988" className="text-red-600 hover:text-red-700 font-medium text-sm">
              988 (Crisis Lifeline)
            </a>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4">Send Us a Message</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-green-900 mb-2">Message Sent!</h3>
              <p className="text-green-700">
                Thank you for reaching out. We'll get back to you within 24-48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Inquiry Type */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">Inquiry Type</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="general">General Question</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="research">Research Collaboration</option>
                  <option value="provider">Healthcare Provider</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">Your Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="How can we help?"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[120px]"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-cyan-600 text-white hover:bg-cyan-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          )}
        </Card>

        {/* Office Location */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-600" />
            Our Location
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-900">MindLens</p>
                <p className="text-slate-600 text-sm">Kandivali, Mumbai</p>
                <p className="text-slate-600 text-sm">Mumbai, Maharashtra 400067</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-900">Business Hours</p>
                <p className="text-slate-600 text-sm">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                <p className="text-slate-600 text-sm">Weekend: Emergency support only</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Social Media & Links */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4">Follow Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <Globe className="w-5 h-5 text-cyan-600" />
              <span className="text-slate-700 text-sm">Website</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <Twitter className="w-5 h-5 text-blue-500" />
              <span className="text-slate-700 text-sm">Twitter</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <Linkedin className="w-5 h-5 text-blue-700" />
              <span className="text-slate-700 text-sm">LinkedIn</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <Github className="w-5 h-5 text-slate-800" />
              <span className="text-slate-700 text-sm">GitHub</span>
            </button>
          </div>
        </Card>

        {/* FAQ Quick Links */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <p className="text-slate-900 mb-1">How accurate is the PHQ-9 assessment?</p>
              <p className="text-slate-600 text-sm">The PHQ-9 has sensitivity and specificity &gt;80% for major depression...</p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <p className="text-slate-900 mb-1">Is my data secure and private?</p>
              <p className="text-slate-600 text-sm">Yes, all data is encrypted with AES-256 and HIPAA compliant...</p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <p className="text-slate-900 mb-1">How does the facial emotion analysis work?</p>
              <p className="text-slate-600 text-sm">We use Google Cloud's Vertex AI to analyze micro-expressions...</p>
            </button>
            <button className="w-full text-left p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <p className="text-slate-900 mb-1">Can I share my results with my healthcare provider?</p>
              <p className="text-slate-600 text-sm">Yes, you can download and securely share comprehensive reports...</p>
            </button>
          </div>
        </Card>

        {/* Support Notice */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-6">
          <p className="text-cyan-900 text-sm">
            <strong>Need immediate help?</strong> If you're experiencing a mental health crisis, 
            please call the National Suicide Prevention Lifeline at 988 or text HOME to 741741 
            to reach the Crisis Text Line. For medical emergencies, call 911.
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