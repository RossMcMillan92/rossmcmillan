import ImageMap from './app/image-map';
import Particle from './app/particle';
import Loop from './app/loop';

const init = (img) => {
	const canvas      = document.getElementById('canvas'); 
	const ctx         = canvas.getContext("2d");                        
	const resolution  = 2; // Resolution of samples. Smaller = more particles. Change this
	const loop 		  = Loop();
	let cw            = canvas.width = document.documentElement.clientWidth;
	let ch            = canvas.height = document.documentElement.clientHeight;
	let MousePos      = {x: cw / 2, y: ch / 2};                        
	let hasChanged 	  = false;
	let oldPositions;

	// Get mouse coords
	window.addEventListener('mousemove', function(e){
	  MousePos = {
	    x: e.clientX || e.pageX,
	    y: e.clientY || e.pageY
	  }
	});
    
	const imgMap    = ImageMap(img, [cw, ch]);   
	const particles = generateParticles(ctx, imgMap, resolution, cw, ch);

	canvas.addEventListener('click', function(){
		// oldPositions = hasChanged ? oldPositions : particles.map(particle => [particle.getPos.x, particle.getPos.y]);
	    // particles.forEach((particle, i) => particle.changeTarget(hasChanged ? oldPositions[i][0] : Math.random() * cw, hasChanged ? oldPositions[i][1] : Math.random() * ch), true);
	    particles.forEach((particle, i) => particle.toggleDrifting());
		hasChanged = !hasChanged;
	});

	loop.start((t) => {
	    ctx.clearRect(0,0,cw,ch);

	    particles.forEach(particle => {
	        particle.render(ctx);
	        particle.update(t, MousePos, cw, ch);
	    });
	})
}

const generateParticles = (ctx, imgMap, resolution, cw, ch) => {
	const particles = Array.from(Array(Math.floor(imgMap.pixelAmount / resolution)))
		.reduce((newArray, item, i) => {
			const ii            = i * resolution;
			const maxBrightness = 255 * 3;
			const colors        = [255,255,255];
			let x               = ii%imgMap.width;
			let y               = Math.floor(ii/imgMap.width);
			let r               = ((maxBrightness - imgMap.getBrightnessData(x,y)) / maxBrightness) * .5;

			if(!r || y % resolution != 0) return newArray;

			// Scale radius
			r *= (imgMap.width / resolution) / 16;  

			// Scale image
			x *= imgMap.scale;
			y *= imgMap.scale;

			// Center image
			x += ((cw / 2) - ((imgMap.width * imgMap.scale) / 2));
			y += ((ch / 2) - ((imgMap.height * imgMap.scale) / 2));

			const particle = Particle(x,y,r,colors);
			return newArray.concat([particle]);
		}, []);

	console.log(particles.length)

	return particles;
}

{
	const img = new Image()
	const imgURL = '/rossmcmillan/resources/img/test.jpg';
	 
	img.src = imgURL;

	img.addEventListener('load', function(){
	  init(img);
	});
}
