import {
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import { ElementorNormalizedSchema } from '../generator';
import {
  componentGenerator,
  libraryGenerator,
  storybookConfigurationGenerator,
} from '@nx/react';
import { Linter } from '@nx/eslint';
import * as path from 'path';

const ROOT_UI_LIB = 'ui';

export async function reactComponentFiles(
  host: Tree,
  options: ElementorNormalizedSchema,
  projectName: string
) {
  const uiLibName = `${projectName}-${ROOT_UI_LIB}`;
  const libRoot = `${getWorkspaceLayout(host).libsDir}/${uiLibName}/src`;

  const templateOptions = {
    ...options,
    ...names(options.name),
    uiLibName,
    offsetFromRoot: offsetFromRoot(libRoot),
    template: '',
    dot: '.',
  };

  console.log('libraryGenerator');
  await libraryGenerator(host, {
    linter: Linter.EsLint,
    skipFormat: false,
    skipTsConfig: false,
    style: 'none',
    unitTestRunner: 'none',
    ...names(uiLibName),
    name: uiLibName,
  });
  console.log('storybookConfigurationGenerator');

  await storybookConfigurationGenerator(host, {
    project: uiLibName,
    configureCypress: false,
    generateStories: false,
    generateCypressSpecs: false,
    js: false,
    tsConfiguration: false,
    interactionTests: false,
  });
  console.log('componentGenerator');

  await componentGenerator(host, {
    style: 'none',
    ...names(`${options.name}-title`),
    name: `${options.name}-title`,
    project: uiLibName,
    export: true,
    skipTests: true,
  });
  console.log('componentGenerator 2');

  await componentGenerator(host, {
    style: 'none',
    ...names(`${options.name}-input`),
    name: `${options.name}-input`,
    project: uiLibName,
    export: true,
    skipTests: true,
  });
  console.log('componentGenerator 3');

  await componentGenerator(host, {
    style: 'none',
    ...names(`web-component-wrapper`),
    name: `web-component-wrapper`,
    project: uiLibName,
    export: true,
    skipTests: true,
  });

  await generateFiles(
    host,
    path.join(__dirname, `../libs/ui`),
    libRoot,
    templateOptions
  );
}
