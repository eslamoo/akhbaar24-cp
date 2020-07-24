<template>
  <div>
    <div class="row my-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4 class="my-2">
          <i class="fa fa-sitemap" />
          مصادر المواد
        </h4>
        <div class="app-add-article">
          <nuxt-link
            v-permission="'create source'"
            class="btn"
            to="/sources/create"
          >
            <i class="fa fa-plus" />
            <span class="submit-text text-white">إضافة مصدر جديد</span>
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
                <label for="title">اسم المصدر</label>
                <input
                  v-model="filters.title"
                  class="form-control"
                  type="text"
                  placeholder="اخبار 24"
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
            <th>رقم المصدر</th>
            <th>صورة المصدر</th>
            <th>اسم المصدر</th>
            <th class="text-center">
              عدد المواد
            </th>
            <th>الحالة</th>
            <th v-permission:any="'update source|update any source'">
              خيارات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="source in sources" :key="source.id">
            <td>{{ source.id }}</td>
            <td class="source-img">
              <img :src="source.image || '/_nuxt/assets/img/attach.png'" alt="">
            </td>
            <td>{{ source.title }}</td>
            <td class="articles-table__status text-center">
              <span class="articles-table__status--info">
                {{ source.items_count }}
              </span>
            </td>
            <td class="articles-table__status">
              <span
                v-if="source.status === 'active'"
                class="articles-table__status--success"
              >
                <i class="fa fa-check-circle" />
                <span>مفعل</span>
              </span>
              <span
                v-else-if="source.status === 'deleted'"
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
              v-permission:any="'update source|update any source'"
              class="articles-table__options"
            >
              <nuxt-link
                :to="{ name: 'sources-id-edit', params: { id: source.id } }"
                v-permission:any="'update source|update any source'"
                class="articles-table__options--edit"
              >
                <i class="fa fa-pencil" />
                تعديل
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="sources.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <span><i class="fa fa-sitemap" /></span>
        <span>عدد المصادر:</span>
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
      const response = await $axios.$get('/cp/sources');
      return {
        data: response,
        sources: response.data
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
          .$get(`/cp/sources/filter?page=${page}`, { params })
          .then((response) => {
            this.data = response;
            this.sources = response.data;
          });
      } else {
        await this.$axios.$get(`/cp/sources?page=${page}`).then((response) => {
          this.data = response;
          this.sources = response.data;
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
          .$get('/cp/sources/filter', { params })
          .then((response) => {
            this.data = response;
            this.sources = response.data;
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
