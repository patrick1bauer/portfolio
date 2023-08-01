import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

let sceneRef;
let camera, scene, renderer, controls;

const objects = [];

let waterAnimationMixer;

let myBoxMesh;
let globe;
let clouds;

let raycaster;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

const clock = new THREE.Clock();
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function init() {
  // **************************************************************************
  // Loading Screen Logic

  // Loaders
  const loadingManager = new THREE.LoadingManager();
  const progressContainer = document.getElementById("progress");
  const progressBar = document.getElementById("progress-bar");

  // Display the update the progress bar as the scene loads
  loadingManager.onProgress = function (url, loaded, total) {
    progressBar.style.width = (loaded / total) * 100 + "%";
  };

  // **************************************************************************
  // Scene, Renderer, & Camera

  // Create the scene
  scene = new THREE.Scene();

  // Create Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    25000
  );
  camera.position.x = 75;
  camera.position.y = 1.62;
  camera.position.z = 5;
  // camera.rotateX(-0.785398);
  // camera.rotateZ(0.785398);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight); // Set size of renderer to be the size of the window
  renderer.shadowMap.enabled = true; // Set shadowMap to true to allow for shadows
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  sceneRef.current.appendChild(renderer.domElement);

  // **************************************************************************
  // Environment

  // Draco Loader
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  // GLTF Loader
  const gltfLoader = new GLTFLoader(loadingManager);
  gltfLoader.setDRACOLoader(dracoLoader);

  // Image Bitmap Loader
  const imageBitmapLoader = new THREE.ImageBitmapLoader(loadingManager);
  imageBitmapLoader.setOptions({ imageOrientation: "flipY" });

  // Texture Loader
  const textureLoader = new THREE.TextureLoader(loadingManager);

  // Create Axes helper to visualize the axes
  const axesHelper = new THREE.AxesHelper(50);
  scene.add(axesHelper);

  // Add horizontal grid
  const gridHelper = new THREE.GridHelper(120, 120);
  scene.add(gridHelper);

  // // Create a background
  // scene.background = new THREE.TextureLoader().load(
  //   "/images/sky-background.jpg"
  // );

  // Add mountain model
  gltfLoader.load(
    "/models/mossStock/scene.gltf",
    (model) => {
      model.scene.position.x = -80;
      model.scene.position.y = -750;
      model.scene.position.z = 40;
      model.scene.scale.set(1000, 1000, 1000);
      model.scene.castShadow = true;
      scene.add(model.scene);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log(error);
    }
  );

  //   // Create cylinder platform
  //   const cylinderPlatformGeometry = new THREE.CylinderGeometry(100, 100, 80);
  //   const cylinderPlatformMaterial = new THREE.MeshStandardMaterial({
  //     color: 0xcbcbcb,
  //     side: THREE.DoubleSide, // This is needed to see the plane from both sides
  //   });
  //   const cylinderPlatformMesh = new THREE.Mesh(
  //     cylinderPlatformGeometry,
  //     cylinderPlatformMaterial
  //   );
  //   // cylinderPlatformMesh.rotation.x = -0.5 * Math.PI; // This is needed to rotate the plane 90 degrees so it is horizontal
  //   cylinderPlatformMesh.receiveShadow = true; // This is needed to allow the plane to receive shadows
  //   cylinderPlatformMesh.position.y = -40;
  //   cylinderPlatformMesh.position.x = 0;
  //   cylinderPlatformMesh.position.z = 0;
  //   scene.add(cylinderPlatformMesh);

  // // Create Lamp Model
  // gltfLoader.load(
  //   "/models/ceilingChandelier/scene.gltf",
  //   (ceilingChandelierModel) => {
  //     ceilingChandelierModel.scene.position.y = 30;
  //     ceilingChandelierModel.scene.scale.set(30, 30, 30);
  //     ceilingChandelierModel.castShadow = true;
  //     scene.add(ceilingChandelierModel.scene);
  //   },
  //   function (xhr) {
  //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded"); // This is a callback function that runs when the model is loading
  //   },
  //   function (error) {
  //     console.log(error); // This is a callback function that runs if there is an error
  //   }
  // );

  // // Create fog
  // scene.fog = new THREE.Fog(0xffffff, 0, 13000);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add point light
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(-30, 50, 0);
  pointLight.castShadow = true; // This is needed to allow the directional light to cast shadows
  scene.add(pointLight);

  // Point light helper
  const pointLightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(pointLightHelper);

  // Add spot light
  const spotLight = new THREE.SpotLight(0xf4b843, 0.5);
  spotLight.position.set(40, 50, 30);
  spotLight.castShadow = true; // This is needed to allow the directional light to cast shadows
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.5;
  spotLight.intensity = 1;
  scene.add(spotLight);

  // Spot light helper
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);

  // **************************************************************************
  // JPMC Scene
  const coordsJPMC = [10, 0, 0];

  // **************************************************************************
  // Cummings Aerospace Scene
  const coordsCummings = [20, 0, 0];

  //   // Add German ship
  //   gltfLoader.load(
  //     "/models/germanAircraftCarrier/scene.gltf",
  //     (model) => {
  //       model.scene.position.x = coordsCummings[0] + 0;
  //       model.scene.position.y = coordsCummings[1] + 5;
  //       model.scene.position.z = coordsCummings[2] + 0;
  //       model.scene.scale.set(0.01, 0.01, 0.01);
  //       model.scene.castShadow = true;
  //       scene.add(model.scene);
  //     },
  //     function (xhr) {
  //       // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //     },
  //     function (error) {
  //       console.log(error);
  //     }
  //   );

  //   // Add USA ship
  //   gltfLoader.load(
  //     "/models/usaAircraftCarrier/scene.gltf",
  //     (model) => {
  //       model.scene.position.x = coordsCummings[0] + 1;
  //       model.scene.position.y = coordsCummings[1] + 5;
  //       model.scene.position.z = coordsCummings[2] + 0;
  //       model.scene.scale.set(0.0001, 0.0001, 0.0001);
  //       model.scene.castShadow = true;
  //       scene.add(model.scene);
  //     },
  //     function (xhr) {
  //       // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //     },
  //     function (error) {
  //       console.log(error);
  //     }
  //   );

  //   // Add missile
  //   gltfLoader.load(
  //     "/models/missile/scene.gltf",
  //     (model) => {
  //       model.scene.position.x = coordsCummings[0] + 2;
  //       model.scene.position.y = coordsCummings[1] + 5;
  //       model.scene.position.z = coordsCummings[2] + 0;
  //       model.scene.scale.set(0.1, 0.1, 0.1);
  //       model.scene.castShadow = true;
  //       scene.add(model.scene);
  //     },
  //     function (xhr) {
  //       // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //     },
  //     function (error) {
  //       console.log(error);
  //     }
  //   );

  //   // Add water
  //   gltfLoader.load(
  //     "/models/water1/scene.gltf",
  //     (model) => {
  //       model.scene.position.x = coordsCummings[0] + 0;
  //       model.scene.position.y = coordsCummings[1] + 10;
  //       model.scene.position.z = coordsCummings[2] + 0;
  //       model.scene.scale.set(0.01, 0.01, 0.01);
  //       model.scene.castShadow = true;
  //       scene.add(model.scene);

  //       waterAnimationMixer = new THREE.AnimationMixer(model.scene);
  //       const clips = model.animations;
  //       const clip = THREE.AnimationClip.findByName(clips, "Object_0");
  //       const action = waterAnimationMixer.clipAction(clip);
  //       action.play();
  //     },
  //     function (xhr) {
  //       // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //     },
  //     function (error) {
  //       console.log(error);
  //     }
  //   );

  // Add Cylinder for table

  // **************************************************************************
  // NAVAIR Scene
  const coordsNavair = [30, 0, 0];

  // **************************************************************************
  // BIG Scene
  const coordsBIG = [40, 0, 0];

  // **************************************************************************
  // Affordable Drone Photography Scene
  const coordsAFD = [50, 0, 0];

  // **************************************************************************
  // Portfolio Inception Scene
  const coordsPortfolio = [60, 0, 0];

  // **************************************************************************
  // Stock Analysis Scene
  const coordsStocks = [70, 0, 0];

  // **************************************************************************
  // Travel Scene
  const coordsTravel = [80, 0, 0];

  imageBitmapLoader.load(
    "/images/earthMarks.png",
    (imageBitmap) => {
      const texture = new THREE.CanvasTexture(imageBitmap);
      texture.colorSpace = THREE.SRGBColorSpace;
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        roughness: 0.2,
        metalness: 0.2,
      });
      const sphereGeometry = new THREE.SphereGeometry(1, 30, 30);
      globe = new THREE.Mesh(sphereGeometry, earthMaterial);
      globe.position.set(
        coordsTravel[0] + 0,
        coordsTravel[1] + 2,
        coordsTravel[2] + 0
      );
      globe.castShadow = true;
      globe.receiveShadow = true;
      scene.add(globe);
    },
    undefined,
    (err) => {
      console.log(
        "An error occured when loading the earth image as a bitmap." + err
      );
    }
  );

  // imageBitmapLoader.load(
  //   "/images/clouds.png",
  //   (imageBitmap) => {
  //     const texture = new THREE.CanvasTexture(imageBitmap);
  //     texture.colorSpace = THREE.SRGBColorSpace;
  //     const cloudsMaterial = new THREE.MeshStandardMaterial({ map: texture });
  //     const sphereGeometry = new THREE.SphereGeometry(1.1, 30, 30);
  //     clouds = new THREE.Mesh(sphereGeometry, cloudsMaterial);
  //     clouds.position.set(
  //       coordsTravel[0] + 0,
  //       coordsTravel[1] + 2,
  //       coordsTravel[2] + 5
  //     );
  //     clouds.castShadow = true;
  //     clouds.receiveShadow = true;
  //     scene.add(clouds);
  //   },
  //   undefined,
  //   (err) => {
  //     console.log(
  //       "An error occured when loading the earth image as a bitmap." + err
  //     );
  //   }
  // );

  // Create a sphere for the clouds
  const sphereGeometry = new THREE.SphereGeometry(1.01, 30, 30);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load("/images/clouds.png"),
    transparent: true,
    opacity: 0.35,
  });
  clouds = new THREE.Mesh(sphereGeometry, sphereMaterial);
  clouds.position.set(
    coordsTravel[0] + 0,
    coordsTravel[1] + 2,
    coordsTravel[2] + 0
  );
  // clouds.castShadow = true;
  // clouds.receiveShadow = true;
  scene.add(clouds);

  // textureLoader.load("/images/clouds.jpg", (texture) => {
  //   const sphereGeometry = new THREE.SphereGeometry(1.1, 10, 10);
  //   const sphereMaterial = new THREE.MeshBasicMaterial({
  //     map: texture,
  //     overdraw: 0,
  //   });
  //   const clouds = new THREE.Mesh(sphereGeometry, sphereMaterial);
  //   clouds.position.set(
  //     coordsTravel[0] + 0,
  //     coordsTravel[1] + 2,
  //     coordsTravel[2] + 6
  //   );
  //   clouds.castShadow = true;
  //   clouds.receiveShadow = true;
  //   scene.add(clouds);
  // });

  // **************************************************************************
  // Music Scene
  const coordsMusic = [90, 0, 0];

  // **************************************************************************
  // Guest Wall Scene
  const coordsGuestWall = [100, 0, 0];

  // **************************************************************************
  // Random Stuff
  const coordsRandom = [0, 0, 0];

  // Create Box
  const myBoxGeometry = new THREE.BoxGeometry();
  const myBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x8a2be2 });
  myBoxMesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
  myBoxMesh.castShadow = true;
  myBoxMesh.position.x = coordsRandom[0] + -10;
  myBoxMesh.position.y = coordsRandom[1] + 10;
  myBoxMesh.position.z = coordsRandom[2] + 0;
  myBoxMesh.scale.set(1, 1, 1);
  scene.add(myBoxMesh);

  // Create a box arch
  let box1Mesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
  box1Mesh.castShadow = true;
  box1Mesh.position.x = coordsRandom[0] + 0.5;
  box1Mesh.position.y = coordsRandom[1] + 0.5;
  box1Mesh.position.z = coordsRandom[2] + 0.5;
  box1Mesh.scale.set(1, 1, 1);
  scene.add(box1Mesh);

  let box2Mesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
  box2Mesh.castShadow = true;
  box2Mesh.position.x = coordsRandom[0] + 0.5;
  box2Mesh.position.y = coordsRandom[1] + 1.5;
  box2Mesh.position.z = coordsRandom[2] + 0.5;
  box2Mesh.scale.set(1, 1, 1);
  scene.add(box2Mesh);

  let box3Mesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
  box3Mesh.castShadow = true;
  box3Mesh.position.x = coordsRandom[0] + 0.5;
  box3Mesh.position.y = coordsRandom[1] + 2.5;
  box3Mesh.position.z = coordsRandom[2] + 0.5;
  box3Mesh.scale.set(1, 1, 1);
  scene.add(box3Mesh);

  let box4Mesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
  box4Mesh.castShadow = true;
  box4Mesh.position.x = coordsRandom[0] + 1.5;
  box4Mesh.position.y = coordsRandom[1] + 2.5;
  box4Mesh.position.z = coordsRandom[2] + 0.5;
  box4Mesh.scale.set(1, 1, 1);
  scene.add(box4Mesh);

  let box5Mesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
  box5Mesh.castShadow = true;
  box5Mesh.position.x = coordsRandom[0] + 2.5;
  box5Mesh.position.y = coordsRandom[1] + 2.5;
  box5Mesh.position.z = coordsRandom[2] + 0.5;
  box5Mesh.scale.set(1, 1, 1);
  scene.add(box5Mesh);

  let box6Mesh = new THREE.Mesh(myBoxGeometry, myBoxMaterial);
  box6Mesh.castShadow = true;
  box6Mesh.position.x = coordsRandom[0] + 2.5;
  box6Mesh.position.y = coordsRandom[1] + 1.5;
  box6Mesh.position.z = coordsRandom[2] + 0.5;
  box6Mesh.scale.set(1, 1, 1);
  scene.add(box6Mesh);

  //   // Function to create a randomly generated star
  //   function addStar() {
  //     const geometry = new THREE.SphereGeometry(1, 24, 24);
  //     const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  //     const star = new THREE.Mesh(geometry, material);
  //     // Generate random xyz coordinates in an array
  //     const [x, y, z] = Array(3)
  //       .fill()
  //       .map(() => THREE.MathUtils.randFloatSpread(200));
  //     star.position.set(x, y, z);
  //     star.castShadow = true;
  //     scene.add(star);
  //   }
  //   // Create stars
  //   Array(2000).fill().forEach(addStar);

  // **************************************************************************
  // Controls

  // Get the div elements of the start button and the loading screen
  const startButton = document.getElementById("start-button");
  const loadingScreen = document.getElementById("loadingscreen");

  // Orbit Controls
  //   const orbit = new OrbitControls(camera, renderer.domElement);
  //   orbit.update();

  //   startButton.addEventListener("click", () => {
  //     orbit.enabled = true;
  //     loadingScreen.classList.add("hidden");
  //     loadingScreen.classList.remove("visible");
  //   });
  //   scene.add(orbit);

  // First Person Controls
  controls = new PointerLockControls(camera, renderer.domElement);
  startButton.addEventListener("click", () => {
    controls.lock();
  });
  controls.addEventListener("lock", () => {
    loadingScreen.classList.add("hidden");
    loadingScreen.classList.remove("visible");
  });
  controls.addEventListener("unlock", () => {
    loadingScreen.classList.remove("hidden");
    loadingScreen.classList.add("visible");
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
        if (canJump === true) velocity.y = 0.42;
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

  // **************************************************************************
  // Other Logic

  // Create raycaster to detect collisions
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // set all objects in the scene to not be frustrum culled so that there are no lag spikes when new objects come into view.
  scene.traverse((obj) => (obj.frustrumCulled = false));

  // When the scene is finished loading, hide the progress bar and show the start button
  loadingManager.onLoad = function () {
    progressContainer.style.display = "none";
    document.getElementById("start-button").style.display = "flex";
  };

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

  // // Animate the water
  // if (waterAnimationMixer) {
  //   waterAnimationMixer.update(clock.getDelta());
  // }

  // Update the controls
  const time = performance.now();

  // First person controls
  // If the controls are locked, then update the raycaster and allow the user to move around the scene
  if (controls.isLocked === true) {
    // Update the raycaster
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 1.62;

    // Check if the raycaster intersects with any objects
    const intersections = raycaster.intersectObjects(objects, false);
    const onObject = intersections.length > 0;
    const delta = (time - prevTime) / 50; // Ticks since last frame (20 ticks per second)

    // Update the velocity of the user when the user stops moving in a direction
    const decelerationSpeed = 10;
    velocity.x -= velocity.x * decelerationSpeed * delta;
    velocity.z -= velocity.z * decelerationSpeed * delta;
    const gravity = 0.1;
    const drag = 0.02; // 0 = no drag. 1 = full drag
    velocity.y = (velocity.y - gravity * delta) * (1 - drag);

    // Update the direction of the user
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions
    const walkSpeed = 5;
    if (moveForward || moveBackward)
      velocity.z -= direction.z * walkSpeed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * walkSpeed * delta;

    // Checks if the user is on the ground
    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += velocity.y; // new behavior

    // Don't let the user go below the ground
    if (controls.getObject().position.y < 1.62) {
      velocity.y = 0;
      controls.getObject().position.y = 1.62;
      canJump = true;
    }
  }

  // Set the prevTime to the time so we can use it in the next frame
  prevTime = time;

  // Animate the box
  myBoxMesh.rotation.x += 0.01;
  myBoxMesh.rotation.y += 0.01;

  // Animate the earth and clouds
  const earthRotationSpeed = 0.001;
  if (globe) {
    globe.rotation.y += earthRotationSpeed;
  }
  if (clouds) {
    clouds.rotation.y += earthRotationSpeed * 0.8;
  }

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
