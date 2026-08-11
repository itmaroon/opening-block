declare module "@wordpress/i18n" {
	export function __(text: string, domain?: string): string;
}

declare module "@wordpress/blocks" {
	export interface BlockEditProps<T> {
		attributes: T;
		setAttributes(attributes: Partial<T>): void;
		[key: string]: unknown;
	}

	export function registerBlockType<T>(
		name: string,
		settings: Record<string, unknown>,
	): unknown;
}

declare module "@wordpress/block-editor" {
	export const BlockControls: any;
	export const InspectorControls: any;
	export const InnerBlocks: any;
	export const __experimentalPanelColorGradientSettings: any;
	export const useBlockProps: any;
}

declare module "@wordpress/components" {
	export const Button: any;
	export const PanelBody: any;
	export const PanelRow: any;
	export const RangeControl: any;
	export const RadioControl: any;
	export const TextControl: any;
	export const Toolbar: any;
}

declare module "@wordpress/element" {
	export function useEffect(
		effect: () => void | (() => void),
		dependencies?: readonly unknown[],
	): void;
	export function useRef<T>(initialValue: T): { current: T };
	export function useState<T>(
		initialValue: T | (() => T),
	): [T, (value: T) => void];
}

declare module "@wordpress/data" {
	export function useSelect<T>(
		mapSelect: (select: (storeName: string) => unknown) => T,
		dependencies: readonly unknown[],
	): T;
	export function dispatch(storeName: string): any;
}

declare module "opentype.js" {
	interface BoundingBox {
		x1: number;
		x2: number;
		y1: number;
		y2: number;
	}

	interface FontPath {
		getBoundingBox(): BoundingBox;
		toPathData(): string;
	}

	interface Font {
		getPath(
			text: string,
			x?: number,
			y?: number,
			fontSize?: number,
		): FontPath;
	}

	const opentype: {
		load(
			url: string,
			callback: (error: Error | null, font?: Font) => void,
		): void;
	};

	export default opentype;
}

declare module "react-select" {
	const Select: any;
	export default Select;
}

declare module "itmar-block-packages" {
	export const BlockEditWrapper: any;
	export function flattenBlocks<T>(blocks: T[]): T[];
}

declare module "*.scss";

declare module "*.svg" {
	export const ReactComponent: (props: Record<string, unknown>) => JSX.Element;
	const source: string;
	export default source;
}

declare const React: {
	lazy<T>(loader: () => Promise<T>): unknown;
};

declare const opening_block: {
	plugin_url: string;
};

declare const itmar_option: {
	home_url: string;
};

declare const ReactDOM: {
	createRoot(container: Element | DocumentFragment): {
		render(children: unknown): void;
		unmount(): void;
	};
};

type JQueryCollection = {
	length: number;
	get(index: number): Element | undefined;
	each(
		callback: (this: Element, index: number, element: Element) => void,
	): JQueryCollection;
	css(properties: Record<string, string | number>): JQueryCollection;
	css(property: string, value: string | number): JQueryCollection;
	data(name: string): unknown;
	data(name: string, value: unknown): JQueryCollection;
	addClass(className: string): JQueryCollection;
	prop(name: string, value: unknown): JQueryCollection;
	trigger(eventName: string): JQueryCollection;
	on(
		eventName: string,
		handler: (this: Element, event: Event) => void,
	): JQueryCollection;
	is(selector: string): boolean;
	parent(): JQueryCollection;
	next(): JQueryCollection;
};

type JQueryStatic = {
	(selector: string | Element): JQueryCollection;
};

declare function jQuery(callback: ($: JQueryStatic) => void): void;

declare namespace JSX {
	// ReactElement と構造的に互換にし、自作コンポーネントを JSX で利用可能にする。
	interface Element {
		type: any;
		props: any;
		key: string | null;
	}
	interface IntrinsicElements {
		[elementName: string]: any;
	}
}
