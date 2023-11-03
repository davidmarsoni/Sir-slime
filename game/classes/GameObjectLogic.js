class GameObjectLogic {
    #x;
    #y;
    #width;
    #height;
    #playSound = true;
    #debug = false;
    #isRendered;
    #isAnimated;

    constructor(x, y, width, height) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#isRendered = true;
        this.#isAnimated = true;
    }

    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = value;
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = value;
    }

    get width() {
        return this.#width;
    }

    set width(value) {
        this.#width = value;
    }

    get height() {
        return this.#height;
    }

    set height(value) {
        this.#height = value;
    }

    get debug() {
        return this.#debug;
    }

    set debug(value) {
        this.#debug = value;
    }

    get playSound() {
        return this.#playSound;
    }

    set playSound(value) {
        this.#playSound = value;
    }

    get isRendered() {
        return this.#isRendered;
    }

    set isRendered(value) {
        this.#isRendered = value;
    }

    get isAnimated() {
        return this.#isAnimated;
    }

    set isAnimated(value) {
        this.#isAnimated = value;
    }

    render() {
    }

}

export default GameObjectLogic;