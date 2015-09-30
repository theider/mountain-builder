/**
 * Created by theider on 9/29/15.
 */
require('angular');
var THREE = require('three');
// app.
function initApp() {
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(1024, 768);
  var canvasElement = document.getElementById('canvas-3d');
  canvasElement.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(
    35,             // Field of view
    1024 / 768,      // Aspect ratio
    0.1,            // Near plane
    10000           // Far plane
  );
  camera.position.set(-15, 10, 10);
  camera.lookAt(scene.position);

  var geometry = new THREE.BoxGeometry(3, 3, 3);
  var material = new THREE.MeshLambertMaterial({color: 0xFF4422});
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var light = new THREE.PointLight(0xFFFFCC);
  light.position.set(10, 0, 10);
  scene.add(light);

  renderer.setClearColor(0xeeeeee, 1);
  renderer.render(scene, camera);
};

window.onload = function() {
  initApp();
};



