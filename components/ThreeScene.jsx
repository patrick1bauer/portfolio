import React, { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function ThreeScene() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Create renderer
    const renderer = new Three.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); // Set size of renderer to be the size of the window
    renderer.shadowMap.enabled = true; // Set shadowMap to true to allow for shadows
    sceneRef.current.appendChild(renderer.domElement);

    // Create orbit that allows for user camera movement
    const orbit = new OrbitControls(camera, renderer.domElement);

    // Create Axes helper to visualize the axes
    const axesHelper = new Three.AxesHelper(5);
    scene.add(axesHelper);

    // Add horizontal grid
    const gridHelper = new Three.GridHelper(30, 30);
    scene.add(gridHelper);

    // Create Box
    const myBoxGeometry = new Three.BoxGeometry();
    const myBoxMaterial = new Three.MeshStandardMaterial({ color: 0x8a2be2 });
    const myBoxMesh = new Three.Mesh(myBoxGeometry, myBoxMaterial);
    myBoxMesh.castShadow = true; // This is needed to allow the box to cast shadows
    myBoxMesh.position.y = 1;
    scene.add(myBoxMesh);

    // Create plane
    const myPlaneGeometry = new Three.PlaneGeometry(5, 5);
    const myPlaneMaterial = new Three.MeshStandardMaterial({
      color: 0xffffff,
      side: Three.DoubleSide, // This is needed to see the plane from both sides
    });
    const myPlaneMesh = new Three.Mesh(myPlaneGeometry, myPlaneMaterial);
    myPlaneMesh.rotation.x = -0.5 * Math.PI;
    myPlaneMesh.receiveShadow = true; // This is needed to allow the plane to receive shadows
    scene.add(myPlaneMesh);

    // Add ambient light
    const ambientLight = new Three.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new Three.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-30, 50, 0);
    directionalLight.castShadow = true; // This is needed to allow the directional light to cast shadows
    scene.add(directionalLight);

    // Directional Light helper
    const directionalLightHelper = new Three.DirectionalLightHelper(directionalLight);
    scene.add(directionalLightHelper);

    // Create Camera
    camera.position.z = 5;
    camera.position.y = 5;
    camera.position.x = 5;
    orbit.update();
    // camera.rotateX(-0.785398);
    // camera.rotateZ(0.785398);

    // Create animation of rotating box
    function animate() {
      requestAnimationFrame(animate);

      myBoxMesh.rotation.x += 0.01;
      myBoxMesh.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  }, []);

  return <div ref={sceneRef} className="Threescene" />;
}
