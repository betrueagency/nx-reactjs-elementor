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
      '@betrue/react-elementor': '*',
      react: reactVersion,
      'redux': '*',
      "jss": "^10.7.1",
      "react-redux": "^7.2.5",
      "@reduxjs/toolkit": "^1.6.1",
      '@material-ui/styles': '^4.11.4',
      "@material-ui/core": "^4.12.3",
      'react-to-webcomponent' : '*',
      'prop-types': '*',
      'react-dom': reactDomVersion
    },
    {
      '@betrue/react-elementor': '*'
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

