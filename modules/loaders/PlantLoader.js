import { FBXLoader } from '/jsm/loaders/FBXLoader';
import * as THREE from '/build/three.module.js';

export default class PlantLoader{
    constructor(filename){
        this._plant=this._loadPlant(filename);
    }

    _loadPlant(fileName){
        return new Promise((resolve,reject)=>{
            const loader = new FBXLoader();
            loader.setPath("/models/fbx/plants/")

            loader.loadAsync(`${fileName}.fbx`,this._onLoading)
                .then(model=>this._afterLoaded(model,resolve))
                .catch(()=>this._onError(reject))
                .finally(this._onFinally);
        });
    }

    _onLoading=(model)=>{
        console.log(`Model ${(model.loaded/model.total*100).toFixed(0)}% loaded...`);
    }

    _afterLoaded=(model,resolve)=>{

        model.scale.setScalar(0.01);
        model.traverse( child => {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;

                child.material.forEach(material=>{

                    const texture = new THREE.TextureLoader()
                        .load(`/textures/plants/${material.name}.png`);

                    texture.premultiplyAlpha=true;
                    texture.format=THREE.RGBAFormat;
                    texture.anisotropy=16;

                    material.map=texture;
                    material.transparent=true;
                })
            }else if(child.isLight){
                child.intensity=0;
            }
        });

        resolve(model);
    }

    _onError=(reject)=>{
        reject(new Error("Couldn't load the model..."));
    }

    _onFinally=()=>{
        console.log("Loading finished.");
    }

    getPlant(){
        return this._plant;
    }
}