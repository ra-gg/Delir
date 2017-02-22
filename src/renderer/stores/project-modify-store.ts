import * as _ from 'lodash'
import {ReduceStore} from 'flux/utils'
import * as uuid from 'uuid'

import * as Delir from 'delir-core'
import {ProjectHelper} from 'delir-core'

import dispatcher from '../dispatcher'
import Record from '../utils/Record'
import {KnownPayload} from '../actions/PayloadTypes'
import {DispatchTypes as EditorStateDispatchTypes} from '../actions/editor-state-actions'
import {DispatchTypes as ProjectModifyDispatchTypes} from '../actions/project-modify-actions'

type StateRecord = Record<ProjectModifyState>
export interface ProjectModifyState {
    project: Delir.Project.Project|null,
    lastChangeTime: number,
}

class ProjectModifyStore extends ReduceStore<StateRecord, KnownPayload>
{
    getInitialState(): StateRecord
    {
        return new Record({
            project: null,
            lastChangeTime: 0,
        })
    }

    areEqual(a: StateRecord, b: StateRecord): boolean
    {
        const equal = a.equals(b)
        __DEV__ && !equal && console.log('📷 Project updated')
        return equal
    }

    reduce(state: StateRecord, payload: KnownPayload)
    {
        const project: Delir.Project.Project = state.get('project')!
        if (payload.type !== EditorStateDispatchTypes.SetActiveProject && project == null) return state

        switch (payload.type) {
            case EditorStateDispatchTypes.SetActiveProject:
                return state.set('project', payload.entity.project)

            case EditorStateDispatchTypes.ClearActiveProject:
                return state.set('project', null)

            case ProjectModifyDispatchTypes.CreateComposition:
                const newTimelane = new Delir.Project.Timelane()
                ProjectHelper.addComposition(project!, payload.entity.composition)
                ProjectHelper.addTimelane(project!, payload.entity.composition, newTimelane)
                break

            case ProjectModifyDispatchTypes.CreateTimelane:
                ProjectHelper.addTimelane(project!, payload.entity.targetCompositionId, payload.entity.timelane)
                break

            case ProjectModifyDispatchTypes.CreateLayer:
                ProjectHelper.addLayer(project!, payload.entity.targetTimelaneId, payload.entity.props as any)
                break

            case ProjectModifyDispatchTypes.AddLayer:
                const {targetTimelane, newLayer} = payload.entity
                ProjectHelper.addLayer(project, targetTimelane, newLayer)
                break

            case ProjectModifyDispatchTypes.AddTimelane:
                ProjectHelper.addTimelane(project!, payload.entity.targetComposition, payload.entity.timelane)
                break

            case ProjectModifyDispatchTypes.AddTimelaneWithAsset:
                (() => {
                    const {targetComposition, layer, asset: registeredAsset, pluginRegistry} = payload.entity
                    const propName = ProjectHelper.findAssetAttachablePropertyByMimeType(layer, registeredAsset.mimeType, pluginRegistry)

                    if (propName == null) return
                    layer.config.rendererOptions[propName] = registeredAsset

                    const timelane = new Delir.Project.Timelane
                    ProjectHelper.addTimelane(project, targetComposition, timelane)
                    ProjectHelper.addLayer(project, timelane, layer)
                })()
                break

            case ProjectModifyDispatchTypes.AddAsset:
                ProjectHelper.addAsset(project!, payload.entity.asset)
                break

            case ProjectModifyDispatchTypes.MoveLayerToTimelane:
                const targetLayer = ProjectHelper.findLayerById(project!, payload.entity.layerId)
                const sourceLane = ProjectHelper.findParentTimelaneByLayerId(project!, payload.entity.layerId)
                const destLane = ProjectHelper.findTimelaneById(project!, payload.entity.targetTimelaneId)

                if (targetLayer == null || sourceLane == null || destLane == null) break

                sourceLane.layers.delete(targetLayer)
                destLane.layers.add(targetLayer)
                break

            case ProjectModifyDispatchTypes.ModifyComposition:
                ProjectHelper.modifyComposition(project!, payload.entity.targetCompositionId, payload.entity.patch)
                break

            case ProjectModifyDispatchTypes.ModifyLayer:
                ProjectHelper.modifyLayer(project!, payload.entity.targetLayerId, payload.entity.patch)
                break

            case ProjectModifyDispatchTypes.RemoveTimelane:
                ProjectHelper.deleteTimelane(project!, payload.entity.targetLayerId)
                break

            case ProjectModifyDispatchTypes.RemoveLayer:
                ProjectHelper.deleteLayer(project!, payload.entity.targetLayerId)
                break

            default:
                return state
        }

        // Projectの変更は検知できないし、構造が大きくなる可能性があるので今のところImmutableにもしたくない
        return state.set('lastChangeTime', Date.now())
    }
}

const store = new ProjectModifyStore(dispatcher)
_.set(window, 'app.store.ProjectModifyStore', store)
export default store
