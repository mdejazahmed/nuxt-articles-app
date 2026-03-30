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

## Save for Later & `/saved` Reading List

This feature lets users bookmark articles from both the list page and the article detail page. A dedicated `/saved` page shows the user’s reading list.

### Design decisions

- **Separate “reading list” from “likes/dislikes”**: the store maintains `savedArticleIds` independently from `favorites` / `dislikes`, so bookmark UX doesn’t interfere with the existing reaction behavior.
  - Implementation: [`stores/articlesStore.ts`](stores/articlesStore.ts) (`savedArticleIds`, `scheduledRemovalIds`, and saved ordering getters).
- **Instant UI updates (optimistic)**: when a user toggles a bookmark, the UI updates immediately by mutating the Pinia store first, then running an async persistence probe.
  - Implementation: [`composables/useReadingList.ts`](composables/useReadingList.ts) (`toggleSaveImmediate()`).
- **Rollback on persistence failure**: after optimistic mutation, the app verifies that `localStorage` is writable. If it fails (e.g. private mode/quota), the store is reverted to the previous `savedArticleIds` snapshot and an error is surfaced via toast.
  - Persistence probe: [`utils/reading-list-persist.ts`](utils/reading-list-persist.ts).
- **Undo only on `/saved`**: unsaving from `/saved` starts a 4-second undo window using `scheduledRemovalIds` + a timer. The item is removed permanently only after the timer commits.
  - Implementation: [`pages/saved.vue`](pages/saved.vue) and [`stores/articlesStore.ts`](stores/articlesStore.ts).
  - Trade-off: refreshing during the undo window clears pending timers, so an undo after reload is not guaranteed.
- **No navigation/layout shift while saving from lists**: the bookmark control is inside the card and uses an in-card `<button>` with `@click.stop.prevent` so clicking it does not trigger the surrounding `NuxtLink`.
  - Implementation: [`components/common/ArticleCard.vue`](components/common/ArticleCard.vue).
- **Persist across refreshes**: `savedArticleIds` is persisted using `pinia-plugin-persistedstate` via a client plugin.
  - Implementation: [`plugins/pinia-persisted.client.ts`](plugins/pinia-persisted.client.ts).

### Accessibility approach and trade-offs

- Bookmark, Undo, Remove, and view-toggle controls use real `<button>` elements with accessible labels (`aria-label` / `aria-pressed` where appropriate).
  - Implementation: [`components/common/ArticleCard.vue`](components/common/ArticleCard.vue), [`components/common/AppHeader.vue`](components/common/AppHeader.vue).
- Persistence errors use the shared toast system:
  - Toast rows use semantic roles (`role="alert"`/`role="status"`) and `aria-live`, so assistive tech announces failures.
  - Implementation: [`components/common/ToastHost.vue`](components/common/ToastHost.vue), [`components/common/ToastItem.vue`](components/common/ToastItem.vue), [`composables/useToast.ts`](composables/useToast.ts).
- Trade-off: the 4-second undo window is time-based; while the UI shows “Removing…” + an `Undo` button, the remaining time/countdown itself is not announced.

### Animation strategy explanation

- **Optimistic actions avoid motion**: the bookmark button is absolutely positioned, so toggling only changes icon/state and does not reflow the card (minimizing layout shift).
- **Toast progress animation**: `ToastItem` animates its 4-second dismissal progress bar using `requestAnimationFrame`.
- **Undo UX is intentionally minimal**: `/saved` uses a static “Removing…” state rather than a complex enter/exit animation to keep motion predictable.

### What you would improve with more time

- Add success toasts for save/unsave actions (not only error feedback).
- Persist scheduled undo state so an undo survives refresh within the 4-second window.
- Improve assistive-technology announcements around the undo window start/expiry.
- Add more UI-level tests for the bookmark button and the `/saved` undo strip.

## What I would improve with more time

- **Skeleton loaders**: Replace the spinner on the list with skeleton cards to reduce layout shift.
- **Pinia persistence**: Persist favorites to `localStorage` via a Pinia plugin.
- **Unit tests**: Vitest + Vue Test Utils for `mapArticleApiToDomain`, `getArticles` error paths, and one list/detail component.
- **E2E**: Playwright for list → detail → back and for error/retry flows.
- **Deploy**: Vercel or Netlify with a one-command deploy and document the URL in the README.
- **Offline detection**: Use `navigator.onLine` in a composable and show a banner when offline, with a prompt to refresh when back online.

## Toast Notification System

This app uses a small, library-free toast system to surface save/unsave feedback and other UI events.

### Design decisions

