/**
 * Theme Bridge Script
 * Connects the legacy localStorage theme toggle with GitHub-backed preferences
 *
 * This script listens for localStorage theme changes and syncs them to GitHub
 * via the preferences system, and vice versa.
 */

// Listen for theme changes via BroadcastChannel (from preferences system)
if (typeof BroadcastChannel !== 'undefined') {
  const channel = new BroadcastChannel('workspace-preferences');

  channel.addEventListener('message', (event) => {
    if (event.data.type === 'preferences-updated') {
      const preferences = event.data.data;
      const theme = preferences?.theme?.mode;

      if (theme && (theme === 'workspace-light' || theme === 'workspace-dark')) {
        // Update localStorage to keep it in sync
        localStorage.setItem('theme', theme);

        // Update DOM
        document.documentElement.setAttribute('data-theme', theme);
      }
    }
  });
}

// Listen for localStorage changes (from legacy code)
window.addEventListener('storage', (event) => {
  if (event.key === 'theme' && event.newValue) {
    document.documentElement.setAttribute('data-theme', event.newValue);
  }
});

export {};
