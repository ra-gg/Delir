import * as _ from 'lodash'
import * as semver from 'semver'

import EffectPluginBase from './PostEffectBase'
import { AnyParameterTypeDescriptor } from './type-descriptor'
import { PluginEntry, PluginSummary } from './types'

import PluginAssertionFailedException from '../exceptions/plugin-assertion-failed-exception'
import PluginLoadFailException from '../exceptions/plugin-load-fail-exception'
import UnknownPluginReferenceException from '../exceptions/unknown-plugin-reference-exception'

import * as DelirCorePackageJson from '../../package.json'

export const validatePluginPackageJSON = () => true

export default class PluginRegistry {
    private _plugins: {
        'post-effect': {[packageName: string]: Readonly<PluginEntry>}
    } = {
        'post-effect': {}
    }

    public registerPlugin(entries: PluginEntry[])
    {
        for (const entry of entries) {
            // if (this._plugins[entry.id] != null) {
            //     throw new PluginLoadFailException(`Duplicate plugin id ${entry.id}`)
            // }

            // const result = validatePluginPackageJSON(entry.packageJson)

            // if (!result.valid) {
            //     throw new PluginLoadFailException(`Invalid package.json for \`${entry.id}\` (${result.errors[0]}${result.errors[1] ? '. and more...' : ''})`)
            // }

            if (!semver.satisfies(DelirCorePackageJson.version, entry.packageJson.engines['delir-core'])) {
                throw new PluginLoadFailException(`Plugin \`${entry.id}\` not compatible to current delir-core version`)
            }

            // entry.pluginInfo.acceptFileTypes = entry.pluginInfo.acceptFileTypes || {}
            this._plugins[entry.type][entry.id] = Object.freeze(_.cloneDeep(entry))
        }
    }

    /**
     * get plugin constructor class
     * @param   {string}    target plugin ID
     * @throws UnknownPluginReferenceException
     */
    public requirePostEffectPluginById(id: string): typeof EffectPluginBase
    {
        if (! this._plugins['post-effect'][id]) {
            throw new UnknownPluginReferenceException(`Plugin '${id}' doesn't loaded`)
        }

        return this._plugins['post-effect'][id].class as any
    }

    /**
     * get specified plugin's provided parameter list
     * @param   {string}    target plugin ID
     * @throws UnknownPluginReferenceException
     * @throws PluginAssertionFailedException
     */
    public getPostEffectParametersById(id: string): AnyParameterTypeDescriptor[] | null
    {
        const entry = this._plugins['post-effect'][id]

        if (!entry) {
            throw new UnknownPluginReferenceException(`Plugin ${id} doesn't loaded`)
        }

        if (entry.class.prototype instanceof EffectPluginBase) {
            return (entry.class as any as typeof EffectPluginBase).provideParameters().properties
        }

        throw new PluginAssertionFailedException(`plugin ${id} can't provide parameters`)
    }

    /**
     * get plugin entry
     * @param   {string}    id      target plugin ID
     * @throws UnknownPluginReferenceException
     */
    public getPlugin(id: string): Readonly<PluginEntry>
    {
        if (this._plugins['post-effect'][id] == null) {
            throw new UnknownPluginReferenceException(`plugin ${id} doesn't loaded`)
        }

        return this._plugins['post-effect'][id]
    }

    /**
     * get registered plugins as array
     */
    public getPostEffectPlugins(): PluginSummary[]
    {
        return _.map(this._plugins['post-effect'], (entry, id) => {
            return {
                id: entry.id,
                type: entry.packageJson.delir.type,
                package: _.cloneDeep(entry.packageJson),
            }
        })
    }
}
