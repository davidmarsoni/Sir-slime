import Platform from "../platform/Platform.js";
import CollisionBlock from "../CollisionBlock.js";
import Patrolman from "../entity/enemy/Patrolman.js";
import PassageWay from "../PassageWay.js";
import Bat from "../entity/enemy/Bat.js";
import Coin from "../collectible/Coin.js";
import Heart from "../collectible/Heart.js";
import ActivationPlatform from "../platform/ActivationPlatform.js";
import MovablePlatform from "../platform/MovablePlatform.js";
import Spike from "../entity/Spike.js";
import LoaderManager from "./LoaderManager.js";


class QuickObjectCreation{
    #objects_list;
    #canvasWidth;
    #textForTheObject;

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
    #activationPlatform;
    #movablePlatform;
    #patrolman; 
    #collisionBlock;
    #passageWay;
    #bat; 
    #coin; 
    #heart;
    #spike;
    
    #textExplain;
    

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
        this.#objects_list = [Platform.name,ActivationPlatform.name,MovablePlatform.name,CollisionBlock.name,PassageWay.name,Coin.name,Heart.name,Bat.name,Patrolman.name,Spike.name];
        this.#canvasWidth = this.#canvas.offsetWidth;
        this.#textForTheObject = [
            "Platform",
            "ActivationPlatform : \t value 1 : width \t value 2 : height \t value 3 : triggerZoneX \t value 4 : triggerZoneY",
            "MovablePlatform : \t value 1 : path1 x \t value 2 : path1 y \t value 3 : path2 x \t value 4 : path2 y \t",
            "CollisionBlock : \t value 1 : width \t value 2 : height \t value 3 : collisionSide \t",
            "PassageWay : \t value 1 : width \t value 2 : height \t value 4 : passageWayTo \t",
            "Coin : \t value 3 : value \t",
            "Heart : \t value 3 : value \t",
            "Bat : \t value 3 : damage \t value 2 : triggerZone \t",
            "Patrolman : \t value 3 : damage \t value 4 : speed \t",
            "Spike : \t value 1 : downTime \t value 2 : upTime \t value 3 : damage \t value 4 : facing \t"
        ]
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

    createDOMElement(){

    }

    createObjects(){
        LoaderManager.loadFromJson("assets/json/DefaultObject.json").then((data) => {
            let json = JSON.parse(data);

            console.log(json);
        });
        



    
        //create object for the preview
        this.#platform = new Platform(0,0,96,16,"assets/sprites/DecorSheet.png",0,0,96,16);
        this.#activationPlatform = new ActivationPlatform(0,0,96,16,"assets/sprites/DecorSheet.png",96,0,96,16,10,10,200);
        this.#movablePlatform = new MovablePlatform([
             {
                 "x": 300,
                 "y": 500
             },
             {
                 "x": 600,
                 "y": 200
             }
        ],96,48,"assets/sprites/DecorSheet.png",0,48,96,48,2);
 
        this.#patrolman = new Patrolman(0,0,32,32,"assets/sprites/Patrolman.png",0,0,32,32);
        this.#collisionBlock = new CollisionBlock(0,0,100,100,0);
        this.#passageWay = new PassageWay(0,0,100,100,"");
        this.#bat = new Bat(0,0,32,32,"assets/sprites/Bats.png",0,0,2,1,200,200,0,0,false,false);
        this.#coin = new Coin(0,0,16,16,"assets/sprites/Collectible.png",0,0);
        this.#heart = new Heart(0,0,16,16,"assets/sprites/Collectible.png",0,0);
        this.#spike = new Spike(0,0,32,32,"assets/sprites/spike.png",1,1,0,false,0,0);
    }

    init(){
        //change display of the body to block
        let body = document.querySelector('body');
        body.style.display = "block";
        //change the background color of the page to white
        document.body.style.backgroundColor = "white";
        //change the cursor to crosshair on the canvas
        this.canvas.style.cursor = "crosshair";
       
        this.createObjects();
        //add a title to the quick object creation
        const title = document.createElement('h2');
        title.style.fontFamily = "Montserrat,sans-serif,arial";
        title.innerHTML = "Quick object creation";
        title.style.color = "black";
        this.canvas.parentNode.insertBefore(title, this.canvas);

        //add a text to explain how to use the quick object creation
        this.#textExplain = document.createElement('p');
        this.#textExplain.style.fontFamily = "Montserrat,sans-serif,arial";
        this.#textExplain.innerHTML = "Select an object and click on the canvas to create it";
        this.#textExplain.style.color = "black";
        this.canvas.parentNode.insertBefore(this.#textExplain, this.canvas);


        //create the select element
        const select = document.createElement('select');

        //add the options to the select element
        for (const object of this.#objects_list){
            const option = document.createElement('option');
            option.value = object;
            option.text = object;
            select.appendChild(option);
        }

        // Add an event listener 
        // get the x,y and the value of the input and some other data
        select.addEventListener('change', (event) => {
            this.type = event.target.value;
            //update the text to explain how to use the quick object creation with the table above  
            if(this.#textExplain !== undefined){
                this.#textExplain.innerHTML = this.#textForTheObject[this.#objects_list.indexOf(this.type)];
            }
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
        input1.placeholder = "value1";
        //default value
        input1.value = "100";
        this.canvas.parentNode.insertBefore(input1, this.canvas);

        //create the second input
        const input2 = document.createElement('input');
        input2.type = "text";
        input2.id = "input2";
        input2.placeholder = "value2";
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
        //change display of the body to flex
        let body = document.querySelector('body');
        body.style.display = "flex";
        //change the background color of the page to black 242424
        document.body.style.backgroundColor = "#242424";
        //change the cursor to default on the canvas
        this.canvas.style.cursor = "default";
        document.getElementById("input1").remove();
        document.getElementById("input2").remove();
        document.getElementById("input3").remove();
        document.getElementById("input4").remove();
        document.querySelector('select').remove();
        document.querySelector('h2').remove();
        document.querySelector('div').remove();
        document.querySelector('p').remove();
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
            case "ActivationPlatform":
                console.log("activationPlatform created");
                json = {
                    "ActivationPlatform": {
                        "x": x,
                        "y": y,
                        "width": parseInt(value1) == 0 ? 96 :parseInt(value1),
                        "height": parseInt(value2) == 0 ? 16 :parseInt(value2),
                        "spriteSheetOffsetX" : 96,
                        "spriteSheetOffsetY" : 0,
                        "spriteSheetWidth" : parseInt(value1) == 0 ? 96 :parseInt(value1),
                        "spriteSheetHeight" : parseInt(value2) == 0 ? 16 :parseInt(value2),
                        "texturepath": "assets/sprites/DecorSheet.png",
                        "triggerZoneX": parseInt(value3) == 0 ? 10 :parseInt(value3),
                        "triggerZoneY": parseInt(value4) == 0 ? 10 :parseInt(value4),
                        "activationTimer": 200
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
                        "speed": parseInt(value4) == 0 || value4 == "" ? 1 : parseInt(value4),
                        "damage": parseInt(value3) == 0 ? 1 :parseInt(value3),
                        "texturepath": "assets/sprites/Patrolman.png",
                        "sound":"assets/sounds/ennemy/patrolman/hit.wav"
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
                json ={
                    "Bat": {
                        "x": x,
                        "y": y,
                        "height": 32,
                        "width": 32,
                        "origin_x": 64,
                        "origin_y": 450,
                        "speed": 2,
                        "damage": 1,
                        "triggerZoneWidth": parseInt(value1) == 0 ? 200 :parseInt(value1),
                        "triggerZoneHeight": parseInt(value1) == 0 ? 200 :parseInt(value1),
                        "triggerZoneX": 0,  
                        "triggerZoneY": 0,
                        "triggerZoneFollow" : false,
                        "triggeredMode" : false, 
                        "texturepath": "assets/sprites/Bats.png",
                        "soundPath" : "assets/sounds/enemy/bat/hit.wav"
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
                        "texturepath": "assets/sprites/Collectible.png",
                        "soundPath":"assets/sounds/collectible/coin.mp3"
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
                        "texturepath": "assets/sprites/Collectible.png",
                        "soundPath":"assets/sounds/collectible/heart_gain.mp3"
                    }
                };
                break;
            case "MovablePlatform":
                console.log("MovablePlatform created");
                json = {
                    "MovablePlatform": {
                        "width":96,
                        "height": 16,
                        "spriteSheetOffsetX": 0,
                        "spriteSheetOffsetY": 48,
                        "spriteSheetWidth": 96,
                        "spriteSheetHeight": 16,
                        "triggerZoneX": 50,
                        "triggerZoneY": 30,
                        "activationTimer": 500,
                        "texturepath": "assets/sprites/DecorSheet.png",
                        "path": [
                            {
                                        "x": parseInt(this.#value1) == 0 ? this.#x-parseInt(this.#value1): parseInt(this.#value1),
                        "y": parseInt(this.#value2) == 0 ? this.#y-parseInt(this.#value2): parseInt(this.#value2)
                            },
                            {
                                "x": parseInt(this.#value3) == 0 ? this.#x+parseInt(this.#value3): parseInt(this.#value3),
                                "y": parseInt(this.#value4) == 0 ? this.#y+parseInt(this.#value4): parseInt(this.#value4)
                            }
                        ],
                        "speed": 1
                    }
                };
                break;
            case "Spike":
                console.log("Spike created");
                json = {
                    "Spike":{
                        "x": x,
                        "y": y,
                        "width": 32,
                        "height": 32,
                        "texturepath": "assets/sprites/spike.png",
                        "damage": parseInt(value3) == 0 ? 1 :parseInt(value3),
                        "facing": 0,
                        "fixed": false,
                        "upTime": parseInt(value2) == 0 ? 1 :parseInt(value2),
                        "downTime": parseInt(value1) == 0 ? 1 :parseInt(value1)
                    }
                };
    
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
            case "ActivationPlatform":
                this.#activationPlatform.x = this.#x;
                this.#activationPlatform.y = this.#y;
                this.#activationPlatform.width = parseInt(this.#value1);
                this.#activationPlatform.height = parseInt(this.#value2);
                this.#activationPlatform.triggerZoneX = parseInt(this.#value3) < 0 ? 10 :parseInt(this.#value3);
                this.#activationPlatform.triggerZoneY = parseInt(this.#value4) < 0 ? 10 :parseInt(this.#value4);
                this.#activationPlatform.debug = true;
                this.#activationPlatform.render(ctx);
                break;
            case "MovablePlatform": 
                this.#movablePlatform.x = parseInt(this.#value1) == 0 ? this.#x-parseInt(this.#value1): parseInt(this.#value1);
                this.#movablePlatform.y = parseInt(this.#value2) == 0 ? this.#y-parseInt(this.#value2): parseInt(this.#value2);
                this.#movablePlatform.spriteSheetOffsetX = 0;
                this.#movablePlatform.spriteSheetOffsetY = 48;
                let path = [
                    {
                        "x": parseInt(this.#value1) == 0 ? this.#x-parseInt(this.#value1): parseInt(this.#value1),
                        "y": parseInt(this.#value2) == 0 ? this.#y-parseInt(this.#value2): parseInt(this.#value2)
                    },
                    {
                        "x": parseInt(this.#value3) == 0 ? this.#x+parseInt(this.#value3): parseInt(this.#value3),
                        "y": parseInt(this.#value4) == 0 ? this.#y+parseInt(this.#value4): parseInt(this.#value4)
                    }
                ];
                this.#movablePlatform.path = path;
                this.#movablePlatform.debug = true;
                this.#movablePlatform.render(ctx);
                break;
            case "Patrolman":
                this.#patrolman.x = this.#x;
                this.#patrolman.y = this.#y;
                this.#patrolman.path = [this.#x - 50,this.#x + 50];
                this.#patrolman.debug = true;
                this.#patrolman.damage = parseInt(this.#value3) == 0 ? 1 :parseInt(this.#value3);
                this.#patrolman.speed = parseInt(this.#value4) == 0 ? 1 :parseInt(this.#value4);
                this.#patrolman.render(ctx);
                break;
            case "CollisionBlock":
                this.#collisionBlock.x = this.#x;
                this.#collisionBlock.y = this.#y;
                this.#collisionBlock.width = this.#value1;
                this.#collisionBlock.height = this.#value2;
                this.#collisionBlock.collisionSide = parseInt(this.#value3) > 3 ? 0 :parseInt(this.#value3);
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
                this.#bat.triggerZone = parseInt(this.#value2) == 0 ? 200 :parseInt(this.#value2);
                this.#bat.damage = parseInt(this.#value1) == 0 ? 1 :parseInt(this.#value1);
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
            case "Spike":
                this.#spike.x = this.#x;
                this.#spike.y = this.#y;
                this.#spike.upTime = parseInt(this.#value2) == 0 ? 1 :parseInt(this.#value2);
                this.#spike.downTime = parseInt(this.#value1) == 0 ? 1 :parseInt(this.#value1);
                this.#spike.damage = parseInt(this.#value3) == 0 ? 1 :parseInt(this.#value3);
                this.#spike.facing = parseInt(this.#value4) == 0 ? 1 :parseInt(this.#value4);
                this.#spike.debug = true;
                this.#spike.render(ctx);
                break;
        }
    }
}

export default QuickObjectCreation;