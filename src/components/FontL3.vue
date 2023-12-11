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
* @file FontL3.vue
*
-->

<template>

  <div v-if="manifests && selectedManifest" class="flex w-full bg-white rounded-lg px-6 py-2">

    <div class="w-1/4 py-6">
      <a @click="selectedManifest = manifest" v-for="manifest in sortedManifests" :key="manifest" href="#" class="block mb-6 text-xs" :class="[selectedManifest?.label === manifest.label ? 'text-sky-600' : 'text-gray-400']">
        <div class="bg-gray-100 border border-gray-300 p-1 w-24 h-24">
          <p class="" v-html="manifest.thumbnailSvg"></p>
        </div>
        {{ manifest.label }}
      </a>
    </div>

    <div class="w-1/2 mt-7 px-6">
      <div class="bg-gray-100 border border-gray-300 p-4">
        <p v-html="selectedManifest?.thumbnailSvg"></p>
      </div>
    </div>

    <div class="w-1/4 overflow-auto mt-6 h-[600px]">
      <FontL2 
        :key="selectedManifest.label"
        :active-manifest="selectedManifest"
        :active-manifest-thumbnail="selectedManifest?.thumbnailSvg"
      />
    </div>

  </div>

</template>

<script>
  
  import _ from 'lodash'
  import FontL2 from './FontL2.vue'

  /* These are the icons used for the 'info' icon on the image itself and the four social 
  media icons used on the popover panel */
  import behance from '../assets/svg/behance.vue'
  import twitter from '../assets/svg/x.vue'
  import instagram from '../assets/svg/instagram.vue'
  import facebook from '../assets/svg/facebook.vue'
  import github from '../assets/svg/github.vue'

  export default {
    
    name: 'FontL3',

    components: {
      FontL2, behance, twitter, instagram, facebook, github
    },

    /* The props are level and url. Level is used to determine which template to display. Url is the
    url of the font to be parsed. */
    props: {
      activeManifest: {
        type: Object
      },
      manifests: {
        type: Object
      },
      activeManifestThumbnail: {
        type: String,
        required: false
      }
    },

    data() {
      return {
        selectedManifest: null
      }
    },

    computed: {

      sortedManifestLabels() {
        return Object.keys(this.manifests).sort((a, b) => {
          return new Date(this.manifests[b].signatureInfo.time).getTime() - new Date(this.manifests[a].signatureInfo.time).getTime()
        })
      },

      sortedManifests() {
        return this.sortedManifestLabels.map((label) => {
          return { label: label, ...this.manifests[label] }
        })
      }

    },

    async mounted() {
      this.selectedManifest = this.activeManifest
    },

    methods: {
      
      /* Used to title case the font assertion labels */
      startCase(text) {
        return _.startCase(text)
      },

      /* Used in the template in Social Accounts. */
      getIcon(icon) {
        const result = ['behance', 'twitter', 'facebook', 'instagram', 'github']
          .filter(sm => icon.toLowerCase().includes(sm))
        return result.length === 1  ? result[0] : ''
      }
    }

  }

</script>