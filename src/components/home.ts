import { bodySig, windowCenter, windowCenterSig } from "./shared";
import { bottom, g, px, setLinePoints, Transform } from "../layout";
import { Point, polarToCartesian } from "../math";
import { makeRail } from "../rail";
import { bound, boundPrim, effect, elementSignal } from "../signal";

export const cubeRadius = 120;

// landing-title

const landingName = g("landing-name");
const landingSubtitle = g("landing-subtitle");

const landingSubtitleSig = elementSignal(landingSubtitle);

export const cubeTransform = new Transform();

export const [cubeTranslate, cubeTranslateSig] = bound(
    () => ({
        x: windowCenter.x,
        y: bottom(landingSubtitle) + 200,
    }),
    [windowCenterSig, landingSubtitleSig]
);

const [landingLeftFlush, landingLeftFlushSig] = boundPrim(() => window.innerWidth / 2 - landingName.clientWidth / 2, [bodySig]);

effect(() => {
    landingName.style.left = px(landingLeftFlush.v);
    landingSubtitle.style.left = px(landingLeftFlush.v);
}, [landingLeftFlushSig]);

effect(() => {
    landingName.style.top = px(180);
    landingSubtitle.style.top = px(bottom(landingName));
}, [bodySig]);

// nav-cube

const atAngle = (angle: number) => polarToCartesian(cubeRadius, angle);

cubeRail(makeRail(), atAngle(0), atAngle(60));
cubeRail(makeRail(), atAngle(60), atAngle(120));
cubeRail(makeRail(), atAngle(120), atAngle(180));

cubeRail(makeRail(), atAngle(0), atAngle(-60));
cubeRail(makeRail(), atAngle(-60), atAngle(-120));
cubeRail(makeRail(), atAngle(-120), atAngle(-180));

cubeRail(makeRail(), atAngle(60), { x: 0, y: 0 });
cubeRail(makeRail(), atAngle(-60), { x: 0, y: 0 });
cubeRail(makeRail(), { x: 0, y: 0 }, atAngle(180));

function cubeRail(railLine: SVGLineElement, start: Point, end: Point) {
    const { tx, ty } = cubeTransform;

    effect(() => {
        cubeTransform.translate = cubeTranslate;

        setLinePoints(railLine, tx(start.x), ty(start.y), tx(end.x), ty(end.y));
    }, [cubeTranslateSig]);
}
