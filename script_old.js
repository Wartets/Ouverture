let readyForPlacement = false;
let currentBackgroundImage = null;

const HUD = true;

const scene = document.getElementById('scene');

const activeLayer = document.querySelector(`#scene .scene-layer.${[...scene.classList].find(cls => cls.endsWith('True'))}`);

// Coordonnées réelles des images sources (en px)
const backgroundWidth = 1652;
const backgroundHeight = 951;

const doors = [
	{ id: 'doorInterior', x: 896, y: 495, w: 74, h: 98 },
	{ id: 'doorRoom', x: 1138, y: 237, w: 70, h: 130 },
	{ id: 'doorRoom2', x: 1357, y: 204, w: 70, h: 135 },
	{ id: 'doorRoom3', x: 1585, y: 540, w: 130, h: 255 },
	{ id: 'doorKitchen', x: 538, y: 510, w: 100, h: 300 },
	{ id: 'doorBathroom', x: 1100, y: 490, w: 35, h: 270 },
	{ id: 'doorBathroom2', x: 1018, y: 330, w: 130, h: 250 },
	{ id: 'doorbathroomMirror', x: 552, y: 490, w: 35, h: 270 },
	{ id: 'doorbathroomMirror2', x: 642, y: 330, w: 130, h: 250 },
	{ id: 'doorLivingroom', x: 1324, y: 480, w: 230, h: 240 },
	{ id: 'doorSun', x: 1235, y: 23, w: 95, h: 47 },
	{ id: 'doorStreet', x: 768, y: 285, w: 26, h: 26 },
	{ id: 'doorEarthBall', x: 826, y: 195, w: 25, h: 25 },
	{ id: 'doorEarthBall2', x: 359, y: 197, w: 150, h: 150 },
	{ id: 'doorEarthMap', x: 820, y: 430, w: 370, h: 370 },
	{ id: 'doorMoon', x: 1332, y: 256, w: 58, h: 58 }
];

const transitions = [
	{ id: 'doorInterior', from: 'street', to: 'interior' },
	{ id: 'doorRoom', from: 'interior', to: 'Room' },
	{ id: 'doorRoom2', from: 'interior', to: 'room2' },
	{ id: 'doorRoom3', from: 'interior', to: 'room3' },
	{ id: 'doorKitchen', from: 'interior', to: 'kitchen' },
	
	{ id: 'doorBathroom', from: 'Room', to: 'Bathroom' },
	{ id: 'doorBathroom2', from: 'bathroomMirror', to: 'Bathroom' },
	{ id: 'doorbathroomMirror', from: 'Roommirror', to: 'bathroomMirror' },
	{ id: 'doorbathroomMirror2', from: 'Bathroom', to: 'bathroomMirror' },
	
	{ id: 'doorLivingroom', from: 'interior', to: 'livingroom' },
	{ id: 'doorSun', from: 'street', to: 'sun' },
	{ id: 'doorEarthBall', from: 'sun', to: 'earthBall' },
	{ id: 'doorEarthBall2', from: 'moon', to: 'earthBall' },
	{ id: 'doorEarthMap', from: 'earthBall', to: 'earthMap' },
	{ id: 'doorStreet', from: 'earthMap', to: 'street' },
	{ id: 'doorMoon', from: 'earthBall', to: 'moon' },
	{ id: 'exit-interior', from: 'interior', to: 'street' },
	{ id: 'exit-Room', from: 'Room', to: 'interior' },
	{ id: 'exit-room2', from: 'room2', to: 'interior' },
	{ id: 'exit-room3', from: 'room3', to: 'interior' },
	{ id: 'exit-kitchen', from: 'kitchen', to: 'interior' },
	{ id: 'exit-Bathroom', from: 'Bathroom', to: 'Room' },
	{ id: 'exit-bathroomMirror', from: 'bathroomMirror', to: 'Roommirror' },
	{ id: 'exit-livingroom', from: 'livingroom', to: 'interior' },
	{ id: 'exit-sun', from: 'sun', to: 'solarSystem' },
	{ id: 'exit-solarSystem', from: 'solarSystem', to: 'galaxy' },
	{ id: 'exit-galaxy', from: 'galaxy', to: 'localGroup' },
	{ id: 'exit-localGroup', from: 'localGroup', to: 'supercluster' },
	{ id: 'exit-supercluster', from: 'supercluster', to: 'cosmicWeb' },
	{ id: 'exit-cosmicWeb', from: 'cosmicWeb', to: 'universe' }
];

