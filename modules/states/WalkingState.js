import State from '/modules/states/State.js';

export default class WalkingState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('walking...');
        const {position}=this._parent._character.model;
        position.x+=0.01;
        position.z+=0.01;

    }

    exit(){}

    update(timeElapsed,input){
        const {forward,shift,space} =input.keyPressed;
        const {running,neutralIdle,walking,jumpInRun}=this._parent._states;

        if(forward && space){
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