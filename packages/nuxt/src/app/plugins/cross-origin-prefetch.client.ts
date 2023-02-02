import { ref } from 'vue'
import { parseURL } from 'ufo'
import { defineNuxtPlugin, useHead } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const externalURLs = ref(new Set<string>())
  function generateRules () {
    return {
      type: 'speculationrules',
      key: 'speculationrules',
      innerHTML: JSON.stringify({
        prefetch: [
          {
            source: 'list',
            urls: [...externalURLs.value]
          }
        ]
      })
    }
  }
  const head = useHead({
    script: [generateRules()]
  })
  nuxtApp.hook('link:prefetch', (url) => {
    const { protocol } = parseURL(url)
    if (protocol && ['http:', 'https:'].includes(protocol)) {
      externalURLs.value.add(url)
      head?.patch({
        script: [generateRules()]
      })
    }
  })
})
