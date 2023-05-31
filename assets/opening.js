

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
    //初期の設定
    $("#logo_anime path").css({
      'stroke': strokeColor
    });
    var stroke;
    stroke = new Vivus('logo_anime', {//アニメーションをするIDの指定
      start: 'autostart',//自動再生
      type: 'scenario-sync',// アニメーションのタイプを設定
      duration: 30,//アニメーションの時間設定。数字が小さくなるほど速い
      forceRender: false,//パスが更新された場合に再レンダリングさせない
      animTimingFunction: Vivus.EASE,//動きの加速減速設定
    },
      function () {
        $("#logo_anime").attr("class", "done");//描画が終わったらdoneというクラスを追加
        $("#logo_anime path").css({
          'fill': fillColor, 'stroke': 'none'
        });
      }
    );

    // if (document.getElementById('svg_file')) {
    //   $.ajax({
    //     type: 'GET',
    //     url: plugin.asset_url + '/1_animated.svg',
    //     dataType: 'text',
    //   }).done(function (data) {
    //     console.log("done")
    //     // SVGファイルの内容をHTMLドキュメントに挿入
    //     $('#svg_file').html(data);
    //     var svgElement = document.querySelector("#svg_file svg");
    //     svgElement.id = "my-svg";
    //     // Vivusでアニメーションを適用
    //     new Vivus('my-svg', { type: 'delayed', duration: 200 });

    //   });
    // }
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