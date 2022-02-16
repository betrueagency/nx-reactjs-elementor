import {
  addProjectConfiguration,
  formatFiles,
  generateFiles, getProjects,
  getWorkspaceLayout, logger,
  updateProjectConfiguration,
  names,
  offsetFromRoot,
  Tree, ProjectConfiguration,
} from '@nrwl/devkit';
import * as path from 'path';
import {ElementorWidgetGeneratorSchema} from './schema';

interface NormalizedSchema extends ElementorWidgetGeneratorSchema {
  pluginName: string;
  pluginFileName: string;
  pluginConstantName: string;
  pluginClassName: string;
  pluginDirectory: string;
  pluginRoot: string;
  widgets: string[];
  widgetsConstants: string[];
  widgetName: string;
  widgetFileName: string;
  widgetConstantName: string;
  widgetClassName: string;
  widgetRoot: string;
  parsedTags: string[];
  parsedAttributes: string[];
}

function normalizeOptions(
  host: Tree,
  options: ElementorWidgetGeneratorSchema
): NormalizedSchema {

  const plugin = getProjects(host).get(options.plugin);
  if (!plugin) {
    logger.error(
      `Cannot find the ${options.plugin} plugin. Please double check the plugin name.`
    );
    throw new Error();
  }

  //plugin options
  const pluginNames = names(options.plugin);
  const pluginDirectory = plugin.root
  const pluginName = options.plugin
  const pluginFileName = pluginNames.fileName
  const pluginConstantName = pluginNames.constantName
  const pluginClassName = pluginNames.className
  const pluginRoot = plugin.root
  const parsedAttributes = options.attributes?.split(',').map((s) => s.trim())
    ? options.attributes?.split(',').map((s) => s.trim())
    : [];


  //widget options
  const widgetNames = names(options.name);
  const widgetName = options.name;
  const widgetFileName = widgetNames.fileName;
  const widgetConstantName = widgetNames.constantName;
  const widgetClassName = widgetNames.className;

  const widgetRoot = `${plugin.root}/widgets/${widgetNames.fileName}`;
  const parsedTags = options.tags
    ? options.tags?.split(',').map((s) => s.trim())
    : [];

  const widgets = [widgetFileName];
  const widgetsConstants = [widgetConstantName];
  const widgetsRoot = `${plugin.root}/widgets`;

  const existingWidgets = host.children(widgetsRoot).filter((file) => !host.isFile(`${widgetsRoot}/${file}`));
  existingWidgets.forEach((name) => {
    if (widgetConstantName !== names(name).constantName) {
      widgets.push(name);
      widgetsConstants.push(names(name).constantName);
    }
  });
  logger.info(`${widgets}`)
  return {
    ...options,
    pluginName,
    pluginFileName,
    pluginConstantName,
    pluginClassName,
    pluginDirectory,
    pluginRoot,
    widgets,
    widgetsConstants,
    widgetName,
    widgetFileName,
    widgetConstantName,
    widgetClassName,
    widgetRoot,
    parsedTags,
    parsedAttributes
  };
}

function addFiles(host: Tree, options: NormalizedSchema) {

  const pluginTemplateOptions = {
    ...options,
    ...names(options.plugin),
    offsetFromRoot: offsetFromRoot(options.pluginRoot),
    template: '',
  };

  const widgetTemplateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.pluginRoot),
    template: '',
  };

  generateFiles(
    host,
    path.join(__dirname, 'plugin'),
    options.pluginRoot,
    pluginTemplateOptions
  );

  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.widgetRoot,
    widgetTemplateOptions
  );
}

export default async function (
  host: Tree,
  options: ElementorWidgetGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(host, options);
  const widgetProject = getProjects(host).get(normalizedOptions.widgetName)
  const projectConfig = {
    root: normalizedOptions.widgetRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.widgetRoot}`,
    targets: {},
    tags: normalizedOptions.parsedTags,
  } as ProjectConfiguration
  if (!widgetProject) {
    addProjectConfiguration(host, normalizedOptions.widgetName, projectConfig);
  } else {
    updateProjectConfiguration(host,
      normalizedOptions.widgetName,
      {...widgetProject, ...projectConfig})
  }

  addFiles(host, normalizedOptions);
  await formatFiles(host);
}
