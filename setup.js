const THREE = require('three')

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10)
camera.position.z = 5
camera.lookAt(new THREE.Vector3())

scene.add(new THREE.AmbientLight( 0x404040 ))
const light = new THREE.PointLight({color: 0xff0000})
light.position.set(5, 5, 5)
scene.add(light)

module.exports = {
  scene,
  renderer,
  camera,
  THREE
}