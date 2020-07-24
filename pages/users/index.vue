<template>
  <div>
    <div class="row my-2">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4 class="my-2">
          <i class="fa fa-user" />
          المستخدمين
        </h4>
        <div class="app-add-article">
          <nuxt-link
            v-permission="'create user'"
            class="btn"
            to="/users/create"
          >
            <i class="fa fa-plus" />
            <span class="submit-text text-white">إضافة مستخدم جديد </span>
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
          <div class="col-md-4 col-12">
            <div class="form-group">
              <label for="id">رقم المستخدم</label>
              <input
                id="id"
                v-model="filters.id"
                type="text"
                class="form-control"
                placeholder="123"
              >
            </div>
          </div>

          <div class="col-md-4 col-12">
            <div class="form-group">
              <label for="name">اسم المستخدم</label>
              <input
                id="name"
                v-model="filters.name"
                type="text"
                class="form-control"
                placeholder="اسم المستخدم"
              >
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="form-group">
              <label for="article-cat"> المجموعة </label>
              <label v-if="!filters.group" class="select-label">
                <span class="label-desc">اختر </span>
              </label>
              <select v-model="filters.group" class="form-control">
                <option
                  v-for="group in options.groups"
                  :key="group.id"
                  :value="group.id"
                  v-text="group.name"
                />
              </select>
            </div>
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-md-4 col-12">
            <div class="form-group">
              <label for="email">البريد الاكتروني</label>
              <input
                id="email"
                v-model="filters.email"
                type="text"
                class="form-control"
                placeholder="البريد الإلكتروني"
              >
            </div>
          </div>

          <div class="col-12 col-md-4">
            <div class="form-group">
              <label for="article-cat"> الدور الوظيفي </label>
              <label v-if="!filters.role" class="select-label">
                <span class="label-desc">اختر </span>
              </label>
              <select v-model="filters.role" class="form-control">
                <option
                  v-for="role in options.roles"
                  :key="role.id"
                  :value="role.id"
                  v-text="translate(role.name)"
                />
              </select>
            </div>
          </div>

          <div class="col-md-4 col-12">
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
        </div>

        <div class="row">
          <div class="col-12 mt-2 d-flex justify-content-end">
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

    <div ref="tableContainer" class="articles-table table-responsive">
      <table class="table table-striped" dir="rtl">
        <thead>
          <tr>
            <th>رقم المستخدم</th>
            <th>البريد الإلكتروني</th>
            <th>الإسم</th>
            <th>الدور الوظيفي</th>
            <th>المجموعة</th>
            <th>الحالة</th>
            <th>خيارات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.roles ? translate(user.roles[0]) : "-" }}</td>
            <td>{{ user.group ? user.group.name : "-" }}</td>
            <td class="articles-table__status">
              <span
                v-if="user.status === 'active'"
                class="articles-table__status--success"
              >
                <i class="fa fa-check-circle-o" />
                {{ translate(user.status) }}
              </span>
              <span v-else class="articles-table__status--hold">
                <i class="fa fa-trash" />
                <span>{{ translate(user.status) }}</span>
              </span>
            </td>
            <td class="articles-table__options">
              <nuxt-link
                v-permission:any="'update user|update any user'"
                :to="{ name: 'users-id-edit', params: { id: user.id } }"
                class="articles-table__options--edit"
              >
                <i class="fa fa-pencil" />
                تعديل
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="users.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <span><i class="fa fa-user" /></span>
        <span>عدد المستخدمين:</span>
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
      date: new Date(),
      config: {
        wrap: false, // set wrap to true only when using 'input-group'
        altFormat: 'M j, Y',
        altInput: true,
        dateFormat: 'Y-m-d'
      },
      filtersApplied: false,
      filters: {},
      options: {
        statuses: [
          {
            name: 'مفعل',
            value: 'active'
          },
          {
            name: 'محذوف',
            value: 'deleted'
          }
        ],
        roles: [],
        groups: []
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
      const response = await $axios.$get('/cp/users');
      return {
        data: response,
        users: response.data
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  async created () {
    const filters = await this.$axios.$get('/cp/users-filters');

    this.options.roles = filters.roles;
    this.options.groups = filters.groups;
  },
  methods: {
    async fetchData (page = 1) {
      this.$nuxt.$loading.start();

      if (this.filtersApplied) {
        const params = this.filters;

        await this.$axios
          .$get(`/cp/users/filter?page=${page}`, { params })
          .then((response) => {
            this.data = response;
            this.users = response.data;
          });
      } else {
        await this.$axios.$get(`/cp/users?page=${page}`).then((response) => {
          this.data = response;
          this.users = response.data;
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
          .$get('/cp/users/filter', { params })
          .then((response) => {
            this.data = response;
            this.users = response.data;
          });
      } catch (e) {
        console.log(e);
      }

      this.$nuxt.$loading.finish();
    },
    clearFilters () {
      window.location.reload(true);
    },
    translate (key) {
      switch (key) {
        case 'active':
          return 'نشط';
        case 'deleted':
          return 'محظور';
        case 'admin':
          return 'أدمن';
        case 'moderator':
          return 'مشرف';
        case 'publisher':
          return 'ناشر';
        case 'editor':
          return 'محرر';
        case 'language corrector':
          return 'مصحح لغوي';
        default:
          return key;
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
</style>
