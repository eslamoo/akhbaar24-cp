<template>
  <div class="login">
    <div class="container">
      <div class="row">
        <div class="col-md-4 col-xs-12">
          <div class="login__login-form">
            <div class="logo">
              <a href="/" title="الرئيسية">
                <svg>
                  <use xlink:href="~/assets/svg/sprite.svg#akhbaar24" />
                </svg>
              </a>
              <p>كل ما يخص المملكة في كافة المجالات</p>
            </div>
            <form @submit.prevent="login">
              <div v-if="error" class="alert alert-danger">
                {{ error }}
              </div>
              <div class="login-input-group">
                <p>البريد الإلكتروني</p>
                <input
                  v-model="email"
                  type="email"
                  class="form-control login-input-group__login-input"
                  placeholder="Example@example.com"
                  required
                >
                <svg class="login-input-group__icon">
                  <use xlink:href="~/assets/svg/sprite.svg#user-circle" />
                </svg>
                <span class="text-danger">
                  <error input="email" />
                </span>
              </div>
              <div class="login-input-group">
                <p>كلمة المرور</p>
                <input
                  v-model="password"
                  type="password"
                  class="form-control login-input-group__login-input"
                  required
                >
                <svg class="login-input-group__icon">
                  <use xlink:href="~/assets/svg/sprite.svg#password" />
                </svg>
                <span class="text-danger">
                  <error input="password" />
                </span>
              </div>
              <div class="remember-password">
                <div class="remember pull-right">
                  <input id="cbx" type="checkbox">
                  <label class="cbx" for="cbx">
                    <div class="flip">
                      <div class="front" />
                      <div class="back">
                        <svg width="14" height="9" viewBox="0 0 16 14">
                          <path d="M2 8.5L6 12.5L14 1.5" />
                        </svg>
                      </div>
                    </div>
                  </label>
                  <label class="remember-text">تذكر كلمة المرور</label>
                </div>
                <div class="forget pull-left mt-2">
                  <nuxt-link to="/password/reset">
                    نسيت كلمة المرور؟
                  </nuxt-link>
                </div>
                <div class="clear" />
              </div>
              <div class="login-button mt-4">
                <button v-show="!busy" class="btn btn-primary btn-block" type="submit">
                  تسجيل الدخول
                </button>
                <button
                  :disabled="true"
                  v-show="busy"
                  class="btn btn-primary btn-block"
                  type="submit"
                >
                  <i class="fa fa-spinner fa-spin" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      error: '',
      busy: false
    };
  },
  methods: {
    async login () {
      this.busy = true;
      this.flushErrors();

      try {
        await this.$auth
          .loginWith('local', {
            data: {
              email: this.email,
              password: this.password
            }
          })
          .then(() => {
            this.$laravel.setPermissions(this.$auth.user.permissions);
            this.$laravel.setRoles(this.$auth.user.roles);
          });
      } catch (e) {
        if (e.response.status === 422) {
          this.$errors.fill(e.response.data);
        } else {
          this.error = e.response.data.error;
        }
      }

      this.busy = false;
    },

    flushErrors () {
      this.$errors.flush();
      this.error = null;
    }
  }
};
</script>

<style>
</style>
