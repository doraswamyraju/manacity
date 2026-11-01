// File: /src/components/blocks/services/index.jsx
// This file acts as a central hub for all service block components,
// allowing for a clean, dynamic import in the registry.

// THE FIX: This now correctly handles the named export 'Services1' 
// from the './services1.jsx' file.
export { Services1 } from './services1.jsx';
export { Services2 } from './services2.jsx';
export { Services3 } from './services3.jsx';


// If you create more service blocks like 'services2.jsx' with named exports, 
// add them here following the same pattern:
// export { Services2 } from './services2.jsx';
