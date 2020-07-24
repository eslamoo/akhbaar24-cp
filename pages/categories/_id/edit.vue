<template>
  <div>
    <div class="card p-3 mb-3">
      <h2 style="font-size: 17px;font-weight: bold;">
        تعديل قسم
      </h2>

      <form @submit.prevent="update">
        <div class="row">
          <div class="col-md-6 col-12 mt-2">
            <div class>
              <input
                v-model="category.title"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="اسم القسم"
              >
              <span class="text-danger">
                <error input="title" />
              </span>
            </div>
          </div>
          <div class="col-12 col-md-6 text-right">
            <button
              v-permission:any="'delete category|delete any category'"
              @click="remove()"
              v-if="status !== 'deleted'"
              type="button"
              class="btn bg-white text-danger border-danger"
            >
              <i class="fa fa-times" aria-hidden="true" />
              حذف
            </button>
            <button
              v-permission:any="'delete category|delete any category'"
              @click="restore()"
              v-if="status === 'deleted'"
              type="button"
              class="btn bg-white text-success border-success"
            >
              <i class="fa fa-refresh" aria-hidden="true" />
              استعادة
            </button>
            <button
              v-if="!busy && status !== 'deleted'"
              type="submit"
              class="btn btn-primary"
            >
              <i class="fa fa-plus" />

              <span class="submit-text">حفظ</span>
            </button>
            <button v-if="busy" type="submit" class="btn btn-primary" disabled>
              <i class="fa fa-spinner fa-spin" />

              <span class="submit-text">حفظ</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      busy: false
    };
  },
  async asyncData ({ $axios, error, params }) {
    try {
      const response = await $axios.$get(`/cp/categories/${params.id}/edit`);

      return {
        category: response.data,
        status: response.data.status
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  methods: {
    async update () {
      try {
        this.busy = true;
        this.$errors.flush();
        const response = await this.$axios.$patch(
          `/cp/categories/${this.category.id}`,
          { title: this.category.title }
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
          this.$router.push('/categories');
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
              `/cp/categories/${this.category.id}`
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

              this.$router.push('/categories');
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
              window.error({
                statusCode: 404
              });
            }
          }
        }
      });
    }
  }
};
</script>

<style></style>
