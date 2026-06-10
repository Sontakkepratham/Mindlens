export type EmotionType = 'sad' | 'angry' | 'anxious' | 'numb' | 'overwhelmed' | 'happy' | 'confused';
export type CharacterMood = 'supportive' | 'energetic' | 'calm' | 'serious' | 'gentle';

export interface DialogueLine {
  speaker: string;
  text: string;
  characterEmotion?: EmotionType;
}

export interface SceneBranch {
  id: string;
  emotion: EmotionType;
  background: string;
  dialogue: DialogueLine[];
  insight: string;
  rewardBadge?: string;
  nextSceneHint?: string;
}

export interface Episode {
  id: number;
  title: string;
  subtitle: string;
  thumbnail: string;
  locked: boolean;
  unlockRequirement?: string;
  checkInPrompt: string;
  emotionOptions: EmotionType[];
  branches: SceneBranch[];
  cliffhanger: string;
  rewardType: 'badge' | 'skill' | 'background' | 'insight';
  rewardName: string;
}

export const EPISODES: Episode[] = [
  {
    id: 1,
    title: "Where Am I Today?",
    subtitle: "Emotion Check",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    locked: false,
    checkInPrompt: "Hey... I've been thinking about you. How are you feeling today?",
    emotionOptions: ['sad', 'angry', 'anxious', 'happy', 'overwhelmed'],
    branches: [
      {
        id: 'ep1-sad',
        emotion: 'sad',
        background: 'https://images.unsplash.com/photo-1762199904138-d163fe89540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwYmVkcm9vbSUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NDAwMzU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        dialogue: [
          { speaker: 'Guide', text: "I can see that heaviness in your eyes. It's okay to feel sad." },
          { speaker: 'You', text: "I just... everything feels so hard right now." },
          { speaker: 'Guide', text: "Sometimes sadness is our mind's way of asking us to slow down and take care of ourselves." },
          { speaker: 'Guide', text: "Let me share something with you..." },
        ],
        insight: "Sadness isn't weakness—it's a signal that something needs your attention.",
        rewardBadge: 'Emotional Awareness',
        nextSceneHint: 'patterns forming'
      },
      {
        id: 'ep1-angry',
        emotion: 'angry',
        background: 'https://images.unsplash.com/photo-1641175932432-b2c593ea8f17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZpbmclMjByb29tJTIwY296eSUyMHdhcm18ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        dialogue: [
          { speaker: 'Guide', text: "I can feel that fire. Something's been building up, hasn't it?" },
          { speaker: 'You', text: "I'm just so frustrated with everything!" },
          { speaker: 'Guide', text: "Anger is powerful. It tells us when our boundaries are being crossed." },
          { speaker: 'Guide', text: "But let's channel it into understanding, not destruction." },
        ],
        insight: "Anger is a messenger—listen to what it's trying to protect.",
        rewardBadge: 'Boundary Guardian'
      },
      {
        id: 'ep1-anxious',
        emotion: 'anxious',
        background: 'https://images.unsplash.com/photo-1761928299635-14d606d1a7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBmbG93ZXJzJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        dialogue: [
          { speaker: 'Guide', text: "Your mind is racing, isn't it? Like a storm you can't quiet." },
          { speaker: 'You', text: "I can't stop thinking about everything that could go wrong..." },
          { speaker: 'Guide', text: "Anxiety is trying to protect you, but it's working overtime." },
          { speaker: 'Guide', text: "Let's bring you back to this moment. Right here. Right now." },
        ],
        insight: "Anxiety lives in the future. Peace lives in the present.",
        rewardBadge: 'Present Moment Finder'
      },
      {
        id: 'ep1-happy',
        emotion: 'happy',
        background: 'https://images.unsplash.com/photo-1723324471072-7df0ffe08fa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwdGhlcmFweSUyMHJvb20lMjBwbGFudHN8ZW58MXx8fHwxNzY0MDAzNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        dialogue: [
          { speaker: 'Guide', text: "Look at that smile! Something good happened, didn't it?" },
          { speaker: 'You', text: "Yeah! I actually feel pretty good today." },
          { speaker: 'Guide', text: "This is important—remember this feeling. Store it away." },
          { speaker: 'Guide', text: "On hard days, you can come back to this moment." },
        ],
        insight: "Joy is a resource. Collect it like treasures for harder days.",
        rewardBadge: 'Joy Collector'
      },
      {
        id: 'ep1-overwhelmed',
        emotion: 'overwhelmed',
        background: 'https://images.unsplash.com/photo-1631885661118-5107a6111772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBlbXB0eXxlbnwxfHx8fDE3NjQwMDM1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        dialogue: [
          { speaker: 'Guide', text: "You're carrying too much, aren't you? I can see it weighing you down." },
          { speaker: 'You', text: "Everything is just... too much. I don't know where to start." },
          { speaker: 'Guide', text: "When everything feels like a mountain, we start with one pebble." },
          { speaker: 'Guide', text: "You don't have to solve it all today." },
        ],
        insight: "Overwhelm breaks when you focus on just the next small step.",
        rewardBadge: 'One Step Warrior'
      },
    ],
    cliffhanger: "Tomorrow, I want to show you something about your thoughts... patterns are forming that you need to see.",
    rewardType: 'badge',
    rewardName: 'Self-Awareness Seeker'
  },
  
  {
    id: 2,
    title: "Thought Tracker",
    subtitle: "Understanding Your Mind",
    thumbnail: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400",
    locked: false,
    checkInPrompt: "I've been noticing something... your thoughts have patterns. Want to see them?",
    emotionOptions: ['confused', 'anxious', 'sad', 'angry', 'overwhelmed'],
    branches: [
      {
        id: 'ep2-confused',
        emotion: 'confused',
        background: 'https://images.unsplash.com/photo-1762199904138-d163fe89540a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwYmVkcm9vbSUyMHBlYWNlZnVsfGVufDF8fHx8MTc2NDAwMzU4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        dialogue: [
          { speaker: 'Guide', text: "Your thoughts are like tangled yarn right now, aren't they?" },
          { speaker: 'You', text: "I don't even know what I'm feeling anymore..." },
          { speaker: 'Guide', text: "That's okay. Confusion means you're processing something complex." },
          { speaker: 'Guide', text: "Let's untangle one thread at a time." },
        ],
        insight: "Confusion is the first step to clarity—your mind is reorganizing.",
        rewardBadge: 'Clarity Seeker',
      },
      {
        id: 'ep2-anxious',
        emotion: 'anxious',
        background: 'https://images.unsplash.com/photo-1761928299635-14d606d1a7aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBmbG93ZXJzJTIwcGVhY2VmdWx8ZW58MXx8fHwxNzY0MDAzNTg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        dialogue: [
          { speaker: 'Guide', text: "Your thoughts are racing in circles, creating the same worry loop." },
          { speaker: 'You', text: "I keep thinking about the same things over and over..." },
          { speaker: 'Guide', text: "That's called rumination. Your brain thinks it's solving problems, but it's stuck." },
          { speaker: 'Guide', text: "Let me teach you how to break the loop." },
        ],
        insight: "Anxious thoughts repeat because they feel unresolved. Name them to tame them.",
        rewardBadge: 'Loop Breaker',
      },
    ],
    cliffhanger: "I see how your thoughts affect your actions... tomorrow, we explore your behavior patterns.",
    rewardType: 'skill',
    rewardName: 'Thought Labeling Technique'
  },

  {
    id: 3,
    title: "Behaviour Mirror",
    subtitle: "Actions That Speak",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    locked: false,
    checkInPrompt: "Your actions tell a story your words don't always say. Let's look at them together.",
    emotionOptions: ['sad', 'angry', 'anxious', 'numb', 'happy'],
    branches: [
      {
        id: 'ep3-numb',
        emotion: 'numb',
        background: 'https://images.unsplash.com/photo-1631885661118-5107a6111772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjbGFzc3Jvb20lMjBlbXB0eXxlbnwxfHx8fDE3NjQwMDM1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        dialogue: [
          { speaker: 'Guide', text: "You're going through the motions, but you're not really there, are you?" },
          { speaker: 'You', text: "I just feel... nothing. Like I'm watching my life from outside." },
          { speaker: 'Guide', text: "Numbness is protection. Your mind is shielding you from overwhelm." },
          { speaker: 'Guide', text: "But we need to reconnect you, slowly and safely." },
        ],
        insight: "Numbness is your psyche's emergency brake—it kept you safe, but now we can ease off.",
        rewardBadge: 'Reconnection Starter',
      },
    ],
    cliffhanger: "I noticed something about what triggers these patterns... we need to talk about it tomorrow.",
    rewardType: 'insight',
    rewardName: 'Behavioral Pattern Map'
  },

  {
    id: 4,
    title: "Trigger Map",
    subtitle: "What Sets You Off",
    thumbnail: "https://images.unsplash.com/photo-1551847812-4-65a28e6e5?w=400",
    locked: true,
    unlockRequirement: "Complete 3 episodes",
    checkInPrompt: "Ready to see what's been triggering these emotions? This might be intense.",
    emotionOptions: ['anxious', 'angry', 'sad', 'overwhelmed', 'numb'],
    branches: [],
    cliffhanger: "These triggers... they're connected to something deeper. Tomorrow, we go into your past.",
    rewardType: 'skill',
    rewardName: 'Trigger Recognition Tool'
  },

  {
    id: 5,
    title: "Patterns from the Past",
    subtitle: "Where It All Began",
    thumbnail: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400",
    locked: true,
    unlockRequirement: "Complete Episode 4",
    checkInPrompt: "This is the episode where it clicks. Where do your patterns come from?",
    emotionOptions: ['sad', 'confused', 'overwhelmed', 'angry', 'anxious'],
    branches: [],
    cliffhanger: "Now that you see the pattern... how do you break it? Tomorrow: conflict.",
    rewardType: 'insight',
    rewardName: 'Origin Story Revealed'
  },

  {
    id: 6,
    title: "Handling Conflicts",
    subtitle: "When Things Get Hard",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    locked: true,
    unlockRequirement: "Complete Episode 5",
    checkInPrompt: "Conflict is where we see who we really are. How do YOU show up?",
    emotionOptions: ['angry', 'anxious', 'overwhelmed', 'sad', 'confused'],
    branches: [],
    cliffhanger: "You handled that differently than I expected... let's talk about relationships.",
    rewardType: 'skill',
    rewardName: 'Healthy Conflict Response'
  },

  {
    id: 7,
    title: "Relationships",
    subtitle: "Friends, Family, Self",
    thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
    locked: true,
    unlockRequirement: "Complete Episode 6",
    checkInPrompt: "Let's talk about how you show up with others... and with yourself.",
    emotionOptions: ['sad', 'happy', 'confused', 'anxious', 'overwhelmed'],
    branches: [],
    cliffhanger: "The way you treat yourself affects everything... tomorrow, we build your toolbox.",
    rewardType: 'insight',
    rewardName: 'Relationship Pattern Insight'
  },

  {
    id: 8,
    title: "Coping Toolbox",
    subtitle: "Tools for Hard Days",
    thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
    locked: true,
    unlockRequirement: "Complete Episode 7",
    checkInPrompt: "You've learned so much. Now let's build your personal toolkit.",
    emotionOptions: ['anxious', 'sad', 'overwhelmed', 'happy', 'angry'],
    branches: [],
    cliffhanger: "Your toolkit is ready... but there's one more thing you need to find.",
    rewardType: 'skill',
    rewardName: 'Personal Coping Arsenal'
  },

  {
    id: 9,
    title: "Internal Strength",
    subtitle: "The Power You Forgot You Had",
    thumbnail: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400",
    locked: true,
    unlockRequirement: "Complete Episode 8",
    checkInPrompt: "You've been stronger than you realized all along. Let me show you.",
    emotionOptions: ['happy', 'sad', 'confused', 'overwhelmed', 'anxious'],
    branches: [],
    cliffhanger: "Everything's been leading to this moment... tomorrow, your breakthrough.",
    rewardType: 'badge',
    rewardName: 'Inner Warrior Awakened'
  },

  {
    id: 10,
    title: "Mini Breakthrough",
    subtitle: "The Moment It Clicks",
    thumbnail: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400",
    locked: true,
    unlockRequirement: "Complete Episode 9",
    checkInPrompt: "This is it. The moment where everything makes sense.",
    emotionOptions: ['happy', 'sad', 'overwhelmed', 'anxious', 'confused'],
    branches: [],
    cliffhanger: "Your journey doesn't end here... new episodes unlock as you continue growing.",
    rewardType: 'badge',
    rewardName: 'Breakthrough Champion'
  },
];
