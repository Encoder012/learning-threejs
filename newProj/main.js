import * as THREE from 'three'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
import gsap from 'gsap'
import { Float32BufferAttribute } from 'three'
console.log(vertexShader)
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer(
  {
    antialias: true,
    canvas: document.querySelector('canvas')
  } 
)

const canvasConainter = document.querySelector('#canvasContainer')
renderer.setSize(canvasConainter.offsetWidth, canvasConainter.offsetHeight)
renderer.setPixelRatio(devicePixelRatio)

const camera = new THREE.PerspectiveCamera(
  75,
  canvasConainter.offsetWidth/canvasConainter.offsetHeight,
  0.1,
  1000
)




// Sphere

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50), 
  new THREE.ShaderMaterial(
    {
      vertexShader,
      fragmentShader,
      uniforms: {
        globeTexture: {
          value: new THREE.TextureLoader().load('./images/earthTextureMap.jpg')
        }
      }
    }
    // {color: 0xff0000}
    )
  )


// atmosphere

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50), 
  new THREE.ShaderMaterial(
    {
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
  )

atmosphere.scale.set(1.1, 1.1, 1.1)

console.log(sphere)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({color: 0xffffff})
const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

const starVertices = []
for (let i = 0; i< 1000; i++){
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -Math.random() * 1000
  starVertices.push(x,y,z)
}

starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3))

camera.position.z = 15

const mouse = {
  x: undefined,
  y: undefined
}

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  sphere.rotation.y += 0.003
  gsap.to(group.rotation, {
    x: -mouse.y * 0.5,
    y: mouse.x * 0.5,
    duration: 2
  })
}

animate()



addEventListener('mousemove',(event)=>{
  mouse.x = (event.clientX / innerWidth) * 2 - 1 
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})
