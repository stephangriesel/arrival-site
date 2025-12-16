import { useState } from 'react';
import { ChevronDown, ChevronUp, Bike, TrainFront, Waves } from 'lucide-react';

const RULES = [
    {
        id: 1,
        title: "Bike Paths are Lava",
        icon: Bike,
        description: "Do not run on red paths. You will get hit. Cyclists in Amsterdam are fast and silent. Stay on the sidewalk or designated pedestrian areas."
    },
    {
        id: 2,
        title: "Tram Tracks",
        icon: TrainFront,
        description: "Cross at 90-degree angles. Do not get your foot stuck. Trams have priority and cannot stop quickly. Always look both ways."
    },
    {
        id: 3,
        title: "Canal Safety",
        icon: Waves,
        description: "There are no railings. Watch your step at night. The water is cold and getting out is difficult. Keep a safe distance from the edge."
    }
];

export default function RulesAccordion() {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-3">
            {RULES.map((rule) => (
                <div key={rule.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <button
                        onClick={() => toggle(rule.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center">
                            <rule.icon className="w-5 h-5 text-accent mr-3" />
                            <span className="font-medium text-text">{rule.title}</span>
                        </div>
                        {openId === rule.id ? (
                            <ChevronUp className="w-4 h-4 text-text/60" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-text/60" />
                        )}
                    </button>

                    {openId === rule.id && (
                        <div className="px-4 pb-4 pt-0 text-sm text-text/80 leading-relaxed animate-fade-in">
                            <div className="pl-8 border-l border-white/10 ml-2">
                                {rule.description}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
