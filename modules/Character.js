import CharacterLoader from '/modules/loaders/CharacterLoader.js';
import AnimationLoader from '/modules/loaders/AnimationLoader.js';
import * as THREE from '/build/three.module.js';
import InputController from '/modules/controllers/InputController.js';
import CharacterStateMachine from '/modules/states/CharacterStateMachine.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';

const animations=[
    'NeutralIdle',
    'Walking',
    'WalkingBackwards',
    'LeftStrafeWalking',
    'RightStrafeWalking',
    'JumpInIdle',
    'JumpInRun',
    'Running',
    'HookPunch',
    'Angry',
    'BigSideHit',
    'Yawn',
    'Bashful',
    'Bored',
    'HappyIdle'
];

const clock = new THREE.Clock();

const bodySize=0.5;

export default class Character{

    constructor(name,physicsMaterial){
        this._input=new InputController();
        this._stateMachine;
        this._character=this._init(name,physicsMaterial);
    }

    async _init(name,physicsMaterial){
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
                body : this._initBody(physicsMaterial)
            }

            this._stateMachine=new CharacterStateMachine(tempCharacter);
            
            return tempCharacter;
        }catch(error){
            console.log(Error(error))
            return null;
        }
    }

    _initBody(physicsMaterial){
        const size=new CANNON.Vec3(bodySize,bodySize,bodySize)
        const shape=new CANNON.Box(size);
        const body=new CANNON.Body({mass: 500, material: physicsMaterial});

        body.position.set(0,bodySize,0);
        body.addShape(shape);

        return body;
    }

    getCharacter(){
        return this._character;
    }

    update(timeInSeconds){
        const {x,y,z}=this._character.body.position;
        this._character.model.position.set(x,y-bodySize,z);
        
        if(!this._stateMachine._currentState) return;

        this._stateMachine.update(timeInSeconds,this._input);

        this._character.mixer.update(timeInSeconds);
    }
}