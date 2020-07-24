<template>
  <div>
    <header class="app-header">
      <nuxt-link class="app-header__logo" to="/">
        <svg>
          <use xlink:href="~/assets/svg/sprite.svg#akhbaar24" />
        </svg>
      </nuxt-link>

      <ul class="app-nav">
        <!--Notification Menu-->
        <!-- User Menu-->
        <li>
          <i class="fa fa-user-circle-o" aria-hidden="true" />
          {{ $auth.user.name }}
        </li>
        <li>
          <button @click="logout()" class="btn btn-primary text-white pt-2">
            <i class="fa fa-sign-out" aria-hidden="true" />
            خروج
          </button>
        </li>
      </ul>
    </header>
    <!-- Sidebar menu-->
    <div class="app-sidebar__overlay" data-toggle="sidebar" />
    <aside class="app-sidebar">
      <ul class="app-menu">
        <li>
          <nuxt-link class="app-menu__item" to="/">
            <i class="app-menu__icon fa fa-dashboard" />
            <span class="app-menu__label">الرئيسية</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link v-permission="'create item'" class="app-menu__item" to="/items/create">
            <i class="app-menu__icon fa fa-edit" />
            <span class="app-menu__label">أضف مادة جديدة</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view item|view any item'" class="treeview">
          <nuxt-link class="app-menu__item" to="/items" data-toggle="treeview">
            <i class="app-menu__icon fa fa-file-text-o" />
            <span class="app-menu__label">المواد</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view series|view any series'" class="treeview">
          <nuxt-link class="app-menu__item" to="/series" data-toggle="treeview">
            <i class="app-menu__icon fa fa-link" />
            <span class="app-menu__label">سلاسل المواد</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view tag|view any tag'" class="treeview">
          <nuxt-link class="app-menu__item" to="/tags" data-toggle="treeview">
            <i class="app-menu__icon fa fa-tags" />
            <span class="app-menu__label">وسوم المواد</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view source|view any source'" class="treeview">
          <nuxt-link class="app-menu__item" to="/sources" data-toggle="treeview">
            <i class="app-menu__icon fa fa-sitemap" />
            <span class="app-menu__label">مصادر المواد</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view editor|view any editor'" class="treeview">
          <nuxt-link class="app-menu__item" to="/editors" data-toggle="treeview">
            <i class="app-menu__icon fa fa-pencil" />
            <span class="app-menu__label">محررين المواد</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view category|view any category'" class="treeview">
          <nuxt-link class="app-menu__item" to="/categories" data-toggle="treeview">
            <i class="app-menu__icon fa fa-clone" />
            <span class="app-menu__label">الأقسام</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view role|view any role'" class="treeview">
          <nuxt-link class="app-menu__item" to="/roles" data-toggle="treeview">
            <i class="app-menu__icon fa fa-list" />
            <span class="app-menu__label">الأدوار الوظيفية</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view group|view any group'" class="treeview">
          <nuxt-link class="app-menu__item" to="/groups" data-toggle="treeview">
            <i class="app-menu__icon fa fa-users" />
            <span class="app-menu__label">المجموعات</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view user|view any user'" class="treeview">
          <nuxt-link class="app-menu__item" to="/users" data-toggle="treeview">
            <i class="app-menu__icon fa fa-user" />
            <span class="app-menu__label">المستخدمين</span>
          </nuxt-link>
        </li>
        <li v-permission:any="'view notice|view any notice'" class="treeview">
          <nuxt-link class="app-menu__item" to="/notifications" data-toggle="treeview">
            <i class="app-menu__icon fa fa-bell" />
            <span class="app-menu__label">الإشعارات</span>
          </nuxt-link>
        </li>
        <li v-role:any="'super admin|moderator|editor|publisher|content manager'" class="treeview">
          <nuxt-link class="app-menu__item" to="/comments" data-toggle="treeview">
            <i class="app-menu__icon fa fa-comments" />
            <span class="app-menu__label">التعليقات</span>
          </nuxt-link>
        </li>
      </ul>
    </aside>
    <main class="app-content">
      <nuxt />
    </main>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$swal({
        title: 'تأكيد عملية تسجيل الخروج من النظام',
        icon: 'warning',
        buttons: ['إلغاء', 'تسجيل الخروج'],
        dangerMode: true
      }).then(async (willLogout) => {
        if (willLogout) {
          await this.$auth.logout();
          this.$router.push('/login');
        }
      });
    }
  }
};
</script>

<style>
.swal-footer {
  text-align: center;
}
</style>
