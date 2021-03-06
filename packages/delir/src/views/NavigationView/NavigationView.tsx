import { useFleurContext, useStore } from '@fleur/react'
import { remote } from 'electron'
import path from 'path'
import React, { useEffect } from 'react'

import { useModalMounter } from 'components/ModalOwner/ModalOwner'
import { Pane } from 'components/Pane'
import EditorStore from 'domain/Editor/EditorStore'
import * as PreferenceOps from 'domain/Preference/operations'
import PreferenceStore from 'domain/Preference/PreferenceStore'
import { getAudioVolume } from 'domain/Preference/selectors'
import * as RendererOps from 'domain/Renderer/operations'
import RendererStore from 'domain/Renderer/RendererStore'
import { RenderingOption, RenderingSettingModal } from 'modals/RenderingSettingModal/RenderingSettingModal'
import t from './NavigationView.i18n'
import s from './NavigationView.sass'

export const NavigationView = () => {
  const context = useFleurContext()
  const { mountModal } = useModalMounter()

  const {
    audioVolume,
    previewPlaying,
    editor: { activeComp, project, projectPath },
  } = useStore(getStore => ({
    editor: getStore(EditorStore).getState(),
    previewPlaying: getStore(RendererStore).previewPlaying,
    audioVolume: getAudioVolume(getStore),
  }))

  const projectName = project ? (projectPath ? path.parse(projectPath).name : 'New Project') + ' - Delir' : 'Delir'

  useEffect(() => {
    document.title = projectName
  }, [projectName])

  const onClickPlay = React.useCallback(() => {
    if (!activeComp) return

    context.executeOperation(RendererOps.startPreview, {
      compositionId: activeComp.id!,
    })
  }, [activeComp])

  const onClickPause = React.useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    context.executeOperation(RendererOps.stopPreview)
  }, [])

  const onClickDest = React.useCallback(async () => {
    if (!activeComp) return

    const result = await mountModal<RenderingOption | false>(resolve => <RenderingSettingModal onClose={resolve} />)
    if (!result) return

    context.executeOperation(RendererOps.renderDestinate, {
      compositionId: activeComp.id!,
      destPath: result.destination,
      encodingOption: result.encodingOption,
    })
  }, [activeComp, mountModal])

  const handleChangeVolume = React.useCallback(({ currentTarget }: React.ChangeEvent<HTMLInputElement>) => {
    context.executeOperation(PreferenceOps.setAudioVolume, currentTarget.valueAsNumber)
  }, [])

  const titleBarDoubleClicked = React.useCallback(() => {
    const browserWindow = remote.getCurrentWindow()
    browserWindow.isMaximized() ? browserWindow.unmaximize() : browserWindow.maximize()
  }, [])

  return (
    <Pane className={s.navigationView} resizable={false}>
      <ul className={s.titleBar} onDoubleClick={titleBarDoubleClicked}>
        {projectName}
      </ul>
      <ul className={s.navigationList}>
        {previewPlaying ? (
          <li className={s.icon} onClick={onClickPause} title={t(t.k.preview)}>
            <i className="fa fa-pause" />
          </li>
        ) : (
          <li className={s.icon} onClick={onClickPlay} title={t(t.k.preview)}>
            <i className="fa fa-play" />
          </li>
        )}
        <li onClick={onClickDest}>
          <i className="fa fa-film" title={t(t.k.rendering)} />
        </li>
        <li className={s.volume}>
          <i className="fa fa-volume-up" />
          <input type="range" onChange={handleChangeVolume} value={audioVolume} min={0} max={100} />
        </li>
      </ul>
    </Pane>
  )
}
