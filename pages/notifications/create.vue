<template>
  <div class="push-notifications">
    <div class="push-notifications__top card mb-3">
      <form @submit.prevent="store()">
        <h2>اشعارات الPush Notification</h2>
        <small
          class="mb-2 text-muted"
        >أدخل عنوان الإشعار و رقم المقال الخاص به واضغط ارسال لإتمام العملية</small>
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="push-notifications__top--search">
              <input
                v-model="notice.title"
                type="text"
                name="notifications"
                class="form-control"
                placeholder="عنوان الإشعار "
              >
              <small class="form-text text-muted">يجب أن لا يزيد العنوان عن ٢٤٠ حرف</small>
              <span class="text-danger">
                <error input="title" />
              </span>
            </div>
          </div>
          <div class="col-md-2 col-12">
            <div class="push-notifications__top--articleNum">
              <input
                v-model="notice.item"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="رقم المقال ID"
              >
              <span class="text-danger">
                <error input="item" />
              </span>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <button v-if="!busy" type="submit" class="btn submit btn-lg">
              <span class="submit-icon">
                <i class="fa fa-paper-plane-o" />
              </span>
              <span class="submit-text">إرسال</span>
            </button>
            <button v-else type="submit" class="btn submit btn-lg" disabled>
              <span class="submit-icon">
                <i class="fa fa-spinner fa-spin" />
              </span>
              <span class="submit-text">إرسال</span>
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="push-notifications__body">
      <nav>
        <div id="nav-tab" class="nav nav-tabs" role="tablist">
          <a
            id="nav-articles-tab"
            class="nav-item nav-link active"
            data-toggle="tab"
            href="#new-articles"
            role="tab"
            aria-controls="nav-tabs"
            aria-selected="false"
          >المقالات المضافة حديثا</a>
        </div>
      </nav>
      <div id="nav-tabContent" class="tab-content">
        <div
          id="new-articles"
          class="tab-pane fade active show"
          role="tabpanel"
          aria-labelledby="all-noti-tab"
        >
          <div class="articles-table table-responsive">
            <table class="table table-striped" dir="rtl">
              <thead>
                <tr>
                  <th />
                  <th>رقم المادة</th>
                  <th>عنوان المادة</th>
                  <th style="width: 10px">
                    الاقسام
                  </th>
                  <th class="text-center">
                    الإشعارات
                  </th>
                  <th>
                    تاريخ النشر
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>
                    <a @click="setItem(item.id)" href="#">
                      <span class="copy">
                        <i class="fa fa-clone" />
                      </span>
                    </a>
                  </td>
                  <td class="d-flex flex-column">
                    <span>{{ item.id }}</span>
                    <span v-if="item.akhbaar24_rank" class="badge badge-pill badge-primary">أخبار٢٤ {{ item.akhbaar24_rank }}</span>
                    <span v-if="item.sport24_rank" class="badge badge-pill badge-primary">سبورت٢٤ {{ item.sport24_rank }}</span>
                  </td>
                  <td>
                    <nuxt-link :to="{ name: 'items-id', params: { id: item.id } }">
                      {{ item.title.substring(0, 50) + "..." }}
                    </nuxt-link>
                  </td>
                  <td>
                    <div class="d-flex flex-column">
                      <span
                        v-for="category in item.categories"
                        :key="category.id"
                        v-text="category.title"
                      />
                    </div>
                  </td>
                  <td class="articles-table__status text-center">
                    <div v-if="item.notices_count > 0">
                      <span class="articles-table__status--success mb-2">
                        <i class="fa fa-check-circle" />
                        <span>تم إرسال إشعار</span>
                        <span>{{ item.last_notice_date }}</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="publish-date">
                      يوم :
                      {{ $moment(item.published_at).format("DD/MM/YYYY") }}
                    </span>
                    <br>
                    <span class="publish-date">
                      الساعة:
                      {{ $moment(item.published_at).format("LT") }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <span><i class="fa fa-file-text-o" /></span>
          <span>عدد المواد:</span>
          <span><b>{{ data.meta.total }}</b></span>
        </div>
        <div class="col-8 d-flex justify-content-end">
          <pagination
            :data="data"
            :limit="3"
            @pagination-change-page="fetchData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
if (process.browser) {
  require('bootstrap/dist/js/bootstrap.js');
}
export default {
  layout: 'main',
  data () {
    return {
      notice: {
        item: '',
        title: ''
      },
      busy: false
    };
  },
  async asyncData ({ $axios, error }) {
    try {
      const response = await $axios.$get('/cp/notices/create');

      return {
        data: response,
        items: response.data
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  methods: {
    async fetchData (page = 1) {
      this.$nuxt.$loading.start();

      if (this.filtersApplied) {
        const params = this.filters;

        await this.$axios
          .$get(`/cp/items/filter?page=${page}`, { params })
          .then((response) => {
            this.data = response;
            this.items = response.data;
          });
      } else {
        await this.$axios.$get(`/cp/items?page=${page}`).then((response) => {
          this.data = response;
          this.items = response.data;
        });
      }

      this.$nuxt.$loading.finish();
    },
    setItem (id) {
      this.notice.item = id;
    },
    async store () {
      this.busy = true;
      this.$errors.flush();

      try {
        const response = await this.$axios.$post('/cp/notices', this.notice);

        if (response.type === 'success') {
          this.$noty.success(
            '<i class="fa fa-check"></i> ' + response.message,
            {
              layout: 'topCenter',
              timeout: 5000,
              theme: 'relax'
            }
          );

          this.$router.push('/notifications');
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
