import { cookieControl, endingAnimation } from "../../front-common";
import {
	animateDynamicPen,
	positionDynamicPenAtStart,
} from "./dynamicPenAnimation";

jQuery(($) => {
	//cookieの処理
	const isAnimeSkipped = cookieControl($);
	const welcomeElement = $("#splash .wrapper__letters").get(0) as
		| HTMLElement
		| undefined;

	if (!welcomeElement || isAnimeSkipped) {
		return;
	}

	const splashElement = $("#splash");
	const endingType = String(splashElement.data("ending-type") ?? "");
	const animationDuration = Number(
		splashElement.data("logo-animation-duration") ?? 5.5,
	);
	const animationTarget =
		welcomeElement.querySelector<SVGPathElement>(
			'[data-welcome-animation-last="true"]',
		) ?? welcomeElement.querySelector<SVGMaskElement>("#letters-svg-mask");
	if (!animationTarget) {
		return;
	}

	if (welcomeElement.querySelector(".letters_pen.is-dynamic")) {
		positionDynamicPenAtStart(welcomeElement);
		animateDynamicPen(welcomeElement, animationDuration);
	}

	let endingStarted = false;
	const startEndingAnimation = () => {
		if (endingStarted) {
			return;
		}
		endingStarted = true;
		//ここからオープニング終了アニメーション
		endingAnimation($, endingType);
	};

	animationTarget.addEventListener("animationend", startEndingAnimation, {
		once: true,
	});
	window.setTimeout(
		startEndingAnimation,
		Math.max(0, animationDuration) * 1000 + 250,
	);
});
