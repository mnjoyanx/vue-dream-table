<template>
     <div>
    <transition name="fade">
      <div class="more_modal-main" v-if="isVisible" @click="isVisible = false">
        <div class="more_modal-content" @click.stop>
         <div class="container-main">
            show more modal
         </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
    export default {
        name: "ShowMore",

        data() {
            return {
                isVisible: false
            }
        },
    
        methods: {
            show() {
                this.isVisible = true
            },

            hide() {
                this.isVisible = false
            }
        }
    }
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.more_modal-main {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999 !important;
}

.more_modal-content {
  width: 500px;
  height: auto;
  background-color: white;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -10%);
}

.container-main {
  padding: 20px;
}
</style>