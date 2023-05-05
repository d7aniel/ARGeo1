import * as THREE from "https://unpkg.com/three@0.122.0/build/three.module.js";
import { texto } from "./texto.js";
import { cargarModelo, setTextura } from "./CargarModelo.js";
console.log("v.3");
let es_iphone = window.DeviceOrientationEvent !== undefined && typeof window.DeviceOrientationEvent.requestPermission === "function";
let d = 60;
let tamPanuelo = 3;
console.log(texto);

const clock = new THREE.Clock();
function isMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // true for mobile device
    return true;
  }
  return false;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas1"),
  preserveDrawingBuffer: true,
});
const geom = new THREE.BoxGeometry(20, 20, 20);
const threex = new THREEx.LocationBased(scene, camera);
// You can change the minimum GPS accuracy needed to register a position - by default 1000m
//const threex = new THREEx.LocationBased(scene, camera. { gpsMinAccuracy: 30 } );
const cam = new THREEx.WebcamRenderer(renderer, "#video1");

iluminarConFoto("./hdr/fondoRedu.png", false);

let orientationControls;
if (!es_iphone) {
  if (isMobile()) {
    orientationControls = new THREEx.DeviceOrientationControls(camera);
  }
  document.getElementById("botonPermisos").style.display = "none";
  // document.getElementById("botones").style.display = "flex";
} else {
  document.getElementById("botPermiso").addEventListener("click", (e) => conectar());

  function conectar() {
    console.log("conectar orientacion");
    if (isMobile()) {
      orientationControls = new THREEx.DeviceOrientationControls(camera);
    }
    document.getElementById("botonPermisos").style.display = "none";
    // document.getElementById("botones").style.display = "flex";
  }
}

const oneDegAsRad = THREE.MathUtils.degToRad(1);
let first = true;

threex.on("gpsupdate", (pos) => {
  console.log("gpsupdate");
  if (first) {
    setupObjects(pos.coords.longitude, pos.coords.latitude);
    first = false;
  }
});

threex.on("gpserror", (code) => {
  alert(`GPS error: code ${code}`);
});

console.log("--iniciamos--");
threex.startGps();
// }

requestAnimationFrame(render);

let mousedown = false,
  lastX = 0;

// Mouse events for testing on desktop machine
if (!isMobile()) {
  window.addEventListener("mousedown", (e) => {
    mousedown = true;
  });

  window.addEventListener("mouseup", (e) => {
    mousedown = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!mousedown) return;
    if (e.clientX < lastX) {
      camera.rotation.y -= oneDegAsRad * 4;
      if (camera.rotation.y < 0) {
        camera.rotation.y += 2 * Math.PI;
      }
    } else if (e.clientX > lastX) {
      camera.rotation.y += oneDegAsRad * 4;
      if (camera.rotation.y > 2 * Math.PI) {
        camera.rotation.y -= 2 * Math.PI;
      }
    }
    lastX = e.clientX;
  });
}

let tamGaleriaAjustado = false;
function render(time) {
  resizeUpdate();
  if (orientationControls) {
    orientationControls.update();
  }
  cam.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function resizeUpdate() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth,
    height = canvas.clientHeight;
  if (width != canvas.width || height != canvas.height) {
    renderer.setSize(width, height, false);
  }
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
}

let getNombre = function () {
  let a = "paisaje";
  let dMin = 99999999;
  const id = Math.random().toString(16).slice(2);
  for (let i = 0; i < modelos.length; i++) {
    if (modelos[i].position.distanceTo(camera.position) < dMin) {
      a = modelos[i].textoDescarga + "_" + modelos[i].textoDescarga_nom + "_" + modelos[i].textoDescarga_a + "_" + id;
      dMin = modelos[i].position.distanceTo(camera.position);
    }
  }
  return a;
};

window.getNombre = getNombre;

let listaDePosiciones = [
  // -57.968722, -34.903066
  { lat: -34.968722, lon: -57.968722, rot: 0 + Math.PI * 0.7, alto: 10 }, //real
];

async function setupObjects(longitude, latitude) {
  if (first) {
    texto.remove();
  }

  let modeloBase = new THREE.Object3D();

  await cargarModelo("modelo/modelo2.glb", modeloBase).then((resultado) => {});

  threex.add(modeloBase, longitude, latitude + 0.001);
}

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
