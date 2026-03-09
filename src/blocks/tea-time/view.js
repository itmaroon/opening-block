import { cookieControl, endingAnimation } from "../../front-common";

jQuery(function ($) {
	//cookieの処理
	const is_anime_skip = cookieControl($);

	/*===========================================================*/
	/*コーヒーカップ*/
	/*===========================================================*/
	if ($("#splash .coffee").get(0)) {
		if (!is_anime_skip) {
			//スキップフラグがonでない
			let splashElement = $("#splash");
			let ending_type = splashElement.data("ending-type");
			let duration = splashElement.data("duration");
			setTimeout(() => {
				//ここからオープニング終了アニメーション
				endingAnimation($, ending_type);
			}, duration * 1000);
		}
	}
});
