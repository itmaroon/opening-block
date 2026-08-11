import { __ } from "@wordpress/i18n";
import {
	PanelBody,
	Button,
	Toolbar,
	RadioControl,
} from "@wordpress/components";
import { InspectorControls, BlockControls } from "@wordpress/block-editor";

import { ReactComponent as play } from "../assets/icon/circle-play.svg";
import { ReactComponent as toFront } from "../assets/icon/turn-up.svg";
import { ReactComponent as toBack } from "../assets/icon/turn-down.svg";

interface AnimationAttributes {
	ending_type: string;
	is_anime: boolean;
	is_front: boolean;
	trigger_anime: boolean;
}

interface EndingAnimeProps {
	attributes: AnimationAttributes;
	onChange(attributes: Partial<AnimationAttributes>): void;
}

export const endingAnimation = (
	element: HTMLElement,
	endingType: string,
	onEnding: (flag: boolean) => void,
): (() => void) => {
	const splash = element.querySelector<HTMLElement>("#splash");
	const splashLogo = element.querySelector<HTMLElement>("#splash_logo");
	const splashBackground = element.querySelector<HTMLElement>(".splashbg");
	const splashBackground2 = element.querySelector<HTMLElement>(".splashbg2");
	const splashCircleBackground =
		element.querySelector<HTMLElement>(".splashCirclebg");
	const fixedBackground = element.querySelector<HTMLElement>(".fixbg");

	if (
		!splash ||
		!splashLogo ||
		!splashBackground ||
		!splashBackground2 ||
		!splashCircleBackground ||
		!fixedBackground
	) {
		return () => undefined;
	}

	let splashAnimation: Animation | null = null;

	const openListener = () => {
		fixedBackground.classList.remove("hide");
		splashBackground.classList.remove("appear", endingType);
		splashBackground2.classList.remove("appear", endingType);
		splash.classList.remove("hide");
		splashLogo.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		splash.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		onEnding(false);
	};

	const slideEndListener = () => {
		splashBackground.classList.remove("appear", endingType);
		fixedBackground.classList.remove("disappear");
		splash.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		splashLogo.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		onEnding(false);
	};

	const slideListener = () => {
		splashBackground.classList.add("appear", endingType);
		fixedBackground.classList.add("disappear");
		fixedBackground.addEventListener("transitionend", slideEndListener);
	};

	const circleEndListener = () => {
		splashCircleBackground.classList.remove("appear");
		fixedBackground.classList.remove("disappear");
		splash.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		splashLogo.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		onEnding(false);
	};

	const circleListener = () => {
		splashCircleBackground.classList.add("appear");
		fixedBackground.classList.add("disappear");
		fixedBackground.addEventListener("transitionend", circleEndListener);
	};

	const fadeOutListener = () => {
		if (endingType === "virtical_open" || endingType === "horizen_open") {
			fixedBackground.classList.add("hide");
			splash.animate([{ opacity: 0 }], { duration: 0, fill: "both" });
			splashBackground.classList.add("appear", endingType);
			splashBackground2.classList.add("appear", endingType);
			splashBackground2.addEventListener("animationend", openListener);
		} else if (
			endingType === "virtical_slide" ||
			endingType === "horizen_slide"
		) {
			splashAnimation = splash.animate(
				[{ opacity: 1 }, { opacity: 0 }],
				{ delay: 800, duration: 1000, fill: "both" },
			);
			splashAnimation.addEventListener("finish", slideListener);
		} else if (endingType === "circle_expand") {
			splashAnimation = splash.animate(
				[{ opacity: 1 }, { opacity: 0 }],
				{ delay: 800, duration: 1000, fill: "both" },
			);
			splashAnimation.addEventListener("finish", circleListener);
		}
	};

	const logoAnimation = splashLogo.animate(
		[{ opacity: 1 }, { opacity: 0 }],
		{ delay: 800, duration: 1000, fill: "both" },
	);
	logoAnimation.addEventListener("finish", fadeOutListener);

	return () => {
		splashBackground2.removeEventListener("animationend", openListener);
		fixedBackground.removeEventListener("transitionend", slideEndListener);
		fixedBackground.removeEventListener("transitionend", circleEndListener);
		logoAnimation.removeEventListener("finish", fadeOutListener);
		splashAnimation?.removeEventListener("finish", slideListener);
		splashAnimation?.removeEventListener("finish", circleListener);
	};
};

export default function EndingAnime({
	attributes,
	onChange,
}: EndingAnimeProps) {
	const { ending_type, is_anime, is_front, trigger_anime } = attributes;

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					title={__("Ending Animation", "opening-block")}
					initialOpen={true}
					className="ending_ctrl"
				>
					<RadioControl
						selected={ending_type}
						options={[
							{
								label: __("Vertical Slide", "opening-block"),
								value: "virtical_slide",
							},
							{
								label: __("Horizen Slide", "opening-block"),
								value: "horizen_slide",
							},
							{
								label: __("Vertical Open", "opening-block"),
								value: "virtical_open",
							},
							{
								label: __("Horizen Open", "opening-block"),
								value: "horizen_open",
							},
							{
								label: __("Circle Expand", "opening-block"),
								value: "circle_expand",
							},
						]}
						onChange={(newValue: string) => {
							onChange({ ending_type: newValue });
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<Toolbar>
					<Button
						label={
							is_anime
								? __("Running", "opening-block")
								: __("Stopped", "opening-block")
						}
						icon={play}
						onClick={() => {
							onChange({ trigger_anime: !trigger_anime });
						}}
						disabled={!is_front || is_anime}
					/>
					<Button
						label={
							is_front
								? __("To Front", "opening-block")
								: __("To Back", "opening-block")
						}
						icon={is_front ? toBack : toFront}
						onClick={() => {
							onChange({ is_front: !is_front });
						}}
						disabled={is_anime}
					/>
				</Toolbar>
			</BlockControls>
		</>
	);
}
