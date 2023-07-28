import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class InputController {
  constructor() {
    this.initialize();
  }

  // Declare current input from mouse and keyboard
  initialize() {
    // You can't pull the current state of the mouse and keyboard, so you have to keep track of the previous state
    this.current = {
      leftButton: false,
      rightButton: false,
      mouseX: 0,
      mouseY: 0,
    };
    this.previous = null;
    this.keys = {};
    this.previousKeys = {};

    // Attach to event listner for both mouse and keyboard events, this lets us query for the mouse and keyboard state later
    document.addEventListener(
      "mousedown",
      (event) => this.onMouseDown(event),
      false
    );
    document.addEventListener(
      "mouseup",
      (event) => this.onMouseUp(event),
      false
    );
    document.addEventListener(
      "mousemove",
      (event) => this.onMouseMove(event),
      false
    );
    document.addEventListener(
      "keydown",
      (event) => this.onKeyDown(event),
      false
    );
    document.addEventListener("keyup", (event) => this.onKeyUp(event), false);
  }

  onMouseDown(event) {
    switch (event.button) {
      case 0: {
        this.current.leftButton = true;
        break;
      }
      case 2: {
        this.current.rightButton = true;
        break;
      }
    }
  }

  onMouseUp(event) {
    switch (event.button) {
      case 0: {
        this.current.leftButton = true;
        break;
      }
      case 2: {
        this.current.rightButton = true;
        break;
      }
    }
  }

  onMouseMove(event) {
    this.current.mouseX = event.pageX - window.innerWidth / 2;
    this.current.mouseY = event.pageY - window.innerHeight / 2;

    if (this.previous === null) {
      this.previous = { ...this.current };
    }
  }

  onKeyDown(event) {
    this.keys[event.keyCode] = true;
  }

  onKeyUp(event) {
    this.keys[event.keyCode] = true;
  }
}

// First person camera class
class FirstPersonCamera {
  constructor(camera) {
    this.camera = camera;
  }
}

export default function THREEScene() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    // Create Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 5;
    camera.position.x = 5;
    // camera.rotateX(-0.785398);
    // camera.rotateZ(0.785398);

    // Create renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight); // Set size of renderer to be the size of the window
    renderer.shadowMap.enabled = true; // Set shadowMap to true to allow for shadows
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    sceneRef.current.appendChild(renderer.domElement);

    // Create orbit that allows for user camera movement
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();

    // Create Axes helper to visualize the axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add horizontal grid
    const gridHelper = new THREE.GridHelper(30, 30);
    scene.add(gridHelper);

    // Create plane
    const myPlaneGeometry = new THREE.PlaneGeometry(5, 5);
    const myPlaneMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide, // This is needed to see the plane from both sides
    });
    const myPlaneMesh = new THREE.Mesh(myPlaneGeometry, myPlaneMaterial);
    myPlaneMesh.rotation.x = -0.5 * Math.PI;
    myPlaneMesh.receiveShadow = true; // This is needed to allow the plane to receive shadows
    scene.add(myPlaneMesh);

    // Create Box
    const myBoxGeometry = new THREE.BoxGeometry();
    const myBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x8a2be2 });
    const myBoxMesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
    myBoxMesh.castShadow = true; // This is needed to allow the box to cast shadows
    myBoxMesh.position.y = 1;
    scene.add(myBoxMesh);

    // // Create Lamp Model
    // const gltfLoader = new GLTFLoader();
    // gltfLoader.load("/models/ceiling_chandelier/scene.gltf", (gltfScene) => {

    //   scene.add(gltfScene.scene);
    // });

    // Add Alps Terrain Model
    const gltfModelLoader = new GLTFLoader();
    gltfModelLoader.load(
      // Resource URL
      "/models/austrian_alps_schesaplana/scene.gltf",
      function (gltf) {
        gltf.scene.position.x = 0;
        gltf.scene.position.y = 0;
        gltf.scene.position.z = 0;
        gltf.scene.scale.multiplyScalar(1/10000);
        scene.add(gltf.scene);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log(error);
      }
    );

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-30, 50, 0);
    directionalLight.castShadow = true; // This is needed to allow the directional light to cast shadows
    scene.add(directionalLight);

    // Directional Light helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight
    );
    scene.add(directionalLightHelper);

    // Add a bunch of randomly generated stars
    function addStar() {
      const geometry = new THREE.SphereGeometry(0.1, 24, 24);
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(geometry, material);

      // Generate random xyz coordinates in an array
      const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(20));

      star.position.set(x, y, z);
      scene.add(star);
    }

    // Create 2000 stars
    Array(200).fill().forEach(addStar);

    // Create a background
    const backgroundTexture = new THREE.TextureLoader().load(
      "/images/sky-background.jpg"
    );
    scene.background = backgroundTexture;

    // Initialize first person camera
    // this.fpsCamera = new FirstPersonCamera(this.camera);

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

  return <div ref={sceneRef} className="THREEscene" />;
}
