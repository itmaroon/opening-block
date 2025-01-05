import { __ } from "@wordpress/i18n";

import { useEffect, useRef } from "@wordpress/element";
import { useSelect, dispatch } from "@wordpress/data";
import { flattenBlocks } from "itmar-block-packages";

const useBlockRestriction = (disabledBlocks) => {
	const previousBlocksRef = useRef([]); // 前回のブロック状態を保持
	const removedBlocksRef = useRef(new Set()); // 削除済みのclientIdを記録

	const blocks = useSelect(
		(select) => select("core/block-editor").getBlocks(),
		[],
	);

	useEffect(() => {
		const previousBlocks = previousBlocksRef.current; // 前回の状態を取得
		const currentBlocks = flattenBlocks(blocks); // 現在の全てのブロックの状態

		// 現在の状態から新規登録されたブロックを取得
		const newlyAddedBlocks = currentBlocks.filter(
			(currentBlock) =>
				!previousBlocks.some(
					(prevBlock) => prevBlock.clientId === currentBlock.clientId,
				),
		);

		// 新規登録されたブロックの中に制限されたブロックが含まれるかを判定
		const existingRestrictedBlocks = currentBlocks.filter((block) =>
			disabledBlocks.includes(block.name),
		);
		// 制限ブロックが既に存在している場合、新規登録された制限ブロックを削除
		if (existingRestrictedBlocks.length > 1) {
			newlyAddedBlocks.forEach((block) => {
				if (
					disabledBlocks.includes(block.name) && // 制限ブロックか？
					!removedBlocksRef.current.has(block.clientId) // まだ削除済みでないか？
				) {
					dispatch("core/notices").createNotice(
						"error",
						__("Only one opening block can be placed.", "opening-block"),
						{ type: "snackbar" },
					);
					dispatch("core/block-editor").removeBlock(block.clientId);
					removedBlocksRef.current.add(block.clientId); // 削除済みとして記録
				}
			});
		}

		// 現在の状態を次回のために保存
		previousBlocksRef.current = currentBlocks;
	}, [blocks, disabledBlocks]);
};

// プラグイン初期化用コンポーネント
const BlockRestrictionHandler = ({ disabledBlocks }) => {
	useBlockRestriction(disabledBlocks);
	return null; // 表示するUIは不要
};

// 自動的にレンダリング
const initializeBlockRestrictionHandler = (disabledBlocks) => {
	if (document.body) {
		const container = document.createElement("div");
		document.body.appendChild(container);

		const root = ReactDOM.createRoot(container);
		root.render(<BlockRestrictionHandler disabledBlocks={disabledBlocks} />);
	}
};

// 使用例: 制限するブロック名を指定して監視を開始
const disabledBlocks = ["itmar/logo-anime", "itmar/tea-time", "itmar/welcome"];
initializeBlockRestrictionHandler(disabledBlocks);
