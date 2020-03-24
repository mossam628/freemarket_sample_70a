$(function(){
  function buildHTML(count) {
    var html = `<div class="preview-box" id="preview-box__${count}">
                  <div class="upper-box">
                    <img src="" alt="preview">
                  </div>
                  <div class="lower-box">
                    <div class="update-box">
                      <label class="edit_btn">編集</label>
                    </div>
                    <div class="delete-box" id="delete_btn_${count}">
                      <span>削除</span>
                    </div>
                  </div>
                </div>`
    console.log(html)
    return html;
  }
  // if (window.location.href.match(/\/items\/\d+\/edit/)){
  //   var prevContent = $('.label-content').prev();
  //   labelWidth = (620 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
  //   $('.label-content').css('width', labelWidth);
  //   $('.preview-box').each(function(index, box){
  //     $(box).attr('id', `preview-box__${index}`);
  //   })
  //   $('.delete-box').each(function(index, box){
  //     $(box).attr('id', `delete_btn_${index}`);
  //   })
  //   var count = $('.preview-box').length;
  //   if (count == 5) {
  //     $('.label-content').hide();
  //   }
  // }

  function setLabel() {
    var prevContent = $('.label-content').prev();
    labelWidth = (620 - $(prevContent).css('width').replace(/[^0-9]/g, ''));
    $('.label-content').css('width', labelWidth);
  }

  $(document).on('change', '.hidden-field', function() {
    setLabel();
    var id = $(this).attr('id').replace(/[^0-9]/g, '');
    console.log(id)
    $('.label-box').attr({id: `label-box--${id}`,for: `item_images_attributes_${id}_image`});
    var file = this.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      var image = this.result;
      if ($(`#preview-box__${id}`).length == 0) {
        var count = $('.preview-box').length;
        var html = buildHTML(id);
        var prevContent = $('.label-content').prev();
        $(prevContent).append(html);
      }
      $(`#preview-box__${id} img`).attr('src', `${image}`);
      var count = $('.preview-box').length;
      if (count == 5) { 
        $('.label-content').hide();
      }
      if ($(`#item_images_attributes_${id}__destroy`)){
        $(`#item_images_attributes_${id}__destroy`).prop('checked',false);
      } 
      setLabel();
      if(count < 5){
        $('.label-box').attr({id: `label-box--${count}`,for: `item_images_attributes_${count}_image`});
      }
    }
  });

  // 画像の削除
  $(document).on('click', '.delete-box', function() {
    var count = $('.preview-box').length;
    setLabel(count);
    var id = $(this).data('id')
    console.log(this)
    $(`#preview-box__${id}`).remove();
    if ($(`#item_images_attributes_${id}__destroy`).length == 0) {
      //フォームの中身を削除 
      $(`#item_images_attributes_${id}_image`).val("");
      var count = $('.preview-box').length;
      //5個めが消されたらラベルを表示
      if (count == 4) {
        $('.label-content').show();
      }
      setLabel(count);
      if(id < 5){
        $('.label-box').data({id: `label-box--${id}`,for: `item_images_attributes_${id}_image`});
      }
    } 
    else {
      //投稿編集時
      $(`#item_images_attributes_${id}__destroy`).prop('checked',true);
      //5個めが消されたらラベルを表示
      if (count == 4) {
        $('.label-content').show();
      }
      //ラベルのwidth操作
      setLabel();
      //ラベルのidとforの値を変更
      //削除したプレビューのidによって、ラベルのidを変更する
      if(id < 5){
        $('.label-box').attr({id: `label-box--${id}`,for: `item_images_attributes_${id}_image`});
      }
    }
  });
});