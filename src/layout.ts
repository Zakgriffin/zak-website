import { addPoints, multiplyPoint, Point, subtractPoints } from "./math";
import { bound, Signal } from "./signal";

export function g(id: string) {
    return document.getElementById(id)!;
}

export function px(pixels: number) {
    return pixels + "px";
}

export function bottom(element: Element) {
    return element.getBoundingClientRect().top - element.parentElement!.getBoundingClientRect().top + element.getBoundingClientRect().height;
}

export function spacedEvenly(start: Point, end: Point, count: number, deps: Signal[]) {
    const pointCombos: [{ x: number; y: number }, Signal][] = [];
    const [chunk] = bound(() => multiplyPoint(subtractPoints(end, start), 1 / (count - 1)), deps);

    for (let i = 0; i < count; i++) {
        pointCombos[i] = bound(() => addPoints(start, multiplyPoint(chunk, i)), deps);
    }
    return pointCombos;
}

export class Transform {
    translate: Point = { x: 0, y: 0 };

    t = (point: Point) => {
        return {
            x: point.x + this.translate.x,
            y: point.y + this.translate.y,
        };
    };

    tx = (x: number) => {
        return x + this.translate.x;
    };

    ty = (y: number) => {
        return y + this.translate.y;
    };
}

export function setLinePoints(element: SVGLineElement, x1: number, y1: number, x2: number, y2: number) {
    element.setAttribute("x1", x1 + "");
    element.setAttribute("y1", y1 + "");
    element.setAttribute("x2", x2 + "");
    element.setAttribute("y2", y2 + "");
}
