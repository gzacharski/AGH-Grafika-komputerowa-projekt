import CharacterLoader from '/modules/loaders/CharacterLoader.js';
import AnimationLoader from '/modules/loaders/AnimationLoader.js';
import * as THREE from '/build/three.module.js';
import InputController from '/modules/controllers/InputController.js';
import CharacterStateMachine from '/modules/states/CharacterStateMachine.js';

const animations=[
    'NeutralIdle',
    'Walking',
    'WalkingBackwards',
    'LeftStrafeWalking',
    'RightStrafeWalking',
    'JumpInIdle',
    'JumpInRun',
    'Running'
];

const clock = new THREE.Clock();

export default class Character{

    constructor(name){
        this._input=new InputController();
        this._stateMachine;
        this._character=this._init(name);
    }

    async _init(name){
        try{
            const animationLoader=new AnimationLoader(animations);
            const anims=animationLoader.getAnimations()
                .map(element=>element.animation);

            let clips=[];
            for(const animation of anims){
                const theAnimation=await animation;
                let clip=theAnimation.animations[0];
                clip.name=theAnimation.name;
                clips.push(clip);
            }
            const characterLoader=new CharacterLoader(name);
            const tempModel=await characterLoader.getCharacter();
            const tempMixer=new THREE.AnimationMixer( tempModel);

            let actions=[];
            for(const clip of clips){
                let action=tempMixer.clipAction(clip);

                if(clip.name===animations[0]){
                    action.weight=1;
                }else{
                    action.weight=0;
                }

                action.enabled=true;
                action.play();

                actions[clip.name]=action;
            }

            const tempCharacter={
                actions,
                mixer: tempMixer,
                model: tempModel,
            }

            this._stateMachine=new CharacterStateMachine(tempCharacter);
            
            return tempCharacter;
        }catch(error){
            console.log(Error(error))
            return null;
        }
    }

    getCharacter(){
        return this._character;
    }

    update(timeInSeconds){
        if(!this._stateMachine._currentState) return;

        this._stateMachine.update(timeInSeconds,this._input);
    }
}