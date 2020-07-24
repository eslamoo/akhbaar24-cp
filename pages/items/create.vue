<template>
  <div>
    <div class="add-article">
      <form @submit.prevent="save()">
        <div class="row">
          <div class="col-xs-12 col-md-8">
            <div class="article-details">
              <div class="radio-tabs">
                <div class="form-group radio-tab">
                  <input
                    id="radio_1"
                    v-model="item.type"
                    class="custom-radio article-radio"
                    type="radio"
                    name="my-radio"
                    value="article"
                    checked
                  >
                  <label for="radio_1"> <span /> مقال </label>
                </div>
                <div class="form-group radio-tab">
                  <input
                    id="radio_2"
                    v-model="item.type"
                    class="custom-radio album-radio"
                    type="radio"
                    name="my-radio"
                    value="gallery"
                  >
                  <label for="radio_2"> <span /> معرض صور </label>
                </div>
                <div class="form-group radio-tab">
                  <input
                    id="radio_3"
                    v-model="item.type"
                    class="custom-radio video-radio"
                    type="radio"
                    name="my-radio"
                    value="video"
                  >
                  <label for="radio_3"> <span /> فيديو </label>
                </div>
              </div>
              <div class="row">
                <div id="articleTitle" class="col-xs-12 col-md-12">
                  <div class="form-group">
                    <label class="font-weight-bold">
                      العنوان
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      id="articlaTitle"
                      v-model="item.title"
                      type="text"
                      class="form-control"
                      aria-describedby="articlaTitle"
                      placeholder="يمكنكم اضافة عنوان المقال بما  لا يزيد عن 250 حرف او مسافة"
                    >
                    <span class="text-danger">
                      <error input="title" />
                    </span>
                  </div>
                </div>
              </div>
              <div id="articleCategory" class="row">
                <div class="col-xs-12 col-md-12">
                  <div class="form-group">
                    <label class="font-weight-bold">
                      القسم
                      <span class="text-muted" style="font-size: 12px">(إختياري في حالة العرض في الصفحة الرئيسية)</span>
                    </label>
                    <multiselect
                      ref="categorySelectDom"
                      v-model="item.categories"
                      :options="categories"
                      :multiple="true"
                      :group-select="false"
                      :searchable="true"
                      :hide-selected="true"
                      :custom-label="categoryCustomName"
                      @select="setCategoryFocused()"
                      group-values="categories"
                      group-label="site"
                      placeholder="اضف قسم"
                      open-direction="bottom"
                      label="title"
                      track-by="id"
                    >
                      <span slot="noResult">لا يوجد نتائج</span>
                    </multiselect>
                    <span class="text-danger">
                      <error input="categories" />
                    </span>
                  </div>
                </div>
              </div>
              <div class="row justify-content-between px-3">
                <div class="col-md-5 form-group">
                  <div class="article-details__checkbox">
                    <input
                      id="cbxA24"
                      v-model="item.akhbaar_home_page"
                      @change="resetRanks('a24')"
                      type="checkbox"
                    >
                    <label class="cbx" for="cbxA24">
                      <div class="flip">
                        <div class="front" />
                        <div class="back">
                          <svg
                            width="14"
                            height="9"
                            viewBox="0 0 16 14"
                          >
                            <path d="M2 8.5L6 12.5L14 1.5" />
                          </svg>
                        </div>
                      </div>
                    </label>
                    <label
                      class="font-font-weight-bold"
                    >الصفحة الرئيسية لأخبار٢٤</label>
                  </div>
                  <div class="more-opt row">
                    <multiselect
                      v-model="item.a24_rank"
                      :options="ranks()"
                      :multiple="false"
                      :searchable="true"
                      :hide-selected="true"
                      :disabled="!item.akhbaar_home_page"
                      placeholder="اختر ترتيب أخبار٢٤"
                      open-direction="bottom"
                      label="text"
                      track-by="number"
                    />
                    <span class="text-danger">
                      <error input="a24_rank" />
                    </span>
                  </div>
                </div>
                <div class="col-md-5 form-group">
                  <div class="article-details__checkbox">
                    <input
                      id="cbxS24"
                      v-model="item.sport_home_page"
                      @change="resetRanks('s24')"
                      type="checkbox"
                    >
                    <label class="cbx" for="cbxS24">
                      <div class="flip">
                        <div class="front" />
                        <div class="back">
                          <svg
                            width="14"
                            height="9"
                            viewBox="0 0 16 14"
                          >
                            <path d="M2 8.5L6 12.5L14 1.5" />
                          </svg>
                        </div>
                      </div>
                    </label>
                    <label
                      class="font-font-weight-bold"
                    >الصفحة الرئيسية لسبورت٢٤</label>
                  </div>
                  <div class="more-opt row">
                    <multiselect
                      v-model="item.s24_rank"
                      :options="ranks()"
                      :multiple="false"
                      :searchable="true"
                      :hide-selected="true"
                      :disabled="!item.sport_home_page"
                      placeholder="اختر ترتيب سبورت٢٤"
                      open-direction="bottom"
                      label="text"
                      track-by="number"
                    />
                    <span class="text-danger">
                      <error input="s24_rank" />
                    </span>
                  </div>
                </div>
              </div>
              <div id="articleVideo" v-if="item.type === 'video'" class="row">
                <div class="col-xs-12 col-md-12">
                  <div class="form-group">
                    <label class="font-weight-bold">
                      رابط الفيديو
                      <span class="text-danger">*</span>
                    </label>
                    <input
                      v-model="video_url"
                      type="text"
                      placeholder="أضف رابط الفيديو"
                      class="form-control"
                    >
                    <span class="text-danger">
                      <error input="video_url" />
                    </span>
                  </div>
                </div>
              </div>
              <div id="articleContent" class="row">
                <div class="col-xs-12 col-md-12">
                  <div class="form-group">
                    <label class="font-weight-bold">
                      محتوى المادة
                    </label>
                    <div class="bg-white article">
                      <Editor />
                    </div>
                    <span class="text-danger">
                      <error input="body" />
                    </span>
                  </div>
                </div>
              </div>
              <div
                id="articleAlbum"
                v-if="item.type === 'gallery'"
                class="row articleAlbum"
              >
                <div class="col-12">
                  <span
                    class="font-weight-bold articleAlbum__title"
                  >أضف ألبوم الصور</span>
                  <small
                    class="text-grey articleAlbum__small"
                  >يمكنك اضافة حتي 20صورة بإمتدادات png, jpg, jpeg, gif</small>
                  <draggable
                    :list="album"
                    tag="div"
                    class="list-group articleAlbum__list"
                    handle=".handle"
                  >
                    <div
                      v-for="(element, idx) in album"
                      :key="element.id"
                      class="articleAlbum__list__item shadow"
                    >
                      <div class="row">
                        <div
                          class="articleAlbum__list__item--icon col-1 pr-0 text-center"
                        >
                          <i class="fa fa-bars handle" />
                        </div>
                        <div
                          class="articleAlbum__list__item--image col-2 pl-0 text-center"
                        >
                          <img :src="element.path" alt>
                        </div>
                        <div
                          id="editor"
                          class="articleAlbum__list__item--desc border col-7 text-left"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="اضغط للتعديل"
                        >
                          <ckeditor
                            v-model="element.description"
                            :config="albumEditorConfig"
                            type="inline"
                          />
                        </div>
                        <div
                          class="articleAlbum__list__item--delete col-2 text-right"
                        >
                          <a
                            @click="removeAt(idx)"
                            class="btn btn-danger text-white"
                          >
                            <i class="fa fa-trash-o" /> حذف
                          </a>
                        </div>
                      </div>
                    </div>
                  </draggable>
                  <span class="text-danger">
                    <error input="album" />
                  </span>
                  <div class="add-more-items">
                    <a
                      :source="'album'"
                      @click="openMediaGallery('album')"
                      class="btn btn-primary btn-block text-white"
                      data-toggle="source"
                      data-target="#mediaGallery"
                    >
                      <i class="fa fa-plus-square-o" />
                      أضف المزيد
                    </a>
                  </div>
                </div>
              </div>
              <div class="row" />
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="card article-main-image">
              <h5 class="card-header">
                إضافة الصورة الرئيسية
                <span v-if="item.type === 'article'" class="text-danger">*</span>
              </h5>
              <div class="card-body">
                <div class="wrapper">
                  <div class="file-upload">
                    <a
                      @click="openMediaGallery('thumbnail')"
                      style="width: 100%;text-align: center;"
                    >
                      <img
                        id="output_image"
                        v-if="item.image"
                        :src="item.image"
                      >
                      <i class="fa fa-image" />
                    </a>
                  </div>
                </div>
                <span class="text-danger">
                  <error input="image" />
                </span>
                <small class="form-text text-muted">
                  يمكن اضافة صور بإمتداد png,jpg,jpeg,gif مع مراعاة كون الصورة
                  عرضها علي الأقل 600px
                </small>
              </div>
            </div>
            <div class="mt-3">
              <div class="article-more card">
                <h5 class="card-header">
                  المزيد
                  <br>
                  <small
                    class="text-grey"
                  >(التعليقات - المصدر -الوسوم - المحررين - سلسلة)</small>
                </h5>
                <div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-12">
                        <span class="font-weight-bold">الناشر:</span>
                        {{ this.$auth.user.name }}
                      </div>
                    </div>
                    <hr>
                    <div v-if="item.type === 'article'" class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="font-weight-bold">نوع أيقونة المادة؟</label>
                          <div class="more-opt row px-0">
                            <div class="col-4 text-center">
                              <div class="article-details__checkbox">
                                <input
                                  id="cbxSocial"
                                  v-model="item.content"
                                  :disabled="item.content.length > 0 && !item.content.includes('social media')"
                                  type="checkbox"
                                  value="social media"
                                >
                                <label class="cbx" for="cbxSocial">
                                  <div class="flip">
                                    <div class="front" />
                                    <div class="back">
                                      <svg
                                        width="14"
                                        height="9"
                                        viewBox="0 0 16 14"
                                      >
                                        <path d="M2 8.5L6 12.5L14 1.5" />
                                      </svg>
                                    </div>
                                  </div>
                                </label>
                                <br>
                                <label
                                  class="article-details__checkbox__text"
                                >سوشيال ميديا</label>
                              </div>
                            </div>
                            <div class="col-4 text-center">
                              <div class="article-details__checkbox">
                                <input
                                  id="cbxVideo"
                                  v-model="item.content"
                                  :disabled="item.content.length > 0 && !item.content.includes('video')"
                                  type="checkbox"
                                  value="video"
                                >
                                <label class="cbx" for="cbxVideo">
                                  <div class="flip">
                                    <div class="front" />
                                    <div class="back">
                                      <svg
                                        width="14"
                                        height="9"
                                        viewBox="0 0 16 14"
                                      >
                                        <path d="M2 8.5L6 12.5L14 1.5" />
                                      </svg>
                                    </div>
                                  </div>
                                </label>
                                <br>
                                <label
                                  class="article-details__checkbox__text"
                                >فيديو</label>
                              </div>
                            </div>
                            <div class="col-4 text-center">
                              <div class="article-details__checkbox">
                                <input
                                  id="cbxGallery"
                                  v-model="item.content"
                                  :disabled="item.content.length > 0 && !item.content.includes('gallery')"
                                  type="checkbox"
                                  value="gallery"
                                >
                                <label class="cbx" for="cbxGallery">
                                  <div class="flip">
                                    <div class="front" />
                                    <div class="back">
                                      <svg
                                        width="14"
                                        height="9"
                                        viewBox="0 0 16 14"
                                      >
                                        <path d="M2 8.5L6 12.5L14 1.5" />
                                      </svg>
                                    </div>
                                  </div>
                                </label>
                                <br>
                                <label
                                  class="article-details__checkbox__text"
                                >صور</label>
                              </div>
                            </div>
                          </div>
                          <span class="text-danger">
                            <error input="content" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr v-if="item.type === 'article'">
                    <div class="col-md-12 article-tags">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label class="font-weight-bold">
                              منصات النشر
                              <span class="text-danger">*</span>
                            </label>
                            <div class="more-opt row px-0">
                              <div class="col-6 text-center">
                                <div class="article-details__checkbox">
                                  <input
                                    id="cbxWeb"
                                    v-model="item.platforms"
                                    type="checkbox"
                                    value="1"
                                  >
                                  <label class="cbx" for="cbxWeb">
                                    <div class="flip">
                                      <div class="front" />
                                      <div class="back">
                                        <svg
                                          width="14"
                                          height="9"
                                          viewBox="0 0 16 14"
                                        >
                                          <path d="M2 8.5L6 12.5L14 1.5" />
                                        </svg>
                                      </div>
                                    </div>
                                  </label>
                                  <br>
                                  <label
                                    class="article-details__checkbox__text"
                                  >ويب</label>
                                </div>
                              </div>
                              <div class="col-6 text-center">
                                <div class="article-details__checkbox">
                                  <input
                                    id="cbxMobile"
                                    v-model="item.platforms"
                                    type="checkbox"
                                    value="2"
                                  >
                                  <label class="cbx" for="cbxMobile">
                                    <div class="flip">
                                      <div class="front" />
                                      <div class="back">
                                        <svg
                                          width="14"
                                          height="9"
                                          viewBox="0 0 16 14"
                                        >
                                          <path d="M2 8.5L6 12.5L14 1.5" />
                                        </svg>
                                      </div>
                                    </div>
                                  </label>
                                  <br>
                                  <label
                                    class="article-details__checkbox__text"
                                  >تطبيق</label>
                                </div>
                              </div>
                            </div>
                            <span class="text-danger">
                              <error input="platforms" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label class="font-weight-bold">المحررين</label>
                            <div class="more-opt row">
                              <multiselect
                                ref="editorSelectDom"
                                v-model="item.editors"
                                :options="editors"
                                :multiple="true"
                                :searchable="true"
                                :hide-selected="true"
                                :disabled="item.source !== null"
                                @select="setEditorFocused()"
                                placeholder="أضف محرر"
                                label="name"
                                track-by="id"
                                open-direction="bottom"
                              >
                                <span slot="noResult">لا يوجد نتائج</span>
                              </multiselect>
                              <span class="text-danger">
                                <error input="editors" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label class="font-weight-bold">المصدر</label>
                            <div class="more-opt row">
                              <multiselect
                                v-model="item.source"
                                :options="sources"
                                :multiple="false"
                                :searchable="true"
                                :hide-selected="true"
                                :disabled="item.editors.length > 0"
                                placeholder="أضف مصدر"
                                label="title"
                                track-by="id"
                                open-direction="bottom"
                              >
                                <span slot="noResult">لا يوجد نتائج</span>
                              </multiselect>
                              <span class="text-danger">
                                <error input="source" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12 article-tags">
                      <div class="form-group">
                        <label class="font-weight-bold">
                          الوسوم
                          <span class="text-danger">*</span>
                        </label>
                        <div class="more-opt row">
                          <multiselect
                            v-model="item.tags"
                            :options="tags"
                            :multiple="true"
                            :taggable="true"
                            :searchable="true"
                            :hide-selected="true"
                            @tag="addTag"
                            tag-placeholder="اضافة وسم جديد"
                            placeholder="اضف وسم"
                            open-direction="bottom"
                          />
                          <span class="text-danger">
                            <error input="tags" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label class="font-weight-bold">السلسلة</label>
                            <div class="more-opt row">
                              <multiselect
                                v-model="item.series"
                                :options="series"
                                :multiple="false"
                                :searchable="true"
                                :hide-selected="true"
                                placeholder="اختر سلسلة"
                                open-direction="bottom"
                                label="title"
                                track-by="id"
                              >
                                <span slot="noResult">لا يوجد نتائج</span>
                              </multiselect>
                              <span class="text-danger">
                                <error input="series" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <label class="font-weight-bold">تاريخ النشر</label>
                        <flat-pickr
                          :config="config"
                          v-model="item.publish_date"
                          placeholder="تاريخ النشر"
                          class="form-control"
                          name="publish_date"
                        />
                      </div>
                    </div>
                    <div class="col-xs-12 text-center col-md-12 pt-4 px-0">
                      <div class="article-details__checkbox">
                        <input
                          id="cbx4"
                          v-model="item.is_commentable"
                          type="checkbox"
                        >
                        <label class="cbx" for="cbx4">
                          <div class="flip">
                            <div class="front" />
                            <div class="back">
                              <svg width="14" height="9" viewBox="0 0 16 14">
                                <path d="M2 8.5L6 12.5L14 1.5" />
                              </svg>
                            </div>
                          </div>
                        </label>
                        <label
                          class="article-details__checkbox__text"
                        >ايقاف التعليقات</label>
                      </div>
                      <div class="clear" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer text-right mt-4">
          <button v-if="!busy" type="submit" class="btn save">
            <i class="fa fa-save" />
            حفظ
          </button>
          <button :disabled="true" v-else type="submit" class="btn save">
            <i class="fa fa-spinner fa-spin" />
            حفظ
          </button>

          <button
            v-if="!publishBusy"
            @click.prevent="saveAndPublish()"
            v-permission:any="'publish item|publish any item'"
            type="button"
            class="btn btn-success"
          >
            <i class="fa fa-share" />
            حفظ ونشر
          </button>
          <button :disabled="true" v-else type="button" class="btn btn-success">
            <i class="fa fa-spinner fa-spin" />
            حفظ ونشر
          </button>
        </div>
      </form>
    </div>
    <MediaGallery
      v-if="isGalleryOpen"
      @close="closeMediaGallery"
      :source="source"
    />
    <modal-iframe
      :url="iframe_url"
      v-if="isIframeOpen"
      @close="closeModalIframe"
    />
  </div>
