// @flow
import * as uuid from 'uuid'
import * as _ from 'lodash'

import Project from '../project/project'
import Asset from '../project/asset'
import Composition from '../project/composition'
import Layer from '../project/layer'
import Clip from '../project/clip'
import Effect from '../project/effect'
import Keyframe from '../project/keyframe'

import PluginRegistory from '../plugin/plugin-registry'

function setFreezedProp(obj: Object, name: string, value: any)
{
    Object.defineProperty(obj, name, {value, writable: false})
}

function _generateAndReserveSymbolId(project: Project): string
{
    let id

    do {
        id = uuid.v4()
    } while (project.symbolIds.has(id))

    project.symbolIds.add(id)
    return id
}

//
// Create
//
export function createAddAsset(
    project: Project,
    assetProps: Object = {}
) {
    const entityId = _generateAndReserveSymbolId(project)
    const asset = new Asset()

    setFreezedProp(asset, 'id', entityId)
    Object.assign(asset, assetProps)
    project.assets.add(asset)

    return asset
}

export function createAddComposition(
    project: Project,
    compositionProps: Object = {}
): Composition
{
    const entityId = _generateAndReserveSymbolId(project)
    const composition = new Composition()

    setFreezedProp(composition, 'id', entityId)
    Object.assign(composition, compositionProps)
    project.compositions.add(composition)

    return composition
}

export function createAddLayer(
    project: Project,
    targetCompositionId: Composition|string,
    layerProps: Object
    // TODO: position specify option
): Layer
{
    const entityId = _generateAndReserveSymbolId(project)
    const layer = new Layer()

    setFreezedProp(layer, 'id', entityId)
    Object.assign(layer, layerProps)
    addLayer(project, targetCompositionId, layer);

    return layer
}

export function createAddClip(
    project: Project,
    targetLayerId: Layer|string,
    clipProps: Object
): Clip
{
    const entityId = _generateAndReserveSymbolId(project)
    const clip = new Clip

    setFreezedProp(clip, 'id', entityId)
    Object.assign(clip, clipProps)

    // TODO: Not found behaviour
    const layer = targetLayerId instanceof Layer
        ? targetLayerId
        : findLayerById(project, targetLayerId)!

    layer.clips.add(clip)

    return clip
}

export function createAddEffect(
  project: Project,
  targetClipId: Clip|string,
  effectProps: Object
): Effect
{
    const effect = new Effect
    Object.assign(effect, effectProps)

    addEffect(project, targetClipId, effect)
    return effect
}

export function createAddKeyframe(
    project: Project,
    targetClipId: Clip|string,
    propName: string,
    keyframeProp: Object|Array<Object>
): Array<Keyframe>
{
    let keyframeProps
    if (Array.isArray(keyframeProp)) {
        keyframeProps = keyframeProp
    } else {
        keyframeProps = [keyframeProp]
    }

    const createdKeyframes = []
    // TODO: Not found behaviour
    const clip: Clip = targetClipId instanceof Clip
        ? targetClipId
        : findClipById(project, targetClipId)!

    for (const _keyframeProp of keyframeProps) {
        const entityId = _generateAndReserveSymbolId(project)
        const keyframe = new Keyframe

        setFreezedProp(keyframe, 'id', entityId)
        Object.assign(keyframe, _keyframeProp)

        if (!clip.keyframes[propName]) {
            clip.keyframes[propName] = new Set()
        }

        clip.keyframes[propName].add(keyframe)
        createdKeyframes.push(keyframe)
    }

    return createdKeyframes
}

//
// Add
//
export function addAsset(
    project: Project,
    asset: Asset,
) {
    if (typeof asset.id !== 'string') {
        // TODO: Clone instance
        const entityId = _generateAndReserveSymbolId(project)
        setFreezedProp(asset, 'id', entityId)
    }

    project.assets.add(asset)

    return asset
}

export function addComposition(
    project: Project,
    composition: Composition
): Composition
{
    if (typeof composition.id !== 'string') {
        // TODO: Clone instance
        const entityId = _generateAndReserveSymbolId(project)
        setFreezedProp(composition, 'id', entityId)
    }

    project.compositions.add(composition)

    return composition
}

export function addLayer(
    project: Project,
    targetCompositionId: Composition|string,
    layer: Layer
    // TODO: position specify option
): Layer
{
    if (typeof layer.id !== 'string') {
        // TODO: Clone instance
        const entityId = _generateAndReserveSymbolId(project)
        setFreezedProp(layer, 'id', entityId)
    }

    // TODO: Not found behaviour
    const composition = targetCompositionId instanceof Composition
        ? targetCompositionId
        : findCompositionById(project, targetCompositionId)!

    composition.layers = _.uniqBy([layer, ...composition.layers], 'id')

    return layer
}

