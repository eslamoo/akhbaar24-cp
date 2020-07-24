<template>
  <div>
    <div class="card p-3 mb-3">
      <h2 style="font-size: 17px;font-weight: bold;">
        تعديل مجموعة
      </h2>
      <!-- <small class="mb-2 text-muted">أدخل رقم المقال الخاص به واضغط ارسال لإتمام العملية </small> -->
      <form @submit.prevent="update">
        <div class="row">
          <div class="col-md-6 col-12 mt-2">
            <div class>
              <input
                id
                v-model="group.name"
                type="text"
                name="article-num"
                class="form-control"
                placeholder="اسم المجموعة"
              >
              <span class="text-danger">
                <error input="title" />
              </span>
            </div>
          </div>
          <div class="col-12 col-md-6 text-right">
            <button
              v-permission:any="'delete group|delete any group'"
              @click="remove()"
              v-if="status !== 'deleted'"
              type="button"
              class="btn bg-white text-danger border-danger"
            >
              <i class="fa fa-times" aria-hidden="true" />
              حذف
            </button>
            <button
              v-permission:any="'delete group|delete any group'"
              @click="restore()"
              v-if="status === 'deleted'"
              type="button"
              class="btn bg-white text-success border-success"
            >
              <i class="fa fa-refresh" aria-hidden="true" />
              استعادة
            </button>
            <button
              v-if="!busy && status !== 'deleted'"
              type="submit"
              class="btn btn-primary"
            >
              <i class="fa fa-plus" />
              <span class="submit-text">حفظ</span>
            </button>
            <button v-if="busy" type="submit" class="btn btn-primary" disabled>
              <i class="fa fa-spinner fa-spin" />

              <span class="submit-text">حفظ</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'main',

  data () {
    return {
      busy: false
    };
  },
  async asyncData ({ $axios, error, params }) {
    try {
      const response = await $axios.$get(`/cp/groups/${params.id}/edit`);

      return {
        group: response.data,
        status: response.data.status
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  methods: {
    async update () {
      try {
        this.busy = true;
        this.$errors.flush();
        const response = await this.$axios.$patch(
          `/cp/groups/${this.group.id}`,
          { name: this.group.name }
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
          this.$router.push('/groups');
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
              `/cp/groups/${this.group.id}`
            );
            if (response.type === 'success') {
              this.$noty.success(response.message, {
                layout: 'topCenter',
                timeout: 5000,
                theme: 'relax'
              });

              this.$router.push('/groups');
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
                id: this.group.id,
                type: 'groups'
              }
            );

            if (response.type === 'success') {
              this.$noty.success(response.message, {
                layout: 'topCenter',
                timeout: 5000,
                theme: 'relax'
              });

              this.$router.push('/groups');
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
  }
};
</script>

<style></style>
