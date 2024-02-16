import { BuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nx/devkit';
import * as fs from 'fs';
import { readdirSync, renameSync } from 'fs';
import { join } from 'path';
import { copySync } from 'fs-extra';

const updateVersion = (
  version: string,
  files: string[]
): Promise<boolean[]> => {
  return Promise.all(
    files.map((file) => {
      return new Promise<boolean>((resolve, reject) => {
        fs.readFile(file, 'utf8', function (err, data) {
          if (err) {
            reject(err);
          }
          const result = data
            .replace(/xxVERSIONxx/g, version)
            .replace(/noVersion/g, version);

          fs.writeFile(file, result, 'utf8', function (writeErr) {
            if (writeErr) {
              reject(writeErr);
            } else resolve(true);
          });
        });
      });
    })
  );
};

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  await copySync(
    `${context.root}/${options.plugin}`,
    `${context.root}/dist/elementor/${options.plugin}`
  );

  await copySync(
    `${context.root}/dist/${options.plugin}`,
    `${context.root}/dist/elementor/${options.plugin}/dist`
  );
  const matchMain = RegExp('main\\.[^\\.]+\\.js', 'g');
  const matchRuntime = RegExp('runtime\\.[^\\.]+\\.js', 'g');

  const files = readdirSync(
    `${context.root}/dist/elementor/${options.plugin}/dist`
  );

  files
    .filter((file) => file.match(matchMain))
    .forEach((file) => {
      console.log('file',file)
      const filePath = join(
        `${context.root}/dist/elementor/${options.plugin}/dist`,
        file
      );

      const newFilePath = join(
        `${context.root}/dist/elementor/${options.plugin}/dist`,
        file.replace(matchMain, 'main.js')
      );
      console.log('newFilePath',newFilePath)
      renameSync(filePath, newFilePath);
    });

  files
    .filter((file) => file.match(matchRuntime))
    .forEach((file) => {
      console.log('file',file)
      const filePath = join(
        `${context.root}/dist/elementor/${options.plugin}/dist`,
        file
      );

      const newFilePath = join(
        `${context.root}/dist/elementor/${options.plugin}/dist`,
        file.replace(matchRuntime, 'runtime.js')
      );
      renameSync(filePath, newFilePath);
    });

  if (process.env.NX_RELEASE_VERSION) {
    console.log('update version to : ', process.env.NX_RELEASE_VERSION);
    await updateVersion(process.env.NX_RELEASE_VERSION, [
      `${context.root}/dist/elementor/${options.plugin}/class-react-elementor.php`,
      `${context.root}/dist/elementor/${options.plugin}/class-widgets.php`,
    ]);
  } else {
    await updateVersion('noVersion', [
      `${context.root}/dist/elementor/${options.plugin}/class-react-elementor.php`,
      `${context.root}/dist/elementor/${options.plugin}/class-widgets.php`,
    ]);
  }
  return {
    success: true,
  };
}
