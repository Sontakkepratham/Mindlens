import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Heart, 
  Phone, 
  MessageSquare, 
  Wind, 
  Brain, 
  Book, 
  Moon, 
  Activity, 
  Users, 
  Headphones,
  Clipboard,
  Sun,
  Coffee,
  Flower2,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';

interface SelfCareResourcesScreenProps {
  onBack: () => void;
}

type ResourceCategory = 
  | 'crisis'
  | 'breathing'
  | 'grounding'
  | 'meditation'
  | 'journaling'
  | 'exercise'
  | 'sleep'
  | 'nutrition'
  | 'connection'
  | 'education';

export function SelfCareResourcesScreen({ onBack }: SelfCareResourcesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);

  const categories = [
    {
      id: 'crisis' as ResourceCategory,
      title: 'Crisis Support',
      icon: Phone,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Immediate help available 24/7'
    },
    {
      id: 'breathing' as ResourceCategory,
      title: 'Breathing Exercises',
      icon: Wind,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      description: 'Calm your nervous system'
    },
    {
      id: 'grounding' as ResourceCategory,
      title: 'Grounding Techniques',
      icon: Flower2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Return to the present moment'
    },
    {
      id: 'meditation' as ResourceCategory,
      title: 'Meditation & Mindfulness',
      icon: Brain,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      description: 'Practice awareness and peace'
    },
    {
      id: 'journaling' as ResourceCategory,
      title: 'Journaling Prompts',
      icon: Clipboard,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      description: 'Process thoughts and feelings'
    },
    {
      id: 'exercise' as ResourceCategory,
      title: 'Physical Activity',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Move your body, lift your mood'
    },
    {
      id: 'sleep' as ResourceCategory,
      title: 'Sleep Hygiene',
      icon: Moon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Improve rest and recovery'
    },
    {
      id: 'nutrition' as ResourceCategory,
      title: 'Nutrition & Wellness',
      icon: Coffee,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Fuel your mental health'
    },
    {
      id: 'connection' as ResourceCategory,
      title: 'Social Connection',
      icon: Users,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      description: 'Build supportive relationships'
    },
    {
      id: 'education' as ResourceCategory,
      title: 'Educational Resources',
      icon: Book,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      description: 'Learn about mental health'
    }
  ];

  const getResourceContent = (category: ResourceCategory) => {
    switch (category) {
      case 'crisis':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-900 mb-3">If you're in crisis:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900">988 Suicide & Crisis Lifeline</p>
                    <p className="text-red-700 text-sm">Call or text 988 - Available 24/7</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900">Crisis Text Line</p>
                    <p className="text-red-700 text-sm">Text HOME to 741741</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900">Emergency Services</p>
                    <p className="text-red-700 text-sm">Call 911 for immediate danger</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-slate-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Additional Support Lines:</h4>
              <div className="space-y-2 text-sm">
                <p className="text-slate-700"><strong>SAMHSA Helpline:</strong> 1-800-662-4357</p>
                <p className="text-slate-700"><strong>Veterans Crisis Line:</strong> 1-800-273-8255 (Press 1)</p>
                <p className="text-slate-700"><strong>LGBTQ+ Trevor Project:</strong> 1-866-488-7386</p>
                <p className="text-slate-700"><strong>NAMI Helpline:</strong> 1-800-950-6264</p>
              </div>
            </Card>
          </div>
        );

      case 'breathing':
        return (
          <div className="space-y-4">
            <Card className="border-cyan-200 bg-cyan-50 p-4">
              <h4 className="text-cyan-900 mb-3">Box Breathing (4-4-4-4)</h4>
              <ol className="space-y-2 text-cyan-800 text-sm list-decimal list-inside">
                <li>Breathe in through your nose for 4 seconds</li>
                <li>Hold your breath for 4 seconds</li>
                <li>Exhale through your mouth for 4 seconds</li>
                <li>Hold empty for 4 seconds</li>
                <li>Repeat 4-5 times</li>
              </ol>
              <Badge className="mt-3 bg-cyan-600 text-white">Reduces anxiety</Badge>
            </Card>

            <Card className="border-cyan-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">4-7-8 Breathing</h4>
              <ol className="space-y-2 text-slate-700 text-sm list-decimal list-inside">
                <li>Breathe in through nose for 4 seconds</li>
                <li>Hold breath for 7 seconds</li>
                <li>Exhale through mouth for 8 seconds</li>
                <li>Repeat 3-4 cycles</li>
              </ol>
              <Badge className="mt-3 bg-slate-600 text-white">Promotes sleep</Badge>
            </Card>

            <Card className="border-cyan-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Diaphragmatic Breathing</h4>
              <ol className="space-y-2 text-slate-700 text-sm list-decimal list-inside">
                <li>Place one hand on chest, one on belly</li>
                <li>Breathe deeply so belly hand rises</li>
                <li>Chest hand should stay relatively still</li>
                <li>Exhale slowly, feeling belly fall</li>
                <li>Continue for 5-10 minutes</li>
              </ol>
              <Badge className="mt-3 bg-slate-600 text-white">Calms nervous system</Badge>
            </Card>
          </div>
        );

      case 'grounding':
        return (
          <div className="space-y-4">
            <Card className="border-purple-200 bg-purple-50 p-4">
              <h4 className="text-purple-900 mb-3">5-4-3-2-1 Technique</h4>
              <div className="space-y-2 text-purple-800 text-sm">
                <p><strong>5 things</strong> you can see</p>
                <p><strong>4 things</strong> you can touch</p>
                <p><strong>3 things</strong> you can hear</p>
                <p><strong>2 things</strong> you can smell</p>
                <p><strong>1 thing</strong> you can taste</p>
              </div>
              <p className="mt-3 text-purple-700 text-xs italic">
                Use this when feeling anxious or dissociated to return to the present.
              </p>
            </Card>

            <Card className="border-purple-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Physical Grounding</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Place feet firmly on the ground</li>
                <li>• Feel the chair supporting you</li>
                <li>• Hold an ice cube in your hand</li>
                <li>• Splash cold water on your face</li>
                <li>• Stretch your arms overhead</li>
              </ul>
            </Card>

            <Card className="border-purple-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Mental Grounding</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Name 5 colors you see in the room</li>
                <li>• Count backwards from 100 by 7s</li>
                <li>• Recite a favorite poem or song lyrics</li>
                <li>• Describe your surroundings in detail</li>
                <li>• Think of a category (countries, animals) and list items</li>
              </ul>
            </Card>
          </div>
        );

      case 'meditation':
        return (
          <div className="space-y-4">
            <Card className="border-indigo-200 bg-indigo-50 p-4">
              <h4 className="text-indigo-900 mb-3">Simple Meditation (5-10 min)</h4>
              <ol className="space-y-2 text-indigo-800 text-sm list-decimal list-inside">
                <li>Find a comfortable seated position</li>
                <li>Close your eyes or soften your gaze</li>
                <li>Focus on your natural breath</li>
                <li>When mind wanders, gently return to breath</li>
                <li>No judgment - wandering is normal</li>
              </ol>
            </Card>

            <Card className="border-indigo-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Body Scan Meditation</h4>
              <p className="text-slate-700 text-sm mb-3">
                Progressively relax each body part from toes to head:
              </p>
              <ul className="space-y-1 text-slate-700 text-sm">
                <li>• Toes and feet (2 min)</li>
                <li>• Legs and hips (2 min)</li>
                <li>• Abdomen and chest (2 min)</li>
                <li>• Arms and hands (2 min)</li>
                <li>• Shoulders, neck, face (2 min)</li>
              </ul>
            </Card>

            <Card className="border-indigo-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Loving-Kindness Meditation</h4>
              <p className="text-slate-700 text-sm mb-2">Repeat these phrases:</p>
              <div className="space-y-1 text-slate-700 text-sm italic">
                <p>"May I be safe"</p>
                <p>"May I be healthy"</p>
                <p>"May I be happy"</p>
                <p>"May I live with ease"</p>
              </div>
              <p className="mt-3 text-slate-600 text-xs">
                Then repeat for others: loved ones, neutral people, difficult people, all beings.
              </p>
            </Card>
          </div>
        );

      case 'journaling':
        return (
          <div className="space-y-4">
            <Card className="border-amber-200 bg-amber-50 p-4">
              <h4 className="text-amber-900 mb-3">Daily Prompts</h4>
              <ul className="space-y-2 text-amber-800 text-sm">
                <li>• What am I grateful for today?</li>
                <li>• What emotions did I feel and why?</li>
                <li>• What did I do well today?</li>
                <li>• What challenged me?</li>
                <li>• What do I need tomorrow?</li>
              </ul>
            </Card>

            <Card className="border-amber-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Mood Tracking</h4>
              <p className="text-slate-700 text-sm mb-3">Track daily:</p>
              <ul className="space-y-1 text-slate-700 text-sm">
                <li>• Mood rating (1-10)</li>
                <li>• Sleep quality</li>
                <li>• Energy levels</li>
                <li>• Activities and triggers</li>
                <li>• Patterns over time</li>
              </ul>
            </Card>

            <Card className="border-amber-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Therapeutic Prompts</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• What would I tell a friend in my situation?</li>
                <li>• What's in my control vs. out of my control?</li>
                <li>• What does self-care look like for me?</li>
                <li>• What boundaries do I need to set?</li>
                <li>• What am I learning about myself?</li>
              </ul>
            </Card>
          </div>
        );

      case 'exercise':
        return (
          <div className="space-y-4">
            <Card className="border-green-200 bg-green-50 p-4">
              <h4 className="text-green-900 mb-3">Gentle Movement (15-30 min)</h4>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>• Walking in nature or neighborhood</li>
                <li>• Gentle yoga or stretching</li>
                <li>• Dancing to favorite music</li>
                <li>• Swimming or water aerobics</li>
                <li>• Tai chi or qigong</li>
              </ul>
              <Badge className="mt-3 bg-green-600 text-white">Reduces stress hormones</Badge>
            </Card>

            <Card className="border-green-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Moderate Exercise (30-60 min)</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Brisk walking or jogging</li>
                <li>• Cycling or stationary bike</li>
                <li>• Group fitness class</li>
                <li>• Sports or recreational activities</li>
                <li>• Hiking on trails</li>
              </ul>
              <Badge className="mt-3 bg-slate-600 text-white">Boosts endorphins</Badge>
            </Card>

            <Card className="border-green-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Quick Energy Boosters (5-10 min)</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Jumping jacks or jump rope</li>
                <li>• Quick walk around the block</li>
                <li>• Desk stretches and shoulder rolls</li>
                <li>• 5-minute dance party</li>
                <li>• Sun salutations yoga sequence</li>
              </ul>
            </Card>
          </div>
        );

      case 'sleep':
        return (
          <div className="space-y-4">
            <Card className="border-blue-200 bg-blue-50 p-4">
              <h4 className="text-blue-900 mb-3">Sleep Hygiene Basics</h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• Keep consistent sleep/wake schedule</li>
                <li>• Bedroom dark, cool (60-67°F), quiet</li>
                <li>• No screens 1 hour before bed</li>
                <li>• Limit caffeine after 2pm</li>
                <li>• Reserve bed for sleep only</li>
              </ul>
            </Card>

            <Card className="border-blue-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Bedtime Routine (30-60 min)</h4>
              <ol className="space-y-2 text-slate-700 text-sm list-decimal list-inside">
                <li>Dim lights and lower temperature</li>
                <li>Light stretching or gentle yoga</li>
                <li>Warm bath or shower</li>
                <li>Reading (physical book, not screen)</li>
                <li>Relaxation or meditation</li>
              </ol>
            </Card>

            <Card className="border-blue-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">If You Can't Sleep</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• After 20 min awake, get out of bed</li>
                <li>• Do quiet activity in dim light</li>
                <li>• Return to bed when sleepy</li>
                <li>• Avoid clock-watching</li>
                <li>• Practice progressive muscle relaxation</li>
              </ul>
            </Card>
          </div>
        );

      case 'nutrition':
        return (
          <div className="space-y-4">
            <Card className="border-orange-200 bg-orange-50 p-4">
              <h4 className="text-orange-900 mb-3">Mood-Supporting Foods</h4>
              <ul className="space-y-2 text-orange-800 text-sm">
                <li>• Omega-3s: Salmon, walnuts, flaxseed</li>
                <li>• Probiotics: Yogurt, kefir, kimchi</li>
                <li>• Complex carbs: Whole grains, sweet potato</li>
                <li>• Leafy greens: Spinach, kale, chard</li>
                <li>• Berries: Blueberries, strawberries</li>
              </ul>
            </Card>

            <Card className="border-orange-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Eating Habits</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Eat regular meals (don't skip breakfast)</li>
                <li>• Stay hydrated (8 glasses water/day)</li>
                <li>• Limit alcohol and caffeine</li>
                <li>• Reduce processed foods and sugar</li>
                <li>• Eat mindfully, not while distracted</li>
              </ul>
            </Card>

            <Card className="border-orange-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Foods to Limit</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Excess caffeine (can worsen anxiety)</li>
                <li>• High sugar foods (mood crashes)</li>
                <li>• Alcohol (disrupts sleep, depressant)</li>
                <li>• Highly processed foods</li>
                <li>• Energy drinks</li>
              </ul>
            </Card>
          </div>
        );

      case 'connection':
        return (
          <div className="space-y-4">
            <Card className="border-pink-200 bg-pink-50 p-4">
              <h4 className="text-pink-900 mb-3">Building Connections</h4>
              <ul className="space-y-2 text-pink-800 text-sm">
                <li>• Reach out to a friend or family member</li>
                <li>• Join a support group or community</li>
                <li>• Volunteer for a cause you care about</li>
                <li>• Take a class or join a club</li>
                <li>• Connect with online communities</li>
              </ul>
            </Card>

            <Card className="border-pink-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Quality Conversations</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Ask open-ended questions</li>
                <li>• Practice active listening</li>
                <li>• Share vulnerably when appropriate</li>
                <li>• Schedule regular catch-ups</li>
                <li>• Put away phones during conversations</li>
              </ul>
            </Card>

            <Card className="border-pink-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Support Resources</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• NAMI Connection support groups</li>
                <li>• Depression and Bipolar Support Alliance</li>
                <li>• Anxiety and Depression Association groups</li>
                <li>• Mental Health America communities</li>
                <li>• Online peer support forums</li>
              </ul>
            </Card>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <Card className="border-slate-200 bg-slate-50 p-4">
              <h4 className="text-slate-900 mb-3">Trusted Resources</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• National Institute of Mental Health (NIMH)</li>
                <li>• Mental Health America (MHA)</li>
                <li>• National Alliance on Mental Illness (NAMI)</li>
                <li>• American Psychological Association (APA)</li>
                <li>• Anxiety & Depression Association (ADAA)</li>
              </ul>
            </Card>

            <Card className="border-slate-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Understanding Mental Health</h4>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li>• Mental health conditions are medical conditions</li>
                <li>• Treatment is effective and recovery is possible</li>
                <li>• Seeking help is a sign of strength</li>
                <li>• You're not alone - 1 in 5 adults experience mental illness</li>
                <li>• Therapy and medication can help</li>
              </ul>
            </Card>

            <Card className="border-slate-200 bg-white p-4">
              <h4 className="text-slate-900 mb-3">Common Conditions</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-900 text-sm">Depression</p>
                  <p className="text-slate-600 text-xs">Persistent sadness, loss of interest, fatigue</p>
                </div>
                <div>
                  <p className="text-slate-900 text-sm">Anxiety Disorders</p>
                  <p className="text-slate-600 text-xs">Excessive worry, panic, avoidance</p>
                </div>
                <div>
                  <p className="text-slate-900 text-sm">PTSD</p>
                  <p className="text-slate-600 text-xs">Trauma-related symptoms and flashbacks</p>
                </div>
                <div>
                  <p className="text-slate-900 text-sm">Bipolar Disorder</p>
                  <p className="text-slate-600 text-xs">Mood swings between depression and mania</p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return null;

    const Icon = category.icon;

    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-slate-600 hover:text-cyan-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <Icon className={`w-6 h-6 ${category.color}`} />
            <h2 className="text-slate-900">{category.title}</h2>
          </div>
          <p className="text-slate-600 text-sm ml-9">{category.description}</p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          {getResourceContent(selectedCategory)}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-6">
          <Button
            onClick={() => setSelectedCategory(null)}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white"
          >
            Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-cyan-600" />
            <h2 className="text-slate-900">Self-Care Resources</h2>
          </div>
          <button
            onClick={onBack}
            className="text-slate-600 hover:text-cyan-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-slate-600 text-sm">
          Evidence-based tools and practices for mental wellness
        </p>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <div className="grid gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`${category.bgColor} ${category.borderColor} border rounded-lg p-4 text-left hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className={`w-5 h-5 ${category.color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h3 className="text-slate-900 mb-1">{category.title}</h3>
                      <p className="text-slate-600 text-sm">{category.description}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${category.color} flex-shrink-0`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 p-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Return to Previous Screen
        </Button>
      </div>
    </div>
  );
}
