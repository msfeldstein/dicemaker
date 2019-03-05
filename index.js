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
  const shapeVerts = shape.vertex.flat()
  // convert quads to tris
  const shapeIdx = shape.face.map(f => {
    const tris = []
    for (var i = 0; i < f.length - 2; i++) {
      tris.push(f[0], f[i + 1], f[i + 2])
    }
    return tris
  }).flat()
  const vertices = []
  const indices = []
  for (var i = 0; i < shapeIdx.length; i++) {
    vertices.push(shape.vertex[shapeIdx[i]])
    indices.push(i)
  }
  const attr = new THREE.Float32BufferAttribute(vertices.flat(), 3)
  geometry.addAttribute('position', attr)
  geometry.computeVertexNormals()
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial()
  )
  container.add(mesh)

  const sphereGeo = new THREE.SphereBufferGeometry(0.1)
  const sphereMat = new THREE.MeshStandardMaterial()

  // Find the center of each face
  shape.face.forEach(faceIndices => {
    const center = [0, 0, 0]
    faceIndices.forEach(i => {
      const p = shape.vertex[i]
      center[0] += p[0]
      center[1] += p[1]
      center[2] += p[2]
    })
    center[0] /= faceIndices.length
    center[1] /= faceIndices.length
    center[2] /= faceIndices.length
    const sphere = new THREE.Mesh(
      sphereGeo, sphereMat
    )
    sphere.position.set(...center)
    container.add(sphere)
  })
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


