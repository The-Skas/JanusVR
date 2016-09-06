// When true, disable js effects
var toggle = true;
var onBoat = false;

var boatGoForward = false;
var boatRotateLeft = false;
var boatRotateRight = false;
var rotateBoatCounter = 0;
var boatSpeed = 0.004;
var boatTurnRate = 0.0005;

// River's borders 
var boatMinX = 5.8;
var boatMaxX = 13.20;
var boatMinZ = 65;
var boatMaxZ = -133;

var globalTime = 0.0;
room.walk_speed = 8.0;
room.run_speed = 10.0;

room.gravity = -18;
var isJump = false;


scheduler = false;