import PluginBase from './plugin-base'

export type PluginTypes = 'post-effect'

export interface PackageJSONDelirSection {
    type: PluginTypes
    name: string
    // acceptFileTypes?: {[extension: string]: string}
}

export interface DelirPluginPackageJson {
    name: string
    version: string
    author: string | string[]
    main?: string
    engines: {
        'delir-core': string
    },
    delir: PackageJSONDelirSection
}

// type of before load PluginEntry
export interface PluginEntryFragment {
    id: string
    package: DelirPluginPackageJson
    pluginInfo: PackageJSONDelirSection
    packageRoot: string
    entryPath: string
    class?: typeof PluginBase
    // parameters?: TypeDescriptor
}

export interface PluginEntry {
    id: string
    name: string
    type: PluginTypes
    packageJson: DelirPluginPackageJson
    pluginInfo: PackageJSONDelirSection
    packageRoot: string
    entryPath: string
    class: typeof PluginBase
    // parameters: TypeDescriptor
}

export interface PluginSummary {
    id: string
    name: string
    type: PluginTypes
    path: string
    package: DelirPluginPackageJson
}