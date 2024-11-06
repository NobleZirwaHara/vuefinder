<template>
  <ModalLayout>
    <div>
      <ModalHeader :icon="UploadSVG" :title="t('Upload Files')"></ModalHeader>
      <div class="vuefinder__upload-modal__content">
        <div>
          <select v-model="selectedDocumentType" name="document_type" class="vuefinder__upload-modal__document-type-select" style="width:100%; padding:6px; margin-bottom: 10px; border-radius: 4px; border-width: 2px; border-style: dashed; border-color: #e5e7eb;">
            <option value="">{{ t('Select Document Type') }}</option>
            <option v-for="docType in documentTypes" :key="docType.id" :value="docType.id">
              {{ docType.label }}
            </option>
          </select>
        </div>

        <!-- Upload area (hidden by default) -->
        <div :class="{'hidden': !selectedDocumentType}">
          <div class="vuefinder__upload-modal__drop-area" ref="dropArea" @click="openFileSelector">
            <div class="pointer-events-none" v-if="hasFilesInDropArea">
              {{ t('Release to drop these files.') }}
            </div>
            <div class="pointer-events-none" v-else>
              {{ t('Drag and drop the files/folders to here or click here.') }}
            </div>
          </div>
          
          <div ref="container" class="vuefinder__upload-modal__buttons">
            <button ref="pickFiles" type="button" class="vf-btn vf-btn-secondary">
              {{ t('Select Files') }}
            </button>
            <button ref="pickFolders" type="button" class="vf-btn hidden vf-btn-secondary">
              {{ t('Select Folders') }}
            </button>
            <button type="button" class="vf-btn vf-btn-secondary hidden" :disabled="uploading" @click="clear(false)">
              {{ t('Clear all') }}
            </button>
            <button type="button" class="vf-btn vf-btn-secondary hidden" :disabled="uploading" @click="clear(true)">
              {{ t('Clear only successful') }}
            </button>
          </div>
        </div>

        <!-- Message when no document type selected -->
        <div :class="{'hidden': selectedDocumentType}" class="text-center p-4 text-gray-500">
          {{ t('Please select a document type to begin uploading') }}
        </div>

        <div class="vuefinder__upload-modal__file-list vf-scrollbar">
          <div class="vuefinder__upload-modal__file-entry" :key="entry.id" v-for="entry in queue">
            <span class="vuefinder__upload-modal__file-icon" :class="getClassNameForEntry(entry)">
              <span class="vuefinder__upload-modal__file-icon-text" v-text="getIconForEntry(entry)"></span>
            </span>
            <div class="vuefinder__upload-modal__file-info">
              <div class="vuefinder__upload-modal__file-name hidden md:block">{{ title_shorten(entry.name, 40) }} ({{ entry.size }})</div>
              <div class="vuefinder__upload-modal__file-name md:hidden">{{ title_shorten(entry.name, 16) }} ({{ entry.size }})</div>
              <div class="vuefinder__upload-modal__file-status" :class="getClassNameForEntry(entry)">
                {{ entry.statusName }}
                <b class="ml-auto" v-if="entry.status === definitions.QUEUE_ENTRY_STATUS.UPLOADING">{{ entry.percent }}</b>
              </div>
            </div>
            <button type="button" class="vuefinder__upload-modal__file-remove" :class="uploading ? 'disabled' : ''" :title="t('Delete')" :disabled="uploading" @click="remove(entry)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="vuefinder__upload-modal__file-remove-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div class="py-2" v-if="!queue.length">{{ t('No files selected!') }}</div>
        </div>
        <message v-if="message.length" @hidden="message=''" error>{{ message }}</message>
      </div>
    </div>
    <input ref="internalFileInput" type="file" multiple class="hidden">
    <input ref="internalFolderInput" type="file" multiple webkitdirectory class="hidden">

    <template v-slot:buttons>
      <button type="button" class="vf-btn vf-btn-primary" :disabled="uploading || !selectedDocumentType" @click.prevent="upload">
        {{ t('Upload') }}
      </button>
      <button type="button" class="vf-btn vf-btn-secondary" v-if="uploading" @click.prevent="cancel">{{ t('Cancel') }}</button>
      <button type="button" class="vf-btn vf-btn-secondary" v-else @click.prevent="close">{{ t('Close') }}</button>
    </template>
  </ModalLayout>
</template>

