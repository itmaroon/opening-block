import { __ } from '@wordpress/i18n';

import {
	PanelBody,
	PanelRow,
	TextControl,
	Button,
	RangeControl,
	Toolbar,
	RadioControl
} from '@wordpress/components';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';

import { ReactComponent as play } from './circle-play.svg';
import { ReactComponent as toFront } from './turn-up.svg';
import { ReactComponent as toBack } from './turn-down.svg';
import { useEffect, useRef } from '@wordpress/element';
import './editor.scss';
import CustomFontFace from '../../../CustomFontFace'
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
		is_anime,
		trigger_anime,
		is_front,
		fontFamilyOptions,
		ending_type
	} = attributes;

	//単色かグラデーションかの選択
	const bgColor = bg_Color || bg_Gradient;
	const fillColor = logo_fillColor || logo_fillGradient;

	const customStyles = {
		option: (provided, state) => ({
			...provided,
			fontFamily: state.data.fontFamily,
			fontWeight: state.data.fontWeight,
			fontStyle: state.data.fontStyle,
		}),
	};
	//is_frontフラグによってブロックのzIndexを設定
	const blockProps = is_front ? useBlockProps() : useBlockProps({ style: { zIndex: -1 } });

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
		opentype.load(plugin.plugin_url + `/assets/fonts/${logo_font}`, (err, font) => {
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

	// マウント後の最初のuseEffectの内容をスキップするためのフラグ
	const strokeRef = useRef(null);

	useEffect(() => {

		if (strokeRef.current) {//マウント時には実行しない
			const iframe = document.getElementsByName('editor-canvas')[0]; // name属性を利用
			//iframeの有無で操作するドキュメント要素を峻別
			const target_doc = iframe ? (iframe.contentDocument || iframe.contentWindow.document) : document
			// 要素を取得
			const logoElement = target_doc.getElementById('logo_anime');
			const splash_logo = target_doc.getElementById('splash_logo');
			const splash = target_doc.getElementById('splash');
			const splashbg = target_doc.getElementsByClassName('splashbg')[0];
			const splashbg2 = target_doc.getElementsByClassName('splashbg2')[0];
			const splashCirclebg = target_doc.getElementsByClassName('splashCirclebg')[0];
			const fixbg = target_doc.getElementsByClassName('fixbg')[0];
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
							//ロゴのフェードアウト
							splash_logo.animate(
								[
									{ opacity: 1 },
									{ opacity: 0 }
								],
								{
									delay: 800,
									duration: 1000,
									fill: 'both'
								}
							).addEventListener("finish", () => {
								//ここからオープニング終了アニメーション
								//オープン型
								if (ending_type === 'virtical_open' || ending_type === 'horizen_open') {
									fixbg.classList.add('hide');//フェード用背景非表示
									//splash.classList.add('disappear');
									splash.animate([{ opacity: 0 }], { duration: 0, fill: 'both' });
									splashbg.classList.add('appear');//フェードアウト後appearクラス付与
									splashbg.classList.add(ending_type);//フェードアウト後クラス付与
									splashbg2.classList.add('appear');//フェードアウト後appearクラス付与
									splashbg2.classList.add(ending_type);//フェードアウト後appearクラス付与
									//最終処理
									splashbg2.addEventListener('animationend', function () {
										fixbg.classList.remove('hide');//フェード用背景非表示
										splashbg.classList.remove('appear');//フェードアウト後appearクラス付与
										splashbg.classList.remove(ending_type);//フェードアウト後appearクラス付与
										splashbg2.classList.remove('appear');//フェードアウト後appearクラス付与
										splashbg2.classList.remove(ending_type);//フェードアウト後appearクラス付与
										//splash.classList.remove('disappear');
										splash.classList.remove('hide');
										splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
										splash.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
										setAttributes({ is_anime: false }); //アニメボタンの変更
										setAttributes({ is_front: false }); //背面へ
									});
									//スライド型	
								} else if (ending_type === 'virtical_slide' || ending_type === 'horizen_slide') {
									splash.animate(
										[
											{ opacity: 1 },
											{ opacity: 0 }
										],
										{
											delay: 800,
											duration: 1000,
											fill: 'both'
										}
									).addEventListener("finish", () => {
										splashbg.classList.add('appear');//フェードアウト後appearクラス付与
										splashbg.classList.add(ending_type);//フェードアウト後appearクラス付与
										fixbg.classList.add('disappear');//フェードアウト後disappearクラス付与
										//最終処理
										fixbg.addEventListener('transitionend', function () {
											splashbg.classList.remove('appear');//フェードアウト後appearクラス削除
											splashbg.classList.remove(ending_type);//フェードアウト後appearクラス削除
											fixbg.classList.remove('disappear');//背景を戻す
											splash.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
											splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });

											setAttributes({ is_anime: false }); //アニメボタンの変更
											setAttributes({ is_front: false }); //背面へ
										});
									});
									//円形拡張型	
								} else if (ending_type === 'circle_expand') {
									splash.animate(
										[
											{ opacity: 1 },
											{ opacity: 0 }
										],
										{
											delay: 800,
											duration: 1000,
											fill: 'both'
										}
									).addEventListener("finish", () => {
										splashCirclebg.classList.add('appear');//フェードアウト後appearクラス付与
										fixbg.classList.add('disappear');//フェードアウト後disappearクラス付与
										//最終処理
										fixbg.addEventListener('transitionend', function () {
											splashCirclebg.classList.remove('appear');//フェードアウト後appearクラス削除
											fixbg.classList.remove('disappear');//背景を戻す
											splash.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
											splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
											setAttributes({ is_anime: false }); //アニメボタンの変更
											setAttributes({ is_front: false }); //背面へ
										});
									});
								}
							});
						}
					});
				});
			};

			animatePaths(paths);
		} else {
			strokeRef.current = true;
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
					<div id="splash_logo">
						<svg id="logo_anime" className="done" width="250px" height="120px" viewBox={`${-125 + logo_width / 2} ${-60 - logo_height / 2} 250 120`}>
							<g>
								{char_paths.map((path, i) => (
									<path style={{ fill: fillColor, stroke: logo_strokeColor }} key={i} d={path} />
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
		</>

	);
}
