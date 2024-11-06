<template>
    <div class="alert-icon-wrapper inline-block">  <!-- Changed from relative -->
      <!-- Clickable circle with exclamation mark -->
      <button
        @click="isOpen = true"
        class="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Show alert message"
      >
        !
      </button>
  
      <!-- Modal/Dialog -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
            <!-- Backdrop -->
            <div 
              class="fixed inset-0 bg-black bg-opacity-25" 
              @click="isOpen = false"
            ></div>
  
            <!-- Dialog -->
            <div 
              class="relative bg-white rounded-lg p-4 max-w-md w-full mx-4 shadow-xl"
              role="dialog"
              aria-modal="true"
            >
              <div class="flex flex-col gap-4">
                <h3 class="text-lg font-medium">Alert Message</h3>
                <p class="text-sm text-gray-500">
                  This is your alert message. You can customize this text to show any important information.
                </p>
                <button 
                  @click="isOpen = false"
                  class="self-end px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isOpen = ref(false);
  </script>
  
  <style scoped>
  .alert-icon-wrapper {
  display: block;  /* Ensure it's always visible */
}
  .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
  </style>