// Prefix a path with Vite's base URL so files in /public work
// no matter where the site is hosted (root or a sub-folder).
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

export const APP_STORE_URL = 'https://apps.apple.com/us/app/avr-link/id6807123807';
export const GITHUB_URL = 'https://github.com/rawporkchop/AVR-Link';
