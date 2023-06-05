

jQuery(function ($) {
  /*===========================================================*/
  /*ロゴアウトラインアニメーション*/
  /*===========================================================*/
  //SVGアニメーションの描画

  if ($('#logo_anime').get(0)) {
    //HTMLからスタイル要素を取得
    let splashElement = $('#splash');
    let fillColor = splashElement.data('fill-color');
    let strokeColor = splashElement.data('stroke-color');
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
          }
        });
      });
    };

    animatePaths($("#logo_anime path"));

  }


  /*===========================================================*/
  /*コーヒーカップ*/
  /*===========================================================*/
  //文字の分割
  split_char_span($('.div_text'));

  function split_char_span(div_text) {
    let span_text = div_text.text();//テキスト取得
    let parent_elm = div_text.parent();//親要素
    div_text.remove();
    for (let i = 0; i < span_text.length; i++) {
      let span_elm = $('<span>' + span_text.charAt(i) + '</span>');
      span_elm.css('animation-delay', `${i * 0.1}s`)
      parent_elm.append(span_elm);
    }

  }
});