(function() {
  "use strict";


// ! Preview selected image on main article image
function preview_image(event) {
  var reader = new FileReader();
  reader.onload = function() {
    var output = document.getElementById("output_image");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}



// ! Fix Focus issue in bootstrap modal when open another modal on it
$("#myModal2").on("shown.bs.modal", function() {
  $(document).off("focusin.modal");
});

// ! Add a csutom buttom to summer note
var mediaGalleryButton = function(context) {
  var ui = $.summernote.ui;

  // ! create button
  var button = ui.button({
    contents: '<i class="fa fa-image"/>',
    tooltip: "mediaGallery",
    click: function() {
      // invoke insertText method with 'hello' on editor module.
      //   context.invoke('editor.insertText', 'hello');
      $("#mediaGallery").modal({
        // backdrop: false
      });
    }
  });

  return button.render(); // ! return button as jquery object
};

// ! Insert image in editor
$("#insert").click(function() {
  $("#summernote").summernote(
    "insertImage",
    "https://i1.sndcdn.com/artworks-000404495976-qipddp-t500x500.jpg"
  );
  // ! close media gallery after add the image
  $("#mediaGallery").modal("hide");
});


// ! Trigger SummerNote
$("#summernote").summernote({
  placeholder: "محتوى المادة",
  tabsize: 2,
  height: 150,
  toolbar: [
    ["style", ["bold", "italic", "underline"]],
    ["para", ["ul", "ol", "paragraph"]],
    ["mybutton", ["mediaGallery"]],
    ["insert", ["link", "video"]]
  ],
  buttons: {
    mediaGallery: mediaGalleryButton
  }
});


// ! Fix backdrop z-index to be above the first modal
$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function() {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});

// ! Fix Scroll issue after closing nested modal
$(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
});




// ! Make Album items draggable
// $( function() {
//   $( ".articleAlbum__list" ).sortable();
//   $( ".articleAlbum__list" ).sortable({cancel: '.articleAlbum__list #editor'});
// } );

// ! Hide tooltip after clicking on editor

$('[data-toggle="tooltip"]').on('focus', function () {
    $(this).tooltip('hide')
})
