
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	TextControl,
	Button,
	Toolbar,
	RadioControl,
	RangeControl
} from '@wordpress/components';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';
import { ReactComponent as play } from '../../../assets/icon/circle-play.svg';
import { ReactComponent as toFront } from '../../../assets/icon/turn-up.svg';
import { ReactComponent as toBack } from '../../../assets/icon/turn-down.svg';
import { useEffect, useRef } from '@wordpress/element';
import '../../editor.scss';
import { endingAnimation } from '../../../EndingAnime';

export default function Edit({ attributes, setAttributes }) {
	const {
		bg_Color,
		bg_Gradient,
		telop,
		telop_Color,
		duration,
		trigger_anime,
		is_anime,
		is_front,
		ending_type
	} = attributes;
	//テロップの文字分割
	const characters = telop.split('');
	//単色かグラデーションかの選択
	const bgColor = bg_Color || bg_Gradient;
	//is_frontフラグによってブロックのzIndexを設定
	const blockProps = is_front ? useBlockProps() : useBlockProps({ style: { zIndex: -1 } });

	// マウント後の最初のuseEffectの内容をスキップするためのフラグ
	const strokeRef = useRef(null);

	useEffect(() => {

		if (strokeRef.current) {//マウント時には実行しない
			// アニメーションを開始
			setAttributes({ is_anime: true });
			setTimeout(() => {
				endingAnimation(ending_type, setAttributes);
			}, duration * 1000);

		} else {
			strokeRef.current = true;
		}
	}, [trigger_anime]);

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody title="背景設定" initialOpen={true} className="back_design_ctrl">

					<PanelColorGradientSettings
						title={__("Background Color Setting")}
						settings={[
							{
								colorValue: bg_Color,
								gradientValue: bg_Gradient,

								label: __("Choice color or gradient"),
								onColorChange: (newValue) => {
									setAttributes({ bg_Color: newValue === undefined ? '' : newValue });
								},
								onGradientChange: (newValue) => {
									setAttributes({ bg_Gradient: newValue });
								},
							}
						]}
					/>
				</PanelBody>

				<PanelBody title="テロップ設定" initialOpen={true} className="title_design_ctrl">
					<PanelRow>
						<TextControl
							label="テロップ"
							labelPosition="top"
							value={telop}
							isPressEnterToChange
							onChange={(newValue) => setAttributes({ telop: newValue })}
						/>
					</PanelRow>
					<PanelColorGradientSettings
						title={__("Color Setting")}
						settings={[{
							colorValue: telop_Color,
							label: __("Telop Color"),
							onColorChange: (newValue) => setAttributes({ telop_Color: newValue }),
						}
						]}
					/>
					<PanelRow className='durationCtrl'>
						<RangeControl
							value={duration}
							label="アニメーションの継続時間"
							max={15}
							min={2}
							onChange={(val) => setAttributes({ duration: val })}
							separatorType="none"
							step={1}
							withInputField={false}
						/>

					</PanelRow>
				</PanelBody>
				<PanelBody title="エンディングアニメーション" initialOpen={true} className="ending_ctrl">

					<RadioControl
						selected={ending_type}
						options={[
							{ label: '縦方向スライド', value: "virtical_slide" },
							{ label: '横方向スライド', value: "horizen_slide" },
							{ label: '縦開きスライド', value: "virtical_open" },
							{ label: '横開きスライド', value: "horizen_open" },
							{ label: '円形エクスパンド', value: "circle_expand" },
						]}
						onChange={(newValue) => {
							setAttributes({ ending_type: newValue });
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<Toolbar>
					<Button
						//表示するラベルを切り替え
						label={is_anime ? "実行中" : "停止中"}
						//表示するアイコンを切り替え
						icon={play}

						//setAttributes を使って属性の値を更新（真偽値を反転）
						onClick={() => {
							setAttributes({ trigger_anime: !trigger_anime })

						}}
						disabled={!is_front || is_anime}
					/>
					<Button
						//表示するラベルを切り替え
						label={is_front ? "最背面へ" : "最前面へ"}
						//表示するアイコンを切り替え
						icon={is_front ? toBack : toFront}

						//setAttributes を使って属性の値を更新（真偽値を反転）
						onClick={() => {
							setAttributes({ is_front: !is_front })
						}}
						disabled={is_anime ? true : false}
					/>
				</Toolbar>
			</BlockControls>

			<div {...blockProps}>
				<div id="splash" style={{ background: bgColor, display: is_front ? 'block' : 'none' }}>
					<div id="splash_logo" style={{ top: '65%' }}>
						<div className="wrapper coffee">
							<div className="coffee_text" style={{ color: telop_Color }}>
								{characters.map((char, i) => (
									<span
										className={is_anime ? 'play' : ''}
										style={{ animationDelay: `${i * 0.1}s` }}
										key={i}
									>
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
		</>
	);
}
