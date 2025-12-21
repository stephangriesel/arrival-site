import { useState } from 'react';
import { Plane, Clock, Sun } from 'lucide-react';

const CITIES = [
    { name: 'New York (EST)', offset: -5 },
    { name: 'Los Angeles (PST)', offset: -8 },
    { name: 'London (GMT)', offset: 0 },
    { name: 'Paris (CET)', offset: 1 },
    { name: 'Berlin (CET)', offset: 1 },
    { name: 'Tokyo (JST)', offset: 9 },
    { name: 'Sydney (AEDT)', offset: 11 },
    { name: 'Dubai (GST)', offset: 4 },
    { name: 'Singapore (SGT)', offset: 8 },
    { name: 'Hong Kong (HKT)', offset: 8 },
    { name: 'Cape Town (SAST)', offset: 2 },
    { name: 'Rio de Janeiro (BRT)', offset: -3 },
    { name: 'Chicago (CST)', offset: -6 },
    { name: 'San Francisco (PST)', offset: -8 },
    { name: 'Toronto (EST)', offset: -5 },
    { name: 'Vancouver (PST)', offset: -8 },
    { name: 'Seoul (KST)', offset: 9 },
    { name: 'Mumbai (IST)', offset: 5.5 },
    { name: 'Shanghai (CST)', offset: 8 },
    { name: 'Bangkok (ICT)', offset: 7 },
];

export default function JetLagCalculator() {
    const [homeZoneOffset, setHomeZoneOffset] = useState<number>(-5); // Default to NY
    const [landingTime, setLandingTime] = useState('08:00');
    const [recommendation, setRecommendation] = useState<{ action: string; reason: string } | null>(null);

    const calculateRunWindow = () => {
        const amsOffset = 1; // Amsterdam is UTC+1 (Standard)

        // Eastward travel: Home is behind destination (e.g., NY -5 < AMS +1)
        if (homeZoneOffset < amsOffset) {
            setRecommendation({
                action: "Seek Morning Light (10am - 2pm)",
                reason: "Traveling East effectively shortens your day. Exposure to morning light helps advance your circadian rhythm to align with the new earlier time zone."
            });
        }
        // Westward travel: Home is ahead of destination (e.g., Tokyo +9 > AMS +1)
        else if (homeZoneOffset > amsOffset) {
            setRecommendation({
                action: "Seek Afternoon Light (2pm - 6pm)",
                reason: "Traveling West effectively lengthens your day. Exposure to afternoon light helps delay your circadian rhythm to align with the new later time zone."
            });
        }
        // Same timezone
        else {
            setRecommendation({
                action: "No major adjustment needed.",
                reason: "You are in a similar time zone. Run whenever you feel energetic!"
            });
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
                            value={homeZoneOffset}
                            onChange={(e) => setHomeZoneOffset(Number(e.target.value))}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-text focus:outline-none focus:border-accent transition-colors appearance-none"
                        >
                            {CITIES.map((city) => (
                                <option key={city.name} value={city.offset}>
                                    {city.name}
                                </option>
                            ))}
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
                            <div className="flex flex-col">
                                <p className="text-accent font-bold text-lg mb-2">
                                    {recommendation.action}
                                </p>
                                <p className="text-text/80 text-sm leading-relaxed">
                                    {recommendation.reason}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
