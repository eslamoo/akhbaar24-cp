<template>
  <div>
    <div class="row my-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4 class="my-2">
          <i class="fa fa-tags" />
          وسوم المواد
        </h4>
        <div class="app-add-article">
          <nuxt-link
            v-permission="'create tag'"
            class="btn"
            to="/tags/create"
          >
            <i class="fa fa-plus" />
            <span class="submit-text text-white">إضافة وسم جديد</span>
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
                <label for="title">اسم الوسم</label>
                <input
                  v-model="filters.name"
                  class="form-control"
                  type="text"
                >
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
            <th>رقم الوسم</th>
            <th>صورة</th>
            <th>اسم</th>
            <th>وصف</th>
            <th>بريد الكتروني</th>
            <th>موقع</th>
            <th>هاتف</th>
            <th class="text-center">
              عدد المواد
            </th>
            <th v-permission:any="'update tag|update any tag'">
              خيارات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tag in tags" :key="tag.id">
            <td>{{ tag.id }}</td>
            <td class="source-img">
              <img :src="tag.image || '/_nuxt/assets/img/attach.png'" alt="">
            </td>
            <td>{{ tag.name }}</td>
            <td>{{ tag.bio || '-' }}</td>
            <td>{{ tag.email || '-' }}</td>
            <td>{{ tag.website || '-' }}</td>
            <td>{{ tag.phone || '-' }}</td>
            <td class="articles-table__status text-center">
              <span class="articles-table__status--info">{{
                tag.items_count
              }}</span>
            </td>
            <td
              v-permission:any="'update tag|update any tag'"
              class="articles-table__options"
            >
              <nuxt-link
                :to="{ name: 'tags-id-edit', params: { id: tag.id } }"
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
      <div v-if="tags.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <span><i class="fa fa-tags" /></span>
        <span>عدد الوسوم:</span>
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
      isLoading: false,
      fullPage: true,
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
      const response = await $axios.$get('/cp/tags');
      return {
        tags: response.data,
        data: response
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
          .$get(`/cp/tags/filter?page=${page}`, { params })
          .then((response) => {
            this.data = response;
            this.tags = response.data;
          });
      } else {
        await this.$axios.$get(`/cp/tags?page=${page}`).then((response) => {
          this.data = response;
          this.tags = response.data;
        });
      }

      this.$nuxt.$loading.finish();
    },
    clearFilters () {
      window.location.reload(true);
    },
    async applyFilters () {
      const params = this.filters;

      this.filtersApplied = true;
      this.$nuxt.$loading.start();
      try {
        await this.$axios.$get('/cp/tags/filter', { params }).then((response) => {
          this.data = response;
          this.tags = response.data;
        });
      } catch (e) {
        console.log(e);
      }

      this.$nuxt.$loading.finish();
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
