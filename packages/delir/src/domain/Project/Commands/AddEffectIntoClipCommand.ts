import * as Delir from '@delirvfx/core'
import { OperationContext } from '@fleur/fleur'

import { EditorActions } from '../../Editor/actions'
import { Command } from '../../History/HistoryStore'
import { ProjectActions } from '../actions'

export class AddEffectIntoClipCommand implements Command {
  constructor(private clipId: string, private addedEffect: Delir.Entity.Effect) {}

  public undo(context: OperationContext) {
    this.focusToParentClip(context)

    context.dispatch(ProjectActions.removeEffectFromClip, {
      holderClipId: this.clipId,
      targetEffectId: this.addedEffect.id,
    })
  }

  public redo(context: OperationContext) {
    this.focusToParentClip(context)

    context.dispatch(ProjectActions.addEffectIntoClip, {
      clipId: this.clipId,
      effect: this.addedEffect,
    })
  }

  private focusToParentClip(context: OperationContext) {
    context.dispatch(EditorActions.changeSelectClip, {
      clipIds: [this.clipId],
    })
  }
}
