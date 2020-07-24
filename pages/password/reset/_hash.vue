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
            <form action="#">
              <div class="login-input-group">
                <p>البريد الإلكتروني</p>
                <input
                  type="text"
                  class="form-control login-input-group__login-input"
                  placeholder="Example@example.com"
                >
                <svg class="login-input-group__icon">
                  <use xlink:href="~/assets/svg/sprite.svg#user-circle" />
                </svg>
              </div>
              <div class="login-input-group">
                <p>  كلمة المرور الجديدة</p>
                <input
                  type="password"
                  class="form-control login-input-group__login-input"
                  placeholder="*****"
                >
                <svg class="login-input-group__icon">
                  <use xlink:href="~/assets/svg/sprite.svg#password" />
                </svg>
              </div>
              <div class="login-input-group">
                <p>   تأكيد كلمة المرور الجديدة</p>
                <input
                  type="password"
                  class="form-control login-input-group__login-input"
                  placeholder="*****"
                >
                <svg class="login-input-group__icon">
                  <use xlink:href="~/assets/svg/sprite.svg#password" />
                </svg>
              </div>

              <div class="login-button mt-4">
                <button class="btn btn-primary btn-block">
                  استعادة كلمة المرور
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

};
</script>

<style>
</style>
