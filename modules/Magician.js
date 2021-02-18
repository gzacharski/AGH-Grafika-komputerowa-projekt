import CharacterLoader from '/modules/loaders/CharacterLoader.js';
import AnimationLoader from '/modules/loaders/AnimationLoader.js';
import * as THREE from '/build/three.module.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';

const animations=[
    'NeutralIdle',
    'Standing2HMagicAttack',
];

const bodySize=0.5;

export default class Magician{

    constructor(name,physicsMaterial){
        this._canPlayAnimation=false;
        this.castSpell=false;
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
            
            return tempCharacter;
        }catch(error){
            console.log(Error(error))
            return null;
        }
    }

    _initBody(physicsMaterial){
        const size=new CANNON.Vec3(bodySize,bodySize,bodySize)
        const shape=new CANNON.Box(size);
        const body=new CANNON.Body({mass: 10000, material: physicsMaterial});

        body.position.set(0,bodySize,0);
        body.addShape(shape);

        body.addEventListener('collide',()=>{
            this._castSpell();
        });

        return body;
    }

    getCharacter(){
        return this._character;
    }

    update(timeInSeconds){
        const {x,y,z}=this._character.body.position;
        this._character.model.position.set(x,y-bodySize,z);

        this._character.mixer.update(timeInSeconds);
    }

    _castSpell(){
        if(this._canPlayAnimation){
            this._canPlayAnimation=false;
            const idle=this._character.actions.NeutralIdle;
            const spell=this._character.actions.Standing2HMagicAttack;
        
            spell.enabled = true;
            spell.setEffectiveTimeScale( 1 );
            spell.setEffectiveWeight( 1 );
            spell.time = 0;
            idle.crossFadeTo( spell, 0.5, true );
    
            setTimeout(() => {
                idle.enabled = true;
                idle.setEffectiveTimeScale( 1 );
                idle.setEffectiveWeight( 1 );
                idle.time = 0;
                spell.crossFadeTo( idle, 0.5, true );
                this._canPlayAnimation=true;
            }, spell._clip.duration*1000);

            setTimeout(()=>this.castSpell=true,0.7*spell._clip.duration*1000);
            setTimeout(()=>this.castSpell=false,0.7*spell._clip.duration*1000+2500);
        }
    }
}   