# Nx ReactJS Elementor Widgets

Nx plugin to generate WordPress plugins that enrich Elementor with ReactJS widgets.

All widgets are wrapped in web components that act as a proxy between Elementor and React. All web components use Shadow DOM to prevent CSS conflicts.

State between components is maintained using Redux, but you can use the provider of your choice.

![image](https://raw.githubusercontent.com/betrueagency/nx-reactjs-elementor/main/img/elementor-widgets.jpg)

## Requirements

- **Node.js** >= 18 (tested with Node.js 22)
- **Nx** 18.x

## Plugins

| Plugin | Description |
| ------ | ----------- |
| [`@betrue/react-elementor`](https://www.npmjs.com/package/@betrue/react-elementor) | Generate ReactJS Elementor widgets in WordPress plugin |

## Quick Start

### 1. Create a new Nx workspace

```bash
npx create-nx-workspace@18 my-workspace --preset=apps --nxCloud=skip
cd my-workspace
```

### 2. Install the plugin

```bash
npm install -D @betrue/react-elementor
```

### 3. Generate a new Elementor plugin

```bash
npx nx g @betrue/react-elementor:plugin my-project --style=styled-components
```

### 4. Build the WordPress plugin

```bash
npx nx pkg my-project
```

### 5. Deploy

The output is in `dist/elementor/my-project/`. Zip it and upload to WordPress:

```bash
cd dist/elementor/
zip -r my-project.zip my-project/
```

> **Warning for macOS users:** Do not use right-click to zip the folder. Since WordPress 6.4.3, this generates an "Incompatible Archive" error. Use the command line instead.

## Project Structure

After generating a plugin, you will find:

```
my-workspace/
├── my-project/                    # WordPress plugin sources
│   ├── src/
│   │   ├── app/
│   │   │   ├── my-project.ts      # Web component declarations
│   │   │   └── my-project.tsx     # React app entry
│   │   ├── assets/
│   │   └── environments/
│   ├── widgets/                   # Elementor widget PHP files
│   │   ├── my-project-input/
│   │   └── my-project-title/
│   ├── class-react-elementor.php
│   ├── class-widgets.php
│   └── wp-react-elementor.php
│
├── my-project-ui/                 # React components library
│   ├── src/
│   │   └── lib/
│   │       ├── my-project-input/
│   │       │   ├── my-project-input.tsx
│   │       │   ├── my-project-input.view.tsx
│   │       │   └── my-project-input.stories.tsx
│   │       ├── my-project-title/
│   │       ├── common/
│   │       ├── config/
│   │       └── store/
│   └── .storybook/
│
└── dist/
    └── elementor/
        └── my-project/            # Built WordPress plugin (ready to deploy)
```

## Development

### Storybook

Use Storybook to develop and test your React components in isolation:

```bash
npx nx run my-project-ui:storybook
```

Open [http://localhost:4400](http://localhost:4400) in your browser.

![image](https://raw.githubusercontent.com/betrueagency/nx-reactjs-elementor/main/img/storybook.png)

### Build with Version

Pass a release version to force resource updates and reset cache in WordPress:

```bash
NX_RELEASE_VERSION=1.0.0 npx nx pkg my-project
```

## Adding New Widgets

### Add a widget to an existing plugin

```bash
npx nx g @betrue/react-elementor:addWidget --name my-widget --plugin my-project --attributes attr1,attr2
```

### Options

| Option | Description |
| ------ | ----------- |
| `name` | **(Required)** Name of the ReactJS Elementor widget |
| `plugin` | **(Required)** Name of the WordPress plugin in which the widget will be generated |
| `attributes` | Comma-separated list of attributes customizable in Elementor |
| `author` | Name of the plugin author |
| `tags` | Add tags to the project (used for linting) |
| `widgetDescription` | Widget description that appears in WordPress plugin view |
| `version` | WordPress plugin version |

### Widget Files

Each widget consists of:

| File | Description |
| ---- | ----------- |
| `my-widget.tsx` | React component (smart component with logic) |
| `my-widget.view.tsx` | React view component (presentational) |
| `my-widget.stories.tsx` | Storybook stories for development |
| `widget.php` | Elementor widget PHP class |

### Registering a Widget

After creating a widget, you must register it in `my-project/src/app/my-project.ts`:

```typescript
import {
  CustomProviders,
  MyWidget,
  WebComponentWrapper,
} from '@my-workspace/my-project-ui';

WebComponentWrapper('my-project-my-widget', MyWidget, CustomProviders);
```

## CustomProviders

`CustomProviders` is a React component that wraps all your widgets with the necessary providers (Redux store, MUI theme, etc.). It is located in `my-project-ui/src/lib/config/providers.tsx`.

### Default Configuration

By default, `CustomProviders` includes:

- **Redux Provider** - For state management across widgets
- **MUI ThemeProvider** - For Material UI theming
- **Emotion CacheProvider** - For CSS-in-JS styling within Shadow DOM

```typescript
// my-project-ui/src/lib/config/providers.tsx
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProviders } from '../common';

export const muiTheme = responsiveFontSizes(
  createTheme({
    /* your custom theme */
  })
);

const store = configureStore({
  reducer: {
    MyProjectEntity: MyProjectReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export function CustomProviders(props: BaseAppProviderProps) {
  return (
    <ThemeProviders theme={muiTheme}>
      <Provider store={store}>{props.children}</Provider>
    </ThemeProviders>
  );
}
```

### Customizing Providers

You can modify `CustomProviders` to add your own providers:

```typescript
// Add React Query, i18n, or any other provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';

const queryClient = new QueryClient();

export function CustomProviders(props: BaseAppProviderProps) {
  return (
    <ThemeProviders theme={muiTheme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            {props.children}
          </I18nextProvider>
        </QueryClientProvider>
      </Provider>
    </ThemeProviders>
  );
}
```

### Why CustomProviders?

Each widget is rendered inside a Shadow DOM web component. The `WebComponentWrapper` function:

1. Creates a Shadow DOM to isolate styles from WordPress/Elementor
2. Sets up Emotion cache to inject styles into the Shadow DOM
3. Wraps your React component with `CustomProviders`

This ensures that:
- All widgets share the same Redux store (state is synchronized)
- MUI components render correctly inside Shadow DOM
- Your custom theme is applied consistently

## Testing with Docker

If you have Docker installed, you can test the Elementor plugin locally:

### 1. Build the plugin

```bash
npx nx pkg my-project
```

### 2. Start WordPress with Docker

```bash
docker-compose -f my-project/src/docker-compose.yml up -d
```

### 3. Configure WordPress

1. Open [http://localhost:8000](http://localhost:8000)
2. Complete WordPress installation
3. Go to [Plugins](http://localhost:8000/wp-admin/plugins.php) and install/enable Elementor
4. Enable your custom plugin (`my-project`)
5. Create a [new page](http://localhost:8000/wp-admin/post-new.php?post_type=page) and edit with Elementor
6. Search for `my-project-title` and `my-project-input` widgets

### 4. Stop Docker

```bash
docker-compose -f my-project/src/docker-compose.yml down
```

## Available Commands

| Command | Description |
| ------- | ----------- |
| `npx nx g @betrue/react-elementor:plugin <name>` | Generate a new Elementor plugin |
| `npx nx g @betrue/react-elementor:addWidget` | Add a widget to an existing plugin |
| `npx nx pkg <plugin-name>` | Build and package the WordPress plugin |
| `npx nx build <plugin-name>` | Build only (without packaging) |
| `npx nx run <plugin-name>-ui:storybook` | Start Storybook for development |
| `npx nx serve <plugin-name>` | Start development server |

## Troubleshooting

### Build fails with module not found errors

Make sure all dependencies are installed:

```bash
npm install
```

### Storybook port already in use

Kill the process using port 4400 or specify a different port:

```bash
npx nx run my-project-ui:storybook --port=4401
```

### WordPress plugin not loading

1. Check that the plugin is activated in WordPress
2. Verify that Elementor is installed and activated
3. Check the browser console for JavaScript errors
4. Ensure the `dist/main.js` file exists in the plugin folder

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Maintainer

- [Betrue Agency](https://www.betrue.fr/)
