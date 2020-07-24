<template>
  <div>
    <div class="card p-3 mb-3">
      <h2 style="font-size: 17px;font-weight: bold;">
        إضافة مصدر
      </h2>

      <form @submit.prevent="store">
        <div class="row">
          <div class="col-md-6 col-6 mt-2">
            <div class>
              <input
                id
                v-model="source.title"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="اسم المصدر"
              >
              <span class="text-danger">
                <error input="title" />
              </span>
            </div>
          </div>
        </div>
        <div class="row ">
          <div class="col-md-6 col-6 mt-2">
            <div class="card article-main-image">
              <h5 class="card-header">
                إضافة صورة المصدر
              </h5>
              <div class="card-body">
                <div class="wrapper">
                  <div class="file-upload">
                    <a
                      @click="openMediaGallery()"
                      style="width: 100%;text-align: center;"
                    >
                      <img id="output_image" v-if="source.image" :src="source.image">
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
          <div class="col-6  text-right mt-4">
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
      source: {
        title: '',
        image: null
      },
      busy: false,
      isGalleryOpen: false
    };
  },
  async asyncData ({ $axios, error }) {
    try {
      await $axios.$get('/cp/sources/create');
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  created () {
    this.$bus.$on('open mediagallery', () => {
      this.isGalleryOpen = true;
    });

    this.$bus.$on('insert to thumbnail', (images) => {
      this.source.image = images[0].src;
    });
  },
  methods: {
    async store () {
      try {
        this.busy = true;
        this.$errors.flush();

        const response = await this.$axios.$post('/cp/sources', this.source);

        if (response.type === 'success') {
          this.$noty.success(
            '<i class="fa fa-check"></i> ' + response.message,
            {
              layout: 'topCenter',
              timeout: 5000,
              theme: 'relax'
            }
          );
          this.$router.push('/sources');
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
