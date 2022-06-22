/**
 * ObjectControls
 * @constructor
 * @param camera - reference to the camera.
 * @param domElement - reference to the renderer's dom element.
 * @param objectToMove - reference the object to control.
 */
function ObjectControls(camera, domElement, objectToMove) {
  /**
   * setObjectToMove
   * @description changes the object(s) to control
   * @param newMesh : one mesh or an array of meshes
   **/
  this.setObjectToMove = function (newMesh) {
    mesh = newMesh;
  };

  this.getObjectToMove = function () {
    return mesh;
  };

  /**
   * setZoomSpeed
   * @description sets a custom zoom speed (0.1 == slow  1 == fast)
   * @param newZoomSpeed
   **/
  this.setZoomSpeed = function (newZoomSpeed) {
    zoomSpeed = newZoomSpeed;
  };

  /**
   * setDistance
   * @description set the zoom range distance
   * @param {number} min
   * @param {number} max
   **/
  this.setDistance = function (min, max) {
    minDistance = min;
    maxDistance = max;
  };

  /**
   * setRotationSpeed
   * @param {number} newRotationSpeed - (1 == fast)  (0.01 == slow)
   **/
  this.setRotationSpeed = function (newRotationSpeed) {
    rotationSpeed = newRotationSpeed;
  };

  /**
   * setRotationSpeedTouchDevices
   * @param {number} newRotationSpeed - (1 == fast)  (0.01 == slow)
   **/
  this.setRotationSpeedTouchDevices = function (newRotationSpeed) {
    rotationSpeedTouchDevices = newRotationSpeed;
  };

  this.enableVerticalRotation = function () {
    verticalRotationEnabled = true;
  };

  this.disableVerticalRotation = function () {
    verticalRotationEnabled = false;
  };

  this.enableHorizontalRotation = function () {
    horizontalRotationEnabled = true;
  };

  this.disableHorizontalRotation = function () {
    horizontalRotationEnabled = false;
  };

  this.setMaxVerticalRotationAngle = function (min, max) {
    MAX_ROTATON_ANGLES.x.from = min;
    MAX_ROTATON_ANGLES.x.to = max;
    MAX_ROTATON_ANGLES.x.enabled = true;
  };

  this.setMaxHorizontalRotationAngle = function (min, max) {
    MAX_ROTATON_ANGLES.y.from = min;
    MAX_ROTATON_ANGLES.y.to = max;
    MAX_ROTATON_ANGLES.y.enabled = true;
  };

  this.disableMaxHorizontalAngleRotation = function () {
    MAX_ROTATON_ANGLES.y.enabled = false;
  };

  this.disableMaxVerticalAngleRotation = function () {
    MAX_ROTATON_ANGLES.x.enabled = false;
  };

  this.disableZoom = function () {
    zoomEnabled = false;
  };

  this.enableZoom = function () {
    zoomEnabled = true;
  };

  this.isUserInteractionActive = function () {
    return isDragging;
  };

  domElement = domElement !== undefined ? domElement : document;

  /********************* Private control variables *************************/

  const MAX_ROTATON_ANGLES = {
    x: {
      // Vertical from bottom to top.
      enabled: false,
      from: Math.PI / 8,
      to: Math.PI / 8,
    },
    y: {
      // Horizontal from left to right.
      enabled: false,
      from: Math.PI / 4,
      to: Math.PI / 4,
    },
  };

  let flag,
    mesh = objectToMove,
    maxDistance = 15,
    minDistance = 6,
    zoomSpeed = 0.5,
    rotationSpeed = 0.05,
    rotationSpeedTouchDevices = 0.05,
    isDragging = false,
    verticalRotationEnabled = false,
    horizontalRotationEnabled = true,
    zoomEnabled = true,
    mouseFlags = { MOUSEDOWN: 0, MOUSEMOVE: 1 },
    previousMousePosition = { x: 0, y: 0 },
    prevZoomDiff = { X: null, Y: null },
    /**
     * CurrentTouches
     * length 0 : no zoom
     * length 2 : is zoomming
     */
    currentTouches = [];

  /***************************** Private shared functions **********************/

  function zoomIn() {
    camera.position.z -= zoomSpeed;
  }

  function zoomOut() {
    camera.position.z += zoomSpeed;
  }

  function rotateVertical(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateVertical(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeed;
  }

  function rotateVerticalTouch(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateVerticalTouch(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeedTouchDevices;
  }

  function rotateHorizontal(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateHorizontal(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeed;
  }

  function rotateHorizontalTouch(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateHorizontalTouch(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeedTouchDevices;
  }

  /**
   * isWithinMaxAngle
   * @description Checks if the rotation in a specific axe is within the maximum
   * values allowed.
   * @param delta is the difference of the current rotation angle and the
   *     expected rotation angle
   * @param axe is the axe of rotation: x(vertical rotation), y (horizontal
   *     rotation)
   * @return true if the rotation with the new delta is included into the
   *     allowed angle range, false otherwise
   */
  function isWithinMaxAngle(delta, axe) {
    if (MAX_ROTATON_ANGLES[axe].enabled) {
      if (mesh.length > 1) {
        let condition = true;
        for (let i = 0; i < mesh.length; i++) {
          if (!condition) return false;
          if (MAX_ROTATON_ANGLES[axe].enabled) {
            condition = isRotationWithinMaxAngles(mesh[i], delta, axe);
          }
        }
        return condition;
      }
      return isRotationWithinMaxAngles(mesh, delta, axe);
    }
    return true;
  }

  function isRotationWithinMaxAngles(meshToRotate, delta, axe) {
    return MAX_ROTATON_ANGLES[axe].from * -1 <
      meshToRotate.rotation[axe] + delta &&
      meshToRotate.rotation[axe] + delta < MAX_ROTATON_ANGLES[axe].to
      ? true
      : false;
  }

  function resetMousePosition() {
    previousMousePosition = { x: 0, y: 0 };
  }

  /******************  MOUSE interaction functions - desktop  *****/

  function mouseDown(e) {
    isDragging = true;
    flag = mouseFlags.MOUSEDOWN;
  }

  function mouseMove(e) {
    if (isDragging) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      previousMousePosition = { x: e.offsetX, y: e.offsetY };

      if (horizontalRotationEnabled && deltaMove.x != 0) {
        // && (Math.abs(deltaMove.x) > Math.abs(deltaMove.y))) {
        // enabling this, the mesh will rotate only in one specific direction
        // for mouse movement
        if (!isWithinMaxAngle(Math.sign(deltaMove.x) * rotationSpeed, 'y'))
          return;
        rotateHorizontal(deltaMove, mesh);
        flag = mouseFlags.MOUSEMOVE;
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        // &&(Math.abs(deltaMove.y) > Math.abs(deltaMove.x)) //
        // enabling this, the mesh will rotate only in one specific direction for
        // mouse movement
        if (!isWithinMaxAngle(Math.sign(deltaMove.y) * rotationSpeed, 'x'))
          return;
        rotateVertical(deltaMove, mesh);
        flag = mouseFlags.MOUSEMOVE;
      }
    }
  }

  function mouseUp() {
    isDragging = false;
    resetMousePosition();
  }

  function wheel(e) {
    if (!zoomEnabled) return;
    const delta = e.wheelDelta ? e.wheelDelta : e.deltaY * -1;
    if (delta > 0 && camera.position.z > minDistance) {
      zoomIn();
    } else if (delta < 0 && camera.position.z < maxDistance) {
      zoomOut();
    }
  }
  /****************** TOUCH interaction functions - mobile  *****/

  function onTouchStart(e) {
    e.preventDefault();
    flag = mouseFlags.MOUSEDOWN;
    if (e.touches.length === 2) {
      prevZoomDiff.X = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      prevZoomDiff.Y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
      currentTouches = new Array(2);
    } else {
      previousMousePosition = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    }
  }

  function onTouchEnd(e) {
    prevZoomDiff.X = null;
    prevZoomDiff.Y = null;

    /* If you were zooming out, currentTouches is updated for each finger you
     * leave up the screen so each time a finger leaves up the screen,
     * currentTouches length is decreased of a unit. When you leave up both 2
     * fingers, currentTouches.length is 0, this means the zoomming phase is
     * ended.
     */
    if (currentTouches.length > 0) {
      currentTouches.pop();
    } else {
      currentTouches = [];
    }
    e.preventDefault();
    if (flag === mouseFlags.MOUSEDOWN) {
      // TouchClick
      // You can invoke more other functions for animations and so on...
    } else if (flag === mouseFlags.MOUSEMOVE) {
      // Touch drag
      // You can invoke more other functions for animations and so on...
    }
    resetMousePosition();
  }

  function onTouchMove(e) {
    e.preventDefault();
    flag = mouseFlags.MOUSEMOVE;
    // Touch zoom.
    // If two pointers are down, check for pinch gestures.
    if (e.touches.length === 2 && zoomEnabled) {
      currentTouches = new Array(2);
      // Calculate the distance between the two pointers.
      const curDiffX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      const curDiffY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

      if (prevZoomDiff && prevZoomDiff.X > 0 && prevZoomDiff.Y > 0) {
        if (
          curDiffX > prevZoomDiff.X &&
          curDiffY > prevZoomDiff.Y &&
          camera.position.z > minDistance
        ) {
          zoomIn();
        } else if (
          curDiffX < prevZoomDiff.X &&
          camera.position.z < maxDistance &&
          curDiffY < prevZoomDiff.Y
        ) {
          zoomOut();
        }
      }
      // Cache the distance for the next move event.
      prevZoomDiff.X = curDiffX;
      prevZoomDiff.Y = curDiffY;

      // Touch Rotate.
    } else if (currentTouches.length === 0) {
      prevZoomDiff.X = null;
      prevZoomDiff.Y = null;
      const deltaMove = {
        x: e.touches[0].pageX - previousMousePosition.x,
        y: e.touches[0].pageY - previousMousePosition.y,
      };
      previousMousePosition = { x: e.touches[0].pageX, y: e.touches[0].pageY };

      if (horizontalRotationEnabled && deltaMove.x != 0) {
        if (
          !isWithinMaxAngle(
            Math.sign(deltaMove.x) * rotationSpeedTouchDevices,
            'y'
          )
        )
          return;
        rotateHorizontalTouch(deltaMove, mesh);
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        if (
          !isWithinMaxAngle(
            Math.sign(deltaMove.y) * rotationSpeedTouchDevices,
            'x'
          )
        )
          return;
        rotateVerticalTouch(deltaMove, mesh);
      }
    }
  }

  /********************* Event Listeners *************************/

  /** Mouse Interaction Controls (rotate & zoom, desktop **/
  // Mouse - move
  document.addEventListener('mousedown', mouseDown, false);
  document.addEventListener('mousemove', mouseMove, false);
  document.addEventListener('mouseup', mouseUp, false);
  document.addEventListener('mouseout', mouseUp, false);

  // Mouse - zoom
  domElement.addEventListener('wheel', wheel, false);

  /** Touch Interaction Controls (rotate & zoom, mobile) **/
  // Touch - move
  document.addEventListener('touchstart', onTouchStart, false);
  document.addEventListener('touchmove', onTouchMove, false);
  document.addEventListener('touchend', onTouchEnd, false);
}

const COLORS = [
  { r: 0, g: 255, b: 172 },
  { r: 197, g: 253, b: 234 },
  { r: 137, g: 114, b: 255 },
  { r: 60, g: 46, b: 227 },
  { r: 185, g: 107, b: 255 },
  { r: 122, g: 206, b: 255 },
];
class GradientAnimation {
  constructor() {
    this.cnv = document.querySelector(`.bg`);
    this.ctx = this.cnv.getContext(`2d`);

    this.circlesNum = 80;
    this.speed = 0.035;

    (window.onresize = () => {
      this.setCanvasSize();
      this.createCircles();
    })();
    this.drawAnimation();
  }
  setCanvasSize() {
    this.w = this.cnv.width = innerWidth;
    this.h = this.cnv.height = innerHeight;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  createCircles() {
    this.circles = [];
    this.minRadius = this.w > 700 ? 50 : 25;
    this.maxRadius = this.w > 700 ? 200 : 100;
    for (let i = 0; i < this.circlesNum; ++i) {
      this.circles.push(
        new Circle(
          this.w,
          this.h,
          this.minRadius,
          this.maxRadius,
          COLORS[i % COLORS.length]
        )
      );
    }
  }
  drawCircles() {
    this.circles.forEach((circle) => circle.draw(this.ctx, this.speed));
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }
  drawAnimation() {
    this.clearCanvas();
    this.drawCircles();
    window.requestAnimationFrame(() => this.drawAnimation());
  }
}

class Circle {
  constructor(w, h, minR, maxR, color) {
    this.x = (Math.random() * w) / 2;
    this.y = (Math.random() * h) / 2;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = Math.random() * maxR - minR + minR;
    this.color = color;
  }
  draw(ctx, speed) {
    this.angle += speed;
    const x = this.x + Math.cos(this.angle) * 100;
    const y = this.y + Math.sin(this.angle) * 100;

    // ctx.globalCompositeOperation = `overlay`;
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
    ctx.beginPath();
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 로딩애니메이션
const loadingBar = document.querySelector('.loading-bar');
const loadingScreen = document.querySelector('.loading-screen');
const loadingManager = new THREE.LoadingManager(
  // 로드됨
  () => {
    gsap.delayedCall(0.5, () => {
      loadingBar.classList.add('ended');
      loadingBar.style.transform = '';
      gsap.to(loadingScreen, {
        opacity: 0,
        display: 'none',
      });
    });
  },
  //   로딩중
  (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBar.style.transform = `scaleX(${progressRatio})`;
  }
);

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.hide();

const loader = new THREE.GLTFLoader(loadingManager);

const canvas = document.querySelector('canvas.webgl');

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000
);
// camera.position.set(-4, 4, 4);
camera.position.z = 5;
scene.add(camera);
var renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

// 텍스쳐
// textture
const textureLoader = new THREE.TextureLoader(loadingManager);

// Lights
const am = new THREE.AmbientLight('white', 0.8);
const mainLight1 = new THREE.DirectionalLight('#ffffff', 3);

am.position.set(-1, -1, 1);
mainLight1.position.set(0.398, 0.29, 2.02);
mainLight1.scale.set(1, 1, 1);

// 내부 라이트

scene.add(am);
scene.add(mainLight1);

// 라이트 가이드
gui.add(mainLight1, 'intensity').min(0).max(10).step(0.001).name('밝기');
gui.add(mainLight1.position, 'x').min(-5).max(5).step(0.001).name('X');
gui.add(mainLight1.position, 'y').min(-5).max(5).step(0.001).name('Y');
gui.add(mainLight1.position, 'z').min(-5).max(5).step(0.001).name('Z');

// 큐브 모델
var mixer;
var model;
var objectControls;
let tl = gsap.timeline({
  // ease: 'bounce.out',
});

// clock
const clock = new THREE.Clock();

loader.load(
  'https://raw.githubusercontent.com/studiop/studiop.github.io/38fa0cef40b955f9f14891ea87d644ac110225e1/cube-optimize.gltf',
  (gltf) => {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    model = gltf.scene;
    model.rotation.x = Math.PI / 4;
    model.rotation.y = Math.PI / 4;
    model.traverse((o) => {
      if (o.isMesh) {
        // o.material.envMap = environmentMapTexture;

        // 앰비언트 오클루젼
        o.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(o.geometry.attributes.uv.array, 2)
        );

        o.material.roughness = 1;
        o.material.metalness = 0;
        o.material.transparent = true;
      }
    });

    mixer = new THREE.AnimationMixer(model);

    scene.add(model);

    gltf.animations.forEach(function (clip) {
      mixer.clipAction(clip).setLoop(THREE.LoopOnce, 1).play();
      mixer.clipAction(clip).clampWhenFinished = true;
    });

    objectControls = new ObjectControls(camera, canvas, model);

    /** instantiate ObjectControls**/
    objectControls.setDistance(8, 2000); // set min - max distance for zoom
    objectControls.setZoomSpeed(0.5); // set zoom speed
    objectControls.enableVerticalRotation();
    objectControls.setMaxVerticalRotationAngle(Math.PI / 4, Math.PI / 4);
    objectControls.setRotationSpeed(0.05);
  }
);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Update renderer

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;

// 리사이즈 할때
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

var controls = new THREE.OrbitControls(camera, canvas);
controls.enabled = false;

// 마우스 커서 움직이면 따라오게
const cursor = {};
cursor.x = 0;
cursor.y = 0;

// window.addEventListener('mousemove', (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = event.clientY / sizes.height - 0.5;
// });

new GradientAnimation();
// 애니메이션
function animate() {
  requestAnimationFrame(animate);
  // 카메라 애니메이션
  // const parallaxX = cursor.x;
  // const parallaxY = -cursor.y;
  // camera.position.x += parallaxX - camera.position.x / 3.5;
  // camera.position.y += parallaxY - camera.position.y / 3.5;

  // controls.update();
  renderer.render(scene, camera);
}

animate();
gsap.registerPlugin(ScrollTrigger);

const locoScroll = new LocomotiveScroll({
  el: document.querySelector('.container'),
  smooth: true,
});
// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy('.container', {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector('.container').style.transform
    ? 'transform'
    : 'fixed',
});

// Regular ScrollTrigger stuff
gsap.to('canvas.bg', {
  scrollTrigger: {
    trigger: '.scroll',
    scroller: '.container',
    start: 'center 80%', // when the top of the trigger hits the top of the viewport
    end: 'center top',
    scrub: true,
  },
  opacity: 1,
});

gsap.to('canvas.webgl', {
  scrollTrigger: {
    trigger: '.scroll',
    scroller: '.container',
    start: 'center top', // when the top of the trigger hits the top of the viewport
    end: '90% bottom',
    scrub: true,
  },
  opacity: 0,
});

// 스크롤 애니메이션
var scrollContainerHeight = document.querySelector('.scroll').offsetHeight;
var windowHeight = window.innerHeight;

let lastScrollY = 0;

// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on('scroll', ScrollTrigger.update);
locoScroll.on('scroll', function (e) {
  if (mixer) {
    mixer.setTime(0);
  }

  var currentScroll = e.scroll.y;

  // 폭파 애니메이션
  var animationDuration = 6.2;
  var totalScroll = scrollContainerHeight - windowHeight; //전체

  var timeline = (currentScroll / totalScroll) * 100; //진행률

  // 셰이더 그라디언트 숨기
  var currentScrollRatio = (currentScroll / totalScroll) * animationDuration;
  if (mixer && timeline >= 20) {
    mixer.setTime(currentScrollRatio - animationDuration * 0.2);
  }

  camera.position.z = 5;
  // 회전 애니메이션 구간 20%부터 시작, 종료 50%
  if (timeline >= 1) {
    // 현재의 스크롤 값을 저장
    // model.rotation.y = Math.PI / 4;
    // model.rotation.x = Math.PI / 4;

    if (currentScroll > lastScrollY) {
      model.rotation.y += timeline * 0.0001;
      camera.position.z -= timeline * 0.0006;
      // console.log('스크롤 다운' + model.rotation.y);
    }
    if (currentScroll < lastScrollY) {
      model.rotation.y += timeline * 0.0001;
      camera.position.z -= timeline * 0.0006;
      // console.log('스크롤 업' + model.rotation.y);
    }
    lastScrollY = currentScroll;
  }
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
ScrollTrigger.addEventListener('refresh', () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();
