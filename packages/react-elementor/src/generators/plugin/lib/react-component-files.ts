import {generateFiles, getWorkspaceLayout, names, offsetFromRoot, Tree} from "@nrwl/devkit";
import {ElementorNormalizedSchema} from "../generator";
import {componentGenerator, libraryGenerator} from "@nrwl/react";
import {Linter} from "@nrwl/linter";
import path from "path";

const ROOT_UI_LIB = 'ui'

export async function reactComponentFiles(host: Tree, options: ElementorNormalizedSchema){
  const libRoot = `${getWorkspaceLayout(host).libsDir}/ui/src/lib`;
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(libRoot),
    template: '',
    dot: '.'
  };

  console.log(offsetFromRoot(libRoot))

  await libraryGenerator(host,
    {
      linter: Linter.EsLint,
      skipFormat: false,
      skipTsConfig: false,
      style: 'none',
      unitTestRunner: 'jest',
      ...names(ROOT_UI_LIB),
      name: ROOT_UI_LIB
    } )

  await componentGenerator(host, {
    style: 'none',
    ...names(`${options.name}-title`),
    name: `${options.name}-title`,
    project: ROOT_UI_LIB,
    export: true
  })

  await componentGenerator(host, {
    style: 'none',
    ...names(`${options.name}-input`),
    name: `${options.name}-input`,
    project: ROOT_UI_LIB,
    export: true
  })

  await componentGenerator(host, {
    style: 'none',
    ...names(`web-component-wrapper`),
    name: `web-component-wrapper`,
    project: ROOT_UI_LIB,
    export: true
  })

  await generateFiles(
    host,
    path.join(__dirname, '../libs/ui'),
    libRoot,
    templateOptions,
  );
}
