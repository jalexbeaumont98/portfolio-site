// api/_utils.js
import { requireSignin } from '../server/controllers/authController.js';

/**
 * Read and parse a JSON body from a Node IncomingMessage.
 */
export function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      if (!data) return resolve({});
      try {
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', (err) => reject(err));
  });
}

/**
 * Generic helper for PUBLIC controllers (no auth).
 * Express-style controllerFn: (req, res, next)
 */
export async function handlePublic(req, res, controllerFn) {
  try {
    if (
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
      req.headers['content-type']?.includes('application/json')
    ) {
      req.body = await parseJsonBody(req);
    } else {
      req.body = req.body || {};
    }
  } catch (err) {
    console.error('JSON parse error:', err);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  return new Promise((resolve) => {
    controllerFn(req, res, (controllerErr) => {
      if (controllerErr) {
        console.error('Controller error:', controllerErr);
        const status = controllerErr.status || 500;
        res
          .status(status)
          .json({ error: controllerErr.message || 'Server error' });
      }
      resolve();
    });
  });
}

/**
 * Generic helper for AUTHED controllers (JWT required).
 */
export async function handleAuthed(req, res, controllerFn) {
  try {
    if (
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
      req.headers['content-type']?.includes('application/json')
    ) {
      req.body = await parseJsonBody(req);
    } else {
      req.body = req.body || {};
    }
  } catch (err) {
    console.error('JSON parse error:', err);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  return new Promise((resolve) => {
    // first, requireSignin to decode JWT and put it on req.auth
    requireSignin(req, res, (authErr) => {
      if (authErr) {
        console.error('Auth error:', authErr);
        res.status(401).json({ error: authErr.message || 'Unauthorized' });
        return resolve();
      }

      controllerFn(req, res, (controllerErr) => {
        if (controllerErr) {
          console.error('Controller error:', controllerErr);
          const status = controllerErr.status || 500;
          res
            .status(status)
            .json({ error: controllerErr.message || 'Server error' });
        }
        resolve();
      });
    });
  });
}