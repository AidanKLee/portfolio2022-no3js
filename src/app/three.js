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
    color: 0xffffff, envMap: cubeRenderTarget.texture
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
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

controls.autoRotate = true;
controls.enableDamping = true;
controls.dampingFactor = .005;
controls.enableZoom = false;
controls.rotateSpeed = .5;

const onDocumentMouseMove = (e) => {
    controls.handleMouseMoveRotate(e);
}

document.addEventListener('mousemove', onDocumentMouseMove, false);


// Animate
const clock = new THREE.Clock();

const positions = particles.geometry.attributes.position.array;

const animate = () => {
    // const elapsedTime = clock.getElapsedTime();
    controls.update();

    for (let i = 0; i < particleCount; i++) {
        let z = particles.geometry.attributes.position.getZ(i);
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

export default THREE;
export { loadingManager };