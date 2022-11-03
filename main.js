import './style.css'

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas1 = document.querySelector('#bg');
const scene = new THREE.Scene();

let faceScan = null;
const loader = new GLTFLoader();
loader.load('ogTurntableMesh.gltf', function(gltf){
  console.log(gltf);
  faceScan = gltf.scene;
  //faceScan.scale.set(0.1, 0.1, 0.1)
  scene.add(faceScan);
}, function(xhr){
  console.log((xhr.loaded/xhr.total * 100) + "% loaded");
}, function(error){
  console.log(error);
}
);

let cameraLoc = {
  x: 0,
  y: 30,
  z: 20
}
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(2, 2, 4);
scene.add(light);

const light1 = new THREE.AmbientLight(0xffffff, 1);
scene.add(light)

 let sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

let camera = new THREE.PerspectiveCamera(55, sizes.width/sizes.height, 0.1, 1000);
camera.position.set(cameraLoc.x, cameraLoc.y, cameraLoc.z);
scene.add(camera);

const renderer = new THREE.WebGL1Renderer({
  canvas: canvas1
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25/1.5, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(300).fill().forEach(addStar); //adds 200 stars 

//add space background img
//const background = new THREE.TextureLoader().load("/assets/space.jpg"); 
//scene.background = background;

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;

  // jeff.rotation.y += 0.01;
  // jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();




//called every second to draw img
function animate(){
  requestAnimationFrame(animate)
  //faceScan.rotation.y+=0.05
  renderer.render(scene, camera)
}

animate();

window.addEventListener('resize', function(event){
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    setCanvasDimensions(renderer.domElement, width, height);
}, true);

function setCanvasDimensions(
  canvas,
  width,
  height,
  set2dTransform = false
) {
  const ratio = window.devicePixelRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  if (set2dTransform) {
    canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
  }
}