- **No external libraries**: implemented from scratch using a Nuxt composable plus a single host component.
- **Global, client-safe API**: [`composables/useToast.ts`](composables/useToast.ts) exposes `toast.success()`, `toast.error()`, and `toast.info()` and is callable from any composable or page.
- **SSR-safe state storage**: the toast queue is stored via Nuxt [`useState`](https://nuxt.com/docs/api/composables/use-state) as JSON-serializable data only (`id`, `message`, `variant`, `actionLabel`). Toast action handlers (callbacks) are stored in a module-scoped `Map` so no functions ever go into state.
- **Newest toast on top**: new toasts are prepended to the queue so the stack appears “newest first” vertically.
- **4-second auto-dismiss with pause**: each toast schedules dismissal for 4s and pauses/resumes on hover.
- **Teleport to escape stacking contexts**: toasts are rendered with Vue `<Teleport to="body">` to avoid layout-tree z-index conflicts.

### Accessibility approach and trade-offs

- **Semantic roles**:
  - `success` / `info`: `role="status"` with `aria-live="polite"`
  - `error`: `role="alert"` with `aria-live="assertive"`
- **Atomic announcements**: each toast sets `aria-atomic="true"` so assistive tech treats the content as one unit.
- **Controls**: dismiss uses a real `<button>` with `aria-label="Dismiss"`, and the optional action uses a labeled `<button>`.
- **Trade-off**: the optional action is callback-based, so it is only meaningful on the client (actions are registered in the in-memory handler map).

### Animation strategy explanation

- **Progress bar = countdown**: `ToastItem` drives a progress bar from a computed ratio of remaining time.
- **Pause on hover**: the countdown is implemented with `requestAnimationFrame` + a `remainingMs` ref so the timer genuinely stops when hovered and resumes on mouse leave (rather than relying only on CSS animations).
- **Enter/exit**: the implementation focuses on accurate timing and minimal complexity; toasts rely on position + progress rather than elaborate transitions.

### What you would improve with more time

- Respect `prefers-reduced-motion` by reducing/removing the rAF-driven progress animation.
- Add keyboard interactions for pausing/dismissing (e.g. Escape to dismiss, or focus-based pause).
- Consider persisting active toasts across refreshes (so Undo actions survive reload in more cases).
- Add unit tests for toast queue ordering and hover pause behavior (progress/timer logic can be tested with fake timers).

## Transitions & Motion (tokens + UX animations)

This feature adds mandatory UI transitions across navigation, filtering/search, drawer open/close, toast enter/exit, and save-button state.

### Design decisions for each new feature

- Page navigation (list ↔ detail):
  - Nuxt `pageTransition` is enabled with `name: "page"` and `mode: "out-in"` in `nuxt.config.ts`.
  - The animation is implemented as global CSS hooks (`.page-*`) so the same transition applies consistently to every page swap.

- Article list filtering / search (cards in/out):
  - Both `pages/index.vue` and `pages/saved.vue` use Vue `<TransitionGroup name="article-list">` so filtered results animate rather than snap.

- Drawer open / close (right slide-over):
  - Search is rendered by a dedicated component `components/common/ArticlesSearchDrawer.vue` using a Teleport overlay.
  - The backdrop fades in/out and the panel slides in from the right using named transition classes (`drawer-backdrop-*`, `drawer-panel-*`).

- Toast enter / exit (bottom-right):
  - `components/common/ToastHost.vue` wraps the toast stack with `<TransitionGroup name="toast">` so toasts animate when added/removed.

- Save button state (smooth icon swap):
  - Both the detail-page bookmark button and the card bookmark overlay crossfade icon state using Vue `<Transition mode="out-in" name="save-icon">`.

### Accessibility approach and trade-offs

- Reduced motion is centralized:
  - `assets/css/motion.css` defines all motion durations and easings and overrides them under `@media (prefers-reduced-motion: reduce)`, so the entire UI collapses motion from one place.

- Drawer accessibility:
  - The drawer uses `role="dialog"` and `aria-modal="true"`.
  - Closing works via backdrop click and `Escape`.
  - When opened, the search input is focused for immediate keyboard interaction.
  - Trade-off: a full focus trap (cycle Tab within the drawer) and focus restoration to the invoking element are not implemented.

- Toast accessibility:
  - The toast system already uses semantic roles and `aria-live`; the motion changes are purely visual and do not alter announcement behavior.

### Animation strategy explanation

- Single source of truth for timing:
  - Motion variables live in `assets/css/motion.css` as CSS custom properties (`--motion-duration-*`, `--motion-ease-*`).
  - Tailwind exposes these as tokens (`duration-motion-*`, `ease-motion-*`) via `tailwind.config.ts`, so durations/easing are not scattered across components.

- Transition implementation pattern:
  - Nuxt page swaps use `pageTransition` + global `.page-*` CSS.
  - List and toast enter/leave use Vue `TransitionGroup` names with matching global CSS hooks.
  - Icon swaps use Vue `Transition` (`mode="out-in"`) with CSS hooks named `save-icon-*`.

### What you would improve with more time

- Add a proper focus trap and focus restoration for the search drawer.
- Ensure the toast progress/countdown behavior also respects `prefers-reduced-motion` (currently motion respects reduced motion via CSS, but the rAF-driven progress timer can still run).
- Expand automated visual regression checks for the key transitions (especially reduced-motion mode).
