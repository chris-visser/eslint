import { builtinModules } from 'node:module'
import { stringifyImports } from 'unimport'
import type { Import } from 'unimport'
import type { Nuxt } from '@nuxt/schema'
import { relative } from 'pathe'
import type { NuxtESLintConfigOptions } from '@nuxt/eslint-config/flat'
import { createResolver } from '@nuxt/kit'
import type { ESLintConfigGenAddon } from '../../types'
import type { ConfigGenOptions, ModuleOptions } from '../../module'
import { getDirs } from './utils'

const r = createResolver(import.meta.url)

export async function generateESLintConfig(options: ModuleOptions, nuxt: Nuxt, addons: ESLintConfigGenAddon[]) {
  const importLines: Import[] = []
  const configItems: string[] = []

  const configDir = nuxt.options.buildDir

  const config: ConfigGenOptions = {
    standalone: true,
    ...typeof options.config !== 'boolean' ? options.config || {} : {},
  }

  importLines.push(
    {
      from: 'eslint-typegen',
      name: 'default',
      as: 'typegen',
    },
    {
      from: '@nuxt/eslint-config/flat',
      name: 'createConfigForNuxt',
    },
    {
      from: '@nuxt/eslint-config/flat',
      name: 'defineFlatConfigs',
    },
    {
      from: '@nuxt/eslint-config/flat',
      name: 'resolveOptions',
    },
  )

  const basicOptions: NuxtESLintConfigOptions = {
    features: config,
    dirs: getDirs(nuxt),
  }

  for (const addon of addons) {
    const resolved = await addon.getConfigs()
    if (resolved?.imports)
      importLines.push(...resolved.imports)
    if (resolved?.configs)
      configItems.push(...resolved.configs)
  }

  function relativeWithDot(path: string) {
    const r = relative(configDir, path)
    return r.startsWith('.') ? r : './' + r
  }

  const imports = await Promise.all(importLines.map(async (line): Promise<Import> => {
    return {
      ...line,
      from: (line.from.match(/^\w+:/) || builtinModules.includes(line.from))
        ? line.from
        : relativeWithDot(await r.resolvePath(line.from)),
    }
  }))

  return [
    '// ESLint config generated by Nuxt',
    '/// <reference path="./eslint-typegen.d.ts" />',
    '',
    stringifyImports(imports, false),
    '',
    'export { defineFlatConfigs }',
    '',
    `export const options = resolveOptions(${JSON.stringify(basicOptions, null, 2)})`,
    '',
    `export const configs = createConfigForNuxt(options)`,

    ...(configItems.length
      ? [
          '',
          `configs.append(`,
          configItems.join(',\n\n'),
          `)`,
          '',
        ]
      : []),

    'export function withNuxt(...customs) {',
    '  return configs',
    '    .clone()',
    '    .append(...customs)',
    '    .onResolved(configs => typegen(configs, { dtsPath: new URL("./eslint-typegen.d.ts", import.meta.url), augmentFlatConfigUtils: true }))',
    '}',
    '',
    'export default withNuxt',
  ].join('\n')
}
