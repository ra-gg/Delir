import { EffectPreRenderContext, EffectRenderContext, ParamType, PostEffectBase, Type } from '@delirvfx/core'

interface Params {
  value: ParamType.Float
}

export default class TheWorldPostEffect extends PostEffectBase {
  /**
   * Provide usable parameters
   */
  public static provideParameters() {
    return Type.float('value', { label: 'Value', defaultValue: () => 0, animatable: true })
  }

  /**
   * Called when before rendering start.
   *
   * If you want initializing before rendering (likes load audio, image, etc...)
   * Do it in this method.
   */
  public async initialize(context: EffectPreRenderContext<Params>) {}

  /**
   * Render frame into destination canvas.
   * @param context
   */
  public async render(context: EffectRenderContext<Params>) {}
}
