gsap.registerPlugin(ScrollTrigger);

const locoScroll = new LocomotiveScroll({
  el: document.querySelector('.locomotive-scroll'),
  smooth: true,
  smartphone: {
    smooth: true,
  },
  tablet: {
    smooth: true,
  },
  smoothMobile: 1,
  multiplier: 1.0,
});

locoScroll.on('scroll', ScrollTrigger.update);
// 스크롤 트리거 모션//
ScrollTrigger.scrollerProxy('.locomotive-scroll', {
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

  pinType: document.querySelector('.locomotive-scroll').style.transform
    ? 'transform'
    : 'fixed',
});
gsap.to('canvas.bg', {
  scrollTrigger: {
    pin: true,
    trigger: '.scroll',
    scroller: '.locomotive-scroll',
    start: 'bottom 160%',
    scrub: true,
  },
  opacity: 1,
});
gsap.to('div.bg-cloud.down', {
  scrollTrigger: {
    trigger: '.scroll',
    scroller: '.locomotive-scroll',
    start: 'bottom 160%',
    scrub: true,
  },
  opacity: 1,
});
gsap.to('canvas.webgl', {
  scrollTrigger: {
    // pin: true,
    marker: true,
    trigger: '.scroll',
    scroller: '.locomotive-scroll',
    start: 'center top',
    scrub: true,
  },
  opacity: 0,
});
gsap.to('div.bg-cloud.up', {
  scrollTrigger: {
    trigger: '.scroll',
    scroller: '.locomotive-scroll',
    start: 'bottom 80%',
    scrub: true,
  },
  opacity: 1,
});
gsap.to('.move-link', {
  scrollTrigger: {
    pin: true,
    trigger: '.scroll',
    scroller: '.locomotive-scroll',
    start: 'bottom 80%',
    scrub: true,
  },
  opacity: 1,
  display: 'flex',
});

document.querySelector('.move-link img').addEventListener('click', function () {
  window.open(
    'https://forms.gle/KrSxxapHLeudTvnG6',
    '_blank',
    'noopener, noreferrer'
  );
});
ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
ScrollTrigger.refresh();

const COLORS = [
  { r: 255, g: 255, b: 255, a: 0.8 },
  { r: 255, g: 255, b: 255, a: 0.5 },
  { r: 255, g: 255, b: 255, a: 0.5 },
  { r: 53, g: 97, b: 158, a: 0.6 },
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
    this.minRadius = this.w > 700 ? 25 : 20;
    this.maxRadius = this.w > 700 ? 100 : 80;
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
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b},${this.color.a})`;
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
/*Base*/
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
const am = new THREE.AmbientLight('white', 2);
const mainLight1 = new THREE.DirectionalLight('#ffffff', 1.5);
const innerLight = new THREE.PointLight('white', 0.1);
am.position.set(-1, -1, 1);
mainLight1.position.set(0.2, 0.6, 1.7);
mainLight1.scale.set(1, 1, 1);

// 내부 라이트

scene.add(am);
scene.add(innerLight);
scene.add(mainLight1);
// 라이트 가이드

// 큐브 모델
var mixer;
var model;
var originCube;
var objectControls;

// clock
const clock = new THREE.Clock();
loader.load(
  'https://raw.githubusercontent.com/studiop/studiop.github.io/main/cube0624.glb',
  (gltf) => {
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    model = gltf.scene;
    originCube = model.children.find((child) => child.name === 'Origin');

    model.rotation.x = Math.PI / 5.5;
    model.rotation.y = Math.PI / 4;
    model.traverse((o) => {
      if (o.isMesh) {
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
    objectControls.setRotationSpeed(0.05);
    objectControls.enableVerticalRotation();
    objectControls.enableHorizontalRotation();
    //objectControls.setMaxVerticalRotationAngle(Math.PI / 4, Math.PI / 4);
  }
);
/* Sizes */
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

new GradientAnimation();
// 애니메이션
function animate() {
  requestAnimationFrame(animate);

  // 카메라 애니메이션
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (!isMobile) {
    window.addEventListener('mousemove', (event) => {
      // mousemove(event);
    });
  }
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 스크롤 애니메이션
var scrollContainerHeight =
  document.querySelector('.locomotive-scroll').offsetHeight;
var windowHeight = window.innerHeight;
let lastScrollY = 0;

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
    lastScrollY = currentScroll;
    if (timeline >= 24) {
      originCube.visible = false;
    } else {
      originCube.visible = true;
    }
  }
});
