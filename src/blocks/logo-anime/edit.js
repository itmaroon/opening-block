import { __ } from '@wordpress/i18n';

import {
	PanelBody,
	PanelRow,
	TextControl,
	Button,
	RangeControl,
	Toolbar
} from '@wordpress/components';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from '@wordpress/block-editor';

import { ReactComponent as play } from './circle-play.svg';
import { ReactComponent as pause } from './circle-pause.svg';
import { useEffect, useRef } from '@wordpress/element';
import './editor.scss';
import CustomFontFace from '../../../CustomFontFace'
import opentype from 'opentype.js';
import Select from 'react-select';

export default function Edit({ attributes, setAttributes }) {
	const {
		logo_text,
		logo_font,
		char_paths,
		logo_size,
		logo_gap,
		logo_strokeColor,
		logo_fillColor,
		logo_fillGradient,
		is_anime,
		trigger_anime,
		fontFamilyOptions
	} = attributes;

	//単色かグラデーションかの選択
	const fillColor = logo_fillColor || logo_fillGradient;

	const customStyles = {
		option: (provided, state) => ({
			...provided,
			fontFamily: state.data.fontFamily,
			fontWeight: state.data.fontWeight,
			fontStyle: state.data.fontStyle,
		}),
	};

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
				{
					char_arr.map((char, i) => {
						const pathObj = font.getPath(char, path_width, 0, logo_size);
						const bbox = pathObj.getBoundingBox();
						path_width += bbox.x2 - bbox.x1 + logo_gap;
						path_arr.push(pathObj.toPathData());
					})
				}

				setAttributes({ char_paths: path_arr })
			}
		});
	}, [logo_text, logo_font, logo_size, logo_gap]);

	// Vivusインスタンスを保持するためのrefを作成します。
	const strokeRef = useRef(null);

	useEffect(() => {
		if (strokeRef.current) {
			//一旦クラスを削除
			document.getElementById('logo_anime').classList.remove('done');
			strokeRef.current = new Vivus('logo_anime', {
				start: 'manual',
				type: 'scenario-sync',
				duration: 30,
				forceRender: false,
				animTimingFunction: Vivus.EASE,
			}, function () {
				document.getElementById('logo_anime').classList.add('done');
				setAttributes({ is_anime: false });//アニメーション終了
			});
			strokeRef.current.reset().play();
			setAttributes({ is_anime: true });//アニメーション実行中
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
							max={200}
							min={50}
							onChange={(val) => setAttributes({ logo_size: val })}
							separatorType="none"
							step={10}
							withInputField={false}
						/>

					</PanelRow>
					<PanelRow className='logoSizeCtrl'>
						<RangeControl
							value={logo_gap}
							label="ロゴの間隔"
							max={100}
							min={10}
							onChange={(val) => setAttributes({ logo_gap: val })}
							separatorType="none"
							step={5}
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

			<BlockControls>
				<Toolbar>
					<Button
						//属性 isEditMode の値により表示するラベルを切り替え
						label={is_anime ? "実行中" : "停止中"}
						//属性 isEditMode の値により表示するアイコンを切り替え
						icon={is_anime ? pause : play}

						//setAttributes を使って属性の値を更新（真偽値を反転）
						onClick={() => {
							setAttributes({ trigger_anime: !trigger_anime })
						}}
					/>
				</Toolbar>
			</BlockControls>

			<div {...useBlockProps()}>
				<div id="splash">
					<div id="splash_logo">
						<svg id="logo_anime" width="1010.6px" height="121px" viewBox="0 0 1010.6 121">

							<g>
								{char_paths.map((path, i) => (
									is_anime
										? <path style={{ fill: "none", stroke: logo_strokeColor }} key={i} d={path} />
										: <path style={{ fill: fillColor, fillOpacity: 1, stroke: "none" }} key={i} d={path} />

								))}
							</g>
						</svg>
					</div>
				</div>

			</div>
		</>

	);
}
