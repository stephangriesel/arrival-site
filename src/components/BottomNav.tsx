import { Map, Zap, Info } from 'lucide-react';

interface BottomNavProps {
    currentPath?: string;
}

export default function BottomNav({ currentPath = '/' }: BottomNavProps) {
    const isActive = (path: string) => currentPath === path;

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-md border-t border-white/10 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                <a href="/" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/') ? 'text-accent' : 'text-text/60 hover:text-text hover:bg-white/5'}`}>
                    <Map className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Map</span>
                </a>
                <a href="/recover" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/recover') ? 'text-accent' : 'text-text/60 hover:text-text hover:bg-white/5'}`}>
                    <Zap className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Recover</span>
                </a>
                <a href="/info" className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/info') ? 'text-accent' : 'text-text/60 hover:text-text hover:bg-white/5'}`}>
                    <Info className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Info</span>
                </a>
            </div>
        </nav>
    );
}
