<template>
  <div>
    <img v-if="error.statusCode === 404" src="@/assets/img/404.png" style="width:80%;height:100%;display:block;margin:50px auto" alt="">
    <img v-if="error.statusCode === 500" src="@/assets/img/500.png" style="width:80%;height:100%;display:block;margin:50px auto" alt="">
    <img v-if="error.statusCode === 403" src="@/assets/img/403.png" style="width:80%;height:100%;display:block;margin:50px auto" alt="">

    <div class="row justify-content-center">
      <nuxt-link to="/">
        رجوع
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  created () {
    if (this.error.statusCode === 401) {
      this.logout();
    }
  },
  methods: {
    async logout () {
      await this.$auth.logout();
    }
  }
};
</script>

<style>
</style>
