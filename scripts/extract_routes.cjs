const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../src/components/MapIsland.tsx');
const outputDir = path.join(__dirname, '../public/data/routes'); // Store in public for fetching

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const content = fs.readFileSync(inputFile, 'utf8');

// Regex to find route keys and their path arrays
// Matches: key: { ... path: [ ... ] as [number, number][] }
// This is a simplified regex and relies on the specific formatting of the file
const routes = ['sanctuary', 'city', 'river'];

routes.forEach(route => {
    // Find the start of the route definition
    const routeStartRegex = new RegExp(`${route}:\\s*{[\\s\\S]*?path:\\s*\\[`, 'm');
    const match = content.match(routeStartRegex);

    if (match) {
        const startIndex = match.index + match[0].length;
        let bracketCount = 1;
        let endIndex = startIndex;

        // Walk forward to find the matching closing bracket for the path array
        while (bracketCount > 0 && endIndex < content.length) {
            if (content[endIndex] === '[') bracketCount++;
            if (content[endIndex] === ']') bracketCount--;
            endIndex++;
        }

        // Extract the array string (excluding the final ']' which decremented count to 0)
        // Actually the loop increments endIndex one past the closing bracket
        const arrayString = '[' + content.substring(startIndex, endIndex - 1) + ']';

        try {
            // Need to clean up the string to be valid JSON
            // Remove comments if any, though likely none in the array data itself
            // The data is like [ [num, num], ... ]
            // It should be parseable as JSON if we remove trailing commas

            // Standard JSON parser is strict. We might need eval or a looser parser, 
            // but for simple coordinate arrays JSON.parse might fail on trailing commas.
            // Let's us a simple manual cleanup/parse or 'eval' (safe enough here as it's our own code)
            const coordinates = eval(arrayString);

            fs.writeFileSync(
                path.join(outputDir, `${route}.json`),
                JSON.stringify(coordinates, null, 0) // Minify the JSON
            );
            console.log(`Extracted ${route} to ${outputDir}/${route}.json (${coordinates.length} points)`);

        } catch (e) {
            console.error(`Failed to parse ${route}:`, e);
        }
    } else {
        console.error(`Could not find path for ${route}`);
    }
});