export function addClip(
    project: Project,
    targetLayerId: Layer|string,
    clip: Clip
): Clip
{
    if (typeof clip.id !== 'string') {
        // TODO: Clone instance
        const entityId = _generateAndReserveSymbolId(project)
        setFreezedProp(clip, 'id', entityId)
    }

    // TODO: Not found behaviour
    const layer = targetLayerId instanceof Layer
        ? targetLayerId
        : findLayerById(project, targetLayerId)!

    layer.clips.add(clip)

    return clip
}

export function addEffect(
  project: Project,
  targetClipId: Clip|string,
  effect: Effect
): Effect
{
    if (typeof effect.id !== 'string') {
        const entityId = _generateAndReserveSymbolId(project)
        setFreezedProp(effect, 'id', entityId)
    }

    const clip = targetClipId instanceof Clip
      ? targetClipId
      : findClipById(project, targetClipId)!

    clip.effects.push(effect)

    return effect
}

export function addKeyframe(
    project: Project,
    targetClipId: Clip|string,
    propName: string,
    keyframe: Keyframe|Array<Keyframe>
): Keyframe|Array<Keyframe>
{
    let keyframes
    if (Array.isArray(keyframe)) {
        keyframes = keyframe
    } else {
        keyframes = [keyframe]
    }

    // TODO: Not found behaviour
    const clip: Clip|null = targetClipId instanceof Clip
        ? targetClipId
        : findClipById(project, targetClipId)!

    for (const _keyframe of keyframes) {
        if (typeof _keyframe.id !== 'string') {
            // TODO: Clone instance
            const entityId = _generateAndReserveSymbolId(project)
            setFreezedProp(_keyframe, 'id', entityId)
        }

        if (!clip.keyframes[propName]) {
            clip.keyframes[propName] = new Set()
        }

        clip.keyframes[propName].add(_keyframe)
    }

    return keyframe
}



//
// Delete
//
export function deleteAsset(
    project: Project,
    targetAssetId: Asset|string,
) {
    const asset = targetAssetId instanceof Asset
        ? targetAssetId
        : findAssetById(project, targetAssetId)!

    project.assets.delete(asset)
}

export function deleteComposition(
    project: Project,
    targetCompositionId: Composition|string,
) {
    const composition = targetCompositionId instanceof Composition
        ? targetCompositionId
        : findCompositionById(project, targetCompositionId)!

    // TODO: Not found behaviour
    project.compositions.delete(composition)
}

export function deleteLayer(
    project: Project,
    targetLayerId: Layer|string,
) {
    const layer = targetLayerId instanceof Layer
        ? targetLayerId
        : findLayerById(project, targetLayerId)!

    // TODO: Not found behaviour
    const composition = findParentCompositionByLayerId(project, layer.id!)!
    _.remove(composition.layers, layer)
}

export function deleteClip(
    project: Project,
    targetClipId: Clip|string,
) {
    const clip = targetClipId instanceof Clip
        ? targetClipId
        : findClipById(project, targetClipId)!

    const layer = findParentLayerByClipId(project, clip.id!)!
    layer.clips.delete(clip)
}

export function deleteEffectFromClip(
    project: Project,
    parentClipId: Clip|string,
    targetEffectId: Effect|string,
) {
    const clip = parentClipId instanceof Clip
        ? parentClipId
        : findClipById(project, parentClipId)!

    const effect = targetEffectId instanceof Effect
        ? targetEffectId
        : findEffectFromClipById(clip, targetEffectId)

    _.remove(clip.effects, effect)
}

export function deleteKeyframe(
    project: Project,
    targetKeyframeId: Keyframe|string,
) {
    const keyframe = targetKeyframeId instanceof Keyframe
        ? targetKeyframeId
        : findKeyframeById(project, targetKeyframeId)!

    const {clip, propName} = findParentClipAndPropNameByKeyframeId(project, keyframe.id!)!
    if (!clip.keyframes[propName]) return
    clip.keyframes[propName].delete(keyframe) // TODO: Implement this function Or change keyframe structure
}

//
// Modify
//
export function modifyAsset(
    project: Project,
    targetAssetId: Asset|string,
    patch: Optionalized<Asset>
) {
    const asset = targetAssetId instanceof Asset
        ? targetAssetId
        : findAssetById(project, targetAssetId)

    Object.assign(asset, patch)
}

export function modifyComposition(
    project: Project,
    targetCompositionId: Composition|string,
    patch: Optionalized<Composition>
) {
    const composition = targetCompositionId instanceof Composition
        ? targetCompositionId
        : findCompositionById(project, targetCompositionId)!

    Object.assign(composition, patch)
}

export function modifyLayer(
    project: Project,
    targetLayerId: Layer|string,
    patch: Optionalized<Layer>
) {
    const layer = targetLayerId instanceof Layer
        ? targetLayerId
        : findLayerById(project, targetLayerId)!

    Object.assign(layer, patch)
}

export function modifyClip(
    project: Project,
    targetClipId: Clip|string,
    patch: Optionalized<Clip>
) {
    const clip = targetClipId instanceof Clip
        ? targetClipId
        : findClipById(project, targetClipId)!

    Object.assign(clip, patch)
}

