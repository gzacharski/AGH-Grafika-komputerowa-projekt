import State from '/modules/states/State.js';

export default class NeutralIdleState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('neutralIdle...');
    }

    exit(){}
    
    update(timeElapsed,input){
        const { forward, backward, left, right, space, shift,leftClick } = input.keyPressed;
        const {
          walking,
          walkingBackwards,
          leftStrafeWalking,
          rightStrafeWalking,
          jumpInIdle,
          running,
          hookPunch
        } = this._parent._states;

        if(leftClick){
            input.keyPressed.leftClick=false;
            console.log("from idle to punch");
            this._parent.setState(hookPunch);

        }else if(shift && forward){
            console.log("from idle to running");
            this._parent.setState(running);

        }else if(forward){
            console.log("from idle to walking");
            this._parent.setState(walking);

        }else if(backward){
            console.log("from idle to walkingbackwards");
            this._parent.setState(walkingBackwards)

        }else if(left){
            console.log("From idle to left");
            this._parent.setState(leftStrafeWalking);

        }else if(right){
            console.log("From idle to right");
            this._parent.setState(rightStrafeWalking);

        }else if(space){
            console.log("From idle to jump");
            this._parent.setState(jumpInIdle);
        }
    }
}