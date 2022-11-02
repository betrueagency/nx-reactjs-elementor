# Nx ReactJS elementor widgets

Nx plugin to generate Wordpress plugin that enrich Elementor with ReactJS widgets.
All widget are wrapped in web component that will act as a proxy between elementor and react.
all web components uses shadow dom to prevent css overload.

State between component is maintained using Redux. but you can use the provider of your choice.
![image](https://raw.githubusercontent.com/betrueagency/nx-reactjs-elementor/main/img/elementor-widgets.jpg)


## Plugins

| Plugin                                                                                                                    | Description                                             |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [`@betrue/react-elementor`](https://github.com/betrueagency/nx-reactjs-elementor/tree/main/e2e/react-elementor-e2e)    | Generate Reactjs Elementor widgets in Wordpress plugin; |

## Install

Create a new nx workspace (if doesn't exist)

    npx create-nx-workspace@latest my-workspace
    
    >  NX   Let's create a new workspace [https://nx.dev/getting-started/intro]
    
    ✔ Choose your style                     · integrated
    ✔ What to create in the new workspace   · apps
    ✔ Enable distributed caching to make your CI faster · No



Install [`@betrue/react-elementor`](https://www.npmjs.com/package/@betrue/react-elementor)

     cd my-workspace
     npm install -D @betrue/react-elementor


## Usage

Create a new plugin

    npx nx g @betrue/react-elementor:plugin my-project

    >  NX  Generating @betrue/react-elementor:application
    
    ✔ Which stylesheet format would you like to use? · styled-components
   
    ....

    npm install

this generates starting code base made up of two react components (input from and display title) wrapped into elementor widgets.

you will find the sources of the Wordpress apps directory, and elementor/react widgets in libs/ui.

Each new widget has.
* React component (my-widget.tsx)
* React component view (my-widget.view.tsx)
* Stroybook stories file (my-widget.stories.tsx)
* MUST be declared in apps/my-project/src/app/my-projet.ts in order to be wrapped in a web component
* MUST have generated elementor widget [@betrue/react-elementor:addWidget](#add-a-new-widget-to-an-existing-plugin)

if you already have and Wordpress instance with elementor installed, you juste need to build the wordpress plugin

     npx nx pkg my-project

Zip and upload using Wordpress plugin management the content of `dist/element/my-project`. that's all you can now try to use theses widgets into elementor :)

For development purpose, You can use storybook to live edit and test your react component [`http://localhost:4400`](http://localhost:4400)

    npx nx run ui:storybook

![image](https://raw.githubusercontent.com/betrueagency/nx-reactjs-elementor/main/img/storybook.png)

On build is important to pass the release version to make force resources update and reset cache

    NX_RELEASE_VERSION=xxxx npx nx pkg my-project

## Try it using docker

If you have already installed docker and docker-compose you can try the elementor plugin in wordpress

    npx nx pkg my-project // to package the plugin into dist/     `      

start docker-compose

    docker-compose -f apps/my-project/src/docker-compose.yml up -d

* open your browser on [`http://localhost:8000`](http://localhost:8000)
* Login into Wordpress admin and [`install and enable elementor `](http://localhost:8000/wp-admin/plugins.php?s=elementor&plugin_status=all)
* Enable your custom [`elementor plugin`](http://localhost:8000/wp-admin/plugins.php)  plugin.
* Create a [`new page`](http://localhost:8000/wp-admin/post-new.php?post_type=page) and choose edit with elementor.
* Search and add `my-project-title` and `my-project-input` widgets to your page.

### Add a new widget to an existing plugin:

    nx g @betrue/react-elementor:addWidget --name my-widget --plugin my-plugin --attributes attr1,attr2

| Option                          | Description                                                                        |
| ------------------------------- | -------------------------------------------------------                            |
| `name`                          | (Required) name of the Reactjs elementor widget                                    |
| `plugin`                        | (Required) The name of the Wordpress plugin in which the widget will be generated. |
| `attributes`                    | List of attribute that are customizable in elementor                               |
| `author`                        | Name of who makes this plugin.                                                     |
| `tags`                          | Add tags to the project (used for linting).                                        |
| `widgetDescription`             | Widget description that appear in Wordpress plugin view.                           |
| `version`                       | Wordpress plugin version.                                                          |

## Maintainer

- [https://www.betrue.fr/](https://www.betrue.fr/) 
