(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _tools = require('./tools');

/* ------------------
  getImgData(); 
  Create temporary canvas to drawimage and retrive data.
*/
var getImgData = function getImgData(img) {
	var tempCanvas = document.createElement('canvas');
	var tempCtx = tempCanvas.getContext('2d');
	tempCanvas.width = img.width;
	tempCanvas.height = img.height;
	tempCtx.drawImage(img, 0, 0);
	return tempCtx.getImageData(0, 0, img.width, img.height);
};

var getBrightnessDataCalc = function getBrightnessDataCalc(width, imgData, x, y) {
	var index = (y * width + x) * 4;
	return imgData.data[index] + imgData.data[index + 1] + imgData.data[index + 2];
};

/* ------------------
  ImageMap()
  takes img and stores color and brightness data
*/
function ImageMap(img, constraints) {
	var imgData = getImgData(img);

	var _constraints = _slicedToArray(constraints, 2);

	var cw = _constraints[0];
	var ch = _constraints[1];

	var maxScale = 3;
	var scale = Math.min(cw / img.width, ch / img.height, maxScale);
	var getBrightnessData = (0, _tools.curry)(getBrightnessDataCalc, img.width, imgData);
	var pixelAmount = imgData.data.length / 4;

	return {
		width: img.width,
		height: img.width,
		scale: scale,
		getBrightnessData: getBrightnessData,
		pixelAmount: pixelAmount
	};
}

exports['default'] = ImageMap;
module.exports = exports['default'];

},{"./tools":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Loop = function Loop() {
	var lastTime = 0;
	var stopped = false;
	var callback = undefined;

	var start = function start(fn) {
		stopped = false;
		if (typeof fn !== "undefined") callback = fn;

		requestAnimationFrame(_frame);
	};

	var stop = function stop() {
		stopped = true;
	};

	var _frame = function _frame(time) {
		callback(time);
		if (!stopped) requestAnimationFrame(_frame);
	};

	return {
		start: start,
		stop: stop
	};
};

exports["default"] = Loop;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var drawCircle = function drawCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
};

function Particle(x, y, r) {
    var colors = arguments.length <= 3 || arguments[3] === undefined ? [0, 0, 0] : arguments[3];

    var pos = {
        x: x,
        y: y
    };
    var targetx = x;
    var targety = y;

    var vx = Math.random() * .05 + .025; // px/s
    var vy = Math.random() * .05 + .025; // px/s

    var isFast = true;
    var isDrifting = false;
    var fastMultiplier = 100;
    var radiusOrig = r;
    var radius = r;
    var z = r;
    var maxMouseDistance = 100;

    var driftDirX = (Math.random() - .5) * -r;
    var driftDirY = (Math.random() - .5) * -r;

    var alpha = 1;
    var color = "rgba(" + colors[0] + "," + colors[1] + "," + colors[2] + "," + alpha + ")";

    var lastUpdateTime = 0;

    var getPos = function getPos() {
        return Object.assign({}, pos, dimensions);
    };

    var changeTarget = function changeTarget(newTargetx, newTargety) {
        var newIsFast = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        targetx = newTargetx;
        targety = newTargety;
        isFast = newIsFast;
    };

    var toggleDrifting = function toggleDrifting() {
        isDrifting = !isDrifting;
    };

    var update = function update(t, target, cw, ch) {
        var time = (t - lastUpdateTime) / 1000; // in secs
        var distx = time * (vx * (isFast ? fastMultiplier : 1));
        var disty = time * (vy * (isFast ? fastMultiplier : 1));
        var newx = undefined;
        var newy = undefined;

        if (!isDrifting) {
            newx = x + distx * (targetx - x);
            newy = y + disty * (targety - y);
        } else {
            newx = x + driftDirX;
            newy = y + driftDirY;

            var mouseDifx = target.x - cw / 2;
            var mouseDify = target.y - ch / 2;

            newx -= mouseDifx * z * .0005;
            newy -= mouseDify * z * .0005;
        }

        // MUTATIONS
        x = newx;
        y = newy;
        lastUpdateTime = t;
    };

    var render = function render(ctx) {
        return drawCircle(ctx, x, y, radius, color);
    };

    return {
        getPos: Object.assign({}, pos),
        changeTarget: changeTarget,
        toggleDrifting: toggleDrifting,
        update: update,
        render: render
    };
}

