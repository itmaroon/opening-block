export function endingAnimation(ending_type, setAttributes) {
  const iframe = document.getElementsByName('editor-canvas')[0]; // name属性を利用
  //iframeの有無で操作するドキュメント要素を峻別
  const target_doc = iframe ? (iframe.contentDocument || iframe.contentWindow.document) : document

  //要素を取得
  const splash = target_doc.getElementById('splash');
  const splash_logo = target_doc.getElementById('splash_logo');
  const splashbg = target_doc.getElementsByClassName('splashbg')[0];
  const splashbg2 = target_doc.getElementsByClassName('splashbg2')[0];
  const splashCirclebg = target_doc.getElementsByClassName('splashCirclebg')[0];
  const fixbg = target_doc.getElementsByClassName('fixbg')[0];
  //ロゴのフェードアウト
  splash_logo.animate(
    [
      { opacity: 1 },
      { opacity: 0 }
    ],
    {
      delay: 800,
      duration: 1000,
      fill: 'both'
    }
  ).addEventListener("finish", () => {
    //オープン型
    if (ending_type === 'virtical_open' || ending_type === 'horizen_open') {
      fixbg.classList.add('hide');//フェード用背景非表示
      //splash.classList.add('disappear');
      splash.animate([{ opacity: 0 }], { duration: 0, fill: 'both' });
      splashbg.classList.add('appear');//フェードアウト後appearクラス付与
      splashbg.classList.add(ending_type);//フェードアウト後クラス付与
      splashbg2.classList.add('appear');//フェードアウト後appearクラス付与
      splashbg2.classList.add(ending_type);//フェードアウト後appearクラス付与
      //最終処理
      splashbg2.addEventListener('animationend', function () {
        fixbg.classList.remove('hide');//フェード用背景非表示
        splashbg.classList.remove('appear');//フェードアウト後appearクラス付与
        splashbg.classList.remove(ending_type);//フェードアウト後appearクラス付与
        splashbg2.classList.remove('appear');//フェードアウト後appearクラス付与
        splashbg2.classList.remove(ending_type);//フェードアウト後appearクラス付与
        //splash.classList.remove('disappear');
        splash.classList.remove('hide');
        splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
        splash.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
        setAttributes({ is_anime: false }); //アニメボタンの変更
        setAttributes({ is_front: false }); //背面へ
      });
      //スライド型	
    } else if (ending_type === 'virtical_slide' || ending_type === 'horizen_slide') {
      splash.animate(
        [
          { opacity: 1 },
          { opacity: 0 }
        ],
        {
          delay: 800,
          duration: 1000,
          fill: 'both'
        }
      ).addEventListener("finish", () => {
        splashbg.classList.add('appear');//フェードアウト後appearクラス付与
        splashbg.classList.add(ending_type);//フェードアウト後appearクラス付与
        fixbg.classList.add('disappear');//フェードアウト後disappearクラス付与
        //最終処理
        fixbg.addEventListener('transitionend', function () {
          splashbg.classList.remove('appear');//フェードアウト後appearクラス削除
          splashbg.classList.remove(ending_type);//フェードアウト後appearクラス削除
          fixbg.classList.remove('disappear');//背景を戻す
          splash.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
          splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });

          setAttributes({ is_anime: false }); //アニメボタンの変更
          setAttributes({ is_front: false }); //背面へ
        });
      });
      //円形拡張型	
    } else if (ending_type === 'circle_expand') {
      splash.animate(
        [
          { opacity: 1 },
          { opacity: 0 }
        ],
        {
          delay: 800,
          duration: 1000,
          fill: 'both'
        }
      ).addEventListener("finish", () => {
        splashCirclebg.classList.add('appear');//フェードアウト後appearクラス付与
        fixbg.classList.add('disappear');//フェードアウト後disappearクラス付与
        //最終処理
        fixbg.addEventListener('transitionend', function () {
          splashCirclebg.classList.remove('appear');//フェードアウト後appearクラス削除
          fixbg.classList.remove('disappear');//背景を戻す
          splash.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
          splash_logo.animate([{ opacity: 1 }], { duration: 0, fill: 'both' });
          setAttributes({ is_anime: false }); //アニメボタンの変更
          setAttributes({ is_front: false }); //背面へ
        });
      });
    }
  });

}

