<template>
  <div>
    <div class="row my-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4 class="my-2">
          <i class="fa fa-bell" />
          الإشعارات
        </h4>
        <div class="app-add-article">
          <nuxt-link
            v-permission="'create notice'"
            class="btn"
            to="/notifications/create"
          >
            <i class="fa fa-plus" />
            <span class="submit-text text-white">إضافة إشعار جديد </span>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="top-section">
      <div class="p-3 mb-3 card">
        <form @submit.prevent="applyFilters()">
          <h2 style="font-size: 17px;font-weight: bold;">
            خيارات البحث
          </h2>
          <hr>
          <div class="row">
            <div class="col-md-4 col-12">
              <div class="form-group">
                <label for="title">عنوان الإشعار</label>
                <input
                  v-model="filters.title"
                  class="form-control"
                  type="text"
                >
              </div>
            </div>
            <div class="col-md-8 mt-2 d-flex justify-content-end">
              <button
                @click.prevent="clearFilters()"
                v-if="filtersApplied || filterable"
                class="btn btn-save border-black"
              >
                <i class="fa fa-times" />
                <span>مسح</span>
              </button>
              <div class="push-notifications__top--send ml-1 mt-3">
                <button :disabled="!filterable" type="submit" class="btn ">
                  <i class="fa fa-search" />
                  <span>إبحث</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div ref="tableContainer" class="articles-table table-responsive">
      <table class="table table-striped" dir="rtl">
        <thead>
          <tr>
            <th>رقم الإشعار</th>
            <th>عنوان الإشعار</th>
            <th>رقم المادة</th>
            <th>عنوان المادة</th>
            <th>المستخدم</th>
            <th>تاريخ الإرسال</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="notice in notices" :key="notice.id">
            <td>{{ notice.id }}</td>
            <td>{{ notice.title }}</td>
            <td>{{ notice.item.id }}</td>
            <td>{{ notice.item.title.substring(0, 30) + "..." }}</td>
            <td>{{ notice.owner }}</td>
            <td class="articles-table__status text-center">
              <span class="articles-table__status--success mb-2">
                <i class="fa fa-check-circle" />
                <span>تم الإرسال</span>
              </span>
              <br>
              <span class="publish-date">
                يوم :
                {{ $moment(notice.created_at).format("DD/MM/YYYY") }}
              </span>
              <br>
              <span class="publish-date">
                الساعة:
                {{ $moment(notice.created_at).format("LT") }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="notices.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <span><i class="fa fa-bell" /></span>
        <span>عدد الإشعارات:</span>
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
</template>
<script>
export default {
  layout: 'main',
  data () {
    return {
      filtersApplied: false,
      filters: {}
    };
  },
  computed: {
    filterable () {
      if (
        Object.entries(this.filters).length === 0 &&
        this.filters.constructor === Object
      ) {
        return false;
      }

      for (const key in this.filters) {
        if (this.filters[key] === null || this.filters[key] === '') {
          return false;
        }
      }

      return true;
    }
  },
  async asyncData ({ $axios, error }) {
    try {
      const response = await $axios.$get('/cp/notices');

      return {
        data: response,
        notices: response.data
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
          .$get(`/cp/notices/filter?page=${page}`, { params })
          .then((response) => {
            this.data = response;
            this.notices = response.data;
          });
      } else {
        await this.$axios.$get(`/cp/notices?page=${page}`).then((response) => {
          this.data = response;
          this.notices = response.data;
        });
      }

      this.$nuxt.$loading.finish();
    },
    async applyFilters () {
      const params = this.filters;

      this.filtersApplied = true;
      this.$nuxt.$loading.start();
      try {
        await this.$axios
          .$get('/cp/notices/filter', { params })
          .then((response) => {
            this.data = response;
            this.notices = response.data;
          });
      } catch (e) {
        console.log(e);
      }

      this.$nuxt.$loading.finish();
    },
    clearFilters () {
      window.location.reload(true);
    }
  }
};
</script>
<style>
select {
  font-size: 14px !important;
  color: rgba(0, 0, 0, 0.65) !important;
}
.form-control:disabled,
.form-control[readonly] {
  background-color: #fff !important;
  cursor: pointer;
  font-size: 14px !important;
  color: rgba(0, 0, 0, 0.65) !important;
}
</style>
