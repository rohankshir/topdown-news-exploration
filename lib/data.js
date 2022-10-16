
import fs from 'fs';

export function getTimeSeriesData() {
    const data = JSON.parse(fs.readFileSync('metatopics_over_time.json').toString());
    return data
}

export function getAnnotations() {
    const data = JSON.parse(fs.readFileSync('annotations_over_time.json').toString());
    return data
}