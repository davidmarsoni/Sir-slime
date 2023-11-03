import {objects_list,ennemies_list} from "./constant.js";
import Platform from "../Platform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../entity/ennemy/Patrolman.js";
import PassageWay from "../PassageWay.js";
import Bat from "../entity/ennemy/Bat.js";
import Coin from "../collactiables/Coin.js";
import Heart from "../collactiables/Heart.js";


class QuickObjectCreation{
    #canvas = document.getElementById('canvas');
    #type = "";
    #status = false;
    #x = 0;
    #y = 0;

    #value1 = 0;
    #value2 = 0;
    #value3 = 0;
    #value4 = "";

    #platform; 
    #patrolman; 
    #collisionBlock;
    #passageWay;
    #bat; 
    #coin; 
    #heart;

    

    mouseDownHandler = (e) => { 
        this.getMousePosition(e); 
    };

    mouseMoveHandler = (e) => {
        this.#x = e.clientX -this.canvas.offsetLeft;
        this.#y = e.clientY-this.canvas.offsetTop;

        //get the value of the input if there is one
        if(input1.value !== ""){
            this.#value1 = input1.value;
        }
        const input2 = document.getElementById("input2");
        if(input2.value !== ""){
            this.#value2 = input2.value;
        }
        const input3 = document.getElementById("input3");
        if(input3.value !== ""){
            this.#value3 =input3.value;
        }
        const input4 = document.getElementById("input4");
        
        if(input4.value !== ""){
            this.#value4 =input4.value;
        }
    };

    constructor(){
    }
    open(){
        this.#status = true;
        this.init();
      
    }
    close(){
        this.#status = false;
        this.remove();
    }
    
    get status(){
        return this.#status;
    }

    get canvas(){
        return this.#canvas;
    }

    set canvas(canvas){
        this.#canvas = canvas;
    }

    get type(){
        return this.#type;
    }

    set type(type){
        this.#type = type;
    }

