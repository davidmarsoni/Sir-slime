import GameObject from '../GameObject.js';

class DraggableObject extends GameObject {
    #originX;
    #originY;
    #isDragging;
    #dragOffset;
    #canvas = document.getElementById("canvas");
    #tag;

    static STROKE_RED = 'red';
    static STROKE_ORANGE = 'orange';
    static STROKE_GREEN = 'green';
    #colorStroke = DraggableObject.STROKE_RED;

    constructor(x, y, width, height, texturepath, originX, originY,tag) {
        super(x, y, width, height, texturepath);
        this.#originX = originX;
        this.#originY = originY;
        this.#isDragging = false;
        this.#tag = tag;
    }

    get originX() { return this.#originX; }
    set originX(value) { this.#originX = value; }
    get originY() { return this.#originY; }
    set originY(value) { this.#originY = value; }
    get tag() { return this.#tag; }
    set tag(value) { this.#tag = value; }
    get isDragging() { return this.#isDragging; }
    set isDragging(value) { this.#isDragging = value; }
    get colorStroke() { return this.#colorStroke; }
    set colorStroke(value) { this.#colorStroke = value; }

    onMouseDown(event) {
        let x = event.clientX - this.#canvas.offsetLeft;
        let y = event.clientY - this.#canvas.offsetTop;

        if (this.isWithin(x, y)) {
            this.#isDragging = true;
            this.#dragOffset = { x: x - this.x, y: y - this.y };
            this.#colorStroke = DraggableObject.STROKE_ORANGE;
        }
    }

    onMouseUp(event) {
        this.#isDragging = false;
        this.#colorStroke = DraggableObject.STROKE_RED;
    }

    onMouseMove(event) {
        if (this.#isDragging) {
            this.x = event.clientX - this.#canvas.offsetLeft - this.#dragOffset.x;
            this.y = event.clientY - this.#canvas.offsetTop - this.#dragOffset.y;
        }
    }

    isWithin(x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
    render(ctx) {
        if (this.isRendered == false) return;
        ctx.strokeStyle = this.#colorStroke;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = 'black';

        if (this.textureLoaded == true) {
            ctx.drawImage(this.texture, this.x, this.y, this.width, this.height);
        }
        if (this.debug) {
            
        }
    }
}

export default DraggableObject;