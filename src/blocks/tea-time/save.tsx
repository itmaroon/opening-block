import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { createFontFamilyOption } from "../../fontFamily";
import type { Attributes } from "./type";

export default function save({ attributes }: { attributes: Attributes }) {
	const {
		bg_Color,
		bg_Gradient,
		telop,
		telop_Color,
		telop_font,
		duration,
		ending_type,
		is_check_enable,
	} = attributes;

	//テロップの文字分割
	const characters = telop.split("");
	//単色かグラデーションかの選択
	const bgColor = bg_Color || bg_Gradient;
	const selectedFont = createFontFamilyOption(telop_font);

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
							<div
								className="coffee_text"
								data-font-file={telop_font}
								style={{
									color: telop_Color,
									fontFamily: selectedFont?.fontFamily,
									fontWeight: selectedFont?.fontWeight,
									fontStyle: selectedFont?.fontStyle,
								}}
							>
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
}
