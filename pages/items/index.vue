<template>
  <div>
    <div class="row my-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4 class="my-2">
          <i class="fa fa-file-text-o" />
          المواد
        </h4>
        <div class="app-add-article">
          <nuxt-link
            v-permission="'create item'"
            class="btn"
            to="/items/create"
          >
            <i class="fa fa-plus" />
            <span class="submit-text text-white">إضافة مادة جديدة</span>
          </nuxt-link>
        </div>
      </div>
    </div>

    <div class="card p-3 mb-3">
      <form @submit.prevent="applyFilters()" class="articles-index">
        <h2 style="font-size: 17px;font-weight: bold;">
          خيارات البحث
        </h2>
        <hr>
        <div class="row">
          <div class="col-md-1 col-12">
            <div class="form-group">
              <label for="article-num">رقم المادة</label>
              <input
                id
                v-model="filters.id"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="352"
              >
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="form-group">
              <label for="article-title">عنوان المادة </label>
              <input
                id
                v-model="filters.title"
                type="text"
                name="article-title"
                class="form-control"
                placeholder="وزير العدل يقر القواعد المنظمة لقضايا الإفلاس في المحاكم التجارية"
              >
              <!-- <small class="form-text text-muted">يجب أن لا يزيد العنوان عن ٢٤٠ حرف</small> -->
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="form-group">
              <label for="article-cat"> القسم </label>
              <label v-if="!filters.category" class="select-label">
                <span class="label-desc">اختر </span>
              </label>
              <select id v-model="filters.category" name class="form-control">
                <option
                  v-for="category in options.categories"
                  :key="category.id"
                  :value="category.id"
                  v-text="category.title"
                />
              </select>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="form-group">
              <label for="article-serie"> السلسلة </label>
              <label v-if="!filters.series" class="select-label">
                <span class="label-desc">اختر </span>
              </label>
              <select id v-model="filters.series" name class="form-control">
                <option
                  v-for="series in options.series"
                  :key="series.id"
                  :value="series.id"
                  v-text="series.title"
                />
              </select>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="form-group">
              <label for="article-serie"> الرئيسية والهامة </label>
              <label v-if="!filters.ranked" class="select-label">
                <span class="label-desc">اختر </span>
              </label>
              <select id v-model="filters.ranked" name class="form-control">
                <option value="a24">
                  أخبار٢٤
                </option>
                <option value="s24">
                  سبورت٢٤
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 col-md-3">
            <div class="form-group">
              <label for="article-type"> نوع المادة </label>
              <label v-if="!filters.type" class="select-label">
                <span class="label-desc">اختر </span>
              </label>
              <select
                v-model="filters.type"
                name="article-type"
                class="form-control"
              >
                <option
                  v-for="type in options.types"
                  :key="type.name"
                  :value="type.value"
                  v-text="type.name"
                />
              </select>
              <error input="type" />
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="form-group">
              <label for="article-status"> الحالة </label>
              <label v-if="!filters.status" class="select-label">
                <span class="label-desc">اختر </span>
              </label>
              <select
                id
                v-model="filters.status"
                name="article-status"
                class="form-control"
              >
                <option
                  v-for="status in options.statuses"
                  :key="status.name"
                  :value="status.value"
                  v-text="status.name"
                />
              </select>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="form-group">
              <label for="article-status"> المحرر </label>
              <label v-if="!filters.editor" class="select-label">
                <span class="label-desc">اختر </span>
              </label>
              <select id v-model="filters.editor" name class="form-control">
                <option
                  v-for="editor in options.editors"
                  :key="editor.id"
                  :value="editor.id"
                  v-text="editor.name"
                />
              </select>
            </div>
          </div>
          <div class="col-12 col-md-3">
            <div class="form-group">
              <label for="article-status"> تاريخ النشر </label>
              <flat-pickr
                :config="config"
                v-model="filters.publish_date"
                placeholder="تاريخ النشر"
                class="form-control"
                name="date"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 mt-2 d-flex justify-content-end">
            <button @click="filterDraftItems()" class="btn ml-2">
              <i class="fa fa-list" aria-hidden="true" />
              المواد المعلقة
            </button>
            <button
              @click.prevent="clearFilters()"
              v-if="filtersApplied || filterable"
              class="btn btn-save border-black"
            >
              <i class="fa fa-times" />
              <span>مسح</span>
            </button>
            <div class="push-notifications__top--send ml-1">
              <button :disabled="!filterable" type="submit" class="btn btn-lg">
                <i class="fa fa-search" />
                <span>إبحث</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="articles-table table-responsive">
      <table class="table table-striped" dir="rtl">
        <thead>
          <tr>
            <th>رقم المادة</th>
            <th>عنوان المادة</th>
            <th>النوع</th>
            <th class="text-center" style="min-width: 110px;">
              الحالة
            </th>
            <th class="text-center">
              الاقسام
            </th>
            <th class="text-center">
              المحررين
            </th>
            <th class="text-center">
              الناشر
            </th>
            <th class="text-center">
              المصادر
            </th>
            <th>سجل التعديلات</th>
            <th style="min-width: 110px;">
              اخر تعديل
            </th>
            <th v-permission:any="'update item|update any item'" style="min-width: 85px;">
              خيارات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in items" :key="item.id">
            <td class="d-flex flex-column">
              <span>{{ item.id }}</span>
              <span v-if="item.akhbaar24_rank" class="badge badge-pill badge-secondary">أخبار٢٤ - <b>{{ item.akhbaar24_rank }}</b></span>
              <span v-if="item.sport24_rank" class="badge badge-pill badge-secondary">سبورت٢٤ - <b>{{ item.sport24_rank }}</b></span>
            </td>
            <td>
              <nuxt-link :to="{ name: 'items-id', params: { id: item.id } }">
                {{ item.title }}
              </nuxt-link>
            </td>
            <td>{{ translate(item.type) }}</td>
            <td class="articles-table__status text-center">
              <div v-if="item.status === 'published'">
                <span class="articles-table__status--success mb-2">
                  <i class="fa fa-check-circle" />
                  <span>تم النشر</span>
                </span>
                <br>
                <span class="publish-date">
                  يوم :
                  {{ $moment(item.published_at).format("DD/MM/YYYY") }}
                </span>
                <br>
                <span class="publish-date">
                  الساعة:
                  {{ $moment(item.published_at).format("LT") }}
                </span>
              </div>
              <div v-else-if="item.status === 'scheduled'">
                <span class="articles-table__status--info mb-2">
                  <i class="fa fa-exclamation-triangle" />
                  <span>مجدول</span>
                </span>
                <br>
                <span class="publish-date">
                  يوم :
                  {{ $moment(item.published_at).format("DD/MM/YYYY") }}
                </span>
                <br>
                <span class="publish-date">
                  الساعة:
                  {{ $moment(item.published_at).format("LT") }}
                </span>
              </div>
              <span
                v-else-if="item.status === 'deleted'"
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
            <td>
              <ul>
                <li
                  v-for="category in item.categories"
                  :key="category.id"
                  v-text="category.title"
                />
              </ul>
            </td>
            <td>
              <ul>
                <li
                  v-for="editor in item.editors"
                  :key="editor.id"
                  v-text="editor.name"
                />
              </ul>
            </td>
            <td>{{ item.publisher ? item.publisher.name : '-' }}</td>
            <td>
              <ul>
                <li
                  v-for="source in item.sources"
                  :key="source.id"
                  v-text="source.title"
                />
              </ul>
            </td>
            <td class="articles-table__edits">
              <nuxt-link :to="{ name: 'items-id-logs', params: { id: item.id } }" class="articles-table__edits--history">
                <i class="fa fa-clock-o" />
                سجل التعديلات
              </nuxt-link>
            </td>
            <td>
              <span class="publish-date">
                يوم : {{ $moment(item.updated_at).format("DD/MM/YYYY") }}</span>
              <br>
              <span class="publish-date">
                الساعة : {{ $moment(item.updated_at).format("LT") }}</span>
            </td>
            <td
              v-permission:any="'update item|update any item'"
              class="articles-table__options"
            >
              <nuxt-link
                :to="{ name: 'items-id-edit', params: { id: item.id } }"
                v-permission:any="'update item|update any item'"
                class="articles-table__options--edit"
              >
                <i class="fa fa-pencil" />
                تعديل
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="items.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
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
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      isLoading: false,
      fullPage: true,
      config: {
        wrap: false,
        // altFormat: 'F j, Y',
        // altInput: true,
        dateFormat: 'Y-m-d'
      },
      filtersApplied: false,
      filters: {},
      options: {
        categories: [],
        series: [],
        sources: [],
        types: [
          {
            name: 'مقال',
            value: 'article'
          },
          {
            name: 'البوم صور',
            value: 'gallery'
          },
          {
            name: 'فيديو',
            value: 'video'
          }
        ],
        statuses: [
          {
            name: 'معلق',
            value: 'draft'
          },
          {
            name: 'تم النشر',
            value: 'published'
          },
          {
            name: 'مجدول',
            value: 'scheduled'
          },
          {
            name: 'محذوف',
            value: 'deleted'
          }
        ]
      }
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
      const response = await $axios.$get('/cp/items');

      return {
        data: response,
        items: response.data
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  async created () {
    const filters = await this.$axios.$get('/cp/items-filters');

    this.options.categories = filters.categories;
    this.options.series = filters.series;
    this.options.editors = filters.editors;
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
    async applyFilters () {
      const params = this.filters;

      this.filtersApplied = true;
      this.$nuxt.$loading.start();
      try {
        await this.$axios
          .$get('/cp/items/filter', { params })
          .then((response) => {
            this.data = response;
            this.items = response.data;
          });
      } catch (e) {
        console.log(e);
      }

      this.$nuxt.$loading.finish();
    },
    filterDraftItems () {
      this.filters.status = 'draft';

      this.applyFilters();
    },
    clearFilters () {
      window.location.reload(true);
    },
    translate (key) {
      switch (key) {
        case 'article':
          return 'مقال';
        case 'gallery':
          return 'البوم صور';
        case 'video':
          return 'فيديو';
      }
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
td a {
  color: #969494;
}
</style>
