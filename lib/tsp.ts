export function orderTour(points: {id: string, lat: number, lng: number}[], startIdx = 0) {
  const left = new Set(points.map((_, i) => i));
  let order: number[] = [];
  let cur = startIdx;
  
  while (left.size) {
    left.delete(cur);
    order.push(cur);
    
    let best = -1;
    let bestD = 1e18;
    
    for (const i of left) {
      const d = hav(points[cur], points[i]);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    
    if (best === -1) break;
    cur = best;
  }
  
  return order.map(i => points[i]);
}

const R = 6371e3; // Earth's radius in meters

function hav(a: {lat: number, lng: number}, b: {lat: number, lng: number}) {
  const toRad = (x: number) => x * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  
  return 2 * R * Math.asin(Math.sqrt(s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2));
}

export function calculateTourDistance(points: {lat: number, lng: number}[]) {
  let totalDistance = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += hav(points[i], points[i + 1]);
  }
  
  return totalDistance;
}

export function estimateTourTime(distance: number) {
  // Assuming average walking speed of 5 km/h
  const walkingSpeed = 5000; // meters per hour
  const timeInHours = distance / walkingSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);
  
  return timeInMinutes;
} 