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
                    v-model="editedItem.type"
                    :disabled="true"
                    class="custom-radio article-radio"
                    type="radio"
                    name="my-radio"
                    value="article"
                  >
                  <label for="radio_1"> <span /> مقال </label>
                </div>
                <div class="form-group radio-tab">
                  <input
                    id="radio_2"
                    v-model="editedItem.type"
                    :disabled="true"
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
                    v-model="editedItem.type"
                    :disabled="true"
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
                      v-model="editedItem.title"
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
              <div id="articleCategory" v-show="!usersRoleIsCorrector" class="row">
                <div class="col-xs-12 col-md-12">
                  <div class="form-group">
                    <label class="font-weight-bold">
                      القسم
                      <span class="text-muted" style="font-size: 12px">(إختياري في حالة العرض في الصفحة الرئيسية)</span>
                    </label>
                    <multiselect
                      ref="categorySelectDom"
                      v-model="editedItem.categories"
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
              <div v-show="!usersRoleIsCorrector" class="row justify-content-between px-3">
                <div class="col-md-5 form-group">
                  <div class="article-details__checkbox">
                    <input
                      id="cbxA24"
                      v-model="editedItem.akhbaar_home_page"
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
                      v-model="editedItem.a24_rank"
                      :options="ranks()"
                      :multiple="false"
                      :searchable="true"
                      :hide-selected="true"
                      :disabled="!editedItem.akhbaar_home_page"
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
                      v-model="editedItem.sport_home_page"
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
                      v-model="editedItem.s24_rank"
                      :options="ranks()"
                      :multiple="false"
                      :searchable="true"
                      :hide-selected="true"
                      :disabled="!editedItem.sport_home_page"
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
              <div
                id="articleVideo"
                v-if="editedItem.type === 'video'"
                v-show="!usersRoleIsCorrector"
                class="row"
              >
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
              <div
                id="articleContent"
                v-if="editedItem.type === 'article' || 'gallery'"
                class="row"
              >
                <div class="col-xs-12 col-md-12">
                  <div class="form-group">
                    <label class="font-weight-bold">
                      محتوى المادة
                    </label>
                    <div v-show="!usersRoleIsCorrector" class="row">
                      <div class="col-12 my-2">
                        <!-- @click.prevent="openModalIframe('http://upload.matchat.online/Account/Login')" -->
                      </div>
                    </div>
                    <div class="bg-white article">
                      <Editor :body="editedItem.body" />
                    </div>
                    <span class="text-danger">
                      <error input="body" />
                    </span>
                  </div>
                </div>
              </div>

              <div
                id="articleAlbum"
                v-if="editedItem.type === 'gallery'"
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
                      :key="element.name"
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
                      ata-toggle="modal"
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
          <div v-show="!usersRoleIsCorrector" class="col-xs-12 col-md-4">
            <div class="card article-main-image">
              <h5 class="card-header">
                إضافة الصورة الرئيسية
                <span v-if="editedItem.type === 'article'" class="text-danger">*</span>
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
                        v-if="editedItem.image"
                        :src="editedItem.image"
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
                  >(التعليقات - المصدر -الوسوم - المحررين - سلسلة )</small>
                </h5>
                <div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-12">
                        <span class="font-weight-bold">الناشر:</span>
                        {{ editedItem.publisher ? editedItem.publisher.name : editedItem.owner.name }}
                      </div>
                    </div>
                    <hr>
                    <div v-if="editedItem.type === 'article'" class="row">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label class="font-weight-bold">نوع أيقونة المادة؟</label>
                          <div class="more-opt row px-0">
                            <div class="col-4 text-center">
                              <div class="article-details__checkbox">
                                <input
                                  id="cbxSocial"
                                  v-model="editedItem.content"
                                  :disabled="editedItem.content.length > 0 && !editedItem.content.includes('social media')"
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
                                  v-model="editedItem.content"
                                  :disabled="editedItem.content.length > 0 && !editedItem.content.includes('video')"
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
                                  v-model="editedItem.content"
                                  :disabled="editedItem.content.length > 0 && !editedItem.content.includes('gallery')"
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
                    <hr v-if="editedItem.type === 'article'">
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
                                    v-model="editedItem.platforms"
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
                                    v-model="editedItem.platforms"
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
                                v-model="editedItem.editors"
                                :options="editors"
                                :multiple="true"
                                :searchable="true"
                                :hide-selected="true"
                                :disabled="editedItem.source !== null"
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
                                v-model="editedItem.source"
                                :options="sources"
                                :multiple="false"
                                :searchable="true"
                                :hide-selected="true"
                                :disabled="editedItem.editors.length > 0"
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
                            v-model="editedItem.tags"
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
                        </div>
                        <span class="text-danger">
                          <error input="tags" />
                        </span>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="row">
                        <div class="col-md-12">
                          <div class="form-group">
                            <label class="font-weight-bold">السلسلة</label>
                            <div class="more-opt row">
                              <multiselect
                                v-model="editedItem.series"
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
                          v-model="editedItem.publish_date"
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
                          v-model="editedItem.is_commentable"
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
          <button
            v-permission:any="'delete item|delete any item'"
            @click="remove()"
            v-if="editedItem.status !== 'deleted'"
            type="button"
            class="btn bg-white text-danger border-danger"
          >
            <i class="fa fa-times" aria-hidden="true" />
            حذف
          </button>
          <button
            v-permission:any="'delete item|delete any item'"
            @click="restore()"
            v-if="editedItem.status === 'deleted'"
            type="button"
            class="btn bg-white text-success border-success"
          >
            <i class="fa fa-refresh" aria-hidden="true" />
            استعادة
          </button>
          <button
            v-if="!busy && editedItem.status !== 'deleted'"
            type="submit"
            class="btn save"
          >
            <i class="fa fa-save" />
            حفظ
          </button>
          <button :disabled="true" v-if="busy" type="submit" class="btn save">
            <i class="fa fa-spinner fa-spin" />
            حفظ
          </button>
          <a
            v-if="
              editedItem.status !== 'published' &&
                editedItem.status !== 'deleted'
            "
            v-permission:any="'publish item|publish any item'"
            @click.prevent="publish()"
            href="#"
            class="btn btn-success"
          >
            <i class="fa fa-share" />
            انشر الان
          </a>
          <a
            v-if="
              editedItem.status === 'published' &&
                editedItem.status !== 'deleted'
            "
            @click.prevent="unpublish()"
            v-permission:any="'publish item|publish any item'"
            href="#"
            class="btn btn-danger"
          >
            <i class="fa fa-times" />
            إلغاء النشر
          </a>
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

    <div class="row">
      <div class="col-12 mt-5">
        <h4 class="my-2">
          <i class="fa fa-clock-o" />
          سجل التعديلات
        </h4>
        <div ref="tableContainer" class="articles-table table-responsive">
          <table class="table table-striped" dir="rtl">
            <thead>
              <tr>
                <th>#</th>
                <th>نوع التعديل</th>
                <th>القيم السابقة</th>
                <th>القيم الحالية</th>
                <th>المستخدم</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td>{{ log.id }}</td>
                <td>
                  <span class="badge badge-pill badge-light">
                    {{ translate(log.description) }}
                  </span>
                </td>
                <td>
                  <div v-if="log.description === 'updated'">
                    <ul>
                      <li v-for="(property, key) in log.properties.old" :key="key" class="d-flex">
                        <span class="text-black-50"><b>{{ key.toUpperCase() }}</b></span>
                        <span class="mx-1">:</span>
                        <span>{{ property }}</span>
                      </li>
                    </ul>
                  </div>
                </td>
                <td>
                  <div v-if="log.description === 'updated'">
                    <ul>
                      <li v-for="(property, key) in log.properties.attributes" :key="key" class="d-flex">
                        <span class="text-black-50"><b>{{ key.toUpperCase() }}</b></span>
                        <span class="mx-1">:</span>
                        <span>{{ property }}</span>
                      </li>
                    </ul>
                  </div>
                </td>
                <td>{{ log.user.name }}</td>
                <td>
                  <span class="publish-date">
                    يوم :
                    {{ $moment(log.created_at).format("DD/MM/YYYY") }}
                  </span>
                  <br>
                  <span class="publish-date">
                    الساعة:
                    {{ $moment(log.created_at).format("LT") }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="row">
          <div class="col-4">
            <span><i class="fa fa-clock-o" /></span>
            <span>عدد التعديلات:</span>
            <span><b>{{ logsData.meta.total }}</b></span>
          </div>
          <div class="col-8 d-flex justify-content-end">
            <pagination
              :data="logsData"
              :limit="3"
              @pagination-change-page="fetchData"
            />
          </div>
        </div>
      </div>
    </div>
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
      isGalleryOpen: false,
      isIframeOpen: false,
      iframe_url: '',
      source: '',
      isLoading: false,
      dragging: false
    };
  },
  computed: {
    draggingInfo () {
      return this.dragging ? 'under drag' : '';
    },
    usersRoleIsCorrector () {
      return this.$auth.user.roles.includes('language corrector');
    }
  },
  async asyncData ({ $axios, error, params }) {
    try {
      const response = await $axios.$get(`/cp/items/${params.id}/edit`);
      const logsResponse = await $axios.$get(`/cp/items/${params.id}/logs`);

      return {
        video_url: response.data.item.video_media
          ? response.data.item.video_media.path
          : '',
        album: response.data.item.gallery_media
          ? response.data.item.gallery_media
          : [],
        editedItem: {
          id: response.data.item.id,
          title: response.data.item.title,
          body: response.data.item.body,
          type: response.data.item.type,
          image: response.data.item.image,
          categories: response.data.item.categories,
          editors: response.data.item.editors,
          source: response.data.item.source,
          platforms: response.data.item.platforms.map(platform => platform.id),
          series: response.data.item.series,
          tags: response.data.item.tags.map(tag => tag.name),
          is_commentable: !response.data.item.is_commentable,
          a24_rank: response.data.item.akhbaar24_rank,
          s24_rank: response.data.item.sport24_rank,
          akhbaar_home_page: response.data.item.akhbaar_home_page,
          sport_home_page: response.data.item.sport_home_page,
          status: response.data.item.status,
          content: response.data.item.content === null ? [] : [response.data.item.content],
          publisher: response.data.item.publisher,
          owner: response.data.item.owner,
          publish_date: response.data.item.published_at
        },
        // eslint-disable-next-line no-undef
        categories: _.chain(response.data.categories)
          .groupBy('site')
          .map((value, key) => ({ site: key, categories: value }))
          .value(),
        sources: response.data.sources,
        editors: response.data.editors,
        series: response.data.series,
        tags: response.data.tags.map(tag => tag.name),
        logsData: logsResponse,
        logs: logsResponse.data
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  created () {
    this.album.forEach((element) => {
      element.description = element.caption;
    });
    // ranks
    const a24rank = this.ranks().find((rank) => {
      return rank.number === this.editedItem.a24_rank;
    });

    const s24rank = this.ranks().find((rank) => {
      return rank.number === this.editedItem.s24_rank;
    });

    if (a24rank) {
      this.editedItem.a24_rank = a24rank;
    }

    if (s24rank) {
      this.editedItem.s24_rank = s24rank;
    }
  },
  mounted () {
    this.$bus.$on('editor-saved', (blocks) => {
      this.editedItem.body = blocks;

      this.update();
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
      this.editedItem.image = images[0].src;
    });

    this.$bus.$on('insert to album', (images) => {
      images.forEach((image) => {
        this.album.push({
          id: image.id,
          path: image.src,
          description: image.desc
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
    async update () {
      this.busy = true;
      this.$errors.flush();

      try {
        const response = await this.$axios.$patch(
          `/cp/items/${this.editedItem.id}`,
          this.getFormData()
        );

        if (response.type === 'success') {
          this.$noty.success(
            '<i class="fa fa-check"></i> ' +
              response.message +
              ` <a href="/items/${this.editedItem.id}">اضغط هنا لعرض المادة</>`,
            {
              layout: 'topCenter',
              timeout: 5000,
              theme: 'relax'
            }
          );
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
      const form = {
        title: this.editedItem.title,
        body: this.editedItem.body,
        type: this.editedItem.type,
        image: this.editedItem.image,
        series: this.editedItem.series ? this.editedItem.series.id : null,
        source: this.editedItem.source ? this.editedItem.source.id : null,
        tags: this.editedItem.tags,
        is_commentable: this.editedItem.is_commentable,
        platforms: this.editedItem.platforms,
        publish_date: this.editedItem.publish_date
      };

      form.categories = this.editedItem.categories.map(category => category.id);
      form.editors = this.editedItem.editors.map(editor => editor.id);

      // item type
      if (this.editedItem.type === 'video') {
        form.video_url = this.video_url;
      } else if (this.editedItem.type === 'gallery') {
        form.album = this.album;
      }

      // item content
      if (this.editedItem.content.length > 0) {
        form.content = this.editedItem.content[0];
      } else {
        form.content = null;
      }

      // a24 ranks
      if (this.editedItem.akhbaar_home_page) {
        form.akhbaar_home_page = this.editedItem.akhbaar_home_page;
        form.a24_rank = this.editedItem.a24_rank ? this.editedItem.a24_rank.number : null;
      }

      // s24 ranks
      if (this.editedItem.sport_home_page) {
        form.sport_home_page = this.editedItem.sport_home_page;
        form.s24_rank = this.editedItem.s24_rank ? this.editedItem.s24_rank.number : null;
      }

      return form;
    },
    remove () {
      this.$swal({
        title: 'تأكيد الحذف؟',
        icon: 'warning',
        buttons: ['إلغاء', 'حذف'],
        dangerMode: true
      }).then(async (willDelete) => {
        if (willDelete) {
          const response = await this.$axios.$delete(
            `/cp/items/${this.editedItem.id}`
          );

          if (response.type === 'success') {
            this.editedItem.status = 'deleted';
            this.$noty.success(response.message, {
              layout: 'topCenter',
              timeout: 5000,
              theme: 'relax'
            });
          }
        }
      });
    },
    publish () {
      this.$swal({
        title: 'تأكيد النشر',
        icon: 'warning',
        buttons: ['إلغاء', 'موافق'],
        dangerMode: false
      }).then(async (willPublish) => {
        if (willPublish) {
          try {
            const response = await this.$axios.$patch(
              `/cp/items/${this.editedItem.id}/publish`
            );

            if (response.type === 'success') {
              this.editedItem.status = 'published';

              this.$noty.success(
                '<i class="fa fa-check"></i> ' + response.message,
                {
                  layout: 'topCenter',
                  timeout: 5000,
                  theme: 'relax'
                }
              );
            }
          } catch (e) {
            window.error({ statusCode: e.response.status });
          }
        }
      });
    },
    unpublish (item) {
      this.$swal({
        title: 'تأكيد الغاء النشر',
        icon: 'warning',
        buttons: ['إلغاء', 'موافق'],
        dangerMode: true
      }).then(async (willUnpublish) => {
        if (willUnpublish) {
          try {
            const response = await this.$axios.$patch(
              `/cp/items/${this.editedItem.id}/unpublish`
            );

            if (response.type === 'success') {
              this.editedItem.status = 'draft';

              this.$noty.success(
                '<i class="fa fa-check"></i> ' + response.message,
                {
                  layout: 'topCenter',
                  timeout: 5000,
                  theme: 'relax'
                }
              );
            }
          } catch (e) {
            window.error({ statusCode: e.response.status });
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
                id: this.editedItem.id,
                type: 'items'
              }
            );

            if (response.type === 'success') {
              this.$noty.success(response.message, {
                layout: 'topCenter',
                timeout: 5000,
                theme: 'relax'
              });

              this.$router.push('/items');
            }
          } catch (e) {
          }
        }
      });
    },
    addTag (tag) {
      if (!this.editedItem.tags.includes(tag)) {
        this.editedItem.tags.push(tag);
      }
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
    async fetchData (page = 1) {
      this.$nuxt.$loading.start();

      await this.$axios.$get(`/cp/items/${this.editedItem.id}/logs?page=${page}`)
        .then((response) => {
          this.logsData = response;
          this.logs = response.data;
        });

      this.$nuxt.$loading.finish();
    },
    setCategoryFocused () {
      this.$refs.categorySelectDom.$el.focus();
    },
    setEditorFocused () {
      this.$refs.editorSelectDom.$el.focus();
    },
    insertVideo () {
      const url = prompt('youtube.com | argaam.forstreams.com url:');

      if (url) {
        if (url.includes('youtube.com')) {
          this.editedItem.body += `<p><figure class="media"><oembed url="${url}"></oembed></figure></p>`;
        } else if (url.includes('argaam.forstreams.com')) {
          this.editedItem.body += `<p><figure class="media"><oembed url="${url}"></oembed></figure></p>`;
        }
      }
    },
    insertSocialEmbed (provider) {
      const url = prompt(`${provider} url: `);

      if (url) {
        if (url.includes(provider.toLowerCase() + '.com')) {
          this.editedItem.body += `<p><figure class="media"><oembed url="${url}"></oembed></figure></p>`;
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

      // this.editedItem.body += tweet;
      this.editedItem.body.replace(`<p>${text}</p>`, tweet);
    },
    categoryCustomName ({ id, title, site }) {
      if (id <= 2) {
        title = title.slice(0, -2);
      }
      return `${site} ${title}`;
    },
    translate (key) {
      switch (key) {
        case 'created':
          return 'إنشاء';
        case 'updated':
          return 'تحديث';
        case 'deleted':
          return 'حذف';
        case 'restored':
          return 'إستعادة';
        default:
          return key;
      }
    },
    resetRanks (list) {
      // reset akhbaar.
      if (list === 'a24' && !this.editedItem.akhbaar_home_page) {
        this.editedItem.a24_rank = null;
      }

      // reset sport.
      if (list === 's24' && !this.editedItem.sport_home_page) {
        this.editedItem.s24_rank = null;
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
/*  .ck.ck-editor__editable_inline[dir="ltr"] {
  text-align: right;

} */

.article .ck.ck-editor__editable_inline[dir="ltr"] {
  text-align: right;
  height: 500px;
      border: 1px solid #033a72;
}

p {
  margin: 0;
}
</style>
