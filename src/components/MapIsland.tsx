import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { Locate } from 'lucide-react';

// Route Data
const ROUTES = {
    sanctuary: {
        name: 'Park',
        color: '#FF9F1C', // Neon Orange
        center: [52.3580, 4.8686] as [number, number],
        zoom: 14,
        distance: '4.22km',
        dataFile: '/data/routes/sanctuary.json'
    },
    city: {
        name: 'City',
        color: '#FF00FF', // Neon Pink
        center: [52.3650, 4.8900] as [number, number],
        zoom: 13,
        distance: '8.5km',
        dataFile: '/data/routes/city.json'
    },
    river: {
        name: 'River',
        color: '#39FF14', // Neon Green/Blue
        center: [52.3500, 4.9100] as [number, number],
        zoom: 13,
        distance: '10km',
        dataFile: '/data/routes/river.json'
    }
};

type RouteKey = keyof typeof ROUTES;

// Component to handle map view updates and expose instance
function MapController({ center, zoom, onMapReady }: { center: [number, number], zoom: number, onMapReady: (map: LeafletMap) => void }) {
    const map = useMap();
    useEffect(() => {
        onMapReady(map);
    }, [map, onMapReady]); // Ensure map is registered

    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapIsland() {
    const [isMounted, setIsMounted] = useState(false);
    const [activeRoute, setActiveRoute] = useState<RouteKey>('sanctuary');
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [routePath, setRoutePath] = useState<[number, number][]>([]);
    const mapRef = useRef<LeafletMap | null>(null);

    useEffect(() => {
        setIsMounted(true);

        // Get User Location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    // Fetch Route Data when activeRoute changes
    useEffect(() => {
        const fetchRouteData = async () => {
            try {
                const response = await fetch(ROUTES[activeRoute].dataFile);
                const data = await response.json();
                setRoutePath(data);
            } catch (error) {
                console.error("Failed to load route data:", error);
                setRoutePath([]); // Clear path on error
            }
        };

        fetchRouteData();
    }, [activeRoute]);

    const handleLocateMe = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.flyTo(userLocation, 15);
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLoc: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setUserLocation(newLoc);
                    if (mapRef.current) {
                        mapRef.current.flyTo(newLoc, 15);
                    }
                },
                (error) => console.error("Error locating:", error)
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };

    if (!isMounted) {
        return <div className="h-full w-full bg-background flex items-center justify-center text-text">Loading Map...</div>;
    }

    const currentRoute = ROUTES[activeRoute];

    return (
        <div className="h-full w-full absolute top-0 left-0 z-0">
            <MapContainer
                center={currentRoute.center}
                zoom={currentRoute.zoom}
                scrollWheelZoom={true}
                className="h-full w-full"
                zoomControl={false}
            >
                <MapController
                    center={currentRoute.center}
                    zoom={currentRoute.zoom}
                    onMapReady={(map) => { mapRef.current = map; }}
                />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Active Route Polyline */}
                {routePath.length > 0 && (
                    <Polyline
                        key={activeRoute}
                        positions={routePath}
                        pathOptions={{ color: currentRoute.color, weight: 4 }}
                    />
                )}

                {/* User Location Marker */}
                {userLocation && (
                    <CircleMarker
                        key={`loc-${userLocation[0]}-${userLocation[1]}`}
                        center={userLocation}
                        radius={8}
                        pathOptions={{ color: '#ffffff', fillColor: '#2F80ED', fillOpacity: 1, weight: 2 }}
                    />
                )}
            </MapContainer>

            {/* Top Route Controls */}
            <div className="absolute top-6 left-0 w-full z-[400] flex justify-center space-x-3 px-3 py-4 overflow-x-auto">
                {(Object.keys(ROUTES) as RouteKey[]).map((key) => (
                    <button
                        key={key}
                        onClick={() => setActiveRoute(key)}
                        className={`px-6 py-4 rounded-full text-base font-bold backdrop-blur-md transition-all shadow-lg border ${activeRoute === key
                            ? 'bg-white/20 border-white/40 text-white scale-105'
                            : 'bg-black/40 border-white/10 text-white/60 hover:bg-black/60'
                            }`}
                        style={{ borderColor: activeRoute === key ? ROUTES[key].color : undefined }}
                    >
                        {ROUTES[key].name}
                    </button>
                ))}
            </div>

            {/* Locate Me Button */}
            <button
                onClick={handleLocateMe}
                className="absolute top-24 right-4 z-[400] bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors shadow-lg"
            >
                <Locate className="w-5 h-5" />
            </button>

            {/* Floating Route Info */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-[400] w-auto whitespace-nowrap">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-lg">
                    <span className="text-text font-medium text-sm tracking-wide">
                        {currentRoute.name} Loop <span className="mx-2 text-white/30">|</span> <span style={{ color: currentRoute.color }}>{currentRoute.distance}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
