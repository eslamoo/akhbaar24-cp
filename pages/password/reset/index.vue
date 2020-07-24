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

            <div class="mt-4">
              <h5>إستعادة كلمة المرور</h5>
            </div>
            <form @submit.prevent="sendEmail()">
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
              </div>
              <div class="login-button mt-4">
                <button
                  v-show="!busy"
                  class="btn btn-primary btn-block"
                  type="submit"
                >
                  إرسال رابط لاستعادة كلمة المرور
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
    <notifications position="top center" />
  </div>
</template>

<script>
export default {
  auth: false,

  data () {
    return {
      email: '',
      error: '',
      busy: false
    };
  },
  methods: {
    async sendEmail () {
      this.busy = true;

      try {
        const { message } = await this.$axios.$post('/auth/password/forgot', {
          email: this.email
        });

        this.flushData();

        this.$notify({
          title: 'تم بنجاح',
          text: message
        });
      } catch (e) {
        if (e.response.status === 422) {
          this.$notify({
            title: 'خطأ',
            text: e.response.data.email,
            type: 'error'
          });
        } else {
          this.error = e.response.data.error;
        }
      }

      this.busy = false;
    },
    flushErrors () {
      this.error = null;
    },
    flushData () {
      this.email = null;
    }
  }
};
</script>

<style>
</style>
