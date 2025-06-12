let readyForPlacement = false;
let currentBackgroundImage = null;
let resizeScheduled = false;

const EXTRAINF = true;

const scene = document.getElementById('scene');

const backgroundWidth = 1652; // Actual sizes of backgrounds (px)
const backgroundHeight = 951;

const githubURL = (name) => `https://raw.githubusercontent.com/Wartets/Ouverture/refs/heads/main/${name}`;

function formatSceneName(name) {
	return name
		.replace(/([A-Z])/g, ' $1')
		.replace(/([0-9])/g, ' $1')
		.toLowerCase()
		.replace(/^./, c => c.toUpperCase())
}

const activeAudios = [];

window.missingBackgroundScenes = new Set();

const doors = new Map([
	['doorInterior', { x: 930, y: 475, w: 55, h: 105, from: 'exterior', to: 'interior', radius: '0px', rotate: 0, tooltip: `Porte d'entrée principale` }],
	['doorRoom', { x: 1138, y: 237, w: 70, h: 130, from: 'interior', to: 'room' }],
	['doorRoom2', { x: 1293, y: 208, w: 80, h: 135, from: 'interior', to: 'room2' }],
	['doorRoom3', { x: 1585, y: 540, w: 130, h: 255, from: 'interior', to: 'room3' }],
	['doorRoom4', { x: 1420, y: 196, w: 10, h: 150, from: 'interior', to: 'room4' }],
	['doorInterior1a', { x: 684, y: 804, w: 80, h: 130, from: 'room4', to: 'interior', rotate: 20 }],
	['doorKitchen', { x: 538, y: 510, w: 100, h: 300, from: 'interior', to: 'kitchen' }],
	['doorBathroom', { x: 1100, y: 490, w: 35, h: 270, from: 'room', to: 'bathroom' }],
	['doorToiletHole', { x: 820, y: 665, w: 90, h: 27, from: 'bathroom', to: 'toiletHole' }],
	['doorSewers', { x: 826, y: 500, w: 150, h: 150, from: 'toiletHole', to: 'sewers' }],
	['doorBathroom3', { x: 1600, y: 490, w: 100, h: 440, from: 'room2', to: 'bathroom2' }],
	['doorBathroom2', { x: 1018, y: 330, w: 130, h: 250, from: 'bathroomMirror', to: 'bathroom', radius: '20px' }],
	['doorbathroomMirror', { x: 552, y: 490, w: 35, h: 270, from: 'roomMirror', to: 'bathroomMirror' }],
	['doorbathroom2Mirror', { x: 642, y: 330, w: 130, h: 250, from: 'bathroom', to: 'bathroomMirror', radius: '20px' }],
	['doorLivingroom', { x: 1324, y: 480, w: 230, h: 240, from: 'interior', to: 'livingroom' }],
	['doorGarden', { x: 1404, y: 424, w: 215, h: 656, from: 'kitchen', to: 'garden' }],
	['doorGarden2', { x: 39, y: 633, w: 78, h: 540, from: 'garden', to: 'kitchen' }],
	['doorGarden3', { x: 500, y: 500, w: 100, h: 100, from: 'livingroom', to: 'garden' }],
	['doorSun', { x: 1234, y: 11, w: 95, h: 95, from: 'exterior', to: 'sun', radius: '500px' }],
	['doorSun2', { x: 1213, y: 37, w: 131, h: 99, from: 'garden', to: 'sun', radius: '500px' }],
	['doorFrance', { x: 768, y: 285, w: 20, h: 20, from: 'earthMap', to: 'france', radius: '500px' }],
	['doorTownMap1b', { x: 884, y: 227, w: 20, h: 20, from: 'france', to: 'townMap', radius: '500px' }],
	['doorEarthBall', { x: 826, y: 195, w: 25, h: 25, from: 'sun', to: 'earthBall', radius: '26px' }],
	
	['doorGarage', { x: 500, y: 500, w: 50, h: 120, from: 'room3', to: 'garage' }],
	['doorCellar', { x: 100, y: 500, w: 50, h: 120, from: 'garage', to: 'cellar' }],
	['doorAlley', { x: 500, y: 500, w: 50, h: 120, from: 'garage', to: 'alley' }],
	['doorExterior1a', { x: 104, y: 500, w: 70, h: 90, from: 'alley', to: 'garden' }],
	['doorGarden4', { x: 1508, y: 500, w: 80, h: 100, from: 'alley', to: 'exterior' }],
	/* ['doorAlley2', { x: 246, y: 545, w: 20, h: 250, from: 'garden', to: 'alley' }], */
	['doorGarden3', { x: 1350, y: 470, w: 50, h: 60, from: 'exterior', to: 'garden' }],
	['doorfactoryBehind', { x: 1113, y: 566, w: 80, h: 160, from: 'garden', to: 'factoryBehind' }],
	['doorfactoryBehind2', { x: 1113, y: 566, w: 80, h: 160, from: 'factory', to: 'factoryBehind' }],
	['doorFactory2', { x: 500, y: 500, w: 80, h: 80, from: 'factoryBehind', to: 'factory' }],
	['doorFactory', { x: 500, y: 500, w: 80, h: 80, from: 'exteriorFactory', to: 'factory' }],
	
	['doorCar', { x: 320, y: 718, w: 400, h: 280, from: 'exterior', to: 'car' }],
	['doorTownMap', { x: 829, y: 363, w: 148, h: 75, from: 'car', to: 'townMap' }],
	
	['doorExteriorHighschool', { x: 1415, y: 55, w: 180, h: 60, from: 'townMap', to: 'exteriorHighschool', rotate: 30 }],
	['doorExterior2', { x: 1568, y: 205, w: 50, h: 50, from: 'townMap', to: 'exterior2' }],
	['doorExterior3', { x: 1104, y: 67, w: 50, h: 50, from: 'townMap', to: 'exterior3' }],
	['doorExterior4', { x: 1208, y: 132, w: 50, h: 50, from: 'townMap', to: 'exterior4' }],
	['doorExterior5', { x: 1317, y: 186, w: 50, h: 50, from: 'townMap', to: 'exterior5' }],
	['doorExterior6', { x: 1373, y: 237, w: 50, h: 50, from: 'townMap', to: 'exterior6' }],
	['doorExterior7', { x: 1451, y: 280, w: 50, h: 50, from: 'townMap', to: 'exterior7' }],
	['doorExterior8', { x: 1616, y: 355, w: 50, h: 50, from: 'townMap', to: 'exterior8' }],
	['doorExterior9', { x: 1557, y: 380, w: 50, h: 50, from: 'townMap', to: 'exterior9' }],
	['doorExterior10', { x: 1060, y: 169, w: 50, h: 50, from: 'townMap', to: 'exterior10' }],
	['doorExterior11', { x: 1104, y: 203, w: 50, h: 50, from: 'townMap', to: 'exterior11' }],
	['doorExterior12', { x: 1198, y: 258, w: 50, h: 50, from: 'townMap', to: 'exterior12' }],
	['doorExterior13', { x: 1259, y: 285, w: 50, h: 50, from: 'townMap', to: 'exterior13' }],
	['doorExterior14', { x: 1308, y: 317, w: 50, h: 50, from: 'townMap', to: 'exterior14' }],
	['doorExterior15', { x: 1347, y: 360, w: 50, h: 50, from: 'townMap', to: 'exterior15' }],
	['doorExterior16', { x: 1509, y: 455, w: 50, h: 50, from: 'townMap', to: 'exterior16' }],
	['doorExterior17', { x: 1620, y: 484, w: 50, h: 50, from: 'townMap', to: 'exterior17' }],
	['doorExterior18', { x: 1567, y: 508, w: 50, h: 50, from: 'townMap', to: 'exterior18' }],
	['doorExteriorWarehouse', { x: 626, y: 72, w: 190, h: 100, from: 'townMap', to: 'exteriorWarehouse' }],
	['doorExterior19', { x: 961, y: 263, w: 50, h: 50, from: 'townMap', to: 'exterior19' }],
	['doorExterior20', { x: 1101, y: 343, w: 50, h: 50, from: 'townMap', to: 'exterior20' }],
	['doorExteriorMosque', { x: 1200, y: 416, w: 140, h: 90, from: 'townMap', to: 'exteriorMosque', rotate: 30, radius: '30px' }],
	['doorExterior21', { x: 820, y: 237, w: 50, h: 50, from: 'townMap', to: 'exterior21' }],
	['doorExterior22', { x: 907, y: 297, w: 50, h: 50, from: 'townMap', to: 'exterior22' }],
	['doorExteriorShops', { x: 745, y: 312, w: 50, h: 50, from: 'townMap', to: 'exteriorShops' }],
	['doorExteriorNightclub', { x: 825, y: 358, w: 50, h: 50, from: 'townMap', to: 'exteriorNightclub' }],
	['doorExteriorMall', { x: 982, y: 394, w: 150, h: 90, from: 'townMap', to: 'exteriorMall', rotate: -30, radius: '10px' }],
	['doorExteriorWorkshop', { x: 1063, y: 494, w: 150, h: 80, from: 'townMap', to: 'exteriorWorkshop', rotate: 30 }],
	['doorExteriorCastel', { x: 1343, y: 557, w: 80, h: 100, from: 'townMap', to: 'exteriorCastel' }],
	['doorExteriorMovieTheater', { x: 602, y: 380, w: 100, h: 75, from: 'townMap', to: 'exteriorMovieTheater', rotate: 33 }],
	['doorExterior23', { x: 706, y: 448, w: 50, h: 50, from: 'townMap', to: 'exterior23' }],
	['doorExterior24', { x: 883, y: 530, w: 50, h: 50, from: 'townMap', to: 'exterior24' }],
	['doorExteriorPoliceStation', { x: 941, y: 579, w: 100, h: 50, from: 'townMap', to: 'exteriorPoliceStation', rotate: 33 }],
	['doorVineyard', { x: 124, y: 188, w: 150, h: 150, from: 'townMap', to: 'vineyard' }],
	['doorExteriorStation', { x: 308, y: 314, w: 220, h: 75, from: 'townMap', to: 'france', rotate: -33 }],
	['doorExteriorPuclicHousing', { x: 517, y: 462, w: 130, h: 130, from: 'townMap', to: 'exteriorPuclicHousing', rotate: -33, radius: '10px' }],
	['doorExteriorFactory', { x: 728, y: 545, w: 150, h: 90, from: 'townMap', to: 'exteriorFactory', rotate: -30, radius: '10px' }],
	['doorExterior25', { x: 837, y: 651, w: 35, h: 35, from: 'townMap', to: 'exterior25' }],
	['doorExterior26', { x: 872, y: 634, w: 34, h: 35, from: 'townMap', to: 'exterior26' }],
	['doorExterior27', { x: 907, y: 615, w: 35, h: 35, from: 'townMap', to: 'exterior27' }],
	['doorExteriorPark', { x: 1060, y: 753, w: 200, h: 200, from: 'townMap', to: 'exteriorPark', rotate: 45, radius: '25px' }],
	['doorForest', { x: 1360, y: 890, w: 575, h: 118, from: 'townMap', to: 'forest' }],
	['doorExterior1b', { x: 775, y: 680, w: 50, h: 50, from: 'townMap', to: 'exterior' }],
	['doorExteriorTownHall', { x: 303, y: 586, w: 190, h: 100, from: 'townMap', to: 'exteriorTownHall', rotate: -33 }],
	['doorExterior28', { x: 556, y: 688, w: 50, h: 50, from: 'townMap', to: 'exterior28' }],
	['doorExterior29', { x: 682, y: 734, w: 50, h: 50, from: 'townMap', to: 'exterior29' }],
	['doorExterior30', { x: 633, y: 768, w: 50, h: 50, from: 'townMap', to: 'exterior30' }],
	['doorExterior31', { x: 825, y: 825, w: 50, h: 50, from: 'townMap', to: 'exterior31' }],
	['doorExteriorChurch', { x: 902, y: 889, w: 50, h: 50, from: 'townMap', to: 'exteriorChurch' }],
	['doorExterior32', { x: 473, y: 727, w: 50, h: 50, from: 'townMap', to: 'exterior32' }],
	['doorExterior33', { x: 740, y: 884, w: 50, h: 50, from: 'townMap', to: 'exterior33' }],
	['doorExterior34', { x: 415, y: 778, w: 50, h: 50, from: 'townMap', to: 'exterior34' }],
	['doorExterior35', { x: 543, y: 836, w: 50, h: 50, from: 'townMap', to: 'exterior35' }],
	['doorExterior36', { x: 682, y: 918, w: 50, h: 50, from: 'townMap', to: 'exterior36' }],
	['doorExterior37', { x: 330, y: 819, w: 50, h: 50, from: 'townMap', to: 'exterior37' }],
	['doorExterior38', { x: 483, y: 860, w: 50, h: 50, from: 'townMap', to: 'exterior38' }],
	['doorExterior39', { x: 432, y: 896, w: 50, h: 50, from: 'townMap', to: 'exterior39' }],
	['doorExteriorHospital', { x: 124, y: 751, w: 150, h: 70, from: 'townMap', to: 'exteriorHospital', rotate: -33 }],
	['doorExterior40', { x: 265, y: 848, w: 50, h: 50, from: 'townMap', to: 'exterior40' }],
	['doorExterior41', { x: 221, y: 875, w: 50, h: 50, from: 'townMap', to: 'exterior41' }],
	['doorExterior42', { x: 364, y: 930, w: 50, h: 50, from: 'townMap', to: 'exterior42' }],
	
	['doorHighschool', { x: 826, y: 559, w: 112, h: 130, from: 'exteriorHighschool', to: 'highschool' }],
	['doorInterior2', { x: 500, y: 500, w: 50, h: 50, from: 'exterior2', to: 'interior2' }],
	['doorInterior3', { x: 500, y: 500, w: 50, h: 50, from: 'exterior3', to: 'interior3' }],
	['doorInterior4', { x: 500, y: 500, w: 50, h: 50, from: 'exterior4', to: 'interior4' }],
	['doorInterior5', { x: 500, y: 500, w: 50, h: 50, from: 'exterior5', to: 'interior5' }],
	['doorInterior6', { x: 500, y: 500, w: 50, h: 50, from: 'exterior6', to: 'interior6' }],
	['doorInterior7', { x: 500, y: 500, w: 50, h: 50, from: 'exterior7', to: 'interior7' }],
	['doorInterior8', { x: 500, y: 500, w: 50, h: 50, from: 'exterior8', to: 'interior8' }],
	['doorInterior9', { x: 500, y: 500, w: 50, h: 50, from: 'exterior9', to: 'interior9' }],
	['doorInterior10', { x: 500, y: 500, w: 50, h: 50, from: 'exterior10', to: 'interior10' }],
	['doorInterior11', { x: 500, y: 500, w: 50, h: 50, from: 'exterior11', to: 'interior11' }],
	['doorInterior12', { x: 500, y: 500, w: 50, h: 50, from: 'exterior12', to: 'interior12' }],
	['doorInterior13', { x: 500, y: 500, w: 50, h: 50, from: 'exterior13', to: 'interior13' }],
	['doorInterior14', { x: 500, y: 500, w: 50, h: 50, from: 'exterior14', to: 'interior14' }],
	['doorInterior15', { x: 500, y: 500, w: 50, h: 50, from: 'exterior15', to: 'interior15' }],
	['doorInterior16', { x: 500, y: 500, w: 50, h: 50, from: 'exterior16', to: 'interior16' }],
	['doorInterior17', { x: 500, y: 500, w: 50, h: 50, from: 'exterior17', to: 'interior17' }],
	['doorInterior18', { x: 500, y: 500, w: 50, h: 50, from: 'exterior18', to: 'interior18' }],
	['doorWarehouse', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorWarehouse', to: 'warehouse' }],
	['doorInterior19', { x: 500, y: 500, w: 50, h: 50, from: 'exterior19', to: 'interior19' }],
	['doorInterior20', { x: 500, y: 500, w: 50, h: 50, from: 'exterior20', to: 'interior20' }],
	['doorMosque', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorMosque', to: 'mosque' }],
	['doorInterior21', { x: 500, y: 500, w: 50, h: 50, from: 'exterior21', to: 'interior21' }],
	['doorInterior22', { x: 500, y: 500, w: 50, h: 50, from: 'exterior22', to: 'interior22' }],
	['doorShops', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorShops', to: 'shops' }],
	['doorNightclub', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorNightclub', to: 'nightclub' }],
	['doorMall', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorMall', to: 'mall' }],
	['doorWorkshop', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorWorkshop', to: 'workshop' }],
	['doorCastel', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorCastel', to: 'castel' }],
	['doorMovieTheater', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorMovieTheater', to: 'movieTheater' }],
	['doorInterior23', { x: 500, y: 500, w: 50, h: 50, from: 'exterior23', to: 'interior23' }],
	['doorInterior24', { x: 500, y: 500, w: 50, h: 50, from: 'exterior24', to: 'interior24' }],
	['doorPoliceStation', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorPoliceStation', to: 'policeStation' }],
	['doorPuclicHousing', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorPuclicHousing', to: 'puclicHousing' }],
	['doorFactory', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorFactory', to: 'factory' }],
	['doorInterior25', { x: 500, y: 500, w: 50, h: 50, from: 'exterior25', to: 'interior25' }],
	['doorInterior26', { x: 500, y: 500, w: 50, h: 50, from: 'exterior26', to: 'interior26' }],
	['doorInterior27', { x: 500, y: 500, w: 50, h: 50, from: 'exterior27', to: 'interior27' }],
	['doorPark', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorPark', to: 'park' }],
	['doorTownHall', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorTownHall', to: 'townHall' }],
	['doorInterior28', { x: 500, y: 500, w: 50, h: 50, from: 'exterior28', to: 'interior28' }],
	['doorInterior29', { x: 500, y: 500, w: 50, h: 50, from: 'exterior29', to: 'interior29' }],
	['doorInterior30', { x: 500, y: 500, w: 50, h: 50, from: 'exterior30', to: 'interior30' }],
	['doorInterior31', { x: 500, y: 500, w: 50, h: 50, from: 'exterior31', to: 'interior31' }],
	['doorChurch', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorChurch', to: 'church' }],
	['doorInterior32', { x: 500, y: 500, w: 50, h: 50, from: 'exterior32', to: 'interior32' }],
	['doorInterior33', { x: 500, y: 500, w: 50, h: 50, from: 'exterior33', to: 'interior33' }],
	['doorInterior34', { x: 500, y: 500, w: 50, h: 50, from: 'exterior34', to: 'interior34' }],
	['doorInterior35', { x: 500, y: 500, w: 50, h: 50, from: 'exterior35', to: 'interior35' }],
	['doorInterior36', { x: 500, y: 500, w: 50, h: 50, from: 'exterior36', to: 'interior36' }],
	['doorInterior37', { x: 500, y: 500, w: 50, h: 50, from: 'exterior37', to: 'interior37' }],
	['doorInterior38', { x: 500, y: 500, w: 50, h: 50, from: 'exterior38', to: 'interior38' }],
	['doorInterior39', { x: 500, y: 500, w: 50, h: 50, from: 'exterior39', to: 'interior39' }],
	['doorHospital', { x: 500, y: 500, w: 50, h: 50, from: 'exteriorHospital', to: 'hospital' }],
	['doorInterior40', { x: 500, y: 500, w: 50, h: 50, from: 'exterior40', to: 'interior40' }],
	['doorInterior41', { x: 500, y: 500, w: 50, h: 50, from: 'exterior41', to: 'interior41' }],
	['doorInterior42', { x: 500, y: 500, w: 50, h: 50, from: 'exterior42', to: 'interior42' }],
	
	['doorSun3', { x: 172, y: 473, w: 594, h: 594, from: 'solarSystem', to: 'sun', radius: '500px' }],
	['doorMercuryBall', { x: 624, y: 473, w: 3, h: 3, from: 'solarSystem', to: 'mercuryBall', radius: '500px' }],
	['doorVenusBall', { x: 726, y: 474, w: 4, h: 4, from: 'solarSystem', to: 'venusBall', radius: '500px' }],
	['doorEarthBall3', { x: 827, y: 474, w: 5, h: 5, from: 'solarSystem', to: 'earthBall', radius: '500px' }],
	['doorMarsBall', { x: 926, y: 474, w: 5, h: 5, from: 'solarSystem', to: 'marsBall' }],
	['doorJupiterBall', { x: 1079, y: 473, w: 68, h: 68, from: 'solarSystem', to: 'jupiterBall', radius: '500px' }],
	['doorSaturnBall', { x: 1278, y: 473, w: 56, h: 56, from: 'solarSystem', to: 'saturnBall', radius: '500px' }],
	['doorUranusBall', { x: 1454, y: 473, w: 24, h: 24, from: 'solarSystem', to: 'uranusBall', radius: '500px' }],
	['doorNeptuneBall', { x: 1580, y: 473, w: 18, h: 18, from: 'solarSystem', to: 'neptuneBall', radius: '500px' }],
	
	['doorMercury', { x: 826, y: 500, w: 400, h: 400, from: 'mercuryBall', to: 'mercury' }],
	['doorVenus', { x: 826, y: 500, w: 400, h: 400, from: 'venusBall', to: 'venus' }],
	['doorMars', { x: 826, y: 500, w: 400, h: 400, from: 'marsBall', to: 'mars' }],
	['doorJupiter', { x: 826, y: 500, w: 400, h: 400, from: 'jupiterBall', to: 'jupiter' }],
	['doorSaturn', { x: 826, y: 500, w: 400, h: 400, from: 'saturnBall', to: 'saturn' }],
	['doorSaturn2', { x: 200, y: 476, w: 530, h: 942, from: 'saturnRing', to: 'saturn' }],
	['doorSun4', { x: 953, y: 404, w: 40, h: 40, from: 'saturnRing', to: 'sun' }],
	['doorSaturnRing', { x: 1200, y: 500, w: 300, h: 300, from: 'saturnBall', to: 'saturnRing' }],
	['doorUranus', { x: 826, y: 500, w: 400, h: 400, from: 'uranusBall', to: 'uranus' }],
	['doorNeptune', { x: 826, y: 500, w: 400, h: 400, from: 'neptuneBall', to: 'neptune' }],
	
	['doorEarthBall2', { x: 359, y: 197, w: 150, h: 150, from: 'moon', to: 'earthBall', radius: '500px' }],
	['doorEarthMap', { x: 820, y: 430, w: 370, h: 370, from: 'earthBall', to: 'earthMap', radius: '500px' }],
	['doorAntarctica', { x: 824, y: 910, w: 1200, h: 70, from: 'earthMap', to: 'antarctica' }],
	['doorMoon', { x: 1329, y: 262, w: 62, h: 62, from: 'earthBall', to: 'moon', radius: '500px' }],
	['doorCosmicWeb', { x: 652, y: 490, w: 800, h: 800, from: 'universe', to: 'cosmicWeb', radius: '500px', color: 'rgba(0,0,0,0)' }],
	['doorSupercluster', { x: 1096, y: 123, w: 12, h: 12, from: 'cosmicWeb', to: 'supercluster', radius: '500px' }],
	['doorLocalGroup', { x: 781, y: 414, w: 12, h: 12, from: 'supercluster', to: 'localGroup', radius: '500px' }],
	['doorGalaxy', { x: 844, y: 511, w: 30, h: 10, from: 'localGroup', to: 'galaxy', radius: '5px' }],
	['doorGalaxy2', { x: 548, y: 274, w: 30, h: 10, from: 'localGroup', to: 'galaxy2', radius: '5px', rotate: 39 }],
	['doorSolarSystem', { x: 609, y: 603, w: 25, h: 25, from: 'galaxy', to: 'solarSystem', radius: '500px' }],
	['doorBlackhole', { x: 825, y: 409, w: 65, h: 50, from: 'galaxy', to: 'blackhole' }],
	['doorBlackhole2', { x: 825, y: 409, w: 65, h: 50, from: 'galaxy2', to: 'blackhole2' }],
	
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
	
	['exit-factory', { from: 'factory', to: 'exteriorFactory' }],
	
	['exit-france', { from: 'france', to: 'earthMap' }],
	['exit-earthMap', { from: 'earthMap', to: 'earthBall' }],
	['exit-sun', { from: 'sun', to: 'solarSystem' }],
	['exit-solarSystem', { from: 'solarSystem', to: 'galaxy' }],
	['exit-galaxy', { from: 'galaxy', to: 'localGroup' }],
	['exit-galaxy2', { from: 'galaxy2', to: 'localGroup' }],
	['exit-blackhole', { from: 'blackhole', to: 'galaxy' }],
	['exit-blackhole2', { from: 'blackhole2', to: 'galaxy2' }],
	['exit-localGroup', { from: 'localGroup', to: 'supercluster' }],
	['exit-supercluster', { from: 'supercluster', to: 'cosmicWeb' }],
	['exit-cosmicWeb', { from: 'cosmicWeb', to: 'universe' }],
	['exit-garage', { from: 'garage', to: 'room3' }],
	['exit-alley', { from: 'alley', to: 'garage' }],
	['exit-cellar', { from: 'cellar', to: 'garage' }],
	['exit-car', { from: 'car', to: 'exterior' }],
	['exit-antarctica', { from: 'antarctica', to: 'earthMap' }],
	['exit-sewers', { from: 'sewers', to: 'forest' }],
	
	['exit-highschool', { from: 'highschool', to: 'exteriorHighschool' }],
	['exit-interior2', { from: 'interior2', to: 'exterior2' }],
	['exit-interior3', { from: 'interior3', to: 'exterior3' }],
	['exit-interior4', { from: 'interior4', to: 'exterior4' }],
	['exit-interior5', { from: 'interior5', to: 'exterior5' }],
	['exit-interior6', { from: 'interior6', to: 'exterior6' }],
	['exit-interior7', { from: 'interior7', to: 'exterior7' }],
	['exit-interior8', { from: 'interior8', to: 'exterior8' }],
	['exit-interior9', { from: 'interior9', to: 'exterior9' }],
	['exit-interior10', { from: 'interior10', to: 'exterior10' }],
	['exit-interior11', { from: 'interior11', to: 'exterior11' }],
	['exit-interior12', { from: 'interior12', to: 'exterior12' }],
	['exit-interior13', { from: 'interior13', to: 'exterior13' }],
	['exit-interior14', { from: 'interior14', to: 'exterior14' }],
	['exit-interior15', { from: 'interior15', to: 'exterior15' }],
	['exit-interior16', { from: 'interior16', to: 'exterior16' }],
	['exit-interior17', { from: 'interior17', to: 'exterior17' }],
	['exit-interior18', { from: 'interior18', to: 'exterior18' }],
	['exit-warehouse', { from: 'warehouse', to: 'exteriorWarehouse' }],
	['exit-interior19', { from: 'interior19', to: 'exterior19' }],
	['exit-interior20', { from: 'interior20', to: 'exterior20' }],
	['exit-mosque', { from: 'mosque', to: 'exteriorMosque' }],
	['exit-interior21', { from: 'interior21', to: 'exterior21' }],
	['exit-interior22', { from: 'interior22', to: 'exterior22' }],
	['exit-shops', { from: 'shops', to: 'exteriorShops' }],
	['exit-nightclub', { from: 'nightclub', to: 'exteriorNightclub' }],
	['exit-Mall', { from: 'mall', to: 'exteriorMall' }],
	['exit-Workshop', { from: 'workshop', to: 'exteriorWorkshop' }],
	['exit-Castel', { from: 'castel', to: 'exteriorCastel' }],
	['exit-MovieTheater', { from: 'movieTheater', to: 'exteriorMovieTheater' }],
	['exit-interior23', { from: 'interior23', to: 'exterior23' }],
	['exit-interior24', { from: 'interior24', to: 'exterior24' }],
	['exit-PoliceStation', { from: 'policeStation', to: 'exteriorPoliceStation' }],
	['exit-PuclicHousing', { from: 'puclicHousing', to: 'exteriorPuclicHousing' }],
	['exit-Factory', { from: 'factory', to: 'exteriorFactory' }],
	['exit-interior25', { from: 'interior25', to: 'exterior25' }],
	['exit-interior26', { from: 'interior26', to: 'exterior26' }],
	['exit-interior27', { from: 'interior27', to: 'exterior27' }],
	['exit-Park', { from: 'park', to: 'exteriorPark' }],
	['exit-TownHall', { from: 'townHall', to: 'exteriorTownHall' }],
	['exit-interior28', { from: 'interior28', to: 'exterior28' }],
	['exit-interior29', { from: 'interior29', to: 'exterior29' }],
	['exit-interior30', { from: 'interior30', to: 'exterior30' }],
	['exit-interior31', { from: 'interior31', to: 'exterior31' }],
	['exit-Church', { from: 'church', to: 'exteriorChurch' }],
	['exit-interior32', { from: 'interior32', to: 'exterior32' }],
	['exit-interior33', { from: 'interior33', to: 'exterior33' }],
	['exit-interior34', { from: 'interior34', to: 'exterior34' }],
	['exit-interior35', { from: 'interior35', to: 'exterior35' }],
	['exit-interior36', { from: 'interior36', to: 'exterior36' }],
	['exit-interior37', { from: 'interior37', to: 'exterior37' }],
	['exit-interior38', { from: 'interior38', to: 'exterior38' }],
	['exit-interior39', { from: 'interior39', to: 'exterior39' }],
	['exit-Hospital', { from: 'hospital', to: 'exteriorHospital' }],
	['exit-interior40', { from: 'interior40', to: 'exterior40' }],
	['exit-interior41', { from: 'interior41', to: 'exterior41' }],
	['exit-interior42', { from: 'interior42', to: 'exterior42' }],

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

for (const [key, value] of doors.entries()) {
		if (
			value.from === 'townMap' &&
			value.to &&
			!['france', 'exterior'].includes(value.to)
		) {
		const exitKey = `exit-${value.to}`;
		const exitValue = { from: value.to, to: 'townMap' };
		doors.set(exitKey, exitValue);
	}
}

const objects = new Map([
	['cloud', { x: 414, y: 84, w: 420, h: 104, in: 'exterior', do: 'openwindow', variable: "oui, c'est un nuage", radius: '20px' }],
	['graph', { x: 750, y: 520, w: 60, h: 80, in: 'roomMirror', do: 'openlink', variable: 'graphe.html' }],
	['poem', { x: 650, y: 268, w: 15, h: 10, in: 'room4', do: 'openwindow', variable: 'Amis.txt' }],
	['sink', { x: 682, y: 456, w: 15, h: 40, in: 'kitchen', do: 'playSound', variable: githubURL('assets/audios/sink.mp3'), radius: '20px' }],
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

function placeObject(object, objectWidth, objectHeight, objectCenterX, objectCenterY, radius, rotate, tooltip, color, opacity) {
	if (!currentBackgroundImage) return;
	const { offsetLeft, offsetTop, ratioX, ratioY } = getDisplayMetrics();

	object.style.left = `${offsetLeft + (objectCenterX - objectWidth / 2) * ratioX}px`;
	object.style.top = `${offsetTop + (objectCenterY - objectHeight / 2) * ratioY}px`;
	object.style.width = `${objectWidth * ratioX}px`;
	object.style.height = `${objectHeight * ratioY}px`;
	
	if (radius)	object.style.borderRadius = radius;
	if (rotate) object.style.transform = `rotate(${rotate}deg)`;
	if (EXTRAINF) object.title = formatSceneName(object.id)
	else if (tooltip) object.title = tooltip;
	if (color) object.style.backgroundColor = color;
	if (opacity !== undefined) object.style.opacity = opacity;
}

function updatePlacement() {
	if (!readyForPlacement) return;

	for (const [id, data] of doors) {
		if (!('x' in data)) continue;

		const el = document.getElementById(id);
		if (el) placeObject(el, data.w, data.h, data.x, data.y, data.radius, data.rotate, data.tooltip, data.color);
	}
	

	for (const [id, data] of objects) {
		const el = document.getElementById(id);
		if (el) placeObject(el, data.w, data.h, data.x, data.y, data.radius, data.rotate, data.tooltip, data.color);
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
			missingBackgroundScenes.add(id);
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
		window.dispatchEvent(new Event("backgrounds-loaded"));
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