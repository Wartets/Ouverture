let readyForPlacement = false;
let currentBackgroundImage = null;
let resizeScheduled = false;

const scene = document.getElementById('scene');

const backgroundWidth = 1652; // Actual sizes of backgrounds (px)
const backgroundHeight = 951;

const githubURL = (name) => `https://raw.githubusercontent.com/Wartets/Ouverture/refs/heads/main/${name}`;

const activeAudios = [];

const doors = new Map([
	['doorInterior', { x: 930, y: 475, w: 55, h: 105, from: 'exterior', to: 'interior' }],
	['doorRoom', { x: 1138, y: 237, w: 70, h: 130, from: 'interior', to: 'room' }],
	['doorRoom2', { x: 1357, y: 204, w: 70, h: 135, from: 'interior', to: 'room2' }],
	['doorRoom3', { x: 1585, y: 540, w: 130, h: 255, from: 'interior', to: 'room3' }],
	['doorKitchen', { x: 538, y: 510, w: 100, h: 300, from: 'interior', to: 'kitchen' }],
	['doorBathroom', { x: 1100, y: 490, w: 35, h: 270, from: 'room', to: 'bathroom' }],
	['doorToiletHole', { x: 820, y: 665, w: 90, h: 27, from: 'bathroom', to: 'toiletHole' }],
	['doorSewers', { x: 826, y: 500, w: 150, h: 150, from: 'bathroom', to: 'sewers' }],
	['doorBathroom3', { x: 1600, y: 490, w: 100, h: 440, from: 'room2', to: 'bathroom2' }],
	['doorBathroom2', { x: 1018, y: 330, w: 130, h: 250, from: 'bathroomMirror', to: 'bathroom' }],
	['doorbathroomMirror', { x: 552, y: 490, w: 35, h: 270, from: 'roomMirror', to: 'bathroomMirror' }],
	['doorbathroom2Mirror', { x: 642, y: 330, w: 130, h: 250, from: 'bathroom', to: 'bathroomMirror' }],
	['doorLivingroom', { x: 1324, y: 480, w: 230, h: 240, from: 'interior', to: 'livingroom' }],
	['doorGarden', { x: 1404, y: 424, w: 215, h: 656, from: 'kitchen', to: 'garden' }],
	['doorGarden2', { x: 39, y: 633, w: 78, h: 540, from: 'garden', to: 'kitchen' }],
	['doorGarden3', { x: 500, y: 500, w: 100, h: 100, from: 'livingroom', to: 'garden' }],
	['doorSun', { x: 1234, y: 27, w: 95, h: 58, from: 'exterior', to: 'sun' }],
	['doorSun2', { x: 1215, y: 42, w: 131, h: 84, from: 'garden', to: 'sun' }],
	['doorExterior', { x: 768, y: 285, w: 26, h: 26, from: 'earthMap', to: 'exterior' }],
	['doorEarthBall', { x: 826, y: 195, w: 25, h: 25, from: 'sun', to: 'earthBall' }],
	
	['doorGarage', { x: 500, y: 500, w: 50, h: 120, from: 'room3', to: 'garage' }],
	['doorCellar', { x: 100, y: 500, w: 50, h: 120, from: 'garage', to: 'cellar' }],
	['doorAlley', { x: 500, y: 500, w: 50, h: 120, from: 'garage', to: 'alley' }],
	['doorExterior2', { x: 104, y: 500, w: 70, h: 90, from: 'alley', to: 'garden' }],
	['doorGarden4', { x: 1508, y: 500, w: 80, h: 100, from: 'alley', to: 'exterior' }],
	/* ['doorAlley2', { x: 246, y: 545, w: 20, h: 250, from: 'garden', to: 'alley' }], */
	
	['doorCar', { x: 194, y: 626, w: 110, h: 80, from: 'exterior', to: 'car' }],
	['doorTownMap', { x: 829, y: 363, w: 148, h: 75, from: 'car', to: 'townMap' }],
	['doorExterior2', { x: 100, y: 50, w: 90, h: 90, from: 'townMap', to: 'exterior2' }],
	['doorExterior3', { x: 200, y: 50, w: 90, h: 90, from: 'townMap', to: 'exterior3' }],
	['doorExterior4', { x: 300, y: 50, w: 90, h: 90, from: 'townMap', to: 'exterior4' }],
	['doorExterior5', { x: 400, y: 50, w: 90, h: 90, from: 'townMap', to: 'exterior5' }],
	['doorExterior6', { x: 500, y: 50, w: 90, h: 90, from: 'townMap', to: 'exterior6' }],
	['doorExterior7', { x: 600, y: 50, w: 90, h: 90, from: 'townMap', to: 'exterior7' }],
	['doorExterior8', { x: 700, y: 50, w: 90, h: 90, from: 'townMap', to: 'exterior8' }],
	['doorSewers2', { x: 100, y: 150, w: 90, h: 90, from: 'townMap', to: 'sewers' }],
	
	['doorSun3', { x: 172, y: 473, w: 594, h: 594, from: 'solarSystem', to: 'sun' }],
	['doorMercuryBall', { x: 624, y: 473, w: 3, h: 3, from: 'solarSystem', to: 'mercuryBall' }],
	['doorVenusBall', { x: 726, y: 474, w: 4, h: 4, from: 'solarSystem', to: 'venusBall' }],
	['doorEarthBall3', { x: 827, y: 474, w: 5, h: 5, from: 'solarSystem', to: 'earthBall' }],
	['doorMarsBall', { x: 926, y: 474, w: 5, h: 5, from: 'solarSystem', to: 'marsBall' }],
	['doorJupiterBall', { x: 1079, y: 473, w: 68, h: 68, from: 'solarSystem', to: 'jupiterBall' }],
	['doorSaturnBall', { x: 1278, y: 473, w: 56, h: 56, from: 'solarSystem', to: 'saturnBall' }],
	['doorUranusBall', { x: 1454, y: 473, w: 24, h: 24, from: 'solarSystem', to: 'uranusBall' }],
	['doorNeptuneBall', { x: 1580, y: 473, w: 18, h: 18, from: 'solarSystem', to: 'neptuneBall' }],
	
	['doorMercury', { x: 826, y: 500, w: 400, h: 400, from: 'mercuryBall', to: 'mercury' }],
	['doorVenus', { x: 826, y: 500, w: 400, h: 400, from: 'venusBall', to: 'venus' }],
	['doorMars', { x: 826, y: 500, w: 400, h: 400, from: 'marsBall', to: 'mars' }],
	['doorJupiter', { x: 826, y: 500, w: 400, h: 400, from: 'jupiterBall', to: 'jupiter' }],
	['doorSaturn', { x: 826, y: 500, w: 400, h: 400, from: 'saturnBall', to: 'saturn' }],
	['doorSaturn2', { x: 826, y: 500, w: 400, h: 400, from: 'saturnRing', to: 'saturn' }],
	['doorSaturnRing', { x: 1200, y: 500, w: 300, h: 300, from: 'saturnBall', to: 'saturnRing' }],
	['doorUranus', { x: 826, y: 500, w: 400, h: 400, from: 'uranusBall', to: 'uranus' }],
	['doorNeptune', { x: 826, y: 500, w: 400, h: 400, from: 'neptuneBall', to: 'neptune' }],
	
	['doorEarthBall2', { x: 359, y: 197, w: 150, h: 150, from: 'moon', to: 'earthBall' }],
	['doorEarthMap', { x: 820, y: 430, w: 370, h: 370, from: 'earthBall', to: 'earthMap' }],
	['doorMoon', { x: 1332, y: 256, w: 58, h: 58, from: 'earthBall', to: 'moon' }],
	['doorCosmicWeb', { x: 500, y: 500, w: 50, h: 50, from: 'universe', to: 'cosmicWeb' }],
	['doorSupercluster', { x: 500, y: 500, w: 50, h: 50, from: 'cosmicWeb', to: 'supercluster' }],
	['doorLocalGroup', { x: 500, y: 500, w: 50, h: 50, from: 'supercluster', to: 'localGroup' }],
	['doorGalaxy', { x: 500, y: 500, w: 50, h: 50, from: 'localGroup', to: 'galaxy' }],
	['doorSolarSystem', { x: 500, y: 500, w: 50, h: 50, from: 'galaxy', to: 'solarSystem' }],
	['doorBlackhole', { x: 826, y: 500, w: 50, h: 50, from: 'galaxy', to: 'blackhole' }],
	['doorForest', { x: 1113, y: 566, w: 80, h: 160, from: 'garden', to: 'forest' }],
	['doorForest2', { x: 1350, y: 470, w: 50, h: 60, from: 'exterior', to: 'forest' }],
	['doorAntarctica', { x: 824, y: 910, w: 1200, h: 70, from: 'earthMap', to: 'antarctica' }],
	
	['exit-interior', { from: 'interior', to: 'exterior' }],
	['exit-room', { from: 'room', to: 'interior' }],
	['exit-room2', { from: 'room2', to: 'interior' }],
	['exit-room3', { from: 'room3', to: 'interior' }],
	['exit-kitchen', { from: 'kitchen', to: 'interior' }],
	['exit-bathroom', { from: 'bathroom', to: 'room' }],
	['exit-toiletHole', { from: 'toiletHole', to: 'bathroom' }],
	['exit-bathroom2', { from: 'bathroom2', to: 'room2' }],
	['exit-bathroomMirror', { from: 'bathroomMirror', to: 'roomMirror' }],
	['exit-livingroom', { from: 'livingroom', to: 'interior' }],
	['exit-sun', { from: 'sun', to: 'solarSystem' }],
	['exit-solarSystem', { from: 'solarSystem', to: 'galaxy' }],
	['exit-galaxy', { from: 'galaxy', to: 'localGroup' }],
	['exit-blackhole', { from: 'blackhole', to: 'galaxy' }],
	['exit-localGroup', { from: 'localGroup', to: 'supercluster' }],
	['exit-supercluster', { from: 'supercluster', to: 'cosmicWeb' }],
	['exit-cosmicWeb', { from: 'cosmicWeb', to: 'universe' }],
	['exit-forest', { from: 'forest', to: 'garden' }],
	['exit-garage', { from: 'garage', to: 'room3' }],
	['exit-alley', { from: 'alley', to: 'garage' }],
	['exit-cellar', { from: 'cellar', to: 'garage' }],
	['exit-car', { from: 'car', to: 'exterior' }],
	['exit-antarctica', { from: 'antarctica', to: 'earthMap' }],
	['exit-sewers', { from: 'sewers', to: 'townMap' }],
	
	['exit-townMap', { from: 'townMap', to: 'earthMap' }],
	['exit-exterior2', { from: 'exterior2', to: 'townMap' }],
	['exit-exterior3', { from: 'exterior3', to: 'townMap' }],
	['exit-exterior4', { from: 'exterior4', to: 'townMap' }],
	['exit-exterior5', { from: 'exterior5', to: 'townMap' }],
	['exit-exterior6', { from: 'exterior6', to: 'townMap' }],
	['exit-exterior7', { from: 'exterior7', to: 'townMap' }],
	['exit-exterior8', { from: 'exterior8', to: 'townMap' }],
	
	['exit-mercury', { from: 'mercury', to: 'mercuryBall' }],
	['exit-venus', { from: 'venus', to: 'venusBall' }],
	['exit-mars', { from: 'mars', to: 'marsBall' }],
	['exit-jupiter', { from: 'jupiter', to: 'jupiterBall' }],
	['exit-saturn', { from: 'saturn', to: 'saturnBall' }],
	['exit-saturnRing', { from: 'saturnRing', to: 'saturnBall' }],
	['exit-uranus', { from: 'uranus', to: 'uranusBall' }],
	['exit-neptune', { from: 'neptune', to: 'neptuneBall' }],
	
	['exit-mercuryBall', { from: 'mercuryBall', to: 'solarSystem' }],
	['exit-venusBall', { from: 'venusBall', to: 'solarSystem' }],
	['exit-marsBall', { from: 'marsBall', to: 'solarSystem' }],
	['exit-jupiterBall', { from: 'jupiterBall', to: 'solarSystem' }],
	['exit-saturnBall', { from: 'saturnBall', to: 'solarSystem' }],
	['exit-uranusBall', { from: 'uranusBall', to: 'solarSystem' }],
	['exit-neptuneBall', { from: 'neptuneBall', to: 'solarSystem' }],
]);

