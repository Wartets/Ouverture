let readyForPlacement = false;
let currentBackgroundImage = null;
let resizeTimeout = null;

const scene = document.getElementById('scene');

// Actual sizes of backgrounds (en px)
const backgroundWidth = 1652;
const backgroundHeight = 951;

const doorsMap = new Map([
	['doorInterior', { x: 896, y: 495, w: 74, h: 98 }],
	['doorRoom', { x: 1138, y: 237, w: 70, h: 130 }],
	['doorRoom2', { x: 1357, y: 204, w: 70, h: 135 }],
	['doorRoom3', { x: 1585, y: 540, w: 130, h: 255 }],
	['doorKitchen', { x: 538, y: 510, w: 100, h: 300 }],
	['doorBathroom', { x: 1100, y: 490, w: 35, h: 270 }],
	['doorBathroom2', { x: 1018, y: 330, w: 130, h: 250 }],
	['doorbathroomMirror', { x: 552, y: 490, w: 35, h: 270 }],
	['doorbathroomMirror2', { x: 642, y: 330, w: 130, h: 250 }],
	['doorLivingroom', { x: 1324, y: 480, w: 230, h: 240 }],
	['doorSun', { x: 1235, y: 23, w: 95, h: 47 }],
	['doorStreet', { x: 768, y: 285, w: 26, h: 26 }],
	['doorEarthBall', { x: 826, y: 195, w: 25, h: 25 }],
	['doorEarthBall2', { x: 359, y: 197, w: 150, h: 150 }],
	['doorEarthMap', { x: 820, y: 430, w: 370, h: 370 }],
	['doorMoon', { x: 1332, y: 256, w: 58, h: 58 }],
]);

const transitionsMap = new Map([
	['doorInterior', { from: 'street', to: 'interior' }],
	['doorRoom', { from: 'interior', to: 'Room' }],
	['doorRoom2', { from: 'interior', to: 'room2' }],
	['doorRoom3', { from: 'interior', to: 'room3' }],
	['doorKitchen', { from: 'interior', to: 'kitchen' }],
	['doorBathroom', { from: 'Room', to: 'Bathroom' }],
	['doorBathroom2', { from: 'bathroomMirror', to: 'Bathroom' }],
	['doorbathroomMirror', { from: 'Roommirror', to: 'bathroomMirror' }],
	['doorbathroomMirror2', { from: 'Bathroom', to: 'bathroomMirror' }],
	['doorLivingroom', { from: 'interior', to: 'livingroom' }],
	['doorSun', { from: 'street', to: 'sun' }],
	['doorEarthBall', { from: 'sun', to: 'earthBall' }],
	['doorEarthBall2', { from: 'moon', to: 'earthBall' }],
	['doorEarthMap', { from: 'earthBall', to: 'earthMap' }],
	['doorStreet', { from: 'earthMap', to: 'street' }],
	['doorMoon', { from: 'earthBall', to: 'moon' }],
	
	['exit-interior', { from: 'interior', to: 'street' }],
	['exit-Room', { from: 'Room', to: 'interior' }],
	['exit-room2', { from: 'room2', to: 'interior' }],
	['exit-room3', { from: 'room3', to: 'interior' }],
	['exit-kitchen', { from: 'kitchen', to: 'interior' }],
	['exit-Bathroom', { from: 'Bathroom', to: 'Room' }],
	['exit-bathroomMirror', { from: 'bathroomMirror', to: 'Roommirror' }],
	['exit-livingroom', { from: 'livingroom', to: 'interior' }],
	['exit-sun', { from: 'sun', to: 'solarSystem' }],
	['exit-solarSystem', { from: 'solarSystem', to: 'galaxy' }],
	['exit-galaxy', { from: 'galaxy', to: 'localGroup' }],
	['exit-localGroup', { from: 'localGroup', to: 'supercluster' }],
	['exit-supercluster', { from: 'supercluster', to: 'cosmicWeb' }],
	['exit-cosmicWeb', { from: 'cosmicWeb', to: 'universe' }],
]);

const allSceneNames = new Set(
	[...transitionsMap.values()].flatMap(({ from, to }) => [from, to])
);

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
	
	for (const [id, { x, y, w, h }] of doorsMap) {
		const el = document.getElementById(id);
		if (el) placeObject(el, w, h, x, y);
	}
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

document.addEventListener('DOMContentLoaded', () => {
	allSceneNames.forEach(sceneName => {
		const layer = document.createElement('div');
		layer.id = sceneName;
		layer.classList.add('scene-layer');
		document.getElementById('scene').appendChild(layer);
	});

	for (const [id, { from }] of transitionsMap) {
		const door = document.createElement('div');
		door.id = id;
		if (id.startsWith('exit-')) {
			door.classList.add('exit');
		} else {
			door.classList.add('door');
		}
		const layer = document.getElementById(from);
		if (layer) {
			layer.appendChild(door);
		}
	};

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

	for (const [id, { from, to }] of transitionsMap) {
		const el = document.getElementById(id);
		if (el) {
			el.addEventListener('click', () => {
				scene.classList.remove(`${from}True`);
				scene.classList.add(`${to}True`);
				updateActiveLayer();
				updatePlacement();
			});
		}
	}
});

window.addEventListener('resize', () => {
	if (resizeTimeout) return;
	resizeTimeout = requestAnimationFrame(() => {
		resizeTimeout = null;
		updatePlacement();
	});
});
