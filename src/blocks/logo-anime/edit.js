import { __ } from '@wordpress/i18n';

import {
	PanelBody,
	PanelRow,
	TextControl,
	RangeControl,
} from '@wordpress/components';
import {
	useBlockProps,
	InspectorControls,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';
import '../../editor.scss';
import CustomFontFace from '../../../CustomFontFace';
import EndingAnime, { endingAnimation } from '../../../EndingAnime';
import opentype from 'opentype.js';
import Select from 'react-select';

export default function Edit({ attributes, setAttributes }) {
	const {
		bg_Color,
		bg_Gradient,
		logo_text,
		logo_font,
		char_paths,
		logo_size,
		logo_width,
		logo_height,
		logo_gap,
		logo_strokeColor,
		logo_fillColor,
		logo_fillGradient,
		trigger_anime,
		is_front,
		fontFamilyOptions,
		ending_type
	} = attributes;



	//単色かグラデーションかの選択
	const bgColor = bg_Color || bg_Gradient;
	const fillColor = logo_fillColor || logo_fillGradient;
	//フォント選択selectボックスオプションのカスタムスタイル
	const customStyles = {
		option: (provided, state) => ({
			...provided,
			fontFamily: state.data.fontFamily,
			fontWeight: state.data.fontWeight,
			fontStyle: state.data.fontStyle,
		}),
	};
	// ブロック参照用のuseRef
	const blockRef = useRef(null);
	//エンディングアニメーション関数参照用のuseRef
	const cleanupRef = useRef(null);

	const blockProps = useBlockProps({
		ref: blockRef,// ここで参照を blockProps に渡しています
		style: is_front ? { zIndex: 100 } : { zIndex: -1, opacity: 0 }//is_frontフラグによってブロックのzIndexを設定
	});

	//フォントのセレクトオブジェクト
	const FontSelect = ({ label, value }) => (
		<>
			{label && <label className="components-base-control__label">{label}</label>}
			<Select
				options={fontFamilyOptions}
				value={fontFamilyOptions.find((option) => option.value === value)}
				onChange={(newOption) => {
					setAttributes({ logo_font: newOption ? newOption.value : '' })
				}}
				styles={customStyles}
			/>
		</>
	);

	useEffect(() => {
		opentype.load(opening_block.plugin_url + `/assets/fonts/${logo_font}`, (err, font) => {
			if (err) {
				console.error('Could not load the font: ' + err);
			} else {
				const char_arr = logo_text.split('');
				let path_arr = [];
				let path_width = 0;
				let path_height = 0;
				char_arr.map((char, i) => {
					const pathObj = font.getPath(char, path_width, 0, logo_size);
					const bbox = pathObj.getBoundingBox();
					path_width += bbox.x2 - bbox.x1 + logo_gap;
					path_height = path_height > (bbox.y2 - bbox.y1) ? path_height : (bbox.y2 - bbox.y1)
					path_arr.push(pathObj.toPathData());
				})
				//SVG情報の記録
				setAttributes({ logo_width: path_width })
				setAttributes({ logo_height: path_height })
				setAttributes({ char_paths: path_arr })
			}
		});
	}, [logo_text, logo_font, logo_size, logo_gap]);

	useEffect(() => {
		if (blockRef.current) {//マウント時には実行しない
			if (trigger_anime) {
				// 要素を取得
				const logoElement = blockRef.current.querySelector('#logo_anime')

				//パスの初期化
				const paths = logoElement.getElementsByTagName('path');

				for (let path of paths) {
					const length = path.getTotalLength();
					path.style.strokeDasharray = length;
					path.style.strokeDashoffset = length;
				}

				// アニメーションを開始
				setAttributes({ is_anime: true }); // アニメーション開始
				logoElement.classList.remove('done');
				//エンディングのハンドル
				const handleEnding = (flg) => {
					setAttributes({ is_anime: flg, is_front: flg, trigger_anime: flg }); //アニメボタンの変更、背面へ
				}

				const animatePaths = (paths) => {
					Array.from(paths).forEach((path, index) => {
						const length = path.getTotalLength();

						path.animate(
							[{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
							{ duration: 1000, fill: "both", delay: index * 800 }
						).addEventListener("finish", () => {
							// アニメーション終了
							if (index === paths.length - 1) {
								logoElement.classList.add("done");
								// Reset all paths
								for (let path of paths) {
									path.style.strokeDashoffset = "";
									path.style.strokeDasharray = "";
								}

								//エンディングアニメーション関数の実行と参照
								cleanupRef.current = endingAnimation(blockRef.current, ending_type, handleEnding);
							}
						});
					});
				};

				animatePaths(paths);
			}
		}
		// Cleanup function
		return () => {
			// Check if cleanup function exists, and if so, call it
			if (typeof cleanupRef.current === 'function') {
				cleanupRef.current();
			}
		}
	}, [trigger_anime]);

	return (
		<>
			<CustomFontFace
				attributes={attributes}
				setAttributes={setAttributes}
			/>

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
				<PanelBody title="ロゴ設定" initialOpen={true} className="logo_design_ctrl">
					<PanelRow>
						<TextControl
							label="ロゴ文字"
							labelPosition="top"
							value={logo_text}
							isPressEnterToChange
							onChange={(newValue) => setAttributes({ logo_text: newValue })}
						/>
					</PanelRow>
					<FontSelect
						label="フォントファミリー"
						value={logo_font}
					/>
					<PanelRow className='logoSizeCtrl'>
						<RangeControl
							value={logo_size}
							label="ロゴの大きさ"
							max={100}
							min={10}
							onChange={(val) => setAttributes({ logo_size: val })}
							separatorType="none"
							step={5}
							withInputField={false}
						/>

					</PanelRow>
					<PanelRow className='logoSizeCtrl'>
						<RangeControl
							value={logo_gap}
							label="ロゴの間隔"
							max={20}
							min={1}
							onChange={(val) => setAttributes({ logo_gap: val })}
							separatorType="none"
							step={1}
							withInputField={false}
						/>

					</PanelRow>
					<PanelColorGradientSettings
						title={__("Logo Color Setting")}
						settings={[{
							colorValue: logo_strokeColor,
							label: __("Stroke color"),
							onColorChange: (newValue) => setAttributes({ logo_strokeColor: newValue }),
						},

						{
							colorValue: logo_fillColor,
							gradientValue: logo_fillGradient,

							label: __("Fill color"),
							onColorChange: (newValue) => setAttributes({ logo_fillColor: newValue }),
							onGradientChange: (newValue) => setAttributes({ logo_fillGradient: newValue }),
						}
						]}
					/>
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
					<div id="splash_logo">
						<svg
							id="logo_anime"
							className="done"
							width="250px"
							height="120px"
							viewBox={`${-125 + logo_width / 2} ${-60 - logo_height / 2} 250 120`}
						>
							<g>
								{char_paths.map((path, i) => {
									return (<path key={i} style={{ fill: fillColor, stroke: logo_strokeColor }} d={path} />)
								}
								)}
							</g>
						</svg>
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
