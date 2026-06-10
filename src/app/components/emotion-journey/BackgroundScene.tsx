import { motion } from 'motion/react';

interface BackgroundSceneProps {
  sceneType: string;
}

export function BackgroundScene({ sceneType }: BackgroundSceneProps) {
  switch (sceneType) {
    case 'playground':
      return <PlaygroundScene />;
    case 'bedroom':
      return <BedroomScene />;
    case 'school':
      return <SchoolScene />;
    case 'home':
    case 'living-room':
      return <LivingRoomScene />;
    case 'garden':
      return <GardenScene />;
    default:
      return <DefaultScene />;
  }
}

function PlaygroundScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #90EE90 100%)' }}>
      {/* Sky and clouds */}
      <motion.div
        className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full shadow-2xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-6 bg-yellow-200 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transformOrigin: 'center',
              transform: `rotate(${i * 45}deg) translateY(-20px)`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
      </motion.div>

      {/* Animated clouds */}
      <motion.div
        className="absolute top-16 left-10 w-40 h-20 bg-white rounded-full opacity-80 shadow-lg"
        animate={{ x: [0, 150, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -left-8 top-4 w-24 h-16 bg-white rounded-full" />
        <div className="absolute -right-8 top-4 w-28 h-16 bg-white rounded-full" />
      </motion.div>

      <motion.div
        className="absolute top-32 right-20 w-32 h-16 bg-white rounded-full opacity-70 shadow-lg"
        animate={{ x: [0, -120, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -left-6 top-2 w-20 h-12 bg-white rounded-full" />
      </motion.div>

      {/* Playground equipment */}
      {/* Swing set */}
      <div className="absolute bottom-0 left-32">
        <div className="flex gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="relative">
              <div className="absolute top-0 w-1 h-48 bg-slate-600 left-0" />
              <div className="absolute top-0 w-1 h-48 bg-slate-600 right-0" style={{ width: '40px' }} />
              <motion.div
                className="absolute top-48 left-0 w-10 h-3 bg-amber-800 rounded"
                animate={{ rotate: [0, 8, 0, -8, 0] }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                style={{ transformOrigin: 'top center' }}
              >
                <div className="absolute -top-48 left-0 w-0.5 h-48 bg-slate-400" />
                <div className="absolute -top-48 right-0 w-0.5 h-48 bg-slate-400" />
              </motion.div>
            </div>
          ))}
        </div>
        <div className="absolute top-0 w-24 h-2 bg-slate-700 rounded" />
      </div>

      {/* Tree */}
      <div className="absolute bottom-0 right-32">
        <div className="w-8 h-32 bg-gradient-to-b from-amber-700 to-amber-900 mx-auto" style={{ clipPath: 'polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)' }} />
        <div className="relative -mt-20">
          <div className="w-32 h-32 bg-green-600 rounded-full mx-auto opacity-90" />
          <div className="absolute top-4 left-4 w-24 h-24 bg-green-500 rounded-full opacity-80" />
          <div className="absolute top-0 right-4 w-20 h-20 bg-green-700 rounded-full opacity-70" />
        </div>
      </div>

      {/* Grass details */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-10 h-6 bg-green-700 rounded-t-full opacity-60"
          style={{ left: `${i * 5}%` }}
          animate={{ scaleY: [1, 1.15, 1], scaleX: [1, 0.95, 1] }}
          transition={{ duration: 2.5, delay: i * 0.15, repeat: Infinity }}
        />
      ))}

      {/* Birds flying */}
      <motion.div
        className="absolute top-24"
        animate={{
          x: [0, window.innerWidth, 0],
          y: [100, 80, 120, 100],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg width="30" height="20" viewBox="0 0 30 20">
          <path d="M5,10 Q10,5 15,10 M15,10 Q20,5 25,10" stroke="#333" strokeWidth="2" fill="none" />
        </svg>
      </motion.div>
    </div>
  );
}

function BedroomScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #4A4A6A 0%, #6A5A7A 50%, #8A7A9A 100%)' }}>
      {/* Window with night sky */}
      <div className="absolute top-10 right-20 w-40 h-48 bg-gradient-to-b from-indigo-900 to-indigo-800 rounded-2xl border-4 border-amber-100 shadow-2xl overflow-hidden">
        {/* Moon */}
        <motion.div
          className="absolute top-8 right-8 w-16 h-16 bg-yellow-100 rounded-full shadow-lg"
          animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {/* Moon craters */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-200 rounded-full opacity-40" />
          <div className="absolute bottom-3 right-3 w-4 h-4 bg-yellow-200 rounded-full opacity-30" />
        </motion.div>

        {/* Stars twinkling */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2 + Math.random() * 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}

        {/* Window panes */}
        <div className="absolute inset-0 grid grid-cols-2 gap-1">
          <div className="border-r-2 border-amber-100/30" />
          <div />
        </div>
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-100/30" />
      </div>

      {/* Bedside lamp */}
      <div className="absolute bottom-24 left-20">
        <div className="w-3 h-24 bg-amber-800 mx-auto" />
        <motion.div
          className="w-16 h-16 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full -mt-2"
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-40" />
        </motion.div>
        <div className="w-12 h-2 bg-amber-900 mx-auto rounded-full" />
      </div>

      {/* Bed frame visible at bottom */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-20 bg-amber-900 rounded-t-2xl border-t-4 border-amber-700">
        <div className="absolute inset-x-0 top-0 h-10 bg-blue-400 rounded-t-2xl opacity-70" />
        <div className="absolute left-4 -top-8 w-12 h-12 bg-white rounded-lg opacity-60" />
      </div>

      {/* Scattered toys */}
      <div className="absolute bottom-4 left-12 w-8 h-8 bg-red-500 rounded" />
      <div className="absolute bottom-6 right-32 w-6 h-10 bg-blue-500 rounded-t-full" />
    </div>
  );
}

function SchoolScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #B0E0E6 0%, #87CEEB 50%, #B0C4DE 100%)' }}>
      {/* Chalkboard */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-56 bg-slate-800 rounded-lg border-8 border-amber-900 shadow-2xl">
        {/* Chalk writing */}
        <div className="p-6 text-white font-mono opacity-80">
          <div className="text-sm mb-4">Today's Lesson:</div>
          <div className="text-lg mb-2">Emotions & Feelings</div>
          <motion.div
            className="w-32 h-0.5 bg-white"
            animate={{ width: [0, 128, 128] }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <div className="mt-4 text-sm">
            <div>• Happy 😊</div>
            <div>• Sad 😢</div>
            <div>• Worried 😰</div>
          </div>
        </div>

        {/* Chalk tray */}
        <div className="absolute bottom-2 left-4 right-4 h-3 bg-amber-800 rounded flex items-center justify-around px-2">
          <div className="w-2 h-2 bg-white rounded-full" />
          <div className="w-2 h-2 bg-yellow-200 rounded-full" />
          <div className="w-2 h-2 bg-pink-200 rounded-full" />
        </div>
      </div>

      {/* Student desks */}
      <div className="absolute bottom-0 left-16 w-16 h-20 bg-amber-600 rounded-t-lg">
        <div className="w-full h-2 bg-amber-700 mt-12" />
      </div>
      <div className="absolute bottom-0 right-16 w-16 h-20 bg-amber-600 rounded-t-lg">
        <div className="w-full h-2 bg-amber-700 mt-12" />
      </div>

      {/* Books stacked */}
      <div className="absolute bottom-4 left-20 space-y-1">
        <div className="w-12 h-3 bg-red-600 rounded-sm" />
        <div className="w-12 h-3 bg-blue-600 rounded-sm" />
        <div className="w-12 h-3 bg-green-600 rounded-sm" />
      </div>

      {/* Clock on wall */}
      <motion.div
        className="absolute top-20 right-12 w-16 h-16 bg-white rounded-full border-4 border-slate-700 shadow-lg"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-slate-700 -translate-x-1/2 -translate-y-full origin-bottom" />
        <div className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-red-600 -translate-x-1/2 -translate-y-full origin-bottom rotate-90" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-slate-700 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
    </div>
  );
}

function LivingRoomScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #FFE4B5 0%, #FFDAB9 50%, #F5DEB3 100%)' }}>
      {/* Photo frame on wall */}
      <div className="absolute top-12 left-12 w-32 h-40 bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg shadow-2xl p-3 rotate-[-2deg]">
        <div className="w-full h-full bg-gradient-to-br from-blue-200 to-green-200 rounded flex items-center justify-center">
          <span className="text-4xl">👨‍👩‍👧‍👦</span>
        </div>
      </div>

      {/* Window with curtains */}
      <div className="absolute top-8 right-16 w-48 h-56">
        <div className="absolute inset-0 bg-sky-200 rounded-lg border-4 border-white shadow-lg" />
        
        {/* Curtains */}
        <motion.div
          className="absolute -left-4 top-0 bottom-0 w-12 bg-gradient-to-r from-red-600 to-red-700 rounded-r-3xl"
          animate={{ x: [-5, 0, -5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-4 top-0 bottom-0 w-12 bg-gradient-to-l from-red-600 to-red-700 rounded-l-3xl"
          animate={{ x: [5, 0, 5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Curtain rod */}
        <div className="absolute -top-2 -left-6 right-[-24px] h-1 bg-amber-900 rounded-full" />
      </div>

      {/* Couch */}
      <div className="absolute bottom-0 left-1/4 w-64 h-32">
        {/* Backrest */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-blue-600 to-blue-700 rounded-t-3xl" />
        {/* Seat */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-blue-700 rounded-t-lg" />
        {/* Cushions */}
        <div className="absolute bottom-12 left-4 w-12 h-12 bg-blue-500 rounded-lg rotate-12" />
        <div className="absolute bottom-12 right-4 w-12 h-12 bg-blue-500 rounded-lg rotate-[-12deg]" />
        {/* Armrests */}
        <div className="absolute left-0 bottom-0 w-8 h-24 bg-blue-800 rounded-l-xl" />
        <div className="absolute right-0 bottom-0 w-8 h-24 bg-blue-800 rounded-r-xl" />
      </div>

      {/* Coffee table */}
      <div className="absolute bottom-4 right-24 w-32 h-3 bg-amber-800 rounded-lg shadow-lg">
        <div className="absolute -top-12 left-4 right-4 h-12 bg-amber-700/50 rounded-lg border-4 border-amber-800" />
        <div className="absolute -bottom-8 left-8 w-2 h-8 bg-amber-900" />
        <div className="absolute -bottom-8 right-8 w-2 h-8 bg-amber-900" />
      </div>

      {/* Lamp glow */}
      <motion.div
        className="absolute top-1/3 right-32 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}

function GardenScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #98FB98 50%, #90EE90 100%)' }}>
      {/* Garden flowers */}
      {[...Array(12)].map((_, i) => {
        const colors = ['#FF69B4', '#FF1493', '#FF6B9D', '#FFB6C1', '#FFA07A', '#FFD700'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute bottom-0"
            style={{ left: `${i * 8 + 5}%` }}
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 5, 0, -5, 0] 
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              delay: i * 0.2, 
              repeat: Infinity 
            }}
          >
            {/* Stem */}
            <div className="w-1 h-16 bg-green-700 mx-auto" />
            
            {/* Flower petals */}
            <div className="relative -mt-2">
              {[...Array(6)].map((_, j) => (
                <div
                  key={j}
                  className="absolute w-4 h-6 rounded-full"
                  style={{
                    background: randomColor,
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${j * 60}deg) translateY(-6px)`,
                    transformOrigin: 'center',
                  }}
                />
              ))}
              {/* Flower center */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full z-10" />
            </div>
          </motion.div>
        );
      })}

      {/* Butterfly */}
      <motion.div
        className="absolute"
        animate={{
          x: [50, 300, 200, 400, 50],
          y: [100, 80, 150, 90, 100],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          {/* Left wing */}
          <motion.ellipse
            cx="15" cy="20" rx="10" ry="12"
            fill="#FF69B4"
            animate={{ scaleX: [1, 1.2, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          {/* Right wing */}
          <motion.ellipse
            cx="25" cy="20" rx="10" ry="12"
            fill="#FF1493"
            animate={{ scaleX: [1, 1.2, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          {/* Body */}
          <ellipse cx="20" cy="20" rx="2" ry="8" fill="#4A4A4A" />
          {/* Antennae */}
          <path d="M20,12 Q18,8 16,6" stroke="#4A4A4A" strokeWidth="1" fill="none" />
          <path d="M20,12 Q22,8 24,6" stroke="#4A4A4A" strokeWidth="1" fill="none" />
        </svg>
      </motion.div>

      {/* Garden fence */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-around items-end h-16">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="w-2 bg-white h-full"
            style={{ 
              height: i % 2 === 0 ? '100%' : '80%',
              opacity: 0.7 
            }}
          />
        ))}
      </div>

      {/* Grass blades */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-8 h-8 bg-green-600 opacity-40"
          style={{ 
            left: `${i * 3.3}%`,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' 
          }}
          animate={{ scaleY: [1, 1.2, 1] }}
          transition={{ 
            duration: 2, 
            delay: i * 0.1, 
            repeat: Infinity 
          }}
        />
      ))}
    </div>
  );
}

function DefaultScene() {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)' }} />
  );
}
