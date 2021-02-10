import { FBXLoader } from '/jsm/loaders/FBXLoader';

export default class AnimationLoader {
    constructor(animationArray){
        this.animations=this._loadAnimations(animationArray);
    }

    _loadAnimations(animationArray){
        const loader = new FBXLoader();
        loader.setPath("/models/fbx/animations/");

        return animationArray
            .map(animationName=>({
                name : animationName,
                animation : this._loadAnimation(animationName,loader)
            })
        );
    }

    _loadAnimation=(name,loader)=>{
        return new Promise((resolve,reject)=>{
            loader.loadAsync(`${name}.fbx`,animation=>this._onLoading(animation,name))
                .then(animation=>this._afterLoaded(animation,name,resolve))
                .catch(animation=>this._onError(animation,reject))
                .finally(this._onFinally)
        });
    }

    _onLoading=(animation,name)=>{
        console.log(`Animation ${name} loaded ${(animation.loaded/animation.total*100).toFixed(0)}%...`);
    }

    _afterLoaded=(animation,name,resolve)=>{
        animation.name=name;
        resolve(animation);
    }

    _onError=(reject)=>{
        reject(new Error("Couldn't load the model..."));
    }

    _onFinally=()=>{
        console.log("Animation loading finished.");
    }

    getAnimations(){
        return this.animations;
    }
}