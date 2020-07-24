<template>
  <div class="card p-3 mb-3">
    <form @submit.prevent="update">
      <h2 style="font-size: 17px;font-weight: bold;">
        تعديل مستخدم
      </h2>

      <div class="row mt-3">
        <div class="col-md-6 col-12 mt-2">
          <div class="form-group">
            <label for="name">اسم المستخدم</label>
            <input
              v-model="editedUser.name"
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
              v-model="editedUser.email"
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
          <select v-model="editedUser.role" class="form-control">
            <option
              v-for="role in roles"
              :value="role.id"
              :key="role.id"
              v-text="translate(role.name)"
            />
          </select>
          <span class="text-danger">
            <error input="role" />
          </span>
        </div>
        <div class="col-md-6 col-12 mt-2 form-group">
          <label for="group">المجموعة</label>
          <select v-model="editedUser.group_id" class="form-control">
            <option
              v-for="group in groups"
              :value="group.id"
              :key="group.id"
              v-text="group.name"
            />
          </select>
          <span class="text-danger">
            <error input="group" />
          </span>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-12 mt-3 text-right">
          <div v-if="editedUser.status !== 'deleted'">
            <button
              v-permission:any="'delete user|delete any user'"
              @click="remove()"
              type="button"
              class="btn bg-white text-danger border-danger"
            >
              <i class="fa fa-times" aria-hidden="true" />
              حظر المستخدم
            </button>

            <button v-if="!busy" type="submit" class="btn btn-primary">
              <i class="fa fa-plus" />
              <span class="submit-text">حفظ</span>
            </button>

            <button v-else type="submit" class="btn btn-primary" disabled>
              <i class="fa fa-spinner fa-spin" />
              <span class="submit-text">حفظ</span>
            </button>
          </div>
          <button
            v-permission:any="'delete user|delete any user'"
            @click="restore()"
            v-else
            type="button"
            class="btn bg-white text-success border-success"
          >
            <i class="fa fa-check" aria-hidden="true" />
            الغاء الحظر
          </button>
        </div>
      </div>
    </form>

    <hr>

    <form @submit.prevent="updatePassword">
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
              v-model="password"
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
              v-model="password_confirmation"
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
        <div class="col-12">
          <button
            v-if="!passwordBusy"
            class="btn btn-outline-success pull-left"
            type="submit"
          >
            <i class="fa fa-lock" />
            تعديل كلمة المرور
          </button>
          <button
            v-else
            class="btn btn-outline-success pull-left"
            type="submit"
            disabled
          >
            <i class="fa fa-spinner fa-spin" />
            تعديل كلمة المرور
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
      passwordBusy: false,
      password: '',
      password_confirmation: '',
      passwordPreview: ''
    };
  },
  async asyncData ({ $axios, error, params }) {
    try {
      const response = await $axios.$get(`/cp/users/${params.id}/edit`);

      return {
        editedUser: response.data.user,
        roles: response.data.roles,
        groups: response.data.groups
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  created () {
    const defaultRole = this.roles.find((role) => {
      return role.name === this.editedUser.roles[0];
    });

    const defaultGroup = this.editedUser.group;

    this.editedUser.role = defaultRole ? defaultRole.id : null;
    this.editedUser.group_id = defaultGroup ? defaultGroup.id : null;
  },
  methods: {
    async update () {
      try {
        this.busy = true;
        this.$errors.flush();

        const response = await this.$axios.$patch(
          `/cp/users/${this.editedUser.id}`,
          this.getFormData()
        );

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
    getFormData () {
      return {
        name: this.editedUser.name,
        email: this.editedUser.email,
        group: this.editedUser.group_id,
        role: this.editedUser.role
      };
    },
    remove () {
      this.$swal({
        title: 'تأكيد الحظر؟',
        icon: 'warning',
        buttons: ['إلغاء', 'حظر'],
        dangerMode: true
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await this.$axios.$delete(
              `/cp/users/${this.editedUser.id}`
            );
            if (response.type === 'success') {
              this.$noty.success(response.message, {
                layout: 'topCenter',
                timeout: 5000,
                theme: 'relax'
              });

              this.$router.push('/users');
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    },
    restore () {
      this.$swal({
        title: 'تأكيد الإستعادة؟',
        icon: 'warning',
        buttons: ['إلغاء', 'إستعادة'],
        dangerMode: true
      }).then(async (willRestore) => {
        if (willRestore) {
          try {
            const response = await this.$axios.$patch('/cp/restore',
              {
                id: this.editedUser.id,
                type: 'users'
              }
            );

            if (response.type === 'success') {
              this.$noty.success(response.message, {
                layout: 'topCenter',
                timeout: 5000,
                theme: 'relax'
              });

              this.$router.push('/users');
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    },
    async updatePassword () {
      try {
        this.passwordBusy = true;
        this.$errors.flush();

        const response = await this.$axios.$patch(`/cp/users/${this.editedUser.id}/password`, {
          password: this.password,
          password_confirmation: this.password_confirmation
        });

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
        // console.log(e);
        if (e.response.status === 422) {
          this.$errors.fill(e.response.data.errors);
        } else {
          window.error({
            statusCode: 404
          });
        }
      }
      this.passwordBusy = false;
    },
    generate () {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      this.password = this.password_confirmation = this.passwordPreview = result;
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

<style></style>
