<template>
  <div>
    <div class="row my-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4 class="my-2">
          <i class="fa fa-link" />
          سلاسل المواد
        </h4>
        <div class="app-add-article">
          <nuxt-link
            v-permission="'create series'"
            class="btn"
            to="/series/create"
          >
            <i class="fa fa-plus" />
            <span class="submit-text text-white">إضافة سلسلة جديدة</span>
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
                <label for="title">اسم السلسلة</label>
                <input
                  v-model="filters.title"
                  class="form-control"
                  type="text"
                  placeholder="سلسلة أخبار"
                >
              </div>
            </div>
            <div class="col-md-4 col-12">
              <div class="form-group">
                <label for="article-status"> الحالة </label>
                <label v-if="!filters.status" class="select-label-filters">
                  <span class="label-desc">اختر </span>
                </label>
                <select
                  id
                  v-model="filters.status"
                  name="article-status"
                  class="form-control"
                >
                  <option
                    v-for="status in statuses"
                    :key="status.name"
                    :value="status.value"
                    v-text="status.name"
                  />
                </select>
              </div>
            </div>
            <div class="col-md-4 mt-2 d-flex justify-content-end">
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
            <th>رقم السلسة</th>
            <th>اسم السلسة</th>
            <th class="text-center">
              عدد المواد
            </th>
            <th>الحالة</th>
            <th v-permission:any="'update series|update any series'">
              خيارات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="serie in series" :key="serie.id">
            <td>{{ serie.id }}</td>
            <td>{{ serie.title }}</td>
            <td class="articles-table__status text-center">
              <span class="articles-table__status--info">
                <i class="fa fa-file-text-o mr-2" />
                {{ serie.items_count }}
              </span>
            </td>
            <td class="articles-table__status">
              <span
                v-if="serie.status === 'published'"
                class="articles-table__status--success"
              >
                <i class="fa fa-check-circle" />
                <span>مفعل</span>
              </span>
              <span
                v-else-if="serie.status === 'deleted'"
                class="articles-table__status--hold"
              >
                <i class="fa fa-trash" />
                <span>محذوف</span>
              </span>
              <span v-else class="articles-table__status--hold bg-warning">
                <i class="fa fa-times-circle" />
                <span>معلق</span>
              </span>
            </td>
            <td
              v-permission:any="'update series|update any series'"
              class="articles-table__options"
            >
              <nuxt-link
                :to="{ name: 'series-id-edit', params: { id: serie.id } }"
                v-permission:any="'update series|update any series'"
                class="articles-table__options--edit"
              >
                <i class="fa fa-pencil" />
                تعديل
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="series.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <span><i class="fa fa-link" /></span>
        <span>عدد السلاسل:</span>
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
      filters: {},
      statuses: [
        {
          name: 'مفعل',
          value: 'active'
        },
        {
          name: 'محذوف',
          value: 'deleted'
        }
      ]
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
      const response = await $axios.$get('/cp/series');

      return {
        data: response,
        series: response.data
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },

  methods: {
    async fetchData (page = 1) {
      this.$nuxt.$loading.start();
      await this.$axios.$get('/cp/series?page=' + page)
        .then((response) => {
          this.data = response;
          this.series = response.data;
        });
      this.$nuxt.$loading.finish();
    },
    async applyFilters () {
      const params = this.filters;

      this.filtersApplied = true;
      this.$nuxt.$loading.start();
      try {
        await this.$axios
          .$get('/cp/series/filter', { params })
          .then((response) => {
            this.data = response;
            this.series = response.data;
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
