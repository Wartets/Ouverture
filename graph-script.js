const nodesMap = new Map();
const links = [];

let collapsed = false;
expandHud();

function formatSceneName(name) {
	return name
		.replace(/([A-Z])/g, ' $1')
		.toLowerCase()
		.replace(/^./, c => c.toUpperCase())
}


for (const { from, to } of doors.values()) {
	if (!nodesMap.has(from)) nodesMap.set(from, { id: from });
	if (!nodesMap.has(to)) nodesMap.set(to, { id: to });
	links.push({ source: from, target: to });
}

for (const [name, obj] of objects.entries()) {
	const scene = obj.in;
	const objectId = `obj${formatSceneName(name).trim()}`;
	nodesMap.set(objectId, { id: objectId, name });
	links.push({ source: objectId, target: scene, object: true });
}

const nodes = Array.from(nodesMap.values());

const svg = d3.select("svg");

svg.call(d3.zoom()
.scaleExtent([0.1, 10])
.on("zoom", (event) => {
	zoomLayer.attr("transform", event.transform);
}));

const width = window.innerWidth;
const height = window.innerHeight;

svg.append("defs").append("marker")
	.attr("id", "arrow")
	.attr("viewBox", "0 -5 10 10")
	.attr("refX", 46)
	.attr("refY", 0)
	.attr("markerWidth", 6)
	.attr("markerHeight", 6)
	.attr("orient", "auto")
	.append("path")
	.attr("d", "M0,-5L10,0L0,5")
	.attr("fill", "#888");

const simulation = d3.forceSimulation(nodes)
	.force("link", d3.forceLink(links)
		.id(d => d.id)
		.distance(d => d.object ? 60 : 100))
	.force("charge", d3.forceManyBody()
		.strength(d => d.id.startsWith("obj") ? -50 : -300 - Math.random() * 175))
	.force("center", d3.forceCenter(width / 2, height / 2));

const zoomLayer = svg.append("g");

const link = zoomLayer.append("g")
	.selectAll("line")
	.data(links)
	.join("line")
	.attr("class", "link")
	.attr("stroke", d => d.object ? "#aaa" : "#888")
	.attr("stroke-dasharray", d => d.object ? "4,4" : null)
	.attr("marker-end", d => d.object ? null : "url(#arrow)");

const node = zoomLayer.append("g")
	.selectAll("g")
	.data(nodes)
	.join("g")
	.attr("class", "node")
	.call(drag(simulation));

node.append("circle")
	.attr("r", d => d.id.startsWith("obj") ? 12 : 36)
	.attr("fill", d => d.id.startsWith("obj") ? "#000" : "#000");

node.append("text")
	.attr("text-anchor", "middle")
	.attr("dy", d => d.id.startsWith("obj") ? 4 : 2)
	.attr("font-size", d => d.id.startsWith("obj") ? "8px" : "12px")
	.text(d => d.id.startsWith("obj") ? d.name : formatSceneName(d.id));

simulation.on("tick", () => {
	link
	.attr("x1", d => d.source.x)
	.attr("y1", d => d.source.y)
	.attr("x2", d => d.target.x)
	.attr("y2", d => d.target.y);

	node.attr("transform", d => `translate(${d.x},${d.y})`);
});

node.on("click", (event, d) => {
	d3.select(event.currentTarget).select("circle")
		.transition()
		.duration(300)
		.attr("fill", "#777")
		.transition()
		.duration(300)
		.attr("fill", d.id.startsWith("obj") ? "#000" : "#000");
	
	if (d.id.startsWith("obj")) {
		const name = d.name;
		const obj = objects.get(name);
		if (!obj) return;

		const action = obj.do;
		const value = obj.variable;

		if (typeof actions[action] === 'function') {
			actions[action](value);
		} else {
			console.warn(`Action inconnue : ${action}`);
		}
	} else {
		window.location.href = `index.html?scene=${encodeURIComponent(d.id)}`;
	}
});

function drag(simulation) {
	return d3.drag()
		.on("start", event => {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			event.subject.fx = event.subject.x;
			event.subject.fy = event.subject.y;

			d3.select(event.sourceEvent.target)
				.transition()
				.duration(200)
				.attr("r", d => d.id.startsWith("obj") ? 16 : 48);
		})
		.on("drag", event => {
			event.subject.fx = event.x;
			event.subject.fy = event.y;
		})
		.on("end", event => {
			if (!event.active) simulation.alphaTarget(0);
			event.subject.fx = null;
			event.subject.fy = null;

			d3.select(event.sourceEvent.target)
				.transition()
				.duration(200)
				.attr("r", d => d.id.startsWith("obj") ? 12 : 36);
		});
}

const scenesSet = new Set();
const objectCountsPerScene = new Map();

for (const { from, to } of doors.values()) {
	scenesSet.add(from);
	scenesSet.add(to);
}
const numScenes = scenesSet.size;
const numLinks = links.filter(l => !l.object).length;
const numObjects = [...objects.keys()].length;

for (const obj of objects.values()) {
	const scene = obj.in;
	objectCountsPerScene.set(scene, (objectCountsPerScene.get(scene) || 0) + 1);
}

const avgLinksPerScene = (2 * numLinks / numScenes).toFixed(2);
const avgObjectsPerScene = (numObjects / numScenes).toFixed(2);

const hud = document.getElementById("hud");
hud.innerHTML = `<strong>Stats</strong><br>`;

function collapseHud() {
	if (!collapsed) {
		collapsed = true;
		hud.classList.add("collapsed");
		hud.innerHTML = "<strong>Stats</strong>";
	}
}

