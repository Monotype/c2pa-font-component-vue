# C2PA Font Content Credentials Plugin for Vue.js
This plugin allows you to display L2 and L3 data for C2PA enabled font assets.

## Requirements
- Vue 3
- Vite
- Rush

## How to use
The plugin uses a version of the Content Authenticity Initiative Javascript SDK that has been extended to include support for font assets. As such, before we can install the plugin, we need to build the c2pa-js Rush monorepo that includes font support.  Because this package is not publicly available yet on NPM, we also need to link it locally so we can include it as a dependency.

### Building the Font Support Version of the CAI JS SDK
So first, let's clone in the fontSupport branch of the forked c2pa-js monorepo.
```
git clone -b monotype/fontSupport git@github.com:Monotype/c2pa-js.git
```

then we'll cd into the directory
```
cd c2pa-js
```

If you don't have Rush installed on your system, you can install it by running
```
npm install -g @microsoft/rush
```

Next, we need to use Rush to install the dependencies. 
```
rush install
```

From here, we will build the packages with
```
rush build
```

Now that we have the c2pa packages for javascript built, we'll link them locally with NPM so we can include them in the plugin as a dependency in our package.json.  This step is so that we can update our packages when needed as opposed to copying distribution files.
```
cd packages/c2pa
npm link
```

### Building the C2PA Font Plugin for Vue
Now, let's cd back out of packages/c2pa directory and into where you would like to build the font plugin.
```
git clone git@github.com:Monotype/c2pa-font-component-vue.git
```

then we'll cd into the directory
```
cd c2pa-font-component-vue
```

then we need to add a local dependency for the font support JS SDK package we built and linked above.  This is similar to running `npm install <package> --save` for a published package. 
```
npm link c2pa --save
```

From here we can install and build the plugin
```
npm install
npm run build
```

Lastly, we'll link the plugin so it is available to whatever local project we want to include it with as a dependency.
```
npm link
```

### Configuring a Vue project to use the C2PA Font Plugin
First, create a new Vue project by running the following and following the CLI instructions
```
npm init vue@latest
```

If you want to include the plugin with a vue project as a local dependency, just run the following from your Vue3/Vite project's root directory.
```
npm link c2pa-font-component-vue --save
```

Open the project's main.js file and import the plugin and css. If this is a fresh install, replace the existing createApp(App).mount('#app') with
```
import FontPlugin from 'c2pa-font-component-vue'
import 'c2pa-font-component-vue/dist/style.css'

const app = createApp(App)
app.use(FontPlugin)
app.mount('#app')
```

You can now add the `<FontContentCredentials>` component to the template of any of your Vue components without having to import the FontPlugin component or the font support C2PA library.
```
<!-- Example for displaying the C2PA data of a signed font served locally from the public directory. -->
<FontContentCredentials :level="2" :url="'http://localhost:5173/signed-font.ttf'" />
```

Now run
```
npm run dev
```



