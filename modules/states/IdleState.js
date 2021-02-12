import State from '/modules/states/State.js';

export default class NeutralIdleState extends State{
    // constructor(parent){
    //     super(parent);
    // }
    get Position(){
        
    }

    getName(){
        return 'NeutralIdle';
    }

    enter(){
        console.log(this);
    }
    exit(){

    }
    update(){

    }
}