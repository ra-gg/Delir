import { proxyDeepFreeze } from '../../helper/proxyFreeze'
import { ParameterValueTypes } from '../../PluginSupport/type-descriptor'
import RenderContext from '../RenderContext'
import { ExpressionContext } from './ExpressionVM'

export interface ReferenceableEffectsParams {
    readonly [referenceName: string]: {
        readonly [paramName: string]: ParameterValueTypes
    }
}

export interface ContextSource {
    context: RenderContext
    clipParams: {[propName: string]: ParameterValueTypes }
    clipEffectParams: ReferenceableEffectsParams
    currentValue: any
}

export const buildContext = (contextSource: ContextSource): ExpressionContext => {
    const clipParamProxy = proxyDeepFreeze(contextSource.clipParams)

    return {
        time                : contextSource.context.time,
        frame               : contextSource.context.frame,
        timeOnComposition   : contextSource.context.timeOnComposition,
        frameOnComposition  : contextSource.context.frameOnComposition,
        width               : contextSource.context.width,
        height              : contextSource.context.height,
        audioBuffer         : contextSource.context.destAudioBuffer,
        duration            : contextSource.context.durationFrames / contextSource.context.framerate,
        durationFrames      : contextSource.context.durationFrames,
        clipProp            : clipParamProxy,
        currentValue        : contextSource.currentValue,
        effect              : (referenceName: string) => {
            const targetEffect = contextSource.clipEffectParams[referenceName]
            if (!targetEffect) throw new Error(`Referenced effect ${referenceName} not found`)
            return { params: proxyDeepFreeze(targetEffect) }
        },
    }
}

export const expressionContextTypeDefinition = `
interface EffectAttributes {
    params: { [paramName: string]: any }
}

declare const ctx: {
    time: number
    frame: number
    timeOnComposition: number
    frameOnComposition: number
    width: number
    height: number
    audioBuffer: Float32Array[]
    duration: number
    durationFrames: number
    clipProp: {[propertyName: string]: any}
    currentValue: any
    effect(effectName: string): EffectAttributes
}

declare const time: number;
declare const time: number;
declare const frame: number;
declare const timeOnComposition: number;
declare const frameOnComposition: number;
declare const width: number;
declare const height: number;
declare const audioBuffer: Float32Array[];
declare const duration: number;
declare const durationFrames: number;
declare const clipProp: {[propertyName: string]: any};
declare const currentValue: any;
`
