import { __ } from '@wordpress/i18n';
import { select, subscribe, dispatch } from '@wordpress/data';
//初めのブロックの状態を取得
let blocksInEditor = select('core/block-editor').getBlocks();
let noticeCreated = false;  //エラーメッセージ表示フラグ

subscribe(() => {
  //状態変更時のブロックの状態を取得
  const newBlocksInEditor = select('core/block-editor').getBlocks();

  if (newBlocksInEditor.length > blocksInEditor.length) {
    //オープニングブロックがあるかの検証
    const disabledBlocks = ['itmar/logo-anime', 'itmar/tea-time', 'itmar/welcome'];
    const isDisabledBlockPresent = blocksInEditor.some(block => disabledBlocks.includes(block.name));
    // 追加しようとするブロックの取得
    const newBlock = newBlocksInEditor.find(
      block => !blocksInEditor.some(existingBlock => existingBlock.clientId === block.clientId)
    );
    const isNewBlockDisabled = disabledBlocks.includes(newBlock.name)
    //オープニングブロックがあり追加しようとするブロックもオープニングブロックの場合
    if (isDisabledBlockPresent && isNewBlockDisabled) {
      //noticeCreatedがfalseならエラー通知
      if (!noticeCreated) {
        noticeCreated = true;
        dispatch('core/notices').createNotice(
          'error',
          __("Only one opening block can be placed.", 'opening-block'),
          { type: 'snackbar' }
        );
      }
      noticeCreated = false;
      // 追加されたブロックを削除する
      dispatch('core/block-editor').removeBlock(newBlock.clientId, false);

    }
  }
  // ブロックリストを更新する
  blocksInEditor = newBlocksInEditor;
});
