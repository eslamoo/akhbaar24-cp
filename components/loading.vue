<template>
  <div v-if="loading" class="loading-page">
    <div class="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
    <p>يرجى الإنتظار</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true;
    },
    finish () {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 200px;
    font-size: 30px;
    font-family: sans-serif;
    z-index: 9999999999;
}
.loading-page p{
    font-size: 18px;
    font-family: Tajawal;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  margin: 0 auto;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid #2d639d;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #2d639d transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
