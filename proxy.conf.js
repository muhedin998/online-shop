// Angular dev-server proxy configuration
// Allows front-end to call the backend at /api/* while developing.
// Usage: ng serve --proxy-config proxy.conf.js

const target = process.env.BACKEND_URL || 'http://localhost:8080';

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'info'
  }
};

