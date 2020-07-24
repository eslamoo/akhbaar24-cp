<template>
  <div>
    <div class="top-section">
      <div class="row justify-content-between">
        <div class="col-4 pt-3">
          <h4>
            <i class="fa fa-list" />
            الأدوار الوظيفية
          </h4>
        </div>
        <div class="col-4 text-right">
          <div class="app-add-article">
            <nuxt-link
              v-permission="'create role'"
              to="/roles/create"
              class="btn btn-lg"
            >
              <i class="fa fa-plus" />
              <span>اضافة دور وظيفي جديد</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div ref="tableContainer" class="articles-table table-responsive">
      <table class="table table-striped" dir="rtl">
        <thead>
          <tr>
            <th>رقم الدور الوظيفي</th>
            <th>اسم الدور الوظيفي</th>
            <th class="text-center">
              عدد المستخدمين
            </th>
            <th>الحالة</th>
            <th>خيارات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td>{{ role.id }}</td>
            <td>{{ translate(role.name) }}</td>
            <td class="articles-table__status text-center">
              <span class="articles-table__status--info">
                <i class="fa fa-users mr-2" />
                {{ role.users_count }}
              </span>
            </td>
            <td class="articles-table__status">
              <span
                v-if="role.status === 'active'"
                class="articles-table__status--success"
              >
                <i class="fa fa-check-circle" />
                <span>مفعل</span>
              </span>
              <span v-else class="articles-table__status--hold">
                <i class="fa fa-trash" />
                <span>محذوف</span>
              </span>
            </td>
            <td class="articles-table__options">
              <nuxt-link
                v-permission:any="'update role|update any role'"
                :to="{ name: 'roles-id-edit', params: { id: role.id } }"
                class="articles-table__options--edit"
              >
                <i class="fa fa-pencil" />
                تعديل
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="roles.length === 0" class="col-12 text-center mt-5">
        <p>لا يوجد نتائج</p>
        <button @click="clearFilters()" class="btn btn-primary">
          رجوع
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <span><i class="fa fa-list" /></span>
        <span>عدد الأدوار الوظيفية:</span>
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
      }
    };
  },
  async asyncData ({ $axios, error }) {
    try {
      const response = await $axios.$get('/cp/roles');
      return {
        data: response,
        roles: response.data
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  methods: {
    async fetchData (page = 1) {
      this.$nuxt.$loading.start();

      await this.$axios.$get(`/cp/roles?page=${page}`).then((response) => {
        this.data = response;
        this.roles = response.data;
      });

      this.$nuxt.$loading.finish();
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
        case 'content manager':
          return 'مدير محتوى';
        default:
          return key;
      }
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
