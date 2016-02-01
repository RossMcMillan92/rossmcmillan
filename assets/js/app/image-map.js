import { curry } from './tools';

/* ------------------
  getImgData(); 
  Create temporary canvas to drawimage and retrive data.
*/
const getImgData = img => {
	const tempCanvas = document.createElement('canvas');
	const tempCtx = tempCanvas.getContext('2d');
	tempCanvas.width = img.width;
	tempCanvas.height = img.height;
	tempCtx.drawImage(img, 0, 0);
	return tempCtx.getImageData(0, 0, img.width, img.height);
}

const getBrightnessDataCalc = function(width, imgData, x, y){
	const index = ((y * width) + x) * 4;
	return imgData.data[index] + imgData.data[index + 1] + imgData.data[index + 2];
}

/* ------------------
  ImageMap()
  takes img and stores color and brightness data
*/
function ImageMap(img, constraints){
	const imgData = getImgData(img);
	const [cw, ch] = constraints;
	const maxScale = 4;
	const scale = Math.min(cw / img.width, ch / img.height, maxScale);
	const getBrightnessData = curry(getBrightnessDataCalc, img.width, imgData);
	const pixelAmount = imgData.data.length / 4;

	return {
		width: img.width,
		height: img.width,
		scale,
		getBrightnessData,
		pixelAmount,
	};
}

export default ImageMap;