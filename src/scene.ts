import * as THREE from 'three';

export interface SceneContext {
  mesh: THREE.Mesh;
  animate: () => void;
}

export function createScene(canvas: HTMLCanvasElement): SceneContext {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(3, 4, 5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x30cac0, 1, 20);
  pointLight.position.set(-2, 2, 3);
  scene.add(pointLight);

  const geometry = new THREE.IcosahedronGeometry(0.8, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x30cac0,
    roughness: 0.3,
    metalness: 0.6,
    wireframe: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate(): void {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  return { mesh, animate };
}
