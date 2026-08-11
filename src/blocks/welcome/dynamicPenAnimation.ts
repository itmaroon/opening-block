interface PenAnimationControls {
	cancel(): void;
}

const getMotionPaths = (root: ParentNode): SVGPathElement[] =>
	Array.from(
		root.querySelectorAll<SVGPathElement>(".welcome-motion-path"),
	);

const setPenPosition = (
	root: HTMLElement,
	paths: SVGPathElement[],
	progress: number,
): void => {
	const pen = root.querySelector<HTMLElement>(".letters_pen.is-dynamic");
	const letters = root.querySelector<HTMLElement>(".letters");
	if (!pen || !letters || paths.length === 0) {
		return;
	}

	const lengths = paths.map((path) => path.getTotalLength());
	const totalLength = lengths.reduce((sum, length) => sum + length, 0);
	if (totalLength <= 0) {
		return;
	}

	let remainingLength = Math.min(1, Math.max(0, progress)) * totalLength;
	let pathIndex = 0;
	while (
		pathIndex < paths.length - 1 &&
		remainingLength > lengths[pathIndex]
	) {
		remainingLength -= lengths[pathIndex];
		pathIndex += 1;
	}

	const path = paths[pathIndex];
	const pathLength = lengths[pathIndex];
	const point = path.getPointAtLength(Math.min(remainingLength, pathLength));
	const matrix = path.getScreenCTM();
	if (!matrix) {
		return;
	}

	const screenPoint = new DOMPoint(point.x, point.y).matrixTransform(matrix);
	const lettersRect = letters.getBoundingClientRect();
	pen.style.left = `${screenPoint.x - lettersRect.left}px`;
	pen.style.top = `${screenPoint.y - lettersRect.top}px`;
};

export const positionDynamicPenAtStart = (root: HTMLElement): void => {
	setPenPosition(root, getMotionPaths(root), 0);
};

export const animateDynamicPen = (
	root: HTMLElement,
	durationSeconds: number,
): PenAnimationControls => {
	const paths = getMotionPaths(root);
	const duration = Math.max(0.001, durationSeconds) * 1000;
	let animationFrame = 0;
	let cancelled = false;
	const startTime = performance.now();

	const update = (currentTime: number) => {
		if (cancelled) {
			return;
		}

		const progress = Math.min(1, (currentTime - startTime) / duration);
		setPenPosition(root, paths, progress);
		if (progress < 1) {
			animationFrame = window.requestAnimationFrame(update);
		}
	};

	setPenPosition(root, paths, 0);
	animationFrame = window.requestAnimationFrame(update);

	return {
		cancel: () => {
			cancelled = true;
			window.cancelAnimationFrame(animationFrame);
		},
	};
};
