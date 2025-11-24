import { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { PartnerInfo } from './CoupleTest';

interface PartnerInfoScreenProps {
  onComplete: (info: PartnerInfo) => void;
  onBack: () => void;
}

export function PartnerInfoScreen({ onComplete, onBack }: PartnerInfoScreenProps) {
  const [formData, setFormData] = useState<PartnerInfo>({
    yourName: '',
    partnerName: '',
    relationshipLength: '',
    relationshipType: 'dating',
  });

  const [errors, setErrors] = useState<Partial<PartnerInfo>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<PartnerInfo> = {};
    if (!formData.yourName.trim()) newErrors.yourName = 'Please enter your name';
    if (!formData.partnerName.trim()) newErrors.partnerName = 'Please enter your partner\'s name';
    if (!formData.relationshipLength.trim()) newErrors.relationshipLength = 'Please select relationship length';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onComplete(formData);
  };

  const handleChange = (field: keyof PartnerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h1 className="text-slate-900">About Your Relationship</h1>
              <p className="text-sm text-slate-600">Step 1 of 2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="border-2 border-slate-200">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-slate-900">Let's Get Started</h2>
              <p className="text-slate-600">
                Tell us a bit about you and your relationship. This helps us personalize your results.
              </p>
            </div>

            {/* Your Name */}
            <div className="space-y-2">
              <label htmlFor="yourName" className="block text-slate-700 font-medium">
                Your Name
              </label>
              <input
                id="yourName"
                type="text"
                value={formData.yourName}
                onChange={(e) => handleChange('yourName', e.target.value)}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.yourName ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.yourName && (
                <p className="text-sm text-red-600">{errors.yourName}</p>
              )}
            </div>

            {/* Partner's Name */}
            <div className="space-y-2">
              <label htmlFor="partnerName" className="block text-slate-700 font-medium">
                Your Partner's Name
              </label>
              <input
                id="partnerName"
                type="text"
                value={formData.partnerName}
                onChange={(e) => handleChange('partnerName', e.target.value)}
                placeholder="Enter your partner's name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.partnerName ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.partnerName && (
                <p className="text-sm text-red-600">{errors.partnerName}</p>
              )}
            </div>

            {/* Relationship Length */}
            <div className="space-y-2">
              <label htmlFor="relationshipLength" className="block text-slate-700 font-medium">
                How long have you been together?
              </label>
              <select
                id="relationshipLength"
                value={formData.relationshipLength}
                onChange={(e) => handleChange('relationshipLength', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.relationshipLength ? 'border-red-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-primary bg-white`}
              >
                <option value="">Select duration</option>
                <option value="less-than-6-months">Less than 6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="1-2-years">1-2 years</option>
                <option value="2-5-years">2-5 years</option>
                <option value="5-10-years">5-10 years</option>
                <option value="more-than-10-years">More than 10 years</option>
              </select>
              {errors.relationshipLength && (
                <p className="text-sm text-red-600">{errors.relationshipLength}</p>
              )}
            </div>

            {/* Relationship Type */}
            <div className="space-y-2">
              <label htmlFor="relationshipType" className="block text-slate-700 font-medium">
                Relationship Status
              </label>
              <select
                id="relationshipType"
                value={formData.relationshipType}
                onChange={(e) => handleChange('relationshipType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="dating">Dating</option>
                <option value="engaged">Engaged</option>
                <option value="married">Married</option>
                <option value="domestic-partnership">Domestic Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Privacy Note */}
            <Card className="bg-pink-50 border-pink-200">
              <div className="p-4 text-sm text-slate-700">
                <p className="font-medium mb-1">🔒 Privacy Note</p>
                <p>This information is only used to personalize your results and is stored securely with encryption.</p>
              </div>
            </Card>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
              >
                Continue to Questions
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
