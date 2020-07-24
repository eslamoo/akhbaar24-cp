<template>
  <transition
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
            <iframe :src="url" frameborder="0" class="w-100 h-100" />
          </div>
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
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalIframe',
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  beforeCreate () {
    $('body').addClass('modal-iframe-open');
  },
  destroyed () {
    $('body').removeClass('modal-iframe-open');
  },
  methods: {
    close () {
      this.$emit('close');
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
</style>
