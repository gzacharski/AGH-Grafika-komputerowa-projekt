import State from '/modules/states/State.js';
import * as THREE from '/build/three.module.js';

export default class WalkingState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('walking...');
        const {position}=this._parent._character.model;
        const {rotation}=this._parent._character.model;

        if(this._accelerationFactor<=1) this._accelerationFactor+=0.01;

        const vector=new THREE.Vector3(
                Math.sin(rotation.y),
                0,
                Math.cos(rotation.y),
            )
            .multiplyScalar(0.05)
            .multiplyScalar(this._accelerationFactor);
        position.add(vector);
    }

    exit(){}

    update(timeElapsed,input){
        const {forward,shift,space,leftClick} =input.keyPressed;
        const {running,neutralIdle,walking,jumpInRun,hookPunch}=this._parent._states;

        if(leftClick){
            input.keyPressed.leftClick=false;
            console.log("from idle to punch");
            this._parent.setState(hookPunch);

        }else if(forward && space){
            console.log("From walking to jump in run");
            this._parent.setState(jumpInRun);

        }else if(forward && shift) {
            console.log("from walking to running");
            this._parent.setState(running);

        }else if(!forward){
            console.log("from walking to idle");
            this._parent.setState(neutralIdle);

        }else{
            this._parent.setState(walking);
        }
    }
}