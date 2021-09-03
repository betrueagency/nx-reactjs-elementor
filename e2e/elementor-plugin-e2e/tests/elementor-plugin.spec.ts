import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('elementor-plugin:plugin e2e', () => {
  it('should create elementor-plugin', async () => {
    const plugin = uniq('elementor-plugin');
    ensureNxProject(
      '@betrue/elementor-plugin',
      'dist/packages/elementor-plugin'
    );
    await runNxCommandAsync(
      `generate @betrue/elementor-plugin:plugin ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('elementor-plugin');
      ensureNxProject(
        '@betrue/elementor-plugin',
        'dist/packages/elementor-plugin'
      );
      await runNxCommandAsync(
        `generate @betrue/elementor-plugin:plugin ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/index.php`)
      ).not.toThrow();
    }, 120000);
  });


  describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('elementor-plugin');
      ensureNxProject(
        '@betrue/elementor-plugin',
        'dist/packages/elementor-plugin'
      );
      await runNxCommandAsync(
        `generate @betrue/elementor-plugin:plugin ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });


  describe('elementor-plugin:widget', () => {
    it('should create widget in the specified plugin', async () => {
      const plugin = uniq('elementor-plugin');
      const widget1 = uniq('elementor-widget');
      const widget2 = uniq('elementor-widget');

      ensureNxProject(
        '@betrue/elementor-plugin',
        'dist/packages/elementor-plugin'
      );

      await runNxCommandAsync(
        `generate @betrue/elementor-plugin:plugin ${plugin}`
      );

      await runNxCommandAsync(
        `generate @betrue/elementor-plugin:addWidget --name ${widget1}  --plugin ${plugin}`
      );

      await runNxCommandAsync(
        `generate @betrue/elementor-plugin:addWidget --name ${widget2}  --plugin ${plugin}`
      );

      expect(() =>
        checkFilesExist(
          `libs/${plugin}/widgets/${widget2}/widget.php`,
          `libs/${plugin}/widgets/${widget1}/widget.php`)
      ).not.toThrow();
    }, 120000);

  });
});
