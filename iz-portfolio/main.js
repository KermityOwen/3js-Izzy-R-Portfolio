import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Construct scene and margins
const scene = new THREE.Scene()
const offsetMarginTop = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-top'))*2
const offsetMarginSide = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'))*2

// Raycaster
const raycaster = new THREE.Raycaster()

// Loader
const loader = new GLTFLoader()

// Perspective Camera Args: FOV, Aspect Ratio, Close Clipping Plane, Far Clipping Plane
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1 ,1000)  

// Essentially a HTML canvas element that runs WebGL
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth-offsetMarginSide, innerHeight-offsetMarginTop)
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(0x2AAAAA, 1);

// Inserts the renderer's DOM into body as a an HTML canvas
document.body.appendChild(renderer.domElement)

// let controls = new OrbitControls(camera, renderer.domElement)


//------------------------------//
// ****** RENDER OBJECTS ****** //
//------------------------------//

// Box is the geometry, Material is the material, BoxMesh is the mesh that combines both
const box = new THREE.BoxGeometry(1.5, 1.5, 1.5)
const phongMaterial = new THREE.MeshPhongMaterial({
  shininess: 80
})
phongMaterial.color.set( 0xFF0000 )
const boxMesh = new THREE.Mesh(box, phongMaterial)

// Plane object
const plane = new THREE.PlaneGeometry(30, 20, 60, 40)
const planeMaterial = new THREE.MeshPhongMaterial({
  shininess: 10,
  color: 0x99bbff,
  side: THREE.BackSide,
  flatShading: true,
  alphaTest: 0.1,
})
const planeMesh = new THREE.Mesh(plane, planeMaterial)
planeMesh.rotation.x = 1.75
planeMesh.position.y = -2

// Add jaggedness to plane
const {array} = planeMesh.geometry.attributes.position
for (let i = 0; i < array.length; i+=3){
  let z_seg = array[i+2]
  array[i+2] = z_seg + Math.random()/2
}

let mikuModel = new THREE.Mesh(box, phongMaterial)
// MIKU-MONGUS????
loader.load( 'assets/miku_amongus/scene.gltf', function (gltf) {
  gltf.scene.scale.set(1, 1, 1)
  gltf.scene.position.x = 0
  gltf.scene.position.y = -1.5
  gltf.scene.position.z = 0
  mikuModel = gltf.scene
	scene.add(mikuModel)
}, undefined, (error) => {
	console.error(error);
} );



// Light Args: Color, Intensity
const light = new THREE.DirectionalLight(0xFFFFFF, 0.75)
light.position.set(0, 2, 2)

const light2 = new THREE.DirectionalLight(0xFFFFFF, 0.5)
light2.position.set(0, -2, 0)

// Adding stuff to the scene
// scene.add(boxMesh)
scene.add(planeMesh)
scene.add(light)
scene.add(light2)

// Push camera back so we can see the cube
camera.position.z = 5


//-------------------------------//
// ****** EVENT LISTENERS ****** //
//-------------------------------//

// Make renderer sizable
window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth-offsetMarginSide, innerHeight-offsetMarginTop);
}

// Set mouse dictionary to have normalized coord of mouse
let mouse = {
  down: false,
  x: 0,
  y: 0,
}
// window.addEventListener("mousemove", (event) => {
//   mouse.x = (event.clientX / innerWidth) * 2 - 1
//   mouse.y = -(event.clientY / innerHeight) * 2 + 1
// })

function dragAction(deltaX, deltaY, object) {
  object.rotation.y += deltaX / 100;
  object.rotation.x += deltaY / 1000;
}

window.addEventListener('mousemove', (event) => {
  if (!mouse.down) {
    return
  }
  event.preventDefault()
  var deltaX = event.clientX - mouse.x
  var deltaY = event.clientY - mouse.y
  mouse.x = event.clientX
  mouse.y = event.clientY
  dragAction(deltaX, deltaY, mikuModel)
}, false)

window.addEventListener('mousedown', (event) => {
event.preventDefault()
mouse.down = true
mouse.x = event.clientX
mouse.y = event.clientY
}, false)

window.addEventListener('mouseup', (event) => {
event.preventDefault()
mouse.down = false
}, false)

//------------------------------//
// ******** ANIMATIONS ******** //
//------------------------------//

// Define animation function for the box, runs recursively
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  // boxMesh.rotation.x += 0.01
  // boxMesh.rotation.y += 0.01
  mikuModel.rotation.y += 0.01

  raycaster.setFromCamera(mouse, camera)
  let intersections = raycaster.intersectObjects(mouse)

}
// Calling animation functions
animate()

// Console logs
console.log(scene)
console.log(camera)
console.log(renderer)
console.log(box)