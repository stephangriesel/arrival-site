"""
GPX Parser Script
-----------------
Usage:
    python3 scripts/parse_gpx.py <path_to_gpx_file>

Description:
    This script parses a GPX file and saves a JSON array of [latitude, longitude] coordinates
    to a new file in the same directory (e.g., input.gpx -> input.json).
"""

import sys
import os
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
            # Try without namespace if empty
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
    
    # Check if file exists before processing
    if not os.path.exists(gpx_file):
        print(f"Error: File '{gpx_file}' not found.", file=sys.stderr)
        sys.exit(1)

    print(f"Processing {gpx_file}...")
    coordinates = parse_gpx(gpx_file)
    
    if coordinates:
        # Generate output filename: /path/to/run.gpx -> /path/to/run.json
        base_name = os.path.splitext(gpx_file)[0]
        output_file = f"{base_name}.json"
        
        try:
            with open(output_file, 'w') as f:
                json.dump(coordinates, f, indent=2)
            print(f"Success! Coordinates saved to: {output_file}")
            print(f"Total points found: {len(coordinates)}")
        except IOError as e:
            print(f"Error writing to file: {e}", file=sys.stderr)
    else:
        print("No coordinates found or error occurred.", file=sys.stderr)