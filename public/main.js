import * as THREE from '/build/three.module.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';
//import {PointerLockControlsCannon} from '/cannon-es/examples/js/PointerLockControlsCannon.js';
import Stats from '/jsm/libs/stats.module.js';
import * as dat from '/jsm/libs/dat.gui.module.js';
import Character from '/modules/Character.js';
import GameplayCamera from '../modules/GameplayCamera.js';

const clock = new THREE.Clock();
clock.start();
let stats;

//three.js variables
let scene, camera, renderer, material, gameplayCamera;

//cannon.js variables
let world, sphereShape,sphereBody, physicsMaterial;

//models
let character={status:false};

const root=document.getElementById('root');
document.addEventListener('click', () => {
    root.style.display = 'none';
    character._input.disabled=false;
});

initThree();
axesHelper();
initCannon();
addStats();
initCharacter();
initGameplayCamera();
addSkyBox();
addPlaneHelper();
animate();


function initThree(){
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 600);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.lookAt(new THREE.Vector3(10, 0, 0));

    renderer =new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    stats = Stats();
    document.body.appendChild(stats.dom);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight)

    const spotlight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1)
    spotlight.position.set(10, 30, 20)
    spotlight.target.position.set(0, 0, 0)

    spotlight.castShadow = true

    spotlight.shadow.camera.near = 10
    spotlight.shadow.camera.far = 100
    spotlight.shadow.camera.fov = 30

    // spotlight.shadow.bias = -0.0001
    spotlight.shadow.mapSize.width = 2048
    spotlight.shadow.mapSize.height = 2048

    scene.add(spotlight)

    // Generic material
    material = new THREE.MeshLambertMaterial()
    const texture = new THREE.TextureLoader().load( "/textures/grasslight-big.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1000, 1000);
    texture.anisotropy=16;
    texture.encoding=THREE.sRGBEncoding;
    material.map=texture;
    material.magFilter=THREE.NearestFilter;

    // Floor
    const floorGeometry = new THREE.PlaneBufferGeometry(3000, 3000, 1000, 1000)
    floorGeometry.rotateX(-Math.PI / 2);

    const floor = new THREE.Mesh(floorGeometry, material)
    floor.receiveShadow = true
    scene.add(floor)

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}

function axesHelper(){
    //The X axis is red. The Y axis is green. The Z axis is blue.
    const axesHelper=new THREE.AxesHelper(5);
    scene.add(axesHelper);
}

function initCannon(){
    world=new CANNON.World();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRelaxation = 4;

    const solver = new CANNON.GSSolver()
    solver.iterations = 7
    solver.tolerance = 0.1
    world.solver = new CANNON.SplitSolver(solver)

    world.gravity.set(0, -50, 0)

    physicsMaterial = new CANNON.Material('physics')
    const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
      friction: 0.0,
      restitution: 0.3,
    })

    world.addContactMaterial(physics_physics);

    //user collision sphere
    const radius = 1.3
    sphereShape = new CANNON.Sphere(radius)
    sphereBody = new CANNON.Body({ mass: 5, material: physicsMaterial })
    sphereBody.addShape(sphereShape)
    sphereBody.position.set(0, 1.3,3)
    sphereBody.linearDamping = 0.9
    world.addBody(sphereBody);

    //ground physics
    const groundShape=new CANNON.Plane();
    const groundBody=new CANNON.Body({mass: 0, material: physicsMaterial})
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);
}

function addStats(){
    const gui = new dat.GUI();
    const cam=gui.addFolder('Camera');
    cam.add(camera.position, 'x').getValue();
}

function initCharacter(){
    character=new Character('ninja');
    
    character.getCharacter().then(theCharacter=>{
            character._character=theCharacter;
            scene.add(character._character.model);
            character.status=true;
        })
        .catch(error=>console.log(error));
}

function initGameplayCamera(){
    gameplayCamera=new GameplayCamera({
        scene,
        character,
        camera,
        renderer
    });
}

function addSkyBox(){
    scene.background= new THREE.CubeTextureLoader()
        .setPath( '/textures/')
        .load([
            'meadow_rt.jpg',
            'meadow_lf.jpg',
            'meadow_up.jpg',
            'meadow_dn.jpg',
            'meadow_bk.jpg',
            'meadow_ft.jpg',
        ]);
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    stats.update();

    const delta = clock.getDelta();
    if(character.status) character.update(delta);

    gameplayCamera.update();
};

function addPlaneHelper(){
    const plane = new THREE.Plane( new THREE.Vector3( 1, 1, 0.2 ), 3 );
    const helper = new THREE.PlaneHelper( plane, 1, 0xffff00 );
    scene.add( helper );
}