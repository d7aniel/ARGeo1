import * as THREE from "three";
import { GLTFLoader } from "./threeLibs/GLTFLoader.js";
import * as THREEx from "./node_modules/@ar-js-org/ar.js/three.js/build/ar-threex-location-only.js";

function cargarModelo(archivo, objetoVacio) {
  var loader = new GLTFLoader();
  loader.load(archivo, function (gltf) {
    gltf.scene.scale.set(20, 20, 20);
    objetoVacio.add(gltf.scene);
    console.log("cargado");
  });
}

function main() {
  const canvas = document.getElementById("canvas1");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1.33, 0.1, 10000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });

  const arjs = new THREEx.LocationBased(scene, camera);
  const cam = new THREEx.WebcamRenderer(renderer);

  const geom = new THREE.BoxGeometry(20, 50, 20);
  const mtl = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  const box = new THREE.Mesh(geom, mtl);

  function iluminarConFoto(archivo) {
    let iluminador = new THREE.PMREMGenerator(renderer);
    iluminador.compileEquirectangularShader();
    let escena = scene;
    new THREE.TextureLoader().load(archivo, function (texture) {
      var texturaCielo = iluminador.fromEquirectangular(texture);
      //escena.background = texturaCielo.texture;
      escena.environment = texturaCielo.texture;
      texture.dispose();
      iluminador.dispose();
    });

    let ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
  }

  iluminarConFoto("luz.png");

  box.position.set(0, 30, 0);

  let pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(20, 40, 0);

  const objetoCompuesto = new THREE.Object3D();

  cargarModelo("modelo2.glb", objetoCompuesto);

  let ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  arjs.add(objetoCompuesto, -0.72, 51.051);

  arjs.fakeGps(-0.72, 51.05);

  requestAnimationFrame(render);

  function render() {
    if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      const aspect = canvas.clientWidth / canvas.clientHeight;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }

    cam.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
}

main();
