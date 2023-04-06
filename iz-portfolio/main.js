import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import gsap from "gsap"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Construct scene and margins
const scene = new THREE.Scene()
const offsetMarginTop = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-top'))*2
const offsetMarginSide = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'))*2

// Raycaster
const raycaster = new THREE.Raycaster()
console.log(raycaster)
// Loader
const loader = new GLTFLoader()

// Perspective Camera Args: FOV, Aspect Ratio, Close Clipping Plane, Far Clipping Plane
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1 ,1000)  

// Essentially a HTML canvas element that runs WebGL
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth-offsetMarginSide, innerHeight-offsetMarginTop)
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(0x2AAAAA, 1);
// renderer.setClearColor(0x000000, 1);

// Inserts the renderer's DOM into body as a an HTML canvas
document.body.appendChild(renderer.domElement)

// let controls = new OrbitControls(camera, renderer.domElement)


//------------------------------//
// ****** RENDER OBJECTS ****** //
//------------------------------//

// Box is the geometry, Material is the material, BoxMesh is the mesh that combines both
const hbox = new THREE.BoxGeometry(1, 1, 1)
const phongMaterial = new THREE.MeshPhongMaterial({
  shininess: 80
})
phongMaterial.color.set( 0xFF0000 )
const hboxMesh1 = new THREE.Mesh(hbox, phongMaterial)
const hboxMesh2 = new THREE.Mesh(hbox, phongMaterial)
const hboxMesh3 = new THREE.Mesh(hbox, phongMaterial)
const hboxMesh4 = new THREE.Mesh(hbox, phongMaterial)

// Plane object
const wideness = innerWidth/300
const plane = new THREE.PlaneGeometry(60, 20, 120, 40)
// const plane = new THREE.PlaneGeometry(100, 100, 1000, 1000)
const planeMaterial = new THREE.MeshPhongMaterial({
  shininess: 10,
  // color: 0x99bbff,
  color: 0x66BB66,
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

let mikuModel = new THREE.Mesh(hbox, phongMaterial) // Better than intializing as undefined
loader.load( 'assets/miku_amongus/scene.gltf', function (gltf) { // MIKU-MONGUS????
  var scaleValue = Math.log(innerWidth)/8
  gltf.scene.scale.set(scaleValue, scaleValue, scaleValue)
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
scene.add(planeMesh)

// Relative positioning bish hehheheh
// hboxMesh1.position.set(innerWidth*0.002,-2,1)
// hboxMesh2.position.set(-innerWidth*0.002,-2,1)
// hboxMesh3.position.set(innerWidth*0.0045,-2,-2)
// hboxMesh4.position.set(-innerWidth*0.0045,-2,-2)
hboxMesh1.position.set(innerWidth*0.002,0,innerWidth*0.002)
hboxMesh2.position.set(-innerWidth*0.002,0,innerWidth*0.002)
hboxMesh3.position.set(innerWidth*0.002,0,-innerWidth*0.002)
hboxMesh4.position.set(-innerWidth*0.002,0,-innerWidth*0.002)
var orbit = new THREE.Group()
orbit.add(hboxMesh1)
orbit.add(hboxMesh2)
orbit.add(hboxMesh3)
orbit.add(hboxMesh4)

scene.add(orbit)
scene.add(light)
scene.add(light2)
// Push camera back so we can see the cube
camera.position.z = 7

// planeMesh.updateMatrixWorld()

//-------------------------------//
// ****** EVENT LISTENERS ****** //
//-------------------------------//

// Make renderer sizable
window.addEventListener('resize', onWindowResize, false);
function onWindowResize(){
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth-offsetMarginSide, innerHeight-offsetMarginTop);
  var HBLogScale = Math.log(innerWidth)/3
  hboxMesh1.position.set(HBLogScale,0,HBLogScale)
  hboxMesh2.position.set(-HBLogScale,0,HBLogScale)
  hboxMesh3.position.set(HBLogScale,0,-HBLogScale)
  hboxMesh4.position.set(-HBLogScale,0,-HBLogScale)

  var scaleValue = Math.log(innerWidth)/8
  mikuModel.scale.set(scaleValue, scaleValue, scaleValue)
}

// Set mouse dictionary to have normalized coord of mouse
let mouse = {
  down: false,
  x: 0,
  y: 0,
}

const pointer = new THREE.Vector2()

function dragAction(deltaX, deltaY, object) {
  object.rotation.y += deltaX / 100; // Larger the divided number is the slower the movement
  object.rotation.x += deltaY / 1000;
}

window.addEventListener('mousemove', (event) => {
  pointer.x = (event.clientX/innerWidth) * 2 - 1
  pointer.y = -(event.clientY/innerHeight) * 2 + 1
  // console.log(pointer)
  if (!mouse.down) {
    return
  }
  event.preventDefault()
  var deltaX = event.clientX - mouse.x
  var deltaY = event.clientY - mouse.y
  mouse.x = event.clientX
  mouse.y = event.clientY
  dragAction(deltaX, 0, orbit)
}, false)

window.addEventListener('mousedown', (event) => {
event.preventDefault()
mouse.down = true
mouse.x = event.clientX
mouse.y = event.clientY
if (currentHover){
  console.log(prevHB)
}
}, false)

window.addEventListener('mouseup', (event) => {
event.preventDefault()
mouse.down = false
}, false)

//------------------------------//
// ******** ANIMATIONS ******** //
//------------------------------//

var prevHB = hboxMesh1
var currentHover = false
// Define animation function for the box, runs recursively
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  // boxMesh.rotation.x += 0.01
  // boxMesh.rotation.y += 0.01

  mikuModel.rotation.y += 0.008
  orbit.rotation.y += 0.0025

  raycaster.setFromCamera(pointer, camera)
  // const intersects = raycaster.intersectObjects(scene.children)
  const hitboxes = [hboxMesh1, hboxMesh2, hboxMesh3, hboxMesh4]
  const intersect = raycaster.intersectObjects(hitboxes)

  if (intersect.length != 0){
    currentHover = true
    var obj = intersect[0].object
    obj.material = new THREE.MeshPhongMaterial({
      shininess: 80,
      color: 0x00FF00,
    })
    if(prevHB != obj){
      prevHB.material = phongMaterial
    }
    prevHB = obj
  }
  else {
    currentHover=false
    prevHB.material = phongMaterial
  }  

  // console.log(currentHover)
}

// Calling animation functions
animate()

// Console logs
console.log(scene)
console.log(camera)
console.log(renderer)
