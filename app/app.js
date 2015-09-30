/**
 * Created by theider on 9/29/15.
 */
require('angular');
var THREE = require('three');
// app.
function initApp() {
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 600);
  var canvasElement = document.getElementById('canvas-3d');
  canvasElement.appendChild(renderer.domElement);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(
    35,             // Field of view
    800 / 600,      // Aspect ratio
    0.1,            // Near plane
    10000           // Far plane
  );
  camera.position.set(-15, 10, 10);
  camera.lookAt(scene.position);

  var geometry = new THREE.BoxGeometry(5, 5, 5);
  var material = new THREE.MeshLambertMaterial({color: 0xFF0000});
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  var light = new THREE.PointLight(0xFFFF00);
  light.position.set(10, 0, 10);
  scene.add(light);

  renderer.setClearColor(0xdddddd, 1);
  renderer.render(scene, camera);
};

window.onload = function() {
  initApp();
};



