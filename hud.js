const HUD = true;

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