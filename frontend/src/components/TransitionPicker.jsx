import { Globe2, Briefcase, HeartCrack, Palmtree, Users, Trash2 } from 'lucide-react';

const transitions = [
  { id: 'moving_abroad', icon: Globe2, title: 'Moving Abroad', desc: 'Relocating to a new country' },
  { id: 'new_job', icon: Briefcase, title: 'New Job', desc: 'Switching employers or careers' },
  { id: 'breakup', icon: HeartCrack, title: 'Breakup', desc: 'Separating shared digital lives' },
  { id: 'retirement', icon: Palmtree, title: 'Retirement', desc: 'Winding down professional accounts' },
  { id: 'family_affairs', icon: Users, title: 'Family Affairs', desc: "Managing a loved one's accounts" },
  { id: 'decluttering', icon: Trash2, title: 'Decluttering', desc: 'Simplifying your digital footprint' },
];

export default function TransitionPicker({ selected, onSelect }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">What brings you here today?</h2>
        <p className="text-gray-400 text-lg">Select a life event so we can tailor our recommendations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {transitions.map(({ id, icon: Icon, title, desc }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all duration-200 group ${
              selected === id 
                ? 'border-primary-500 bg-primary-900/20 shadow-lg shadow-primary-900/20' 
                : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-750'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 transition-colors ${
              selected === id ? 'bg-primary-600/20 text-primary-400' : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600 group-hover:text-gray-300'
            }`}>
              <Icon size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
