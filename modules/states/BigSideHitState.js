import State from '/modules/states/State.js';

export default class BigSideHit extends State{
    constructor(parent,action){
        super(parent,action);
    }

    enter(prevState){
        //console.log('Being angry ...');
        
        setTimeout(
            ()=>{
                //console.log("From being Angry to idle");
                const {neutralIdle,walking}=this._parent._states;

                if(prevState===neutralIdle){
                    this._parent.setState(neutralIdle);
                }else{
                    this._parent.setState(walking);
                }
            },
            this._action._clip.duration*1000
        );
    }

    exit(){}

    update(timeElapsed,input){}
}