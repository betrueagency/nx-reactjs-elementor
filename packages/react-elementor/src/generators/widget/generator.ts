import {
  addProjectConfiguration,
  formatFiles,
  generateFiles, getProjects,
  getWorkspaceLayout, logger,
  names,
  offsetFromRoot,
  Tree,
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
  widgetDirectory: string;
  widgetRoot: string;
  parsedTags: string[];
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
  const pluginDirectory = options.directory
    ? `${names(options.directory).fileName}/${pluginNames.fileName}`
    : `${pluginNames.fileName}`;
  const pluginName = options.plugin
  const pluginFileName = pluginNames.fileName
  const pluginConstantName = pluginNames.constantName
  const pluginClassName = pluginNames.className
  const pluginRoot = `${getWorkspaceLayout(host).appsDir}/${pluginDirectory}`;

  //widget options
  const widgetNames = names(options.name);
  const widgetName = options.name;
  const widgetFileName = widgetNames.fileName;
  const widgetConstantName = widgetNames.constantName;
  const widgetClassName = widgetNames.className;

  const widgetDirectory = `${pluginDirectory}/widgets/${widgetNames.fileName}`;
  const widgetRoot = `${getWorkspaceLayout(host).appsDir}/${widgetDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const widgets = [widgetFileName];
  const widgetsConstants = [widgetConstantName];
  const widgetsRoot = `${pluginRoot}/widgets`;

  const existingWidgets = host.children(widgetsRoot).filter((file) => !host.isFile(`${widgetsRoot}/${file}`));
  existingWidgets.forEach((name) => {
    widgets.push(name);
    widgetsConstants.push(names(name).constantName);
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
    widgetDirectory,
    widgetRoot,
    parsedTags,
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
  addProjectConfiguration(host, normalizedOptions.widgetName, {
    root: normalizedOptions.widgetDirectory,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.widgetRoot}`,
    targets: {

    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(host, normalizedOptions);
  await formatFiles(host);
}
