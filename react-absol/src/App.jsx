import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import myModel from "./models/Cdj2000NXS/2cdjs.obj";

export default function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    mount.appendChild(renderer.domElement);

    const loader = new OBJLoader();
    let model = null;
    loader.load(
      myModel,
      (obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
              color:0xffffff,
              wireframe: true
            });
          }
        });

        const deg = (d) => (d * Math.PI) / 180;
        obj.rotation.x = deg(90);
        obj.rotation.y = deg(80);
        obj.rotation.z = deg(0);

        obj.position.x = 2;
        
        obj.scale.setScalar(0.8);
        model = obj;
        scene.add(model);
      },
      undefined,
      (err) => console.error("OBJ load error:", err)
    );

    const resizeObserver = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      const aspect = width / height;
      const viewSize = 2;

      camera.left = -viewSize * aspect;
      camera.right = viewSize * aspect;
      camera.top = viewSize;
      camera.bottom = -viewSize;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(mount);

    const animate = () => {
      if (model) {
        model.rotation.y += 0.001; 
        model.rotation.x += 0.001;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        overflow: "hidden",
      }}
    />
  );
}