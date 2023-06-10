
import { useBlockProps } from '@wordpress/block-editor';


export default function save({ attributes }) {
	const {
		bg_Color,
		bg_Gradient,
		telop,
		telop_Color,
		duration,
		ending_type
	} = attributes;
	//フロントは全面表示
	const frontStyle = {
		style: {
			zIndex: 9999,
		}
	}
	//テロップの文字分割
	const characters = telop.split('');
	//単色かグラデーションかの選択
	const bgColor = bg_Color || bg_Gradient;
	return (
		<div {...useBlockProps.save(frontStyle)}>
			<div id="splash"
				data-ending-type={ending_type}
				data-duration={duration}
				style={{ background: bgColor }}
			>
				<div id="splash_logo" style={{ top: '65%' }}>
					<div className="wrapper coffee">
						<div className="coffee_text" style={{ color: telop_Color }}>
							{characters.map((char, i) => (
								<span className='play' style={{ animationDelay: `${i * 0.1}s` }} key={i}>
									{char}
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
	);
}