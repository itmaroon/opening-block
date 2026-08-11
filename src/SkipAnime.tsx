import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { dispatch } from "@wordpress/data";
import { InnerBlocks } from "@wordpress/block-editor";

interface SkipAnimeProps {
	isFront: boolean;
	onChange(attributes: { is_check_enable: boolean }): void;
}

interface BlockRegistrationResponse {
	registered: boolean;
}

export default function SkipAnime({ isFront, onChange }: SkipAnimeProps) {
	const [isBlockRegistered, setIsBlockRegistered] = useState<boolean | null>(null);

	useEffect(() => {
		fetch(
			`${itmar_option.home_url}/wp-json/itmar-rest-api/v1/is-block-registered/?block_name=itmar/design-checkbox`,
		)
			.then((response) => response.json() as Promise<BlockRegistrationResponse>)
			.then((data) => {
				setIsBlockRegistered(data.registered);
				onChange({ is_check_enable: data.registered });
				if (!data.registered) {
					dispatch("core/notices").createNotice(
						"error",
						__(
							"The plugin that displays the Skip opening checkbox is not enabled.",
							"opening-block",
						),
						{ type: "snackbar" },
					);
				}
			})
			.catch((error: unknown) => console.error("エラー:", error));
	}, []);

	if (isBlockRegistered === null) {
		return (
			<div className="opening_check waiting" style={{ display: "block" }}>
				{__("Checking block status...", "opening-block")}
			</div>
		);
	}

	if (!isBlockRegistered) {
		return null;
	}

	const checkLabel = __(
		"The opening will not be displayed next time.",
		"opening-block",
	);
	const checkTemplate = [
		[
			"itmar/design-checkbox",
			{
				inputName: "anim_is_skip",
				labelContent: checkLabel,
				bgColor: "transparent",
				labelColor: "#ffffff",
			},
		],
	];

	return (
		<div
			className={`opening_check ${!isFront ? "closing" : ""}`}
			style={{ display: "block" }}
		>
			<InnerBlocks template={checkTemplate} templateLock={false} />
		</div>
	);
}
