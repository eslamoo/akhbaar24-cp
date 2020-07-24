import Vue from 'vue';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
// import CKEditor from '@ckeditor/ckeditor5-vue';
import CKEditor from 'vue-ckeditor5';

const options = {
  editors: {
    inline: InlineEditor
  },
  name: 'ckeditor'
};

Vue.use(CKEditor.plugin, options);
