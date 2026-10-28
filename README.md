# React + TypeScript + Vite

## MongoDB authentication

1. Start MongoDB locally or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env.local` in the project root.
3. Set `MONGODB_URI` to your MongoDB connection string and optionally change `MONGODB_DB`.
4. Restart the Vite dev server with `npm run dev`.

For Atlas `mongodb+srv://` URIs, the auth server resolves the cluster's SRV/TXT records using Cloudflare DNS-over-HTTPS, with Google DNS-over-HTTPS as a fallback. Only the Atlas hostname is sent to these DNS providers; database credentials are not. The MongoDB connection itself still uses TLS. If the TLS handshake fails, check Atlas Network Access for your current public IP and verify that your VPN, proxy, or firewall allows outbound connections on port `27017`.

Sign-up and email/password sign-in use the server-side MongoDB API. Passwords are stored as scrypt hashes, and login sessions use HttpOnly cookies backed by expiring MongoDB session records. New accounts are signed in immediately; email confirmation and password-reset email delivery are not configured. Keep `.env.local` out of version control and never expose `MONGODB_URI` through a `VITE_`-prefixed variable.

The MongoDB auth endpoints are served by the Vite development middleware, matching the existing `/api` backend setup in this project. Configure equivalent server-side routes before deploying a production build.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
