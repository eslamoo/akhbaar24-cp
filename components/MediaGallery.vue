<template>
  <div>
    <transition
      v-permission:any="'view media| view any media'"
      name="modal-fade"
      class="modal mediaGallery"
      role="dialog"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
    >
      <div class="mediaGallery-backdrop">
        <div
          id="mediaGallery"
          class="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-body">
              <nav>
                <div id="nav-tab" class="nav nav-tabs" role="tablist">
                  <a
                    id="nav-profile-tab"
                    v-permission="'create media'"
                    class="nav-item nav-link active"
                    data-toggle="tab"
                    href="#add-new"
                    role="tab"
                    aria-controls="nav-profile"
                    aria-selected="false"
                  >إضافة جديد</a>
                  <a
                    id="nav-home-tab"
                    class="nav-item nav-link "
                    data-toggle="tab"
                    href="#gallery-search"
                    role="tab"
                    aria-controls="nav-home"
                    aria-selected="true"
                  >بحث</a>
                </div>
              </nav>
              <div id="nav-tabContent" class="tab-content">
                <div
                  id="add-new"
                  v-permission="'create media'"
                  class="tab-pane fade show active"
                  role="tabpanel"
                  aria-labelledby="add-new-tab"
                >
                  <div class="form-group p-3">
                    <label for="description">وصف</label>
                    <input
                      id="description"
                      v-model="description"
                      class="form-control"
                      type="text"
                    >
                    <span class="text-danger">
                      <error input="description" />
                    </span>
                  </div>

                  <span class="text-danger p-3">
                    <error input="media" />
                  </span>
                  <dropzone
                    id="upload-zone"
                    ref="uploader"
                    :options="dropZoneOptions"
                    :destroyDropzone="true"
                  >
                    <img src="~/assets/img/attach.png" width="100px" alt>

                    <p>
                      يمكن اضافة صور بإمتداد png,jpg,jpeg,gif مع مراعاة كون الصورة
                      عرضها علي الأقل ٦٠٠ بكسل, وبحجم أقصى ٢ميجا
                    </p>
                  </dropzone>
                  <div
                    class="modal-footer add-new-footer"
                    style="position: absolute;bottom: 0;left: 0;"
                  >
                    <button
                      @click="close()"
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
                <div
                  id="gallery-search"
                  class="tab-pane fade"
                  role="tabpanel"
                  aria-labelledby="gallery-search-tab"
                >
                  <form @submit.prevent="applyFilters()">
                    <div class="search-section">
                      <div class="form-group">
                        <label class="font-weight-bold">
                          أكتب التوصيف الخاص بالصورة
                        </label>
                        <div class="gallery-search">
                          <input
                            v-model="query"
                            class="gallery-search__input"
                            type="text"
                            placeholder="اكتب التوصيف الخاص بالصورة"
                          >
                          <button
                            :disabled="!filterable"
                            class="gallery-search__button"
                            type="submit"
                          >
                            <i class="fa fa-search" />
                          </button>
                          <button v-if="filtersApplied" @click="mediaIndex(true)" class="btn gallery-search__button mr-4">
                            <i class="fa fa-times" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div class="searchResults">
                    <vue-select-image
                      :dataImages="images"
                      :is-multiple="isMultiple"
                      @onselectimage="setImages"
                      @onselectmultipleimage="setImages"
                    />
                    <infinite-loading @infinite="infiniteHandler" />
                  </div>
                  <div
                    class="modal-footer search-footer"
                    style="position: absolute;bottom: 0;left: 0;"
                  >
                    <button
                      @click="close()"
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      إلغاء
                    </button>
                    <button
                      id="insert"
                      :disabled="!insertable"
                      @click="insert()"
                      class="btn btn-primary gallery-insert-btn"
                    >
                      <span>إدراج</span>
                      <svg>
                        <use xlink:href="~/assets/svg/sprite.svg#insert" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone';
import 'nuxt-dropzone/dropzone.css';

