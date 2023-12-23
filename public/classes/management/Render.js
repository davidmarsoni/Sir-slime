import Button from "../ui/Button.js";
import Heart from "../collectible/Heart.js";
import firebase from "./Firebase.js";
class Render {
   canvas;
   ctx;
   debug = false;
   developerMode = false;
   heart;

   constructor(debug = false, developerMode = false) {
      this.debug = debug;
      this.developerMode = developerMode;
      this.canvas = document.getElementById("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.ctx.canvas.height = 720;
      this.ctx.canvas.width = 1520;
      this.collectible = new Heart(0, 0, 16, 16, "assets/sprites/hud.png");
      this.collectible.isAnimated = false;
      this.collectible.isAlive = false;
   }

   render(loader, quickObjectCreation, keys) {
      //if the song is not playing play it
      this.renderCanvas(loader.backgroundImage);
      this.renderObjects(loader.platforms, loader.collisionBlocks, loader.passageWays, loader.doors, loader.collectibles, loader.spikes);
      this.renderEntities(loader.patrolmen, loader.bats, loader.boss);
      this.renderPlayer(loader.player, keys);
      this.renderScorboard(loader);

      //render the quick object creation
      quickObjectCreation.render(this.ctx);
   }

   renderCanvas(backgroundImage) {
      //test the type of the backgroundImage
      if (backgroundImage != null) {
         this.ctx.drawImage(backgroundImage, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      } else {
         this.ctx.fillStyle = "rgba(240,240,240,1)";
         this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      }
   }
   renderObjects(platforms, collisionBlocks, passageWays, doors, collectibles, spikes) {

      for (const collisionBlock of collisionBlocks) {
         collisionBlock.debug = this.debug;
         collisionBlock.render(this.ctx);
      }

      for (const platform of platforms) {
         platform.debug = this.debug;
         platform.render(this.ctx);
      }

      for (const passageWay of passageWays) {
         passageWay.debug = this.debug;
         passageWay.render(this.ctx);
      }

      for (const door of doors) {
         door.debug = this.debug;
         door.render(this.ctx);
      }

      for (const collectible of collectibles) {
         collectible.debug = this.debug;
         collectible.render(this.ctx);
      }

      for (const spike of spikes) {
         spike.debug = this.debug;
         spike.render(this.ctx);
      }
   }

   // Function to render the player
   renderPlayer(player, keys) {
      if (!player) {
         console.error('Player object is null');
         return;
      }
      player.debug = this.debug;
      player.render(this.ctx, keys);
   }

   renderEntities(patrolmen, bats, boss) {
      for (const patrolman of patrolmen) {
         patrolman.debug = this.debug;
         patrolman.render(this.ctx);
      }
      for (const bat of bats) {
         bat.debug = this.debug;
         bat.render(this.ctx);
      }

      if (boss != null) {
         boss.debugCascade(this.debug);
         boss.render(this.ctx);
      }
   }
   renderScorboard(loader) {
      let width = 0;
      let height = 34;
      // render mods
      if (this.debug) {
         width += this.#drawText("Debug mode", 20, height);
         width += 10;
      }
     
      if (this.developerMode) {
         width += this.#drawText("Developer mode", 20 + width, height);
         width += 10;
      }
      width += this.#drawText(loader.levelDisplayName, 20 + width, height);

      //draw number of coins collected
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(width + 10, 10, 40, height + 1);
      this.collectible.spriteSheetOffsetX = 0;
      this.collectible.animStep = 0;
      this.collectible.x = 20 + width;
      this.collectible.y = height - 14;
      this.collectible.render(this.ctx);
      width += 30;

      // draw the number of coin collected
      width += this.#drawText(loader.player.numberOfCoinsCollected.toString().padStart(3, '0'), 20 + width, height);
      width += 10;

      // draw the heal
      this.#drawHealth(loader.player.health, loader.player.maxHealth, 20 + width, height);

      //draw score and lives
      width = this.ctx.canvas.width;
      height = 34;
      width -= this.#drawText("x" + loader.player.lives.toString().padStart(2, '0'), width, height, true);
      width -= 10;
      width -= this.#drawText(loader.player.score.toString().padStart(6, '0'), width, height, true);

      let x = this.ctx.canvas.width;
      let y = this.ctx.canvas.height - 20;
      height = 34;
      this.#drawConnexionButton(loader,x, y, true);

     
   }
   #drawConnexionButton(loader,x,y,onlyUser = false){
      let height = 34;
      let pseudo = firebase.isUserSignedIn() ? firebase.getCurrentUserName() : "Guest";
      let width = this.#drawText(pseudo, x, y, true);
      x -= width + 10;

      if(!onlyUser){
         let buttonText = firebase.isUserSignedIn() ? "Disconnect" : "Connect";
         width = this.#drawText(buttonText, x, y, true, firebase.isUserSignedIn() ? "#7B0000" : "#00621B");

         loader.connectButton.x = x - width - 10;
         loader.connectButton.y = y - 24;
         loader.connectButton.width = width;
         loader.connectButton.height = height;
         loader.connectButton.debug = this.debug;
         loader.connectButton.render(this.ctx);
      }
   }

   #drawHealth(health, maxHealth, x, y) {
      let width = 16 + 20 * Math.floor(maxHealth / 2) + (maxHealth % 2 === 1 ? 20 : 0);
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(x - 10, y - 24, width, 36);
      //draw the full life
      this.#drawHearts(x, y, Math.floor(maxHealth / 2), maxHealth % 2 === 1, 2);
      //draw the remaining life
      this.#drawHearts(x, y, Math.floor(health / 2), health % 2 === 1, 1, 1);
   }

