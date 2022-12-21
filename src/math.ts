export function lerp(n: number, start1: number, stop1: number, start2: number, stop2: number) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export function polarToCartesian(radius: number, angle: number) {
    const angleRadians = ((angle - 90) * Math.PI) / 180;
    return {
        x: radius * Math.cos(angleRadians),
        y: radius * Math.sin(angleRadians),
    };
}

// point

export interface Point {
    x: number;
    y: number;
}

export function multiplyPoint(point: Point, scale: number) {
    return { x: point.x * scale, y: point.y * scale };
}

export function addPoints(a: Point, b: Point) {
    return { x: a.x + b.x, y: a.y + b.y };
}

export function subtractPoints(a: Point, b: Point) {
    return { x: a.x - b.x, y: a.y - b.y };
}
