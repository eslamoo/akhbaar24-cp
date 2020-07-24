<template>
  <div class="welcome">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">
        لوحة تحكم أخبار 24
      </h1>
    </div>
    <div v-permission:unless="'view dashboard stats'" class="row">
      <div class="col-12">
        <h5 class="border-left">
          مرحبا بك يا
          {{ $auth.user.name }}
        </h5>
      </div>
    </div>
    <div v-permission="'view dashboard stats'" class="row">
      <!-- Earnings (Monthly) Card Example -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-right-primary shadow h-100">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div
                  class="text-xs font-weight-bold text-primary text-uppercase mb-1"
                >
                  المواد
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ items }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fa fa-file-text-o fa-2x text-gray-300 opacity-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Earnings (Monthly) Card Example -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-right-primary shadow h-100">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div
                  class="text-xs font-weight-bold text-primary text-uppercase mb-1"
                >
                  المجموعات
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ groups }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fa fa-users fa-2x text-gray-300 opacity-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Earnings (Monthly) Card Example -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-right-primary shadow h-100">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div
                  class="text-xs font-weight-bold text-primary text-uppercase mb-1"
                >
                  السلاسل
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ series }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fa fa-list fa-2x text-gray-300 opacity-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Requests Card Example -->
      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-right-primary shadow h-100">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div
                  class="text-xs font-weight-bold text-primary text-uppercase mb-1"
                >
                  مواد معلقة
                </div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">
                  {{ unpublished_items }}
                </div>
              </div>
              <div class="col-auto">
                <i class="fa fa-tasks fa-2x text-gray-300 opacity-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      items: 0,
      unpublished_items: 0,
      series: 0,
      groups: 0
    };
  },
  mounted () {
    console.log('hi');
  },
  created () {
    this.$axios.$get('/cp/dashboard')
      .then((response) => {
        this.items = response.items;
        this.unpublished_items = response.unpublished_items;
        this.series = response.series;
        this.groups = response.groups;
      });
  }
};
</script>

<style lang="scss">
// @import "@assets/sass/style.scss";
</style>
