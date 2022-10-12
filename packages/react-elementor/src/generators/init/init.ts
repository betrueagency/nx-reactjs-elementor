import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  convertNxGenerator,
  readWorkspaceConfiguration, Tree,
  updateJson,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import {runTasksInSerial} from "@nrwl/workspace/src/utilities/run-tasks-in-serial";
import { reactDomVersion, reactInitGenerator, reactVersion } from '@nrwl/react';

import { InitSchema } from './schema';

function setDefault(host: Tree) {
  const workspace = readWorkspaceConfiguration(host);

  workspace.generators = workspace.generators || {};
  const reactGenerators = workspace.generators['@nrwl/react'] || {};
  const generators = {
    ...workspace.generators,
    '@nrwl/react': {
      ...reactGenerators,
      application: {
        ...reactGenerators.application,
        babel: true,

      },
    },
  };

  updateWorkspaceConfiguration(host, { ...workspace, generators });
  setDefaultCollection(host, '@betrue/react-elementor');
}
function updateDependencies(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    return json;
  });

  return addDependenciesToPackageJson(
    host,
    {
      react: reactVersion,
      'redux': '^4.2.0',
      'react-redux': '^7.2.5',
      '@reduxjs/toolkit': '^1.6.1',
      "@emotion/react": "^11.9.3",
      "@emotion/styled": "^11.9.3",
      "@mui/material": "^5.9.1",
      'react-to-webcomponent' : '^1.7.2',
      'prop-types': '15.8.1',
      'react-dom': reactDomVersion
    },
    {
      '@betrue/react-elementor': 'latest',
      'babel-plugin-styled-components': "^2.0.7",

    }
  );
}
export async function elementorInitGenerator(host: Tree, schema: InitSchema) {
  const tasks: GeneratorCallback[] = [];
  setDefaultCollection(host, '@betrue/react-elementor');

  const reactTask = await reactInitGenerator(host, schema);
  tasks.push(reactTask);
  const installTask = updateDependencies(host);
  tasks.push(installTask);

  return runTasksInSerial(...tasks);
}

export default elementorInitGenerator;
export const elementorInitSchematic = convertNxGenerator(elementorInitGenerator);

