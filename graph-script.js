const nodesMap = new Map();
const links = [];

for (const { from, to } of doors.values()) {
	if (!nodesMap.has(from)) nodesMap.set(from, { id: from });
	if (!nodesMap.has(to)) nodesMap.set(to, { id: to });
	links.push({ source: from, target: to });
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
	.force("link", d3.forceLink(links).id(d => d.id).distance(100))
	.force("charge", d3.forceManyBody().strength(-300))
	.force("center", d3.forceCenter(width / 2, height / 2));

const zoomLayer = svg.append("g");

const link = zoomLayer.append("g")
	.attr("stroke", "#888")
	.selectAll("line")
	.data(links)
	.join("line")
	.attr("class", "link");

const node = zoomLayer.append("g")
	.selectAll("g")
	.data(nodes)
	.join("g")
	.attr("class", "node")
	.call(drag(simulation));

node.append("circle")
	.attr("r", 36);

node.append("text")
	.attr("text-anchor", "middle")
	.attr("dy", 2)
	.text(d => d.id);

simulation.on("tick", () => {
	link
	.attr("x1", d => d.source.x)
	.attr("y1", d => d.source.y)
	.attr("x2", d => d.target.x)
	.attr("y2", d => d.target.y);

	node.attr("transform", d => `translate(${d.x},${d.y})`);
});

node.on("click", (event, d) => {
	window.location.href = `index.html?scene=${encodeURIComponent(d.id)}`;
});

function drag(simulation) {
	return d3.drag()
	.on("start", event => {
		if (!event.active) simulation.alphaTarget(0.3).restart();
		event.subject.fx = event.subject.x;
		event.subject.fy = event.subject.y;
	})
	.on("drag", event => {
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	})
	.on("end", event => {
		if (!event.active) simulation.alphaTarget(0);
		event.subject.fx = null;
		event.subject.fy = null;
	});
}