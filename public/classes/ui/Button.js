import GameObjectLogic from "../GameObjectLogic.js";

class Button extends GameObjectLogic {
  //the action method I want my button to do when clicked
  #executed_function;
  #eventListener = null;
  #screen;
  #clicked = false;

  // x , y, widht and height are the spriteSheet. the others are the buttons parametters

  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.#screen = screen;
  }

  get executed_function() {
    return this.#executed_function;
  }

  set executed_function(value) {
    // Remove old event listener if it exists
    if (this.#eventListener) {
      window.removeEventListener('click', this.#eventListener);
      this.#eventListener = undefined;
      return;
    }
    this.#executed_function = value;

    // Add new event listener if executed_function is not null
    if (this.#executed_function) {
      this.#eventListener = (event) => {
        this.handleClickEvent(event);
      };
      window.addEventListener('click', this.#eventListener);
    }
  }

  get screen() {
    return this.#screen;
  }
  set screen(value) {
    this.#screen = value;
  }

  render(ctx) {
    if (this.debug) {
      ctx.fillStyle = 'rgba(0,0,255,0.5)';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  // Method to check if a point (mouse click) is inside the button
  isPointInside(x, y) {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  // Method to handle mouse click events
  handleClickEvent(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    if (this.isPointInside(mouseX, mouseY) && this.executed_function != undefined) {
      //use to be sure that the mouse is not clicked twice
      if (this.#clicked == false) {
        this.#clicked = true;
        this.executed_function();
        this.debug && console.log("clicked");
        setTimeout(() => {
          this.#clicked = false;
        }, 200);
      }
    }
  }





}
export default Button;