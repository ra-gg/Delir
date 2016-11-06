import {remote} from 'electron'

import dispatcher from '../dispatcher'
import ActionTypes from '../action-types'

export default {
    //
    // App services
    //
    previewProgressed(currentFrame: number)
    {
        dispatcher.dispatch({
            type: 'preview-progressed',
            payload: {currentFrame}
        })
    },

    //
    //
    //

    //
    // Editor Store
    //
    setActiveProject(project: Delir.Project)
    {
        dispatcher.dispatch({
            type: ActionTypes.SET_ACTIVE_PROJECT,
            payload: {project},
        })
    },

    //
    // Change active element
    //
    changeActiveComposition(compositionId: string)
    {
        dispatcher.dispatch({
            type: ActionTypes.CHANGE_ACTIVE_COMPOSITION,
            payload: {compositionId},
        })
    },

    changeActiveLayer(layerId: string)
    {
        dispatcher.dispatch({
            type: ActionTypes.CHANGE_ACTIVE_LAYER,
            payload: {layerId},
        })
    },


    //
    // Preview
    //
    togglePreview(compositionId)
    {
        dispatcher.dispatch({
            type: ActionTypes.TOGGLE_PREVIEW,
            payload: {compositionId},
        })
    },

    renderDestinate(compositionId)
    {
        dispatcher.dispatch({
            type: ActionTypes.RENDER_DESTINATE,
            payload: {compositionId},
        })
    },

    updateProcessingState(stateText)
    {
        dispatcher.dispatch({
            type: ActionTypes.UPDATE_PROCESSING_STATE,
            payload: {stateText},
        })
    },
}
