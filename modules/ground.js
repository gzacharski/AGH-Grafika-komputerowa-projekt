import * as THREE from '/build/three.module.js';

const init=()=>{
    const planeGeometry=new THREE.PlaneGeometry(100,100,100,100);
    const planeMaterial=new THREE.MeshLambertMaterial({color: 0xee00ee, side:THREE.DoubleSide});

    const plane=new THREE.Mesh(planeGeometry,planeMaterial);
    plane.receiveShadow=true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0
    plane.position.y = 0
    plane.position.z = 0

    return plane;
}

export {init};