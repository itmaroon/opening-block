import { __ } from "@wordpress/i18n";
import { useEffect, useRef } from "@wordpress/element";
import { useSelect, dispatch } from "@wordpress/data";
import { flattenBlocks } from "itmar-block-packages";

interface BlockInstance {
	clientId: string;
	name: string;
}

interface BlockEditorSelect {
	getBlocks(): BlockInstance[];
}

const useBlockRestriction = (disabledBlocks: readonly string[]) => {
	const previousBlocksRef = useRef<BlockInstance[]>([]);
	const removedBlocksRef = useRef<Set<string>>(new Set());

	const blocks = useSelect<BlockInstance[]>((select) => {
		const blockEditor = select("core/block-editor") as BlockEditorSelect;
		return blockEditor.getBlocks();
	}, []);

	useEffect(() => {
		const previousBlocks = previousBlocksRef.current;
		const currentBlocks = flattenBlocks(blocks);
		const newlyAddedBlocks = currentBlocks.filter(
			(currentBlock) =>
				!previousBlocks.some(
					(previousBlock) =>
						previousBlock.clientId === currentBlock.clientId,
				),
		);
		const existingRestrictedBlocks = currentBlocks.filter((block) =>
			disabledBlocks.includes(block.name),
		);

		if (existingRestrictedBlocks.length > 1) {
			newlyAddedBlocks.forEach((block) => {
				if (
					disabledBlocks.includes(block.name) &&
					!removedBlocksRef.current.has(block.clientId)
				) {
					dispatch("core/notices").createNotice(
						"error",
						__("Only one opening block can be placed.", "opening-block"),
						{ type: "snackbar" },
					);
					dispatch("core/block-editor").removeBlock(block.clientId);
					removedBlocksRef.current.add(block.clientId);
				}
			});
		}

		previousBlocksRef.current = currentBlocks;
	}, [blocks, disabledBlocks]);
};

const BlockRestrictionHandler = ({
	disabledBlocks,
}: {
	disabledBlocks: readonly string[];
}): null => {
	useBlockRestriction(disabledBlocks);
	return null;
};

const initializeBlockRestrictionHandler = (
	disabledBlocks: readonly string[],
) => {
	if (!document.body) {
		return;
	}

	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = ReactDOM.createRoot(container);
	root.render(<BlockRestrictionHandler disabledBlocks={disabledBlocks} />);
};

const disabledBlocks = [
	"itmar/logo-anime",
	"itmar/tea-time",
	"itmar/welcome",
] as const;
initializeBlockRestrictionHandler(disabledBlocks);
