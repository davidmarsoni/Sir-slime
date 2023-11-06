/**
 * this class allows to show the tooltips on the screen by writing on the canvas
 * this windows is center on the screen 
 */
class ModalWindow{
    #ctx
    #title
    #content
    constructor(title,content){
        this.title = title;
        this.content = content;
        let canvas = document.getElementById("canvas");
        this.#ctx = canvas.getContext("2d");
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        this.#title = value;
    }

    get content() {
        return this.#content;
    }

    set content(value) {
        this.#content = value;
    }

    open(){
        this.#ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.#ctx.fillRect(0,0,this.#ctx.canvas.width,this.#ctx.canvas.height);
        this.#ctx.fillStyle = "rgba(255,255,255,1)";
        this.#ctx.textAlign = "center";
        this.#ctx.font = "bold 40px Consolas";
        this.#ctx.fillText(this.title,this.#ctx.canvas.width/2,50);
        this.#ctx.font = "bold 20px Consolas";
        // check the \n in the content
        this.#ctx.textAlign = "left";
        let lines = this.content.split("\n");
        let y = 90;
        let x = 50;
        for(let line of lines){
            this.#ctx.fillText(line,x,y);
            y+=30;
        }
    }
}
export default ModalWindow;