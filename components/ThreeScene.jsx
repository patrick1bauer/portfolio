import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

let sceneRef;
let camera, scene, renderer, controls;

const objects = [];

let myBoxMesh;

let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

function init() {
  // Create the scene
  scene = new THREE.Scene();

  // Create Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    11000
  );
  camera.position.z = 10;
  camera.position.y = 10;
  camera.position.x = 10;
  // camera.rotateX(-0.785398);
  // camera.rotateZ(0.785398);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight); // Set size of renderer to be the size of the window
  renderer.shadowMap.enabled = true; // Set shadowMap to true to allow for shadows
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  sceneRef.current.appendChild(renderer.domElement);

  // // Create orbit that allows for user camera movement
  // const orbit = new OrbitControls(camera, renderer.domElement);
  // orbit.update();

  // // Create Axes helper to visualize the axes
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  // // Add horizontal grid
  // const gridHelper = new THREE.GridHelper(30, 30);
  // scene.add(gridHelper);

  // Create plane
  const planeGeometry = new THREE.PlaneGeometry(250, 250);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x9cd190,
    side: THREE.DoubleSide, // This is needed to see the plane from both sides
  });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.rotation.x = -0.5 * Math.PI; // This is needed to rotate the plane 90 degrees so it is horizontal
  planeMesh.receiveShadow = true; // This is needed to allow the plane to receive shadows
  scene.add(planeMesh);

  // Create Sky Dome
    const skyDomeGeometry = new THREE.SphereGeometry(10000, 32, 32);
    const skyDomeMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("/skyBoxes/cloudySky.webp"),
        side: THREE.BackSide,
    });
    const skyDomeMesh = new THREE.Mesh(skyDomeGeometry, skyDomeMaterial);
    scene.add(skyDomeMesh);

  // Create fog
  // scene.fog = new THREE.Fog(0xffffff, 0, 750);

  // Create Box
  const myBoxGeometry = new THREE.BoxGeometry();
  const myBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x8a2be2 });
  myBoxMesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
  myBoxMesh.castShadow = true;
  myBoxMesh.position.y = 10;
  myBoxMesh.scale.set(5, 5, 5);
  scene.add(myBoxMesh);

  // Create Lamp Model
  const gltfModelLoader = new GLTFLoader();
  gltfModelLoader.load(
    "/models/ceilingChandelier/scene.gltf",
    (ceilingChandelierModel) => {
      ceilingChandelierModel.scene.position.y = 30;
      ceilingChandelierModel.scene.scale.set(30, 30, 30);
      ceilingChandelierModel.castShadow = true;
      scene.add(ceilingChandelierModel.scene);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); // This is a callback function that runs when the model is loading
    },
    function (error) {
      console.log(error); // This is a callback function that runs if there is an error
    }
  );

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add point light
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(-30, 50, 0);
  pointLight.castShadow = true; // This is needed to allow the directional light to cast shadows
  scene.add(pointLight);

  // Directional Light helper
  const pointLightHelper = new THREE.PointLightHelper(
    pointLight
  );
  scene.add(pointLightHelper);

  // Function to create a randomly generated star
  function addStar() {
    const geometry = new THREE.SphereGeometry(1, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    // Generate random xyz coordinates in an array
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(200));

    star.position.set(x, y, z);
    star.castShadow = true;
    scene.add(star);
  }

  // Create stars
  Array(2000).fill().forEach(addStar);

  // Create a background
  scene.background = new THREE.TextureLoader().load(
    "/images/sky-background.jpg"
  );

  // Create the controls for the user
  controls = new PointerLockControls(camera, renderer.domElement);

  // Get the div elements of the instructions and blocker
  const instructions = document.getElementById("instructions");
  const blocker = document.getElementById("blocker");

  // Add event listeners to lock the pointer when the user clicks on the scene
  instructions.addEventListener("click", () => {
    controls.lock();
  });
  controls.addEventListener("lock", () => {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  controls.addEventListener("unlock", () => {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  scene.add(controls.getObject());

  // Add event listeners to allow the user to move around the scene
  const onkeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onkeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onkeyDown);
  document.addEventListener("keyup", onkeyUp);

  // Create raycaster to detect collisions
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  //   // Create Floor
  //   let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  //   floorGeometry.rotateX(-Math.PI / 2);

  //   // Vertex displacement for floor
  //   let position = floorGeometry.attributes.position;
  //   for (let i = 0, l = position.count; i < l; i++) {
  //     vertex.fromBufferAttribute(position, i);
  //     vertex.x += Math.random() * 20 - 10;
  //     vertex.y += Math.random() * 5;
  //     vertex.z += Math.random() * 20 - 10;
  //     position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  //   }

  //   floorGeometry = floorGeometry.toNonIndexed(); // Ensure each face has unique vertices
  //   position = floorGeometry.attributes.position;
  //   const colors = [];
  //   for (let i = 0, l = position.count; i < l; i++) {
  //     color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
  //     colors.push(color.r, color.g, color.b);
  //   }

  //   floorGeometry.setAttribute(
  //     "color",
  //     new THREE.Float32BufferAttribute(colors, 3)
  //   );
  //   const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
  //   const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  //   scene.add(floor);

  // This allows the user to resize the window and have the scene adjust to the new window size
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  // This function is called every frame
  requestAnimationFrame(animate);

  // Update the controls
  const time = performance.now();

  // If the controls are locked, then update the raycaster and allow the user to move around the scene
  if (controls.isLocked === true) {
    // Update the raycaster
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    // Check if the raycaster intersects with any objects
    const intersections = raycaster.intersectObjects(objects, false);
    const onObject = intersections.length > 0;
    const delta = (time - prevTime) / 1000;

    // Update the velocity of the user
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    // Update the direction of the user
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    // Update the velocity of the user
    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    // Checks if the user is on the ground
    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += (velocity.y * delta) / 10; // new behavior

    // Don't let the user go below the ground
    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;
      canJump = true;
    }
  }
  // Set the prevTime to the time so we can use it in the next frame
  prevTime = time;

  // Animate the box
  myBoxMesh.rotation.x += 0.01;
  myBoxMesh.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}

export default function THREEScene() {
  sceneRef = useRef(null);

  useEffect(() => {
    // Initialzie the scene
    init();

    // Animate the scene
    animate();
  }, []);

  return <div ref={sceneRef} className="THREEscene" />;
}
