class Render {
    canvas;
    ctx;
    siteURL = "http://localhost/";
    spriteDim = 32;
    playerSPRITE = new Image();
    playerWeaponSPRITE = new Image();
    backgroundIMAGE = new Image();
    counter = 0;
    timer = 0;

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.canvas.height = 720; // 720
        this.ctx.canvas.width = 1520; // 1280
        this.playerSPRITE.src = this.siteURL+"Sprites/PlayerSheet.png";
        this.playerWeaponSPRITE.src = this.siteURL+"Sprites/PlayerWeaponSheet.png";
        this.backgroundIMAGE.src = this.siteURL+"Sprites/BG.png"

    }

    // Function to render the canvas
    rendercanvas(platforms){
        //ctx.fillStyle = "#F0F8FF";
        this.ctx.fillStyle = "#EBEBEB";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //this.ctx.drawImage(this.backgroundIMAGE,0,0, this.ctx.canvas.width, this.ctx.canvas.height)
        for (const platform of platforms) {
            this.ctx.fillStyle = "#242424";
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        }
    }

    // Function to render the player
    // TODO https://codehs.com/tutorial/andy/Programming_Sprites_in_JavaScript
    renderplayer(player, playerWeapon, keys){
        // direction
        let spriteDirectionOffset;
        if (!player.direction) {
            spriteDirectionOffset = this.spriteDim;
        } else {
            spriteDirectionOffset = 0;
        }


        let animationOffset = 0;
        if (player.jump){
            if (player.y_v > 0){
                //falling
                animationOffset = this.spriteDim*5;
            } else {
                //jumping
                animationOffset = this.spriteDim*4;
            }
        } else if (keys.left || keys.right) {
            // movement
            this.counter++;
            if (this.counter === 4) {
                this.counter = 0;
                this.timer++;
                if (this.timer === 4) {
                    this.timer = 0;
                }
            }
            animationOffset = this.timer * 32;
        } else if(keys.attack) {
            // attack
            animationOffset = this.spriteDim*6;
            this.ctx.drawImage(
                this.playerWeaponSPRITE,
                spriteDirectionOffset,  //sprite sheet offset x
                0,  //sprite sheet offset y
                32, //sprite sheet w
                32, //sprite sheet h
                player.x - (spriteDirectionOffset*2),
                player.y - player.height,
                player.width,
                player.height
            );
            this.counter++;
            if (this.counter === 4) {
                keys.attack = false;
                this.counter = 0;
            }
        } else {
            this.counter = 0;
            this.timer = 0;
        }

        this.ctx.drawImage(
            this.playerSPRITE,
            spriteDirectionOffset,  //sprite sheet offset x
            animationOffset,  //sprite sheet offset y
            32, //sprite sheet w
            32, //sprite sheet h
            player.x - player.width,
            player.y - player.height,
            player.width,
            player.height
        );
    }
}

export default Render;