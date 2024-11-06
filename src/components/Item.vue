<template>
  <div
    :style="{opacity: ds.isDraggingRef.value && ds.getSelection().find((el) => $el === el) ? '0.5 !important' : ''}"
    :class="['vuefinder__item', 'vf-item-' + ds.explorerId]"
    :data-type="item.type"
    :key="item.path"
    :data-item="JSON.stringify(item)"
    :data-index="index"
    v-draggable="item"
    @dblclick="openItem(item)"
    @touchstart="delayedOpenItem($event)"
    @touchend="clearTimeOut()"
    @contextmenu.prevent="app.emitter.emit('vf-contextmenu-show', { event: $event, items: ds.getSelected(), target: item })"
  >
    <div class="vuefinder__item-content relative">
      <slot/>
      <PinSVG class="vuefinder__item--pinned" v-if="app.pinnedFolders.find(pin => pin.path === item.path)"/>
      <div 
        v-if="expiryStatus" 
        class="vuefinder__item-expiry-status"
        :class="[expiryColor, app.view === 'grid' ? 'grid-view' : 'list-view']"
      >
        {{ expiryStatus }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import ModalPreview from "./modals/ModalPreview.vue";
import ModalMove from "./modals/ModalMove.vue";
import PinSVG from "./icons/pin.svg";

// Define props first
const props = defineProps({
  item: {type: Object},
  index: {type: Number},
  dragImage: {type: Object}
});

// Then inject app
const app = inject('ServiceContainer');
const ds = app.dragSelect;

// Define reactive references
const expiryStatus = ref('');
const expiryColor = ref('');

// Define the checkFileExpiry function
const checkFileExpiry = async (item) => {
  if (!item) return;
  
  try {
    const username = 'noblecoder';
    const password = 'Admin100%';
    const credentials = btoa(`${username}:${password}`);

    const response = await fetch(`http://pmra.test/api/documents/check-expiry`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: item.basename,
        path: item.path,
        full_path: `${app.fs.adapter}://${item.path}`,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to check expiry status');
    }

    const data = await response.json();
    
    if (data.isExpiring) {
      const timePeriodDisplay = data.timeUnit;
        
      expiryStatus.value = data.timeRemaining <= 0 
        ? 'Expired'
        : `Expires in ${data.timeRemaining} ${timePeriodDisplay}`;
      
      // Color coding based on urgency and time period
      if (data.timeRemaining <= 0) {
        expiryColor.value = 'text-red-600 font-bold';
      } else if (
        (data.timeUnit === 'days' && data.timeRemaining <= 7) ||
        (data.timeUnit === 'months' && data.timeRemaining === 1) ||
        (data.timeUnit === 'years' && data.timeRemaining === 1)
      ) {
        expiryColor.value = 'text-orange-500';
      } else if (
        (data.timeUnit === 'days' && data.timeRemaining <= 30) ||
        (data.timeUnit === 'months' && data.timeRemaining <= 3) ||
        (data.timeUnit === 'years' && data.timeRemaining <= 1)
      ) {
        expiryColor.value = 'text-yellow-500';
      } else {
        expiryColor.value = 'text-blue-500'; // For longer timeframes
      }
    } else {
      expiryStatus.value = '';
      expiryColor.value = '';
    }
  } catch (error) {
    console.error('Error checking file expiry:', error);
    expiryStatus.value = '';
    expiryColor.value = '';
  }
};

// Define the existing item methods
const openItem = (item) => {
  if (item.type === 'dir') {
    app.emitter.emit('vf-search-exit');
    app.emitter.emit('vf-fetch', {params: {q: 'index', adapter: app.fs.adapter, path: item.path}});
  } else {
    app.modal.open(ModalPreview, {adapter: app.fs.adapter, item})
  }
};

const vDraggable = {
  mounted(el, binding, vnode, prevVnode) {
    if (!!vnode.props.draggable) {
      el.addEventListener('dragstart', (event) => handleDragStart(event, binding.value));
      el.addEventListener('dragover', (event) => handleDragOver(event, binding.value));
      el.addEventListener('drop', (event) => handleDropZone(event, binding.value));
    }
  },
  beforeUnmount(el, binding, vnode, prevVnode) {
    if (!!vnode.props.draggable) {
      el.removeEventListener('dragstart', handleDragStart);
      el.removeEventListener('dragover', handleDragOver);
      el.removeEventListener('drop', handleDropZone);
    }
  }
};

const handleDragStart = (e, item) => {
  if (e.altKey || e.ctrlKey || e.metaKey) {
    e.preventDefault();
    return false;
  }

  ds.isDraggingRef.value = true;
  e.dataTransfer.setDragImage(props.dragImage.$el, 0, 15);
  e.dataTransfer.effectAllowed = 'all';
  e.dataTransfer.dropEffect = 'copy';
  e.dataTransfer.setData('items', JSON.stringify(ds.getSelected()))
};

const handleDropZone = (e, item) => {
  e.preventDefault();
  ds.isDraggingRef.value = false;
  let draggedItems = JSON.parse(e.dataTransfer.getData('items'));

  if (draggedItems.find(item => item.storage !== app.fs.adapter)) {
    alert('Moving items between different storages is not supported yet.');
    return;
  }

  app.modal.open(ModalMove, {items: {from: draggedItems, to: item}})
};

const handleDragOver = (e, item) => {
  e.preventDefault();
  if (!item || item.type !== 'dir' || ds.getSelection().find(el => el === e.currentTarget)) {
    e.dataTransfer.dropEffect = 'none';
    e.dataTransfer.effectAllowed = 'none';
  } else {
    e.dataTransfer.dropEffect = 'copy';
  }
};

let touchTimeOut = null;
let doubleTapTimeOut = null;
let tappedTwice = false;

const clearTimeOut = () => {
  if (touchTimeOut) {
    clearTimeout(touchTimeOut);
  }
};

const delayedOpenItem = ($event) => {
    if(!tappedTwice) {
        tappedTwice = true; 
        doubleTapTimeOut = setTimeout(() => tappedTwice = false, 300);
    } else {
        tappedTwice = false; 
        openItem(props.item);
        clearTimeout(touchTimeOut);
        return false;
    }
  touchTimeOut = setTimeout(() => {
    const cmEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: false,
      view: window,
      button: 2,
      buttons: 0,
      clientX: $event.target.getBoundingClientRect().x,
      clientY: $event.target.getBoundingClientRect().y
    });
    $event.target.dispatchEvent(cmEvent);
  }, 500);
};

// Set up watchers
watch(() => props.item, (newItem) => {
  if (newItem) {
    checkFileExpiry(newItem);
  }
}, { immediate: true, deep: true });

watch(() => app.fs.path, () => {
  if (props.item) {
    checkFileExpiry(props.item);
  }
});

watch(() => app.fs.data, () => {
  if (props.item) {
    checkFileExpiry(props.item);
  }
}, { deep: true });

// Set up mounted hook
onMounted(() => {
  if (props.item) {
    checkFileExpiry(props.item);
  }
});
</script>

<style scoped>
.vuefinder__item-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.vuefinder__item-expiry-status {
  font-size: 0.8em;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  z-index: 1;
}

.vuefinder__item-expiry-status.grid-view {
  position: absolute;
  right: 8px;
  bottom: 8px;
}

.vuefinder__item-expiry-status.list-view {
  display: inline-block;
  margin-left: 8px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .vuefinder__item-expiry-status {
    background-color: rgba(0, 0, 0, 0.7);
  }
}
</style>