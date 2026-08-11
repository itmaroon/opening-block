export interface Attributes {
	bg_Color: string;
	bg_Gradient?: string;
	logo_text: string;
	logo_font: string;
	logo_size: number;
	logo_width: number;
	logo_height: number;
	logo_gap: number;
	logo_strokeColor: string;
	logo_fillColor: string;
	logo_fillGradient?: string;
	char_paths: string[];
	trigger_anime: boolean;
	is_anime: boolean;
	is_front: boolean;
	ending_type: string;
	is_check_enable: boolean;
}

export type SetAttributes = (attributes: Partial<Attributes>) => void;
