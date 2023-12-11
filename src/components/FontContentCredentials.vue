<!--
*  Copyright 2023 Monotype Imaging Inc.
* 
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*
* @file FontContentCredentials.vue
*
-->

<template>

  <FontL2 
    v-if="manifestStore?.activeManifest && level === 2"
    :active-manifest="manifestStore?.activeManifest"
    :active-manifest-thumbnail="activeManifestThumbnail"
  />

  <FontL3 
    v-else-if="manifestStore?.activeManifest && level === 3"
    :active-manifest="manifestStore?.activeManifest"
    :manifests="manifestStore?.manifests"
    :active-manifest-thumbnail="activeManifestThumbnail"
  />

</template>

<script>
  
  import FontL2 from './FontL2.vue'
  import FontL3 from './FontL3.vue'

  export default {
    
    name: 'FontContentCredentials',

    components: {
      FontL2, FontL3
    },

    inject: ['c2paPromise'],
    
    props: {
      level: {
        type: Number,
        default: 2
      },
      url: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        activeManifestThumbnail: '', // set by getActiveManifestThumbnail method
        manifestStore: null, // set by getContentCredentials method
      }
    },

    async mounted() {
      try {
        this.c2pa = await this.c2paPromise
        
        const ext = this.url.split('.')[this.url.split('.').length - 1]
        if (ext === 'ttf' || ext === 'otf' && !this.manifestStore) {
          this.getContentCredentials(this.url)
        } else {
          throw new Error('Error: The URL provided does not appear to be from a supported font file.')
        }

      } catch (error) {
        console.error('Error loading c2pa object:', error)
      }
    },

    methods: {

      async getActiveManifestThumbnail() {
        const thumbnailBlob = this.manifestStore?.activeManifest.thumbnail.blob
        const activeThumbnailSvg = await new Response(thumbnailBlob).text()
        return activeThumbnailSvg
      },

      async getContentCredentials(src) {
        try {

          const { manifestStore } = await this.c2pa.read(src)
          this.manifestStore = manifestStore

          this.activeManifestThumbnail = this.manifestStore?.activeManifest && await this.getActiveManifestThumbnail()

          Object.keys(this.manifestStore.manifests).forEach(async (key) => {
            const thumbnailBlob = this.manifestStore.manifests[key].thumbnail.blob
            this.manifestStore.manifests[key].thumbnailSvg = await new Response(thumbnailBlob).text()
          })

        } catch (error) {
          console.error('Error reading font:', error)
        }
      }
    }

  }

</script>