<script setup>
import Uppy from '@uppy/core';
import XHR from '@uppy/xhr-upload';
import ModalLayout from './ModalLayout.vue';
import { inject, onBeforeUnmount, onMounted, ref, computed } from 'vue';
import Message from '../Message.vue';
import { parse } from '../../utils/filesize.js';
import title_shorten from "../../utils/title_shorten.js";
import ModalHeader from "./ModalHeader.vue";
import UploadSVG from "../icons/upload.svg";
import { watch } from 'vue';

let generatedFileName = "Default";

// Add this function after the existing imports in ModalUpload.vue
// const sendFileMetadata = async (fileData) => {
//   try {
//     const username = 'noblecoder';  // Consider moving credentials to environment variables
//     const password = 'Admin100%';
//     const credentials = btoa(`${username}:${password}`);
//     alert(fileData.name);
//     const metadata = {
//       filename: fileData.name,
//       document_type: selectedDocumentType.value,
//       path: app.fs.data.dirname,
//       // Add any other metadata you want to send
//     };

//     const response = await fetch('http://pmra.test/api/documents/file-metadata', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Basic ${credentials}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(metadata)
//     });

//     if (!response.ok) {
//       throw new Error(response.error);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error sending file metadata:', error);
//     message.value = t('Warning: File uploaded but metadata update failed.');
//   }
// };

const app = inject('ServiceContainer');
const {t} = app.i18n;

// New file naming configuration
const fileNamingConfig = ref({
  prefix: '', // Optional prefix for all files
  suffix: '', // Optional suffix for all files
  dateFormat: 'YYYY-MM-DD', // Date format for timestamp
  includeTimestamp: true, // Whether to include timestamp
  customFormatter: null, // Optional custom formatting function
});

// Function to format file name according to configuration
const formatFileName = (originalName) => {
  const timestamp = fileNamingConfig.value.includeTimestamp 
    ? new Date().toISOString().split('T')[0] + '_'
    : '';
  
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  
  if (fileNamingConfig.value.customFormatter) {
    return fileNamingConfig.value.customFormatter(originalName);
  }
  
  return `${generatedFileName}${fileNamingConfig.value.suffix}${extension}`;
};

const uppyLocale = t("uppy");

const QUEUE_ENTRY_STATUS = {
  PENDING: 0,
  CANCELED: 1,
  UPLOADING: 2,
  ERROR: 3,
  DONE: 10,
}
const definitions = ref({ QUEUE_ENTRY_STATUS })

const container = ref(null);
const internalFileInput = ref(null);
const internalFolderInput = ref(null);
const pickFiles = ref(null);
const pickFolders = ref(null);
const dropArea = ref(null);
const queue = ref([]);
const message = ref('');
const uploading = ref(false);
const hasFilesInDropArea = ref(false);
const documentTypes = ref([]);
const selectedDocumentType = ref('');

let uppy;

// Modified addFile function to use the new naming system
function addFile(file, providedName = null) {
  const originalName = providedName || file.webkitRelativePath || file.name;
  const formattedName = formatFileName(originalName);
  
  uppy.addFile({
    name: formattedName,
    type: file.type,
    data: file,
    source: 'Local',
  });
}

// Rest of the functions remain the same, but now use the centralized naming system
async function fetchDocumentTypes() {
  try {
    const username = 'noblecoder';
    const password = 'Admin100%';
    const credentials = btoa(`${username}:${password}`);

    const response = await fetch('http://pmra.test/api/document-types', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${credentials}`
        }
    });

    const data = await response.json();
    documentTypes.value = data.results;
} catch (error) {
    console.error('Error fetching document types:', error);
    message.value = t('Error fetching document types. Please try again.');
  }
}

// Add this after the selectedDocumentType declaration
watch(selectedDocumentType, async (newValue) => {
  if (newValue) {
    await generateDocumentName();
  }
});

async function generateDocumentName() {
  try {
    const username = 'noblecoder';
    const password = 'Admin100%';
    const credentials = btoa(`${username}:${password}`);

    const response = await fetch(`http://pmra.test/api/generate-document-name?document_type=${selectedDocumentType.value}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${credentials}`
        }
    });

    const data = await response.json();
    generatedFileName = data.filename;
} catch (error) {
    console.error('Error generating document name:', error);
    message.value = t('Error generating document name. Please try again.');
  }
}

function findQueueEntryIndexById(id) {
  return queue.value.findIndex((item) => item.id === id);
}

