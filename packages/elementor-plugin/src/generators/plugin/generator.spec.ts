import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { ElementorPluginGeneratorSchema } from './schema';

describe('elementor-plugin generator', () => {
  let appTree: Tree;
  const options: ElementorPluginGeneratorSchema = { name: 'plugin',
    tags: "",
    directory: "",
    pluginDescription: "",
    pluginUri: "",
    author: "",
    copyright: "",
    license: "",
    link: "",
    minElementorVersion: "",
    version: ""};

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'plugin');
    expect(config).toBeDefined();
  });
});
