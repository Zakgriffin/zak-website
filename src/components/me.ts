import { Group, HemisphereLight, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { body, leftMargin, leftMarginSig, rightMargin } from "./shared";
import { bottom, g, px } from "../layout";
import { railFromPoints } from "../rail";
import { bound, boundPrim, effect } from "../signal";
import { railPoint5, railPoint5Sig } from "./projects";

const [whoMeRailTop, whoMeRailTopSig] = boundPrim(() => railPoint5.y + 80, [railPoint5Sig]);

const [whoMeRailPoint1, whoMeRailPoint1Sig] = bound(() => ({ x: rightMargin.v, y: whoMeRailTop.v }), [whoMeRailTopSig]);
const [whoMeRailPoint2, whoMeRailPoint2Sig] = bound(() => ({ x: leftMargin.v, y: whoMeRailTop.v }), [whoMeRailTopSig]);
const [whoMeRailPoint3, whoMeRailPoint3Sig] = bound(() => ({ x: leftMargin.v, y: whoMeRailTop.v + 2000 }), [whoMeRailTopSig]);

railFromPoints(whoMeRailPoint1, whoMeRailPoint2, [whoMeRailPoint1Sig, whoMeRailPoint2Sig]);
railFromPoints(whoMeRailPoint2, whoMeRailPoint3, [whoMeRailPoint2Sig, whoMeRailPoint3Sig]);

const whoAmI = g("who-am-i");
const whoAmIDescription = g("who-am-i-description");

const titleSpacing = 20;

// 3D stuff

const face3DWidth = 400;
const face3DHeight = 400;
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
// light2.position.x = 20;
// light2.position.y = 20;
// light2.position.z = 20;
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

effect(() => {
    whoAmI.style.top = px(whoMeRailTop.v + titleSpacing);
    whoAmI.style.left = px(leftMargin.v + titleSpacing);

    whoAmIDescription.style.top = px(bottom(whoAmI) + 10);
    whoAmIDescription.style.left = px(leftMargin.v + titleSpacing);
    whoAmIDescription.style.width = px(window.innerWidth / 2);

    face3D.style.left = px(rightMargin.v - face3D.width);
    face3D.style.top = px(bottom(whoAmIDescription) + 40);
}, [whoMeRailTopSig, leftMarginSig]);