function getClassNameForEntry(entry) {
  switch (entry.status) {
    case QUEUE_ENTRY_STATUS.DONE:
      return 'text-green-600'
    case QUEUE_ENTRY_STATUS.ERROR:
      return 'text-red-600';
    case QUEUE_ENTRY_STATUS.CANCELED:
      return 'text-red-600';
    case QUEUE_ENTRY_STATUS.PENDING:
    default:
      return '';
  }
}

const getIconForEntry = (entry) => {
  switch (entry.status) {
    case QUEUE_ENTRY_STATUS.DONE:
      return '✓'
    case QUEUE_ENTRY_STATUS.ERROR:
    case QUEUE_ENTRY_STATUS.CANCELED:
      return '!';
    case QUEUE_ENTRY_STATUS.PENDING:
    default:
      return '...';
  }
}

function openFileSelector() {
  pickFiles.value.click();
}

function upload() {
  if (uploading.value || !selectedDocumentType.value) {
    return;
  }
  if (!queue.value.filter(entry => entry.status !== QUEUE_ENTRY_STATUS.DONE).length) {
    message.value = t('Please select file to upload first.');
    return;
  }
  message.value = '';
  uppy.retryAll();
  uppy.upload();
}

function cancel() {
  uppy.cancelAll({ reason: 'user' });
  queue.value.forEach(entry => {
    if (entry.status !== QUEUE_ENTRY_STATUS.DONE) {
      entry.status = QUEUE_ENTRY_STATUS.CANCELED;
      entry.statusName = t('Canceled');
    }
  });
  uploading.value = false;
}

function remove(file) {
  if (uploading.value) {
    return;
  }
  uppy.removeFile(file.id, 'removed-by-user');
  queue.value.splice(findQueueEntryIndexById(file.id), 1);
}

function clear(onlySuccessful) {
  if (uploading.value) {
    return;
  }
  uppy.cancelAll({ reason: 'user' });
  if (onlySuccessful) {
    const retryQueue = [];
    queue.value.forEach(entry => {
      if (entry.status !== QUEUE_ENTRY_STATUS.DONE) {
        retryQueue.push(entry);
      }
    });
    queue.value = [];
    retryQueue.forEach(entry => {
      addFile(entry.originalFile, entry.name);
    });
    return;
  }
  queue.value.splice(0);
}

function close() {
  app.modal.close();
}

function buildReqParams() {
  return app.requester.transformRequestParams({
    url: '',
    method: 'post',
    params: { 
      q: 'upload', 
      adapter: app.fs.adapter, 
      path: app.fs.data.dirname,
      document_type: selectedDocumentType.value 
    },
  });
}

