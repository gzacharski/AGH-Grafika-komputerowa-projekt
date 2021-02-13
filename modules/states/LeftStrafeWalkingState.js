import State from '/modules/states/State.js';
import * as THREE from '/build/three.module.js';

export default class LeftStrafeWalkingState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('leftStrafeWalking...');
        const {position}=this._parent._character.model;
        const {rotation}=this._parent._character.model;

        if(this._accelerationFactor<=1) this._accelerationFactor+=0.01;

        const vector=new THREE.Vector3(
                Math.cos(rotation.y),
                0,
                Math.sin(rotation.y),
            )
            .multiplyScalar(0.05)
            .multiplyScalar(this._accelerationFactor);
        position.add(vector);
    }

    exit(){}

    update(timeElapsed,input){
        const {left}=input.keyPressed;
        const {neutralIdle,leftStrafeWalking}=this._parent._states;

        if(!left){
            console.log("From left to idle");
            this._accelerationFactor=0.1;
            this._parent.setState(neutralIdle);
        }else{
            this._parent.setState(leftStrafeWalking);
        }
    }
}