exports["default"] = Particle;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var repeat = function repeat(simsNeeded, fn) {
	for (var i = simsNeeded - 1, x = 0; i >= 0; i--) {
		fn(simsNeeded, x);
		x++;
	};
};

var compose = function compose() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	return function (x) {
		return args.reduce(function (prev, cur) {
			return cur.call(cur, prev);
		}, x);
	};
};

var curry = function curry(fn) {
	for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		args[_key2 - 1] = arguments[_key2];
	}

	return function () {
		for (var _len3 = arguments.length, args2 = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args2[_key3] = arguments[_key3];
		}

		return fn.apply(undefined, args.concat(args2));
	};
};

exports.repeat = repeat;
exports.compose = compose;
exports.curry = curry;

},{}],5:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _appImageMap = require('./app/image-map');

var _appImageMap2 = _interopRequireDefault(_appImageMap);

var _appParticle = require('./app/particle');

var _appParticle2 = _interopRequireDefault(_appParticle);

var _appLoop = require('./app/loop');

var _appLoop2 = _interopRequireDefault(_appLoop);

var init = function init(img) {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var resolution = 2; // Resolution of samples. Smaller = more particles. Change this
	var loop = (0, _appLoop2['default'])();
	var cw = canvas.width = document.documentElement.clientWidth;
	var ch = canvas.height = document.documentElement.clientHeight;
	var MousePos = { x: cw / 2, y: ch / 2 };
	var hasChanged = false;
	var oldPositions = undefined;

	// Get mouse coords
	window.addEventListener('mousemove', function (e) {
		MousePos = {
			x: e.clientX || e.pageX,
			y: e.clientY || e.pageY
		};
	});

	var imgMap = (0, _appImageMap2['default'])(img, [cw, ch]);
	var particles = generateParticles(ctx, imgMap, resolution, cw, ch);

	canvas.addEventListener('click', function () {
		// oldPositions = hasChanged ? oldPositions : particles.map(particle => [particle.getPos.x, particle.getPos.y]);
		// particles.forEach((particle, i) => particle.changeTarget(hasChanged ? oldPositions[i][0] : Math.random() * cw, hasChanged ? oldPositions[i][1] : Math.random() * ch), true);
		particles.forEach(function (particle, i) {
			return particle.toggleDrifting();
		});
		hasChanged = !hasChanged;
	});

	loop.start(function (t) {
		ctx.clearRect(0, 0, cw, ch);

		particles.forEach(function (particle) {
			particle.render(ctx);
			particle.update(t, MousePos, cw, ch);
		});
	});
};

var generateParticles = function generateParticles(ctx, imgMap, resolution, cw, ch) {
	var particles = Array.from(Array(Math.floor(imgMap.pixelAmount / resolution))).reduce(function (newArray, item, i) {
		var ii = i * resolution;
		var maxBrightness = 255 * 3;
		var colors = [255, 255, 255];
		var x = ii % imgMap.width;
		var y = Math.floor(ii / imgMap.width);
		var r = (maxBrightness - imgMap.getBrightnessData(x, y)) / maxBrightness * .5;

		if (!r || y % resolution != 0) return newArray;

		// Scale radius
		r *= imgMap.width / resolution / 16;

		// Scale image
		x *= imgMap.scale;
		y *= imgMap.scale;

		// Center image
		x += cw / 2 - imgMap.width * imgMap.scale / 2;
		y += ch / 2 - imgMap.height * imgMap.scale / 2;

		var particle = (0, _appParticle2['default'])(x, y, r, colors);
		return newArray.concat([particle]);
	}, []);

	console.log(particles.length);

	return particles;
};

{
	(function () {
		var img = new Image();
		var imgURL = '/rossmcmillan/resources/img/test.jpg';

		img.src = imgURL;

		img.addEventListener('load', function () {
			init(img);
		});
	})();
}

},{"./app/image-map":1,"./app/loop":2,"./app/particle":3}]},{},[5])