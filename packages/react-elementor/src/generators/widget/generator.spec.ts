import {createTreeWithEmptyWorkspace} from '@nrwl/devkit/testing';
import {Tree, readProjectConfiguration} from '@nrwl/devkit';
import elementorPluginGenerator from '../plugin/generator'
import {ElementorPluginGeneratorSchema} from '../plugin/schema'
import generator from './generator';
import {ElementorWidgetGeneratorSchema} from './schema';

describe('elementor-widget generator', () => {
  let appTree: Tree;
  const pluginName = 'plugin';
  const widgetName1 = 'widget1';
  const widgetName2 = 'widget2';

  const options1: ElementorWidgetGeneratorSchema = {
    name: widgetName1,
    plugin: pluginName,
    tags: '',
    directory: '',
    author: '',
    license: '',
    link: '',
    version: ''
  };

  const options2: ElementorWidgetGeneratorSchema = {
    name: widgetName2,
    plugin: pluginName,
    tags: '',
    directory: '',
    author: '',
    license: '',
    link: '',
    version: ''
  };
  const pluginOptions: ElementorPluginGeneratorSchema = {
    name: pluginName,
    tags: '',
    directory: '',
    pluginDescription: '',
    pluginUri: '',
    author: '',
    copyright: '',
    license: '',
    link: '',
    minElementorVersion: '',
    version: ''
  };

  beforeAll(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await elementorPluginGenerator(appTree, pluginOptions);
  });

  it('Adding a first widget to an existing plugin', async () => {
    await generator(appTree, options1);
    const config = readProjectConfiguration(appTree, widgetName1);
    expect(config).toBeDefined();
  });
  it('Adding a second widget to an existing plugin', async () => {
    await generator(appTree, options2);
    const config = readProjectConfiguration(appTree, widgetName2);
    expect(config).toBeDefined();
  });
});
