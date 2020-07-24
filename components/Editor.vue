<template>
  <div id="editorjs" />
</template>

<script>
import OpenMedia from '~/plugins/OpenMedia';

export default {
  name: 'Editor',
  props: {
    body: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      editorJS: {}
    };
  },
  created () {
    this.$bus.$on('insert to editor', (images) => {
      images.forEach((image) => {
        this.editorJS.blocks.insert('image', { url: image.src });
      });
    });

    this.$bus.$on('save-editor', (publish = false) => {
      this.editorJS.save().then((content) => {
        const blocks = content.blocks.filter((block) => {
          return block.type !== 'openMedia';
        });

        this.$bus.$emit('editor-saved', blocks, publish);
      });
    });
  },
  beforeDestroy () {
    this.$bus.$off('insert to editor');
    this.$bus.$off('save-editor');
  },
  mounted () {
    const EditorJS = require('@editorjs/editorjs');
    const Header = require('@editorjs/header');
    const List = require('@editorjs/list');
    const SimpleImage = require('@editorjs/simple-image');
    const Embed = require('@editorjs/embed');
    const Quote = require('@editorjs/quote');
    const Marker = require('@editorjs/marker');
    // eslint-disable-next-line no-unused-vars
    this.editorJS = new EditorJS({
      holderId: 'editorjs',
      data: this.setBody(this.body),
      tools: {
        header: Header,
        list: List,
        image: SimpleImage,
        openMedia: OpenMedia,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              twitter: true,
              instagram: {
                // eslint-disable-next-line no-useless-escape
                regex: /https?:\/\/www\.instagram\.com\/p\/([^\/\?\&]+)\/?/,
                embedUrl: 'https://www.instagram.com/p/<%= remote_id %>/embed',
                html: '<iframe width="400" height="505" style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
                height: 505,
                width: 400
              }
            }
          }
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'ادخل الإقتباس',
            captionPlaceholder: 'صاحب الإقتباس'
          }
        },
        Marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M'
        }
      }
    });
  },
  methods: {
    setBody (body = null) {
      return {
        blocks: body
      };
    }
  }
};
</script>
