import { __ } from "@wordpress/i18n";
import type { BlockEditProps } from "@wordpress/blocks";
import {
	PanelBody,
	PanelRow,
	TextControl,
	RangeControl,
} from "@wordpress/components";
import {
	useBlockProps,
	InspectorControls,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from "@wordpress/block-editor";
import { useEffect, useRef } from "@wordpress/element";
import opentype from "opentype.js";
import Select from "react-select";

import "../../editor.scss";
import EndingAnime, { endingAnimation } from "../../EndingAnime";
import SkipAnime from "../../SkipAnime";
import {
	useFontFamilyOptions,
	type FontFamilyOption,
} from "../../useFontFamilyOptions";
import type { Attributes } from "./type";

interface FontSelectProps {
	label?: string;
	value: string;
}

interface SelectStyleState {
	data: FontFamilyOption;
}

export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<Attributes>) {
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
		ending_type,
	} = attributes;

	//単色かグラデーションかの選択
	const bgColor = bg_Color || bg_Gradient;
	const fillColor = logo_fillColor || logo_fillGradient;
	const fontFamilyOptions = useFontFamilyOptions();
	//フォント選択selectボックスオプションのカスタムスタイル
	const customStyles = {
		option: (
			provided: Record<string, unknown>,
			state: SelectStyleState,
		) => ({
			...provided,
			fontFamily: state.data.fontFamily,
			fontWeight: state.data.fontWeight,
			fontStyle: state.data.fontStyle,
		}),
	};
	// ブロック参照用のuseRef
	const blockRef = useRef<HTMLDivElement | null>(null);
	//エンディングアニメーション関数参照用のuseRef
	const cleanupRef = useRef<(() => void) | null>(null);
	const blockProps = useBlockProps({
		ref: blockRef,
		style: is_front ? { zIndex: 150 } : { zIndex: -1, opacity: 0 },
	});

	//フォントのセレクトオブジェクト
	const FontSelect = ({ label, value }: FontSelectProps) => (
		<>
			{label && (
				<label className="components-base-control__label">{label}</label>
			)}
			<Select
				options={fontFamilyOptions}
				value={fontFamilyOptions.find((option) => option.value === value)}
				onChange={(newOption: FontFamilyOption | null) => {
					setAttributes({ logo_font: newOption?.value ?? "" });
				}}
				styles={customStyles}
			/>
		</>
	);

	useEffect(() => {
		opentype.load(
			`${opening_block.plugin_url}/assets/fonts/${logo_font}`,
			(error, font) => {
				if (error || !font) {
					console.error(`Could not load the font: ${String(error)}`);
					return;
				}

				const pathData: string[] = [];
				let pathWidth = 0;
				let pathHeight = 0;
				logo_text.split("").forEach((character) => {
					const path = font.getPath(character, pathWidth, 0, logo_size);
					const boundingBox = path.getBoundingBox();
					pathWidth += boundingBox.x2 - boundingBox.x1 + logo_gap;
					pathHeight = Math.max(
						pathHeight,
						boundingBox.y2 - boundingBox.y1,
					);
					pathData.push(path.toPathData());
				});

				//SVG情報の記録
				setAttributes({
					logo_width: pathWidth,
					logo_height: pathHeight,
					char_paths: pathData,
				});
			},
		);
	}, [logo_text, logo_font, logo_size, logo_gap]);

	useEffect(() => {
		if (blockRef.current && trigger_anime) {
			const logoElement = blockRef.current.querySelector<SVGSVGElement>(
				"#logo_anime",
			);
			if (!logoElement) {
				return;
			}

			const paths = logoElement.getElementsByTagName("path");
			for (const path of paths) {
				const length = path.getTotalLength();
				path.style.strokeDasharray = String(length);
				path.style.strokeDashoffset = String(length);
			}

			setAttributes({ is_anime: true });
			logoElement.classList.remove("done");

			const handleEnding = (flag: boolean) => {
				setAttributes({
					is_anime: flag,
					is_front: flag,
					trigger_anime: flag,
				});
			};

			Array.from(paths).forEach((path, index) => {
				const length = path.getTotalLength();
				path
					.animate(
						[{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
						{ duration: 1000, fill: "both", delay: index * 800 },
					)
					.addEventListener("finish", () => {
						if (index !== paths.length - 1) {
							return;
						}

						logoElement.classList.add("done");
						for (const pathToReset of paths) {
							pathToReset.style.strokeDashoffset = "";
							pathToReset.style.strokeDasharray = "";
						}

						if (blockRef.current) {
							cleanupRef.current = endingAnimation(
								blockRef.current,
								ending_type,
								handleEnding,
							);
						}
					});
			});
		}

		return () => {
			cleanupRef.current?.();
		};
	}, [trigger_anime]);

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					title={__("Background Settings", "opening-block")}
					initialOpen={true}
					className="back_design_ctrl"
				>
					<PanelColorGradientSettings
						title={__("Background Color Setting", "opening-block")}
						settings={[
							{
								colorValue: bg_Color,
								gradientValue: bg_Gradient,
								label: __("Choice color or gradient", "opening-block"),
								onColorChange: (newValue?: string) => {
									setAttributes({ bg_Color: newValue ?? "" });
								},
								onGradientChange: (newValue?: string) => {
									setAttributes({ bg_Gradient: newValue });
								},
							},
						]}
					/>
				</PanelBody>
				<PanelBody
					title={__("Logo Settings", "opening-block")}
					initialOpen={true}
					className="logo_design_ctrl"
				>
					<PanelRow>
						<TextControl
							label={__("Logo Letters", "opening-block")}
							labelPosition="top"
							value={logo_text}
							isPressEnterToChange
							onChange={(newValue: string) =>
								setAttributes({ logo_text: newValue })
							}
						/>
					</PanelRow>
					<FontSelect
						label={__("Font Family", "opening-block")}
						value={logo_font}
					/>
					<PanelRow className="logoSizeCtrl">
						<RangeControl
							value={logo_size}
							label={__("Logo Size", "opening-block")}
							max={100}
							min={10}
							onChange={(value: number) =>
								setAttributes({ logo_size: value })
							}
							separatorType="none"
							step={5}
							withInputField={false}
						/>
					</PanelRow>
					<PanelRow className="logoSizeCtrl">
						<RangeControl
							value={logo_gap}
							label={__("Logo Spacing", "opening-block")}
							max={20}
							min={1}
							onChange={(value: number) =>
								setAttributes({ logo_gap: value })
							}
							separatorType="none"
							step={1}
							withInputField={false}
						/>
					</PanelRow>
					<PanelColorGradientSettings
						title={__("Logo Color Setting", "opening-block")}
						settings={[
							{
								colorValue: logo_strokeColor,
								label: __("Stroke color", "opening-block"),
								onColorChange: (newValue?: string) =>
									setAttributes({ logo_strokeColor: newValue ?? "" }),
							},
							{
								colorValue: logo_fillColor,
								gradientValue: logo_fillGradient,
								label: __("Fill Color", "opening-block"),
								onColorChange: (newValue?: string) =>
									setAttributes({ logo_fillColor: newValue ?? "" }),
								onGradientChange: (newValue?: string) =>
									setAttributes({ logo_fillGradient: newValue }),
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>

			<EndingAnime
				attributes={attributes}
				onChange={(newAttributes: Partial<Attributes>) => {
					setAttributes(newAttributes);
				}}
			/>

			<div {...blockProps}>
				<div
					id="splash"
					style={{ background: bgColor, display: is_front ? "block" : "none" }}
				>
					<div id="splash_logo">
						<svg
							id="logo_anime"
							className="done"
							width="250px"
							height="120px"
							viewBox={`${-125 + logo_width / 2} ${
								-60 - logo_height / 2
							} 250 120`}
						>
							<g>
								{char_paths.map((path, index) => (
									<path
										key={index}
										style={{ fill: fillColor, stroke: logo_strokeColor }}
										d={path}
									/>
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
			<SkipAnime
				isFront={is_front}
				onChange={(newAttributes: Partial<Attributes>) =>
					setAttributes(newAttributes)
				}
			/>
		</>
	);
}
