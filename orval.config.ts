import { defineConfig } from 'orval'

export default defineConfig({
  openApi: {
    input: './openapi/openapi.yml',

    output: {
      target: './src/shared/api/client/api.ts',
      mode: 'split',
      override: {
        mutator: {
          path: './src/shared/api/client/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
