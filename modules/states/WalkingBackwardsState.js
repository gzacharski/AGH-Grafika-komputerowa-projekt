import State from '/modules/states/State.js';

export default class WalkingBackwardsState extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(previousState){
        console.log('walkingBackwards...');
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
    }s

    exit(){}

    update(timeElapsed,input){
        const {backward} =input.keyPressed;
        const {neutralIdle}=this._parent._states;

        if(!backward) {
            console.log("from walking backward to idle");
            this._parent.setState(neutralIdle);
        }
    }
}