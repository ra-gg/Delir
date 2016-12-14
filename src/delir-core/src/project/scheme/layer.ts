import {KeyframeScheme} from './keyframe'

export interface LayerConfigScheme  {
    renderer: string|null,
    rendererOptions: Object|null,
    placedFrame: number|null,
    durationFrames: number|null,
    keyframeInterpolationMethod: string,
}

export interface LayerScheme {
    config: LayerConfigScheme
    keyframes: {[keyName:string]: KeyframeScheme}
}
