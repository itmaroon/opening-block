export interface Attributes {
	bg_Color: string;
	bg_Gradient?: string;
	logo_fillColor: string;
	welcome_text: string;
	welcome_font: string;
	logo_size: number;
	logo_gap: number;
	logo_width: number;
	logo_height: number;
	outline_paths: string[];
	centerline_paths: string[];
	path_lengths: number[];
	centerline_order: number[];
	centerline_reversed: boolean[];
	animation_duration: number;
	skeleton_scale: number;
	mask_stroke_width: number;
	use_dynamic_paths: boolean;
	trigger_anime: boolean;
	is_anime: boolean;
	is_front: boolean;
	ending_type: string;
	is_check_enable: boolean;
}
