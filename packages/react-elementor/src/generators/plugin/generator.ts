import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  convertNxGenerator,
  updateProjectConfiguration,
  readProjectConfiguration, runTasksInSerial, ensurePackage, GeneratorCallback,
} from '@nx/devkit';

import * as path from 'path';
import {ElementorPluginGeneratorSchema} from './schema';
import elementorInitGenerator from '../init/init';
import {assertValidStyle, reactInitGenerator, SupportedStyles, withReact} from '@nx/react';
import {addProject} from '@nx/react/src/generators/application/lib/add-project';
import widgetGenerator from '../../generators/widget/generator';
import {reactComponentFiles} from './lib/react-component-files';
import {getNpmScope} from "@nx/workspace/src/utilities/get-import-path";
import {nxVersion} from "nx/src/utils/versions";
import {composePlugins, withNx} from "@nx/webpack";
import {createApplicationFiles} from "@nx/react/src/generators/application/lib/create-application-files";

export interface ElementorNormalizedSchema
  extends ElementorPluginGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  styledModule: null | SupportedStyles;
  parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: ElementorPluginGeneratorSchema
): ElementorNormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const appProjectRoot = projectRoot
  const parsedTags = options.tags
    ? options.tags?.split(',').map((s) => s.trim())
    : [];

  const styledModule = /^(css|scss|less|styl|none)$/.test(options.style)
    ? null
    : options.style;

  assertValidStyle(options.style);
  options.strict = options.strict ?? true;
  options.styledModule = 'none';
  options.bundler = 'webpack';
  options.classComponent = options.classComponent ?? false;
  options.unitTestRunner = options.unitTestRunner ?? 'jest';
  options.e2eTestRunner = options.e2eTestRunner ?? 'cypress';
  return {
    npmScope: getNpmScope(host).toLowerCase(),
    ...options,
    appProjectRoot: appProjectRoot,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    styledModule,
    name: name,
    minimal:true,
    routing:false,
    inSourceTests:false,
  };
}

function addFiles(
  host: Tree,
  options: ElementorNormalizedSchema,
  projectName: string
) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    uiLibName: `${projectName}-ui`,
    storeLibName: `${projectName}-store`,
    offsetFromRoot: offsetFromRoot(options.appProjectRoot),
    template: '',
    tmpl: '',
    dot: '.'
  };

  generateFiles(
    host,
    path.join(__dirname, 'app'),
    options.appProjectRoot,
    templateOptions
  );
}

export async function pluginGenerator(
  host: Tree,
  options: ElementorPluginGeneratorSchema
) {
  composePlugins(withNx(), withReact());
  const normalizedOptions = normalizeOptions(host, options);
  const tasks: GeneratorCallback[] = [];
  const initTask = await reactInitGenerator(host, {
    ...options,
    skipFormat: true,
  });
  tasks.push(initTask);
  const {webpackInitGenerator} = ensurePackage<
    typeof import('@nx/webpack')
  >('@nx/webpack', nxVersion);
  console.log('nxVersion', webpackInitGenerator?.name)
  const webpackInitTask = await webpackInitGenerator(host, {
    skipPackageJson: false,
    skipFormat: true,
    addPlugin: true,
  });
  tasks.push(webpackInitTask);

  createApplicationFiles(host, normalizedOptions);

  addProject(host, normalizedOptions);

  const projectConfig = readProjectConfiguration(
    host,
    normalizedOptions.projectName
  );

  //projectConfig.targets.build.configurations.production.outputHashing = 'none';

  projectConfig.targets.plugin = {
    executor: '@betrue/react-elementor:build',
    options: {
      plugin: normalizedOptions.projectName,
      replaceFilePattern: '.esm.js',
    },
  };

  projectConfig.targets.pkg = {
    executor: 'nx:run-commands',
    options: {
      commands: [
        `nx build ${normalizedOptions.projectName}`,
        `nx plugin ${normalizedOptions.projectName}`,
      ],
      parallel: false,
    },
  };

  updateProjectConfiguration(
    host,
    normalizedOptions.projectName,
    projectConfig
  );
  addFiles(host, normalizedOptions, normalizedOptions.projectName);
  const widgetDescription = 'simple demo widget generated on project init';
  normalizedOptions.directory = undefined;
  await widgetGenerator(host, {
    attributes: 'placeholder,button',
    author: normalizedOptions.author,
    name: `${normalizedOptions.name}-input`,
    version: normalizedOptions.version,
    widgetDescription: widgetDescription,
    plugin: normalizedOptions.projectName,
  });

  await widgetGenerator(host, {
    attributes: 'label',
    author: normalizedOptions.author,
    widgetDescription: widgetDescription,
    version: normalizedOptions.version,
    name: `${normalizedOptions.name}-title`,
    plugin: normalizedOptions.projectName,
  });

  await reactComponentFiles(
    host,
    normalizedOptions,
    normalizedOptions.projectName
  );
  console.log('elementorInitGenerator');

  const elementorTask = await elementorInitGenerator(host, {
    ...options,
    skipFormat: true,
  });

  await formatFiles(host);
  return runTasksInSerial(...tasks,elementorTask);
}

export const pluginSchematic = convertNxGenerator(pluginGenerator);
