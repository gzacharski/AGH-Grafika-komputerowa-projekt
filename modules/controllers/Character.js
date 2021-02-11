import CharacterController from '/modules/controllers/CharacterController.js';
import CharacterLoader from '/modules/loaders/CharacterLoader.js';
import AnimationLoader from '/modules/loaders/AnimationLoader.js';
import * as THREE from '/build/three.module.js';

const animations=[
    'NeutralIdle',
    'Walking',
    'WalkingBackwards',
    'LeftStrafeWalking',
    'RightStrafeWalking',
    'Jump',
    'Running'
];

const clock = new THREE.Clock();

export default class Character{

    constructor(name,camera,controls){
        this._character=this._init(name,camera,controls);
        this.controller;
    }

    async _init(name,camera,controls){
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

                actions.push({
                    name: clip.name,
                    action
                })
            }

            this.controller=new CharacterController(tempModel,camera,controls,actions);
            
            return {
                model: tempModel,
                mixer: tempMixer,
                actions
            }
        }catch(error){
            console.log(Error(error))
            return null;
        }
    }

    getCharacter(){
        return this._character;
    }
}