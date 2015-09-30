/**
 * Created by theider on 9/29/15.
 */
var angular = require('angular');
var THREE = require('three');
// app.

var app = angular.module("TerrainGeneratorApp", []);

app.controller("TerrainAppController", function($scope) {
  $scope.message = "Hey!";

  $scope.generateButtonClick = function() {
    alert('Not working yet! Come back later...');
  };

  $scope.gridWidthPixels = 1000;
  $scope.gridHeightPixels = 1000;

  $scope.gridPointCount = 20;

  $scope.vectorText = function(p) {
    return '(' + p.x + ',' + p.y + ',' + p.z + ')';
  }

  $scope.generatePlaneObject = function() {
    if($scope.planeObject) {
      $scope.scene.remove($scope.planeObject);
    }

    console.log('generating new plane: widthPels=' + $scope.gridWidthPixels + ', heightPels=' + $scope.gridHeightPixels + ' gridPointCount=' + $scope.gridPointCount);
    var geometry = new THREE.Geometry();
    // create 4 corner points
    var p0 = new THREE.Vector3( -1 * $scope.gridWidthPixels,  0, -1 * $scope.gridHeightPixels );
    var p1 = new THREE.Vector3( -1 * $scope.gridWidthPixels,  0, +1 * $scope.gridHeightPixels );
    var p2 = new THREE.Vector3( +1 * $scope.gridWidthPixels,  0, +1 * $scope.gridHeightPixels );
    var p3 = new THREE.Vector3( +1 * $scope.gridWidthPixels,  0, -1 * $scope.gridHeightPixels );
    console.log(    ' p0:' + $scope.vectorText(p0)
                  + ' p1:' + $scope.vectorText(p1)
                  + ' p2:' + $scope.vectorText(p2)
                  + ' p3:' + $scope.vectorText(p3));
    var pointList = [];
    pointList.push(p0);
    pointList.push(p1);
    pointList.push(p2);
    pointList.push(p3);
    pointList.map(function(p) {
      geometry.vertices.push(p);
    });

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geometry.faces.push( new THREE.Face3( 3, 0, 2 ) );

    geometry.computeBoundingSphere();

    //var geometry = new THREE.BoxGeometry( 100, 100, 100 );

    //var material = new THREE.MeshLambertMaterial( {color: 0xAAAACC} );
    var material = new THREE.ShaderMaterial( {
      uniforms: {},
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
      derivatives: true
    } );
    var material = new THREE.MeshBasicMaterial( { wireframe: true } );
    var planeObject = new THREE.Mesh( geometry, material );
    $scope.scene.add( planeObject );
    $scope.renderer.render(scene, camera);
  };

  var CANVAS_WIDTH_PIXELS = 800;
  var CANVAS_HEIGHT_PIXELS = 600;
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  $scope.renderer = renderer;
  renderer.setSize(CANVAS_WIDTH_PIXELS, CANVAS_HEIGHT_PIXELS);
  var canvasElement = document.getElementById('canvas-3d');
  canvasElement.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  $scope.scene = scene;

  var camera = new THREE.PerspectiveCamera(
    35,             // Field of view
    CANVAS_WIDTH_PIXELS / CANVAS_HEIGHT_PIXELS,      // Aspect ratio
    0.1,            // Near plane
    10000           // Far plane
  );
  camera.position.set(0, (2 * $scope.gridWidthPixels) / 4, (-1 * $scope.gridWidthPixels) *2);
  var sceneCenter = scene.position;
  console.log('scene center=' + $scope.vectorText(sceneCenter));
  camera.lookAt(sceneCenter);

  //var light = new THREE.AmbientLight(0x999999);
  //scene.add(light);

  renderer.setClearColor(0x000000, 1);
  $scope.generatePlaneObject();

});



