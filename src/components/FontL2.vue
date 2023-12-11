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
* @file FontL2.vue
*
-->

<template>

  <div class="bg-white max-w-[400px] p-4 rounded-lg text-gray-400">

    <div class="flex items-center mb-4">
      <cr class="w-8 h-8 text-black" />
      <span class="text-xl ml-2 font-bold text-black">Content Credentials</span>
    </div>

    <!-- Signed By Section -->
    <div v-if="activeManifest" class="pb-5 border-b mb-5">
      <div class="flex">
        <div class="flex flex-col">
          <p class="text-sm text-gray-500">Issued by {{ activeManifest?.signatureInfo?.issuer }}</p>
          <p class="text-sm">on {{ signatureDate() }}</p>
        </div>
      </div>
    </div>

    <!-- Content Credential Section -->
    <div v-if="activeManifest" class="py-5 -mt-5">
      <div class="flex items-center">
        <div class="flex items-center justify-center w-20 h-20 bg-gray-200 p-1 mr-2">
          <p class="text-gray-600 w-20" v-html="activeManifestThumbnail"></p>
        </div>
        <div class="flex flex-col">
          <span class="text-sm">{{ activeManifest.title }}</span>
        </div>
      </div>  
    </div>


    <!-- Produced By Section -->
    <div v-if="activeManifest" class="py-5 border-t">
      <h3 class="text-sm text-gray-600 uppercase font-bold mb-2">Produced by</h3>
      <p class="text-sm text-gray-500">{{ selectProducer(this.activeManifest)?.name }}</p>
    </div>

  
    <!-- Font Assertion -->
    <div v-if="activeManifest && fontAssertion?.data" class="py-5 border-t">
      <h3 class="text-sm text-gray-600 uppercase font-bold mb-2">Font Info</h3>
      <ul v-if="fontAssertion">
        <li v-for="key in Object.keys(fontAssertion?.data)" class="flex justify-between mb-2">
          <div class="flex flex-col">
            <p class="text-sm text-gray-500 -mb-1">{{ startCase(key) }}</p>
            <p class="text-sm text-wrap">{{ fontAssertion.data[key] }}</p>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- AI Training & Data Mining Section -->
    <div v-if="activeManifest" class="py-5 border-t">
      <h3 class="text-sm text-gray-600 uppercase font-bold mb-2">AI Training & Data Mining</h3>
      <Allowed title="Generative AI" :allowed="aiGenerativeTrainingAllowed" />
      <Allowed title="AI Inference" :allowed="aiInferenceAllowed" />
      <Allowed title="AI Training" :allowed="aiTrainingAllowed" />
      <Allowed title="Data Mining" :allowed="dataMiningAllowed" />
    </div>

    <!-- Social Media Section -->
    <div v-if="activeManifest" class="py-5 border-t">
      <h3 class="text-sm text-gray-600 uppercase font-bold mb-2">Social Media</h3>
      <ul>
        <li v-for="socialAccount in socialAccounts" :key="socialAccount['href']" class="flex mb-3">
          <component :is="getIcon(socialAccount['@id'])" class="w-5 h-5 mr-3" />
          <a :href="socialAccount['@id']" target="_blank" class="text-sm text-blue-500 underline hover:bg-white">@{{socialAccount.name}}</a>
        </li>
      </ul>
    </div>

    <!-- Produced With Section -->
    <div v-if="activeManifest" class="py-5 border-t">
      <h3 class="text-sm text-gray-600 uppercase font-bold mb-2">Produced With</h3>
      <p class="text-sm text-gray-500">{{ activeManifest.claimGenerator.split('/')[0].replaceAll('_', ' ') }}</p>
    </div>

    <!-- Edits Section -->
    <div v-if="activeManifest" class="py-5 border-t">
      <h3 class="text-sm text-gray-600 uppercase font-bold mb-2">Edits and Activity</h3>
      <ul>
        <li v-for="edit in editsAndActivity" :key="edit" class="flex flex-col mb-3">
          <div class="flex">
            <img class="text-gray-600 w-8 mr-4" :src="edit.icon" />
            <div class="flex flex-col">
              <p class="text-sm text-gray-500 -mb-1">{{ edit.label }}</p>
              <p class="text-sm">{{ edit.description }}</p>
            </div>
          </div>  
        </li>
      </ul>
    </div>

    <!-- Thumbnail Section -->
    <div v-if="activeManifest" class="py-5 border-t">
      <h3 class="text-sm text-gray-600 uppercase font-bold mb-2">Thumbnail</h3>
      <p class="w-64 h-64 bg-gray-100 p-2" v-html="activeManifestThumbnail"></p>
    </div>

  </div>

