import { cookieControl, endingAnimation } from "../../front-common";

jQuery(function ($) {
	//cookieの処理
	const is_anime_skip = cookieControl($);

	/*===========================================================*/
	/*Welcome*/
	/*===========================================================*/
	if ($("#splash .wrapper__letters").get(0)) {
		if (!is_anime_skip) {
			//スキップフラグがonでない
			let splashElement = $("#splash");
			let ending_type = splashElement.data("ending-type");
			// 要素を取得
			const letter_mask = document.getElementById("letters-svg-mask");
			letter_mask.addEventListener("animationend", function () {
				//ここからオープニング終了アニメーション
				endingAnimation($, ending_type);
			});
		}
	}
});
