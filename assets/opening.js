

jQuery(function ($) {
  /*===========================================================*/
  /*エンディングアニメーション*/
  /*===========================================================*/
  const endingAnimation = (ending_type) => {
    const splash = document.getElementById('splash');
    const splash_logo = document.getElementById('splash_logo');
    const splashbg = document.getElementsByClassName('splashbg')[0];
    const splashbg2 = document.getElementsByClassName('splashbg2')[0];
    const splashCirclebg = document.getElementsByClassName('splashCirclebg')[0];
    const fixbg = document.getElementsByClassName('fixbg')[0];

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
        splashbg2.addEventListener('animationend', function () {
          splash.parentElement.style.zIndex = "-1";
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
            splash.parentElement.style.zIndex = "-1";
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
            splash.parentElement.style.zIndex = "-1";
          });
        });
      }
    });

  }

  /*===========================================================*/
  /*ロゴアウトラインアニメーション*/
  /*===========================================================*/
  //SVGアニメーションの描画

  if ($('#logo_anime').get(0)) {
    //HTMLからスタイル要素を取得
    let splashElement = $('#splash');
    let fillColor = splashElement.data('fill-color');
    let strokeColor = splashElement.data('stroke-color');
    let ending_type = splashElement.data('ending-type');
    //初期設定
    $("#logo_anime path").each(function () {
      const length = $(this).get(0).getTotalLength();
      $(this).css({
        'stroke': strokeColor,
        'strokeDasharray': length,
        'strostrokeDashoffsetke': length
      });
    });

    // アニメーションを開始

    const animatePaths = (paths) => {
      paths.each((index, pathElement) => {
        const path = $(pathElement);
        const length = path.get(0).getTotalLength();

        path.get(0).animate(
          [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
          { duration: 1000, fill: "both", delay: index * 800 }
        ).addEventListener("finish", () => {
          if (index === paths.length - 1) {
            $("#logo_anime").addClass("done"); //描画が終わったらdoneというクラスを追加
            $("#logo_anime path").css({
              'fill': fillColor, 'stroke': 'none'
            });
            // Reset all paths
            paths.each((i, pathToReset) => {
              $(pathToReset).css({
                'stroke-dashoffset': '',
                'stroke-dasharray': ''
              });
            });

            //ここからオープニング終了アニメーション
            endingAnimation(ending_type);

          }
        });
      });
    };

    animatePaths($("#logo_anime path"));

  }


  /*===========================================================*/
  /*コーヒーカップ*/
  /*===========================================================*/
  if ($('#splash .coffee').get(0)) {
    let splashElement = $('#splash');
    let ending_type = splashElement.data('ending-type');
    let duration = splashElement.data('duration');
    setTimeout(() => {
      //ここからオープニング終了アニメーション
      endingAnimation(ending_type);
    }, duration * 1000);
  }

  /*===========================================================*/
  /*Welcome*/
  /*===========================================================*/
  if ($('#splash .wrapper__letters').get(0)) {
    let splashElement = $('#splash');
    let ending_type = splashElement.data('ending-type');
    // 要素を取得
    const letter_mask = document.getElementById('letters-svg-mask');
    letter_mask.addEventListener('animationend', function () {
      //ここからオープニング終了アニメーション
      endingAnimation(ending_type);
    });

  }
});