</template>

<script>
  
  import { selectProducer, selectEditsAndActivity, selectSocialAccounts } from 'c2pa'
  import { format, parseISO } from 'date-fns'
  import _ from 'lodash'

  /* These are the icons used for the 'info' icon on the image itself and the four social 
  media icons used on the popover panel */
  import cr from '../assets/svg/cr.vue'
  import behance from '../assets/svg/behance.vue'
  import twitter from '../assets/svg/x.vue'
  import instagram from '../assets/svg/instagram.vue'
  import facebook from '../assets/svg/facebook.vue'
  import github from '../assets/svg/github.vue'
  import Allowed from './Allowed.vue'

  export default {
    
    name: 'FontL2',

    components: {
      Allowed, behance, twitter, instagram, facebook, github, cr
    },

    /* The props are level and url. Level is used to determine which template to display. Url is the
    url of the font to be parsed. */
    props: {
      activeManifest: {
        type: Object
      },
      activeManifestThumbnail: {
        type: String,
        required: false
      }
    },

    data() {
      return {
        selectProducer,
        editsAndActivity: [],
      }
    },

    computed: {
      
      socialAccounts() {
        return selectSocialAccounts(this.activeManifest).map(social => {
          const icon = ['behance', 'twitter', 'facebook', 'instagram', 'github']
            .filter(sm => social['@id']
              .toLowerCase()
              .includes(sm))
          return { ...social, icon: icon.length === 1  ? icon[0] : '' }
        })
      },

      /* Font assertion data for use in the template */
      fontAssertion() {
        const [fontAssertion] = this.activeManifest?.assertions.get('c2pa.font.info')
        return fontAssertion
      },

      /* Used by the AI computeds */
      trainingAssertion() {
        const [c2paTrainingAssertion] = this.activeManifest?.assertions.get('c2pa.training-mining')
        return c2paTrainingAssertion
      },

      /* Used in the template in AI Training & Data Mining. */
      aiGenerativeTrainingAllowed() {
        return this.trainingAssertion?.data?.entries['c2pa.ai_generative_training'].use === 'allowed'
      },

      /* Used in the template in AI Training & Data Mining. */
      aiInferenceAllowed() {
        return this.trainingAssertion?.data?.entries['c2pa.ai_inference'].use === 'allowed'
      },

      /* Used in the template in AI Training & Data Mining. */
      aiTrainingAllowed() {
        return this.trainingAssertion?.data?.entries['c2pa.ai_training'].use === 'allowed'
      },

      /* Used in the template in AI Training & Data Mining. */
      dataMiningAllowed() {
        return this.trainingAssertion?.data?.entries['c2pa.data_mining'].use === 'allowed'
      }

    },

    async mounted() {
      console.log(this.activeManifest)
      this.editsAndActivity = this.activeManifest && await selectEditsAndActivity(this.activeManifest)
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
      },

      signatureDate() {
       return this.activeManifest?.signatureInfo?.time
        ? format(parseISO(this.activeManifest.signatureInfo.time), 'PPpp')
        : 'No date available'
      }

    }

  }

</script>