const objects = new Map([
	['cloud', { x: 414, y: 84, w: 420, h: 104, in: 'exterior', do: 'openwindow', variable: "oui, c'est un nuage" }],
	['graph', { x: 750, y: 520, w: 60, h: 80, in: 'roomMirror', do: 'openlink', variable: 'graphe.html' }],
	['poem', { x: 300, y: 500, w: 40, h: 40, in: 'interior', do: 'openwindow', variable: 'Amis.txt' }],
	['sink', { x: 682, y: 456, w: 15, h: 40, in: 'kitchen', do: 'playSound', variable: githubURL('assets/audios/sink.mp3') }],
	['oven', { x: 349, y: 790, w: 70, h: 100, in: 'kitchen', do: 'playSound', variable: githubURL('assets/audios/oven.mp3') }],
	['book1', { x: 10, y: 701, w: 20, h: 12, in: 'room2', do: 'openbook', variable: githubURL('assets/books/book1/') }],
	['penguin', { x: 1277, y: 586, w: 55, h: 86, in: 'antarctica', do: 'playSound', variable: githubURL('assets/audios/penguin.mp3') }],
]);

const actions = {
	alert: (msg) => alert(msg),
	openlink: (url) => window.open(url, '_blank'),
	openwindow: (variable) => {
		if (typeof variable === 'string' && variable.endsWith('.txt')) {
			fetch(`https://raw.githubusercontent.com/Wartets/Ouverture/refs/heads/main/assets/poems/${encodeURIComponent(variable)}`)
				.then(response => {
					if (!response.ok) throw new Error('Fichier introuvable');
					return response.text();
				})
				.then(text => actions.openwindow(text))
				.catch(err => actions.openwindow(`[Erreur de chargement : ${err.variable}]`));
			return;
		}

		const overlay = document.getElementById('letter-overlay');
		const content = document.getElementById('letter-content');
		const backdrop = document.getElementById('letter-backdrop');

		content.innerText = variable;

		const len = variable.length;
		const maxAngle = 5;
		const angle = (Math.sin(len * Math.random()) + Math.cos(len * 5 * Math.random())) * maxAngle;
		content.style.transform = `rotate(${angle.toFixed(2)}deg)`;

		overlay.style.display = 'flex';

		const closeLetter = () => {
			overlay.style.display = 'none';
			backdrop.removeEventListener('click', closeLetter);
		};
		backdrop.addEventListener('click', closeLetter);
	},
	playSound: (url) => {
		const audio = new Audio(url);
		activeAudios.push(audio);
		audio.play().catch(err => {
			console.error('Erreur lors de la lecture audio :', err.message);
		});
	},
	customFunction: (fnName) => {
		if (typeof window[fnName] === 'function') window[fnName]();
	},
	openbook: (baseUrl) => {
		const overlay = document.getElementById('book-overlay');
		const backdrop = document.getElementById('book-backdrop');
		const bookWindow = document.getElementById('book-window');
		const leftPage = document.getElementById('left-page');
		const rightPage = document.getElementById('right-page');
		const prevButton = document.getElementById('prev-page');
		const nextButton = document.getElementById('next-page');

		let pageIndex = 1;

		const preloadImage = (url) => {
			const img = new Image();
			img.src = url;
		};

		const checkImageExists = (url) =>
			fetch(url, { method: 'HEAD' }).then(res => res.ok).catch(() => false);

		const showPages = async () => {
			const leftUrl = `${baseUrl}page${pageIndex}.jpg`;
			const rightUrl = `${baseUrl}page${pageIndex + 1}.jpg`;
			const nextLeftUrl = `${baseUrl}page${pageIndex + 2}.jpg`;
			const prevLeftUrl = `${baseUrl}page${pageIndex - 2}.jpg`;

			const [leftExists, rightExists, nextExists, prevExists] = await Promise.all([
				checkImageExists(leftUrl),
				checkImageExists(rightUrl),
				checkImageExists(nextLeftUrl),
				pageIndex > 2 ? checkImageExists(prevLeftUrl) : Promise.resolve(false),
			]);

			if (!leftExists) return;

			leftPage.src = leftUrl;
			rightPage.src = rightExists ? rightUrl : '';
			if (rightExists) preloadImage(nextLeftUrl);

			prevButton.style.display = pageIndex > 2 && prevExists ? 'block' : 'none';
			nextButton.style.display = nextExists ? 'block' : 'none';
		};

		const close = () => {
			overlay.style.display = 'none';
			backdrop.removeEventListener('click', close);
		};

		prevButton.onclick = () => {
			if (pageIndex > 2) {
				pageIndex -= 2;
				showPages();
			}
		};

		nextButton.onclick = () => {
			pageIndex += 2;
			showPages();
		};

		const angle = (Math.random() - 0.5) * 10;
		bookWindow.style.transform = `rotate(${angle.toFixed(2)}deg)`;

		backdrop.addEventListener('click', close);
		overlay.style.display = 'flex';
		pageIndex = 1;
		showPages();
	},
};

