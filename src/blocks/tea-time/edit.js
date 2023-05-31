
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	TextControl
} from '@wordpress/components';
import {
	useBlockProps,
	InspectorControls

} from '@wordpress/block-editor';

import './editor.scss';


export default function Edit({ attributes, setAttributes }) {
	const {
		telop
	} = attributes;
	const characters = telop.split('');

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody title="表示設定" initialOpen={true} className="title_design_ctrl">
					<PanelRow>
						<TextControl
							label="テロップ"
							labelPosition="top"
							value={telop}
							isPressEnterToChange
							onChange={(newValue) => setAttributes({ telop: newValue })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...useBlockProps()}>
				<div className="wrapper coffee">
					<div className="coffee_text">
						{characters.map((char, i) => (
							<span style={{ animationDelay: `${i * 0.1}s` }} key={i}>
								{char}
							</span>
						))}
					</div>

					<span className="coffee_cup"></span>
				</div>
			</div>
		</>
	);
}
