import opentype from "opentype.js";
import {
	findMats,
	getBranches,
	getMatCurveToNext,
	getPathsFromStr,
	type CpNode,
} from "flo-mat";

export interface WelcomePathGeometry {
	outlinePaths: string[];
	centerlinePaths: string[];
	pathLengths: number[];
	width: number;
	height: number;
}

interface GenerateWelcomePathOptions {
	text: string;
	fontFile: string;
	fontSize: number;
	letterGap: number;
	skeletonScale: number;
}

type Point = [number, number];
type Bezier = number[][];

const fontRequests = new Map<string, Promise<any>>();

const loadFont = (fontFile: string): Promise<any> => {
	const fontUrl = `${opening_block.plugin_url}/assets/fonts/${fontFile}`;
	const cachedRequest = fontRequests.get(fontUrl);
	if (cachedRequest) {
		return cachedRequest;
	}

	const request = new Promise<any>((resolve, reject) => {
		opentype.load(fontUrl, (error, font) => {
			if (error || !font) {
				reject(
					new Error(`Could not load font ${fontFile}: ${String(error)}`),
				);
				return;
			}
			resolve(font);
		});
	}).catch((error: unknown) => {
		fontRequests.delete(fontUrl);
		throw error;
	});

	fontRequests.set(fontUrl, request);
	return request;
};

const distance = (first: number[], second: number[]): number =>
	Math.hypot(second[0] - first[0], second[1] - first[1]);

const pointsEqual = (first: number[], second: number[]): boolean =>
	distance(first, second) < 0.001;

const evaluateBezier = (curve: Bezier, t: number): Point => {
	let points = curve.map(([x, y]) => [x, y] as Point);
	while (points.length > 1) {
		points = points.slice(0, -1).map((point, index) => {
			const nextPoint = points[index + 1];
			return [
				point[0] + (nextPoint[0] - point[0]) * t,
				point[1] + (nextPoint[1] - point[1]) * t,
			] as Point;
		});
	}
	return points[0];
};

const getBezierLength = (curve: Bezier): number => {
	const sampleCount = 16;
	let length = 0;
	let previousPoint = evaluateBezier(curve, 0);
	for (let index = 1; index <= sampleCount; index += 1) {
		const point = evaluateBezier(curve, index / sampleCount);
		length += distance(previousPoint, point);
		previousPoint = point;
	}
	return length;
};

const formatNumber = (value: number): string =>
	Number(value.toFixed(3)).toString();

const appendBezier = (curve: Bezier): string => {
	const endPoint = curve[curve.length - 1];
	if (curve.length === 2) {
		return `L ${formatNumber(endPoint[0])} ${formatNumber(endPoint[1])}`;
	}
	if (curve.length === 3) {
		return `Q ${formatNumber(curve[1][0])} ${formatNumber(curve[1][1])} ${formatNumber(endPoint[0])} ${formatNumber(endPoint[1])}`;
	}
	return `C ${formatNumber(curve[1][0])} ${formatNumber(curve[1][1])} ${formatNumber(curve[2][0])} ${formatNumber(curve[2][1])} ${formatNumber(endPoint[0])} ${formatNumber(endPoint[1])}`;
};

const branchToPath = (branch: CpNode[]): { path: string; length: number } | null => {
	if (branch.length === 0) {
		return null;
	}

	const curves = branch.map((node) => getMatCurveToNext(node));
	if (curves.length === 0 || curves[0].length < 2) {
		return null;
	}

	const pathParts: string[] = [];
	let previousEnd: number[] | null = null;
	let length = 0;

	curves.forEach((originalCurve) => {
		let curve = originalCurve;
		if (
			previousEnd &&
			!pointsEqual(previousEnd, curve[0]) &&
			pointsEqual(previousEnd, curve[curve.length - 1])
		) {
			curve = [...curve].reverse();
		}

		if (!previousEnd || !pointsEqual(previousEnd, curve[0])) {
			pathParts.push(
				`M ${formatNumber(curve[0][0])} ${formatNumber(curve[0][1])}`,
			);
		}
		pathParts.push(appendBezier(curve));
		length += getBezierLength(curve);
		previousEnd = curve[curve.length - 1];
	});

	return length > 0
		? { path: pathParts.join(" "), length: Number(length.toFixed(3)) }
		: null;
};

const createCenterlines = (
	outlinePath: string,
	skeletonScale: number,
): Array<{ path: string; length: number }> => {
	const loops = getPathsFromStr(outlinePath);
	const mats = findMats(loops, {
		applySat: true,
		satScale: Math.max(1, skeletonScale),
		simplify: true,
		simplifyTolerance: 0.25,
		maxCurviness: 0.1,
		maxLength: 24,
	});

	return mats
		.flatMap((mat) => getBranches(mat.cpNode))
		.map(branchToPath)
		.filter(
			(
				entry,
			): entry is {
				path: string;
				length: number;
			} => entry !== null && entry.length >= 0.5,
		)
		.sort((first, second) => {
			const firstMatch = first.path.match(/^M\s+([\d.-]+)\s+([\d.-]+)/);
			const secondMatch = second.path.match(/^M\s+([\d.-]+)\s+([\d.-]+)/);
			const firstX = Number(firstMatch?.[1] ?? 0);
			const secondX = Number(secondMatch?.[1] ?? 0);
			return firstX - secondX;
		});
};

export const generateWelcomePaths = async ({
	text,
	fontFile,
	fontSize,
	letterGap,
	skeletonScale,
}: GenerateWelcomePathOptions): Promise<WelcomePathGeometry> => {
	if (!text || !fontFile) {
		return {
			outlinePaths: [],
			centerlinePaths: [],
			pathLengths: [],
			width: 0,
			height: 0,
		};
	}

	const font = await loadFont(fontFile);
	const renderOptions = {
		kerning: true,
		letterSpacing: fontSize > 0 ? letterGap / fontSize : 0,
	};
	const initialPath = font.getPath(text, 0, 0, fontSize, renderOptions);
	const initialBounds = initialPath.getBoundingBox();
	const normalizedPath = font.getPath(
		text,
		-initialBounds.x1,
		-initialBounds.y1,
		fontSize,
		renderOptions,
	);
	const bounds = normalizedPath.getBoundingBox();
	const outlinePath = normalizedPath.toPathData(3);
	const centerlines = createCenterlines(outlinePath, skeletonScale);

	return {
		outlinePaths: outlinePath ? [outlinePath] : [],
		centerlinePaths: centerlines.map((entry) => entry.path),
		pathLengths: centerlines.map((entry) => entry.length),
		width: Number(Math.max(0, bounds.x2 - bounds.x1).toFixed(3)),
		height: Number(Math.max(0, bounds.y2 - bounds.y1).toFixed(3)),
	};
};
