export class Signal {
    private subscribers: (() => void)[] = [];

    subscribe(subscriber: () => void) {
        this.subscribers.push(subscriber);
    }

    update() {
        this.subscribers.forEach((s) => s());
    }
}

export function effect(func: () => void, observedSignals: Signal[]) {
    observedSignals.forEach((o) => o.subscribe(func));
}

export function bound<T>(func: () => T, observedSignals: Signal[]): [T, Signal] {
    const signal = new Signal();
    const obj = func();
    observedSignals.forEach((observedSignal) =>
        observedSignal.subscribe(() => {
            Object.assign(obj as object, func());
            signal.update();
        })
    );
    return [obj, signal];
}

export function boundPrim<T>(func: () => T, observedSignals: Signal[]): [{ v: T }, Signal] {
    const signal = new Signal();
    const obj = { v: func() };
    observedSignals.forEach((o) =>
        o.subscribe(() => {
            obj.v = func();
            signal.update();
        })
    );
    return [obj, signal];
}

export function elementSignal(element: Element) {
    const elementObs = new Signal();
    new ResizeObserver((_) => {
        elementObs.update();
    }).observe(element);
    return elementObs;
}

// class Queue<T> {
//     items: T[] = [];

//     enqueue(item: T) {
//         if (this.items.includes(item)) return;
//         this.items.push(item);
//     }

//     dequeue() {
//         return this.items.shift();
//     }
// }
