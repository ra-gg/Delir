import * as Delir from '@ragg/delir-core'
import * as fs from 'fs'
import Module = require('module')
import * as path from 'path'
import * as vm from 'vm'

export default class PluginScriptLoader {
    public static load(path: string) {
        const loader = new PluginScriptLoader()
        return loader.loadScript(path)
    }

    private module: Module

    private loadScript(fullPath: string): any {
        const dirname = path.parse(fullPath).dir
        const script = fs.readFileSync(fullPath).toString()

        return this.executeScript(script, fullPath, dirname)
    }

    private executeScript(script: string, filename: string, dirname: string) {
        const require = this.makeRequire(filename)
        const mod = this.makeModule(filename)
        const scriptRunner = vm.runInNewContext(Module.wrap(script))
        scriptRunner(mod.exports, require, mod, filename, dirname)
        return mod.exports
    }

    private makeModule(filename: string) {
        this.module = new Module(filename)
        return this.module
    }

    private makeRequire(fullpath: string) {
        const requireFunc: any = (request: string) => {
            if (request === 'delir-core' || request === '@ragg/delir-core') {
                return Delir
            }

            return this.module.require(request)
        }

        return requireFunc
    }
}
require.extensions