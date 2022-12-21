import { globalSVG, leftMargin, leftMarginSig, rightMargin, rightMarginSig } from "./shared";
import { setLinePoints, spacedEvenly } from "../layout";
import { railFromPoints, styleThinLine } from "../rail";
import { bound, effect, Signal } from "../signal";
import { cubeRadius, cubeTransform, cubeTranslateSig } from "./home";
const numberOfProjects = 6;

const { tx, ty } = cubeTransform;
const [railPoint1, railPoint1Sig] = bound(() => ({ x: tx(0), y: ty(cubeRadius) }), [cubeTranslateSig]);
const [railPoint2, railPoint2Sig] = bound(() => ({ x: railPoint1.x, y: railPoint1.y + 20 }), [railPoint1Sig]);
const [railPoint3, railPoint3Sig] = bound(() => ({ x: leftMargin.v, y: railPoint2.y }), [railPoint2Sig, leftMarginSig]);

const [railPoint4, railPoint4Sig] = bound(() => ({ x: leftMargin.v, y: railPoint3.y + 600 }), [railPoint3Sig, leftMarginSig]);

export const [railPoint5, railPoint5Sig] = bound(() => ({ x: rightMargin.v, y: railPoint4.y }), [railPoint4Sig, rightMarginSig]);

railFromPoints(railPoint1, railPoint2, [railPoint1Sig, railPoint2Sig]);
railFromPoints(railPoint2, railPoint3, [railPoint2Sig, railPoint3Sig]);
railFromPoints(railPoint3, railPoint4, [railPoint3Sig, railPoint4Sig]);
railFromPoints(railPoint4, railPoint5, [railPoint4Sig, railPoint5Sig]);

const pointCombos = spacedEvenly(railPoint4, railPoint5, numberOfProjects + 1, [railPoint4Sig, railPoint5Sig]);

for (const pointCombo of pointCombos.slice(-numberOfProjects)) {
    const restingStemHeight = 200;
    let stemHeight = restingStemHeight;
    const shift = 10;
    const radius = 15;
    const p = new Signal();

    const [point, pointSig] = pointCombo;

    const interact = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    interact.style.width = radius * 2 + "";
    interact.style.height = restingStemHeight + radius * 2 + "";
    interact.style.fill = "transparent";

    effect(() => {
        interact.setAttribute("x", point.x - radius + "");
        interact.setAttribute("y", point.y - stemHeight - radius - shift + "");
    }, [pointSig]);
    globalSVG.appendChild(interact);

    interact.onmouseover = () => {
        stemHeight = restingStemHeight + shift;
        p.update();
    };
    interact.onmouseleave = () => {
        stemHeight = restingStemHeight;
        p.update();
    };

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.style.pointerEvents = "none";
    circle.setAttribute("r", radius + "");
    circle.setAttribute("fill", "transparent");
    styleThinLine(circle);

    effect(() => {
        circle.setAttribute("cx", point.x + "");
        circle.setAttribute("cy", point.y - stemHeight + "");
    }, [pointSig, p]);

    globalSVG.appendChild(circle);

    const stem = document.createElementNS("http://www.w3.org/2000/svg", "line");
    styleThinLine(stem);
    stem.style.pointerEvents = "none";

    effect(() => {
        setLinePoints(stem, point.x, point.y, point.x, point.y - stemHeight);
    }, [pointSig, p]);

    globalSVG.appendChild(stem);
}
