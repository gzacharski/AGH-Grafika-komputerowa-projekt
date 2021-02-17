import State from '/modules/states/State.js';
import * as THREE from '/build/three.module.js';

export default class RunningState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        //console.log('running...');
        const {position}=this._parent._character.body;
        const {rotation}=this._parent._character.model;

        if(this._accelerationFactor<=1) this._accelerationFactor+=0.01;

        const vector=new THREE.Vector3(
                Math.sin(rotation.y),
                0,
                Math.cos(rotation.y),
            )
            .multiplyScalar(0.1)
            .multiplyScalar(this._accelerationFactor);
        
        let tempVector=new THREE.Vector3(position.x,position.y,position.z);
        tempVector.add(vector);
        const {x,y,z}=tempVector;
        this._parent._character.body.position.set(x,y,z);
    }

    exit(){}

    update(timeElapsed,input){
        const {forward,space,shift}=input.keyPressed;
        const {neutralIdle,walking,jumpInRun,running}=this._parent._states;
        
        if(forward && shift && space){
            //console.log("From walking to jump in run");
            this._parent.setState(jumpInRun);

        }else if(forward && !shift){
            //console.log("From running to walking");
            this._parent.setState(walking);

        }else if(!forward){
            //console.log("From running to idle");
            this._parent.setState(neutralIdle);

        }else{
            this._parent.setState(running);
        }
    }
}