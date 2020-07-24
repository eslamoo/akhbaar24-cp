import webpack from 'webpack';

require('dotenv').config();

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */

  head: {
    title: process.env.npm_package_name || '',
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: process.env.npm_package_description || ''
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'stylesheet',
      href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
    }
    ],
    script: [
      {
        src: '//cdn.embedly.com/widgets/platform.js',
        async: true
      },
      {
        src: '//platform.twitter.com/widgets.js',
        async: true
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',
  /*
   ** Global CSS
   */
  css: [
    '@/assets/css/pretty-checkbox.min.css',
    '@/assets/css/flatpickr.min.css',
    '@/assets/css/vue-multiselect.css',
    '@/assets/css/vuejs-noty.css',
    '@/assets/css/bootstrap-rtl.min.css',
    '@/assets/sass/style.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/bus',
    {
      src: '~/plugins/vuedraggable',
      ssr: false
    },
    {
      src: '~/plugins/vue-swal',
      ssr: false
    },
    {
      src: '~/plugins/vue-select-image',
      ssr: false
    },
    {
      src: '~/plugins/vue-infinite-loading',
      ssr: false
    },
    {
      src: '~/plugins/vue-notifications',
      ssr: false
    },
    {
      src: '~/plugins/laravel-vue-validator',
      ssr: false
    },
    {
      src: '~/plugins/laravel-permissions',
      ssr: false
    },
    {
      src: '~/plugins/vuejs-noty',
      ssr: false
    },
    {
      src: '~/plugins/vue-multiselect',
      ssr: false
    },
    {
      src: '~/plugins/vue-loading-overlay',
      ssr: false
    },
    {
      src: '~/plugins/vue-flatpicker',
      ssr: false
    },
    {
      src: '~/plugins/vue-devices',
      ssr: false
    },
    {
      src: '~/plugins/vue-pagination',
      ssr: false
    },
    {
      src: '~/plugins/media-library',
      ssr: false
    },
    {
      src: '~/plugins/modal-iframe',
      ssr: false
    },
    {
      src: '~/plugins/vue-editor',
      ssr: false
    }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/eslint-module',
    '@nuxtjs/moment'
  ],
  moment: {
    defaultLocale: 'ar'
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  /*
  * Router.
  */
  router: {
    middleware: ['auth']
  },
  /*
  * Axios.
  */
  axios: {
    baseURL: process.env.NODE_ENV === 'development'
      ? 'http://akhbaar24-api.test/api/v1' // 'http://192.168.1.29:8000/api/v1'
      : 'http://akhbaar24-api-dev.publisher.ws/api/v1'
  },
  /*
  * Auth.
  */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'access_token'
          },
          logout: {
            url: '/auth/logout',
            method: 'post'
          },
          user: {
            url: '/auth/user',
            method: 'get',
            propertyName: 'user'
          }
        },
        tokenRequired: true,
        tokenType: 'bearer'
      }
    }
  },
  loaders: [{
    test: /\.js$/,
    loader: 'babel',
    query: {
      compact: false
    }
  }],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config cd here
     */
    //  entry: './static/js/bootstrap.min.js',
    //  output: {
    //    filename: 'bundle.js',
    //    path: path.resolve(__dirname, 'dist')
    //  },
    filenames: {
      app: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].[hash].js' : '[chunkhash].js'
    },
    vendor: [
      'vuedraggable',
      'vue-swal',
      'bootstrap',
      'jquery',
      'laravel-permissions'
    ],
    plugins: [
      // ...
      new webpack.ProvidePlugin({
        // global modules
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery',
        'jQuery.fn': 'jquery',
        '_': 'lodash'
        // SimpleImage: '@editorjs/simple-image'
      })
    ],
    extractCSS: true,
    extend (config, ctx) {
    }
  }
};
