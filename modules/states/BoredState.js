import State from '/modules/states/State.js';
import * as THREE from '/build/three.module.js';

export default class BoredState extends State{
    constructor(parent,action){
        super(parent,action);
        this._clock=new THREE.Clock();
    }

    enter(){
        //console.log('Yawning ...');
        this._clock.start();
    }

    exit(){}

    update(timeElapsed,input){

        const {
            forward,
            backward,
            left ,
            right ,
            space ,
            arrowUp ,
            arrowDown ,
            arrowLeft ,
            arrowRight 
        } =input.keyPressed;

        const {neutralIdle,jumpInIdle}=this._parent._states;

        if(forward|| backward ||left || right || arrowUp || arrowDown || arrowLeft|| arrowRight ){
            //console.log("From yawning to idle");
            this._parent.setState(neutralIdle);

        }else if(space){
            //console.log("From yawning to jump");
            this._parent.setState(jumpInIdle);

        }else if(this._clock.getElapsedTime()>this._action._clip.duration){
            //console.log("From yawning to being angry");
            const {
                angry,
                yawn,
                bashful,
                bored,
                happyIdle
            }=this._parent._states;

            let boredStates=[angry,yawn,bashful,bored,happyIdle];
            const randomNumber=Math.floor(Math.random()*boredStates.length);
            
            this._parent.setState(boredStates[randomNumber]);
        }
    }
}