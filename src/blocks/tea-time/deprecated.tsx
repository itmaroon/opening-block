import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

interface DeprecatedAttributes {
	bg_Color: string;
	bg_Gradient?: string;
	telop: string;
	telop_Color: string;
	duration: number;
	ending_type: string;
	is_check_enable: boolean;
}

export const deprecatedAttributes = {
	bg_Color: {
		type: "string",
		default: "#F1E8E8",
	},
	bg_Gradient: {
		type: "string",
	},
	telop: {
		type: "string",
		default: "Let's coffee break",
	},
	telop_Color: {
		type: "string",
		default: "#000",
	},
	duration: {
		type: "number",
		default: 5,
	},
	trigger_anime: {
		type: "boolean",
		default: false,
	},
	is_anime: {
		type: "boolean",
		default: false,
	},
	is_front: {
		type: "boolean",
		default: true,
	},
	ending_type: {
		type: "string",
		default: "virtical_slide",
	},
	is_check_enable: {
		type: "boolean",
		default: true,
	},
};

export const deprecatedSave = ({
	attributes,
}: {
	attributes: DeprecatedAttributes;
}) => {
	const {
		bg_Color,
		bg_Gradient,
		telop,
		telop_Color,
		duration,
		ending_type,
		is_check_enable,
	} = attributes;
	const characters = telop.split("");
	const bgColor = bg_Color || bg_Gradient;

	return (
		<>
			<div {...useBlockProps.save({ style: { zIndex: 150 } })}>
				<div
					id="splash"
					data-ending-type={ending_type}
					data-duration={duration}
					style={{ background: bgColor }}
				>
					<div id="splash_logo" style={{ top: "65%" }}>
						<div className="wrapper coffee">
							<div className="coffee_text" style={{ color: telop_Color }}>
								{characters.map((character, index) => (
									<span
										className="play"
										style={{ animationDelay: `${index * 0.1}s` }}
										key={index}
									>
										{character}
									</span>
								))}
							</div>
							<span className="coffee_cup"></span>
						</div>
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
};
