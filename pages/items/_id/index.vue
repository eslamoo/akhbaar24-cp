<template>
  <div>
    <client-only>
      <div class="devices-list">
        <div class="row">
          <div class="col-4 text-center">
            <input
              id="question3"
              v-model="device"
              name="question"
              type="radio"
              class="desktop with-font "
              value="browser"
              checked
            >
            <label for="question3" class="device-label">عرض في المتصفح</label>
          </div>
          <div class="col-4 text-center">
            <input
              id="question2"
              v-model="device"
              name="question"
              type="radio"
              class="tablet with-font"
              value="tablet"
            >
            <label for="question2" class="device-label">عرض في التابلت</label>
          </div>
          <div class="col-4 text-center">
            <input
              id="question1"
              v-model="device"
              name="question"
              type="radio"
              class="mobile with-font"
              value="mobile"
            >
            <label for="question1" class="device-label">عرض في الجوال</label>
          </div>
        </div>
        <hr>
      </div>
      <div class="text-center">
        <device v-bind="desktop" v-if="device === 'browser'">
          <section class="main-frame">
            <div class="container p-0">
              <main>
                <div class="row">
                  <div class="col-md-12 pl-0">
                    <div class="article-area">
                      <h1 class="title-art">
                        {{ item.title }}
                      </h1>
                      <div class="row">
                        <div class="col-md-6">
                          <p class="time">
                            <i class="fa fa-clock-o mr-1 mb-1" />
                            <span>{{ item.published_at || "معلقة" }}</span>
                          </p>
                        </div>
                        <div class="col-md-6">
                          <div class="share-article">
                            <ul>
                              <li>
                                <a href="#" class="twitter-icon disabled">
                                  <i class="fa fa-twitter  mr-1" />
                                  <span>غرد</span>
                                </a>
                              </li>

                              <li>
                                <a href="#" class="facebook-icon disabled">
                                  <i class="fa fa-facebook mr-1" />
                                  <span>Share</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div v-if="item.type !== 'video'" class="img-article">
                        <img :src="item.image" alt="">
                        <article v-html="item.body" />
                      </div>
                      <iframe
                        v-if="item.type == 'video'"
                        :src="`https://www.youtube.com/embed/${videoID}`"
                        width="560"
                        height="315"
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        style="display:block;margin:30px auto;"
                      />
                      <div v-if="item.type == 'gallery'" class="mt-3">
                        <div
                          v-for="image in album"
                          :key="image.id"
                          class="gallery-item mt-3"
                          style="background: #eee"
                        >
                          <p>{{ image.caption }}</p>
                          <img :src="image.path" width="100%" alt="">
                        </div>
                      </div>

                      <div class="tags-area">
                        <h4>
                          <i class="fa fa-clone text-primary mt-2" /> الاقسام
                        </h4>
                        <ul class="">
                          <li
                            v-for="category in item.categories"
                            :key="category.id"
                          >
                            <a
                              v-text="category.title"
                              href="#"
                              class="disabled"
                            />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4><i class="fa fa-tags text-primary" /> الوسوم</h4>
                        <ul class="">
                          <li v-for="tag in item.tags" :key="tag.id">
                            <a v-text="tag.name" href="#" class="disabled" />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4><i class="fa fa-users text-primary" /> المحررين</h4>
                        <ul class="">
                          <li v-for="editor in item.editors" :key="editor.id">
                            <a v-text="editor.name" href="#" class="disabled" />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4>
                          <i class="fa fa-sitemap text-primary" /> المصادر
                        </h4>
                        <ul class="">
                          <li v-for="source in item.sources" :key="source.id">
                            <a
                              v-text="source.title"
                              href="#"
                              class="disabled"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </section>
        </device>
        <device v-bind="tablet" v-if="device === 'tablet'">
          <section class="main-frame">
            <div class="container p-0">
              <main>
                <div class="row">
                  <div class="col-md-12 pl-0">
                    <div class="article-area">
                      <h1 class="title-art mobile-title">
                        {{ item.title }}
                      </h1>
                      <div class="row">
                        <div class="col-md-6">
                          <p class="time">
                            <i class="fa fa-clock-o mr-1 mb-1" />
                            <span>{{ item.published_at || "معلقة" }}</span>
                          </p>
                        </div>
                        <div class="col-md-6">
                          <div class="share-article">
                            <ul>
                              <li>
                                <a href="#" class="twitter-icon disabled">
                                  <i class="fa fa-twitter  mr-1" />
                                  <span>غرد</span>
                                </a>
                              </li>

                              <li>
                                <a href="#" class="facebook-icon disabled">
                                  <i class="fa fa-facebook mr-1" />
                                  <span>Share</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="item.type !== 'video'"
                        class="mobile-img-article"
                      >
                        <img :src="item.image" alt="">
                      </div>
                      <div
                        v-if="item.type !== 'video'"
                        class="mobile-article-area"
                      >
                        <article v-html="item.body" />
                      </div>
                      <iframe
                        v-if="item.type == 'video'"
                        :src="`https://www.youtube.com/embed/${videoID}`"
                        width="560"
                        height="315"
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        style="display:block;margin:30px auto;width:100%"
                      />
                      <div v-if="item.type == 'gallery'" class="mt-3">
                        <div
                          v-for="image in album"
                          :key="image.id"
                          class="gallery-item mt-3"
                          style="background: #eee"
                        >
                          <p>{{ image.caption }}</p>
                          <img :src="image.path" width="100%" alt="">
                        </div>
                      </div>
                      <div class="tags-area">
                        <h4>الاقسام</h4>
                        <ul class="">
                          <li
                            v-for="category in item.categories"
                            :key="category.id"
                          >
                            <a
                              v-text="category.title"
                              href="#"
                              class="disabled"
                            />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4>الوسوم</h4>
                        <ul class="">
                          <li v-for="tag in item.tags" :key="tag.id">
                            <a v-text="tag.name" href="#" class="disabled" />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4>المحررين</h4>
                        <ul class="">
                          <li v-for="editor in item.editors" :key="editor.id">
                            <a v-text="editor.name" href="#" class="disabled" />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4>المصادر</h4>
                        <ul class="">
                          <li v-for="source in item.sources" :key="source.id">
                            <a
                              v-text="source.title"
                              href="#"
                              class="disabled"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </section>
        </device>
        <device v-bind="mobile" v-if="device === 'mobile'">
          <section class="main-frame">
            <div class="container p-0">
              <main>
                <div class="row">
                  <div class="col-md-12 pl-0">
                    <div class="article-area">
                      <h1 class="title-art mobile-title">
                        {{ item.title }}
                      </h1>
                      <div class="row">
                        <div class="col-md-6">
                          <p class="time">
                            <i class="fa fa-clock-o mr-1 mb-1" />
                            <span>{{ item.published_at || "معلقة" }}</span>
                          </p>
                        </div>
                        <div class="col-md-6">
                          <div class="share-article">
                            <ul>
                              <li>
                                <a href="#" class="twitter-icon disabled">
                                  <i class="fa fa-twitter  mr-1" />
                                  <span>غرد</span>
                                </a>
                              </li>

                              <li>
                                <a href="#" class="facebook-icon disabled">
                                  <i class="fa fa-facebook mr-1" />
                                  <span>Share</span>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="item.type !== 'video'"
                        class="mobile-img-article"
                      >
                        <img :src="item.image" width="100%" alt="">
                      </div>
                      <div
                        v-if="item.type !== 'video'"
                        class="mobile-article-area"
                      >
                        <article v-html="item.body" />
                      </div>
                      <iframe
                        v-if="item.type == 'video'"
                        :src="`https://www.youtube.com/embed/${videoID}`"
                        width="560"
                        height="315"
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        style="display:block;margin:30px auto;width:100%"
                      />
                      <div v-if="item.type == 'gallery'" class="mt-3">
                        <div
                          v-for="image in album"
                          :key="image.id"
                          class="gallery-item mt-3"
                          style="background: #eee"
                        >
                          <p>{{ image.caption }}</p>
                          <img :src="image.path" width="100%" alt="">
                        </div>
                      </div>
                      <div class="tags-area">
                        <h4>الاقسام</h4>
                        <ul class="">
                          <li
                            v-for="category in item.categories"
                            :key="category.id"
                          >
                            <a
                              v-text="category.title"
                              href="#"
                              class="disabled"
                            />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4>الوسوم</h4>
                        <ul class="">
                          <li v-for="tag in item.tags" :key="tag.id">
                            <a v-text="tag.name" href="#" class="disabled" />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4>المحررين</h4>
                        <ul class="">
                          <li v-for="editor in item.editors" :key="editor.id">
                            <a v-text="editor.name" href="#" class="disabled" />
                          </li>
                        </ul>
                      </div>

                      <div class="tags-area">
                        <h4>المصادر</h4>
                        <ul class="">
                          <li v-for="source in item.sources" :key="source.id">
                            <a
                              v-text="source.title"
                              href="#"
                              class="disabled"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </section>
        </device>
        <div class="col-12 text-center mt-4">
          <div
            v-permission:any="'update item|update any item'"
            class="push-notifications__top--send ml-1"
          >
            <nuxt-link
              :to="{ name: 'items-id-edit', params: { id: item.id } }"
              tag="button"
              class="btn btn-lg"
            >
              <i class="fa fa-pencil" />
              <span>تعديل</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
