import { BuildExecutorSchema } from './schema';
import _  from 'sync-directory'
import {ExecutorContext} from "@nrwl/tao/src/shared/workspace";


export default async function runExecutor(options: BuildExecutorSchema, context: ExecutorContext) {

    _(`${context.root}/apps/${options.plugin}`,`${context.root}/dist/elementor/${options.plugin}`, {
    exclude: ['src']
  })
   _(`${context.root}/dist/apps/${options.plugin}`,`${context.root}/dist/elementor/${options.plugin}/dist`, {
    exclude: []
  })

  return {
    success: true,
  };
}

