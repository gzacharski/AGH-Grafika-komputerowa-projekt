import CharacterController from '/modules/controllers/CharacterController.js';
import CharacterLoader from '/modules/loaders/CharacterLoader.js';
import AnimationLoader from '/modules/loaders/AnimationLoader.js';
import * as THREE from '/build/three.module.js';

const animations=[
    'Neutral Idle',
    'Walking',
    'Walking Backwards',
    'Left Strafe Walking',
    'Right Strafe Walking',
    'Jump'
];

const clock = new THREE.Clock();

export default class Character{

    constructor(scene,camera,name){
        this._character=this._init(scene,name);
    }

    async _init(scene,name){
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