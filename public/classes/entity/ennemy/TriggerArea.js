import GameObjectLogic from '../../GameObjectLogic.js';

class TriggerArea extends GameObjectLogic {

   constructor(x, y) {
      super(x, y);
      this.width = 32;
      this.height = 32;
   }
}

export default TriggerArea;