   #drawHearts(x, y, NumberOfHeart, hasHalfHeart, spriteSheetOffsetX, currentLife = false) {
      this.collectible.spriteSheetOffsetX = spriteSheetOffsetX;
      this.collectible.animStep = 0;
      this.collectible.y = y - 14;
      for (let i = 0; i < NumberOfHeart; i++) {
         this.collectible.x = x + i * 20;
         this.collectible.render(this.ctx);
      }

      if (hasHalfHeart) {
         currentLife && this.collectible.animStep++;
         this.collectible.x = x + NumberOfHeart * 20;
         this.collectible.render(this.ctx);
      }
   }

   #drawText(text, x, y, removeWidth = false, backgroundcolor = "black", textColor = "white") {
      this.ctx.textAlign = "left";
      this.ctx.font = "20px Consolas";
      this.ctx.fillStyle = backgroundcolor;
      const metrics = this.ctx.measureText(text);
      const textWidth = metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;
      let width = Math.round(textWidth) + 20;
      let height = 35;
      removeWidth && (x -= width);
      this.ctx.fillRect(x -10, y - 24, width, height);
      this.ctx.fillStyle = textColor;
      this.ctx.fillText(text, x , y);
      return width;
   }

   renderStart(loader) {
      if (loader.mainBackground != null) {
         this.ctx.drawImage(loader.mainBackground, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      }

      //draw connexion button
      this.#drawConnexionButton(loader,this.ctx.canvas.width, 34);
      
      for (const startMenuButton of loader.startMenuButtons) {
         startMenuButton.debug = this.debug;
         startMenuButton.render(this.ctx);
      }

   }

   renderSkinPage(loader) {
      if (loader.skinBackground != null) {
         this.ctx.drawImage(loader.skinBackground, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      }

      //draw connexion button
      this.#drawConnexionButton(loader,this.canvas.width, 34);

      //Title of the page
      this.ctx.fillStyle = "rgba(255,255,255,1)";
      this.ctx.textAlign = "left";
      this.ctx.font = "bold 40px Consolas";
      this.ctx.fillText("Choose your skin", 100, 80);
     
      //subtitle of the page
      this.ctx.fillStyle = "rgba(255,255,255,1)";
      this.ctx.textAlign = "left";
      this.ctx.font = "bold 20px Consolas";
      this.ctx.fillText("to choose a skin, use drag and drop", 100, 120);

     
      loader.currentSkinPreview.debug = this.debug;
      loader.currentSkinPreview.render(this.ctx);
      
      for (const startMenuButton of loader.startMenuButtons) {
         startMenuButton.debug = this.debug;
         startMenuButton.render(this.ctx);
      }

      for (const draggableObject of loader.draggableObjects) {
         draggableObject.debug = this.debug;
         draggableObject.render(this.ctx);
      }

      for (const draggableZone of loader.draggableZones) {
         draggableZone.debug = this.debug;
         draggableZone.render(this.ctx);
      }
   }

   renderModalWindow(modalWindow) {
      modalWindow.render(this.ctx);
   }
}

export default Render;