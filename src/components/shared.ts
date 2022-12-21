import { g, px } from "../layout";
import { bound, boundPrim, elementSignal } from "../signal";

export const body = document.body;
export const bodySig = elementSignal(body);

export const globalSVG = g("global-svg");

export const [windowCenter, windowCenterSig] = bound(() => {
    return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };
}, [bodySig]);

export const marginPercent = 0.1;
export const [leftMargin, leftMarginSig] = boundPrim(() => window.innerWidth * marginPercent, [bodySig]);
export const [rightMargin, rightMarginSig] = boundPrim(() => window.innerWidth - window.innerWidth * marginPercent, [bodySig]);

// temp scrolling fix

// const scrollBoi = document.createElement("div");

// scrollBoi.style.left = px(80);
// scrollBoi.style.top = px(4000);
// scrollBoi.style.position = "absolute";
// scrollBoi.style.width = px(100);
// scrollBoi.style.height = px(100);
// scrollBoi.style.backgroundColor = "red";
// body.appendChild(scrollBoi);
