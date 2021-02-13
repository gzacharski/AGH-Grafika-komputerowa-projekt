import State from '/modules/states/State.js';
import * as THREE from '/build/three.module.js';

export default class WalkingBackwardsState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('walkingBackwards...');
        const {position}=this._parent._character.model;
        const {rotation}=this._parent._character.model;

        if(this._accelerationFactor<=1) this._accelerationFactor+=0.01;

        const vector=new THREE.Vector3(
                Math.sin(rotation.y),
                0,
                Math.cos(rotation.y),
            )
            .multiplyScalar(-0.05)
            .multiplyScalar(this._accelerationFactor);
        position.add(vector);
    }

    exit(){}

    update(timeElapsed,input){
        const {backward} =input.keyPressed;
        const {neutralIdle,walkingBackwards}=this._parent._states;

        if(!backward) {
            console.log("from walking backward to idle");
            this._parent.setState(neutralIdle);
        }else{
            this._parent.setState(walkingBackwards);
        }
    }
}