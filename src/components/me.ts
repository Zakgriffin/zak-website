import { Group, HemisphereLight, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, WebGLRenderer, DoubleSide } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { body, globalSVG, leftMargin, leftMarginSig, rightMargin } from "./shared";
import { bottom, g, px, setLinePoints } from "../layout";
import { makeRail, railFromPoints, styleThinLine } from "../rail";
import { bound, boundPrim, effect, elementSignal } from "../signal";
import { railPoint5, railPoint5Sig } from "./projects";

const [whoMeRailTop, whoMeRailTopSig] = boundPrim(() => railPoint5.y + 80, [railPoint5Sig]);

const [whoMeRailPoint1, whoMeRailPoint1Sig] = bound(() => ({ x: rightMargin.v, y: whoMeRailTop.v }), [whoMeRailTopSig]);
const [whoMeRailPoint2, whoMeRailPoint2Sig] = bound(() => ({ x: leftMargin.v, y: whoMeRailTop.v }), [whoMeRailTopSig]);
const [whoMeRailPoint3, whoMeRailPoint3Sig] = bound(() => ({ x: leftMargin.v, y: whoMeRailTop.v + 2000 }), [whoMeRailTopSig]);

railFromPoints(whoMeRailPoint1, whoMeRailPoint2, [whoMeRailPoint1Sig, whoMeRailPoint2Sig]);
railFromPoints(whoMeRailPoint2, whoMeRailPoint3, [whoMeRailPoint2Sig, whoMeRailPoint3Sig]);

const whoAmI = g("who-am-i");
const whoAmIDescription = g("who-am-i-description");
const whoAmIDescriptionSig = elementSignal(whoAmIDescription);

const titleSpacing = 20;

// 3D stuff

const face3DWidth = 500;
const face3DHeight = 500;
const scene = new Scene();
const camera = new PerspectiveCamera(75, face3DWidth / face3DHeight, 0.1, 1000);

const renderer = new WebGLRenderer({ alpha: true });

renderer.setSize(face3DWidth, face3DHeight);
const face3D = renderer.domElement;
face3D.style.position = "absolute";
body.appendChild(face3D);

const material = new MeshLambertMaterial({ color: 0xffffff /*, side: DoubleSide*/ });

const light = new HemisphereLight(0xffffff, 0x888888);
// const light2 = new PointLight(0xffffff);
// light.position.x = 20;
// light.position.y = -20;
// light.position.z = 20;
scene.add(light);
// scene.add(light2);

camera.position.z = 0.4;
const loader = new OBJLoader();

loader.load("./face_scan.obj", (faceModel: Group) => {
    faceModel.traverse((child) => {
        if (child instanceof Mesh) {
            child.material = material;
        }
    });
    scene.add(faceModel);

    // function animate(t: number) {
    //     requestAnimationFrame(animate);
    //     if (faceModel) {
    //         faceModel.rotation.y = t * 0.001;
    //     }
    //     renderer.render(scene, camera);
    // }
    // faceModel.rotation.y = 20;
    window.addEventListener("scroll", () => {
        faceModel.rotation.y = window.scrollY * 0.01 + Math.PI;
        renderer.render(scene, camera);
    });

    // animate(0);
});

// me head

const meHeadSplashes = document.getElementsByClassName("me-head-splash");
for (let i = 0; i < meHeadSplashes.length; i++) {
    effect(() => {
        const meHeadSplash = meHeadSplashes[i] as HTMLElement;
        const b = bottom(whoAmIDescription) + 130 + i * 50;
        meHeadSplash.style.right = px(700);
        meHeadSplash.style.top = px(b);
    }, [whoAmIDescriptionSig, leftMarginSig]);
}

// me stuff

effect(() => {
    whoAmI.style.top = px(whoMeRailTop.v + titleSpacing);
    whoAmI.style.left = px(leftMargin.v + titleSpacing);

    whoAmIDescription.style.top = px(bottom(whoAmI) + 10);
    whoAmIDescription.style.left = px(leftMargin.v + titleSpacing);
    whoAmIDescription.style.width = px(window.innerWidth / 2);

    face3D.style.left = px(rightMargin.v - face3D.width);
    face3D.style.top = px(bottom(whoAmIDescription) + 40);
}, [whoMeRailTopSig, leftMarginSig]);

const littleTick = 40;
const sections = [
    { me: "objective", right: littleTick },
    { me: "education", right: 400 },
    { me: "skills", right: littleTick },
    { me: "awards", right: 300 },
    { me: "interests", right: littleTick },
];

for (const [i, section] of sections.entries()) {
    const meHeader = g(section.me + "-header");
    const meDescription = g(section.me + "-description");

    const meRail = makeRail();
    styleThinLine(meRail);
    globalSVG.appendChild(meRail);

    effect(() => {
        const b = bottom(face3D) + 10 + i * 250;
        const x = (section.right * window.innerWidth) / 1500;
        const shift = leftMargin.v + x;
        const gap = 10;

        setLinePoints(meRail, leftMargin.v, b, shift, b);
        meHeader.style.left = px(shift + gap);
        meHeader.style.top = px(b - meHeader.clientHeight / 2);
        meDescription.style.left = px(shift + gap);
        meDescription.style.top = px(b + 20);
    }, [leftMarginSig, whoMeRailTopSig]);
}
