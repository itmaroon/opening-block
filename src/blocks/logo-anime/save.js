
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		logo_strokeColor,
		logo_fillColor,
		char_paths,
		logo_width,
		logo_height,
		bg_Color,
		bg_Gradient,
		ending_type
	} = attributes;
	const blockProps = useBlockProps.save();
	const bgColor = bg_Color || bg_Gradient;
	return (
		<div {...blockProps}>
			<div
				id="splash"
				data-fill-color={logo_fillColor}
				data-stroke-color={logo_strokeColor}
				data-ending-type={ending_type}
				style={{ background: bgColor }}
			>
				<div id="splash_logo">
					<svg id="logo_anime" width="250px" height="120px" viewBox={`${-125 + logo_width / 2} ${-60 - logo_height / 2} 250 120`}>
						<g>
							{char_paths.map((path, i) => (
								<path key={i} d={path} />
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
	);
}
