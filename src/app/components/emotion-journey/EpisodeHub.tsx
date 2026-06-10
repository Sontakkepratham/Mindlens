import { motion } from 'motion/react';
import { Lock, Play, CheckCircle } from 'lucide-react';
import { Episode } from './EpisodeData';

interface EpisodeHubProps {
  episodes: Episode[];
  completedEpisodes: number[];
  onSelectEpisode: (episodeId: number) => void;
  onBack: () => void;
}

export function EpisodeHub({ episodes, completedEpisodes, onSelectEpisode, onBack }: EpisodeHubProps) {
  const isEpisodeUnlocked = (episode: Episode): boolean => {
    if (!episode.locked) return true;
    
    // Check unlock requirements
    if (episode.unlockRequirement?.includes('Complete 3 episodes')) {
      return completedEpisodes.length >= 3;
    }
    if (episode.unlockRequirement?.includes('Complete Episode')) {
      const requiredEpisode = parseInt(episode.unlockRequirement.match(/\d+/)?.[0] || '0');
      return completedEpisodes.includes(requiredEpisode);
    }
    
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h1 className="text-white text-2xl font-semibold">Emotion Journey</h1>
              <p className="text-white/60 text-sm">10 Episodes • Mental Health Story</p>
            </div>

            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Episode Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes.map((episode, index) => {
            const isCompleted = completedEpisodes.includes(episode.id);
            const isUnlocked = isEpisodeUnlocked(episode);

            return (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => isUnlocked && onSelectEpisode(episode.id)}
                  disabled={!isUnlocked}
                  className={`
                    relative w-full group
                    ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
                  `}
                >
                  {/* Episode Card */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border border-white/10">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${episode.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </div>

                    {/* Episode Number Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-full px-4 py-2">
                        <span className="text-white text-sm font-semibold">Episode {episode.id}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      {isCompleted ? (
                        <div className="bg-green-500/20 backdrop-blur-xl border border-green-400/50 rounded-full p-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      ) : !isUnlocked ? (
                        <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/50 rounded-full p-2">
                          <Lock className="w-5 h-5 text-red-400" />
                        </div>
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {episode.title}
                      </h3>
                      <p className="text-white/70 text-sm mb-4">
                        {episode.subtitle}
                      </p>

                      {/* Play Button or Lock Message */}
                      {isUnlocked ? (
                        <div className="flex items-center gap-2 text-[#7B9FDB] group-hover:text-white transition-colors">
                          <Play className="w-5 h-5" fill="currentColor" />
                          <span className="font-medium">
                            {isCompleted ? 'Play Again' : 'Start Episode'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">{episode.unlockRequirement}</span>
                        </div>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    {isUnlocked && (
                      <div className="absolute inset-0 bg-[#7B9FDB]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
        >
          <h3 className="text-white text-xl font-semibold mb-2">Your Progress</h3>
          <p className="text-white/70 mb-4">
            {completedEpisodes.length} of {episodes.length} Episodes Completed
          </p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#7B9FDB] to-[#D4D0F0]"
              initial={{ width: 0 }}
              animate={{ width: `${(completedEpisodes.length / episodes.length) * 100}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>

          {completedEpisodes.length === episodes.length && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[#7B9FDB] font-semibold mt-4"
            >
              🎉 All Episodes Complete! You're a Mental Health Champion!
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
