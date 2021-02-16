import State from '/modules/states/State.js';
import * as THREE from '/build/three.module.js';

export default class NeutralIdleState extends State{
    constructor(parent,action){
        super(parent,action);
        this._clock=new THREE.Clock();
        this._timeElapsedToGetAngry=6; //in seconds
    }

    enter(previousState){
        console.log('neutralIdle...');
        this._clock.start();
    }

    exit(){}
    
    update(timeElapsed,input){
        const { forward, backward, left, right, space, shift,arrowUp,arrowDown} = input.keyPressed;
        const {
          walking,
          walkingBackwards,
          leftStrafeWalking,
          rightStrafeWalking,
          jumpInIdle,
          running,
          hookPunch,
          bigSideHit,
          yawn
        } = this._parent._states;

        if(arrowUp){
            console.log("from idle to punch");
            this._parent.setState(hookPunch);

        }else if(arrowDown){
            console.log("from idle to bigSideHit");
            this._parent.setState(bigSideHit);
        
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

        }else if(this._clock.getElapsedTime()>this._timeElapsedToGetAngry){
            console.log("From idle to yawning");
            this._parent.setState(yawn);
        }
    }
}