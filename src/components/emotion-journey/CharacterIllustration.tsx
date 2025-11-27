import { motion } from 'motion/react';
import { EmotionType } from './EmotionJourneyQuest';

interface CharacterIllustrationProps {
  emotion: EmotionType;
  characterType: 'child' | 'teen' | 'adult' | 'senior';
  variant?: 'neutral' | 'expressive';
}

export function CharacterIllustration({ 
  emotion, 
  characterType,
  variant = 'expressive' 
}: CharacterIllustrationProps) {
  return (
    <div className="relative w-full h-full flex items-end justify-center">
      {/* Character SVG Illustration */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        {characterType === 'child' && <ChildCharacter emotion={emotion} />}
        {characterType === 'teen' && <TeenCharacter emotion={emotion} />}
        {characterType === 'adult' && <AdultCharacter emotion={emotion} />}
        {characterType === 'senior' && <SeniorCharacter emotion={emotion} />}
      </motion.div>

      {/* Emotion particles/effects */}
      <EmotionParticles emotion={emotion} />
    </div>
  );
}

// Child Character Component
function ChildCharacter({ emotion }: { emotion: EmotionType }) {
  const getFaceColor = () => {
    if (emotion === 'angry') return '#ff6b6b';
    if (emotion === 'sad') return '#a8dadc';
    if (emotion === 'worried') return '#f4a261';
    return '#ffb5a7';
  };

  const getEyeShape = () => {
    switch (emotion) {
      case 'happy': return 'M20,35 Q25,32 30,35';
      case 'sad': return 'M20,38 Q25,40 30,38';
      case 'angry': return 'M18,36 L32,34';
      case 'worried': return 'M20,36 Q25,34 30,36';
      case 'confused': return 'M20,35 Q25,37 30,35';
      default: return 'M20,36 L30,36';
    }
  };

  const getMouthPath = () => {
    switch (emotion) {
      case 'happy': return 'M30,55 Q40,65 50,55';
      case 'sad': return 'M30,60 Q40,53 50,60';
      case 'angry': return 'M30,58 L50,58';
      case 'worried': return 'M30,57 Q40,55 50,57';
      case 'confused': return 'M30,57 L35,59 L45,56 L50,58';
      default: return 'M30,58 Q40,58 50,58';
    }
  };

  return (
    <svg width="200" height="300" viewBox="0 0 100 150" className="drop-shadow-2xl">
      {/* Body */}
      <motion.g
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Legs */}
        <rect x="32" y="100" width="12" height="35" fill="#64b5f6" rx="6" />
        <rect x="56" y="100" width="12" height="35" fill="#64b5f6" rx="6" />
        
        {/* Shoes */}
        <ellipse cx="38" cy="135" rx="8" ry="5" fill="#1976d2" />
        <ellipse cx="62" cy="135" rx="8" ry="5" fill="#1976d2" />

        {/* Torso */}
        <rect x="25" y="60" width="50" height="45" fill="#ff6f00" rx="8" />
        
        {/* Arms */}
        <motion.rect 
          x="15" y="65" width="10" height="30" fill={getFaceColor()} rx="5"
          animate={{
            rotate: emotion === 'happy' ? [0, 15, 0] : emotion === 'sad' ? -10 : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '20px 65px' }}
        />
        <motion.rect 
          x="75" y="65" width="10" height="30" fill={getFaceColor()} rx="5"
          animate={{
            rotate: emotion === 'happy' ? [0, -15, 0] : emotion === 'sad' ? 10 : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '80px 65px' }}
        />

        {/* Head */}
        <motion.circle 
          cx="50" cy="35" r="25" 
          fill={getFaceColor()}
          animate={{
            scale: emotion === 'worried' ? [1, 1.02, 1] : 1
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Hair */}
        <path d="M25,25 Q30,10 50,15 Q70,10 75,25 L75,35 Q65,30 50,30 Q35,30 25,35 Z" fill="#3e2723" />

        {/* Eyes */}
        <motion.g
          animate={{
            scaleY: emotion === 'sad' ? 0.8 : 1
          }}
        >
          <path d={getEyeShape()} stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" transform="translate(10,0)" />
          <path d={getEyeShape()} stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" transform="translate(30,0)" />
        </motion.g>

        {/* Eyebrows */}
        <motion.g
          animate={{
            y: emotion === 'angry' ? -2 : emotion === 'worried' ? -1 : 0,
            rotate: emotion === 'angry' ? -5 : 0
          }}
          style={{ transformOrigin: '40px 28px' }}
        >
          <path d="M27,28 Q32,26 37,28" stroke="#3e2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M63,28 Q58,26 53,28" stroke="#3e2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* Mouth */}
        <motion.path 
          d={getMouthPath()} 
          stroke="#d84315" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          animate={{
            d: emotion === 'happy' ? [
              'M30,55 Q40,65 50,55',
              'M30,55 Q40,68 50,55',
              'M30,55 Q40,65 50,55'
            ] : undefined
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Tears for sad */}
        {emotion === 'sad' && (
          <>
            <motion.ellipse
              cx="32" cy="42" rx="2" ry="4" fill="#4fc3f7"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: [0, 1, 0], y: [0, 15, 15] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
            />
            <motion.ellipse
              cx="68" cy="42" rx="2" ry="4" fill="#4fc3f7"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: [0, 1, 0], y: [0, 15, 15] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.7 }}
            />
          </>
        )}

        {/* Sweat drops for worried */}
        {emotion === 'worried' && (
          <motion.ellipse
            cx="72" cy="30" rx="3" ry="4" fill="#81d4fa"
            animate={{ y: [0, 8, 8], opacity: [1, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.g>
    </svg>
  );
}

// Teen Character Component
function TeenCharacter({ emotion }: { emotion: EmotionType }) {
  const getSkinTone = () => '#fdbcb4';

  return (
    <svg width="220" height="350" viewBox="0 0 110 175" className="drop-shadow-2xl">
      <motion.g
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Legs with jeans */}
        <rect x="38" y="120" width="14" height="45" fill="#2c3e50" rx="7" />
        <rect x="58" y="120" width="14" height="45" fill="#2c3e50" rx="7" />
        
        {/* Sneakers */}
        <ellipse cx="45" cy="165" rx="10" ry="6" fill="#e74c3c" />
        <ellipse cx="65" cy="165" rx="10" ry="6" fill="#e74c3c" />

        {/* Torso with hoodie */}
        <rect x="35" y="75" width="40" height="50" fill="#9b59b6" rx="8" />
        <path d="M35,75 Q30,80 30,90 L30,110 Q35,105 40,110 L40,85 Z" fill="#8e44ad" />
        <path d="M75,75 Q80,80 80,90 L80,110 Q75,105 70,110 L70,85 Z" fill="#8e44ad" />

        {/* Arms */}
        <motion.rect 
          x="23" y="80" width="12" height="35" fill={getSkinTone()} rx="6"
          animate={{
            rotate: emotion === 'happy' ? [0, 20, 0] : emotion === 'angry' ? [0, -15, 0] : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '29px 80px' }}
        />
        <motion.rect 
          x="75" y="80" width="12" height="35" fill={getSkinTone()} rx="6"
          animate={{
            rotate: emotion === 'happy' ? [0, -20, 0] : emotion === 'angry' ? [0, 15, 0] : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '81px 80px' }}
        />

        {/* Hands */}
        <circle cx="29" cy="115" r="7" fill={getSkinTone()} />
        <circle cx="81" cy="115" r="7" fill={getSkinTone()} />

        {/* Neck */}
        <rect x="47" y="60" width="16" height="15" fill={getSkinTone()} />

        {/* Head */}
        <ellipse cx="55" cy="42" rx="22" ry="26" fill={getSkinTone()} />

        {/* Hair - Modern style */}
        <path d="M33,35 Q35,18 45,15 Q55,13 65,15 Q75,18 77,35 L75,42 Q70,38 65,37 Q60,36 55,36 Q50,36 45,37 Q40,38 35,42 Z" fill="#34495e" />
        <ellipse cx="55" cy="20" rx="20" ry="18" fill="#34495e" />

        {/* Eyes with more detail */}
        <g>
          <ellipse cx="45" cy="42" rx="5" ry="6" fill="white" />
          <ellipse cx="65" cy="42" rx="5" ry="6" fill="white" />
          <motion.circle 
            cx="45" cy="43" r="3" fill="#2c3e50"
            animate={{
              x: emotion === 'worried' ? [-1, 1, -1] : 0,
              scaleY: emotion === 'sad' ? 0.7 : 1
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle 
            cx="65" cy="43" r="3" fill="#2c3e50"
            animate={{
              x: emotion === 'worried' ? [1, -1, 1] : 0,
              scaleY: emotion === 'sad' ? 0.7 : 1
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>

        {/* Eyebrows */}
        <motion.g
          animate={{
            y: emotion === 'angry' ? -3 : emotion === 'confused' ? [-1, 0, -1] : 0
          }}
          transition={{ duration: 1.5, repeat: emotion === 'confused' ? Infinity : 0 }}
        >
          <path 
            d={emotion === 'angry' ? "M37,35 L48,37" : "M37,36 Q42,34 48,36"} 
            stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round" 
          />
          <path 
            d={emotion === 'angry' ? "M62,37 L73,35" : "M62,36 Q67,34 73,36"} 
            stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round" 
          />
        </motion.g>

        {/* Nose */}
        <path d="M55,48 L55,53 M53,53 Q55,54 57,53" stroke={getSkinTone()} strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* Mouth with emotions */}
        <motion.path 
          d={
            emotion === 'happy' ? "M45,58 Q55,68 65,58" :
            emotion === 'sad' ? "M45,63 Q55,58 65,63" :
            emotion === 'angry' ? "M45,62 L65,62" :
            emotion === 'worried' ? "M45,61 Q50,59 55,61 Q60,59 65,61" :
            "M45,61 Q55,61 65,61"
          }
          stroke="#c0392b" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
        />

        {/* Phone in hand for teen vibe */}
        {emotion === 'worried' && (
          <rect x="22" y="108" width="10" height="15" fill="#34495e" rx="2" />
        )}

        {/* Tears for sad */}
        {emotion === 'sad' && (
          <>
            <motion.path
              d="M42,48 Q42,55 42,60"
              stroke="#4fc3f7"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <motion.path
              d="M68,48 Q68,55 68,60"
              stroke="#4fc3f7"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2 }}
            />
          </>
        )}
      </motion.g>
    </svg>
  );
}

// Adult Character Component  
function AdultCharacter({ emotion }: { emotion: EmotionType }) {
  return (
    <svg width="230" height="370" viewBox="0 0 115 185" className="drop-shadow-2xl">
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Professional attire */}
        <rect x="40" y="130" width="16" height="48" fill="#34495e" rx="8" />
        <rect x="59" y="130" width="16" height="48" fill="#34495e" rx="8" />
        
        {/* Shoes */}
        <rect x="38" y="175" width="18" height="8" fill="#1a1a1a" rx="4" />
        <rect x="59" y="175" width="18" height="8" fill="#1a1a1a" rx="4" />

        {/* Business suit */}
        <rect x="37" y="80" width="41" height="55" fill="#2c3e50" rx="6" />
        <rect x="45" y="82" width="25" height="53" fill="white" opacity="0.9" />
        
        {/* Tie */}
        <polygon points="57.5,82 57.5,125 60,115 63,125 63,82" fill="#e74c3c" />

        {/* Arms */}
        <motion.rect 
          x="25" y="85" width="12" height="38" fill="#d4a574" rx="6"
          animate={{
            rotate: emotion === 'happy' ? [0, 10, 0] : emotion === 'angry' ? -20 : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '31px 85px' }}
        />
        <motion.rect 
          x="78" y="85" width="12" height="38" fill="#d4a574" rx="6"
          animate={{
            rotate: emotion === 'happy' ? [0, -10, 0] : emotion === 'angry' ? 20 : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '84px 85px' }}
        />

        {/* Head */}
        <ellipse cx="57.5" cy="48" rx="24" ry="28" fill="#d4a574" />

        {/* Professional hairstyle */}
        <path d="M33,40 Q35,22 47,18 Q57.5,16 68,18 Q80,22 82,40 L80,48 Q75,42 70,40 Q65,38 57.5,38 Q50,38 45,40 Q40,42 35,48 Z" fill="#2c3e50" />

        {/* Glasses */}
        <g stroke="#2c3e50" strokeWidth="2" fill="none">
          <circle cx="47" cy="47" r="8" />
          <circle cx="68" cy="47" r="8" />
          <line x1="55" y1="47" x2="60" y2="47" />
        </g>

        {/* Eyes behind glasses */}
        <motion.circle 
          cx="47" cy="47" r="3" fill="#1a1a1a"
          animate={{ scaleY: emotion === 'sad' ? [1, 0.3, 1] : 1 }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle 
          cx="68" cy="47" r="3" fill="#1a1a1a"
          animate={{ scaleY: emotion === 'sad' ? [1, 0.3, 1] : 1 }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Mouth */}
        <motion.path 
          d={
            emotion === 'happy' ? "M47,64 Q57.5,72 68,64" :
            emotion === 'sad' ? "M47,67 Q57.5,62 68,67" :
            emotion === 'angry' ? "M47,66 L68,66" :
            "M47,65 Q57.5,65 68,65"
          }
          stroke="#c0392b" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
        />
      </motion.g>
    </svg>
  );
}

// Senior Character Component
function SeniorCharacter({ emotion }: { emotion: EmotionType }) {
  return (
    <svg width="210" height="360" viewBox="0 0 105 180" className="drop-shadow-2xl">
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Comfortable clothing */}
        <rect x="38" y="125" width="14" height="45" fill="#8b7355" rx="7" />
        <rect x="53" y="125" width="14" height="45" fill="#8b7355" rx="7" />
        
        {/* Comfortable shoes */}
        <ellipse cx="45" cy="170" rx="11" ry="6" fill="#654321" />
        <ellipse cx="60" cy="170" rx="11" ry="6" fill="#654321" />

        {/* Cardigan/Sweater */}
        <rect x="33" y="78" width="39" height="52" fill="#d4a574" rx="8" />
        <rect x="40" y="80" width="25" height="50" fill="#e8d5c4" />

        {/* Arms with cardigan sleeves */}
        <motion.rect 
          x="22" y="83" width="11" height="34" fill="#d4a574" rx="5.5"
          animate={{ rotate: emotion === 'happy' ? [0, 8, 0] : 0 }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ transformOrigin: '27.5px 83px' }}
        />
        <motion.rect 
          x="72" y="83" width="11" height="34" fill="#d4a574" rx="5.5"
          animate={{ rotate: emotion === 'happy' ? [0, -8, 0] : 0 }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ transformOrigin: '77.5px 83px' }}
        />

        {/* Head */}
        <ellipse cx="52.5" cy="46" rx="23" ry="27" fill="#e8c5a8" />

        {/* Gray hair */}
        <path d="M29,38 Q31,20 42,16 Q52.5,14 63,16 Q74,20 76,38 L74,46 Q69,42 64,40 Q58,38 52.5,38 Q47,38 41,40 Q36,42 31,46 Z" fill="#cccccc" />
        <ellipse cx="52.5" cy="22" rx="22" ry="17" fill="#cccccc" />

        {/* Gentle eyes */}
        <ellipse cx="43" cy="45" rx="4" ry="5" fill="white" />
        <ellipse cx="62" cy="45" rx="4" ry="5" fill="white" />
        <motion.circle 
          cx="43" cy="46" r="2.5" fill="#5d4037"
          animate={{ scaleY: emotion === 'sad' ? 0.6 : 1 }}
        />
        <motion.circle 
          cx="62" cy="46" r="2.5" fill="#5d4037"
          animate={{ scaleY: emotion === 'sad' ? 0.6 : 1 }}
        />

        {/* Smile lines */}
        <path d="M38,48 Q40,52 43,50" stroke="#d4a574" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M67,48 Q65,52 62,50" stroke="#d4a574" strokeWidth="1" fill="none" opacity="0.5" />

        {/* Gentle eyebrows */}
        <path d="M36,40 Q40,38 45,40" stroke="#999" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M60,40 Q65,38 69,40" stroke="#999" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Warm smile or emotional mouth */}
        <motion.path 
          d={
            emotion === 'happy' ? "M43,60 Q52.5,68 62,60" :
            emotion === 'sad' ? "M43,64 Q52.5,60 62,64" :
            "M43,62 Q52.5,63 62,62"
          }
          stroke="#c0392b" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />

        {/* Glasses on chain */}
        <g opacity="0.7">
          <rect x="40" y="78" width="8" height="6" fill="#444" rx="1" />
          <path d="M44,84 Q48,100 52,110" stroke="#888" strokeWidth="1" fill="none" />
        </g>

        {/* Tears for emotional moment */}
        {emotion === 'sad' && (
          <>
            <motion.circle
              cx="40" cy="50" r="1.5" fill="#81d4fa"
              animate={{ y: [0, 12, 12], opacity: [1, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.circle
              cx="65" cy="50" r="1.5" fill="#81d4fa"
              animate={{ y: [0, 12, 12], opacity: [1, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </motion.g>
    </svg>
  );
}

// Emotion Particles Component
function EmotionParticles({ emotion }: { emotion: EmotionType }) {
  const getParticleConfig = () => {
    switch (emotion) {
      case 'happy':
        return { particles: ['✨', '⭐', '💛', '🌟'], color: '#ffd700' };
      case 'sad':
        return { particles: ['💧', '☁️', '💙'], color: '#64b5f6' };
      case 'angry':
        return { particles: ['💢', '🔥', '💥'], color: '#f44336' };
      case 'worried':
        return { particles: ['😰', '💭', '❓'], color: '#ff9800' };
      case 'confused':
        return { particles: ['❓', '💭', '🤔'], color: '#9c27b0' };
      default:
        return { particles: ['✨', '💫'], color: '#90caf9' };
    }
  };

  const config = getParticleConfig();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {config.particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          initial={{
            x: '50%',
            y: '20%',
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: `${50 + (Math.cos(i * (360 / config.particles.length) * Math.PI / 180) * 40)}%`,
            y: `${20 + (Math.sin(i * (360 / config.particles.length) * Math.PI / 180) * 40)}%`,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          {particle}
        </motion.div>
      ))}
    </div>
  );
}
