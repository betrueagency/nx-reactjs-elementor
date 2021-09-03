# Nx ReactJS elementor widgets

Nx plugin to generate Wordpress plugin that enrich Elementor with ReactJS widgets.

## Plugins

| Plugin                                                                                                                    | Description                                             |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [`@betrue/nx-reactjs-elementor`](https://github.com/betrueagency/nx-reactjs-elementor/tree/main/e2e/elementor-plugin-e2e) | Generate Reactjs Elementor widgets in Wordpress plugin; |

## Usage

Create a Wordpress plugin that will wrap all elementor widgets

`@betrue/nx-reactjs-elementor:plugin my-plugin`

Add a new widget to an existing plugin

`@betrue/nx-reactjs-elementor:addWidget --name my-widget --plugin my-plugin`

| Option                          | Description                                                                        |
| ------------------------------- | -------------------------------------------------------                            |
| `name`                          | (Required) name of the Reactjs elementor widget                                    |
| `plugin`                        | (Required) The name of the Wordpress plugin in which the widget will be generated. |
| `directory`                     | A directory where the project is placed (sub-directory in lib).                    |
| `author`                        | Name of who makes this plugin.                                                     |
| `tags`                          | Add tags to the project (used for linting).                                        |
| `widgetDescription`             | Widget description that appear in Wordpress plugin view.                           |
| `version`                       | Wordpress plugin version.                                                          |

## Maintainers

- [Selim Bensenouci](https://github.com/alizarion)
