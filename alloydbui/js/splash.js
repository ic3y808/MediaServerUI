function run() {
  var $body = document.body,
    $wrap = document.getElementById("wrap"),

    areawidth = window.innerWidth,
    areaheight = window.innerHeight,

    canvassize = 500,

    length = 30,
    radius = 5.6,

    rotatevalue = 0.035,
    acceleration = 0,
    animatestep = 0,
    toend = true,

    pi2 = Math.PI * 2,

    group = new THREE.Group(),
    mesh, ringcover, ring, 
    alloyLogo,

    camera, scene, renderer;


  camera = new THREE.PerspectiveCamera(65, 1, 1, 10000);
  camera.position.z = 150;

  scene = new THREE.Scene();
  // scene.add(new THREE.AxisHelper(30));
  scene.add(group);

  mesh = new THREE.Mesh(
    new THREE.TubeGeometry(new (THREE.Curve.create(function () { },
      function (percent) {

        var x = length * Math.sin(pi2 * percent),
          y = radius * Math.cos(pi2 * 3 * percent),
          z, t;

        t = percent % 0.25 / 0.25;
        t = percent % 0.25 - (2 * (1 - t) * t * -0.0185 + t * t * 0.25);
        if (Math.floor(percent / 0.25) == 0 || Math.floor(percent / 0.25) == 2) {
          t *= -1;
        }
        z = radius * Math.sin(pi2 * 2 * (percent - t));

        return new THREE.Vector3(x, y, z);

      }
    ))(), 200, 1.1, 2, true),
    new THREE.MeshBasicMaterial({
      color: 0xab47bc,
      
      // , wireframe: true
    })
  );
  group.add(mesh);


  ringcover = new THREE.Mesh(new THREE.PlaneGeometry(50, 15, 1), new THREE.MeshBasicMaterial({ color: 0xfafafa, opacity: 0, transparent: true }));
  ringcover.position.x = 1;
  ringcover.rotation.y = Math.PI / 2;
  group.add(ringcover);

  ring = new THREE.Mesh(new THREE.RingGeometry(4.8, 5.2, 64), new THREE.MeshBasicMaterial({ color: 0xab47bc, opacity: 0, transparent: true }));
  ring.position.x = length + 1.1;
  ring.rotation.y = Math.PI / 2;
  group.add(ring);
  

  var map = new THREE.TextureLoader().load("../../common/art/icon-white.png");
  var material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, opacity: 0, transparent: true });
  alloyLogo = new THREE.Sprite(material);
  scene.add(alloyLogo);
  alloyLogo.scale.set(length, length, 1);
  alloyLogo.position.z = 76;
  function easing(t, b, c, d) { if ((t /= d / 2) < 1) { return c / 2 * t * t + b; } return c / 2 * ((t -= 2) * t * t + 2) + b; }


  function start() {
    toend = true;
  }

  function back() {
    toend = false;
  }

  function tilt(percent) {
    group.rotation.y = percent * 0.5;
  }

  function render() {

    var progress;

    animatestep = Math.max(0, Math.min(60, toend ? animatestep + 1 : animatestep - 4));
    acceleration = easing(animatestep, 0, 1, 60);

    if (acceleration > 0.35) {
      progress = (acceleration - 0.35) / 0.65;
      group.rotation.y = -Math.PI / 2 * progress;
      group.position.z = 50 * progress;
      progress = Math.max(0, (acceleration - 0.97) / 0.03);
      mesh.material.opacity = 1 - progress;
      mesh.scale.y = alloyLogo.scale.x = 1 - progress;

      ringcover.material.opacity = ring.material.opacity = progress;
      alloyLogo.material.opacity = ring.material.opacity = progress;
      alloyLogo.scale.y = alloyLogo.scale.x = 30 * progress;
      ring.scale.x = ring.scale.y = 4.0 * progress;
    }

    renderer.render(scene, camera);

  }

  function animate() {
    mesh.rotation.x += rotatevalue + acceleration;
    render();
    requestAnimationFrame(animate);
  }


  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvassize, canvassize);
  renderer.setClearColor("#fafafa");

  $wrap.appendChild(renderer.domElement);

  $body.addEventListener("mousedown", start, false);
  $body.addEventListener("touchstart", start, false);
  $body.addEventListener("mouseup", back, false);
  $body.addEventListener("touchend", back, false);

  animate();

}
window.onload = run;