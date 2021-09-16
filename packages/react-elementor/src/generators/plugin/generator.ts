import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  convertNxGenerator,
  updateProjectConfiguration,
  readProjectConfiguration,
} from '@nrwl/devkit';
import * as path from 'path';
import {ElementorPluginGeneratorSchema} from './schema';
import elementorInitGenerator from "../init/init"
import {runTasksInSerial} from "@nrwl/workspace/src/utilities/run-tasks-in-serial";
import { assertValidStyle, SupportedStyles} from "@nrwl/react";
import {addProject} from "@nrwl/react/src/generators/application/lib/add-project";
import widgetGenerator from '../../generators/widget/generator'
import {generateReduxFiles} from "./lib/redux-files";
import {reactComponentFiles} from "./lib/react-component-files";

export interface ElementorNormalizedSchema extends ElementorPluginGeneratorSchema {
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
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const styledModule = /^(css|scss|less|styl|none)$/.test(options.style)
    ? null
    : options.style;

  assertValidStyle(options.style);
  options.strict = options.strict ?? true;
  options.classComponent = options.classComponent ?? false;
  options.unitTestRunner = options.unitTestRunner ?? 'jest';
  options.e2eTestRunner = options.e2eTestRunner ?? 'cypress';

  return {
    npmScope: getWorkspaceLayout(host).npmScope?.toLowerCase(),
    ...options,
    appProjectRoot,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    styledModule,
    name: name
  };
}

function addFiles(host: Tree, options: ElementorNormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    dot: '.'
  };

  generateFiles(
    host,
    path.join(__dirname, 'app'),
    options.projectRoot,
    templateOptions,
  );

}

export async function pluginGenerator(
  host: Tree,
  options: ElementorPluginGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options);

  addProject(host, normalizedOptions)

  const projectConfig = readProjectConfiguration(host, normalizedOptions.projectName)


  projectConfig.targets.plugin = {
    executor: '@betrue/react-elementor:build',
    options: {
      plugin: normalizedOptions.projectName
    }
  }

  projectConfig.targets.elementor = {
    executor: "@nrwl/workspace:run-commands",
    options: {
      commands: [
        `nx build ${normalizedOptions.projectName}`,
        `nx plugin ${normalizedOptions.projectName}`
      ],
      parallel: false
    }
  }

  updateProjectConfiguration(host, normalizedOptions.projectName, projectConfig)
  addFiles(host, normalizedOptions);
  const widgetDescription = 'simple demo widget generated on project init'

  await widgetGenerator(host,
    {
      attributes: ['placeholder', 'button'],
      author: normalizedOptions.author,
      name: `${normalizedOptions.name}-input`,
      version: normalizedOptions.version,
      widgetDescription: widgetDescription,
      plugin: normalizedOptions.name
    })

  await widgetGenerator(host, {
    attributes: ['label'],
    author: normalizedOptions.author,
    widgetDescription: widgetDescription,
    version: normalizedOptions.version,
    name: `${normalizedOptions.name}-title`,
    plugin: normalizedOptions.name
  })

  await reactComponentFiles(host,normalizedOptions)

  await generateReduxFiles(host,normalizedOptions)

  const elementorTask = await elementorInitGenerator(host, {
    ...options,
    skipFormat: true,
  });
  await formatFiles(host);
  return runTasksInSerial(
    elementorTask
  );
}

export const pluginSchematic = convertNxGenerator(pluginGenerator);
