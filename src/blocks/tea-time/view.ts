import { cookieControl, endingAnimation } from "../../front-common";
import { createFontFamilyOption, installFontFace } from "../../fontFamily";

const viewScriptUrl = (document.currentScript as HTMLScriptElement | null)?.src;

const getPluginUrl = (): string | null => {
	if (typeof opening_block !== "undefined" && opening_block.plugin_url) {
		return opening_block.plugin_url.replace(/\/$/, "");
	}

	if (viewScriptUrl) {
		return new URL("../../../", viewScriptUrl).href.replace(/\/$/, "");
	}

	const blockStyle = document.querySelector<HTMLLinkElement>(
		'link[href*="/build/blocks/tea-time/"]',
	);
	const buildMarker = "/build/";
	const markerIndex = blockStyle?.href.indexOf(buildMarker) ?? -1;
	return markerIndex >= 0 ? blockStyle!.href.slice(0, markerIndex) : null;
};

jQuery(($) => {
	const pluginUrl = getPluginUrl();
	if (pluginUrl) {
		document
			.querySelectorAll<HTMLElement>(".wp-block-itmar-tea-time .coffee_text")
			.forEach((element) => {
				const fontFile = element.dataset.fontFile;
				const fontOption = fontFile
					? createFontFamilyOption(fontFile)
					: null;
				if (fontFile && fontOption) {
					installFontFace(
						fontOption,
						`${pluginUrl}/assets/fonts/${fontFile}`,
					);
				}
			});
	}

	//cookieの処理
	const isAnimeSkipped = cookieControl($);
	const coffeeElement = $("#splash .coffee").get(0);

	if (!coffeeElement || isAnimeSkipped) {
		return;
	}

	const splashElement = $("#splash");
	const endingType = String(splashElement.data("ending-type") ?? "");
	const duration = Number(splashElement.data("duration"));

	setTimeout(() => {
		//ここからオープニング終了アニメーション
		endingAnimation($, endingType);
	}, duration * 1000);
});
