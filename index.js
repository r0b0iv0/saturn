import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./src/getStarfield.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 4;
camera.position.y = 1;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const planetGroup = new THREE.Group();
planetGroup.rotation.z = 23.4 * Math.PI / 180;
scene.add(planetGroup);

new OrbitControls(camera, renderer.domElement);

const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/saturnmap.jpg"),
});

const earthMesh = new THREE.Mesh(geometry, material);
planetGroup.add(earthMesh);

const ringInnerRadius = 1.2;
const ringOuterRadius = 2;
const ringSegments = 64;
const ringGeometry = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, ringSegments);
const ringTexture = new THREE.TextureLoader().load('./textures/transperantRing.png'); // Replace with a transparent ring texture
const ringMaterial = new THREE.MeshStandardMaterial({
    map: ringTexture,
    side: THREE.DoubleSide, 
    transparent: true,     
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);

ring.rotation.x = Math.PI / 2; 
ring.position.set(0, 0, 0);    
planetGroup.add(ring);


const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 3.0);
sunLight.position.set(-2, 1.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  ring.rotation.z -= 0.002;
  stars.rotation.y -= 0.0002;
  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);