</template>

<script>

if (process.browser) {
  require('bootstrap/dist/js/bootstrap.js');
}
export default {
  layout: 'main',
  name: 'Handle',
  display: 'Handle',
  instruction: 'Drag using the handle icon',
  order: 5,
  data () {
    return {
      albumEditorConfig: {
        toolbar: {
          items: [
            'bold',
            'italic',
            'link',
            'undo',
            'redo'
          ]
        }
      },
      config: {
        wrap: false,
        dateFormat: 'Y-m-d h:i K',
        enableTime: true
      },
      id: 3,
      busy: false,
      publishBusy: false,
      isGalleryOpen: false,
      isIframeOpen: false,
      url: null,
      iframe_url: '',
      source: '',
      video_url: null,
      album: [],
      item: {
        image: '',
        title: '',
        body: null,
        content: [],
        type: 'article',
        categories: [],
        editors: [],
        source: null,
        platforms: ['1', '2'],
        series: null,
        tags: [],
        is_commentable: false,
        a24_rank: null,
        s24_rank: null,
        akhbaar_home_page: false,
        sport_home_page: false,
        publish_date: ''
      },
      dragging: false
    };
  },
  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : '';
    }
  },
  async asyncData ({ $axios, error }) {
    try {
      const response = await $axios.$get('/cp/items/create');

      return {
        // eslint-disable-next-line no-undef
        categories: _.chain(response.data.categories)
          .groupBy('site')
          .map((value, key) => {
            return { site: key, categories: value };
          })
          .value(),
        sources: response.data.sources,
        editors: response.data.editors,
        series: response.data.series,
        tags: response.data.tags.map(tag => tag.name)
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  mounted () {
    this.$bus.$on('editor-saved', (blocks, publish) => {
      this.item.body = blocks;

      this.store(publish);
    });

    this.$bus.$on('open mediagallery', (source) => {
      this.isGalleryOpen = true;
      this.source = source;
    });

    this.$bus.$on('open modal-iframe', (url) => {
      this.isIframeOpen = true;
      this.iframe_url = url;
    });

    this.$bus.$on('insert to thumbnail', (images) => {
      this.item.image = images[0].src;
    });

    this.$bus.$on('insert to album', (images) => {
      images.forEach((image) => {
        this.album.push({
          id: image.id,
          path: image.src,
          description: image.desc1
        });
      });
    });
  },
  beforeDestroy () {
    this.$errors.flush();

    this.$bus.$off('editor-saved');
    this.$bus.$off('open mediagallery');
    this.$bus.$off('open modal-iframe');
    this.$bus.$off('insert to thumbnail');
    this.$bus.$off('insert to album');
  },
  methods: {
    save () {
      this.$bus.$emit('save-editor');
    },
    saveAndPublish () {
      this.$bus.$emit('save-editor', true);
    },
    async store (andPublish = false) {
      // eslint-disable-next-line no-unreachable
      andPublish ? (this.publishBusy = true) : (this.busy = true);

      this.$errors.flush();

      try {
        const response = await this.$axios.$post(
          '/cp/items',
          this.getFormData()
        );

        if (response.type === 'success') {
          if (andPublish) {
            this.publish(response.item.id);
          } else {
            this.$noty.success(
              '<i class="fa fa-check"></i> ' + response.message,
              {
                layout: 'topCenter',
                timeout: 5000,
                theme: 'relax'
              }
            );

            this.$router.push('/items');
          }
        }
      } catch (e) {
        if (e.response.status === 422) {
          this.$errors.fill(e.response.data.errors);
        } else {
          window.error({ statusCode: e.response.status });
        }
      }

      andPublish
        ? (this.publishBusy = false)
        : (this.busy = false);
    },
    getFormData () {
      const form = {
        title: this.item.title,
        body: this.item.body,
        type: this.item.type,
        image: this.item.image,
        series: this.item.series ? this.item.series.id : null,
        source: this.item.source ? this.item.source.id : null,
        tags: this.item.tags,
        is_commentable: this.item.is_commentable,
        platforms: this.item.platforms,
        publish_date: this.item.publish_date
      };

      form.categories = this.item.categories.map(category => category.id);
      form.editors = this.item.editors.map(editor => editor.id);

      // item type
      if (this.item.type === 'video') {
        form.video_url = this.video_url;
      } else if (this.item.type === 'gallery') {
        form.album = this.album;
      }

      // item content
      if (this.item.content.length > 0) {
        form.content = this.item.content[0];
      } else {
        form.content = null;
      }

      // a24 ranks
      if (this.item.akhbaar_home_page) {
        form.akhbaar_home_page = this.item.akhbaar_home_page;
        form.a24_rank = this.item.a24_rank ? this.item.a24_rank.number : null;
      }

      // s24 ranks
      if (this.item.sport_home_page) {
        form.sport_home_page = this.item.sport_home_page;
        form.s24_rank = this.item.s24_rank ? this.item.s24_rank.number : null;
      }

      return form;
    },
    addTag (tag) {
      if (!this.item.tags.includes(tag)) {
        this.item.tags.push(tag);
      }
    },
    publish (itemId) {
      this.$swal({
        title: 'تم حفظ المقال بنجاح, تأكيد النشر؟',
        icon: 'warning',
        buttons: ['إلغاء', 'موافق'],
        dangerMode: false
      }).then(async (willPublish) => {
        if (willPublish) {
          try {
            const response = await this.$axios.$patch(
              `/cp/items/${itemId}/publish`
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

              this.$router.push('/items');
            }
          } catch (e) {
            window.error({ statusCode: e.response.status });
          }
        }
      });
    },
    ranks () {
      return [...Array(63).keys()].map((i) => {
        if (i < 3) {
          return {
            number: i + 1,
            text: 'رئيسية ' + (i + 1)
          };
        } else {
          return {
            number: i + 1,
            text: 'هامة ' + (i - 2)
          };
        }
      });
    },
    removeAt (idx) {
      this.$swal({
        title: 'هل انت متأكد من حذف هذا العنصر؟',
        icon: 'warning',
        buttons: ['إلغاء', 'حذف'],
        dangerMode: true
      }).then((willDelete) => {
        if (willDelete) {
          this.album.splice(idx, 1);
          this.$noty.success('تم حذف العنصر بنجاح', {
            layout: 'topCenter',
            timeout: 5000,
            theme: 'relax'
          });
        }
      });
    },
    setCategoryFocused () {
      this.$refs.categorySelectDom.$el.focus();
    },
    setEditorFocused () {
      this.$refs.editorSelectDom.$el.focus();
    },
    onFileChange (e) {
      const file = e.target.files[0];
      if (e.target.files[0]) {
        this.url = URL.createObjectURL(file);
      }
    },
    openMediaGallery (source) {
      this.$bus.$emit('open mediagallery', source);
    },
    closeMediaGallery () {
      this.isGalleryOpen = false;
      $('body').removeClass('modal-open');
    },
    openModalIframe (url) {
      this.$bus.$emit('open modal-iframe', url);
    },
    closeModalIframe () {
      this.isIframeOpen = false;
      $('body').removeClass('modal-iframe-open');
    },
    insertVideo () {
      const url = prompt('youtube.com | argaam.forstreams.com url:');

      if (url) {
        if (url.includes('youtube.com')) {
          this.item.body += `<p><figure class="media"><oembed url="${url}"></oembed></figure></p>`;
        } else if (url.includes('argaam.forstreams.com')) {
          this.item.body += `<p><figure class="media"><oembed url="${url}"></oembed></figure></p>`;
        }
      }
    },
    insertSocialEmbed (provider) {
      const url = prompt(`${provider} url: `);

      if (url) {
        if (url.includes(provider.toLowerCase() + '.com')) {
          this.item.body += `<p><figure class="media"><oembed url="${url}"></oembed></figure></p>`;
        } else {
          this.$noty.error('خطأ في الرابط', {
            layout: 'topCenter',
            timeout: 5000,
            theme: 'relax'
          });
        }
      }
    },
    insertTweetShareLink () {
      const text = window.getSelection().anchorNode.data;
      const tweet = `<a href="https://twitter.com/intent/tweet?text=${text}" class="tweet-share">${text}<i class="fa fa-twitter"></i></a>`;

      // this.item.body += tweet;
      this.item.body.replace(text, tweet);
    },
    categoryCustomName ({ id, title, site }) {
      if (id <= 2) {
        title = title.slice(0, -2);
      }
      return `${site} ${title}`;
    },
    resetRanks (list) {
      // reset akhbaar.
      if (list === 'a24' && !this.item.akhbaar_home_page) {
        this.item.a24_rank = null;
      }

      // reset sport.
      if (list === 's24' && !this.item.sport_home_page) {
        this.item.s24_rank = null;
      }
    }
  }
};
</script>

<style>
input::placeholder {
  font-size: 13px;
}

.swal-footer {
  text-align: center;
}

.noty_body {
  font-weight: bold;
}

.ck-content,
.ck-toolbar {
  direction: rtl !important;
}

.article .ck.ck-editor__editable_inline[dir="ltr"] {
  text-align: right;
  height: 500px;
      border: 1px solid #033a72;
}

p {
  margin: 0;
}
</style>
