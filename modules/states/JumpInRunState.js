import State from '/modules/states/State.js';
import * as THREE from '/build/three.module.js';

export default class JumpInRunState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        //console.log('jumpInRun...');

        setTimeout(
            ()=>{
                //console.log("From jumpInRun to run");
                const {running}=this._parent._states;
                this._parent.setState(running);
            },
            this._action._clip.duration*1000
        );
    }

    exit(){}

    update(timeElapsed,input){
        console.log("Jump in run update...");

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
        
        let tempVector=new THREE.Vector3(position.x,position.y+0.15,position.z);
        tempVector.add(vector);
        const {x,y,z}=tempVector;
        this._parent._character.body.position.set(x,y,z);
        
    }
}