const allSceneNames = (() => {
	const names = new Set();
	doors.forEach(({from, to}) => {
		if (from) names.add(from);
		if (to) names.add(to);
	});
	return names;
})();

function stopAllSounds() {
	activeAudios.forEach(audio => {
		audio.pause();
		audio.currentTime = 0;
	});
	activeAudios.length = 0;
}

function getDisplayMetrics() {
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

	return {
		offsetLeft,
		offsetTop,
		ratioX: displayedWidth / backgroundWidth,
		ratioY: displayedHeight / backgroundHeight,
	};
}

function placeObject(object, objectWidth, objectHeight, objectCenterX, objectCenterY) {
	if (!currentBackgroundImage) return;
	const { offsetLeft, offsetTop, ratioX, ratioY } = getDisplayMetrics();

	object.style.left = `${offsetLeft + (objectCenterX - objectWidth / 2) * ratioX}px`;
	object.style.top = `${offsetTop + (objectCenterY - objectHeight / 2) * ratioY}px`;
	object.style.width = `${objectWidth * ratioX}px`;
	object.style.height = `${objectHeight * ratioY}px`;
}

function updatePlacement() {
	if (!readyForPlacement) return;

	for (const [id, data] of doors) {
		if (!('x' in data)) continue;

		const el = document.getElementById(id);
		if (el) placeObject(el, data.w, data.h, data.x, data.y);
	}
	

	for (const [id, data] of objects) {
		const el = document.getElementById(id);
		if (el) placeObject(el, data.w, data.h, data.x, data.y);
	}
}

