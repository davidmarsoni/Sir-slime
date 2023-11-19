import GameObjectLogic from "./GameObjectLogic.js";

class Button extends GameObjectLogic {
       //the action method I want my button to do when clicked
    #executed_function;
    #screen
    
    // x , y, widht and height are the spriteSheet. the others are the buttons parametters

    constructor( x, y, width, height,screen ) {
        super(x,y,width,height);
        this.#screen = screen;
       // this.executed_function = executed_function;

    }

    get executed_function(){

        return this.#executed_function;
    
    }

    set executed_function(value){
      
      this.#executed_function = value;
      // ici on met la va
    }

    get screen(){
    return this.#screen;  
    }
    set screen(value){

      this.#screen = value;
    }

     // Method to draw the button on the canvas
    render(ctx) {
      // You need to load and draw the texture here
      // Replace the following line with your texture drawing logic
      if(this.debug){
          ctx.fillStyle ='rgba(0,0,255,0.5)';
          ctx.fillRect(this.x, this.y, this.width, this.height);
      }
      
    }

    // Method to check if a point (mouse click) is inside the button
    isPointInside(x, y) {
      return x >= this.x && x <= this.x + this.width 
      && y >= this.y && y <= this.y + this.height;
  }

  // Method to handle mouse click events
  handleClickEvent(event) {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;

      if (this.isPointInside(mouseX, mouseY) && this.executed_function) {
          this.#executed_function();
          console.log("detection souris boutton Startscreen marche !")
      }
  }

  



}
export default Button;