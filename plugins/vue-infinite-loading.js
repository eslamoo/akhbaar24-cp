import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';

Vue.use(InfiniteLoading, {
  slots: {
    noMore: 'لا يوجد صور اخرى'
  }
});
