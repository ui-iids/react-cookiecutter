import type { Preview } from '@storybook/react-vite';

import { createRouter, RootRoute, RouterContextProvider } from "@tanstack/react-router";
import * as TanStackQueryProvider from '../src/integrations/tanstack-query/root-provider.tsx';

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree: new RootRoute().addChildren([]),
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <Story />
      </TanStackQueryProvider.Provider>
    ),
    (Story) => (
  <RouterContextProvider router={router}>
    <Story />
  </RouterContextProvider>
)],
}

export default preview
