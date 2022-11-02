import {generateFiles, getWorkspaceLayout, names, offsetFromRoot, Tree} from "@nrwl/devkit";
import {ElementorNormalizedSchema} from "../generator";
import {componentGenerator, libraryGenerator, storybookConfigurationGenerator} from "@nrwl/react";
import {Linter} from "@nrwl/linter";
import * as path from 'path';

const ROOT_UI_LIB = 'ui'

export async function reactComponentFiles(host: Tree, options: ElementorNormalizedSchema){
  const libRoot = `${getWorkspaceLayout(host).libsDir}/ui/src`;
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(libRoot),
    template: '',
    dot: '.'
  };


  await libraryGenerator(host,
    {
      linter: Linter.EsLint,
      skipFormat: false,
      skipTsConfig: false,
      style: 'none',
      unitTestRunner: 'none',
      ...names(ROOT_UI_LIB),
      name: ROOT_UI_LIB
    } )

  await storybookConfigurationGenerator(host,{
    name: ROOT_UI_LIB,
    configureCypress: false,
    generateStories: false,
    generateCypressSpecs: false,
    js: false,
    tsConfiguration: false,
    configureTestRunner: false
  })

  await componentGenerator(host, {
    style: 'none',
    ...names(`${options.name}-title`),
    name: `${options.name}-title`,
    project: ROOT_UI_LIB,
    export: true,
    skipTests:true
  })

  await componentGenerator(host, {
    style: 'none',
    ...names(`${options.name}-input`),
    name: `${options.name}-input`,
    project: ROOT_UI_LIB,
    export: true,
    skipTests:true
  })

  await componentGenerator(host, {
    style: 'none',
    ...names(`web-component-wrapper`),
    name: `web-component-wrapper`,
    project: ROOT_UI_LIB,
    export: true,
    skipTests:true
  })

  await generateFiles(
    host,
    path.join(__dirname, '../libs/ui'),
    libRoot,
    templateOptions,
  );
}
