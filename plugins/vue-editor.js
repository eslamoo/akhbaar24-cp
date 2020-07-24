import Vue from 'vue';
import Editorjs from 'vue-editor-js';

import Editor from '~/components/Editor';

Vue.use(Editorjs);

Vue.component('Editor', Editor);
