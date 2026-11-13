"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const MODEL_URL = "/models/magic-cube.glb"

// A quarter turn of one layer: the axis, which layer along it (-1, 0, 1) and the turn direction.
type Turn = { axis: "x" | "y" | "z"; layer: -1 | 0 | 1; dir: 1 | -1 }

// The solve, one turn per step. The cube starts scrambled by undoing these steps in reverse,
// so playing them leaves every layer correct.
const SOLVE: Turn[] = [
  { axis: "y", layer: 1, dir: -1 },
  { axis: "x", layer: 1, dir: 1 },
  { axis: "z", layer: 1, dir: -1 },
  { axis: "x", layer: -1, dir: 1 },
]
// How quickly the shown solve catches up with the scroll (share of the gap closed per 60fps frame), so wheel
// steps turn the layers smoothly instead of jumping.
const FOLLOW = 0.08

// Gentle hover: a slow vertical bob with a slight sway, around a three-quarter view.
const FLOAT_HEIGHT = 0.07
const FLOAT_PERIOD_MS = 5200
const VIEW_TILT = 0.52
const VIEW_TURN = -0.68

const AXES = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) }

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// One mesh of the model (a piece body or a sticker). Its geometry is centred on the cube, so a layer turn is
// only a rotation about the origin; `home` is the mesh's centre in grid units when solved.
type Part = { mesh: THREE.Mesh; home: THREE.Vector3 }

// Grid slot (-1, 0, 1 per axis) a part currently occupies; stickers sit just outside their piece, hence the clamp.
function slotOf(part: Part, axis: Turn["axis"]) {
  const value = part.home.clone().applyQuaternion(part.mesh.quaternion)[axis]
  return Math.max(-1, Math.min(1, Math.round(value)))
}

function turnQuaternion(turn: Turn, progress: number) {
  return new THREE.Quaternion().setFromAxisAngle(AXES[turn.axis], (turn.dir * Math.PI * progress) / 2)
}

// Rotate every part in the turn's layer; returns the parts and their starting rotations for animating.
function turnLayer(parts: Part[], turn: Turn, progress = 1) {
  const moving = parts.filter((part) => slotOf(part, turn.axis) === turn.layer)
  const from = moving.map((part) => part.mesh.quaternion.clone())
  const rotation = turnQuaternion(turn, progress)
  moving.forEach((part, index) => part.mesh.quaternion.copy(from[index]).premultiply(rotation))
  return { moving, from }
}

const invert = (turn: Turn): Turn => ({ ...turn, dir: turn.dir === 1 ? -1 : 1 })

// The puzzle cube, floating and solving itself in four turns as `progress` goes from 0 (scrambled) to 1 (solved),
// so the solve follows the scroll both ways. Rendering runs only while `active`.
export default function MagicCube({ active, progress }: { active: boolean; progress: number }) {
  const container = useRef<HTMLDivElement>(null)
  const controls = useRef<{ setActive: (active: boolean) => void } | null>(null)
  const activeRef = useRef(active)
  const progressRef = useRef(progress)

  useEffect(() => {
    const element = container.current
    if (!element) return
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.NeutralToneMapping
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
    element.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = environment
    scene.environmentIntensity = 0.9
    const key = new THREE.DirectionalLight(0xffffff, 1.6)
    key.position.set(2.5, 4, 3)
    scene.add(key)

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
    camera.position.set(0, 0, 3.7)

    // `hover` floats and sets the viewing angle; `cube` holds the parts, so turns happen in the cube's own axes.
    const hover = new THREE.Group()
    hover.rotation.set(VIEW_TILT, VIEW_TURN, 0)
    const cube = new THREE.Group()
    hover.add(cube)
    scene.add(hover)

    let parts: Part[] = []
    // The solve as currently drawn, in turns (0 to SOLVE.length); -1 until the first pose.
    let shown = -1

    // Lay the parts out `turns` turns into the solve: scrambled, then each whole turn, then part of the next one.
    const pose = (turns: number) => {
      shown = turns
      parts.forEach((part) => part.mesh.quaternion.identity())
      ;[...SOLVE].reverse().forEach((turn) => turnLayer(parts, invert(turn)))
      const done = Math.floor(turns)
      SOLVE.slice(0, done).forEach((turn) => turnLayer(parts, turn))
      if (done < SOLVE.length && turns > done) turnLayer(parts, SOLVE[done], easeInOut(turns - done))
    }

    let last = 0
    const follow = (now: number) => {
      const target = Math.max(0, Math.min(1, progressRef.current)) * SOLVE.length
      const elapsed = last ? Math.min(100, now - last) : 1000
      last = now
      if (shown === target) return
      const gap = target - shown
      const step = reducedMotion || shown < 0 ? gap : gap * (1 - (1 - FOLLOW) ** (elapsed / 16.7))
      pose(Math.abs(gap - step) < 0.001 ? target : shown + step)
    }

    let frame = 0
    const render = (now: number) => {
      if (parts.length > 0) follow(now)
      if (parts.length > 0 && !reducedMotion) {
        const phase = (now / FLOAT_PERIOD_MS) * Math.PI * 2
        hover.position.y = Math.sin(phase) * FLOAT_HEIGHT
        hover.rotation.set(VIEW_TILT + Math.sin(phase + 1) * 0.03, VIEW_TURN + Math.sin(phase * 0.5) * 0.06, 0)
      }
      renderer.render(scene, camera)
    }
    const loop = (now: number) => {
      render(now)
      frame = requestAnimationFrame(loop)
    }
    const setActive = (next: boolean) => {
      cancelAnimationFrame(frame)
      last = 0
      if (next) frame = requestAnimationFrame(loop)
    }
    controls.current = { setActive }

    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      if (width === 0 || height === 0) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      render(performance.now())
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)

    let disposed = false
    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (disposed) return
      gltf.scene.updateMatrixWorld(true)
      const meshes: THREE.Mesh[] = []
      gltf.scene.traverse((node) => {
        if (node instanceof THREE.Mesh) meshes.push(node)
      })
      // Bake each mesh's placement into its geometry, then centre the whole cube on the origin at unit size.
      const bounds = new THREE.Box3()
      meshes.forEach((mesh) => {
        mesh.geometry.applyMatrix4(mesh.matrixWorld)
        mesh.geometry.computeBoundingBox()
        bounds.union(mesh.geometry.boundingBox!)
      })
      const center = bounds.getCenter(new THREE.Vector3())
      const size = bounds.getSize(new THREE.Vector3()).x
      const pitch = size / 3
      parts = meshes.map((mesh) => {
        mesh.geometry.translate(-center.x, -center.y, -center.z)
        mesh.geometry.scale(1 / size, 1 / size, 1 / size)
        mesh.geometry.computeBoundingBox()
        mesh.position.set(0, 0, 0)
        mesh.quaternion.identity()
        mesh.scale.set(1, 1, 1)
        cube.add(mesh)
        const home = mesh.geometry.boundingBox!.getCenter(new THREE.Vector3()).multiplyScalar(size / pitch)
        return { mesh, home }
      })
      render(performance.now())
    })

    setActive(activeRef.current)
    return () => {
      disposed = true
      controls.current = null
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      parts.forEach(({ mesh }) => {
        mesh.geometry.dispose()
        ;(Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((material) => material.dispose())
      })
      environment.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  useEffect(() => {
    activeRef.current = active
    controls.current?.setActive(active)
  }, [active])

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  return <div ref={container} aria-hidden="true" className="size-full" />
}
