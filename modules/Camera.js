import * as THREE from '/build/three.module.js';

export default class Camera{
    constructor(params) {
        this._params = params;
        this._camera = params.camera;
    
        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }

    _calculateIdealOffset() {
        const idealOffset = new THREE.Vector3(-15, 20, -30);
        idealOffset.applyQuaternion(this._params.target.Rotation);
        ideaslOffset.add(this._params.target.Position);
        return idealOffset;
    }
    
    _calculateIdealLookat() {
        const idealLookat = new THREE.Vector3(0, 10, 50);
        idealLookat.applyQuaternion(this._params.target.Rotation);
        idealLookat.add(this._params.target.Position);
        return idealLookat;
    }
    
    update(timeElapsed) {
        const idealOffset = this._calculateIdealOffset();
        const idealLookat = this._calculateIdealLookat();

        const t = 1.0 - Math.pow(0.001, timeElapsed);
    
        this._currentPosition.lerp(idealOffset, t);
        this._currentLookat.lerp(idealLookat, t);
    
        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookat);
    }
}