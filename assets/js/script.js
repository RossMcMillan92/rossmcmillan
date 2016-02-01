import ImageMap 				 	from './app/image-map';
import Particle 					from './app/particle';
import Loop 						from './app/loop';
import { generateParticlesData } 	from './app/particles'
import { throttle } 				from './app/tools';

const init = (images) => {
	const canvas      = document.getElementById('canvas'); 
	const ctx         = canvas.getContext("2d");                        
	const resolution  = 2; // Resolution of samples. Smaller = more particles. Change this
	const loop 		  = Loop();
	let cw            = canvas.width = document.documentElement.clientWidth;
	let ch            = canvas.height = document.documentElement.clientHeight;
	const scaleMul	  = cw < 550 ? .03125 : .0625;
	const particleN   = 850;
	let MousePos      = {x: cw / 2, y: ch / 2};                        

	// Get mouse coords
	window.addEventListener('mousemove', function(e){
	  MousePos = {
	    x: e.clientX || e.pageX,
	    y: e.clientY || e.pageY
	  }
	});
    
	const imgMaps       = images.map(img => ImageMap(img, [cw, ch]));   
	const particlesData = imgMaps.map(imgMap => generateParticlesData(imgMap, resolution, cw, ch, scaleMul));

	let particles = Array.from(Array(particleN)).map((d, i) => {
    	const particleD = typeof particlesData[0][i] !== "undefined" ? particlesData[0][i] : [0,0,0];
		return Particle(...particleD);
	});

	// arrange particles with given data from image
	const arrangeParticles = particleData => {
	    particles.forEach((particle, i) => {
	    	// if there's more particles than images, give the particles random coordinates
	    	const particleD = typeof particleData[i] !== "undefined" ? particleData[i] : [Math.random() * cw, Math.random() * ch, 0];
	    	particle.changeTarget(...particleD)
	    });
	}

	let arrangementNumber = 1;
	(function timeArrangement() {
		setTimeout(() => {
			arrangeParticles(particlesData[arrangementNumber]);
			arrangementNumber = arrangementNumber + 1 > particlesData.length - 1 ? 0 : arrangementNumber + 1;
		    timeArrangement();
		}, 3000);
	})();


	// Make the particles drift on click
	canvas.addEventListener('click', () => particles.forEach((particle, i) => particle.toggleDrifting()));

	loop.start((t) => {
	    ctx.clearRect(0,0,cw,ch);

	    particles.forEach(particle => {
	        particle.render(ctx);
	        particle.update(t, MousePos, cw, ch);
	    });
	})
}

/*
 * Load all the images before starting init();
 */
{
	const imgUrls = [ 
		'assets/img/text--ross.jpg',
		'assets/img/text--front-end-developer.jpg',
		'assets/img/text--heart.jpg',
	];

	const loadImage = (imgUrl) => {
		const img = new Image();
		img.src = imgUrl;
		img.addEventListener('load', function(){
		  isFinished();
		});

		return img
	}

	const images = imgUrls.map(loadImage);
	let count = 0;
	const isFinished = () => {
		count++;
		if(count === imgUrls.length) {
			init(images);
			window.addEventListener('resize', throttle(() => init(images), 100));
		}
	}

}
