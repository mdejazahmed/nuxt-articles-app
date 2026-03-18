# Nuxt 3 Articles App

Server-side rendered Nuxt 3 application that lists articles from a mock API and provides detail views. Built for the Web Developer Challenge with strict TypeScript, Pinia, and composable-only API access.

## Project setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For detailed setup and test commands, see `docs/SETUP.md`.

- **Build**: `npm run build`
- **Preview**: `npm run preview`

No environment variables are required; the API URL is set in `nuxt.config.ts` and can be overridden with `NUXT_PUBLIC_API_BASE_URL`.

## Project structure

- **`components/common/`** – Reusable app components (ArticleCard, AppHeader, ErrorMessage, EmptyState)
- **`components/ui/`** – Pure UI (Button, Loader)
- **`composables/`** – `useAPI.ts` (all HTTP to the API), `useArticles.ts` (SSR fetch + domain mapping)
- **`models/api/`** – Raw API response types
- **`models/domain/`** – UI-safe article model and `mapArticleApiToDomain` mapper
- **`pages/`** – Index (list) and `articles/[id]` (detail)
- **`stores/`** – Pinia `articlesStore` (articles list cache, favorites)
- **`utils/`** – Helpers (e.g. `formatDisplayDate`)
- **`types/`** – Shared types and `ApiResponse<T>`

## API & composables strategy

- All API communication goes through **`composables/useAPI.ts`**. It exposes `getArticles()` which returns `Promise<ApiResponse<ArticlesResponseApi>>` with a 10s timeout and internal try/catch. No `$fetch` or `useFetch` of the API URL in pages or components.
- **`composables/useArticles.ts`** uses `useAsyncData` with a stable key (`'articles'`) and calls `getArticles()`, then maps the response to domain `Article[]` via `mapArticleApiToDomain`. It exposes `articles`, `pending`, `error`, and `refresh`. Pages use only this composable for data.
- SSR: the list page uses `useArticles()` so the first HTML includes the articles; the same key avoids a duplicate client request when the payload is already hydrated.

## Typing decisions

- **Strict TypeScript**: no `any`; all functions have return types.
- **Discriminated union**: `ApiResponse<T>` is `ApiResponseSuccess<T> | ApiResponseError` with a `status` discriminator; `isApiSuccess()` / `isApiError()` type guards are used in composables.
- **Raw vs domain**: API types in `models/api/` reflect the API exactly (nullable/optional fields). Domain types in `models/domain/` have required fields with fallbacks; the mapper normalizes `[Removed]`, null, and empty strings so the UI never sees undefined in required fields.

## Error-handling approach

- **useAPI**: Catches all errors (network, timeout, non-2xx), returns `{ status: 'error', error: { message, code? } }` instead of throwing.
- **useArticles**: Throws only when mapping (so `useAsyncData` can set `error`); the fetcher uses the API response and throws if `!isApiSuccess(response)` so Nuxt exposes the error to the UI.
- **UI**: List and detail pages show `<ErrorMessage>` when `error` is set, with a “Try again” that calls `refresh()`. `<Loader>` is shown while `pending`. Empty list shows `<EmptyState>`. Detail page shows “Article not found” when the id is not in the list.
- **Global**: `error.vue` is used as a fallback when a fatal error occurs; it shows the message and a “Go home” button that clears the error and redirects to `/`.

## Assumptions

- Article “id” is derived as `article-${index}` from the API array order (no id from API).
- Detail route is `/articles/[id]`; the article is resolved from the store or the composable’s list (no separate API call for a single article).
- Favorites are stored in Pinia only (no persistence in this implementation; the rules mentioned persistence plugin which can be added later).
- Figma design was not available during implementation; the UI is mobile-first with Tailwind (slate/teal palette) and scales to desktop with a simple grid.

## What I would improve with more time

- **Skeleton loaders**: Replace the spinner on the list with skeleton cards to reduce layout shift.
- **Pinia persistence**: Persist favorites to `localStorage` via a Pinia plugin.
- **Unit tests**: Vitest + Vue Test Utils for `mapArticleApiToDomain`, `getArticles` error paths, and one list/detail component.
- **E2E**: Playwright for list → detail → back and for error/retry flows.
- **Deploy**: Vercel or Netlify with a one-command deploy and document the URL in the README.
- **Offline detection**: Use `navigator.onLine` in a composable and show a banner when offline, with a prompt to refresh when back online.