function updateActiveLayer() {
	const activeId = [...scene.classList].find(cls => cls.endsWith('True'))?.slice(0, -4);
	if (!activeId) return;

	document.querySelectorAll('.scene-layer').forEach(layer => {
		layer.classList.toggle('active', layer.id === activeId);
	});
	
	stopAllSounds();
}

document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const sceneFromUrl = urlParams.get('scene');
	const lastScene = sceneFromUrl || localStorage.getItem('lastScene') || 'exterior';
	
	scene.classList.forEach(cls => {
		if (cls.endsWith('True')) scene.classList.remove(cls);
	});
	
	scene.classList.add(`${lastScene}True`);
	
	allSceneNames.forEach(sceneName => {
		const layer = document.createElement('div');
		layer.id = sceneName;
		layer.classList.add('scene-layer');
		document.getElementById('scene').appendChild(layer);
	});

	for (const [id, data] of doors) {
		const door = document.createElement('div');
		door.id = id;
		door.classList.add(id.startsWith('exit-') ? 'exit' : 'door');
		const layer = document.getElementById(data.from);
		if (layer) layer.appendChild(door);

		door.addEventListener('click', () => {
			scene.classList.remove(`${data.from}True`);
			scene.classList.add(`${data.to}True`);
			localStorage.setItem('lastScene', data.to);
			updateActiveLayer();
			updatePlacement();
		});
	}

	for (const [id, data] of objects) {
		const obj = document.createElement('div');
		obj.id = id;
		obj.classList.add('object');
		const layer = document.getElementById(data.in);
		if (layer) layer.appendChild(obj);

		obj.addEventListener('click', () => {
			const actionName = data.do;
			const variable = data.variable;
			
			if (actionName === 'customFunction') {
				actions.customFunction(variable);
			} else {
				const action = actions[actionName];
				if (typeof action === 'function') {
					action(variable);
				} else {
					console.warn(`Action "${actionName}" inconnue pour l’objet "${id}"`);
				}
			}
		});
	}

	const sceneLayers = document.querySelectorAll('.scene-layer');
	let imagesLoaded = 0;
	const totalImages = sceneLayers.length;

	const loadImage = (layer) => new Promise(resolve => {
		const id = layer.id;
		const img = document.createElement('img');
		img.id = `background-${id}`;
		img.src = `assets/backgrounds/${id}.png`;
		img.alt = `background of ${id}`;
		img.style.pointerEvents = 'none';
		img.onload = () => {
		if (scene.classList.contains(`${id}True`)) {
			currentBackgroundImage = img;
		}
		resolve();
		};

		img.onerror = () => {
			console.warn(`Image manquante pour ${id}, chargement de backgroundError.png`);
			img.src = `assets/backgrounds/backgroundError.png`;

			img.onload = () => {
				if (scene.classList.contains(`${id}True`)) {
					currentBackgroundImage = img;
				}
				resolve();
			};
		};

		layer.insertBefore(img, layer.firstChild);
	});

	Promise.all(Array.from(sceneLayers).map(loadImage)).then(() => {
		readyForPlacement = true;
		updatePlacement();
	});

	updateActiveLayer();
});

window.addEventListener('resize', () => {
	if (!resizeScheduled) {
		resizeScheduled = true;
		requestAnimationFrame(() => {
			updatePlacement();
			resizeScheduled = false;
		});
	}
});