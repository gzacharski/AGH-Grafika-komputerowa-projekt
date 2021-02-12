import State from '/modules/states/State.js';

export default class NeutralIdleState extends State{
    constructor(parent){
        super(parent);
    }

    get name(){
        return 'neutralIdle';
    }

    enter(previousState){
        console.log('neutralIdle...');
        // const currentAction=this._parent._proxy._animations['neutralIdle'].action;

        // if(previousState){
        //     const previousAction=this._parent._proxy._animations[previousState.name].action;

        //     currentAction.enabled=true;
        //     currentAction.setEffectiveTimeScale(1);
        //     currentAction.setEffectiveWeight(1);
        //     currentAction.time = 0;
        //     currentAction.crossFadeFrom( previousAction, this._duration, true );
        //     currentAction.play();
        // }else{
        //     idleAction.play();
        // }
    }

    exit(){}
    
    update(timeElapsed,input){
        const { forward, backward, left, right, space, shift } = input.keyPressed;
        const {
          walking,
          walkingBackwards,
          leftStrafeWalking,
          rightStrafeWalking,
          jumpInIdle,
          running
        } = this._parent._states;

        if(shift && forward){
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