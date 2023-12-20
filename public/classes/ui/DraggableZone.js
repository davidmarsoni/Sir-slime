import GameObject from '../GameObject.js';

class DraggableZone extends GameObject {
    #message;
    constructor(x, y, width, height, message) {
        super(x, y, width, height);
        this.#message = message;
    }

    collide(draggableObject) {
       return this.x < draggableObject.x + draggableObject.width &&
        this.x + this.width > draggableObject.x &&
        this.y < draggableObject.y + draggableObject.height &&
        this.y + this.height > draggableObject.y;
    }

    get message() { return this.#message; }
    set message(value) { this.#message = value; }

    render(ctx) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5; // Adjust the value as needed
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.lineWidth = 1; // Reset to the default value
        ctx.strokeStyle = 'black';

        ctx.fillStyle = 'white';
        ctx.font = '20px Consolas';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.#message, this.x + this.width / 2, this.y + this.height / 2);
    }
}

export default DraggableZone;