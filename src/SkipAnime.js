
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import {
  InnerBlocks
} from '@wordpress/block-editor';

export default function SkipAnime({ isFront, onChange }) {
  var [isBlockRegistered, setIsBlockRegistered] = useState(null);

  useEffect(function () {
    //ブロックが有効かどうかをカスタムエンドポイントで検証
    fetch(`${opening_block.home_url}/wp-json/itmar-rest-api/v1/is-block-registered/?block_name=itmar/design-checkbox`)
      .then(response => response.json())
      .then(data => {
        setIsBlockRegistered(data.registered);
        if (data.registered) {
          onChange({ is_check_enable: true })
        } else {
          onChange({ is_check_enable: false })
          dispatch('core/notices').createNotice(
            'error',
            __("The plugin that displays the Skip opening checkbox is not enabled.", 'opening-block'),
            { type: 'snackbar' }
          );
        }
      })
      .catch(error => console.error('エラー:', error));
  }, []); // 空の依存配列で、コンポーネントのマウント時にのみ実行されるようにする

  // APIからのレスポンスに基づいて条件分岐
  if (isBlockRegistered === null) {
    return (
      <div
        className='opening_check waiting'
        style={{ display: 'block' }}
      >
        {__("Checking block status...", 'opening-block')}
      </div>
    );
  } else if (isBlockRegistered) {
    //チェックボックス用インナーブロック
    const check_label = __("The opening will not be displayed next time.", 'opening-block');
    const CHECKTEMPLATE = [
      ['itmar/design-checkbox',
        {
          inputName: 'anim_is_skip',
          labelContent: check_label,
          bgColor: 'transparent',
          labelColor: '#ffffff'
        }
      ]
    ];

    return (
      <div
        className={`opening_check ${!isFront ? 'closing' : ''}`}
        style={{ display: 'block' }}
      >
        <InnerBlocks
          template={CHECKTEMPLATE}
          templateLock="all"
        />
      </div>
    );
  } else {
    return null;
  }
}

