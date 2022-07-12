import * as THREE from 'three';
import * as dat from 'dat.gui';
import starPNG from '../assets/textures/star.png';

// GUI 
const gui = new dat.GUI();

// Canvas Element
const canvas = document.querySelector('canvas#three');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

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

const loader = new THREE.TextureLoader();
const star = loader.load(starPNG);

let pointsMaterial = new THREE.PointsMaterial({
    size: .096,
    transparent: true,
    map: star,
    color: 0xf1f1f1
})


// Mesh
const sphere = new THREE.Mesh(geometry, material);
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
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setClearColor(0x1a1a1a);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Get Mouse Position
let mouseX = 0, mouseY = 0;

const getMousePosition = e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}
document.addEventListener('mousemove', getMousePosition);

// Animate
const clock = new THREE.Clock();

console.log(particles.geometry.attributes.position)

const positions = particles.geometry.attributes.position.array;

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update Objects
    sphere.rotation.y = .5 * elapsedTime;
    particles.rotation.x = (mouseY * .004);
    particles.rotation.y = (mouseX * .004) + (elapsedTime * .4);

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
})