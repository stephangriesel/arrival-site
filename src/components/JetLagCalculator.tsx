import { useState } from 'react';
import { Plane, Clock, Sun } from 'lucide-react';

export default function JetLagCalculator() {
    const [homeZone, setHomeZone] = useState('EST');
    const [landingTime, setLandingTime] = useState('08:00');
    const [recommendation, setRecommendation] = useState<string | null>(null);

    const calculateRunWindow = () => {
        // Simplified logic as requested:
        // If Home (EST) is behind Destination (AMS - implied context), it's Eastward Travel.
        // For this MVP, we assume the user is traveling East (e.g. NY to AMS).

        if (homeZone === 'EST') {
            setRecommendation("Morning Light (10am-2pm)");
        } else {
            // Fallback or other logic could go here
            setRecommendation("Morning Light (10am-2pm)");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-6">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-center mb-8">
                    <Plane className="w-8 h-8 text-accent mr-3" />
                    <h2 className="text-2xl font-bold text-text">Jet Lag Recovery</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text/60 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Home Time Zone
                        </label>
                        <select
                            value={homeZone}
                            onChange={(e) => setHomeZone(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors appearance-none"
                        >
                            <option value="EST">New York (EST)</option>
                            <option value="PST">Los Angeles (PST)</option>
                            <option value="GMT">London (GMT)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text/60 mb-2 flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Landing Time
                        </label>
                        <input
                            type="time"
                            value={landingTime}
                            onChange={(e) => setLandingTime(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>

                    <button
                        onClick={calculateRunWindow}
                        className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-4 rounded-lg transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(255,159,28,0.3)]"
                    >
                        Calculate Run Window
                    </button>
                </div>

                {recommendation && (
                    <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-xl animate-fade-in">
                        <div className="flex items-start">
                            <Sun className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" />
                            <p className="text-accent font-medium leading-relaxed">
                                {recommendation}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
