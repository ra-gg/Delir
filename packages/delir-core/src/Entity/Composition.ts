import * as uuid from 'uuid'
import ColorRGB from '../values/color-rgb'

export default class Composition {
    public id: string
    public name: string
    public width: number
    public height: number
    public framerate: number
    public durationFrames: number
    public samplingRate: number
    public audioChannels: number
    public backgroundColor: ColorRGB

    constructor() {
        this.id = uuid.v4()
    }
}