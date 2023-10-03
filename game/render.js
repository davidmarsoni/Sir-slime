class Render {
    canvas;
    ctx;

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.canvas.height = 720; // 720
        this.ctx.canvas.width = 720; // 1280
    }

    // Function to render the canvas
    rendercanvas(platforms){
        //ctx.fillStyle = "#F0F8FF";
        this.ctx.fillStyle = "#EBEBEB";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (const platform of platforms) {
            this.ctx.fillStyle = "#242424";
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
        }
    }

    // Function to render the player
    renderplayer(player, playerWeapon, keys){
        //ctx.fillStyle = "#F08080";
        this.ctx.fillStyle = "#65a22f";
        this.ctx.fillRect(player.x-player.width, player.y-player.height, player.width, player.height);
        if(keys.attack) {
            // attack
            //ctx.fillStyle = "#f0b480";
            this.ctx.fillStyle = "#e78e3d";
            if (player.direction) {
                this.ctx.fillRect((player.x), (player.y + playerWeapon.y), playerWeapon.width, playerWeapon.height);
            } else {
                this.ctx.fillRect((player.x)-player.width + playerWeapon.x, (player.y + playerWeapon.y), -playerWeapon.width, playerWeapon.height);
            }
            keys.attack = false;

        }
    }
}

export default Render;