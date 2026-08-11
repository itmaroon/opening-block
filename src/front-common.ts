/*===========================================================*/
/*オープニングスキップのクッキー管理*/
/*===========================================================*/
export function cookieControl($: JQueryStatic): boolean {
	const getCookie = (name: string): string | null => {
		const namePrefix = `${name}=`;
		const cookies = document.cookie.split(";");
		for (const cookieValue of cookies) {
			let cookie = cookieValue;
			while (cookie.startsWith(" ")) {
				cookie = cookie.substring(1);
			}
			if (cookie.startsWith(namePrefix)) {
				return cookie.substring(namePrefix.length);
			}
		}
		return null;
	};

	const setCookie = (name: string, value: string, days: number): void => {
		let expires = "";
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = `; expires=${date.toUTCString()}`;
		}
		document.cookie = `${name}=${value}${expires}; path=/`;
	};

	const eraseCookie = (name: string): void => {
		document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
	};

	const animationCookieName = "animation_shown";
	let isAnimeSkipped = false;
	if ($("#splash").length && $(".opening_check").length === 0) {
		eraseCookie(animationCookieName);
	} else {
		isAnimeSkipped = getCookie(animationCookieName) === "true";
		$("input[name='anim_is_skip']").prop("checked", isAnimeSkipped);
		$(".opening_check").css("display", "block");
	}

	if (!isAnimeSkipped) {
		$("#splash").css("display", "block");
	} else {
		const fixedBackground = $(".fixbg");
		fixedBackground
			.data("openAnimationEnded", true)
			.trigger("openAnimationEnd");
		$(".opening_check").addClass("closing");
		$(
			".wp-block-itmar-logo-anime, .wp-block-itmar-tea-time, .wp-block-itmar-welcome",
		).css("display", "none");
	}

	$("input[name='anim_is_skip']").on("change", function () {
		if ($(this).is(":checked")) {
			setCookie(animationCookieName, "true", 30);
			isAnimeSkipped = true;
		} else {
			eraseCookie(animationCookieName);
			isAnimeSkipped = false;
		}
	});

	return isAnimeSkipped;
}

/*===========================================================*/
/*エンディングアニメーション*/
/*===========================================================*/
export const endingAnimation = (
	$: JQueryStatic,
	endingType: string,
): void => {
	const splash = document.querySelector<HTMLElement>("#splash");
	const splashLogo = document.querySelector<HTMLElement>("#splash_logo");
	const splashBackground = document.querySelector<HTMLElement>(".splashbg");
	const splashBackground2 = document.querySelector<HTMLElement>(".splashbg2");
	const splashCircleBackground =
		document.querySelector<HTMLElement>(".splashCirclebg");
	const fixedBackground = document.querySelector<HTMLElement>(".fixbg");

	if (
		!splash ||
		!splashLogo ||
		!splashBackground ||
		!splashBackground2 ||
		!splashCircleBackground ||
		!fixedBackground
	) {
		return;
	}

	const $fixedBackground = $(fixedBackground);
	const completeAnimation = (context: Element): void => {
		if (splash.parentElement) {
			splash.parentElement.style.display = "none";
		}
		$fixedBackground.trigger("openAnimationEnd");
		$(context).parent().next().addClass("closing");
	};

	splashLogo
		.animate(
			[{ opacity: 1 }, { opacity: 0 }],
			{ delay: 800, duration: 1000, fill: "both" },
		)
		.addEventListener("finish", () => {
			if (endingType === "virtical_open" || endingType === "horizen_open") {
				fixedBackground.classList.add("hide");
				splash.animate([{ opacity: 0 }], { duration: 0, fill: "both" });
				splashBackground.classList.add("appear", endingType);
				splashBackground2.classList.add("appear", endingType);
				splashBackground2.addEventListener("animationend", function () {
					completeAnimation(this);
				});
			} else if (
				endingType === "virtical_slide" ||
				endingType === "horizen_slide"
			) {
				splash
					.animate(
						[{ opacity: 1 }, { opacity: 0 }],
						{ delay: 800, duration: 1000, fill: "both" },
					)
					.addEventListener("finish", () => {
						splashBackground.classList.add("appear", endingType);
						fixedBackground.classList.add("disappear");
						$fixedBackground.on("transitionend", function () {
							completeAnimation(this);
						});
					});
			} else if (endingType === "circle_expand") {
				splash
					.animate(
						[{ opacity: 1 }, { opacity: 0 }],
						{ delay: 800, duration: 1000, fill: "both" },
					)
					.addEventListener("finish", () => {
						splashCircleBackground.classList.add("appear");
						fixedBackground.classList.add("disappear");
						$fixedBackground.on("transitionend", function () {
							completeAnimation(this);
						});
					});
			}
		});
};
