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
import ObjectFactory from "./ObjectFactory.js";
import Door from "../Door.js";
import EnemyFactory from "./EnemyFactory.js";


class QuickObjectCreation {
    #objects_list;
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
    #door;

    #textExplain;

    #objectsData =[];


    mouseDownHandler = (e) => {
        this.getMousePosition(e);
    };

    mouseMoveHandler = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.#x = e.clientX - rect.left;
        this.#y = e.clientY - rect.top;
        
        //get the value of the input if there is one
        if (input1.value !== "") {
            this.#value1 = input1.value;
        }
        const input2 = document.getElementById("input2");
        if (input2.value !== "") {
            this.#value2 = input2.value;
        }
        const input3 = document.getElementById("input3");
        if (input3.value !== "") {
            this.#value3 = input3.value;
        }
        const input4 = document.getElementById("input4");

        if (input4.value !== "") {
            this.#value4 = input4.value;
        }
    };

    constructor() {
        this.#objects_list = ["Chose your object",Platform.name, ActivationPlatform.name, MovablePlatform.name, CollisionBlock.name, PassageWay.name, Coin.name, Heart.name, Bat.name, Patrolman.name, Spike.name, Door.name];
        this.#textForTheObject = [
            "Select an object and click on the canvas to create it you can also use the inputs to change some values, at the end of the creation the json object will be copied to the clipboard",
            "Platform",
            "ActivationPlatform : \t value 1 : width \t value 2 : height \t value 3 : triggerZoneX \t value 4 : triggerZoneY",
            "MovablePlatform : \t value 1 : path1 x \t value 2 : path1 y \t value 3 : path2 x \t value 4 : path2 y \t (if no value is given the first path is the position of the mouse)",
            "CollisionBlock : \t value 1 : width \t value 2 : height \t value 3 : collisionSide \t",
            "PassageWay : \t value 1 : width \t value 2 : height \t value 4 : passageWayTo \t",
            "Coin : \t value 3 : value \t",
            "Heart : \t value 3 : heal valu \t value 4 : number of heart gain (1 heart = 2 points) \t",
            "Bat : \t value 1 : triggerZoneWidth \t value 2 : triggerZoneHeight \t value 3 : triggerZoneX \t value 4 : triggerZoneY \t (if no value is to triggerZoneX and triggerZoneY the triggerZone will be around the bat) \t",
            "Patrolman : \t value 3 : damage \t value 4 : speed \t",
            "Spike : \t value 1 : downTime \t value 2 : upTime \t value 3 : damage \t value 4 : facing \t",
            "Door : \t value 1 : triggerZoneX \t value 2 : triggerZoneY \t value 3 : activationTimer \t"
        ]
    }

    open() {
        this.#status = true;
        this.init();
    }
    close() {
        this.#status = false;
        this.remove();
    }

    get status() { return this.#status; }
    get canvas() { return this.#canvas; }
    set canvas(canvas) { this.#canvas = canvas; }
    get type() { return this.#type; }
    set type(type) { this.#type = type; }

    createDOMElement() {
        //add a title to the quick object creation
        const title = document.createElement('h2');
        title.style.fontFamily = "Montserrat,sans-serif,arial";
        title.innerHTML = "Quick object creation";
        title.style.color = "black";
        this.canvas.parentNode.insertBefore(title, this.canvas);

        //add a text to explain how to use the quick object creation
        this.#textExplain = document.createElement('p');
        this.#textExplain.style.fontFamily = "Montserrat,sans-serif,arial";
        this.#textExplain.innerHTML = "Select an object and click on the canvas to create it you can also use the inputs to change some values, at the end of the creation the json object will be copied to the clipboard";
        this.#textExplain.style.color = "black";
        this.canvas.parentNode.insertBefore(this.#textExplain, this.canvas);

        //create the select element
        const select = document.createElement('select');

        //add the options to the select element
        for (const object of this.#objects_list) {
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
            if (this.#textExplain !== undefined) {
                this.#textExplain.innerHTML = this.#textForTheObject[this.#objects_list.indexOf(this.type)];
            }
        });

        //set the default value
        //select.value = "Platform";
        //this.type = "Platform";

        // Insert the select element before the canvas
        this.canvas.parentNode.insertBefore(select, this.canvas)

        //create the first input
        const input1 = document.createElement('input');
        input1.type = "text";
        input1.id = "input1";
        input1.placeholder = "value1";
        input1.style.marginLeft = "10px";
        //default value
        input1.value = "100";
        this.canvas.parentNode.insertBefore(input1, this.canvas);

        //create the second input
        const input2 = document.createElement('input');
        input2.type = "text";
        input2.id = "input2";
        input2.placeholder = "value2";
        input2.style.marginLeft = "10px";
        //default value
        input2.value = "100";
        this.canvas.parentNode.insertBefore(input2, this.canvas);

        //create the third input
        const input3 = document.createElement('input');
        input3.type = "text";
        input3.id = "input3";
        input3.placeholder = "value 3";
        input3.style.marginLeft = "10px";
        this.canvas.parentNode.insertBefore(input3, this.canvas);

        //create the 4th input
        const input4 = document.createElement('input');
        input4.type = "text";
        input4.id = "input4";
        input4.placeholder = "text";
        input4.style.marginLeft = "10px";
        this.canvas.parentNode.insertBefore(input4, this.canvas);

        //add a div between the select and the canvas with a height of 10px
        const div = document.createElement('div');
        div.style.height = "20px";
        //add a id to the div
        div.id = "space_div";
        this.canvas.parentNode.insertBefore(div, this.canvas);

    }

    createObjects() {
        const objectfactory = new ObjectFactory();
        const enemyFactory = new EnemyFactory();

        LoaderManager.loadFromJson("assets/jsons/DefaultObject.json").then((data) => {
            this.#objectsData = data;

            this.#platform = objectfactory.createObject(Platform.name, data.objects[Platform.name]);
            this.#activationPlatform = objectfactory.createObject(ActivationPlatform.name, data.objects[ActivationPlatform.name]);
            this.#movablePlatform = objectfactory.createObject(MovablePlatform.name, data.objects[MovablePlatform.name]);
            this.#collisionBlock = objectfactory.createObject(CollisionBlock.name, data.objects[CollisionBlock.name]);
            this.#passageWay = objectfactory.createObject(PassageWay.name, data.objects[PassageWay.name]);
            this.#coin = objectfactory.createObject(Coin.name, data.objects[Coin.name]);
            this.#heart = objectfactory.createObject(Heart.name, data.objects[Heart.name]);
            this.#spike = objectfactory.createObject(Spike.name, data.objects[Spike.name]);
            this.#door = objectfactory.createObject(Door.name, data.objects[Door.name]);
            
            this.#patrolman = enemyFactory.createEnemy(Patrolman.name, data.enemies[Patrolman.name]);
            this.#bat = enemyFactory.createEnemy(Bat.name, data.enemies[Bat.name]);

        });
    }

    init() {
        //change the background color of the page to white
        document.body.style.backgroundColor = "white";
        //change the cursor to crosshair on the canvas
        this.canvas.style.cursor = "crosshair";

        this.createDOMElement();
        this.createObjects();

        //add the event listener to the canvas
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }

    /**
     * remove the quick object creation to not interfere with the game
     */
    remove() {

        //remove the title
        const title = document.querySelector('h2');
        title.parentNode.removeChild(title);

        //remove the text to explain how to use the quick object creation
        const textExplain = document.querySelector('p');
        textExplain.parentNode.removeChild(textExplain);

        //remove the select element
        const select = document.querySelector('select');
        select.parentNode.removeChild(select);

        //remove the first input
        const input1 = document.getElementById("input1");
        input1.parentNode.removeChild(input1);

        //remove the second input
        const input2 = document.getElementById("input2");
        input2.parentNode.removeChild(input2);

        //remove the third input
        const input3 = document.getElementById("input3");
        input3.parentNode.removeChild(input3);

        //remove the 4th input
        const input4 = document.getElementById("input4");
        input4.parentNode.removeChild(input4);

        //remove the div    
        document.getElementById("space_div").remove();


        //remove the event listener to the canvas
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);

        //change the cursor to default
        this.canvas.style.cursor = "default";

        //change the background color of the page to black
        document.body.style.backgroundColor = "#242424";

        this.#type = "";

    }

    /**
     * get the mouse position and create the json object
     * @param {*} event  the mouse event
     */
    getMousePosition(event) {
        //get the mouse position
        let x = event.clientX - this.canvas.offsetLeft;
        let y = event.clientY - this.canvas.offsetTop;
        let json;

        let value1 = 0;
        let value2 = 0;
        let value3 = 0;
        let value4 = "";

        //get the value of the input if there is one and find the right type of data
        const input1 = document.getElementById("input1");

        if (input1.value !== "") {
            value1 = input1.value;
        }
        const input2 = document.getElementById("input2");
        if (input2.value !== "") {
            value2 = input2.value;
        }
        const input3 = document.getElementById("input3");
        if (input3.value !== "") {
            value3 = input3.value;
        }
        const input4 = document.getElementById("input4");

        if (input4.value !== "") {
            value4 = input4.value;
        }

        if (this.type === "") {
            console.log("no type selected");
            return;
        }
        //create the json object
        // this code is not very clean but it works for now
        // TODO : find a better way to do this (maybe with a .tosring() method on each object)
        switch (this.type) {
            case Platform.name:
                console.log("platform created");
                //create the json object for the type 
                //and copy to the clipboard
                json = this.#objectsData.objects[Platform.name];
                json.x = x;
                json.y = y;
                break;
            case "ActivationPlatform":
                console.log("activationPlatform created");
                json = this.#objectsData.objects[ActivationPlatform.name];
                json.x = x;
                json.y = y;
                json.width = parseInt(value1) == 0 ? 96 : parseInt(value1);
                json.height = parseInt(value2) == 0 ? 16 : parseInt(value2);
                json.spriteSheetHeight = parseInt(value2) == 0 ? 16 : parseInt(value2);
                json.spriteSheetWidth = parseInt(value1) == 0 ? 96 : parseInt(value1);
                json.triggerZoneX = parseInt(value3) == 0 ? 10 : parseInt(value3);
                json.triggerZoneY = parseInt(value4) == 0 ? 10 : parseInt(value4);
                break;
                break;
            case "Patrolman":
                console.log("patrolman created");
                json = this.#objectsData.enemies[Patrolman.name];
                json.x = x;
                json.y = y;
                json.origin_x = x;
                json.origin_y = y;
                json.path = [x - 50, x + 50];
                json.damage = parseInt(value3) == 0 ? 1 : parseInt(value3);
                json.speed = parseInt(value4) == 0 ? 1 : parseInt(value4);
                break;

            case "CollisionBlock":
                console.log("collisionBlock created");
                json = this.#objectsData.objects[CollisionBlock.name];
                json.x = x;
                json.y = y;
                json.width = parseInt(value1);
                json.height = parseInt(value2);
                json.collisionSide = parseInt(value3) > 3 ? 0 : parseInt(value3);
                break;
            case "PassageWay":
                json = this.#objectsData.objects[PassageWay.name];
                json.x = x;
                json.y = y;
                json.width = parseInt(value1);
                json.height = parseInt(value2);
                json.passageWayTo = value4;
                break;
            case "Bat":
                console.log("bat created");
                json = this.#objectsData.enemies[Bat.name];
                json.x = x;
                json.y = y;
                json.origin_x = x; 
                json.origin_y = y;
                json.triggerZoneWidth = parseInt(value1) == 0 ? 100 : parseInt(value1);
                json.triggerZoneHeight = parseInt(value2) == 0 ? 100 : parseInt(value2);
                json.triggerZoneX = parseInt(value3) == 0 ? 0 : parseInt(value3);
                json.triggerZoneY = parseInt(value4) == 0 ? 0 : parseInt(value4);
                break;
            case "Coin":
                console.log("coin created");
                json = this.#objectsData.objects[Coin.name];
                json.x = x - 8;
                json.y = y - 8;
                json.value = parseInt(value3) == 0 ? 10 : parseInt(value3);
                break;
               
            case "Heart":
                console.log("Heart created");
                json = this.#objectsData.objects[Heart.name];
                json.x = x - 8;
                json.y = y - 8;
                json.heal = parseInt(value3) == 0 ? 1 : parseInt(value3);
                json.value = parseInt(value4) == 0 ? 0 : parseInt(value4);
            case "MovablePlatform":
                console.log("MovablePlatform created");

                json = this.#objectsData.objects[MovablePlatform.name];
                json.path = [
                    {
                        "x": parseInt(value1) == 0 ? x : parseInt(value1),
                        "y": parseInt(value2) == 0 ? y : parseInt(value2)
                    },
                    {
                        "x": parseInt(value3) == 0 ? x + parseInt(value3) : parseInt(value3),
                        "y": parseInt(value4) == 0 ? y + parseInt(value4) : parseInt(value4)
                    }
                ];
                break;
            case "Spike":
                console.log("Spike created");
                json = this.#objectsData.objects[Spike.name];
                json.x = x;
                json.y = y;
                json.upTime = parseInt(value2) == 0 ? 1 : parseInt(value2);
                json.downTime = parseInt(value1) == 0 ? 1 : parseInt(value1);
                json.damage = parseInt(value3) == 0 ? 1 : parseInt(value3);
                json.facing = parseInt(value4) == 0 ? 1 : parseInt(value4);
                break;
            case "door":
                console.log("door created");
                json = this.#objectsData.objects[Door.name];
                json.x = x;
                json.y = y;
                json.triggerZoneX = parseInt(value1) == 0 ? 10 : parseInt(value1);
                json.triggerZoneY = parseInt(value2) == 0 ? 10 : parseInt(value2);
                json.activationTimer = parseInt(value3) == 0 ? 500 : parseInt(value3);
                break;
            default:
                break;
        }
        //add the "," to the json object to make it easier to copy paste
        let text = "," + JSON.stringify(json)
        //copy the text to the clipboard
        navigator.clipboard.writeText(text);
    }

    /**
     * render the preview of the object
     * @param {*} ctx the context of the canvas
     */
    render(ctx) {
        if (this.status) {
            ctx.fillStyle = "rgba(255,255,255,0.1)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        //render the object
        //for each object update they values
        //and the render is in debug mode
        switch (this.type) {
            case Platform.name:
                this.#platform.x = this.#x;
                this.#platform.y = this.#y;
                this.#platform.debug = true;
                this.#platform.render(ctx);
                break;
            case ActivationPlatform.name:
                this.#activationPlatform.x = this.#x;
                this.#activationPlatform.y = this.#y;
                this.#activationPlatform.width = parseInt(this.#value1);
                this.#activationPlatform.height = parseInt(this.#value2);
                this.#activationPlatform.triggerZoneX = parseInt(this.#value3) < 0 ? 10 : parseInt(this.#value3);
                this.#activationPlatform.triggerZoneY = parseInt(this.#value4) < 0 ? 10 : parseInt(this.#value4);
                this.#activationPlatform.debug = true;
                this.#activationPlatform.render(ctx);
                break;
            case MovablePlatform.name:
                this.#movablePlatform.path = [
                    {
                        "x": parseInt(this.#value1) == 0 ? this.#x : parseInt(this.#value1),
                        "y": parseInt(this.#value2) == 0 ? this.#y : parseInt(this.#value2)
                    },
                    {
                        "x": parseInt(this.#value3) == 0 ? this.#x + parseInt(this.#value3) : parseInt(this.#value3),
                        "y": parseInt(this.#value4) == 0 ? this.#y + parseInt(this.#value4) : parseInt(this.#value4)
                    }
                ];
                this.#movablePlatform.debug = true;
                this.#movablePlatform.render(ctx);
                break;
            case Patrolman.name:
                this.#patrolman.x = this.#x;
                this.#patrolman.y = this.#y;
                this.#patrolman.path = [this.#x - 50, this.#x + 50];
                this.#patrolman.debug = true;
                this.#patrolman.speed = parseInt(this.#value4) == 0 ? 1 : parseInt(this.#value4);
                this.#patrolman.render(ctx);
                break;
            case CollisionBlock.name:
                this.#collisionBlock.x = this.#x;
                this.#collisionBlock.y = this.#y;
                this.#collisionBlock.width = this.#value1;
                this.#collisionBlock.height = this.#value2;
                this.#collisionBlock.collisionSide = parseInt(this.#value3) > 3 ? 0 : parseInt(this.#value3);
                this.#collisionBlock.debug = true;
                this.#collisionBlock.render(ctx);
                break;
            case PassageWay.name:
                this.#passageWay.x = this.#x;
                this.#passageWay.y = this.#y;
                this.#passageWay.width = this.#value1;
                this.#passageWay.height = this.#value2;
                this.#passageWay.passageWayTo = this.#value4;
                this.#passageWay.debug = true;
                this.#passageWay.render(ctx);
                break;
            case Bat.name:
                this.#bat.x = this.#x;
                this.#bat.y = this.#y;
                this.#bat.triggerZoneWidth = parseInt(this.#value1) == 0 ? 100 : parseInt(this.#value1);
                this.#bat.triggerZoneHeight = parseInt(this.#value2) == 0 ? 100 : parseInt(this.#value2);
                this.#bat.triggerZoneX = parseInt(this.#value3) == 0 ? 0 : parseInt(this.#value3);
                this.#bat.triggerZoneY = parseInt(this.#value4) == 0 ? 0 : parseInt(this.#value4);
                this.#bat.debug = true;
                this.#bat.render(ctx);
                break;
            case Coin.name:
                this.#coin.x = this.#x - 8;
                this.#coin.y = this.#y - 8;
                this.#coin.render(ctx);
                break;
            case Heart.name:
                this.#heart.x = this.#x - 8;
                this.#heart.y = this.#y - 8;

                this.#heart.render(ctx);
                break;
            case Spike.name:
                this.#spike.x = this.#x;
                this.#spike.y = this.#y;
                this.#spike.upTime = parseInt(this.#value2) == 0 ? 1 : parseInt(this.#value2);
                this.#spike.downTime = parseInt(this.#value1) == 0 ? 1 : parseInt(this.#value1);
                this.#spike.facing = parseInt(this.#value4) == 0 ? 1 : parseInt(this.#value4);
                this.#spike.debug = true;
                this.#spike.render(ctx);
                break;
            case Door.name:
                this.#door.x = this.#x;
                this.#door.y = this.#y;
                this.#door.triggerZoneX = parseInt(this.#value1) == 0 ? 10 : parseInt(this.#value1);
                this.#door.triggerZoneY = parseInt(this.#value2) == 0 ? 10 : parseInt(this.#value2);
                this.#door.activationTimer = parseInt(this.#value3) == 0 ? 500 : parseInt(this.#value3);
                this.#door.debug = true;
                this.#door.render(ctx);
                break;
            default:
                break;
        }
    }
}

export default QuickObjectCreation;