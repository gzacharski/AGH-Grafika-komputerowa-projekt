import * as THREE from '/build/three.module.js';
import * as CANNON from '/cannon-es/dist/cannon-es.js';
import Stats from '/jsm/libs/stats.module.js';
import Character from '/modules/Character.js';
import GameplayCamera from '/modules/GameplayCamera.js';
import WoodBox from '/modules/WoodBox.js';
import Forest from '/modules/Forest.js';
import Magician from '/modules/Magician.js';
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from './jsm/postprocessing/AfterimagePass.js';

const clock = new THREE.Clock();
clock.start();
let stats;
let canPlay=false;

//three.js variables
let scene, camera, renderer, material, gameplayCamera;

//cannon.js variables
let world, physicsMaterial, woodBoxes;

//postprocessing
let composer;

//models
let character={status:false},magician={status:false} ;

const root=document.getElementById('root');
document.addEventListener('click', () => {
    if(canPlay){
        root.style.display = 'none';
        character._input.disabled=false;
        magician._canPlayAnimation=true;
    }
});

initThree();
//axesHelper();
initCannon();
initCharacter();
initMagician();
initGameplayCamera();
addSkyBox();
initPlants();
addWoodBox();
addPostprocessing();
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
    floor.receiveShadow = true;
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

    world.gravity.set(0, -10, 0)

    physicsMaterial = new CANNON.Material('physics')
    const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
      friction: 0.1,
      restitution: 0.1,
    })

    world.addContactMaterial(physics_physics);

    //ground physics
    const groundShape=new CANNON.Plane();
    const groundBody=new CANNON.Body({mass: 0, material: physicsMaterial})
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);
}

function initCharacter(){
    character=new Character('ninja',physicsMaterial);
    
    character.getCharacter().then(theCharacter=>{
            character._character=theCharacter;
            character._character.body.position.set(0,1,15);
            scene.add(character._character.model);
            world.addBody(character._character.body);
            character.status=true;
        })
        .catch(error=>console.log(error));
}

function initMagician(){
    magician=new Magician('magician',physicsMaterial);

    magician.getCharacter().then(theMagician=>{
            magician._character=theMagician;
            magician._character.body.position.set(3,1,-5);
            magician._character.model.rotation.y=0;
            scene.add(magician._character.model);
            world.addBody(magician._character.body);
            magician.status=true;
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

function initPlants(){
    new Forest({
        world,
        scene,
        physicsMaterial
    });
}

function addWoodBox(){
    woodBoxes=[
        new WoodBox({
            world,
            scene,
            position: {
                x:5,
                y:0,
                z:-5
            },
            size: 2,
            physicsMaterial
        }),
        new WoodBox({
            world,
            scene,
            position: {
                x:5,
                y:2,
                z:-5
            },
            size: 0.5,
            physicsMaterial
        })
    ]
}

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    stats.update();

    const delta = clock.getDelta();
    if(character.status){
        character.update(delta);
        woodBoxes.forEach(box=>box.update());
    } 

    if(magician.status) {
        magician.update(delta);
        if(magician.castSpell) composer.render();
    }

    if(!canPlay && character.status && magician.status) showStartupWindow();

    gameplayCamera.update();
    world.step(1/60);
};

function addPostprocessing(){
    composer = new EffectComposer( renderer );
    composer.addPass( new RenderPass( scene, camera ) );

    const afterimagePass = new AfterimagePass();
    composer.addPass( afterimagePass );
}

function showStartupWindow(){
    
    const logs=document.getElementById('logs');
    if(logs) logs.remove();

    const rendering=document.getElementById('rendering');
    rendering.style.display='block';

    setTimeout(()=>{
        rendering.remove();

        const root=document.getElementById('root');
        root.style.backgroundColor= 'rgba(0, 0, 0, 0.5)';

        const instructions=document.getElementById('instructions');
        instructions.style.display='block';
        instructions.style.transition = "all 2s";
        canPlay=true;
    },5000);
}