function placeObject(object, objectWidth, objectHeight, objectCenterX, objectCenterY) {
	if (!currentBackgroundImage) return;
	let box = currentBackgroundImage.getBoundingClientRect();
	
	const windowRatio = window.innerWidth / window.innerHeight;
	const imageRatio = backgroundWidth / backgroundHeight;

	let displayedWidth, displayedHeight, offsetLeft, offsetTop;

	if (windowRatio > imageRatio) {
		displayedHeight = window.innerHeight;
		displayedWidth = backgroundWidth * (displayedHeight / backgroundHeight);
		offsetTop = 0;
		offsetLeft = (window.innerWidth - displayedWidth) / 2;
	} else {
		displayedWidth = window.innerWidth;
		displayedHeight = backgroundHeight * (displayedWidth / backgroundWidth);
		offsetLeft = 0;
		offsetTop = (window.innerHeight - displayedHeight) / 2;
	}

	const ratioX = displayedWidth / backgroundWidth;
	const ratioY = displayedHeight / backgroundHeight;

	object.style.left = `${offsetLeft + (objectCenterX - objectWidth / 2) * ratioX}px`;
	object.style.top = `${offsetTop + (objectCenterY - objectHeight / 2) * ratioY}px`;
	object.style.width = `${objectWidth * ratioX}px`;
	object.style.height = `${objectHeight * ratioY}px`;
}

function updatePlacement() {
	if (!readyForPlacement) return;
	
	doors.forEach(({ id, x, y, w, h }) => {
		const el = document.getElementById(id);
		placeObject(el, w, h, x, y);
	});
}

function updateActiveLayer() {
	const scene = document.getElementById('scene');
	const classTrue = [...scene.classList].find(cls => cls.endsWith('True'));
	if (!classTrue) return;

	const activeId = classTrue.slice(0, -4);

	document.querySelectorAll('.scene-layer').forEach(layer => {
		layer.classList.remove('active');
	});

	const activeLayer = document.getElementById(activeId);
	if (activeLayer) activeLayer.classList.add('active');
}

function getImageCoordinatesFromMouseEvent(event) {
	const windowRatio = window.innerWidth / window.innerHeight;
	const imageRatio = backgroundWidth / backgroundHeight;

	let displayedWidth, displayedHeight, offsetLeft, offsetTop;

	if (windowRatio > imageRatio) {
		displayedHeight = window.innerHeight;
		displayedWidth = backgroundWidth * (displayedHeight / backgroundHeight);
		offsetTop = 0;
		offsetLeft = (window.innerWidth - displayedWidth) / 2;
	} else {
		displayedWidth = window.innerWidth;
		displayedHeight = backgroundHeight * (displayedWidth / backgroundWidth);
		offsetLeft = 0;
		offsetTop = (window.innerHeight - displayedHeight) / 2;
	}

	const mouseX = event.clientX;
	const mouseY = event.clientY;

	if (
		mouseX < offsetLeft || mouseX > offsetLeft + displayedWidth ||
		mouseY < offsetTop || mouseY > offsetTop + displayedHeight
	) {
		return null;
	}

	const relativeX = (mouseX - offsetLeft) / displayedWidth;
	const relativeY = (mouseY - offsetTop) / displayedHeight;

	const imageX = Math.round(relativeX * backgroundWidth);
	const imageY = Math.round(relativeY * backgroundHeight);

	return { x: imageX, y: imageY };
}

document.addEventListener('DOMContentLoaded', () => {
	if (![...scene.classList].some(cls => cls.endsWith('True'))) {
		scene.classList.add('streetTrue');
	}

	const sceneLayers = document.querySelectorAll('.scene-layer');

	let imagesLoaded = 0;
	const totalImages = sceneLayers.length;

	sceneLayers.forEach(layer => {
		const id = layer.id;
		const img = document.createElement('img');
		img.id = `background-${id}`;
		img.src = `assets/${id}.png`;
		img.alt = `background of ${id}`;
		img.style.pointerEvents = 'none';
		img.onload = () => {
			if (scene.classList.contains(`${id}True`)) {
				currentBackgroundImage = img;
			}
			imagesLoaded++;
			if (imagesLoaded === totalImages) {
				readyForPlacement = true;
				updatePlacement();
			}
		};
		layer.insertBefore(img, layer.firstChild);
	});
	
	updateActiveLayer();
});

document.addEventListener('mousemove', (e) => {
	if (HUD) {
		const coords = getImageCoordinatesFromMouseEvent(e);
		if (coords) {
			document.getElementById('coordDisplay').textContent = `x: ${coords.x}, y: ${coords.y}`;
		} else {
			document.getElementById('coordDisplay').textContent = '';
		}
	}
});

window.addEventListener('resize', () => {
	if (readyForPlacement) updatePlacement();
});

transitions.forEach(({ id, from, to }) => {
	const el = document.getElementById(id);
	if (el) {
		el.addEventListener('click', () => {
			scene.classList.remove(`${from}True`);
			scene.classList.add(`${to}True`);
			updateActiveLayer();
			updatePlacement()
		});
	}
});
