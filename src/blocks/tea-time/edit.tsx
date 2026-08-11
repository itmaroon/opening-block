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
import Select from "react-select";

import "../../editor.scss";
import EndingAnime, { endingAnimation } from "../../EndingAnime";
import SkipAnime from "../../SkipAnime";
import { createFontFamilyOption } from "../../fontFamily";
import {
	useFontFamilyOptions,
	type FontFamilyOption,
} from "../../useFontFamilyOptions";
import type { Attributes } from "./type";

export default function Edit({
	attributes,
	setAttributes,
}: BlockEditProps<Attributes>) {
	const {
		bg_Color,
		bg_Gradient,
		telop,
		telop_Color,
		telop_font,
		duration,
		trigger_anime,
		is_anime,
		is_front,
		ending_type,
	} = attributes;
	//テロップの文字分割
	const characters = telop.split("");
	//単色かグラデーションかの選択
	const bgColor = bg_Color || bg_Gradient;
	const fontFamilyOptions = useFontFamilyOptions();
	const selectedFont =
		fontFamilyOptions.find((option) => option.value === telop_font) ??
		createFontFamilyOption(telop_font);
	const fontSelectStyles = {
		option: (
			provided: Record<string, unknown>,
			state: { data: FontFamilyOption },
		) => ({
			...provided,
			fontFamily: state.data.fontFamily,
			fontWeight: state.data.fontWeight,
			fontStyle: state.data.fontStyle,
		}),
	};

	const blockRef = useRef<HTMLDivElement | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);

	const blockProps = useBlockProps({
		ref: blockRef,
		style: is_front ? { zIndex: 150 } : { zIndex: -1, opacity: 0 },
	});

	//エンディングのハンドル
	const handleEnding = (flag: boolean) => {
		setAttributes({
			is_anime: flag,
			is_front: flag,
			trigger_anime: flag,
		});
	};

	useEffect(() => {
		let timerId: ReturnType<typeof setTimeout> | undefined;

		if (blockRef.current && trigger_anime) {
			setAttributes({ is_anime: true });
			timerId = setTimeout(() => {
				if (blockRef.current) {
					cleanupRef.current = endingAnimation(
						blockRef.current,
						ending_type,
						handleEnding,
					);
				}
			}, duration * 1000);
		}

		return () => {
			if (timerId !== undefined) {
				clearTimeout(timerId);
			}
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
					title={__("Telop Settings", "opening-block")}
					initialOpen={true}
					className="title_design_ctrl"
				>
					<PanelRow>
						<TextControl
							label={__("Telop Settings", "opening-block")}
							labelPosition="top"
							value={telop}
							isPressEnterToChange
							onChange={(newValue: string) =>
								setAttributes({ telop: newValue })
							}
						/>
					</PanelRow>
					<PanelColorGradientSettings
						title={__("Color Setting", "opening-block")}
						settings={[
							{
								colorValue: telop_Color,
								label: __("Telop Color", "opening-block"),
								onColorChange: (newValue?: string) =>
									setAttributes({ telop_Color: newValue ?? "" }),
							},
						]}
					/>
					<PanelRow>
						<div style={{ width: "100%" }}>
							<label className="components-base-control__label">
								{__("Font Family", "opening-block")}
							</label>
							<Select
								options={fontFamilyOptions}
								value={selectedFont}
								onChange={(newOption: FontFamilyOption | null) => {
									setAttributes({
										telop_font: newOption?.value ?? "",
									});
								}}
								styles={fontSelectStyles}
							/>
						</div>
					</PanelRow>
					<PanelRow className="durationCtrl">
						<RangeControl
							value={duration}
							label={__("Animation duration", "opening-block")}
							max={15}
							min={2}
							onChange={(value: number) =>
								setAttributes({ duration: value })
							}
							separatorType="none"
							step={1}
							withInputField={false}
						/>
					</PanelRow>
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
					<div id="splash_logo" style={{ top: "65%" }}>
						<div className="wrapper coffee">
							<div
								className="coffee_text"
								style={{
									color: telop_Color,
									fontFamily: selectedFont?.fontFamily,
									fontWeight: selectedFont?.fontWeight,
									fontStyle: selectedFont?.fontStyle,
								}}
							>
								{characters.map((character, index) => (
									<span
										className={is_anime ? "play" : ""}
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

			<SkipAnime
				isFront={is_front}
				onChange={(newAttributes: Partial<Attributes>) =>
					setAttributes(newAttributes)
				}
			/>
		</>
	);
}
