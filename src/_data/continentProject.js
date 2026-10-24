/**
 * Derived data for the Continent Project page, computed at build time
 * from continents.json: world map SVG paths, pin positions and distance stats.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoEqualEarth, geoPath, geoDistance } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const world = require("world-atlas/countries-110m.json");
const data = JSON.parse(readFileSync(new URL("./continents.json", import.meta.url)));

const EARTH_RADIUS_KM = 6371;
const MAP_WIDTH = 1000;

const formatCoord = (value, pos, neg) => `${Math.abs(value).toFixed(2)}° ${value >= 0 ? pos : neg}`;

export default function () {
    const sphere = { type: "Sphere" };
    const projection = geoEqualEarth().fitWidth(MAP_WIDTH, sphere);
    const path = geoPath(projection).digits(1);
    const [[, y0], [, y1]] = path.bounds(sphere);
    const height = Math.ceil(y1 - y0);

    const origin = [data.origin.lng, data.origin.lat];
    const countries = feature(world, world.objects.countries).features;

    const continents = data.continents.map((continent) => {
        const locations = continent.locations.map((loc) => {
            const [x, y] = projection([loc.lng, loc.lat]);
            const km = Math.round(geoDistance(origin, [loc.lng, loc.lat]) * EARTH_RADIUS_KM);
            return {
                ...loc,
                x: x.toFixed(1),
                y: y.toFixed(1),
                km,
                coords: `${formatCoord(loc.lat, "N", "S")}, ${formatCoord(loc.lng, "E", "W")}`,
            };
        });
        const reached = locations.length > 0;
        const marker = !reached && continent.marker ? projection([continent.marker.lng, continent.marker.lat]) : null;
        return {
            name: continent.name,
            slug: continent.name.toLowerCase().replace(/\s+/g, "-"),
            reached,
            locations,
            marker: marker && { x: marker[0].toFixed(1), y: marker[1].toFixed(1) },
        };
    });

    const allLocations = continents.flatMap((c) => c.locations);
    const countryIds = new Set(allLocations.map((l) => l.countryId));
    const farthest = allLocations.reduce((max, l) => (l.km > max.km ? l : max), { km: 0 });

    return {
        map: {
            width: MAP_WIDTH,
            height,
            sphere: path(sphere),
            land: countries.filter((f) => !countryIds.has(f.id)).map((f) => path(f)).join(""),
            highlighted: countries.filter((f) => countryIds.has(f.id)).map((f) => path(f)).join(""),
        },
        continents,
        stats: {
            reached: continents.filter((c) => c.reached).length,
            total: continents.length,
            homes: allLocations.length,
            countries: countryIds.size,
            farthest,
        },
    };
}
