import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	__experimentalPanelColorGradientSettings as PanelColorGradientSettings,
} from "@wordpress/block-editor";

import { useEffect, useRef } from "@wordpress/element";
import EndingAnime, { endingAnimation } from "../../EndingAnime";
import "../../editor.scss";
import SkipAnime from "../../SkipAnime";

export default function Edit({ attributes, setAttributes }) {
	const {
		bg_Color,
		bg_Gradient,
		logo_fillColor,
		is_anime,
		trigger_anime,
		is_front,
		ending_type,
	} = attributes;

	//単色かグラデーションかの選択
	const bgColor = bg_Color || bg_Gradient;

	// ブロック参照用のuseRef
	const blockRef = useRef(null);
	//エンディングアニメーション関数参照用のuseRef
	const cleanupRef = useRef(null);

	const blockProps = useBlockProps({
		ref: blockRef, // ここで参照を blockProps に渡しています
		style: is_front ? { zIndex: 150 } : { zIndex: -1, opacity: 0 }, //is_frontフラグによってブロックのzIndexを設定
	});

	useEffect(() => {
		if (blockRef.current) {
			//マウント時には実行しない
			if (trigger_anime) {
				// 要素を取得
				const letter_mask = blockRef.current.querySelector("#letters-svg-mask");
				// アニメーションを開始
				setAttributes({ is_anime: true });
				//エンディングのハンドル
				const handleEnding = (flg) => {
					setAttributes({ is_anime: flg, is_front: flg, trigger_anime: flg }); //アニメボタンの変更、背面へ
				};
				//ここからオープニング終了アニメーション
				const handleAnimationEnd = () => {
					//エンディングアニメーション関数の実行と参照
					cleanupRef.current = endingAnimation(
						blockRef.current,
						ending_type,
						handleEnding,
					);
				};
				letter_mask.addEventListener("animationend", handleAnimationEnd);
				// Cleanup function
				return () => {
					letter_mask.removeEventListener("animationend", handleAnimationEnd);
					// エンディングアニメーション関数のイベントリスナをクリア
					// Check if cleanup function exists, and if so, call it
					if (typeof cleanupRef.current === "function") {
						cleanupRef.current();
					}
				};
			}
		}
	}, [trigger_anime]);

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					title={__("Background Settings", "opening-block")}
					initialOpen={true}
					className="back_design_ctrl"
				>
					<PanelColorGradientSettings
						title={__("Background Color Setting", "opening-block")}
						settings={[
							{
								colorValue: bg_Color,
								gradientValue: bg_Gradient,

								label: __("Choice color or gradient", "opening-block"),
								onColorChange: (newValue) => {
									setAttributes({
										bg_Color: newValue === undefined ? "" : newValue,
									});
								},
								onGradientChange: (newValue) => {
									setAttributes({ bg_Gradient: newValue });
								},
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>

			<EndingAnime
				attributes={attributes}
				onChange={(newObj) => {
					setAttributes(newObj);
				}}
			/>

			<div {...blockProps}>
				<div
					id="splash"
					style={{ background: bgColor, display: is_front ? "block" : "none" }}
				>
					<div id="splash_logo">
						<div className="wrapper wrapper__letters">
							<div className="letters is-active" data-wrapper-id="letters">
								<div className="letters_line">
									<svg width="300" height="270" viewBox="0 0 300 270">
										<g id="letters-svg-text" style={{ fill: logo_fillColor }}>
											<path d="m50.281,83.372c-2.78,2.482-10.925,13.408-13.11,14.6-6.705,7.054-7.29,17.565-5.462,23.539,0,2.384,0,3.575,2.086,5.164,1.633,1.223,2.735,2.285,5.164,2.285,1.49-.1,2.88-.299,3.873-1.788,4.172-6.654,6.556-10.329,6.456-10.23,1.391-1.787,2.186-2.682,2.781-2.979v-.396c0-1.292-.795-1.192-.795-1.987,0-.298.1-.794.497-1.589,2.982-5.747,1.131-2.864,3.277-5.661,0-1.688,1.093-3.675,3.277-5.959,1.034-.565,2.315,1.607,3.179,1.49,1.174,3.032-3.996,3.991-3.774,6.853,0-.1.496-.596.596-.596,0,.397-.496,1.391-3.079,4.171-.659.675-.271.849-.496,2.186-.403,1.687-.309,5.769,0,6.356-.35,4.842.068,8.797,5.264,11.818,1.17-.291,1.794-.235,3.179.398,1.202.633,2.057.692,3.178.397,2.384-1.986,7.747-5.065,9.535-9.138,2.384-5.462,2.682-3.078,3.277-4.171.596-1.589,1.489-1.49,1.986-3.179.524-2.797,1.611-7.375,2.88-8.938,1.59-1.191,2.682-3.277,3.278-6.456.596-3.078,1.589-5.264,2.88-6.356,1.264,4.917-3.973,12.397-7.25,20.162,0,2.582-3.576,7.052-3.874,9.138-1.489,2.284-6.257,4.668-7.647,6.952-2.176,3.152-4.566,4.532-7.647,4.072-2.576,1.358-5.853-2.302-7.945-3.675-2.979-3.079-3.974-6.257-3.974-10.627l-1.291.496c-3.377,4.172-8.045,11.62-12.018,11.62-4.949-1.275-8.925-.78-9.832-8.441.287-.837-.083-1.588-.298-2.781-4.017-9.582,11.716-31.741,14.004-31.782,5.661-6.158,10.727-11.024,10.727-11.024,0-.695,3.078-3.675,3.575-4.966.565-1.368-1.995-.171-2.384-.795-6.654,5.065-16.884,12.315-30.491,21.95-1.032.759-2.059-.89-2.682-1.49,0-.1.695-.993,1.888-2.582,1.89,1.095,3.372-2.499,5.164-1.391,2.548-3.39,13.391-7.203,15.594-11.322,1.688-.497,3.178-1.688,4.469-3.278,2.979-2.284,7.449-5.661,13.508-10.13.442-.082,2.756-.379,3.079.894.423,3.037.202,5.691-14.601,19.169Zm42.906,2.185c.795-2.284,2.086-3.873,3.774-4.668-1.919,1.819-3.785,8.952-5.165,10.727l-.397-.496,1.788-5.562Zm6.158-10.527l.396.496c-.496,1.192-1.39,2.682-2.78,4.37-.582-1.47,2.722-3.407,2.384-4.866Zm4.767-8.542l.397.397-1.887,1.688,1.489-2.086Zm3.675-7.052c1.405,1.1-.655,2.997-1.191,4.072-.777,1.118-.981,1.205-1.788.199.397-.993,1.391-2.384,2.979-4.271Zm2.881-4.866c.609.643.408,1.712.099,2.682l-.993.993-1.092-.894,1.986-2.781Zm2.88-2.682c-1.457-.956,1.503-3.19,1.986-3.675,1.398.63-1.53,3.057-1.986,3.675ZM170.955,5.108c1.82,1.518,1.67,2.976,1.284,4.966-.85,2.094-.313,7.699-2.59,9.436-2.487,10.873-11.605,21.667-17.877,31.769-16.402,16.501-17.78,20.55-32.875,27.213-.842,2.702-2.772,1.095-4.568.993-2.488-.388-1.673-2.221-.298-3.773,1.479-.753,4.004,1.193,5.264-.298,3.229.141,4.315-.393,5.562-2.881,1.566,1.447,3.322-1.388,4.569-1.787,1.937-2.7,11.859-8.957,13.904-12.713-.235-.752-.069-1.372.298-2.186l1.093,1.093c8.84-8.643,15.851-24.597,22.446-36.238.397-3.476,1.894-7.35,2.291-11.62-1.241-.509-.136-4.725-2.277-4.469-2.46-.528-5.584-.816-7.151.894-1.857-.31-5.519,3.01-7.25,2.979-3.832,2.771-16.55,15.432-18.871,17.281l-.397-.596c-.676.618-.112,3.969-1.887,3.873l-.596-.596c1.231-3.558,11.137-12.239,12.713-14.6,1.839-.794,9.833-8.749,13.011-8.642.395-3.462,7.023-2.526,8.243-4.071.626.825,1.591,1.159,2.583.894l3.377,3.079Zm-54.526,42.509c-.882-2.419,5.175-6.151,4.866-8.244.884-2.4,7.602-7.845,8.74-9.832l.496.496c-4.37,4.867-6.952,8.442-7.647,10.926-.776,1.934-5.526,4.771-6.455,6.654Z" />
											<path d="m118.414,110.387l-.298,1.688c-4.777,6.327-15.067,7.711-22.546,8.74-1.016-.742-2.896.104-3.973.397l-3.873,3.873c-.168,3.111.589,6.259,2.681,7.052,6.123.611,8.604-.427,20.162-2.781l.397.298-8.541,2.881c-2.184.754-9.937.82-12.019,1.688-2.224-.177-4.058-3.75-5.362-5.363-.176-6.08,6.155-10.737,12.513-13.309,6.364-3.86,13.895-10.469,20.858-5.165Zm-5.562,1.291c-2.117.118-6.43,1.346-8.739,1.986-1.093.695-2.682,1.688-4.967,2.781.895-.198,2.384-.198,4.569-.198,1.543-1.719,7.743-3.024,9.137-4.569Z" />
											<path d="m155.261,68.573l-13.309,22.049c-1.767,3.402-3.712,7.971-6.556,10.329-2.042,3.27-11.165,22.098-14.799,26.717-.099,1.59-.694,3.179-1.887,4.768-3.466-1.773-2.632-3.032,0-6.059,1.49-1.688,2.284-2.979,2.384-3.873.584-3.006,3.669-6.748,5.761-9.436-.032-2.045,5.07-10.618,5.065-11.024,2.261-2.829,6.8-7.381,7.25-10.925,2.484-3.973,5.959-10.031,10.429-18.176,2.584-3.663,6.52-8.365,7.548-12.315,2.279-1.25,7.613-17.994,10.826-18.672,1.998.756.207,3.009,0,4.171-2.582,5.264-6.854,12.812-12.713,22.446Z" />
											<path d="m134.501,120.021c2.655-7.754,9.37-11.14,18.672-13.904.298.596,1.391.993,3.179,1.093,2.78,2.482,4.171,4.568,4.369,6.356-1.074,1.394-2.254,2.055-3.675,1.688l-1.092-1.093c.794-.497,1.092-1.391,1.092-2.583-2.09-.491-4.589-3.931-6.555-.993-8.469,1.794-15.462,7.917-14.401,16.487,1.887,2.582,3.874,3.973,5.86,4.072.73-1.826,2.527-.523,3.773-.397,2.103-.033,4.569-1.782,6.356-2.78l.597.496c.496-.397.894-.496.993-.496l1.092,1.092c-.78,2.124-6.928,2.952-7.945,3.675-7.116,2.394-10.997-1.63-13.904-7.448v-3.477l-.299.795c.325-1.573.597-1.801,1.888-2.583Z" />
											<path d="m190.318,111.877c-4.668,10.724-5.333,11.137-14.501,19.168-9.164,3.352-14.637,2.154-13.606-7.548,5.619-8.025,12.928-18.089,22.843-18.474,2.078.834,4.998,4.564,5.265,6.854Zm-4.072-3.179c-5.973-4.372-11.574,7.864-14.799,9.436-1.047-2.152,3.949-4.595,4.172-6.257-3.477,1.986-5.761,3.973-6.953,6.058l.497-.496,1.093,1.093-1.093.993-.497-.497c0,.1-.099.497-.496.993l-.695-.496c-.596,0-.894.496-.894,1.589l.496-.497,1.093.993c-1.567.423-.934,3.839-2.682,4.072l-.497-.396c-.099-.199-.099-.497-.099-.994-.702,1.815-.409,3.321.198,5.265,2.342.089,7.047.953,8.641-1.093,3.257.597,7.318-6.639,9.336-7.151,1.795-4.34,6.747-6.834,3.179-12.613Z" />
											<path d="m242.262,258.174c-6.552,5.623-12.142,8.502-18.771,7.35-2.725,1.256-4.811.463-7.548-1.589-5.717-4.052-10.506-10.319-12.217-16.884,2.099-2.05-3.203-3.915-.596-5.562-1.589-2.979-2.384-8.243-2.384-15.792-2.118-3.424,1.547-8.42.198-12.116,1.041-2.442,1.18-7.646,1.59-10.826,1.681-3.917,3.144-11.899,4.37-16.686.107-4.685,3.306-10.406,5.264-14.898l.397-.298c.695-1.291,1.489-3.377,2.284-6.257-.948-2.437,2.942-5.191,1.887-7.548,1.389-.988,1.876-5.518,2.781-6.655,3.046-2.465,6.664-14.606,7.945-16.784,0,0,2.682-7.549,2.682-7.549,2.507-1.849,5.334-10.831,6.654-12.613-2.85-2.301-16.482,9.463-16.189,9.038-3.675,2.88-6.654,5.662-9.038,8.443-1.471,1.119-2.873,1.134-3.973-.497,2.383-3.675,5.562-9.336,9.435-16.983l-.596-.596c-5.761,4.37-14.6,10.727-26.319,18.87-2.604-3.063,4.08-8.066,4.271-10.727,2.027-1.957,8.423-14.31,8.938-14.699.767-.463,2.806-2.105,3.179-.099-2.076,2.975-6.515,13.012-8.74,15.891l.596.695c4.578-2.12,17.778-13.941,23.142-15.494,2.848,2.493-.884,5.706-1.093,8.244-2.284,2.383-3.377,4.37-3.377,6.058.775-.192,19.001-13.313,23.639-13.209,2.019.857.567,2.452.496,3.873l-7.846,14.005c-2.484,4.245-9.503,22.816-13.408,27.71-.472,2.625-3.843,9.531-3.576,12.812-1.19,1.006-3.251,5.965-4.171,6.754-1.194,2.676-.782,5.686-2.582,8.74-1.899,3.51-2.503,4.801-1.49,7.847-2.56,4.816-3.809,5.84-2.979,8.641-2.028,5.251-2.909,16.601-2.483,25.525,1.728,1.541.185,5.449.894,7.35.474,1.553.944,10.544,2.682,12.911-.826,3.361,4.934,6.317,2.284,9.634.298.397.794.596,1.688.695l.496-.496c.811.323,1.347,2.65,1.49,2.979-.754.417.658,2.731.695,3.277,1.084-.112.692-2.533.894-2.682.663,1.536,4.993,2.624,5.661,4.37,13.64,3.332,26.903-9.671,33.371-20.957.635-.744,1.987-1.179,2.98-1.291,1.74.813,1.155,3.01.099,4.37l-13.606,13.706Z" />
											<path d="m268.779,112.075c-4.833,6.444-15.038,7.644-22.546,8.74-.424-.226-1.444-.69-2.086-.397-.686,1.769-.534,3.795-.298,5.661,1.888,2.582,3.874,3.973,5.86,4.072.73-1.826,2.528-.523,3.774-.397,2.102-.033,4.568-1.781,6.355-2.781l.597.497c.496-.397.894-.497.993-.497l1.092,1.093c-.779,2.124-6.928,2.952-7.945,3.675-7.117,2.394-10.996-1.63-13.904-7.449,0-2.284,0-3.575-.1-3.675.298-.694.894-1.191,1.688-1.589l1.589-3.773c4.966-4.172,9.138-7.351,16.984-9.436.322.636,2.575.33,3.277.397,2.482,2.284,3.973,4.271,4.271,5.959l.397-.1Zm-7.052-2.483c-1.911-1.212-2.919-1.524-4.271.199-6.093,1.316-8.878,4.49-12.713,9.336,3.255.35,7.537-2.228,9.733-2.284,2.231-2.411,9.806-1.576,9.534-6.059-.496-.1-1.291-.497-2.284-1.192Z" />
										</g>

										<mask
											id="letters-svg-mask"
											className={is_anime ? "play" : ""}
										>
											<path
												d="m2.348,80.572s13.419,12.98,21.14,11.079c11.174-2.751,31.536-24.701,38.025-25.239,6.389-.53-21.385,25.693-24.459,29.718-5.413,7.09-11.605,25.283-4.55,31.493,7.863,6.923,13.393-.655,24.769-25.374,5.379-11.687-4.068,10.878-3.945,16.587.122,5.676,1.673,14.786,13.121,13.366,13.775-1.709,27.472-54.096,41.337-72.768C119.974,43.023,148.869,1.639,164.589,3.026c13.958,1.232.197,23.508-1.461,26.479-3.816,6.839-18.161,39.068-46.781,47.618-20.951,6.259-24.626,35.136-24.711,36.652-.236,4.194,10.144,9.91,24.458-1.367,7.269-5.726-15.819-2.254-28.611,11.33-5.506,5.846,2.134,14.338,22.023,5.488,8.209-3.652,13.658-17.127,22.108-34.831,8.083-16.934,16.413-30.211,25.093-42.971,8.832-12.984,11.515-19.457,14.518-17.214,1.995,1.49-1.672,6.158-4.269,11.16-14.194,27.343-50.166,83.811-49.027,85.52,1.501,2.251,23.432-36.26,32.686-36.26s14.804,15.181,7.831,19.498c-.859.531.69-4.121-3.254-5.512-4.446-1.568-15.376,3.873-19.058,10.17-4.582,7.836,1.464,17.941,16.606,10.476,5.443-2.683,7.921-8.839,11.257-13.964,5.06-7.774,10.053-14.656,14.253-15.158,4.712-.563,6.287,6.287,6.287,6.287,0,0-6.17.676-11.059,5.378-7.294,7.016-14.107,18.556-6.59,19.339,10.68,1.112,26.25-15.425,19.163-24.49-3.502-4.48,19.11.016,19.11.016,0,0-15.172,22.934-13.202,21.95,7.36-3.68,22.652-16.087,27.364-18.532,3.843-1.994-8.655,18.608-8.655,18.608,0,0,24.492-19.558,28.995-18.558,2.483.552-7.782,13.937-17.175,36.307-7.761,18.484-17.071,46.77-18.527,55.455-4.023,23.99-1.911,60.906,17.765,61.991,15.992.882,21.799-8.424,33.696-21.683,16.131-17.979-26.232-116.275-15.112-123.496,1.019-.662,3.398,1.227,5.684.955,6.86-.816,16.662-2.504,19.182-6.277,4.198-6.286-7.162-6.324-13.13-3.134-9.205,4.921-14.85,16.586-2.918,20.99,9.58,3.536,44.874-28.294,44.874-28.294"
												fill="none"
												stroke="white"
												stroke-width="5.5"
											/>
										</mask>
									</svg>
								</div>

								<span
									className={`letters_pen ${is_anime ? "play" : ""}`}
								></span>
							</div>
						</div>
					</div>
				</div>
				<div className="fixbg"></div>
				<div className="splashbg" style={{ background: bgColor }}></div>
				<div className="splashbg2" style={{ background: bgColor }}></div>
				<div className="splashCirclebg" style={{ background: bgColor }}></div>
			</div>
			<SkipAnime
				isFront={is_front}
				onChange={(enableObj) => setAttributes(enableObj)}
			/>
		</>
	);
}
