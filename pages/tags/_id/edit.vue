<template>
  <div>
    <div class="card p-3 mb-3">
      <h2 style="font-size: 17px;font-weight: bold;">
        تعديل وسم
      </h2>

      <form @submit.prevent="update">
        <div class="row ">
          <div class="col-md-6 mt-2">
            <div class="card article-main-image">
              <h5 class="card-header">
                إضافة صورة الوسم
              </h5>
              <div class="card-body">
                <div class="wrapper">
                  <div class="file-upload">
                    <a
                      @click="openMediaGallery()"
                      style="width: 100%;text-align: center;"
                    >
                      <img id="output_image" v-if="tag.image" :src="tag.image">
                      <i class="fa fa-image" />
                    </a>
                  </div>
                </div>
                <small class="form-text text-muted">
                  يمكن اضافة صور بإمتداد png,jpg,jpeg مع مراعاة كون الصورة مقاس
                  400*300 أو مضاعفات الرقم
                </small>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-12">
            <div class>
              <input
                id
                v-model="tag.name"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="اسم السلسلة"
              >
              <span class="text-danger">
                <error input="title" />
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-12 mt-2">
            <div class>
              <textarea
                v-model="tag.bio"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="وصف"
              />
              <span class="text-danger">
                <error input="bio" />
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-12 mt-2">
            <div class>
              <input
                id
                v-model="tag.website"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="الموقع"
              >
              <span class="text-danger">
                <error input="website" />
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-12 mt-2">
            <div class>
              <input
                id
                v-model="tag.phone"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="هاتف"
              >
              <span class="text-danger">
                <error input="phone" />
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-12 mt-2">
            <div class>
              <input
                id
                v-model="tag.email"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="البريد الالكتروني"
              >
              <span class="text-danger">
                <error input="email" />
              </span>
            </div>
          </div>
        </div>
        <div class="col-md-12 text-right">
          <button v-if="!busy" type="submit" class="btn btn-primary pull-left">
            <i class="fa fa-plus" />

            <span class="submit-text">حفظ</span>
          </button>
          <button v-else type="submit" class="btn btn-primary pull-left" disabled>
            <i class="fa fa-spinner fa-spin" />

            <span class="submit-text">حفظ</span>
          </button>
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
      busy: false,
      isGalleryOpen: false
    };
  },
  async asyncData ({ $axios, error, params }) {
    try {
      const response = await $axios.$get(`/cp/tags/${params.id}/edit`);

      return {
        tag: response.data
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  created () {
    this.$bus.$on('open mediagallery', () => {
      this.isGalleryOpen = true;
    });

    this.$bus.$on('insert to thumbnail', (images) => {
      this.tag.image = images[0].src;
    });
  },
  methods: {
    async update () {
      try {
        this.busy = true;
        this.$errors.flush();

        const response = await this.$axios.$patch(`/cp/tags/${this.tag.id}`, {
          name: this.tag.name,
          image: this.tag.image,
          email: this.tag.email,
          website: this.tag.website,
          phone: this.tag.phone,
          bio: this.tag.bio
        });

        if (response.type === 'success') {
          this.$noty.success(
            '<i class="fa fa-check"></i> ' + response.message,
            {
              layout: 'topCenter',
              timeout: 1500,
              theme: 'relax'
            }
          );
          this.$router.push('/tags');
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
