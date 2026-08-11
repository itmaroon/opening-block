import type { Attributes } from "./type";
import {
	normalizeCenterlineOrder,
	reverseCenterlinePath,
} from "./centerlinePath";

interface DynamicWelcomeSvgProps {
	attributes: Attributes;
	play: boolean;
	showCenterlines?: boolean;
	visibleCenterlineIndices?: number[];
}

const getPathTiming = (
	pathLengths: number[],
	index: number,
	totalDuration: number,
): { delay: number; duration: number; length: number } => {
	const safeLengths = pathLengths.map((length) => Math.max(0, length));
	const totalLength = safeLengths.reduce((sum, length) => sum + length, 0);
	const length = safeLengths[index] ?? 0;
	if (totalLength <= 0) {
		return {
			delay: (totalDuration * index) / Math.max(1, pathLengths.length),
			duration: totalDuration / Math.max(1, pathLengths.length),
			length: 1,
		};
	}

	const completedLength = safeLengths
		.slice(0, index)
		.reduce((sum, pathLength) => sum + pathLength, 0);
	return {
		delay: (completedLength / totalLength) * totalDuration,
		duration: Math.max(0.05, (length / totalLength) * totalDuration),
		length: Math.max(1, length),
	};
};

export default function DynamicWelcomeSvg({
	attributes,
	play,
	showCenterlines = false,
	visibleCenterlineIndices,
}: DynamicWelcomeSvgProps) {
	const {
		outline_paths,
		centerline_paths,
		path_lengths,
		centerline_order,
		centerline_reversed,
		logo_width,
		logo_height,
		logo_fillColor,
		mask_stroke_width,
		animation_duration,
	} = attributes;
	const width = Math.max(1, logo_width);
	const height = Math.max(1, logo_height);
	const previewStrokeWidth = Math.max(2, mask_stroke_width * 0.25);
	const previewMarkerRadius = Math.max(3, mask_stroke_width * 0.45);
	const previewMarkerSize = previewMarkerRadius * 2.8;
	const visibleCenterlines = new Set(
		visibleCenterlineIndices ?? centerline_paths.map((_, index) => index),
	);
	const normalizedOrder = normalizeCenterlineOrder(
		centerline_order,
		centerline_paths.length,
	);
	const orderedCenterlines = normalizedOrder.map((sourceIndex) => ({
		sourceIndex,
		path: centerline_reversed[sourceIndex]
			? reverseCenterlinePath(centerline_paths[sourceIndex])
			: centerline_paths[sourceIndex],
		length: path_lengths[sourceIndex] ?? 0,
	}));
	const orderedPathLengths = orderedCenterlines.map((item) => item.length);

	return (
		<svg
			className="welcome-dynamic-svg"
			data-centerline-count={centerline_paths.length}
			data-centerline-preview={showCenterlines ? "visible" : "hidden"}
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			preserveAspectRatio="xMidYMid meet"
		>
			<defs>
				{showCenterlines &&
					centerline_paths.map((path, index) =>
						visibleCenterlines.has(index) ? (
						<g key={`preview-markers-${index}-${path}`}>
							<marker
								id={`welcome-centerline-start-${index}`}
								markerUnits="userSpaceOnUse"
								markerWidth={previewMarkerSize}
								markerHeight={previewMarkerSize}
								viewBox={`${-previewMarkerSize / 2} ${-previewMarkerSize / 2} ${previewMarkerSize} ${previewMarkerSize}`}
								refX="0"
								refY="0"
								orient="0"
								overflow="visible"
							>
								<circle
									r={previewMarkerRadius}
									fill="white"
									stroke="#ff2d55"
									strokeWidth={previewStrokeWidth * 0.7}
								/>
								<text
									x="0"
									y="0"
									fill="#111"
									fontSize={previewMarkerRadius * 1.8}
									fontWeight="700"
									textAnchor="middle"
									dominantBaseline="central"
								>
									{index + 1}
								</text>
							</marker>
							<marker
								id={`welcome-centerline-end-${index}`}
								markerUnits="userSpaceOnUse"
								markerWidth={previewMarkerSize}
								markerHeight={previewMarkerSize}
								viewBox={`${-previewMarkerSize / 2} ${-previewMarkerSize / 2} ${previewMarkerSize} ${previewMarkerSize}`}
								refX="0"
								refY="0"
								orient="0"
								overflow="visible"
							>
								<circle
									r={previewMarkerRadius * 0.7}
									fill="none"
									stroke="#111"
									strokeWidth={previewStrokeWidth * 0.7}
								/>
							</marker>
						</g>
						) : null,
					)}
				<mask
					id="welcome-dynamic-mask"
					maskUnits="userSpaceOnUse"
					maskContentUnits="userSpaceOnUse"
					x={-mask_stroke_width}
					y={-mask_stroke_width}
					width={width + mask_stroke_width * 2}
					height={height + mask_stroke_width * 2}
					style={{ maskType: "alpha" }}
				>
					{orderedCenterlines.map((item, index) => {
						const timing = getPathTiming(
							orderedPathLengths,
							index,
							animation_duration,
						);
						return (
							<path
								key={`${item.sourceIndex}-${item.path}`}
								className="letters-svg-mask-path"
								data-welcome-animation-last={
									index === orderedCenterlines.length - 1
										? "true"
										: undefined
								}
								d={item.path}
								fill="none"
								stroke="white"
								strokeWidth={mask_stroke_width}
								strokeLinecap="butt"
								strokeLinejoin="round"
								pathLength="1"
								strokeDasharray="1 1"
								strokeDashoffset="1"
							>
								{play && (
									<animate
										attributeName="stroke-dashoffset"
										from="1"
										to="0"
										begin={`${timing.delay}s`}
										dur={`${timing.duration}s`}
										fill="freeze"
									/>
								)}
							</path>
						);
					})}
				</mask>
			</defs>
			<g
				className="welcome-dynamic-text"
				style={{ fill: logo_fillColor }}
				mask="url(#welcome-dynamic-mask)"
			>
				{outline_paths.map((path, index) => (
					<path key={`${index}-${path}`} d={path} />
				))}
			</g>
			{showCenterlines && (
				<g
					className="welcome-centerline-preview"
					aria-label="Generated centerlines"
					pointerEvents="none"
				>
					{orderedCenterlines.map((item) =>
						visibleCenterlines.has(item.sourceIndex) ? (
							<path
								key={`preview-${item.sourceIndex}-${item.path}`}
								d={item.path}
								fill="none"
								stroke="#ff2d55"
								strokeWidth={previewStrokeWidth}
								strokeLinecap="round"
								strokeLinejoin="round"
								markerStart={`url(#welcome-centerline-start-${item.sourceIndex})`}
								markerEnd={`url(#welcome-centerline-end-${item.sourceIndex})`}
							/>
						) : null,
					)}
				</g>
			)}
			<g aria-hidden="true" pointerEvents="none">
				{orderedCenterlines.map((item) => (
					<path
						key={`motion-${item.sourceIndex}-${item.path}`}
						className="welcome-motion-path"
						d={item.path}
						fill="none"
						stroke="none"
					/>
				))}
			</g>
		</svg>
	);
}
