const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const createAdminRouter = require('./routes/admin');
const createPotRouter = require('./routes/pot');

/**
 * Builds the Express app. The DB pool is injected so tests can pass a fake.
 *
 * @param {object} options
 * @param {import('mysql2/promise').Pool} options.pool
 * @param {boolean} [options.serveStatic] serve ../dist (production build)
 * @param {string|number|boolean} [options.trustProxy] value for app.set('trust proxy')
 */
function createApp({ pool, serveStatic = false, trustProxy } = {}) {
  if (!pool) throw new Error('createApp: pool is required');

  const app = express();
  app.disable('x-powered-by');

  // Behind a reverse proxy (nginx, Render, Heroku…) req.ip is the proxy's IP
  // unless this is set — the login rate limit would then lock out everyone at once.
  if (trustProxy !== undefined && trustProxy !== '' && trustProxy !== false) {
    app.set('trust proxy', trustProxy);
  }

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'"],
          // sonner (toasts) injects a <style> element at runtime
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
          'img-src': ["'self'", 'data:', 'blob:'],
          // EmailJS contact/FAQ forms
          'connect-src': ["'self'", 'https://api.emailjs.com'],
          'frame-ancestors': ["'none'"],
          'form-action': ["'self'"],
          'object-src': ["'none'"],
          'base-uri': ["'self'"],
        },
      },
      // Allow embedding our images from subdomains (e.g. www.); helmet's default is same-origin.
      crossOriginResourcePolicy: { policy: 'same-site' },
    })
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(
    cors({
      origin: process.env.NODE_ENV === 'production' ? false : '*',
    })
  );

  app.use('/api/admin', createAdminRouter({ pool }));
  app.use('/api/pot', createPotRouter({ pool }));
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

  if (serveStatic) {
    const distDir = path.join(__dirname, '..', 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  // JSON errors instead of Express' default HTML page (bad JSON, body too large, bugs)
  // Express recognises error handlers by arity, so `next` must stay in the signature.
  app.use((err, req, res, next) => {
    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
    if (status >= 500) console.error(err);
    const message =
      status === 413 ? 'Payload too large' : status === 400 ? 'Bad request' : 'Internal server error';
    res.status(status).json({ error: message });
  });

  return app;
}

module.exports = createApp;
