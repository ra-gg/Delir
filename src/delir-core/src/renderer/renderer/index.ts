import {IRendererStatic} from './renderer-base'

import * as _ from 'lodash'
import UnknownPluginReferenceException from '../../exceptions/unknown-plugin-reference-exception'

import VideoRenderer from './video-renderer'
import ImageRenderer from './image-renderer'
import TextRenderer from './text-renderer'
import AudioRenderer from './audio-renderer'

export type AvailableRenderer = 'audio' | 'image' | 'video' | 'text'

export const RENDERERS: {[name: string]: IRendererStatic} = {
    audio: AudioRenderer,
    video: VideoRenderer,
    image: ImageRenderer,
    text: TextRenderer,
}

const RENDERER_SUMMARY = _.mapValues(RENDERERS, renderer => {
    const assetAssignMap  = renderer.provideAssetAssignMap()
    const handlableFileTypes = Object.keys(assetAssignMap)

    return {
        id: renderer.rendererId,
        handlableFileTypes,
        assetAssignMap,
        parameter: renderer.provideParameters()
    }
})

export function getInfo(renderer: AvailableRenderer) {
    const summary = RENDERER_SUMMARY[renderer]

    if (!summary) {
        throw new UnknownPluginReferenceException(`Missing renderer specified(${renderer}`)
    }

    return summary
}

export function create(renderer: AvailableRenderer) {
    const Renderer = RENDERERS[renderer]

    if (!Renderer) {
        throw new UnknownPluginReferenceException(`Missing renderer creating (${renderer}`)
    }

    return new Renderer()
}