onMounted(async () => {
  await fetchDocumentTypes();

  uppy = new Uppy({
    debug: app.debug,
    restrictions: {
      maxFileSize: parse(app.maxFileSize),
    },
    locale: uppyLocale,
    onBeforeFileAdded(file, files) {
      const duplicated = files[file.id] != null;
      if (duplicated) {
        const i = findQueueEntryIndexById(file.id);
        if (queue.value[i].status === QUEUE_ENTRY_STATUS.PENDING) {
          message.value = uppy.i18n('noDuplicates', { fileName: file.name });
        }
        queue.value = queue.value.filter(entry => entry.id !== file.id);
      }
      
      queue.value.push({
        id: file.id,
        name: file.name,
        size: app.filesize(file.size),
        status: QUEUE_ENTRY_STATUS.PENDING,
        statusName: t('Pending upload'),
        percent: null,
        originalFile: file.data,
      });
      return true;
    }
  });

  uppy.use(XHR, {
    endpoint: 'WILL_BE_REPLACED_BEFORE_UPLOAD',
    limit: 5,
    timeout: 0,
    getResponseError(responseText, _response) {
      let message;
      try {
        const body = JSON.parse(responseText);
        message = body.message;
      } catch (e) {
        message = t('Cannot parse server response.');
      }
      return new Error(message);
    },
  });

  // Set up event listeners
  const setupEventListeners = () => {
    uppy.on('restriction-failed', (upFile, error) => {
      const entry = queue.value[findQueueEntryIndexById(upFile.id)];
      remove(entry)
      message.value = error.message;
    });

    uppy.on('upload', () => {
      const reqParams = buildReqParams();
      uppy.setMeta({ ...reqParams.body });
      const xhrPlugin = uppy.getPlugin('XHRUpload');
      xhrPlugin.opts.method = reqParams.method;
      xhrPlugin.opts.endpoint = reqParams.url + '?' + new URLSearchParams(reqParams.params);
      xhrPlugin.opts.headers = reqParams.headers;
      delete reqParams.headers['Content-Type'];
      uploading.value = true;
      queue.value.forEach(file => {
        if (file.status === QUEUE_ENTRY_STATUS.DONE) {
          return;
        }
        file.percent = null;
        file.status = QUEUE_ENTRY_STATUS.UPLOADING;
        file.statusName = t('Pending upload');
      });
    });

    uppy.on('upload-progress', (upFile, progress) => {
      const p = Math.floor(progress.bytesUploaded / progress.bytesTotal * 100);
      queue.value[findQueueEntryIndexById(upFile.id)].percent = `${p}%`;
    });

    uppy.on('upload-success', (upFile) => {
      const entry = queue.value[findQueueEntryIndexById(upFile.id)];
      entry.status = QUEUE_ENTRY_STATUS.DONE;
      entry.statusName = t('Done');

      // Send metadata after successful upload
      // sendFileMetadata({
      //   name: upFile.name,
      //   // You can add more file properties here if needed
      // });
    });
  uppy.on('upload-error', (upFile, error) => {
      const entry = queue.value[findQueueEntryIndexById(upFile.id)];
      entry.percent = null;
      entry.status = QUEUE_ENTRY_STATUS.ERROR;
      if (error.isNetworkError) {
        entry.statusName = t(`Network Error, Unable establish connection to the server or interrupted.`);
      } else {
        entry.statusName = error ? error.message : t('Unknown Error');
      }
    });

    uppy.on('error', (error) => {
      message.value = error.message;
      uploading.value = false;
      app.emitter.emit('vf-fetch', {
        params: { q: 'index', adapter: app.fs.adapter, path: app.fs.data.dirname },
        noCloseModal: true,
      });
    });

    uppy.on('complete', () => {
      uploading.value = false;
      app.emitter.emit('vf-fetch', {
        params: { q: 'index', adapter: app.fs.adapter, path: app.fs.data.dirname, document_type: selectedDocumentType },
        noCloseModal: true,
      });
    });
  };

  setupEventListeners();

  // File input handlers
  pickFiles.value.addEventListener('click', () => {
    internalFileInput.value.click();
  });

  pickFolders.value.addEventListener('click', () => {
    internalFolderInput.value.click();
  });

  // Drag and drop handlers
  dropArea.value.addEventListener('dragover', ev => {
    ev.preventDefault();
    hasFilesInDropArea.value = true;
  });

  dropArea.value.addEventListener('dragleave', ev => {
    ev.preventDefault();
    hasFilesInDropArea.value = false;
  });

  function scanFiles(resultCallback, item) {
    if (item.isFile) {
      item.file(f => resultCallback(item, f));
    }
    if (item.isDirectory) {
      item.createReader().readEntries((entries) => {
        entries.forEach((entry) => {
          scanFiles(resultCallback, entry);
        });
      });
    }
  }

  dropArea.value.addEventListener('drop', ev => {
    ev.preventDefault();
    hasFilesInDropArea.value = false;
    const trimFileName = /^[/\\](.+)/;
    [...ev.dataTransfer.items].forEach(item => {
      if (item.kind === "file") {
        scanFiles((entry, file) => {
          const matched = trimFileName.exec(entry.fullPath);
          if (matched) {
            addFile(file, matched[1]);
          }
        }, item.webkitGetAsEntry());
      }
    });
  });

  // File input change handler
  const onFileInputChange = ({ target }) => {
    const files = target.files;
    for (const file of files) {
      addFile(file);
    }
    target.value = '';
  };

  internalFileInput.value.addEventListener('change', onFileInputChange);
  internalFolderInput.value.addEventListener('change', onFileInputChange);
});

onBeforeUnmount(() => {
  uppy?.close({ reason: 'unmount' });
});

// Export methods to allow external configuration of file naming
const configureFileNaming = (config) => {
  fileNamingConfig.value = {
    ...fileNamingConfig.value,
    ...config
  };
};

// Example usage of custom formatter:
// configureFileNaming({
//   customFormatter: (originalName) => {
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     return `custom_${timestamp}_${originalName}`;
//   }
// });

defineExpose({
  configureFileNaming
});
</script>