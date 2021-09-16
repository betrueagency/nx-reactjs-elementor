import {SupportedStyles} from "@nrwl/react";
import {NormalizedSchema} from "@nrwl/react/src/generators/application/schema";

export interface ElementorPluginGeneratorSchema  extends NormalizedSchema {
  name: string;
  tags?: string;
  directory?: string;
  pluginDescription?: string;
  pluginUri?: string;
  author?: string;
  copyright?: string;
  license?: string;
  link?: string;
  minElementorVersion?: string;
  version?: string;
  strict?: boolean;
  classComponent?: boolean;
  unitTestRunner: 'jest' | 'none';
  style: SupportedStyles;
  babelJest: boolean;
  e2eTestRunner: 'cypress' | 'none';
  npmScope: string
}
