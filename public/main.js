import * as THREE from '/build/three.module.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import { FBXLoader } from '/jsm/loaders/FBXLoader';
//import {PointerLockControlsCannon} from '/cannon-es/examples/js/PointerLockControlsCannon.js';
import Stats from '/jsm/libs/stats.module.js';
import * as dat from '/jsm/libs/dat.gui.module.js';
import * as Cube from '/modules/cube.js';
import * as Ground from '/modules/ground.js';
import {
    walkForward,
    walkBackwards,
    walkRight,
    walkLeft,
    turnRight,
    turnLeft,
    jump,
    run
} from '/modules/controllers/creatureController.js';
import AnimationController from '/modules/controllers/AnimationController.js';
import Test from '/modules/controllers/TestController.js';
import THREEx from '/extra_libs/Keyboard.js';
import CharacterController from '/modules/controllers/CharacterController.js';
import CharacterLoader from '/modules/loaders/CharacterLoader.js';


let test;

var clock = new THREE.Clock();
let ninjaMixer,ninja,ninjaAnimations=[],ninjaActions=[];
let stats;
var keyboard = new THREEx.KeyboardState();

//three.js variables
let scene, camera, renderer, material;

//cannon.js variables
let world, controls, sphereShape,sphereBody, physicsMaterial;
let time = Date.now();
const dt=0.01;

const creatureMovement={
    isMovingForward: false,
    isMovingBackwards: false,
    isMovingRight: false,
    isMovingLeft: false,
}

let ninjaAnimation;

//ninja actions
let idleAction, walkAction, walkBackwardAction, turnLeftAction, turnRightAction, jumpAction;
let currentAction;

const root=document.getElementById('root');

initThree();
axesHelper();
initCannon();
initPointerLock();
addStats();
loadFBX();

//test=new CharacterController(camera,controls);
let mousey;
test=new CharacterLoader('/models/fbx/character/mousey.fbx');
test.getCharacter()
    .then(model=>{
        mousey=model;
        scene.add(mousey);
    })
    .catch(error=>console.log(error));


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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
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
    material = new THREE.MeshLambertMaterial({ color: 0xdddddd })

    // Floor
    const floorGeometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100)
    floorGeometry.rotateX(-Math.PI / 2)
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

function initPointerLock() {

    //controls = new PointerLockControlsCannon(camera, sphereBody);
    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set(5,5,10);
    controls.listenToKeyEvents( window );
    
    controls.minDistance = 3;
    controls.maxDistance = 5;

    controls.maxPolarAngle = Math.PI / 2-Math.PI / 24;
    controls.minPolarAngle=Math.PI / 6; 

    //scene.add(controls.getObject())

    root.addEventListener('click', () => {
        console.log("clicked..")
        //controls.lock();
        root.style.display = 'none';
    })

    controls.addEventListener('lock', () => {
        //controls.enabled = true
        root.style.display = 'none'
    })

    controls.addEventListener('unlock', () => { 
        //controls.enabled = false
        root.style.display = null
    })
}

function addStats(){

    const gui = new dat.GUI();
    const cam=gui.addFolder('Camera');
    cam.add(camera.position, 'x').getValue();
}   

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
    stats.update();

    if(!currentAction){
        currentAction=idleAction;
    }

    update();
    if(ninja){
        controls.target=ninja.position;
    }
};

function update(){
    let diffvector=new THREE.Vector3().add(controls.target);
    diffvector.sub(camera.position);
    diffvector.multiplyScalar(0.01);

    if(ninjaMixer){
        if ( keyboard.pressed("w")){
            creatureMovement.isMovingForward=true;
            walkForward(ninja,diffvector);

            ninjaAnimation.switchAction(currentAction,walkAction);
            currentAction=walkAction;
        }else if ( keyboard.pressed("s") ){
            
            walkBackwards(ninja,camera,diffvector);
            ninjaAnimation.switchAction(currentAction,walkBackwardAction);
            currentAction=walkBackwardAction;

        }else if ( keyboard.pressed("a") ){

            walkLeft(ninja,camera,diffvector);
            ninjaAnimation.switchAction(currentAction,turnLeftAction);
            currentAction=turnLeftAction;
        }else if ( keyboard.pressed("d") ){

            walkRight(ninja,camera,diffvector);
            ninjaAnimation.switchAction(currentAction,turnRightAction);
            currentAction=turnRightAction;
        }else if ( keyboard.pressed("space") ){

            ninjaAnimation.switchAction(currentAction,jumpAction);
            currentAction=jumpAction;
        }else{
            ninjaAnimation.switchAction(currentAction,idleAction);
            currentAction=idleAction;
        }

        controls.update();
        stats.update();

        var delta = clock.getDelta();
        ninjaMixer.update(delta);
    }
}

function loadFBX(){
    const loader = new FBXLoader();
    loader.load('/models/fbx/character/ninja.fbx', model => {
        model.scale.setScalar(0.01);
        model.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        ninja=model;
        model.rotation.y = Math.PI * 1.1;
        model.position.set(0,0,0);

        const animations=[
            'Neutral Idle',
            'Walking',
            'Walking Backwards',
            'Left Strafe Walking',
            'Right Strafe Walking',
            'Jump'
        ];

        ninjaMixer = new THREE.AnimationMixer( model );
        const animationLoader=new FBXLoader();

        animationLoader.load(`/models/fbx/animations/${animations[0]}.fbx`,(theAnimation)=>{
            const clip =theAnimation.animations[0];
            clip.name=animations[0];
            idleAction = ninjaMixer.clipAction(clip);
            idleAction.weight=1;
            idleAction.enabled=true;
            idleAction.play();
            ninjaAnimation=new AnimationController(ninjaMixer,idleAction);
        });

        animationLoader.load(`/models/fbx/animations/${animations[1]}.fbx`,(theAnimation)=>{
            const clip =theAnimation.animations[0];
            clip.name=animations[1];
            walkAction = ninjaMixer.clipAction(clip);
            walkAction.weight=0;
            walkAction.enabled=true;
            walkAction.play();
        });

        animationLoader.load(`/models/fbx/animations/${animations[2]}.fbx`,(theAnimation)=>{
            const clip =theAnimation.animations[0];
            clip.name=animations[2];
            walkBackwardAction = ninjaMixer.clipAction(clip);
            walkBackwardAction.weight=0;
            walkBackwardAction.enabled=true;
            walkBackwardAction.play();
        });

        animationLoader.load(`/models/fbx/animations/${animations[3]}.fbx`,(theAnimation)=>{
            const clip =theAnimation.animations[0];
            clip.name=animations[3];
            turnLeftAction = ninjaMixer.clipAction(clip);
            turnLeftAction.weight=0;
            turnLeftAction.enabled=true;
            turnLeftAction.play();
        });

        animationLoader.load(`/models/fbx/animations/${animations[4]}.fbx`,(theAnimation)=>{
            const clip =theAnimation.animations[0];
            clip.name=animations[4];
            turnRightAction = ninjaMixer.clipAction(clip);
            turnRightAction.weight=0;
            turnRightAction.enabled=true;
            turnRightAction.play();
        });

        animationLoader.load(`/models/fbx/animations/${animations[5]}.fbx`,(theAnimation)=>{
            const clip =theAnimation.animations[0];
            clip.name=animations[5];
            jumpAction = ninjaMixer.clipAction(clip);
            jumpAction.weight=0;
            jumpAction.enabled=true;
            jumpAction.play();
        });

        scene.add(model);
    });
}