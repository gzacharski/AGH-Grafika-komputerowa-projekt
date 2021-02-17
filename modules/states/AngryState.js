import State from '/modules/states/State.js';

export default class Angry extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(){
        //console.log('Being angry ...');
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
            //console.log("From being angry to idle");
            this._parent.setState(neutralIdle);

        }else if(space){
            //console.log("From being angry to jump");
            this._parent.setState(jumpInIdle);
        }


    }
}