export default {
  layout: 'main',
  data () {
    return {
      videoID: '',
      device: 'browser',
      mobile: {
        type: 'iphone',
        scale: 20,
        width: null,
        height: null
      },
      tablet: {
        type: 'ipad',
        scale: 11,
        width: null,
        height: null
      },
      desktop: {
        type: 'browser',
        scale: 13,
        width: null,
        height: null,
        skins: ['black', 'inverted']
      }
    };
  },
  async asyncData ({ $axios, error, params }) {
    try {
      const response = await $axios.$get(`/cp/items/${params.id}`);

      return {
        item: response.data,
        album: response.data.gallery_media
      };
    } catch (e) {
      error({ statusCode: e.response.status });
    }
  },
  mounted () {
    if (this.item.type === 'video') {
      this.getVideoID();
    }

    this.parseEmbeds();
  },
  methods: {
    parseEmbeds () {
      document.querySelectorAll('oembed[url]').forEach((element) => {
        // Create the <a href="..." class="embedly-card"></a> element that Embedly uses
        // to discover the media.
        const anchor = document.createElement('a');
        anchor.setAttribute('href', element.getAttribute('url'));
        anchor.className = 'embedly-card';
        element.appendChild(anchor);
      });
    },
    getVideoID () {
      if (this.item.type === 'video') {
        const url = this.item.video_media
          ? this.item.video_media.path
          : 'https://www.youtube.com/watch?v=sBtirhQcno8';
        const videoid = url.match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        );
        if (videoid != null) {
          this.videoID = videoid[1];
        } else {
          console.log('The youtube url is not valid.');
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "~/assets/sass/read-views/article.scss";

input[type="radio"].mobile,
input[type="radio"].tablet,
input[type="radio"].desktop {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  cursor: pointer;
}

input[type="radio"].mobile ~ label:before {
  font-family: FontAwesome;
  display: inline-block;
  content: "\f10b";
  letter-spacing: 10px;
  font-size: 1.2em;
  color: #535353;
  width: 1.4em;
  position: relative;
  top: 7px;
  font-size: 28px;
  margin-left: 3px;
  opacity: 0.7;
}

input[type="radio"].tablet ~ label:before {
  font-family: FontAwesome;
  display: inline-block;
  content: "\f10a";
  letter-spacing: 10px;
  font-size: 1.2em;
  color: #535353;
  width: 1.4em;
  position: relative;
  top: 7px;
  font-size: 28px;
  margin-left: 3px;
  opacity: 0.7;
}

input[type="radio"].desktop ~ label:before {
  font-family: FontAwesome;
  display: inline-block;
  content: "\f108";
  letter-spacing: 10px;
  font-size: 1.2em;
  color: #535353;
  width: 1.4em;
  position: relative;
  top: 7px;
  font-size: 28px;
  margin-left: 9px;
  opacity: 0.7;
}

.devices-list .device-label {
  cursor: pointer;
}

input[type="radio"].with-font:checked ~ label:before,
input[type="checkbox"].with-font:checked ~ label:before {
  color: #428bca;
  opacity: 1;
}

input[type="radio"].with-font:focus
  ~ label:before
  input[type="radio"].with-font:focus
  ~ label {
  color: #428bca;
  opacity: 1;
}
</style>
