import InputController from '/modules/controllers/InputController.js';
import CharacterStateMachine from '/modules/states/CharacterStateMachine.js';

export default class TestCharacter{

    constructor(params){
        this._init(params);
    }

    _init(params){
        this._params=params;
        this._animations={};
        this._input=new InputController();
        this._stateMachine=new CharacterStateMachine();
    }

    update(timeInSeconds){
        if(!this._stateMachine._currentState) return;

        this._stateMachine.update(timeInSeconds,this._input);
    }
}