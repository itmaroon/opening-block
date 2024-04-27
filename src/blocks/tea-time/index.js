import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";

import { BlockEditWrapper } from "itmar-block-packages";
import save from "./save";
import metadata from "./block.json";
import { ReactComponent as Teatime } from "./mug-hot-solid.svg";

//ブロックを遅延読込
const LazyEditComponent = React.lazy(() => import("./edit"));
const BlockEdit = (props) => {
	return <BlockEditWrapper lazyComponent={LazyEditComponent} {...props} />;
};

registerBlockType(metadata.name, {
	description: __(
		"This is an animation where letters rise like steam from a cup.",
		"opening-block",
	),
	icon: <Teatime />,
	edit: BlockEdit,
	save,
});
