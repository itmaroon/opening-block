import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const {
		logo_strokeColor,
		logo_fillColor,
		logo_fillGradient,
		char_paths,
		logo_width,
		logo_height,
		bg_Color,
		bg_Gradient,
		ending_type,
		is_check_enable,
	} = attributes;

	const blockProps = useBlockProps.save({ style: { zIndex: 150 } });
	const bgColor = bg_Color || bg_Gradient;
	const fillColor = logo_fillColor || logo_fillGradient;
	return (
		<>
			<div {...blockProps}>
				<div
					id="splash"
					data-fill-color={logo_fillColor}
					data-stroke-color={logo_strokeColor}
					data-ending-type={ending_type}
					style={{ background: bgColor }}
				>
					<div id="splash_logo">
						<svg
							id="logo_anime"
							width="250px"
							height="120px"
							viewBox={`${-125 + logo_width / 2} ${
								-60 - logo_height / 2
							} 250 120`}
						>
							<g>
								{char_paths.map((path, i) => (
									<path
										style={{ fill: fillColor, stroke: logo_strokeColor }}
										key={i}
										d={path}
									/>
								))}
							</g>
						</svg>
					</div>
				</div>
				<div className="fixbg"></div>
				<div className="splashbg" style={{ background: bgColor }}></div>
				<div className="splashbg2" style={{ background: bgColor }}></div>
				<div className="splashCirclebg" style={{ background: bgColor }}></div>
			</div>
			{is_check_enable && (
				<div className="opening_check">
					<InnerBlocks.Content />
				</div>
			)}
		</>
	);
}
