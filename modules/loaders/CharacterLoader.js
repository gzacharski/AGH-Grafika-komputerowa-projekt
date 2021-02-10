import { FBXLoader } from '/jsm/loaders/FBXLoader';

export default class CharacterLoader{
    constructor(fileName){
        this.character=this._loadCharacter(fileName);
    }

    _loadCharacter(fileName){
        return new Promise((resolve,reject)=>{
            const loader = new FBXLoader();

            loader.loadAsync(fileName,this._onLoading)
                .then(model=>this._afterLoaded(model,resolve))
                .catch(model=>this._onError(model,reject))
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
            }
        });
        
        model.rotation.y = Math.PI * 1.1;
        model.position.set(2,0,2);
        console.log("Model loaded");
        resolve(model);
    }

    _onError=(reject)=>{
        reject(new Error("Couldn't load the model..."));
    }

    _onFinally=()=>{
        console.log("Loading finished.");
    }

    getCharacter(){
        return this.character;
    }    
}