"""
GPX Parser Script
-----------------
Usage:
    python3 scripts/parse_gpx.py <path_to_gpx_file>

Description:
    This script parses a GPX file and outputs a JSON array of [latitude, longitude] coordinates.
    The output can be directly copied into the MapIsland.tsx component.

Example:
    python3 scripts/parse_gpx.py my_route.gpx
"""

import sys
import xml.etree.ElementTree as ET
import json

def parse_gpx(file_path):
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        # Define namespaces (GPX 1.1 usually has this namespace)
        ns = {'gpx': 'http://www.topografix.com/GPX/1/1'}
        
        coords = []
        # Find all trkpt elements. 
        # Using .// to find them anywhere (trk -> trkseg -> trkpt)
        # First try with namespace
        for trkpt in root.findall('.//gpx:trkpt', ns):
            try:
                lat = float(trkpt.get('lat'))
                lon = float(trkpt.get('lon'))
                coords.append([lat, lon])
            except (ValueError, TypeError):
                continue
            
        if not coords:
            # Try without namespace if empty (sometimes happens with different versions/parsers)
            for trkpt in root.findall('.//trkpt'):
                try:
                    lat = float(trkpt.get('lat'))
                    lon = float(trkpt.get('lon'))
                    coords.append([lat, lon])
                except (ValueError, TypeError):
                    continue

        return coords

    except Exception as e:
        print(f"Error parsing GPX: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python parse_gpx.py <path_to_gpx_file>")
        sys.exit(1)
        
    gpx_file = sys.argv[1]
    coordinates = parse_gpx(gpx_file)
    
    if coordinates:
        print(json.dumps(coordinates, indent=2))
    else:
        print("No coordinates found or error occurred.", file=sys.stderr)
