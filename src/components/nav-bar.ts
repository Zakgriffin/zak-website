import { bodySig, windowCenter, windowCenterSig } from "./shared";
import { g, px } from "../layout";
import { lerp } from "../math";
import { effect } from "../signal";

const navHome = g("nav-home");
const navProjects = g("nav-projects");
const navMe = g("nav-me");
const navContact = g("nav-contact");

effect(() => {
    const end = window.innerWidth - navContact.clientWidth / 2 - 40;

    function align(e: HTMLElement, x: number) {
        e.style.left = px(lerp(x, 0, 1, windowCenter.x, end) - e.clientWidth / 2);
        e.style.top = px(30);
    }

    align(navHome, 0);
    align(navProjects, 1 / 3);
    align(navMe, 2 / 3);
    align(navContact, 1);
}, [windowCenterSig]);

const navBackground = g("nav-background");
effect(() => {
    navBackground.style.width = px(window.innerWidth);
    navBackground.style.height = px(65);
}, [bodySig]);