function expandHud() {
	if (collapsed) {
		collapsed = false;
		hud.classList.remove("collapsed");
		hud.innerHTML = `
			<strong>Stats:</strong><br>
			Scenes: ${numScenes}<br>
			Doors: ${numLinks}<br>
			Objects: ${numObjects}<br>
			Av. doors by scene: ${avgLinksPerScene}<br>
			Av. object by scene: ${avgObjectsPerScene}<br>
		`;
	}
}

hud.addEventListener("mouseenter", () => {
	expandHud();
	clearTimeout(hideTimeout);
});

hud.addEventListener("mouseleave", () => {
	hideTimeout = setTimeout(() => {
		collapseHud();
	}, 0);
});

let hideTimeout = null;

hideTimeout = setTimeout(() => {
	collapseHud();
}, 3000);

const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search scene or object...';
searchInput.style.position = 'fixed';
searchInput.style.top = '10px';
searchInput.style.right = '10px';
searchInput.style.zIndex = 1000;
searchInput.style.padding = '5px';
searchInput.style.borderRadius = '4px';
document.body.appendChild(searchInput);

const fuse = new Fuse(nodes, {
	keys: ['id', 'name'],
	threshold: 0.3,
	ignoreLocation: true,
	minMatchCharLength: 1,
});

searchInput.addEventListener('input', () => {
	const query = searchInput.value.trim();

	if (!query) {
		node.style('opacity', 1).style('display', 'inline');
		link.style('opacity', 1).style('display', 'inline');
		simulation.alpha(1).restart();
		return;
	}

	const results = fuse.search(query);
	const matchedIds = new Set(results.map(r => r.item.id));

	node.style('opacity', d => matchedIds.has(d.id) ? 1 : 0.1);
	node.style('display', d => matchedIds.has(d.id) ? 'inline' : 'none');

	link.style('opacity', d => (matchedIds.has(d.source.id) && matchedIds.has(d.target.id)) ? 1 : 0.05);
	link.style('display', d => (matchedIds.has(d.source.id) && matchedIds.has(d.target.id)) ? 'inline' : 'none');

	if (results.length > 0) {
		const firstNode = results[0].item;
		const transform = d3.zoomIdentity
			.translate(width / 2 - firstNode.x * 1.5, height / 2 - firstNode.y * 1.5)
			.scale(1.5);
		svg.transition().duration(750).call(
			d3.zoom().transform,
			transform
		);
	}
});

const filterSelect = document.createElement('select');
filterSelect.style.position = 'fixed';
filterSelect.style.top = '10px';
filterSelect.style.right = '165px';
filterSelect.style.zIndex = 1000;
filterSelect.style.padding = '5px';
filterSelect.style.borderRadius = '4px';
['Tous', 'Scènes', 'Objets'].forEach(label => {
	const option = document.createElement('option');
	option.value = label.toLowerCase();
	option.textContent = label;
	filterSelect.appendChild(option);
});
document.body.appendChild(filterSelect);

const resultList = document.createElement('ul');
resultList.style.position = 'fixed';
resultList.style.top = '40px';
resultList.style.right = '10px';
resultList.style.zIndex = 1000;
resultList.style.maxHeight = '300px';
resultList.style.overflowY = 'auto';
resultList.style.padding = '5px';
resultList.style.margin = '0';
resultList.style.backgroundColor = '#000';
resultList.style.border = '1px solid #ccc';
resultList.style.borderRadius = '4px';
resultList.style.listStyle = 'none';
resultList.style.display = 'none';
document.body.appendChild(resultList);

function updateSearchResults(query, filter) {
	if (!query) {
		resultList.style.display = 'none';
		node.style('opacity', 1).style('display', 'inline');
		link.style('opacity', 1).style('display', 'inline');
		return;
	}

	const results = fuse.search(query)
		.map(r => r.item)
		.filter(d => {
			if (filter === 'objets') return d.id.startsWith('obj');
			if (filter === 'scènes') return !d.id.startsWith('obj');
			return true;
		});

	const matchedIds = new Set(results.map(d => d.id));

	node.style('opacity', d => matchedIds.has(d.id) ? 1 : 0.1);
	node.style('display', d => matchedIds.has(d.id) ? 'inline' : 'none');
	link.style('opacity', d => (matchedIds.has(d.source.id) && matchedIds.has(d.target.id)) ? 1 : 0.05);
	link.style('display', d => (matchedIds.has(d.source.id) && matchedIds.has(d.target.id)) ? 'inline' : 'none');

	resultList.innerHTML = '';
	resultList.style.display = results.length ? 'block' : 'none';

	for (const d of results.slice(0, 10)) {
		const li = document.createElement('li');
		li.textContent = d.id.startsWith('obj') ? d.name : formatSceneName(d.id);
		li.style.cursor = 'pointer';
		li.style.padding = '2px 6px';
		li.addEventListener('click', () => {
			const transform = d3.zoomIdentity
				.translate(width / 2 - d.x * 1.5, height / 2 - d.y * 1.5)
				.scale(1.5);
			svg.transition().duration(750).call(d3.zoom().transform, transform);
		});
		resultList.appendChild(li);
	}
}

searchInput.addEventListener('input', () => {
	const query = searchInput.value.trim();
	const filter = filterSelect.value;
	updateSearchResults(query, filter);
});

filterSelect.addEventListener('change', () => {
	const query = searchInput.value.trim();
	updateSearchResults(query, filterSelect.value);
});
