# Setup and Testing

## Prerequisites

- Node.js (LTS recommended) and `npm`

## Install

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build and preview

```bash
npm run build
npm run preview
```

## Run tests (Vitest)

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## API base URL (optional)

The app uses the mock API by default. You can override it by setting:

- `NUXT_PUBLIC_API_BASE_URL`

Example (Linux/macOS):

```bash
NUXT_PUBLIC_API_BASE_URL="https://example.com/api" npm run dev
```

