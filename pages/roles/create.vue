<template>
  <div class="card p-3">
    <form @submit.prevent="store()">
      <h5>إضافة دور وظيفي</h5>
      <div class="row">
        <div class="col-md-12 col-12 mt-2">
          <div class>
            <input
              v-model="role.name"
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
                    v-model="role.selectedPermissions"
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
    </form>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      busy: false,
      role: {
        name: '',
        selectedPermissions: []
      }
    };
  },
  async asyncData ({ $axios, error }) {
    try {
      const response = await $axios.$get('/cp/roles/create');

      return {
        permissions: response.data.permissions
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

        const response = await this.$axios.$post(
          '/cp/roles',
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
        name: this.role.name,
        permissions: this.role.selectedPermissions
      };
    },
    toggle (resource, $event) {
      const checked = $event.target.checked;

      this.permissions[resource].forEach((permission) => {
        if (checked) {
          if (!this.role.selectedPermissions.includes(permission.id)) {
            this.role.selectedPermissions.push(permission.id);
          }
        } else if (this.role.selectedPermissions.includes(permission.id)) {
          this.role.selectedPermissions.splice(
            this.role.selectedPermissions.indexOf(permission.id),
            1
          );
        }
      });
    },
    allChecked (resource) {
      let checked = true;
      this.permissions[resource].forEach((permission) => {
        if (!this.role.selectedPermissions.includes(permission.id)) {
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
