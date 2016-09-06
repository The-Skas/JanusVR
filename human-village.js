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

//Stored as 1 second = 1000
var globalTime = 0.0;
room.walk_speed = 8.0;
room.run_speed = 10.0;

room.gravity = -18;



scheduler = false;

//###SCHEDULER
// Move Constants to js
if (typeof setTimeout == 'undefined') {
  setTimeout = function (fn, delay) {
    if (scheduler == false) scheduler = [];
    var now = new Date().getTime();
    if (scheduler.length == 0) {
      scheduler.push({timeStamp: now, delay: delay, fn: fn});
    } else {
      for (var i = 0; i < scheduler.length; i++) {
        var remaining = now - scheduler[i].timeStamp + scheduler[i].delay;
        if (remaining > delay) {
          scheduler.splice(i, 0, {timeStamp: now, delay: delay, fn: fn});
          break;
        }
      }
    }
  }

  executeScheduler = function() {
    var now = new Date().getTime();
    for (var i = 0; i < scheduler.length; i++) {
      var remaining = now - scheduler[i].timeStamp + scheduler[i].delay;
      if (remaining >= 0) {
        scheduler[i].fn.call(this);
      } else {
        scheduler.splice(0,i);
        break;
      }
    }
  }
}

//###################
//####HELPER FUNCTIONS:
//##############
var random = function(a) {

	if(Object.prototype.toString.call( a ) === '[object Array]' ){
		index = Math.floor(Math.random()*a.length);

	}
}


room.onLoad = function() {
	room.playSound("walk1");
	//Player setup
	player.vel = {};
	player.vel.x = 0.0;
	player.vel.y = 0.0;
	player.vel.z = 0.0;
};

room.update = function(delta_time) {
	globalTime += delta_time;
	executeScheduler();
	if (toggle) {
		mystiaEffects();
		boatEffects();
		playerUpdate(delta_time);
		if (onBoat) {
			boatControls(delta_time);
		}
	}
};

var boatControls = function(delta_time) {
	jsId = "boat";
	
	// Prevent to go out of the river (kinda)
	if (player.pos.x < boatMinX) {
		room.objects[jsId].pos.x = boatMinX;
	}
	if (player.pos.x > boatMaxX) {
		room.objects[jsId].pos.x = boatMaxX;
	}
	if (player.pos.z > boatMinZ) {
		room.objects[jsId].pos.z = boatMinZ;
	}
	if (player.pos.z < boatMaxZ) {
		room.objects[jsId].pos.z = boatMaxZ;
	}
	
	// Make the boat going forward when holding W
	if (boatGoForward) {
		var vel = (delta_time*boatSpeed);
		
		room.objects[jsId].pos.z += vel * room.objects[jsId].fwd.x;
		room.objects[jsId].pos.x -= vel * room.objects[jsId].fwd.z;
	}

	// Rotate the boat when holding A or D
	if (boatRotateLeft) {
		rotateBoatCounter += delta_time;
		rotateObject(jsId, rotateBoatCounter*boatTurnRate);
	} else if (boatRotateRight) {
		rotateBoatCounter -= delta_time;
		rotateObject(jsId, rotateBoatCounter*boatTurnRate);
	}
	
	// Stay fixed on the boat (also prevent teleporting)
	player.pos.x = room.objects[jsId].pos.x;
	player.pos.y = room.objects[jsId].pos.y;
	player.pos.z = room.objects[jsId].pos.z;
};

var mystiaEffects = function() {
	var name = "mystia";
	
	float(name+"-name", 2, 0.7);
	float(name+"-object", 0, 0.7);
	
	lookAtPlayer(name+"-name");
	lookAtPlayerByDistance(name+"-object");
	
	
};

var boatEffects = function() {
	float("boat", -1.85, 0.5);
};


///// Utils /////

/**
 * Make an object seems to float.
 */
var float = function(jsId, offset, multiplier) {
	var calc = (Math.sin(globalTime/1000)/5 + 0.5) * multiplier;
	
	room.objects[jsId].pos.y = calc + offset;
};

/**
 * Rotate an object.
 * @param jsId: Object's js_id
 * @param time: An incrementing counter, can be globalTime
 *				A negative value rotate clockwise, a negative one anticlockwise
 */
var rotateObject = function(jsId, time) {	
	room.objects[jsId].xdir.x = room.objects[jsId].zdir.z = Math.sin(time);
	room.objects[jsId].zdir.x = (room.objects[jsId].xdir.z = Math.cos(time)) * -1;
};

/**
Same as lookAtPlayer, but with a distance test.
The object will stop looking at player when too far.
It's less creppy :s
*/
var lookAtPlayerByDistance = function(jsId) {
	var dist = distance(player.pos, room.objects[jsId].pos)
	
	if (dist < 1.5) {
		var x = player.pos.x - room.objects[jsId].pos.x;
		var z = player.pos.z - room.objects[jsId].pos.z;
		
		room.objects[jsId].fwd = Vector(x,0,z);
	}
};

/**
Make an object looking at the player.
*/
var lookAtPlayer = function(jsId) {
	var x = player.pos.x - room.objects[jsId].pos.x;
	var z = player.pos.z - room.objects[jsId].pos.z;
	
	room.objects[jsId].fwd = Vector(x,0,z);
}

// Here where it will get messy.
// A better variable heirarchal composition is needed.
var isJump = false;
var isWalking = false;
var previous_play_t = 0;

var playerUpdate = function(delta_time){
	//Decreases upwards velocity over time
	player.vel.y *= 0.96;

	//Prevents the bounciness
	if (player.vel.y <= 0.0001) {
		player.vel.y = 0;
	}

	if(isJump) {
		player.vel.y = 0.025;
		isJump = false;
	}

	player.pos.y += player.vel.y * delta_time;

	//N

	if(isWalking) {
		if((globalTime - previous_play_t) > 200) {
			room.playSound(random(["walk1","walk3","walk4","walk5"]));
			//room.playSound("walk1")
			previous_play_t = globalTime ;
		}
	}

}

///// Events /////
function rec() {
		setTimeout(function(){
			room.playSound("walk1");
			rec();
		}, 600);
};


room.onKeyDown = function(event)
{
	// Toggle JS
	if(event.keyCode == "Q") {
		player.pos.y -= 10;
	}
	if (event.keyCode == 'J') {
		toggle = !toggle;
		print("Toggle JS: now " + toggle);
	}
	
	// Use or leave the boat
	if (event.keyCode == 'B') {
		var dist = distancfe(player.pos, room.objects["boat"].pos);

		if (dist < 2) {
			onBoat = !onBoat;
		}
		
		if (onBoat) {
			print("You're on the boat (W: move forward; A/D: turn left/right; B: leave)");
		}
	}
	
	//Prevent
	if(event.keyCode == " ")
	{
		event.preventDefault();
		isJump = true;
		print("You pressed space");
	}

	
	if(event.keyCode == 'W') {
		isWalking = true;
		print(globalTime);
		//Feel like using last_tick is a bad solution.
		
	}


	if (onBoat) {
		// Forward
		if (event.keyCode == 'W') {
			event.preventDefault();
			
			boatGoForward = true;
		}
		
		// Rotate left
		if (event.keyCode == 'A') {
			event.preventDefault();
			
			boatRotateLeft = true;
		}
		
		// Rorate right
		if (event.keyCode == 'D') {
			event.preventDefault();
			
			boatRotateRight = true;
		}
	}

	//exit()

}

room.onKeyUp = function(event)
{	
	if (event.keyCode == 'W'){
		isWalking = false;
	}
}