/**
 * Created by theider on 9/29/15.
 */

var angular = require('angular');
var THREE = require('three');
// app.

var app = angular.module("TerrainGeneratorApp", []);

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

var ELEV_DESCENDING = -1;
var ELEV_IDLE = 0;
var ELEV_ASCENDING = +1;

app.controller("TerrainAppController", function($scope) {

  $scope.cameraAngle = 20;
  $scope.targetCameraAngle = $scope.cameraAngle;
  $scope.elevationState = ELEV_IDLE;

  var startTime = new Date();
  $scope.lastFrameTimeMs = startTime.getTime();

  $scope.planeSpin = 0;

  $scope.spinMinusButtonClick = function() {
    $scope.planeSpin = -1;
  };

  $scope.spinNullButtonClick = function() {
    $scope.planeSpin = 0;
  };

  $scope.spinPlusButtonClick = function() {
    $scope.planeSpin = +1;
  };

  $scope.elevationMinusButtonClick = function() {
    if( ($scope.cameraAngle > 0) && ($scope.elevationState === ELEV_IDLE) ) {
      $scope.targetCameraAngle -= ($scope.targetCameraAngle % 10);
      $scope.targetCameraAngle -= 10;
      console.log('target camera angle ' + $scope.targetCameraAngle);
      $scope.elevationState = ELEV_DESCENDING;
    }
  }

  $scope.elevationNullButtonClick = function() {
    $scope.elevationState = ELEV_IDLE;
  }

  $scope.elevationPlusButtonClick = function() {
    if( ($scope.cameraAngle < 90) && ($scope.elevationState === ELEV_IDLE) ) {
      $scope.targetCameraAngle -= ($scope.targetCameraAngle % 10);
      $scope.targetCameraAngle += 10;
      console.log('target camera angle ' + $scope.targetCameraAngle);
      $scope.elevationState = ELEV_ASCENDING;
    }
  }

  $scope.animate = function() {
    var frameTime = new Date();
    var frameIntervalMs = frameTime.getTime() - $scope.lastFrameTimeMs;
    $scope.lastFrameTimeMs = frameTime.getTime();
    // rotate plane depending on planeSpin
    // rotation is pi/2 radians per second
    var angle = (frameIntervalMs * (Math.PI/2)) / 1000;
    $scope.planeObject.rotation.y += ($scope.planeSpin * angle);
    //$scope.planeObject.rotation.z += 0.01;
    requestAnimationFrame( $scope.animate );
    $scope.renderer.render($scope.scene, $scope.camera);
    if($scope.elevationState === ELEV_DESCENDING) {
      if(($scope.cameraAngle - angle) >= $scope.targetCameraAngle) {
        $scope.cameraAngle -= Math.degrees(angle);
        $scope.pointCamera();
      } else {
        $scope.elevationState = ELEV_IDLE;
      }
    } else if($scope.elevationState === ELEV_ASCENDING) {
      if(($scope.cameraAngle - angle) <= $scope.targetCameraAngle) {
        $scope.cameraAngle += Math.degrees(angle);
        $scope.pointCamera();
      } else {
        $scope.elevationState = ELEV_IDLE;
        $scope.pointCamera();
      }
    }
  };


  $scope.generateButtonClick = function() {
    $scope.generatePlaneObject();
  };

  $scope.gridWidthPixels = 1000;
  $scope.gridHeightPixels = 1000;

  $scope.gridIndex = 2;

  $scope.gridIndexes = [2,3,4,5,6,7,8,9];

  $scope.onGridIndexChanged = function() {
    console.log($scope.gridIndex);
  }

  $scope.vectorText = function(p) {
    return '(' + p.x + ',' + p.y + ',' + p.z + ')';
  }

  $scope.pointCamera = function() {
    var R = $scope.gridWidthPixels * 2;
    var y = R * Math.sin(Math.radians($scope.cameraAngle));
    var z = R * Math.cos(Math.radians($scope.cameraAngle));
    $scope.camera.position.set(0, y, -1 * z);
    var sceneCenter = $scope.scene.position;
    $scope.camera.lookAt(sceneCenter);
  }

  $scope.generatePlaneObject = function() {
    if($scope.planeObject !== undefined) {
      console.log('removed old object');
      $scope.scene.remove($scope.planeObject);
    }

    console.log('generating new plane: widthPels=' + $scope.gridWidthPixels + ', heightPels=' + $scope.gridHeightPixels + ' gridPointCount=' + $scope.gridPointCount);
    var geometry = new THREE.Geometry();
    console.log('gridindex = ' + $scope.gridIndex);
    var gc = Math.pow(2,$scope.gridIndex); // factor = 1 (2^1+1=3)
    console.log('gc=' + gc);
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
      }
    }
    // do terrain fractal calc

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

    //var geometry = new THREE.BoxGeometry( 200, 200, 200 );

    //var material = new THREE.MeshLambertMaterial( {color: 0xAAAACC} );
    //var material = new THREE.MeshLambertMaterial( { color: 0xffaa00 } );
    var material = new THREE.MeshBasicMaterial( { wireframe: true } );
    var planeObject = new THREE.Mesh( geometry, material );
    $scope.planeObject = planeObject;
    $scope.scene.add( planeObject );

    $scope.pointCamera();
  };

  var CANVAS_WIDTH_PIXELS = 800;
  var CANVAS_HEIGHT_PIXELS = 600;
  var renderer = new THREE.WebGLRenderer();
  $scope.renderer = renderer;
  renderer.setSize(CANVAS_WIDTH_PIXELS, CANVAS_HEIGHT_PIXELS);
  var canvasElement = document.getElementById('canvas-3d');
  canvasElement.appendChild(renderer.domElement);

  $scope.scene = new THREE.Scene();

  $scope.camera = new THREE.PerspectiveCamera(
    35,             // Field of view
    CANVAS_WIDTH_PIXELS / CANVAS_HEIGHT_PIXELS,      // Aspect ratio
    0.1,            // Near plane
    10000           // Far plane
  );

  $scope.pointCamera();

  var light = new THREE.AmbientLight(0x999999);
  $scope.scene.add(light);

  var plight = new THREE.PointLight(0x666666);
  plight.position.set(100, 500, 100);
  $scope.scene.add(plight);

  //$scope.renderer.setClearColor(0x000000, 1);
  $scope.generatePlaneObject();

  $scope.animate();

});



