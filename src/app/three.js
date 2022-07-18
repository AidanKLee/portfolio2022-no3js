import * as THREE from 'three';
import { OrbitControls } from './OrbitControls';
import * as dat from 'dat.gui';
import front from '../assets/textures/front.png';
import back from '../assets/textures/back.png';
import left from '../assets/textures/left.png';
import right from '../assets/textures/right.png';
import top from '../assets/textures/top.png';
import bottom from '../assets/textures/bottom.png';
import starPNG from '../assets/textures/star.png';

// GUI 
// const gui = new dat.GUI();

const loadingManager = new THREE.LoadingManager();

// Canvas Element
const canvas = document.querySelector('canvas#three');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

const sphereGeometry = new THREE.SphereGeometry(.5, 50, 50);

const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 6000;

const particlePosition = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i ++) {
    particlePosition[i] = 32 * (Math.random() - .5);
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePosition, 3));

// Materials
const material = new THREE.MeshLambertMaterial();
material.color = new THREE.Color(0x222222);


const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(500, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
const sphereCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
scene.add(sphereCamera);

const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff, envMap: cubeRenderTarget.texture, 
    // metalness: 1, roughness: 0
});

const loader = new THREE.TextureLoader(loadingManager);
const star = loader.load(starPNG);

const pointsMaterial = new THREE.PointsMaterial({
    size: .096,
    transparent: true,
    map: star,
    color: 0xf1f1f1
})



// Mesh
const torus = new THREE.Mesh(geometry, material);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.position.set(0, 0, -1);

const particles = new THREE.Points(particlesGeometry, pointsMaterial);

scene.add(sphere, particles);
// Lights
const ambientLight = new THREE.AmbientLight(0xFFFFFF, .5)
const pointLight = new THREE.PointLight(0xFFFFFF, 1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(ambientLight, pointLight);

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight };

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGL1Renderer({ antialias: true ,canvas });
renderer.setClearColor(0x1a1a1a);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Skybox
const urls = [
    right, left,
    top, bottom,
    front, back
]

const cubeLoader = new THREE.CubeTextureLoader(loadingManager);
scene.background = cubeLoader.load(urls);


// Get Mouse Position
let mouseX = 0, mouseY = 0;

// const getMousePosition = e => {
//     mouseX = e.clientX;
//     mouseY = e.clientY;
// }
// document.addEventListener('mousemove', getMousePosition);

// function onDocumentMouseMove(e) {
//     mouseX = (e.clientX - (window.innerWidth / 2));
//     mouseY = (e.clientY - (window.innerHeight / 2));
// }

// document.addEventListener('mousemove', onDocumentMouseMove);
// const orbit = new THREE.Object3D();
// orbit.rotation.order = 'XYZ';
// orbit.position.set(0, 0, 0);
// scene.add(orbit);

// const handleMouseMove = e => {
//     console.log(e)
//     const scale = -.0001;
//     orbit.rotateX(e.movementY * scale);
//     orbit.rotateY(e.movementX * scale);
//     orbit.rotation.z = 0;
// }

// document.addEventListener('mousemove', handleMouseMove);

// let previousTouch;
// document.addEventListener('touchmove', e => {
//     const touch = e.touches[0];

//     if (previousTouch) {
//         // be aware that these only store the movement of the first touch in the touches array
//         e.movementX = touch.clientX - previousTouch.clientX;
//         e.movementY = touch.clientY - previousTouch.clientY;

//         handleMouseMove(e)
//     };

//     previousTouch = touch;

//     setTimeout(() => {
//         previousTouch = null;
//     }, 500)
// })

// const cameraDistance = 2;
// camera.position.z = cameraDistance;
// orbit.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.dispose();
controls.update();

controls.autoRotate = true;
controls.enableDamping = true;
controls.dampingFactor = .005;
controls.enableZoom = false;
controls.rotateSpeed = .5;

// controls.listenToKeyEvents(window)
// console.log(window)

function onDocumentMouseMove( event ) {
    // Manually fire the event in OrbitControls
    controls.handleMouseMoveRotate(event);
}

function onDocumentTouchMove( event ) {
    controls.handleTouchMoveRotate(event)
}

document.addEventListener('mousemove', onDocumentMouseMove, false);


// Animate
const clock = new THREE.Clock();

const positions = particles.geometry.attributes.position.array;

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update Objects
    // torus.rotation.y = .5 * elapsedTime;
    // particles.rotation.x = (mouseY * .004);
    // particles.rotation.y = (mouseX * .004) + (elapsedTime * .4);

    // orbit.rotation.y += .001;
    controls.update();

    for (let i = 0; i < particleCount; i++) {
        let z = particles.geometry.attributes.position.getZ(i);
        // let newZ;
        if (z > 16) {
            z = -16
        }
        z = z + .04;
        
        particles.geometry.attributes.position.setZ(i, z);
    }
    particles.geometry.attributes.position.needsUpdate = true;

    
    sphere.visible = false;
    sphereCamera.position.copy( sphere.position );
    sphereCamera.update( renderer, scene );

    controls.update();
    camera.lookAt( scene.position );

    // Render the scene
    sphere.visible = true;

    // Render
    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
}

animate();

// Window Resize
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}, false)

// const folder = gui.addFolder('Camera Rotation');
// folder.add(camera.rotation, 'x', -1.5, 1.5);
// folder.open();

export default THREE;
export { loadingManager };