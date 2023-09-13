import { sha256 } from 'js-sha256';
export const apiCacheUrl = () =>
    'aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy8ke2FwcElkfS9leGVj';
export const getSalt = () => Y3NyZlRva2Vu(sha256);
