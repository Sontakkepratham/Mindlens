import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert } from './ui/alert';
import { 
  ArrowLeft, 
  Video, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface SessionBookingScreenProps {
  onBack: () => void;
  userEmail: string;
}

type SessionType = 'online' | 'offline';
type SessionDuration = '30' | '60' | '90';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingData {
  sessionType: SessionType;
  duration: SessionDuration;
  selectedDate: string;
  selectedTime: string;
  name: string;
  email: string;
  phone: string;
  reason: string;
  specialRequests: string;
}

export function SessionBookingScreen({ onBack, userEmail }: SessionBookingScreenProps) {
  const [step, setStep] = useState<'type' | 'datetime' | 'details' | 'confirm'>(
    'type'
  );
  const [sessionType, setSessionType] = useState<SessionType>('online');
  const [duration, setDuration] = useState<SessionDuration>('60');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: userEmail,
    phone: '',
    reason: '',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Generate time slots for a given date
  const generateTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    // Office hours: 9 AM - 6 PM
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        // Check if slot is in the past (for today)
        const isPast = isToday && slotTime < now;

        // Randomly make some slots unavailable (simulating bookings)
        const isBooked = Math.random() < 0.3;

        const timeString = `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`;

        slots.push({
          time: timeString,
          available: !isPast && !isBooked,
        });
      }
    }

    return slots;
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  // Check if date is available
  const isDateAvailable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Can't book in the past
    if (date < today) return false;

    // Can't book more than 60 days in advance
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    if (date > maxDate) return false;

    // Weekend check (Saturday = 6, Sunday = 0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;

    return true;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime('');
    }
  };

  const handleBooking = async () => {
    setError('');
    setLoading(true);

    try {
      if (!selectedDate || !selectedTime) {
        throw new Error('Please select a date and time');
      }

      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      const bookingData: BookingData = {
        sessionType,
        duration,
        selectedDate: selectedDate.toISOString(),
        selectedTime,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        reason: formData.reason,
        specialRequests: formData.specialRequests,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-aa629e1b/session-booking`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to book session');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to book session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="text-green-900 text-2xl font-semibold mb-3">
                Session Booked Successfully!
              </h2>
              <p className="text-green-700 mb-4">
                Your {sessionType} session has been confirmed for:
              </p>

              <Card className="bg-white/50 border-green-200 mb-6">
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-900">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="font-medium">
                      {selectedDate?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-900">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">
                      {selectedTime} ({duration} minutes)
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-900">
                    {sessionType === 'online' ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                    <span className="font-medium capitalize">
                      {sessionType} Session
                    </span>
                  </div>
                </div>
              </Card>

              <p className="text-green-700 text-sm mb-6">
                {sessionType === 'online'
                  ? 'You will receive a video call link via email 1 hour before your session.'
                  : 'Our team will send you the clinic address and directions via email.'}
              </p>

              <Button
                onClick={onBack}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Return to Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-lg border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={step === 'type' ? onBack : () => {
                if (step === 'datetime') setStep('type');
                else if (step === 'details') setStep('datetime');
                else if (step === 'confirm') setStep('details');
              }}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">Book Session</span>
            </div>

            <div className="w-20" />
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 flex items-center gap-2">
            {['type', 'datetime', 'details', 'confirm'].map((s, idx) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded-full transition-all ${
                    ['type', 'datetime', 'details', 'confirm'].indexOf(step) >= idx
                      ? 'bg-primary'
                      : 'bg-border'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Session Type Selection */}
          {step === 'type' && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-foreground text-3xl font-bold mb-4">
                  Choose Your Session Type
                </h1>
                <p className="text-muted-foreground text-lg">
                  Select how you'd prefer to attend your therapy session
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Online Session */}
                <Card
                  onClick={() => setSessionType('online')}
                  className={`cursor-pointer transition-all border-2 ${
                    sessionType === 'online'
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="p-8">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        sessionType === 'online'
                          ? 'bg-primary text-white'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <Video className="w-8 h-8" />
                    </div>
                    <h3 className="text-foreground text-xl font-semibold mb-2">
                      Online Session
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Connect from anywhere via secure video call
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Join from home
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        No travel required
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Flexible scheduling
                      </li>
                    </ul>
                  </div>
                </Card>

                {/* Offline Session */}
                <Card
                  onClick={() => setSessionType('offline')}
                  className={`cursor-pointer transition-all border-2 ${
                    sessionType === 'offline'
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="p-8">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        sessionType === 'offline'
                          ? 'bg-primary text-white'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      <MapPin className="w-8 h-8" />
                    </div>
                    <h3 className="text-foreground text-xl font-semibold mb-2">
                      In-Person Session
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Visit our clinic for face-to-face counseling
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Personal connection
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Private therapy room
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Comfortable environment
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>

              {/* Duration Selection */}
              <div className="space-y-4">
                <h3 className="text-foreground font-semibold">
                  Session Duration
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '30', label: '30 Minutes', price: '$50' },
                    { value: '60', label: '60 Minutes', price: '$90' },
                    { value: '90', label: '90 Minutes', price: '$120' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDuration(option.value as SessionDuration)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        duration === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold text-foreground">
                        {option.label}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {option.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setStep('datetime')}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-6"
              >
                Continue to Date & Time
              </Button>
            </motion.div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 'datetime' && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-foreground text-3xl font-bold mb-4">
                  Select Date & Time
                </h1>
                <p className="text-muted-foreground text-lg">
                  Choose your preferred appointment slot
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-foreground font-semibold">
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h3>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Days of week */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-muted-foreground p-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {/* Days of month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day
                      );
                      const available = isDateAvailable(date);
                      const isSelected =
                        selectedDate?.toDateString() === date.toDateString();

                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          disabled={!available}
                          className={`
                            aspect-square p-2 rounded-lg text-sm transition-all
                            ${
                              isSelected
                                ? 'bg-primary text-white font-semibold'
                                : available
                                ? 'hover:bg-accent text-foreground'
                                : 'text-muted-foreground/30 cursor-not-allowed'
                            }
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <p>• Available: Monday - Friday</p>
                    <p>• Up to 60 days in advance</p>
                  </div>
                </Card>

                {/* Time Slots */}
                <Card className="p-6">
                  <h3 className="text-foreground font-semibold mb-4">
                    Available Time Slots
                  </h3>

                  {!selectedDate ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Please select a date first</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {generateTimeSlots(selectedDate).map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`
                            w-full p-3 rounded-lg text-sm transition-all text-left
                            ${
                              selectedTime === slot.time
                                ? 'bg-primary text-white font-medium'
                                : slot.available
                                ? 'bg-accent hover:bg-accent/70 text-foreground'
                                : 'bg-muted text-muted-foreground/30 cursor-not-allowed'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span>{slot.time}</span>
                            {!slot.available && (
                              <span className="text-xs">Booked</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              <Button
                onClick={() => setStep('details')}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-6 disabled:opacity-50"
              >
                Continue to Details
              </Button>
            </motion.div>
          )}

          {/* Step 3: Personal Details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-foreground text-3xl font-bold mb-4">
                  Your Details
                </h1>
                <p className="text-muted-foreground text-lg">
                  Please provide your contact information
                </p>
              </div>

              <Card className="p-8">
                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-foreground">
                      Reason for Session{' '}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <textarea
                      id="reason"
                      placeholder="Briefly describe what you'd like to discuss..."
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2">
                    <Label htmlFor="requests" className="text-foreground">
                      Special Requests{' '}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </Label>
                    <textarea
                      id="requests"
                      placeholder="Any accessibility needs or preferences..."
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequests: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
              </Card>

              <Button
                onClick={() => setStep('confirm')}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-6 disabled:opacity-50"
              >
                Review Booking
              </Button>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-foreground text-3xl font-bold mb-4">
                  Confirm Your Booking
                </h1>
                <p className="text-muted-foreground text-lg">
                  Please review your session details
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="border-destructive/20 bg-destructive/10">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <h3 className="text-destructive mb-1">Booking Failed</h3>
                      <p className="text-destructive text-sm">{error}</p>
                    </div>
                  </div>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {/* Session Details */}
                <Card className="p-6">
                  <h3 className="text-foreground font-semibold mb-4">
                    Session Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {sessionType === 'online' ? (
                        <Video className="w-5 h-5 text-primary" />
                      ) : (
                        <MapPin className="w-5 h-5 text-primary" />
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="text-foreground font-medium capitalize">
                          {sessionType} Session
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>
                        <p className="text-foreground font-medium">
                          {duration} minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-foreground font-medium">
                          {selectedDate?.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="text-foreground font-medium">
                          {selectedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Personal Details */}
                <Card className="p-6">
                  <h3 className="text-foreground font-semibold mb-4">
                    Your Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-foreground font-medium">
                        {formData.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground font-medium">
                        {formData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-foreground font-medium">
                        {formData.phone}
                      </p>
                    </div>
                    {formData.reason && (
                      <div>
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <p className="text-foreground text-sm">
                          {formData.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Important Notice */}
              <Alert className="border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="text-foreground font-medium mb-1">
                      Important Information
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>
                        • {sessionType === 'online'
                          ? 'Video call link will be sent 1 hour before session'
                          : 'Clinic address will be sent via email'}
                      </li>
                      <li>• Please arrive 5 minutes before your appointment</li>
                      <li>
                        • Cancellation policy: 24 hours notice required for
                        refund
                      </li>
                    </ul>
                  </div>
                </div>
              </Alert>

              <div className="flex gap-4">
                <Button
                  onClick={() => setStep('details')}
                  variant="outline"
                  className="flex-1"
                >
                  Edit Details
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
