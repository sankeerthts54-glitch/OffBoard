import { useState } from 'react';
import { Globe2, Briefcase, HeartCrack, Palmtree, Users, Trash2, ArrowRight } from 'lucide-react';

const transitions = [
  {
    id: 'moving_abroad',
    emoji: '🌍',
    icon: Globe2,
    title: 'Moving Abroad',
    subtitle: 'Relocating to a new country',
    desc: 'Cancel geo-locked services, convert bank accounts, migrate global tools.',
    gradient: 'from-blue-500/20 to-indigo-600/20',
    glow: 'hover:shadow-blue-500/20',
    border: 'hover:border-blue-500/40',
    accent: 'text-blue-400',
    ring: 'border-blue-400/60',
  },
  {
    id: 'new_job',
    emoji: '💼',
    icon: Briefcase,
    title: 'New Job',
    subtitle: 'Switching employers or careers',
    desc: 'Transfer work tools, revoke corporate access, update billing details.',
    gradient: 'from-indigo-500/20 to-violet-600/20',
    glow: 'hover:shadow-indigo-500/20',
    border: 'hover:border-indigo-500/40',
    accent: 'text-indigo-400',
    ring: 'border-indigo-400/60',
  },
  {
    id: 'breakup',
    emoji: '💔',
    icon: HeartCrack,
    title: 'Breakup',
    subtitle: 'Separating shared digital lives',
    desc: 'Split shared subscriptions, remove shared access, secure personal accounts.',
    gradient: 'from-rose-500/20 to-pink-600/20',
    glow: 'hover:shadow-rose-500/20',
    border: 'hover:border-rose-500/40',
    accent: 'text-rose-400',
    ring: 'border-rose-400/60',
  },
  {
    id: 'retirement',
    emoji: '🌴',
    icon: Palmtree,
    title: 'Retirement',
    subtitle: 'Winding down professional accounts',
    desc: 'Close work accounts, simplify subscriptions, preserve important memories.',
    gradient: 'from-amber-500/20 to-orange-600/20',
    glow: 'hover:shadow-amber-500/20',
    border: 'hover:border-amber-500/40',
    accent: 'text-amber-400',
    ring: 'border-amber-400/60',
  },
  {
    id: 'family_affairs',
    emoji: '👨‍👩‍👧',
    icon: Users,
    title: 'Family Affairs',
    subtitle: "Managing a loved one's accounts",
    desc: 'Handle estate digital assets, transfer shared plans, memorialize accounts.',
    gradient: 'from-teal-500/20 to-cyan-600/20',
    glow: 'hover:shadow-teal-500/20',
    border: 'hover:border-teal-500/40',
    accent: 'text-teal-400',
    ring: 'border-teal-400/60',
  },
  {
    id: 'decluttering',
    emoji: '🧹',
    icon: Trash2,
    title: 'Decluttering',
    subtitle: 'Simplifying your digital footprint',
    desc: 'Cancel unused services, consolidate accounts, reduce digital noise.',
    gradient: 'from-gray-500/20 to-slate-600/20',
    glow: 'hover:shadow-gray-500/20',
    border: 'hover:border-gray-500/40',
    accent: 'text-gray-400',
    ring: 'border-gray-400/60',
  },
];

export default function TransitionPicker({ selected, onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero header */}
      <div className="text-center mb-10 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-xs text-gray-400 font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Step 1 of 5 · Choose Your Life Event
        </div>
        <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
          What's changing in<br />
          <span className="text-gradient">your life?</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          Our AI adapts its recommendations to your specific life transition.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transitions.map(({ id, emoji, icon: Icon, title, subtitle, desc, gradient, glow, border, accent, ring }) => {
          const isSelected = selected === id;
          const isHovered = hovered === id;

          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              className={`
                group relative flex flex-col items-start text-left p-6 rounded-2xl border-2 
                transition-all duration-300 overflow-hidden cursor-pointer
                ${isSelected
                  ? `bg-gradient-to-br ${gradient} border-2 ${ring} shadow-xl glow-indigo scale-[1.02]`
                  : `glass-card border-white/5 ${border} hover:shadow-2xl ${glow} hover:shadow-lg`
                }
              `}
            >
              {/* Background gradient blob */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 ${isSelected || isHovered ? 'opacity-100' : ''}`} />

              {/* Content */}
              <div className="relative z-10 w-full">
                {/* Icon row */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-4xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {emoji}
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-xs text-white font-semibold">Selected</span>
                    </div>
                  )}
                </div>

                <h3 className={`text-lg font-bold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-white'}`}>
                  {title}
                </h3>
                <p className={`text-xs font-medium mb-3 ${accent}`}>{subtitle}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>

                {/* CTA row */}
                <div className={`mt-4 flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 ${
                  isSelected ? accent : 'text-gray-600 group-hover:text-gray-400'
                }`}>
                  {isSelected ? 'Selected' : 'Select this'}
                  <ArrowRight size={12} className={`transition-transform ${isSelected ? 'translate-x-0.5' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection confirmation */}
      {selected && (
        <div className="text-center animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
            <span className="text-lg">{transitions.find(t => t.id === selected)?.emoji}</span>
            <span>
              <strong>{transitions.find(t => t.id === selected)?.title}</strong> selected — click "Next Step" to continue
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
