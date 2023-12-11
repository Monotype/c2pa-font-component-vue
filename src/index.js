/*
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
* @file index.js
*
*/

import './main.css'
import FontContentCredentials from "./components/FontContentCredentials.vue";
import { createC2pa } from 'c2pa';
import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?url';
import workerSrc from 'c2pa/dist/c2pa.worker.js?url';

export default {
  install: (app) => {
    app.component("FontContentCredentials", FontContentCredentials);
    app.provide("c2paPromise", createC2pa({
      wasmSrc,
      workerSrc,
    }));
  }
};