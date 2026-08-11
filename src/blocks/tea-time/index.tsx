import { __ } from "@wordpress/i18n";
import { registerBlockType, type BlockEditProps } from "@wordpress/blocks";
import "./style.scss";

import { BlockEditWrapper } from "itmar-block-packages";
import save from "./save";
import metadata from "./block.json";
import { ReactComponent as Teatime } from "./mug-hot-solid.svg";
import type { Attributes } from "./type";
import { deprecatedAttributes, deprecatedSave } from "./deprecated";

//ブロックを遅延読込
const LazyEditComponent = React.lazy(() => import("./edit"));
const BlockEdit = (props: BlockEditProps<Attributes>) => (
	<BlockEditWrapper lazyComponent={LazyEditComponent} {...props} />
);

registerBlockType<Attributes>(metadata.name, {
	description: __(
		"This is an animation where letters rise like steam from a cup.",
		"opening-block",
	),
	icon: <Teatime />,
	edit: BlockEdit,
	save,
	deprecated: [
		{
			attributes: deprecatedAttributes,
			save: deprecatedSave,
		},
	],
});
