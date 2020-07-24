<template>
  <div>
    <div class="card p-3 mb-3">
      <h2 style="font-size: 17px;font-weight: bold;">
        تعديل محرر
      </h2>

      <form @submit.prevent="update">
        <div class="row">
          <div class="col-md-6 mt-2">
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
          <div class="col-md-6 mt-2">
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
                  يمكن اضافة صور بإمتداد png,jpg,jpeg مع مراعاة كون الصورة مقاس
                  400*300 أو مضاعفات الرقم
                </small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 text-right mt-3">
          <div v-if="status !== 'deleted'">
            <button
              v-permission:any="'delete editor|delete any editor'"
              @click="remove()"
              type="button"
              class="btn bg-white text-danger border-danger"
            >
              <i class="fa fa-times" aria-hidden="true" />
              حذف
            </button>

            <button v-if="!busy" type="submit" class="btn btn-primary">
              <i class="fa fa-plus" />

              <span class="submit-text">حفظ</span>
            </button>

            <button v-else type="submit" class="btn btn-primary" disabled>
              <i class="fa fa-spinner fa-spin" />

              <span class="submit-text">حفظ</span>
            </button>
          </div>

          <button
            v-permission:any="'delete editor|delete any editor'"
            @click="restore()"
            v-else
            type="button"
            class="btn bg-white text-success border-success"
          >
            <i class="fa fa-refresh" aria-hidden="true" />
            استعادة
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
      const response = await $axios.$get(`/cp/editors/${params.id}/edit`);

      return {
        editor: response.data,
        status: response.data.status
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
      this.editor.avatar = images[0].src;
    });
  },
  methods: {
    async update () {
      try {
        this.busy = true;
        this.$errors.flush();

        const response = await this.$axios.$patch(
          `/cp/editors/${this.editor.id}`,
          this.editor
        );

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
    remove () {
      this.$swal({
        title: 'تأكيد الحذف؟',
        icon: 'warning',
        buttons: ['إلغاء', 'حذف'],
        dangerMode: true
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await this.$axios.$delete(
              `/cp/editors/${this.editor.id}`
            );
            if (response.type === 'success') {
              this.$noty.success(response.message, {
                layout: 'topCenter',
                timeout: 5000,
                theme: 'relax'
              });

              this.$router.push('/editors');
            }
          } catch (e) {
            if (e.response.status === 422) {
              this.$noty.error(
                '<i class="fa fa-warning"></i> ' + e.response.data.message,
                {
                  layout: 'topCenter',
                  timeout: 5000,
                  theme: 'relax'
                }
              );
            } else {
              window.error({ statusCode: e.response.status });
            }
          }
        }
      });
    },
    restore () {
      this.$swal({
        title: 'تأكيد الإستعادة؟',
        icon: 'warning',
        buttons: ['إلغاء', 'إستعادة'],
        dangerMode: true
      }).then(async (willRestore) => {
        if (willRestore) {
          try {
            const response = await this.$axios.$patch('/cp/restore',
              {
                id: this.editor.id,
                type: 'users'
              }
            );

            if (response.type === 'success') {
              this.$noty.success('تم إستعادة المحرر بنجاح', {
                layout: 'topCenter',
                timeout: 5000,
                theme: 'relax'
              });

              this.$router.push('/editors');
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
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

<style></style>
