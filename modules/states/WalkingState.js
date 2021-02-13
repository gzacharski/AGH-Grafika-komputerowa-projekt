import State from '/modules/states/State.js';

export default class WalkingState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('walking...');
        // const {mixer}=this._parent._character;
        // const {Walking,NeutralIdle}=this._parent._character.actions;

        // Walking.weight=1;
        // NeutralIdle.weight=0;

        // const {position}=this._parent._character.model;
        // position.x+=0.1;
        // position.z+=0.1;
        // const currentAction=this._parent._animations['walking'].action;
        // if(previousState){
        //     const previousAction=this._parent._proxy._animations[previousState.name].action;

        //     currentAction.enabled=true;
        //     currentAction.setEffectiveTimeScale(1);
        //     currentAction.setEffectiveWeight(1);
        //     currentAction.time = 0;
        //     currentAction.crossFadeFrom( previousAction, this._duration, true );
        //     currentAction.play();
        // }else{
        //     currentAction.play();
        // }
    }

    exit(){}

    update(timeElapsed,input){
        const {forward,shift} =input.keyPressed;
        const {running,neutralIdle}=this._parent._states;

        if(forward && shift) {
            console.log("from walking to running");
            this._parent.setState(running);

        }else if(!forward){
            console.log("from walking to idle");
            this._parent.setState(neutralIdle);
        }
    }
}