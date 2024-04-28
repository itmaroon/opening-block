import { __ } from "@wordpress/i18n";

import {
	PanelBody,
	Button,
	Toolbar,
	RadioControl,
} from "@wordpress/components";
import { InspectorControls, BlockControls } from "@wordpress/block-editor";

import { ReactComponent as play } from "../assets/icon/circle-play.svg";
import { ReactComponent as toFront } from "../assets/icon/turn-up.svg";
import { ReactComponent as toBack } from "../assets/icon/turn-down.svg";

export const endingAnimation = (elmRef, ending_type, onEnding) => {
	//要素を取得
	const splash = elmRef.querySelector("#splash");
	const splash_logo = elmRef.querySelector("#splash_logo");
	const splashbg = elmRef.querySelector(".splashbg");
	const splashbg2 = elmRef.querySelector(".splashbg2");
	const splashCirclebg = elmRef.querySelector(".splashCirclebg");
	const fixbg = elmRef.querySelector(".fixbg");
	//イベントハンドラ
	const open_listener = () => {
		fixbg.classList.remove("hide"); //フェード用背景非表示
		splashbg.classList.remove("appear"); //フェードアウト後appearクラス付与
		splashbg.classList.remove(ending_type); //フェードアウト後appearクラス付与
		splashbg2.classList.remove("appear"); //フェードアウト後appearクラス付与
		splashbg2.classList.remove(ending_type); //フェードアウト後appearクラス付与
		//splash.classList.remove('disappear');
		splash.classList.remove("hide");
		splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		splash.animate([{ opacity: 1 }], { duration: 0, fill: "both" });

		onEnding(false);
	};
	const slide_end_listener = () => {
		splashbg.classList.remove("appear"); //フェードアウト後appearクラス削除
		splashbg.classList.remove(ending_type); //フェードアウト後appearクラス削除
		fixbg.classList.remove("disappear"); //背景を戻す
		splash.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: "both" });

		onEnding(false);
	};
	const slide_listener = () => {
		splashbg.classList.add("appear"); //フェードアウト後appearクラス付与
		splashbg.classList.add(ending_type); //フェードアウト後appearクラス付与
		fixbg.classList.add("disappear"); //フェードアウト後disappearクラス付与
		fixbg.addEventListener("transitionend", slide_end_listener);
	};

	const circle_end_listener = () => {
		splashCirclebg.classList.remove("appear"); //フェードアウト後appearクラス削除
		fixbg.classList.remove("disappear"); //背景を戻す
		splash.animate([{ opacity: 1 }], { duration: 0, fill: "both" });
		splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: "both" });

		onEnding(false);
	};

	const circle_listener = () => {
		splashCirclebg.classList.add("appear"); //フェードアウト後appearクラス付与
		fixbg.classList.add("disappear"); //フェードアウト後disappearクラス付与
		fixbg.addEventListener("transitionend", circle_end_listener);
	};

	const feedOut_listener = () => {
		//オープン型
		if (ending_type === "virtical_open" || ending_type === "horizen_open") {
			fixbg.classList.add("hide"); //フェード用背景非表示
			splash.animate([{ opacity: 0 }], { duration: 0, fill: "both" });
			splashbg.classList.add("appear"); //フェードアウト後appearクラス付与
			splashbg.classList.add(ending_type); //フェードアウト後クラス付与
			splashbg2.classList.add("appear"); //フェードアウト後appearクラス付与
			splashbg2.classList.add(ending_type); //フェードアウト後appearクラス付与
			//最終処理
			splashbg2.addEventListener("animationend", open_listener);
			//スライド型
		} else if (
			ending_type === "virtical_slide" ||
			ending_type === "horizen_slide"
		) {
			splash
				.animate([{ opacity: 1 }, { opacity: 0 }], {
					delay: 800,
					duration: 1000,
					fill: "both",
				})
				.addEventListener("finish", slide_listener);

			//円形拡張型
		} else if (ending_type === "circle_expand") {
			splash
				.animate([{ opacity: 1 }, { opacity: 0 }], {
					delay: 800,
					duration: 1000,
					fill: "both",
				})
				.addEventListener("finish", circle_listener);
		}
	};

	//ロゴのフェードアウト
	splash_logo
		.animate([{ opacity: 1 }, { opacity: 0 }], {
			delay: 800,
			duration: 1000,
			fill: "both",
		})
		.addEventListener("finish", feedOut_listener);

	// Return a cleanup function
	return () => {
		splashbg2.removeEventListener("animationend", open_listener);
		fixbg.removeEventListener("transitionend", slide_end_listener);
		splash.removeEventListener("finish", slide_listener);
		fixbg.removeEventListener("transitionend", circle_end_listener);
		splash.removeEventListener("finish", circle_listener);
		splash_logo.removeEventListener("finish", feedOut_listener);
	};
};

export default function EndingAnime({ attributes, onChange }) {
	const { ending_type, is_anime, is_front, trigger_anime } = attributes;

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					title={__("Ending Animation", "opening-block")}
					initialOpen={true}
					className="ending_ctrl"
				>
					<RadioControl
						selected={ending_type}
						options={[
							{
								label: __("Vertical Slide", "opening-block"),
								value: "virtical_slide",
							},
							{
								label: __("Horizen Slide", "opening-block"),
								value: "horizen_slide",
							},
							{
								label: __("Vertical Open", "opening-block"),
								value: "virtical_open",
							},
							{
								label: __("Horizen Open", "opening-block"),
								value: "horizen_open",
							},
							{
								label: __("Circle Expand", "opening-block"),
								value: "circle_expand",
							},
						]}
						onChange={(newValue) => {
							onChange({ ending_type: newValue });
						}}
					/>
				</PanelBody>
			</InspectorControls>

			<BlockControls>
				<Toolbar>
					<Button
						//表示するラベルを切り替え
						label={
							is_anime
								? __("Running", "opening-block")
								: __("Stopped", "opening-block")
						}
						//表示するアイコンを切り替え
						icon={play}
						//setAttributes を使って属性の値を更新（真偽値を反転）
						onClick={() => {
							onChange({ trigger_anime: !trigger_anime });
						}}
						disabled={!is_front || is_anime}
					/>
					<Button
						//表示するラベルを切り替え
						label={
							is_front
								? __("To Front", "opening-block")
								: __("To Back", "opening-block")
						}
						//表示するアイコンを切り替え
						icon={is_front ? toBack : toFront}
						//setAttributes を使って属性の値を更新（真偽値を反転）
						onClick={() => {
							onChange({ is_front: !is_front });
						}}
						disabled={is_anime ? true : false}
					/>
				</Toolbar>
			</BlockControls>
		</>
	);
}