export default {
  name: 'MediaGallery',
  components: {
    Dropzone
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      page: 1,
      images: [],
      selectedImages: [],
      query: '',
      filtersApplied: false,
      description: '',
      dropZoneOptions: {
        url: file => this.store(file),
        acceptedFiles: 'image/jpeg,image/jpg,image/png,image/gif',
        thumbnailWidth: 150,
        maxFilesize: 2,
        dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> إضافة صورة",
        maxFiles: 50,
        addRemoveLinks: true,
        uploadMultiple: false
      }
    };
  },
  computed: {
    isMultiple () {
      return this.source === 'album' || this.source === 'editor';
    },
    insertable () {
      return this.selectedImages.length > 0;
    },
    filterable () {
      return this.query !== '';
    }
  },
  mounted () {
    this.mediaIndex();
  },
  beforeCreate () {
    $('body').addClass('modal-open');
  },
  destroyed () {
    $('body').removeClass('modal-open');
  },
  methods: {
    async applyFilters () {
      const params = {
        query: this.query
      };

      this.filtersApplied = true;
      this.$nuxt.$loading.start();

      try {
        await this.$axios
          .$get('/cp/media/filter', { params })
          .then((response) => {
            const reformattedImages = response.data.map((obj) => {
              return {
                id: obj.id,
                src: obj.path,
                desc: obj.description
              };
            });

            this.images = reformattedImages;
          });
      } catch (e) {
        console.log(e);
      }

      this.$nuxt.$loading.finish();
    },
    close () {
      this.$emit('close');
    },
    infiniteHandler ($state) {
      const params = this.filtersApplied
        ? { page: this.page, query: this.query }
        : { page: this.page };

      this.$axios
        .$get('/cp/media', {
          params
        }).then((response) => {
          const reformattedImages = response.data.map((obj) => {
            return {
              id: obj.id,
              src: obj.path,
              desc: obj.description
            };
          });

          if (response.data.length === response.meta.per_page) {
            this.page += 1;
            this.images.push(...reformattedImages);
            $state.loaded();
          } else {
            $state.complete();
          }
        });
    },
    insert () {
      this.$bus.$emit(`insert to ${this.source}`, this.selectedImages);
      this.$emit('close');
    },
    mediaIndex (clear = null) {
      if (clear) {
        this.query = '';
        this.filtersApplied = false;
        this.images = [];
      }
      this.$axios
        .$get('/cp/media', {
          page: this.page
        }).then((response) => {
          const reformattedImages = response.data.map((obj) => {
            return {
              id: obj.id,
              src: obj.path,
              desc: obj.description
            };
          });

          if (response.data.length === response.meta.per_page) {
            this.page += 1;
            this.images.push(...reformattedImages);
          }
        });
    },
    setImages (images) {
      if (this.isMultiple) {
        this.selectedImages = images;
      } else {
        this.selectedImages = [images];
      }
    },
    async store (data) {
      this.$errors.flush();

      const formData = new FormData();

      formData.append('media', data[0]);
      formData.append('type', 'image');
      formData.append('description', this.description);

      try {
        const response = await this.$axios.$post('/cp/media/upload', formData);

        this.$noty.success(
          '<i class="fa fa-check"></i> ' + response.message,
          {
            layout: 'topCenter',
            timeout: 5000,
            theme: 'relax'
          }
        );

        this.description = '';

        this.selectedImages.push({
          id: response.media.id,
          src: response.media.path,
          desc: response.media.description
        });

        this.insert();
      } catch (e) {
        if (e.response.status === 422) {
          console.log(e);

          this.$errors.fill(e.response.data.errors);
        } else {
          window.error({
            statusCode: 404,
            message: 'Not found'
          });
        }
      }
    }
  }
};
</script>

<style>
.mediaGallery-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.67);

  transition: opacity 0.15s linear;
}

.mediaGallery {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.vue-select-image__item {
  margin-right: 5px;
  float: right;
  margin-left: 0;
  width: 19%;
}
</style>
