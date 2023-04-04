import * as THREE from "three"

// Construct scene and margins
const scene = new THREE.Scene()
const offsetMarginTop = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-top'))*2
const offsetMarginSide = parseInt(window.getComputedStyle(document.body).getPropertyValue('margin-left'))*2
console.log(offsetMarginSide)
console.log(offsetMarginTop)

// Perspective Camera Args: FOV, Aspect Ratio, Close Clipping Plane, Far Clipping Plane
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1 ,1000)  

// Essentially a HTML canvas element that runs WebGL
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth-offsetMarginSide, innerHeight-offsetMarginTop)
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(0x2AAA8A, 1);

// Inserts the renderer's DOM into body as a an HTML canvas
document.body.appendChild(renderer.domElement)

// Box is the geometry, Material is the material, BoxMesh is the mesh that combines both
const box = new THREE.BoxGeometry(1.5, 1.5, 1.5)
const phongMaterial = new THREE.MeshPhongMaterial({
  shininess: 100
})
phongMaterial.color.set( 0xFF0000 )
const boxMesh = new THREE.Mesh(box, phongMaterial)

// Plane object
const plane = new THREE.PlaneGeometry(30, 20, 60, 40)
const planeMaterial = new THREE.MeshPhongMaterial({
  shininess: 0,
  color: 0x99bbff,
  side: THREE.DoubleSide,
  flatShading: true
})
const planeMesh = new THREE.Mesh(plane, planeMaterial)
planeMesh.rotation.x = 90
planeMesh.position.y = -2

// Add jaggedness to plane
const {array} = planeMesh.geometry.attributes.position
for (let i = 0; i < array.length; i+=3){
  let z_seg = array[i+2]
  array[i+2] = z_seg + Math.random()/2
}

// Light Args: Color, Intensity
const light = new THREE.DirectionalLight(0xFFFFFF, 0.75)
light.position.set(0, 2, 2)

const light2 = new THREE.DirectionalLight(0xFFFFFF, 0.5)
light2.position.set(0, -2, 0)

// Adding stuff to the scene
scene.add(boxMesh)
scene.add(planeMesh)
scene.add(light)
scene.add(light2)

// Push camera back so we can see the cube
camera.position.z = 5

// Define animation function for the box, runs recursively
function boxAnimate(){
  requestAnimationFrame(boxAnimate)
  renderer.render(scene, camera)
  boxMesh.rotation.x += 0.01
  boxMesh.rotation.y += 0.01
}

// Calling animation functions
boxAnimate()

// Make renderer sizable
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth-offsetMarginSide, innerHeight-offsetMarginTop);
}


// Console logs
console.log(scene)
console.log(camera)
console.log(renderer)
console.log(box)