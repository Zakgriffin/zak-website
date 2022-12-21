import { globalSVG } from "./components/shared";
import { setLinePoints } from "./layout";
import { Point } from "./math";
import { effect, Signal } from "./signal";

export function styleThinLine(element: SVGElement) {
    element.setAttribute("stroke", "white");
    element.setAttribute("stroke-width", "2");
}

export function makeRail() {
    const railLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

    styleThinLine(railLine);

    globalSVG.appendChild(railLine);
    return railLine;
}

export function railFromPoints(start: Point, end: Point, observed: Signal[]) {
    const rail = makeRail();
    effect(() => {
        setLinePoints(rail, start.x, start.y, end.x, end.y);
    }, observed);
    return rail;
}
