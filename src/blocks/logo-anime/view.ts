import { cookieControl, endingAnimation } from "../../front-common";

jQuery(($) => {
	//cookieの処理
	const isAnimeSkipped = cookieControl($);
	const logo = $("#logo_anime").get(0);

	if (!logo || isAnimeSkipped) {
		return;
	}

	const splashElement = $("#splash");
	const fillColor = String(splashElement.data("fill-color") ?? "");
	const strokeColor = String(splashElement.data("stroke-color") ?? "");
	const endingType = String(splashElement.data("ending-type") ?? "");
	const paths = $("#logo_anime path");

	//初期設定
	paths.each(function () {
		const path = $(this).get(0);
		if (!(path instanceof SVGPathElement)) {
			return;
		}

		const length = path.getTotalLength();
		$(path).css({
			stroke: strokeColor,
			strokeDasharray: length,
			strokeDashoffset: length,
		});
	});

	// アニメーションを開始
	paths.each((index, pathElement) => {
		if (!(pathElement instanceof SVGPathElement)) {
			return;
		}

		const length = pathElement.getTotalLength();
		pathElement
			.animate(
				[{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
				{
					duration: 1000,
					fill: "both",
					delay: index * 800,
				},
			)
			.addEventListener("finish", () => {
				if (index !== paths.length - 1) {
					return;
				}

				$("#logo_anime").addClass("done");
				$("#logo_anime path").css({
					fill: fillColor,
					stroke: "none",
				});
				paths.css({
					strokeDashoffset: "",
					strokeDasharray: "",
				});

				//ここからオープニング終了アニメーション
				endingAnimation($, endingType);
			});
	});
});
