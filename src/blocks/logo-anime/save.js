
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		logo_strokeColor,
		logo_fillColor,
		char_paths,
		logo_width,
		logo_height,
		is_front
	} = attributes;
	const blockProps = is_front ? useBlockProps.save() : useBlockProps.save({ style: { zIndex: -1 } });
	return (
		<div {...blockProps}>
			<div
				id="splash"
				data-fill-color={logo_fillColor}
				data-stroke-color={logo_strokeColor}
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
			<div id="svg_file"></div>
		</div>
	);
}
