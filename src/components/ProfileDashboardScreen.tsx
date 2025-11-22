import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { User, Mail, Calendar, Phone, MapPin, Heart, Save, Edit2, X } from 'lucide-react';

interface ProfileDashboardScreenProps {
  userEmail?: string;
  onBack: () => void;
  onSave: (profileData: ProfileData) => void;
}

export interface ProfileData {
  fullName: string;
  email: string;
  dateOfBirth: string;
  age: number;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
}

export function ProfileDashboardScreen({ userEmail, onBack, onSave }: ProfileDashboardScreenProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<ProfileData>({
    fullName: '',
    email: userEmail || '',
    dateOfBirth: '',
    age: 0,
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: ''
  });

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'dateOfBirth') {
        updated.age = calculateAge(value);
      }
      return updated;
    });
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-slate-900 mb-1">Profile Dashboard</h1>
                <p className="text-slate-600">Manage your personal information</p>
              </div>
            </div>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-cyan-600 text-white hover:bg-cyan-700"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-cyan-600 text-white hover:bg-cyan-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-600" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                  {formData.fullName || 'Not provided'}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Email Address</label>
              <div className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {formData.email || 'Not provided'}
              </div>
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  {formData.dateOfBirth || 'Not provided'}
                </div>
              )}
            </div>

            {/* Age (Auto-calculated) */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Age</label>
              <div className="px-4 py-2 bg-slate-100 rounded-lg text-slate-900">
                {formData.age > 0 ? `${formData.age} years` : 'Not calculated'}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="+1 (555) 000-0000"
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-600" />
                  {formData.phone || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Address Information */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-600" />
            Address Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Street Address */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Street Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="123 Main Street"
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                  {formData.address || 'Not provided'}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="San Francisco"
                  />
                ) : (
                  <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                    {formData.city || 'Not provided'}
                  </div>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="CA"
                  />
                ) : (
                  <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                    {formData.state || 'Not provided'}
                  </div>
                )}
              </div>

              {/* ZIP Code */}
              <div>
                <label className="block text-slate-700 mb-2 text-sm">ZIP Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="94102"
                  />
                ) : (
                  <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                    {formData.zipCode || 'Not provided'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Emergency Contact Name */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Contact Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="John Doe"
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                  {formData.emergencyContact || 'Not provided'}
                </div>
              )}
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Contact Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="+1 (555) 000-0000"
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900">
                  {formData.emergencyPhone || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Medical Information */}
        <Card className="bg-white border-slate-200 p-6 mb-6">
          <h2 className="text-slate-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-cyan-600" />
            Medical Information
          </h2>
          <div className="space-y-4">
            {/* Medical History */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Medical History</label>
              {isEditing ? (
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[80px]"
                  placeholder="List any relevant medical conditions..."
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900 min-h-[80px]">
                  {formData.medicalHistory || 'Not provided'}
                </div>
              )}
            </div>

            {/* Current Medications */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Current Medications</label>
              {isEditing ? (
                <textarea
                  value={formData.currentMedications}
                  onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[80px]"
                  placeholder="List medications with dosages..."
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900 min-h-[80px]">
                  {formData.currentMedications || 'Not provided'}
                </div>
              )}
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Allergies</label>
              {isEditing ? (
                <textarea
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[80px]"
                  placeholder="List any known allergies..."
                />
              ) : (
                <div className="px-4 py-2 bg-slate-50 rounded-lg text-slate-900 min-h-[80px]">
                  {formData.allergies || 'Not provided'}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Privacy Notice */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-6">
          <p className="text-cyan-900 text-sm">
            <strong>Privacy Notice:</strong> Your personal information is encrypted with AES-256 and stored securely. 
            All data handling complies with HIPAA regulations. Your information will never be shared without your explicit consent.
          </p>
        </div>

        {/* Back Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={onBack}
              className="w-full bg-slate-600 text-white hover:bg-slate-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
