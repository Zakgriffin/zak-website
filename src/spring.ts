import { Signal } from "./signal";

export class Spring {
    value: number;
    target: number;
    velocity = 0;
    damping = 0;
    stiffness = 0;

    // mx'' - bx' = kx

    constructor(initialValue: number) {
        this.value = initialValue;
        this.target = initialValue;
    }

    tick(dt: number) {
        const acceleration = this.stiffness * (this.target - this.value) - this.damping * this.velocity;
        this.velocity += acceleration * dt;
        this.value += this.velocity * dt;
    }

    setStiffnessCritical(stiffness: number) {
        this.stiffness = stiffness;
        this.damping = Math.sqrt(4 * stiffness);
    }

    cleanUp() {}
}

export function animateSpring(spring: Spring, signal: Signal, tolerance: number) {
    function tickSpring() {
        spring.tick(1 / 60);
        signal.update();

        if (Math.abs(spring.target - spring.value) < tolerance && Math.abs(spring.velocity) < tolerance) {
            spring.value = spring.target;
            spring.velocity = 0;
            return;
        }

        requestAnimationFrame(tickSpring);
    }

    tickSpring();
}
