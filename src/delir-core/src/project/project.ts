import {ProjectScheme} from './scheme/project'

import {BSON} from 'bson'

import Asset from './asset'
import Composition from './composition'

export default class Project
{
    static deserialize(projectBson: Buffer)
    {
        const projectJson: ProjectScheme = (new BSON()).deserialize(projectBson) as ProjectScheme

        const project = new Project()
        const assets = projectJson.assets.map(assetJson => Asset.deserialize(assetJson))
        const compositions = projectJson.compositions.map(compJson => Composition.deserialize(compJson, project))

        project.assets = new Set(assets)
        project.compositions = new Set(compositions)

        return project
    }

    assets: Set<Asset> = new Set

    compositions: Set<Composition> = new Set

    // _commandHistory: []

    // static deserialize(deserializedBson: Object)
    // {
    //
    // }
    //
    // static deserialize(): Document {
    //     const bson = new BSONPure.BSON()
    //     return new Document()
    // }

    toPreBSON()
    {
        return {
            formatVersion: 'v0.0.0',
            assets: Array.from(this.assets.values()).map(asset => asset.toPreBSON()),
            compositions: Array.from(this.compositions.values()).map(comp => comp.toPreBSON()),
        }
    }

    toJSON()
    {
        return {
            formatVersion: '0.0.0',
            assets: Array.from(this.assets.values()).map(asset => asset.toJSON()),
            compositions: Array.from(this.compositions.values()).map(comp => comp.toJSON()),
        }
    }

    serialize()
    {
        return (new BSONPure.BSON()).serialize(this.toPreBSON())
    }
}
