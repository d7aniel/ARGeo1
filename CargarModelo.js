import { GLTFLoader } from "./three/GLTFLoader.js";
export async function cargarModelo(archivo, objetoVacio) {
  var loader = new GLTFLoader();
  loader.load(archivo, function (gltf) {
    gltf.scene.scale.set(20, 20, 20);
    objetoVacio.add(gltf.scene);
    console.log("cargado");
  });
}

export function setTextura(texturaArchivo, objeto, rotX, rotY, rotZ, randmSize = 0) {
  const loader = new THREE.TextureLoader();
  // `./imagenes/cuadros/${texturaArchivo.archivo}`;
  loader.load(
    `./imagenes/cuadros/${texturaArchivo.archivo}`,
    (texture) => {
      let modificacionRandom = 1.0;
      let textoDimension = texturaArchivo.tam.split("x");
      let tx = parseInt(textoDimension[0]);
      let ty = parseInt(textoDimension[1]);
      const proporcion = (texture.image.naturalWidth * tx) / (texture.image.naturalHeight * ty);
      objeto.children[0].scale.set(proporcion * modificacionRandom, 1 * modificacionRandom, 1 * modificacionRandom);
      objeto.children[0].rotation.set(rotX, rotY, rotZ);
      let capa1 = new THREE.MeshBasicMaterial({
        map: texture,
      });
      for (let obj of objeto.children[0].children) {
        let nombre = obj.name.split("_")[0];
        let esFrente = obj.name.split("_")[1] == 1;
        // console.log(nombre);
        if (nombre === "capa1" && !esFrente) {
          obj.material = capa1;
        }
      }
    },
    undefined,
    function (err) {
      console.error("An error happened.");
    }
  );

  loader.load(
    `./imagenes/cuadros/${texturaArchivo.archivo.split(".")[0]}_c.png`,
    (texture) => {
      let modificacionRandom = 1.0 + Math.random(randmSize);
      let textoDimension = texturaArchivo.tam.split("x");
      let tx = parseInt(textoDimension[0]);
      let ty = parseInt(textoDimension[1]);
      const proporcion = (texture.image.naturalWidth * tx) / (texture.image.naturalHeight * ty);
      objeto.children[0].scale.set(proporcion * modificacionRandom, 1 * modificacionRandom, 1 * modificacionRandom);
      objeto.children[0].rotation.set(rotX, rotY, rotZ);
      let capa1 = new THREE.MeshBasicMaterial({
        map: texture,
      });
      for (let obj of objeto.children[0].children) {
        let nombre = obj.name.split("_")[0];
        let esFrente = obj.name.split("_")[1] == 1;
        // console.log(nombre);
        if (nombre === "capa1" && esFrente) {
          obj.material = capa1;
        }
      }
    },
    undefined,
    function (err) {
      console.error("An error happened.");
    }
  );
}
