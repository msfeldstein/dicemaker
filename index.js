const { scene, camera, renderer, THREE } = require('./setup')
const ControlKit = require('controlkit');
const Polyhedra = require('polyhedra')

const container = new THREE.Object3D()
scene.add(container)

const controls = new ControlKit()
const shapes = Object.keys(Polyhedra.platonic)
const options = {
  availableShapes: shapes,
  shape: shapes[0]
}
function regenerate() {
  container.children = []

  const shape = Polyhedra.platonic[options.shape]
  const geometry = new THREE.BufferGeometry()
  console.log(shape)
  const vertices = shape.vertex.flat()
  // convert quads to tris
  const indices = shape.face.map(f => {
    const tris = []
    for (var i = 0; i < f.length - 2; i++) {
      tris.push(f[0], f[i + 1], f[i + 2])
    }
    return tris
  }).flat()
  geometry.setIndex(indices)
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.computeFaceNormals()
  geometry.computeVertexNormals()
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial()
  )
  container.add(mesh)
}

controls.addPanel()
  .addSelect(options, 'availableShapes', {
    target: 'shape',
    onChange: regenerate
  })

function render() {
  requestAnimationFrame(render)
  container.rotation.y += 0.01
  renderer.render(scene, camera)
}
render()
regenerate()


