/**
 * this class allows to show the tooltips on the screen by writing on the canvas
 * this windows is center on the screen 
 */
class ModalWindow{
    #ctx;
    #title;
    #content;
    #textCentered;
    #renderOneTime;
    #wasRendered = false;
    #callback = undefined;

    constructor(title,content,renderOneTime = true,textCentered = false,callback = null){
        this.title = title;
        if(content != null && content.length > 1000 || content != undefined){
            this.content = content;
        }else{
            this.content = "";
        }
        this.renderOneTime = renderOneTime;
        this.textCentered = textCentered;
        this.callback = callback;
        
    }

    get title() { return this.#title; }
    set title(value) { this.#title = value; }

    get content() { return this.#content; }
    set content(value) { this.#content = value; }

    get textCentered() { return this.#textCentered; }
    set textCentered(value) { this.#textCentered = value; }
    
    get renderOneTime() { return this.#renderOneTime; }
    set renderOneTime(value) { this.#renderOneTime = value; }

    get wasRendered() { return this.#wasRendered; }
    set wasRendered(value) { this.#wasRendered = value; }

    get callback() { return this.#callback; }
    set callback(value) { this.#callback = value; }

    render(ctx){
        if(this.renderOneTime && this.wasRendered){
            return;
        }
        this.wasRendered = true;
        this.#ctx = ctx;
        if(this.textCentered){
            this.openCenterText();
        }else{
            this.open();
        }
    }

    drawBackground() {
        this.#ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.#ctx.fillRect(0,0,this.#ctx.canvas.width,this.#ctx.canvas.height);
    }

    drawTitle(x, y) {
        this.#ctx.fillStyle = "rgba(255,255,255,1)";
        this.#ctx.textAlign = "center";
        this.#ctx.font = "bold 40px Consolas";
        this.#ctx.fillText(this.title, x, y);
    }

    drawContent(lines, x, y, textAlign = "left") {
        this.#ctx.font = "bold 20px Consolas";
        this.#ctx.textAlign = textAlign;
        for(let line of lines){
            this.#ctx.fillText(line, x, y);
            y += 30;
        }
    }

    open(){
        this.drawBackground();
        this.drawTitle(this.#ctx.canvas.width/2, 50);
        let lines = this.content.split("\n");
        this.drawContent(lines, 50, 90);
        this.drawhelp();
    }

    openCenterText(){
        let x = this.#ctx.canvas.width/2;
        let y = this.#ctx.canvas.height/2;
        let lines = this.content.split("\n");
        let textHeight = lines.length * 30;
        y -= textHeight/2;

        this.drawBackground();
        this.drawTitle(x, y);
        this.drawContent(lines, x, y + 50, "center");
        this.drawhelp();
    }

    drawhelp(){
        //write a text to the top right corner
        this.#ctx.fillStyle = "rgba(255,255,255,1)";
        this.#ctx.textAlign = "left";
        this.#ctx.font = "bold 20px Consolas";
        this.#ctx.fillText("press ESC or ENTER to close",this.#ctx.canvas.width-320,30);
    }    
}
export default ModalWindow;