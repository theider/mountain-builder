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
    var gc = 4; // factor = 1 (2^1+1=3)
    var points = new Array();
    var deltaX = $scope.gridWidthPixels / (gc-1);
    var deltaZ = $scope.gridHeightPixels / (gc-1);
    for(var x = 0; x < gc; x++) {
      points[x] = new Array();
      for(var z = 0; z < gc; z++) {
        var xp = (-1 * ($scope.gridWidthPixels/2)) + (deltaX * x);
        var zp = (-1 * ($scope.gridHeightPixels/2)) + (deltaZ * z);
        var p0 = new THREE.Vector3( xp, 0, zp);
        points[x][z] = p0;
        //geometry.vertices.push(p0);
        console.log(x + ':' + z + ' p=' + $scope.vectorText(p0));
      }
    }
    // render faces
    var i=0;
    for(var x = 0; x < (gc-1); x++) {
      for (var z = 0; z < (gc-1); z++) {
        // get the square
        var p0 = points[x][z];
        var p1 = points[x+1][z];
        var p2 = points[x+1][z+1];
        var p3 = points[x][z+1];
        geometry.vertices.push(p0);
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);
        geometry.vertices.push(p3);
        geometry.faces.push( new THREE.Face3( i + 0, i + 1, i + 2 ) );
        geometry.faces.push( new THREE.Face3( i + 3, i + 0, i + 2 ) );
        i += 4;
      }
    }

    geometry.computeBoundingSphere();

    //var geometry = new THREE.BoxGeometry( 100, 100, 100 );

    //var material = new THREE.MeshLambertMaterial( {color: 0xAAAACC} );
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
  camera.position.set(0, (2 * $scope.gridWidthPixels) / 4, (-1 * $scope.gridWidthPixels) * 2);
  var sceneCenter = scene.position;
  console.log('scene center=' + $scope.vectorText(sceneCenter));
  camera.lookAt(sceneCenter);

  //var light = new THREE.AmbientLight(0x999999);
  //scene.add(light);

  renderer.setClearColor(0x000000, 1);
  $scope.generatePlaneObject();

});



