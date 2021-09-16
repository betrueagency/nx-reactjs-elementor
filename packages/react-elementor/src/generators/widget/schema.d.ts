export interface ElementorWidgetGeneratorSchema {
  name: string;
  plugin: string;
  attributes? : string[];
  tags?: string;
  directory?: string;
  widgetDescription?: string;
  author?: string;
  license?: string;
  link?: string;
  version?: string;
}
