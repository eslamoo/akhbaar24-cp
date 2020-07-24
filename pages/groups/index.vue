<template>
  <div>
    <div class="row my-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4 class="my-2">
          <i class="fa fa-users" />
          المجموعات
        </h4>
        <div class="app-add-article">
          <nuxt-link
            v-permission="'create group'"
            class="btn"
            to="/groups/create"
          >
            <i class="fa fa-plus" />
            <span class="submit-text text-white">إضافة مجموعة جديدة</span>
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
                <label for="title">اسم المجموعة</label>
                <input
                  v-model="filters.name"
                  class="form-control"
                  type="text"
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
            <th>رقم المجموعة</th>
            <th>اسم المجموعة</th>
            <th class="text-center">
              عدد المستخدمين
            </th>
            <th>الحالة</th>
            <th v-permission:any="'update group|update any group'">
              خيارات
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in groups" :key="group.id">
            <td>{{ group.id }}</td>
            <td>{{ group.name }}</td>
            <td class="articles-table__status text-center">
              <span class="articles-table__status--info">
                <i class="fa fa-users mr-2" />
                {{ group.users_count }}
              </span>
            </td>
            <td class="articles-table__status">
              <span
                v-if="group.status === 'active'"
                class="articles-table__status--success"
              >
                <i class="fa fa-check-circle" />
                <span>مفعل</span>
              </span>
              <span
                v-else-if="group.status === 'deleted'"
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
              v-permission:any="'update group|update any group'"
              class="articles-table__options"
            >
              <nuxt-link
                :to="{ name: 'groups-id-edit', params: { id: group.id } }"
                v-permission:any="'update group|update any group'"
                class="articles-table__options--edit"
              >
                <i class="fa fa-pencil" />
                تعديل
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="groups.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <span><i class="fa fa-users" /></span>
        <span>عدد المجموعات:</span>
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
      const response = await $axios.$get('/cp/groups');

      return {
        data: response,
        groups: response.data
      };
    } catch (e) {
      if (e.response.status === 403) {
        error({
          statusCode: 403
        });
      } else if (e.response.status === 500) {
        error({
          statusCode: 500
        });
      } else {
        error({
          statusCode: 404
        });
      }
    }
  },

  methods: {
    async fetchData (page = 1) {
      this.$nuxt.$loading.start();
      await this.$axios.$get('/cp/groups?page=' + page).then((response) => {
        this.data = response;
        this.groups = response.data;
      });
      this.$nuxt.$loading.finish();
    },
    async applyFilters () {
      const params = this.filters;

      this.filtersApplied = true;
      this.$nuxt.$loading.start();
      try {
        await this.$axios
          .$get('/cp/groups/filter', { params })
          .then((response) => {
            this.data = response;
            this.groups = response.data;
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
