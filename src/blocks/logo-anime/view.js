import { cookieControl, endingAnimation } from "../../front-common";

jQuery(function ($) {
	//cookieの処理
	const is_anime_skip = cookieControl($);
	/*===========================================================*/
	/*ロゴアウトラインアニメーション*/
	/*===========================================================*/
	//SVGアニメーションの描画
	if ($("#logo_anime").get(0)) {
		if (!is_anime_skip) {
			//スキップフラグがonでない
			//HTMLからスタイル要素を取得
			let splashElement = $("#splash");
			let fillColor = splashElement.data("fill-color");
			let strokeColor = splashElement.data("stroke-color");
			let ending_type = splashElement.data("ending-type");
			//初期設定
			$("#logo_anime path").each(function () {
				const length = $(this).get(0).getTotalLength();
				$(this).css({
					stroke: strokeColor,
					strokeDasharray: length,
					strostrokeDashoffsetke: length,
				});
			});

			// アニメーションを開始

			const animatePaths = (paths) => {
				paths.each((index, pathElement) => {
					const path = $(pathElement);
					const length = path.get(0).getTotalLength();

					path
						.get(0)
						.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
							duration: 1000,
							fill: "both",
							delay: index * 800,
						})
						.addEventListener("finish", () => {
							if (index === paths.length - 1) {
								$("#logo_anime").addClass("done"); //描画が終わったらdoneというクラスを追加
								$("#logo_anime path").css({
									fill: fillColor,
									stroke: "none",
								});
								// Reset all paths
								paths.each((i, pathToReset) => {
									$(pathToReset).css({
										"stroke-dashoffset": "",
										"stroke-dasharray": "",
									});
								});

								//ここからオープニング終了アニメーション
								endingAnimation($, ending_type);
							}
						});
				});
			};

			animatePaths($("#logo_anime path"));
		}
	}
});
