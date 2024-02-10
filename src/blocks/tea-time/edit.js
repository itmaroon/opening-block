
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	TextControl,
	RangeControl
} from '@wordpress/components';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';

import { useEffect, useRef } from '@wordpress/element';
import '../../editor.scss';
import EndingAnime, { endingAnimation } from '../../../EndingAnime';
import SkipAnime from '../../../SkipAnime';

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


	// マウント後の最初のuseEffectの内容をスキップするためのuseRef
	const blockRef = useRef(null);
	//エンディングアニメーション関数参照用のuseRef
	const cleanupRef = useRef(null);

	const blockProps = useBlockProps({
		ref: blockRef,// ここで参照を blockProps に渡しています
		style: is_front ? {} : { zIndex: -1, opacity: 0 }//is_frontフラグによってブロックのzIndexを設定
	});

	//エンディングのハンドル
	const handleEnding = (flg) => {
		setAttributes({ is_anime: flg, is_front: flg, trigger_anime: flg }); //アニメボタンの変更、背面へ
	}

	useEffect(() => {
		if (blockRef.current) {//マウント時には実行しない
			if (trigger_anime) {
				// アニメーションを開始
				setAttributes({ is_anime: true });
				//指定時間の後に実行
				setTimeout(() => {
					//エンディングアニメーション関数の実行と参照
					cleanupRef.current = endingAnimation(blockRef.current, ending_type, handleEnding);
				}, duration * 1000);

			}
		}
		// Cleanup function
		return () => {
			// エンディングアニメーション関数のイベントリスナをクリア
			// Check if cleanup function exists, and if so, call it
			if (typeof cleanupRef.current === 'function') {
				cleanupRef.current();
			}
		}
	}, [trigger_anime]);


	return (
		<>
			<InspectorControls group="settings">
				<PanelBody title={__("Background Settings", 'opening-block')} initialOpen={true} className="back_design_ctrl">

					<PanelColorGradientSettings
						title={__("Background Color Setting", 'opening-block')}
						settings={[
							{
								colorValue: bg_Color,
								gradientValue: bg_Gradient,

								label: __("Choice color or gradient", 'opening-block'),
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

				<PanelBody title={__("Telop Settings", 'opening-block')} initialOpen={true} className="title_design_ctrl">
					<PanelRow>
						<TextControl
							label={__("Telop Settings", 'opening-block')}
							labelPosition="top"
							value={telop}
							isPressEnterToChange
							onChange={(newValue) => setAttributes({ telop: newValue })}
						/>
					</PanelRow>
					<PanelColorGradientSettings
						title={__("Color Setting", 'opening-block')}
						settings={[{
							colorValue: telop_Color,
							label: __("Telop Color", 'opening-block'),
							onColorChange: (newValue) => setAttributes({ telop_Color: newValue }),
						}
						]}
					/>
					<PanelRow className='durationCtrl'>
						<RangeControl
							value={duration}
							label={__("Animation duration", 'opening-block')}
							max={15}
							min={2}
							onChange={(val) => setAttributes({ duration: val })}
							separatorType="none"
							step={1}
							withInputField={false}
						/>

					</PanelRow>
				</PanelBody>

			</InspectorControls>

			<EndingAnime
				attributes={attributes}
				onChange={(newObj) => {
					setAttributes(newObj);
				}}
			/>

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

			<SkipAnime
				isFront={is_front}
				onChange={(enableObj) => setAttributes(enableObj)}
			/>

		</>
	);
}
