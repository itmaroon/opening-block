import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import "./style.scss";

import { BlockEditWrapper } from "itmar-block-packages";
import save from "./save";
import metadata from "./block.json";
import { ReactComponent as Logo } from "./l-solid.svg";

//ブロックを遅延読込
const LazyEditComponent = React.lazy(() => import("./edit"));
const BlockEdit = (props) => {
	return <BlockEditWrapper lazyComponent={LazyEditComponent} {...props} />;
};

registerBlockType(metadata.name, {
	description: __(
		"This is the opening that animates the logo.",
		"opening-block",
	),
	icon: <Logo />,
	edit: BlockEdit,
	save,
});
