/**
 * @author Lane Kolbly
 */

THREE.LeapControls = function(object, domElement) {
    var _this = this;
    //this.lastPalmNormal = null;

    var changeEvent = { type: 'change' };

    object.lookAt( {x: 0, y: 0, z: 0} );

    _this.crossProduct = function(a, b) {
	return [
	    a[1]*b[2] - a[2]*b[1],
	    a[2]*b[0] - a[0]*b[2],
	    a[0]*b[1] - a[1]*b[0]
	];
    };

    _this.dotProduct = function(a, b) {
	return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    };

    _this.len = function(v) {
	return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    };

    _this.normalize = function(a) {
	var l = _this.len(a);
	return [a[0] / l, a[1] / l, a[2] / l];
    };

    Leap.loop(function(frame) {
	//console.log(frame);

	// For now we'll have just a flying-space-ship model...

	if (frame.hands.length === 0) {
	    return;
	}

	// Rotate...
	var cross = _this.crossProduct([0,1,0], frame.hands[0].palmNormal);
	//console.log(cross);
	//console.log(frame.hands[0].palmPosition[1]);

	//object.translateZ(-500);
	var l = _this.len(cross) / 100;
	cross = _this.normalize(cross);
	var v = {x: cross[0], y: cross[1], z: cross[2]};
	object.rotateOnAxis(v, -l);
	//object.translateZ(500);

	// Rotate around Y...
	var v = {x: 0, y: 1, z: 0};
	var amt = _this.dotProduct(frame.hands[0].direction, [-1,0,0]);
	console.log(amt);
	object.rotateOnAxis(v, amt*0.03);

	// Translation...
	var pos = frame.hands[0].palmPosition;
	pos[1] = pos[1] - 200.0; // Center for Y (up/down)
	var scale = 0.01;
	pos[0] = pos[0] * scale;
	pos[1] = pos[1] * scale;
	pos[2] = pos[2] * scale;
	object.translateX(pos[0]);
	object.translateY(pos[1]);
	object.translateZ(pos[2]);

	_this.dispatchEvent( changeEvent );
    });

    _this.update = function() {
    }
};

THREE.LeapControls.prototype = Object.create( THREE.EventDispatcher.prototype );
