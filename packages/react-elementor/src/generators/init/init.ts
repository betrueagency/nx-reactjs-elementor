import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  GeneratorCallback, runTasksInSerial,
  Tree,
  updateJson,
} from '@nx/devkit';
import { reactDomVersion, reactInitGenerator, reactVersion } from '@nx/react';

import { InitSchema } from './schema';

function updateDependencies(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    return json;
  });

  return addDependenciesToPackageJson(
    host,
    {
      react: reactVersion,
      redux: '^4.2.0',
      'react-redux': '^7.2.5',
      '@reduxjs/toolkit': '^1.6.1',
      '@emotion/react': '^11.9.3',
      '@emotion/styled': '^11.9.3',
      '@mui/material': '^5.9.1',
      'react-to-webcomponent': '^1.7.2',
      'prop-types': '15.8.1',
      'react-dom': reactDomVersion,
    },
    {
      '@betrue/react-elementor': 'latest',
      'babel-plugin-styled-components': '^2.0.7',
    }
  );
}

export async function elementorInitGenerator(host: Tree, schema: InitSchema) {
  const tasks: GeneratorCallback[] = [];

  const reactTask = await reactInitGenerator(host, schema);
  tasks.push(reactTask);
  const installTask = updateDependencies(host);
  tasks.push(installTask);

  return runTasksInSerial(...tasks);
}

export default elementorInitGenerator;
export const elementorInitSchematic = convertNxGenerator(
  elementorInitGenerator
);
