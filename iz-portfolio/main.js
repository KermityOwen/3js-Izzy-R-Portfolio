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
const loadingManager = new THREE.LoadingManager()
const loader = new GLTFLoader(loadingManager)

// Perspective Camera Args: FOV, Aspect Ratio, Close Clipping Plane, Far Clipping Plane
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1 ,1000)  

// Essentially a HTML canvas element that runs WebGL
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth-offsetMarginSide, innerHeight-offsetMarginTop)
renderer.setPixelRatio(devicePixelRatio)
// renderer.setClearColor(0x2AAAAA, 1);
renderer.setClearColor(0x224030, 1);
// renderer.setClearColor(0x000000, 1);

// Inserts the renderer's DOM into body as a an HTML canvas
document.body.appendChild(renderer.domElement)

const textureLoader = new THREE.TextureLoader()
textureLoader.load('assets/camobg.png', function(texture){
  scene.background = texture
})

// let controls = new OrbitControls(camera, renderer.domElement)


//------------------------------//
// ****** RENDER OBJECTS ****** //
//------------------------------//

// Loading manager stuff
const loadBar = document.getElementById("progress-bar")
loadingManager.onProgress = function(url, loaded, total){
  loadBar.value = (loaded/total) * 100
}

const loadScreen = document.querySelector(".loading-screen")
const mainScreen = document.querySelector(".main")
loadingManager.onLoad = function(){
  mainScreen.style.display = "inline"
  loadScreen.style.display = "none"

}


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
  color: 0x88BB66,
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

let bugModel = new THREE.Mesh(hbox, phongMaterial) // Better than intializing as undefined
// loader.load( 'assets/miku_amongus/scene.gltf', function (gltf) { // MIKU-MONGUS????
loader.load( 'assets/Bug_Lowpoly.gltf', function (gltf) { 
  var scaleValue = Math.log(innerWidth)/12
  gltf.scene.scale.set(scaleValue, scaleValue, scaleValue)
  gltf.scene.position.x = 0
  gltf.scene.position.y = -0.5
  gltf.scene.position.z = 0
  bugModel = gltf.scene
	scene.add(bugModel)
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
var HBScale = innerWidth*0.001+1
hboxMesh1.position.set(HBScale,0,HBScale)
hboxMesh2.position.set(-HBScale,0,HBScale)
hboxMesh3.position.set(HBScale,0,-HBScale)
hboxMesh4.position.set(-HBScale,0,-HBScale)
hboxMesh1.name = "hb1"
hboxMesh2.name = "hb2"
hboxMesh3.name = "hb3"
hboxMesh4.name = "hb4"

var orbit = new THREE.Group()
orbit.add(hboxMesh1)
orbit.add(hboxMesh2)
orbit.add(hboxMesh3)
orbit.add(hboxMesh4)
orbit.rotation.x += 0.3
orbit.position.y -= 0.5

scene.add(orbit)
scene.add(light)
scene.add(light2)
// Push camera back so we can see the cube
camera.position.z = 7
camera.position.y = -0.3

// orbit.position.y -= 1


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
  var HBScale = innerWidth*0.001+1
  hboxMesh1.position.set(HBScale,0,HBScale)
  hboxMesh2.position.set(-HBScale,0,HBScale)
  hboxMesh3.position.set(HBScale,0,-HBScale)
  hboxMesh4.position.set(-HBScale,0,-HBScale)

  var scaleValue = Math.log(innerWidth)/12
  bugModel.scale.set(scaleValue, scaleValue, scaleValue)
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

window.addEventListener('pointermove', (event) => {
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

window.addEventListener('pointerdown', (event) => {
event.preventDefault()
mouse.down = true
mouse.x = event.clientX
mouse.y = event.clientY
if (currentHover){
  switch (prevHB.name){
    case("hb1"):
      console.log("hitbox1")
      break
    case("hb2"):
      console.log("hitbox2")
      break
    case("hb3"):
      console.log("hitbox3")
      break
    case("hb4"):
      console.log("hitbox4")
      break
  }
  // console.log(prevHB)
  // window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
}
}, false)

window.addEventListener('pointerup', (event) => {
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

  bugModel.rotation.y += 0.008
  orbit.rotation.y += 0.0025
  
  // Can let client decide if they want this feature
  hboxMesh1.lookAt(camera.position)
  hboxMesh2.lookAt(camera.position)
  hboxMesh3.lookAt(camera.position)
  hboxMesh4.lookAt(camera.position)

  raycaster.setFromCamera(pointer, camera)
  // const intersects = raycaster.intersectObjects(scene.children)
  const hitboxes = [hboxMesh1, hboxMesh2, hboxMesh3, hboxMesh4]
  const intersect = raycaster.intersectObjects(hitboxes)

  if (intersect.length != 0){
    // console.log(intersect[0].object)
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

    // references to getElementById doesnt change the html itself so it has to be called on case
    switch (obj.name){
      case("hb1"):
        document.getElementById("logo").style.display = "none"
        document.getElementById("prompt").innerHTML = "About Me"
        document.getElementById("subtext").innerHTML = `&#128516 - Learn more about me - &#128516`
        break
      case("hb2"):
        document.getElementById("logo").style.display = "none"
        document.getElementById("prompt").innerHTML = "My Works"
        document.getElementById("subtext").innerHTML = "&#128396 - Look at my work - &#128396"
        break
      case("hb3"):
        document.getElementById("logo").style.display = "none"
        document.getElementById("prompt").innerHTML = "Contact Me"
        document.getElementById("subtext").innerHTML = "&#128231; - Here's how to contact me - &#128231;"
        break
      case("hb4"):
        document.getElementById("logo").style.display = "none"
        document.getElementById("prompt").innerHTML = "Credits"
        document.getElementById("subtext").innerHTML = "For the assets used in this website"
        break
    }
    
  }
  else {
    document.getElementById("logo").style.display = "inline"
    document.getElementById("prompt").innerHTML = "Izzy Reghenzani"
    document.getElementById("subtext").innerHTML = "3D Creature Artist - Texturing - Look Dev"
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
