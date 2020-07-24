<template>
  <div class="card p-3">
    <form @submit.prevent="store()">
      <h5>إضافة مستخدم</h5>
      <div class="row mt-3">
        <div class="col-md-6 col-12 mt-2">
          <div class="form-group">
            <label for="name">اسم المستخدم</label>
            <input
              v-model="user.name"
              type="text"
              name="name"
              class="form-control"
            >
            <span class="text-danger">
              <error input="name" />
            </span>
          </div>
        </div>
        <div class="col-md-6 col-12 mt-2">
          <div class="form-group">
            <label for="email">
              البريد الالكتروني
              <span class="text-muted">(ex: user@argaam.com)</span>
            </label>
            <input
              v-model="user.email"
              type="email"
              name="email"
              class="form-control"
            >
            <span class="text-danger">
              <error input="email" />
            </span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-12 mt-2 form-group">
          <label for="role">الدور الوظيفي</label>
          <select v-model="user.role" class="form-control">
            <option v-for="role in roles" :value="role.id" :key="role.id" v-text="translate(role.name)" />
          </select>
          <span class="text-danger">
            <error input="role" />
          </span>
        </div>
        <div class="col-md-6 col-12 mt-2 form-group">
          <label for="group">المجموعة</label>
          <select v-model="user.group" class="form-control">
            <option v-for="group in groups" :value="group.id" :key="group.id" v-text="group.name" />
          </select>
          <span class="text-danger">
            <error input="group" />
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-12 mt-2">
          <div class="form-group">
            <label for="password">كلمة المرور
            </label>
            <button @click.prevent="generate()" class="btn btn-default text-info m-0">
              <i class="fa fa-refresh" aria-hidden="true" /> توليد
            </button>
            <span v-if="passwordPreview" v-text="passwordPreview" class="text-muted" />
            <input
              @keydown="clearGenerated()"
              v-model="user.password"
              type="password"
              name="password"
              class="form-control"
            >
            <span class="text-danger">
              <error input="password" />
            </span>
          </div>
        </div>
        <div class="col-md-6 col-12 mt-3">
          <div class="form-group">
            <label for="password_confirmation">تأكيد كلمة المرور</label>
            <input
              v-model="user.password_confirmation"
              type="password"
              name="password_confirmation"
              class="form-control"
            >
            <span class="text-danger">
              <error input="password_confirmation" />
            </span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-12 mt-3 text-right">
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
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      busy: false,
      passwordPreview: '',
      user: {
        name: '',
        email: '',
        group: '',
        role: '',
        password: '',
        password_confirmation: ''
      }
    };
  },
  async asyncData ({ $axios, error }) {
    try {
      const response = await $axios.$get('/cp/users/create');

      return {
        roles: response.data.roles,
        groups: response.data.groups
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  methods: {
    async store () {
      try {
        this.busy = true;
        this.$errors.flush();

        const response = await this.$axios.$post('/cp/users', this.user);

        if (response.type === 'success') {
          this.$noty.success(
            '<i class="fa fa-check"></i> ' + response.message,
            {
              layout: 'topCenter',
              timeout: 5000,
              theme: 'relax'
            }
          );
          this.$router.push('/users');
        }
      } catch (e) {
        if (e.response.status === 422) {
          this.$errors.fill(e.response.data.errors);
        } else {
          window.error({ statusCode: e.response.status });
        }
      }
      this.busy = false;
    },
    generate () {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      this.user.password = this.user.password_confirmation = this.passwordPreview = result;
    },
    clearGenerated () {
      this.passwordPreview = '';
    },
    translate (key) {
      switch (key) {
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
</style>
