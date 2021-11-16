import {
  checkFilesExist,
  ensureNxProject, readFile,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('react-elementor:plugin e2e', () => {
  it('should create react-elementor', async () => {
    const plugin = uniq('react-elementor');
    ensureNxProject(
      '@betrue/react-elementor',
      'dist/packages/react-elementor'
    );
    await runNxCommandAsync(
      `generate @betrue/react-elementor:plugin ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(() =>
      checkFilesExist(
        `apps/${plugin}/src/index.html`,
        `dist/apps/${plugin}/main.js`)
    ).not.toThrow();
  }, 120000);



  /**describe('--tags', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('react-elementor');
      ensureNxProject(
        '@betrue/react-elementor',
        'dist/packages/react-elementor'
      );
      await runNxCommandAsync(
        `generate @betrue/react-elementor:plugin ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });**/

  describe('RELEASE_VERSION', () => {
    it('should update version xxVERSIONxx', async () => {
      const plugin = uniq('react-elementor');
      ensureNxProject(
        '@betrue/react-elementor',
        'dist/packages/react-elementor'
      );
      await runNxCommandAsync(
        `generate @betrue/react-elementor:plugin ${plugin} `
      );
      await runNxCommandAsync(
        `build ${plugin}`
      );
      await runNxCommandAsync(
        `plugin ${plugin} `
      );
      const file = readFile(`dist/elementor/${plugin}/class-widgets.php`);
      console.log(file)
      expect(file.includes('noVersion')).toEqual(true);
    }, 120000);
  });


  describe('react-elementor:widget', () => {
    it('should create widget in the specified plugin', async () => {
      const plugin = uniq('react-elementor');
      const widget1 = uniq('elementor-widget');
      const widget2 = uniq('elementor-widget');

      ensureNxProject(
        '@betrue/react-elementor',
        'dist/packages/react-elementor'
      );

      await runNxCommandAsync(
        `generate @betrue/react-elementor:plugin ${plugin}`
      );

      await runNxCommandAsync(
        `generate @betrue/react-elementor:addWidget --name ${widget1}  --plugin ${plugin} --attributes attrs1,attrs2`
      );

      await runNxCommandAsync(
        `generate @betrue/react-elementor:addWidget --name ${widget2}  --plugin ${plugin} --attributes attrs1,attrs2`
      );

      expect(() =>
        checkFilesExist(
          `apps/${plugin}/widgets/${widget2}/widget.php`,
          `apps/${plugin}/widgets/${widget1}/widget.php`)
      ).not.toThrow();
    }, 120000);

  });
});
