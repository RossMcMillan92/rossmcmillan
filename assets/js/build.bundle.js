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

	var maxScale = 4;
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

},{"./tools":5}],2:[function(require,module,exports){
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
    ctx.arc(x, y, Math.max(0, radius), 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
};

function Particle(x, y, r) {
    var pos = {
        x: x,
        y: y
    };
    var targetx = x;
    var targety = y;
    var targetr = r;
    var radiusOrig = r;

    var velMultiplier = 100;
    var vx = (Math.random() * .05 + .025) * velMultiplier; // px/s
    var vy = (Math.random() * .05 + .025) * velMultiplier; // px/s
    var vr = (Math.random() * .05 + .025) * velMultiplier; // px/s

    var isDrifting = false;
    var z = r;

    var driftDirx = (Math.random() - .5) * -r;
    var driftDiry = (Math.random() - .5) * -r;
    var driftDirr = Math.random() * .1;

    var alpha = 1;
    var color = "rgb(255,255,255)";

    var lastUpdateTime = 0;

    var getPos = function getPos() {
        return Object.assign({}, pos, dimensions);
    };

    var changeTarget = function changeTarget(newTargetx, newTargety, newTargetr) {
        targetx = newTargetx;
        targety = newTargety;
        targetr = newTargetr;
    };

    var toggleDrifting = function toggleDrifting() {
        isDrifting = !isDrifting;
    };

    var update = function update(t, target, cw, ch) {
        var time = (t - lastUpdateTime) / 1000; // in secs
        var distx = time * vx;
        var disty = time * vy;
        var distr = time * vr;

        // Move to new targets
        var newx = x + distx * (targetx - x);
        var newy = y + disty * (targety - y);
        var newr = r + distr * (targetr - r);

        if (isDrifting) {
            newx = x + driftDirx;
            newy = y + driftDiry;
            newr = r + driftDirr;

            var mouseDifx = target.x - cw / 2;
            var mouseDify = target.y - ch / 2;

            newx -= mouseDifx * z * .0005;
            newy -= mouseDify * z * .0005;

            // Make sure radius stays within range
            if (newr <= 0 || newr >= radiusOrig) {
                newr = Math.min(radiusOrig, Math.max(0, newr));
                driftDirr *= -1;
            }
        }

        // MUTATIONS
        x = newx;
        y = newy;
        r = newr;
        lastUpdateTime = t;
    };

    var render = function render(ctx) {
        return drawCircle(ctx, x, y, r, color);
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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var generateParticlesData = function generateParticlesData(imgMap, resolution, cw, ch, scaleMul) {
			var particlesData = Array.from(Array(Math.floor(imgMap.pixelAmount / resolution))).reduce(function (newArray, item, i) {
						var ii = i * resolution;
						var maxBrightness = 255 * 3;
						var x = ii % imgMap.width;
						var y = Math.floor(ii / imgMap.width);
						var r = (maxBrightness - imgMap.getBrightnessData(x, y)) / maxBrightness * .75;

						if (!r || y % resolution != 0) return newArray;

						// Scale radius
						r *= imgMap.width / resolution * scaleMul;

						// Scale image
						x *= imgMap.scale;
						y *= imgMap.scale;

						// Center image
						x += cw / 2 - imgMap.width * imgMap.scale / 2;
						y += ch / 2 - imgMap.height * imgMap.scale / 2;

						newArray.push([x, y, r]);
						return newArray;
			}, []);

			return particlesData;
};

// arrange particles with given data from image
var arrangeParticles = function arrangeParticles(particles, particleData, cw, ch) {
			particles.forEach(function (particle, i) {
						// if there's more particles than images, give the particles random coordinates
						var particleD = typeof particleData[i] !== "undefined" ? particleData[i] : [Math.random() * cw, Math.random() * ch, 0];
						particle.changeTarget.apply(particle, _toConsumableArray(particleD));
			});
};

exports.generateParticlesData = generateParticlesData;
exports.arrangeParticles = arrangeParticles;

},{}],5:[function(require,module,exports){
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

var throttle = function throttle(fn, delay) {
    var timeout = undefined;
    return function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
        }

        timeout = timeout || setTimeout(function () {
            fn.apply(null, args);
            timeout = undefined;
        }, delay);
    };
};

exports.repeat = repeat;
exports.compose = compose;
exports.curry = curry;
exports.throttle = throttle;

},{}],6:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _appImageMap = require('./app/image-map');

var _appImageMap2 = _interopRequireDefault(_appImageMap);

var _appParticle = require('./app/particle');

var _appParticle2 = _interopRequireDefault(_appParticle);

var _appLoop = require('./app/loop');

var _appLoop2 = _interopRequireDefault(_appLoop);

var _appParticles = require('./app/particles');

var _appTools = require('./app/tools');

var init = function init(images) {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var resolution = 2; // Resolution of samples. Smaller = more particles. Change this
	var loop = (0, _appLoop2['default'])();
	var cw = canvas.width = document.documentElement.clientWidth;
	var ch = canvas.height = document.documentElement.clientHeight;
	var scaleMul = cw < 550 ? .03125 : .0625;
	var particleN = 850;
	var MousePos = { x: cw / 2, y: ch / 2 };

	// Get mouse coords
	window.addEventListener('mousemove', function (e) {
		MousePos = {
			x: e.clientX || e.pageX,
			y: e.clientY || e.pageY
		};
	});

	var imgMaps = images.map(function (img) {
		return (0, _appImageMap2['default'])(img, [cw, ch]);
	});
	var particlesData = imgMaps.map(function (imgMap) {
		return (0, _appParticles.generateParticlesData)(imgMap, resolution, cw, ch, scaleMul);
	});

	// Initiate particles with first imgMap
	var particles = Array.from(Array(particleN)).map(function (d, i) {
		var particleD = typeof particlesData[0][i] !== "undefined" ? particlesData[0][i] : [0, 0, 0];
		return _appParticle2['default'].apply(undefined, _toConsumableArray(particleD));
	});

	// Loop through different imgMaps
	var arrangementNumber = 1;
	(function timeArrangement() {
		setTimeout(function () {
			(0, _appParticles.arrangeParticles)(particles, particlesData[arrangementNumber], cw, ch);
			arrangementNumber = arrangementNumber + 1 > particlesData.length - 1 ? 0 : arrangementNumber + 1;
			timeArrangement();
		}, 3000);
	})();

	// Make the particles drift on click
	canvas.addEventListener('click', function () {
		return particles.forEach(function (particle, i) {
			return particle.toggleDrifting();
		});
	});

	loop.start(function (t) {
		ctx.clearRect(0, 0, cw, ch);

		particles.forEach(function (particle) {
			particle.render(ctx);
			particle.update(t, MousePos, cw, ch);
		});
	});
};

/*
 * Load all the images before starting init();
 */
{
	(function () {
		var imgUrls = ['assets/img/text--ross.jpg', 'assets/img/text--front-end-developer.jpg', 'assets/img/text--heart.jpg'];

		var loadImage = function loadImage(imgUrl) {
			var img = new Image();
			img.src = imgUrl;
			img.addEventListener('load', function () {
				isFinished();
			});

			return img;
		};

		var images = imgUrls.map(loadImage);
		var count = 0;
		var isFinished = function isFinished() {
			count++;
			if (count === imgUrls.length) {
				init(images);
				window.addEventListener('resize', (0, _appTools.throttle)(function () {
					return init(images);
				}, 100));
			}
		};
	})();
}

},{"./app/image-map":1,"./app/loop":2,"./app/particle":3,"./app/particles":4,"./app/tools":5}]},{},[6])