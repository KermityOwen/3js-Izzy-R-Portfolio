import * as THREE from "three"

const scene = new THREE.Scene()

// Perspective Camera Args: FOV, Aspect Ratio, Close Clipping Plane, Far Clipping Plane
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1 ,1000)  

// Essentially a HTML canvas element that runs WebGL
const renderer = new THREE.WebGLRenderer()
renderer.setSize(innerWidth-20, innerHeight-20)
renderer.setPixelRatio(devicePixelRatio)
renderer.setClearColor(0x2AAA8A, 1);

// Inserts the renderer's DOM into body as a an HTML canvas
document.body.appendChild(renderer.domElement)

// Box is the geometry, Material is the material, BoxMesh is the mesh that combines both
const box = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 0xFF0000})
const phongMaterial = new THREE.MeshPhongMaterial({shininess: 100})
phongMaterial.color.set( 0xFF0000 )
const boxMesh = new THREE.Mesh(box, phongMaterial)

// Light Args: Color, Intensity
const light = new THREE.DirectionalLight(0xFFFFFF, 0.75)
light.position.set(0, 0, 5)

// Adding stuff to the scene
scene.add(boxMesh)
scene.add(light)

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


// Console logs
console.log(scene)
console.log(camera)
console.log(renderer)
console.log(box)