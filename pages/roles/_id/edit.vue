<template>
  <div class="card p-3">
    <form @submit.prevent="update()">
      <h5>تعديل دور وظيفي</h5>
      <div class="row">
        <div class="col-md-12 col-12 mt-2">
          <div class>
            <input
              v-model="editedRole.name"
              type="text"
              name="article-num"
              class="form-control"
              placeholder="اسم الدور الوظيفي"
            >
            <span class="text-danger">
              <error input="name" />
            </span>
          </div>
        </div>

        <div class="col-md-12 mt-4">
          <h5>الصلاحيات الخاصة بهذا الدور الوظيفي:</h5>
          <span class="text-danger">
            <error input="permissions" />
          </span>
          <div class="row">
            <div
              v-for="(group, resource) in permissions"
              :key="resource"
              class="permission-group col-md-3 my-3"
            >
              <div class="form-check">
                <label>
                  <input
                    @change="toggle(resource, $event)"
                    :checked="allChecked(resource)"
                    type="checkbox"
                    name="check"
                  >
                  <span class="label-text">{{ resource }}</span>
                </label>
              </div>
              <div
                v-for="permission in group"
                :key="permission.id"
                class="form-check"
              >
                <label>
                  <input
                    :value="permission.id"
                    v-model="selectedPermissions"
                    type="checkbox"
                  >
                  <span class="label-text">{{ permission.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-12 text-right">
        <div v-if="editedRole.status !== 'deleted'">
          <button
            v-permission:any="'delete role|delete any role'"
            @click="remove()"
            type="button"
            class="btn bg-white text-danger border-danger"
          >
            <i class="fa fa-times" aria-hidden="true" />
            حذف
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
          v-permission:any="'delete role|delete any role'"
          @click="restore()"
          v-else
          type="button"
          class="btn bg-white text-success border-success"
        >
          <i class="fa fa-refresh" aria-hidden="true" />
          استعادة
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      selectedPermissions: [],
      busy: false
    };
  },
  async asyncData ({ $axios, error, params }) {
    try {
      const response = await $axios.$get(`/cp/roles/${params.id}/edit`);

      return {
        editedRole: {
          id: response.data.role.id,
          name: response.data.role.name,
          status: response.data.role.status,
          selectedPermissions: response.data.role.permissions
        },
        permissions: response.data.permissions
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  created () {
    const groups = Object.values(
      Object.entries(this.permissions).map((e) => {
        return e[1];
      })
    ).flat();

    const permissions = groups.filter((group) => {
      return this.editedRole.selectedPermissions.includes(group.name);
    });

    this.selectedPermissions = permissions.map(p => p.id);
  },
  methods: {
    async update () {
      try {
        this.busy = true;
        this.$errors.flush();
        const response = await this.$axios.$patch(
          `/cp/roles/${this.editedRole.id}`,
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

          this.$router.push('/roles');
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
        name: this.editedRole.name,
        permissions: this.selectedPermissions
      };
    },
    remove () {
      this.$swal({
        title: 'تأكيد الحذف؟',
        icon: 'warning',
        buttons: ['إلغاء', 'حذف'],
        dangerMode: true
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await this.$axios.$delete(
              `/cp/roles/${this.editedRole.id}`
            );
            if (response.type === 'success') {
              this.$noty.success(response.message, {
                layout: 'topCenter',
                timeout: 1500,
                theme: 'relax'
              });

              this.$router.push('/roles');
            }
          } catch (e) {
            if (e.response.status === 422) {
              this.$noty.error(
                '<i class="fa fa-warning"></i> ' + e.response.data.message,
                {
                  layout: 'topCenter',
                  timeout: 5000,
                  theme: 'relax'
                }
              );
            } else {
              window.error({ statusCode: e.response.status });
            }
          }
        }
      });
    },
    toggle (resource, $event) {
      const checked = $event.target.checked;

      this.permissions[resource].forEach((permission) => {
        if (checked) {
          if (!this.selectedPermissions.includes(permission.id)) {
            this.selectedPermissions.push(permission.id);
          }
        } else if (this.selectedPermissions.includes(permission.id)) {
          this.selectedPermissions.splice(
            this.selectedPermissions.indexOf(permission.id),
            1
          );
        }
      });
    },
    allChecked (resource) {
      let checked = true;
      this.permissions[resource].forEach((permission) => {
        if (!this.selectedPermissions.includes(permission.id)) {
          checked = false;
        }
      });

      return checked;
    }
  }
};
</script>

<style>
.permission-group .form-check:nth-child(1) {
  margin-right: -20px;
}
label {
  position: relative;
  cursor: pointer;
  color: #666;
  font-size: 18px;
}

input[type="checkbox"],
input[type="radio"] {
  visibility: hidden;
}

/*Check box*/
input[type="checkbox"] + .label-text:before {
  content: "\f096";
  font-family: "FontAwesome";
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  width: 1em;
  display: inline-block;
  margin-right: 5px;
}

input[type="checkbox"]:checked + .label-text:before {
  content: "\f14a";
  color: #2980b9;
  animation: effect 250ms ease-in;
}

input[type="checkbox"]:disabled + .label-text {
  color: #aaa;
}

input[type="checkbox"]:disabled + .label-text:before {
  content: "\f0c8";
  color: #ccc;
}

@keyframes effect {
  0% {
    transform: scale(0);
  }

  25% {
    transform: scale(1.1);
  }

  75% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