    init(){
        //create object for the preview
        this.#platform = new Platform(0,0,96,16,"assets/sprites/DecorSheet.png",0,0,96,16);
        this.#patrolman = new Patrolman(0,0,32,32,"assets/sprites/Patrolman.png",0,0,32,32);
        this.#collisionBlock = new CollisionBlock(0,0,100,100,0);
        this.#passageWay = new PassageWay(0,0,100,100,"");
        this.#bat = new Bat(0,0,32,32,"assets/sprites/Bats.png",0,0,32,32);
        this.#coin = new Coin(0,0,16,16,"assets/sprites/Collectible.png",0,0);
        this.#heart = new Heart(0,0,16,16,"assets/sprites/Collectible.png",0,0);

        //add a title to the quick object creation
        const title = document.createElement('h2');
        title.style.fontFamily = "Montserrat,sans-serif,arial";
        title.innerHTML = "Quick object creation";
        title.style.color = "white";
        this.canvas.parentNode.insertBefore(title, this.canvas);

        //create the select element
        const select = document.createElement('select');

        // Populate the select element with options
        objects_list.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            select.appendChild(optionElement);
        });
        ennemies_list.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            select.appendChild(optionElement);
        });

        // Add an event listener 
        // get the x,y and the value of the input and some other data
        select.addEventListener('change', (event) => {
            this.type = event.target.value;
        });
        
        //set the default value
        select.value = "Platform";
        this.type = "Platform";

        // Insert the select element before the canvas
        this.canvas.parentNode.insertBefore(select, this.canvas)

        //create the first input
        const input1 = document.createElement('input');
        input1.type = "text";
        input1.id = "input1";
        input1.placeholder = "width";
        //default value
        input1.value = "100";
        this.canvas.parentNode.insertBefore(input1, this.canvas);

        //create the second input
        const input2 = document.createElement('input');
        input2.type = "text";
        input2.id = "input2";
        input2.placeholder = "height";
        //default value
        input2.value = "100";
        this.canvas.parentNode.insertBefore(input2, this.canvas);

        //create the third input
        const input3 = document.createElement('input');
        input3.type = "text";
        input3.id = "input3";
        input3.placeholder = "value 3";
        this.canvas.parentNode.insertBefore(input3, this.canvas);

        //create the 4th input
        const input4 = document.createElement('input');
        input4.type = "text";
        input4.id = "input4";
        input4.placeholder = "text";
        this.canvas.parentNode.insertBefore(input4, this.canvas);

        //add a div between the select and the canvas with a height of 10px
        const div = document.createElement('div');
        div.style.height = "7px";
        this.canvas.parentNode.insertBefore(div, this.canvas);


        //add the event listener to the canvas
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);

    }

    /**
     * remove the quick object creation to not interfere with the game
     */
    remove(){
        document.getElementById("input1").remove();
        document.getElementById("input2").remove();
        document.getElementById("input3").remove();
        document.getElementById("input4").remove();
        document.querySelector('select').remove();
        document.querySelector('h2').remove();
        document.querySelector('div').remove();
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        
        this.#type = "";
    }
 
    /**
     * get the mouse position and create the json object
     * @param {*} event  the mouse event
     */
    getMousePosition(event) { 
        //get the mouse position
        let x = event.clientX -this.canvas.offsetLeft;
        let y = event.clientY-this.canvas.offsetTop;
        let json;
        
        let value1 = 0;
        let value2 = 0;
        let value3 = 0;
        let value4 = "";

        //get the value of the input if there is one and find the right type of data
        const input1 = document.getElementById("input1");
    
        if(input1.value !== ""){
            value1 = input1.value;
        }
        const input2 = document.getElementById("input2");
        if(input2.value !== ""){
            value2 = input2.value;
        }
        const input3 = document.getElementById("input3");
        if(input3.value !== ""){
            value3 =input3.value;
        }
        const input4 = document.getElementById("input4");
        
        if(input4.value !== ""){
            value4 =input4.value;
        }
    
        if(this.type === ""){
            console.log("no type selected");
            return;
        }
        //create the json object
        // this code is not very clean but it works for now
        // TODO : find a better way to do this (maybe with a .tosring() method on each object)
        switch(this.type){
            case "Platform":
                console.log("platform created");
                //create the json object for the type 
                //and copy to the clipboard
                json = {
                    "Platform": {
                        "x": x,
                        "y": y,
                        "width": 96,
                        "height": 16,
                        "spriteSheetOffsetX" : 0,
                        "spriteSheetOffsetY" : 0,
                        "spriteSheetWidth" : 96,
                        "spriteSheetHeight" : 16,
                        "texturepath": "assets/sprites/DecorSheet.png"
                    }
                };
                break;
            case "Patrolman":
                console.log("patrolman created");
                json = {
                    "Patrolman": {
                        "x": x,
                        "y": y,
                        "origin_x": x,
                        "origin_y": y,
                        "height": 32,
                        "width": 32,
                        "path": [
                            x-50,
                            x+50
                        ],
                        "speed": 1,
                        "damage": parseInt(value3) == 0 ? 1 :parseInt(value3),
                        "texturepath": "assets/sprites/Patrolman.png"
                    }
                };
                break;
              
            case "CollisionBlock":
                console.log("collisionBlock created");
                json = {
                    "CollisionBlock": {
                        "x": x,
                        "y": y,
                        "width": parseInt(value1),
                        "height": parseInt(value2),
                        "collisionSide": parseInt(value3) > 3 ? 0 :parseInt(value3),
                    }
                };
               break;
            case "PassageWay":
                console.log("passageWay created");
                json = {
                    "PassageWay": {
                        "x": x,
                        "y": y,
                        "width":  parseInt(value1),
                        "height":  parseInt(value2),
                        "passageWayTo": value4
                    }
                };
                break;
            case "Bat":
                console.log("bat created");
                json = {
                    "Bat": {
                        "x": x,
                        "y": y,
                        "height": 32,
                        "width": 32,
                        "origin_x": x,
                        "origin_y": y,
                        "speed":2.5,
                        "damage":parseInt(value3) == 0 ? 1 :parseInt(value3),
                        "triggerZone" : parseInt(value3) == 0 ? 200 :parseInt(value3),
                        "texturepath": "assets/sprites/Bats.png"
                    }
                };
                break;
            case "Coin":
                console.log("coin created");
                json = {
                    "Coin": {
                        "x": x-8,
                        "y": y-8,
                        "width": 16,
                        "height": 16,
                        "value": parseInt(value3) == 0 ? 10 :parseInt(value3),
                        "texturepath": "assets/sprites/Collectible.png"
                    }
                };
                break;
            case "Heart":
                console.log("Heart created");
                json = {
                    "Heart": {
                        "x": x-8,
                        "y": y-8,
                        "width": 16,
                        "height": 16,
                        "value": parseInt(value3) == 0 ? 1 :parseInt(value3),
                        "texturepath": "assets/sprites/Collectible.png"
                    }
                };
                break;
    
        }
        //add the "," to the json object to make it easier to copy paste
        let text =  ","+JSON.stringify(json)
        //copy the text to the clipboard
        navigator.clipboard.writeText(text);
    } 

    /**
     * render the preview of the object
     * @param {*} ctx the context of the canvas
     */
    render(ctx){
        if(this.status){
            ctx.fillStyle = "rgba(255,255,255,0.25)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        //render the object
        //for each object update they values
        //and the render is in debug mode
        switch(this.type){
            case "Platform":
                this.#platform.x = this.#x;
                this.#platform.y = this.#y;
                this.#platform.debug = true;
                this.#platform.render(ctx);
                break;
            case "Patrolman":
                this.#patrolman.x = this.#x;
                this.#patrolman.y = this.#y;
                this.#patrolman.debug = true;
                this.#patrolman.render(ctx);
                break;
            case "CollisionBlock":
                this.#collisionBlock.x = this.#x;
                this.#collisionBlock.y = this.#y;
                this.#collisionBlock.width = this.#value1;
                this.#collisionBlock.height = this.#value2;
                this.#collisionBlock.collisionSide = this.#value3;
                this.#collisionBlock.debug = true;
                this.#collisionBlock.render(ctx);
                break;
            case "PassageWay":
                this.#passageWay.x = this.#x;
                this.#passageWay.y = this.#y;
                this.#passageWay.width = this.#value1;
                this.#passageWay.height = this.#value2;
                this.#passageWay.passageWayTo = this.#value4;
                this.#passageWay.debug = true;
                this.#passageWay.render(ctx);
                break;
            case "Bat":
                this.#bat.x = this.#x;
                this.#bat.y = this.#y;
                this.#bat.debug = true;
                this.#bat.render(ctx);
                break;
            case "Coin":
                this.#coin.x = this.#x-8;
                this.#coin.y = this.#y-8;
                this.#coin.render(ctx);
                break;
            case "Heart":
                this.#heart.x = this.#x-8;
                this.#heart.y = this.#y-8;
                
                this.#heart.render(ctx);
                break;
        }
    }
}

export default QuickObjectCreation;