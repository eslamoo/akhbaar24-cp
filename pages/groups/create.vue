<template>
  <div>
    <div class="card p-3 mb-3">
      <h2 style="font-size: 17px;font-weight: bold;">
        إضافة مجموعة
      </h2>
      <!-- <small class="mb-2 text-muted">أدخل رقم المقال الخاص به واضغط ارسال لإتمام العملية </small> -->
      <form @submit.prevent="store">
        <div class="row">
          <div class="col-md-6 col-12 mt-2">
            <div class>
              <input
                id
                v-model="name"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="اسم المجموعة"
              >
              <span class="text-danger">
                <error input="title" />
              </span>
            </div>
          </div>
          <div class="col-12 col-md-6 text-right">
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
      </form>
      <div class="row">
        <div class="col-12 mt-3 text-right" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      name: '',
      busy: false
    };
  },
  async asyncData ({ $axios, error }) {
    try {
      await $axios.$get('/cp/groups/create');
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  methods: {
    async store () {
      try {
        this.busy = true;
        this.$errors.flush();
        const response = await this.$axios.$post('/cp/groups', {
          name: this.name
        });
        if (response.type === 'success') {
          this.$noty.success(
            '<i class="fa fa-check"></i> ' + response.message,
            {
              layout: 'topCenter',
              timeout: 5000,
              theme: 'relax'
            }
          );
          this.$router.push('/groups');
        }
      } catch (e) {
        if (e.response.status === 422) {
          this.$errors.fill(e.response.data.errors);
        } else {
          window.error({ statusCode: e.response.status });
        }
      }
      this.busy = false;
    }
  }
};
</script>

<style></style>
