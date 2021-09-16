import {generateFiles, getWorkspaceLayout, names, offsetFromRoot, Tree} from "@nrwl/devkit";
import {NormalizedSchema} from "@nrwl/react/src/generators/application/schema";
import {libraryGenerator as workspaceLibraryGenerator} from "@nrwl/workspace/src/generators/library/library";
import path from "path";
import {ElementorNormalizedSchema} from "../generator";


export async function generateReduxFiles(host:Tree, options: ElementorNormalizedSchema) {

  const libRoot = `${getWorkspaceLayout(host).libsDir}/store/src/lib`;

  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(libRoot),
    template: '',
    dot: '.'
  };

  await workspaceLibraryGenerator(host, {
    ...options,
    ...names(`store`), name: 'store'
  })

  generateFiles(
    host,
    path.join(__dirname, '../libs/store'),
    libRoot,
    templateOptions,
  );


}
