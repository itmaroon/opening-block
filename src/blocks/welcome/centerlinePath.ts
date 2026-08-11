interface Point {
	x: number;
	y: number;
}

interface PathSegment {
	command: "L" | "Q" | "C";
	start: Point;
	controls: Point[];
	end: Point;
}

interface Subpath {
	start: Point;
	segments: PathSegment[];
}

const formatNumber = (value: number): string =>
	Number(value.toFixed(3)).toString();

const formatPoint = (point: Point): string =>
	`${formatNumber(point.x)} ${formatNumber(point.y)}`;

const parseCenterlinePath = (path: string): Subpath[] | null => {
	const tokens =
		path.match(/[MLQC]|[-+]?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi) ?? [];
	const subpaths: Subpath[] = [];
	let tokenIndex = 0;
	let currentPoint: Point | null = null;
	let currentSubpath: Subpath | null = null;

	const readPoint = (): Point | null => {
		const x = Number(tokens[tokenIndex]);
		const y = Number(tokens[tokenIndex + 1]);
		if (!Number.isFinite(x) || !Number.isFinite(y)) {
			return null;
		}
		tokenIndex += 2;
		return { x, y };
	};

	while (tokenIndex < tokens.length) {
		const command = tokens[tokenIndex]?.toUpperCase();
		tokenIndex += 1;
		if (command === "M") {
			const point = readPoint();
			if (!point) {
				return null;
			}
			currentPoint = point;
			currentSubpath = { start: point, segments: [] };
			subpaths.push(currentSubpath);
			continue;
		}

		if (!currentPoint || !currentSubpath) {
			return null;
		}

		const controlCount = command === "C" ? 2 : command === "Q" ? 1 : 0;
		if (command !== "L" && command !== "Q" && command !== "C") {
			return null;
		}

		const controls: Point[] = [];
		for (let index = 0; index < controlCount; index += 1) {
			const control = readPoint();
			if (!control) {
				return null;
			}
			controls.push(control);
		}
		const end = readPoint();
		if (!end) {
			return null;
		}
		currentSubpath.segments.push({
			command,
			start: currentPoint,
			controls,
			end,
		});
		currentPoint = end;
	}

	return subpaths.length > 0 ? subpaths : null;
};

export const reverseCenterlinePath = (path: string): string => {
	const subpaths = parseCenterlinePath(path);
	if (!subpaths) {
		return path;
	}

	return [...subpaths]
		.reverse()
		.map((subpath) => {
			const lastSegment = subpath.segments[subpath.segments.length - 1];
			if (!lastSegment) {
				return `M ${formatPoint(subpath.start)}`;
			}

			const parts = [`M ${formatPoint(lastSegment.end)}`];
			[...subpath.segments].reverse().forEach((segment) => {
				const controls = [...segment.controls].reverse();
				if (segment.command === "L") {
					parts.push(`L ${formatPoint(segment.start)}`);
				} else if (segment.command === "Q") {
					parts.push(
						`Q ${formatPoint(controls[0])} ${formatPoint(segment.start)}`,
					);
				} else {
					parts.push(
						`C ${formatPoint(controls[0])} ${formatPoint(controls[1])} ${formatPoint(segment.start)}`,
					);
				}
			});
			return parts.join(" ");
		})
		.join(" ");
};

export const normalizeCenterlineOrder = (
	order: number[],
	centerlineCount: number,
): number[] => {
	const normalized = order.filter(
		(index, position) =>
			Number.isInteger(index) &&
			index >= 0 &&
			index < centerlineCount &&
			order.indexOf(index) === position,
	);
	for (let index = 0; index < centerlineCount; index += 1) {
		if (!normalized.includes(index)) {
			normalized.push(index);
		}
	}
	return normalized;
};
