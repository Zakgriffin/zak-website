export class Spring {
    value: number = 0;
    velocity = 0;
    damping: number;
    stiffness: number;

    // -kx - bx' = mx''

    constructor(initialValue: number, stiffness: number, damping: number) {
        this.value = initialValue;
        this.stiffness = stiffness;
        this.damping = damping;
    }

    tick() {
        const acceleration = -this.stiffness * this.value - this.damping * this.velocity;
        this.velocity += acceleration;
        this.value += this.velocity;
    }

    cleanUp() {}
}
