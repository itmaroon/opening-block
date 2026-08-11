import { useEffect, useState } from "@wordpress/element";

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

let cachedOptions: FontFamilyOption[] | null = null;
let optionsRequest: Promise<FontFamilyOption[]> | null = null;

const createFontFamilyOptions = (data: unknown): FontFamilyOption[] => {
	if (!Array.isArray(data)) {
		throw new TypeError("Font file list must be an array.");
	}

	return data.flatMap<FontFamilyOption>((item) => {
		if (typeof item !== "string") {
			return [];
		}

		const fontParts = item.match(/(.*)-(.*)\.ttf$/i);
		if (!fontParts) {
			return [];
		}

		const [, fontFamily, fontVariant] = fontParts;
		const fontStyle = fontVariant.includes("Italic") ? "italic" : "normal";
		const weightName = fontVariant.replace("Italic", "").trim().toLowerCase();

		return [
			{
				value: item,
				label: `${fontFamily} ${weightName}`,
				fontFamily,
				fontWeight: fontWeights[weightName] ?? 400,
				fontStyle,
			},
		];
	});
};

const loadFontFamilyOptions = (): Promise<FontFamilyOption[]> => {
	if (cachedOptions) {
		return Promise.resolve(cachedOptions);
	}

	if (!optionsRequest) {
		optionsRequest = fetch(`${opening_block.plugin_url}/build/fileList.json`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Font file list request failed: ${response.status}`);
				}
				return response.json() as Promise<unknown>;
			})
			.then(createFontFamilyOptions)
			.then((options) => {
				cachedOptions = options;
				return options;
			})
			.catch((error: unknown) => {
				optionsRequest = null;
				throw error;
			});
	}

	return optionsRequest;
};

const installFontFaces = (options: FontFamilyOption[]): void => {
	const installedFonts = new Set(
		Array.from(
			document.querySelectorAll<HTMLStyleElement>(
				"style[data-opening-block-font]",
			),
		).map((element) => element.dataset.openingBlockFont),
	);

	options.forEach((option) => {
		if (installedFonts.has(option.value)) {
			return;
		}

		const styleElement = document.createElement("style");
		styleElement.dataset.openingBlockFont = option.value;
		styleElement.textContent = `
			@font-face {
				font-family: '${option.fontFamily}';
				src: url('${opening_block.plugin_url}/assets/fonts/${option.value}') format('truetype');
				font-weight: ${option.fontWeight};
				font-style: ${option.fontStyle};
			}
		`;
		document.head.appendChild(styleElement);
	});
};

export const useFontFamilyOptions = (): FontFamilyOption[] => {
	const [options, setOptions] = useState<FontFamilyOption[]>(
		cachedOptions ?? [],
	);

	useEffect(() => {
		let isMounted = true;

		loadFontFamilyOptions()
			.then((loadedOptions) => {
				installFontFaces(loadedOptions);
				if (isMounted) {
					setOptions(loadedOptions);
				}
			})
			.catch((error: unknown) => {
				console.error("Font loading failed:", error);
			});

		return () => {
			isMounted = false;
		};
	}, []);

	return options;
};
