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
* @file Allowed.vue
*
-->

<template>
  <div class="flex justify-between text-sm text-gray-500">
    <span class="">{{ title }}:</span>
    <span v-if="allowed" class="w-28 ml-2 flex items-center font-normal underline">
      <CheckCircleIcon class="w-5 h-5 inline-block mr-1 text-green-500" />
      Allowed
    </span>
    <span v-else class="w-28 ml-2 flex items-center font-normal underline">
      <XCircleIcon class="w-5 h-5 inline-block mr-1 text-red-500" />
      Not Allowed
    </span>
  </div>
</template>

<script setup>

import {
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: String,
  allowed: Boolean
})

</script>