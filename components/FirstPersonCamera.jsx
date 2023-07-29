
// Define the keys to be used to move around the scene
const KEYS = {
    a: 65,
    s: 83,
    d: 68,
    w: 87,
  };
  
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
  