
import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		logo_strokeColor,
		logo_fillColor,
		char_paths
	} = attributes;
	return (
		<div {...useBlockProps.save()}>
			<div
				id="splash"
				data-fill-color={logo_fillColor}
				data-stroke-color={logo_strokeColor}
			>
				<div id="splash_logo">
					<svg id="logo_anime" width="1010.6px" height="121px" viewBox="0 0 1010.6 121">
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