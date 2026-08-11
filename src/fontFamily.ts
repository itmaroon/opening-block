export interface FontFamilyOption {
	value: string;
	label: string;
	fontFamily: string;
	fontWeight: number;
	fontStyle: string;
}

const fontWeights: Record<string, number> = {
	thin: 200,
	light: 300,
	regular: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	black: 900,
};

export const createFontFamilyOption = (
	fontFile: string,
): FontFamilyOption | null => {
	const fontParts = fontFile.match(/(.*)-(.*)\.ttf$/i);
	if (!fontParts) {
		return null;
	}

	const [, fontFamily, fontVariant] = fontParts;
	const fontStyle = fontVariant.includes("Italic") ? "italic" : "normal";
	const weightName = fontVariant
		.replace("Italic", "")
		.trim()
		.toLowerCase();

	return {
		value: fontFile,
		label: `${fontFamily} ${weightName}`,
		fontFamily,
		fontWeight: fontWeights[weightName] ?? 400,
		fontStyle,
	};
};

export const installFontFace = (
	option: FontFamilyOption,
	fontUrl: string,
): void => {
	const isInstalled = Array.from(
		document.querySelectorAll<HTMLStyleElement>(
			"style[data-opening-block-font]",
		),
	).some((element) => element.dataset.openingBlockFont === option.value);

	if (isInstalled) {
		return;
	}

	const styleElement = document.createElement("style");
	styleElement.dataset.openingBlockFont = option.value;
	styleElement.textContent = `
		@font-face {
			font-family: '${option.fontFamily}';
			src: url('${fontUrl}') format('truetype');
			font-weight: ${option.fontWeight};
			font-style: ${option.fontStyle};
		}
	`;
	document.head.appendChild(styleElement);
};