export function modifyEffect(
    project: Project,
    parentClipId: Clip|string,
    targetEffectId: Effect|string,
    patch: Optionalized<Effect>
) {
    const clip = parentClipId instanceof Clip
        ? parentClipId
        : findClipById(project, parentClipId)!

    const effect = targetEffectId instanceof Effect
        ? targetEffectId
        : findEffectFromClipById(clip, targetEffectId)

    Object.assign(effect, patch)
}

export function modifyKeyframe(
    project: Project,
    targetKeyframeId: Keyframe|string,
    patch: Optionalized<Keyframe>,
) {
    const keyframe = targetKeyframeId instanceof Keyframe
        ? targetKeyframeId
        : findKeyframeById(project, targetKeyframeId)!

    Object.assign(keyframe, patch)
}

//
// Finders
//
export function findAssetById(project: Project, assetId: string): Asset|null
{
    let targetAsset: Asset|null = null

    compSearch:
        for (const asset of Array.from(project.assets)) {
            if (asset.id === assetId) {
                targetAsset = asset
                break compSearch
            }
        }

    return targetAsset
}

export function findCompositionById(project: Project, compositionId: string): Composition|null
{
    let targetComp: Composition|null = null

    compSearch:
        for (const comp of Array.from(project.compositions)) {
            if (comp.id === compositionId) {
                targetComp = comp
                break compSearch
            }
        }

    return targetComp
}

export function findLayerById(project: Project, layerId: string): Layer|null
{
    let targetLayer: Layer|null = null

    layerSearch:
        for (const comp of project.compositions.values()) {
            for (const layer of comp.layers) {
                if (layer.id === layerId) {
                    targetLayer = layer
                    break layerSearch
                }
            }
        }

    return targetLayer
}

export function findClipById(project: Project, clipId: string): Clip|null
{
    let targetClip: Clip|null = null

    clipSearch:
        for (const comp of project.compositions.values()) {
            for (const layer of comp.layers) {
                for (const clip of layer.clips.values()) {
                    if (clip.id === clipId) {
                        targetClip = clip
                        break clipSearch
                    }
                }
            }
        }

    return targetClip
}

export function findEffectFromClipById(clip: Clip, effectId: string): Effect|null
{
    for (const effect of clip.effects) {
        if (effect.id === effectId) {
            return effect
        }
    }

    return null
}

export function findParentCompositionByLayerId(project: Project, layerId: string): Composition|null
{
    let targetComp: Composition|null = null

    compositionSearch:
        for (const comp of project.compositions.values()) {
            for (const layer of comp.layers) {
                if (layer.id === layerId) {
                    targetComp = comp
                    break compositionSearch
                }
            }
        }

    return targetComp
}

export function findParentLayerByClipId(project: Project, clipId: string): Layer|null
{
    let targetLayer: Layer|null = null

    layerSearch:
        for (const comp of project.compositions.values()) {
            for (const layer of comp.layers) {
                for (const clip of layer.clips.values()) {
                    if (clip.id === clipId) {
                        targetLayer = layer
                        break layerSearch
                    }
                }
            }
        }

    return targetLayer
}

export function findKeyframeFromClipById(clip: Clip, keyframeId: string): Keyframe|null
{
    let targetKeyframe: Keyframe|null = null

    keyframeSearch:
        for (const propName of Object.keys(clip.keyframes)) {
            for (const keyframe of clip.keyframes[propName]) {
                if (keyframe.id === keyframeId) {
                    targetKeyframe = keyframe
                    break keyframeSearch
                }
            }
        }

    return targetKeyframe
}

export function findKeyframeById(project: Project, keyframeId: string): Keyframe|null
{
    let targetKeyframe: Keyframe|null = null

    keyframeSearch:
        for (const comp of project.compositions.values()) {
            for (const layer of comp.layers) {
                for (const clip of layer.clips.values()) {
                    for (const propName of Object.keys(clip.keyframes)) {
                        for (const keyframe of clip.keyframes[propName]) {
                            if (keyframe.id === keyframeId) {
                                targetKeyframe = keyframe
                                break keyframeSearch
                            }
                        }
                    }
                }
            }
        }

    return targetKeyframe
}

export function findParentClipAndPropNameByKeyframeId(project: Project, keyframeId: string): {clip: Clip, propName: string}|null
{
    let target: {clip: Clip, propName: string}|null = null

    keyframeSearch:
        for (const comp of project.compositions.values()) {
            for (const layer of comp.layers) {
                for (const clip of layer.clips.values()) {
                    for (const propName of Object.keys(clip.keyframes)) {
                        for (const keyframe of clip.keyframes[propName]) {
                            if (keyframe.id === keyframeId) {
                                target = {clip, propName}
                                break keyframeSearch
                            }
                        }
                    }
                }
            }
        }

    return target
}

export function findAssetAttachablePropertyByMimeType(
    clip: Clip,
    mimeType: string,
    registry: PluginRegistory
): string|null
{
    const plugin = registry.getPlugin(clip.renderer)
    return plugin.pluginInfo.acceptFileTypes[mimeType]
}