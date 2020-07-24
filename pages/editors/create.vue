<template>
  <div>
    <div class="card p-3 mb-3">
      <h2 style="font-size: 17px;font-weight: bold;">
        إضافة محرر
      </h2>

      <form @submit.prevent="store">
        <div class="row">
          <div class="col-md-6 col-6 mt-2">
            <div class>
              <input
                id
                v-model="editor.name"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="اسم المحرر"
              >
              <span class="text-danger">
                <error input="name" />
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-6 mt-2">
            <div class>
              <input
                id
                v-model="editor.email"
                type="email"
                name="article-num"
                class="form-control"
                placeholder="البريد الاكتروني"
              >
              <span class="text-danger">
                <error input="email" />
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-6 mt-2">
            <div class>
              <input
                id
                v-model="editor.social_profile"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="حساب السوشيال ميديا"
              >
              <span class="text-danger">
                <error input="social_profile" />
              </span>
            </div>
          </div>
        </div>
        <div class="row ">
          <div class="col-md-6 col-6 mt-2">
            <div class="card article-main-image">
              <h5 class="card-header">
                إضافة صورة المحرر
              </h5>
              <div class="card-body">
                <div class="wrapper">
                  <div class="file-upload">
                    <a
                      @click="openMediaGallery()"
                      style="width: 100%;text-align: center;"
                    >
                      <img id="output_image" v-if="editor.avatar" :src="editor.avatar">
                      <i class="fa fa-image" />
                    </a>
                  </div>
                </div>
                <small class="form-text text-muted">
                  يمكن اضافة صور بإمتداد
                  png,jpg,jpeg مع مراعاة كون الصورة مقاس 400*300 أو مضاعفات
                  الرقم
                </small>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-6 text-right mt-4">
            <div class="">
              <button v-if="!busy" type="submit" class="btn submit btn-lg">
                <span class="submit-icon">
                  <i class="fa fa-plus" />
                </span>
                <span class="submit-text">إضافة</span>
              </button>
              <button v-else type="submit" class="btn submit btn-lg" disabled>
                <span class="submit-icon">
                  <i class="fa fa-spinner fa-spin" />
                </span>
                <span class="submit-text">إضافة</span>
              </button>
            </div>
          </div>
        </div>
      </form>
      <MediaGallery
        v-if="isGalleryOpen"
        @close="closeMediaGallery"
        :source="'thumbnail'"
      />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      editor: {
        name: '',
        avatar: null,
        email: '',
        social_profile: ''
      },
      busy: false,
      isGalleryOpen: false
    };
  },
  async asyncData ({ $axios, error }) {
    try {
      await $axios.$get('/cp/editors/create');
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  created () {
    this.$bus.$on('open mediagallery', () => {
      this.isGalleryOpen = true;
    });

    this.$bus.$on('insert to thumbnail', (images) => {
      this.editor.avatar = images[0].src;
    });
  },
  methods: {
    async store () {
      try {
        this.busy = true;
        this.$errors.flush();

        const response = await this.$axios.$post('/cp/editors', this.editor);

        if (response.type === 'success') {
          this.$noty.success(
            '<i class="fa fa-check"></i> ' + response.message,
            {
              layout: 'topCenter',
              timeout: 5000,
              theme: 'relax'
            }
          );
          this.$router.push('/editors');
        }
      } catch (e) {
        if (e.response.status === 422) {
          this.$errors.fill(e.response.data.errors);
        } else {
          window.error({ statusCode: e.response.status });
        }
      }
      this.busy = false;
    },
    openMediaGallery () {
      this.$bus.$emit('open mediagallery');
    },
    closeMediaGallery () {
      this.isGalleryOpen = false;
      $('body').removeClass('modal-open');
    }
  }
};
</script>

<style>
</style>
