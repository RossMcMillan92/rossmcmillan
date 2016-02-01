const repeat = (simsNeeded, fn) => {
	for (var i = simsNeeded - 1, x = 0; i >= 0; i--) {
		fn(simsNeeded, x);
		x++;
	};
}

const compose = (...args) => (x) => args.reduce((prev, cur) => cur.call(cur, prev), x);

const curry = (fn, ...args) => (...args2) => fn(...args, ...args2); 

const throttle = (fn, delay) => {
    let timeout;
    return (...args) => {
        timeout = timeout || setTimeout(() => {
            fn.apply(null, args);
            timeout = undefined;
        }, delay);
    };
}

export { repeat, compose, curry, throttle }