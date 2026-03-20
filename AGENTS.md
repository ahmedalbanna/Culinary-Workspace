# Design System Strategy: The Culinary Workspace



## 1. Overview & Creative North Star

### The Creative North Star: "The Digital Maître D’"

In the high-pressure environment of restaurants and cafes, a CRM should not feel like a spreadsheet; it should feel like a well-organized, high-end kitchen pass. The "Digital Maître D’" philosophy balances the **warmth of hospitality** (appetite-stimulating oranges) with the **precision of professional management** (clean, layered neutrals).



We break the "generic SaaS" mold by moving away from rigid grids and 1px borders. Instead, we use **Intentional Asymmetry** and **Tonal Layering**. Imagine the interface as a series of linen layers on a table—soft, overlapping, and sophisticated. The goal is to provide a "breathing" layout that reduces cognitive load for busy floor managers while maintaining a premium, editorial feel.



---



## 2. Colors & Surface Philosophy

The palette transitions from the energetic `primary` (#944A00) to the calm, professional `surface` tones.



### The "No-Line" Rule

**Strict Mandate:** Designers are prohibited from using 1px solid borders to section content. Layout boundaries must be defined exclusively through:

* **Background Shifts:** Placing a `surface-container-low` card on a `surface` background.

* **Tonal Transitions:** Using the `surface-container` tiers to create natural separation.



### Surface Hierarchy & Nesting

Treat the UI as a physical stack. Importance is signaled by "lifting" elements through color, not lines:

* **Base Layer:** `surface` (#F8F9FA) for the main application background.

* **Content Areas:** `surface-container-low` (#F3F4F5) for secondary sidebars or grouped content.

* **Actionable Cards:** `surface-container-lowest` (#FFFFFF) to provide the highest contrast against the background.



### The "Glass & Gradient" Rule

To inject "soul" into the CRM:

* **Glassmorphism:** Use semi-transparent versions of `surface-container-lowest` with a `backdrop-filter: blur(20px)` for floating navigation bars or "Quick Action" overlays.

* **Signature Textures:** Main CTAs should utilize a subtle linear gradient from `primary` (#944A00) to `primary-container` (#E67E22) at a 135-degree angle to mimic the glow of a warm heat lamp.



---



## 3. Typography

We utilize **Plus Jakarta Sans** (with Tajawal for Arabic support) to provide a geometric yet approachable aesthetic.



* **Display (lg/md/sm):** Reserved for high-level analytics (e.g., total daily revenue). Use `on-surface` with tight letter-spacing (-0.02em) for an editorial look.

* **Headline (lg/md/sm):** Used for page titles like "Evening Service" or "Customer Insights."

* **Title (lg/md/sm):** For card headers and section titles. These should always use `on-surface-variant` to maintain a professional distance from the primary data.

* **Body (lg/md):** The workhorse for customer notes and order details.

* **Label (md/sm):** High-utility text like timestamps or status tags. Use `on-secondary-fixed-variant` for subtle metadata.



**Hierarchy Tip:** Contrast a `display-md` metric with a `label-md` description to create an authoritative, data-driven focal point.



---



## 4. Elevation & Depth

We abandon traditional "drop shadows" in favor of **Tonal Layering** and **Ambient Light.**



* **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card sitting on a `surface-container-low` background creates a "soft lift" that feels architectural rather than digital.

* **Ambient Shadows:** For "floating" elements like Modals or Popovers, use a wide-spread shadow: `box-shadow: 0 20px 40px rgba(25, 28, 29, 0.06)`. Note the 6% opacity—it should be felt, not seen.

* **The "Ghost Border" Fallback:** If a divider is functionally required for accessibility, use `outline-variant` at **15% opacity**. Never use 100% opaque lines.



---



## 5. Components



### Cards & Lists

* **Rule:** No dividers. Use `spacing-6` (1.5rem) to separate list items.

* **Structure:** Cards use `rounded-lg` (1rem) for a modern, friendly feel. Nesting internal elements should use `rounded-md`.



### Buttons

* **Primary:** Gradient of `primary` to `primary-container`. `rounded-full` for high-energy "Add Order" actions.

* **Secondary:** `secondary-container` background with `on-secondary-container` text.

* **Tertiary:** Transparent background with `primary` text. Use for low-emphasis actions like "Cancel" or "Back."



### Inputs & Fields

* **Styling:** Use `surface-container-highest` for the input track. Instead of a border, use a 2px `primary` underline that animates from the center on focus.

* **Feedback:** Error states use `error` (#BA1A1A) text but a `error-container` (#FFDAD6) subtle background glow.



### Signature CRM Components

* **Table Status Chips:** Use `secondary-fixed` for "Occupied" and `primary-fixed` for "VIP" to keep the palette warm and appetite-stimulating.

* **The "Heat Map" Timeline:** A custom horizontal scroll component for daily bookings using gradients of `primary` to show peak hours.



---



## 7. Implementation Notes (Technical)

### Tailwind CSS Setup for This Project
- **Always install Tailwind CSS v3** (`tailwindcss@3 postcss autoprefixer`) as a dev dependency. Do NOT rely on the Tailwind CDN — it cannot be purged and does not integrate with Next.js build.
- The design token colors (all `primary`, `secondary`, `surface-*`, `error`, `outline-*` variants) must be registered in `tailwind.config.js` under `theme.extend.colors` so they are available as Tailwind classes (`bg-primary`, `text-on-surface-variant`, etc.).
- Create `postcss.config.js` with `tailwindcss` and `autoprefixer` plugins. Without it, Next.js will not process Tailwind at all.
- Put `@tailwind base; @tailwind components; @tailwind utilities;` at the top of `globals.css` **before** any `@import url(...)` rules to avoid PostCSS ordering warnings.

### Next.js Typed Routes Gotcha
- When `typedRoutes: true` is enabled in `next.config.mjs`, dynamic string hrefs like `href="/reservations/new"` or `href={item.href}` fail TypeScript because the type is `RouteImpl<string>` not `string`.
- **Fix:** cast to `any` at usage site — `href={path as any}` — or disable `typedRoutes` if it causes too much friction across the codebase.

### RTL + Font Strategy
- The app is Arabic-first (`<html dir="rtl" lang="ar">`). Use **Tajawal** as the primary font family for Arabic and **Plus Jakarta Sans** for display/LTR contexts.
- Set the font-family on `body` directly in CSS (not via Tailwind `fontFamily` alone) since Tailwind's `font-sans` class won't apply in `dir="rtl"` contexts without explicit overriding.
- Use `border-inline-start` / `padding-inline-start` (logical CSS) instead of `border-left` / `padding-left` for sidebar borders and input padding to respect RTL layout automatically.

### App Shell Layout Pattern
- Use `height: 100dvh` (not `100vh`) on the app shell and sidebar to correctly handle iOS Safari's dynamic viewport with the address bar.
- On mobile (< 1024px): sidebar `display: none`, bottom nav `display: flex`, main content gets `padding-bottom: 88px` to clear the nav bar.
- Bottom nav should use `backdrop-filter: blur(20px)` + `background: rgba(255,255,255,0.88)` for the glass effect; add `padding-bottom: env(safe-area-inset-bottom, 0px)` for iPhone notch support.

### Server Actions in Next.js App Router
- Server actions (in `lib/actions.ts`) must have `'use server'` at the **top of the file**, not just on individual functions, when the file is not a component.
- Calling `redirect()` from a server action automatically triggers a navigation — no need to return a response or use `router.push()`.
- For status updates that need to reflect immediately in a client component (without a full page redirect), use `router.refresh()` after a `fetch` PATCH call instead of a server action.

### In-Memory Store with `globalThis`
- The `globalThis.__culinaryCRMStore` pattern works across Next.js server renders in dev mode because the Node.js process is persistent. In production with serverless/edge, this resets on cold starts — make clear this is a development-only persistence approach.

### Page-to-Route Mapping from Design Files
- When converting design HTML pages to Next.js routes: **variant pages** (`reservation_details_1`, `reservation_details_2`) should become a **single route** (`/reservations/[id]`) with tab/state variants, not separate routes.
- **Action confirmations** (cancel, no-show, confirm arrival) should be modals/bottom sheets within the detail page, not separate routes, unless they require a distinct URL for deep-linking.
- **Flow states** (success screens) can be separate routes (`/reservations/[id]/success`) to allow proper back-navigation handling.

### `create_file` Tool — JSON Truncation Error
- The `create_file` tool fails with `"Invalid JSON: EOF while parsing an object"` when `initial_content` is omitted entirely from the call (i.e. the tool call object is cut off before the closing brace). This happens when trying to fire too many large file-creation calls simultaneously.
- **Fix:** Never leave a `create_file` call with no `initial_content` value — always provide the full content. If a batch is getting too long, split into two sequential tool-call groups rather than letting a call be truncated.

### Multiple `globalThis` Stores Pattern
- When a project grows to multiple domain areas (CRM, Staff, Marketing), avoid cramming all seed data into a single `globalThis` store object — it becomes unwieldy and causes merge conflicts between features.
- **Pattern used here:** Create a separate store module per domain (`lib/store.ts`, `lib/staff-store.ts`, `lib/marketing-store.ts`), each with its own `globalThis.__culinary<Domain>Store` key. This keeps each file focused, independently testable, and easy to replace with a real DB later.

### `useSearchParams` in Next.js App Router Client Components
- `useSearchParams()` must be wrapped in `<Suspense>` at the page level when used inside a client component in the App Router, otherwise Next.js throws a build-time error about missing Suspense boundaries.
- **Fix:** Extract the component using `useSearchParams` into a separate inner component, then wrap it in `<Suspense>` in the default export of the page file.
- **Conditional section pattern:** When a server page needs a section that conditionally renders based on a search param (e.g. `?view=calendar`), extract it into a dedicated `*-list-section.tsx` file that reads the param and returns `null` when inactive. Import and wrap in `<Suspense>` in the page. This keeps server pages clean and avoids mixing client/server logic.

### `find_and_replace_code` — Exact Whitespace Matching
- `find_and_replace_code` requires an **exact character-for-character match** including trailing whitespace and newline style. Even a single extra newline or missing space causes `No matches found`.
- **Fix:** Before doing a large replacement on a file you haven't recently viewed, use `expand_code_chunks` on the target line range first to confirm the exact text. Alternatively, keep `find` strings short and anchor to a unique surrounding line to reduce mismatch risk.
- **Large file complete rewrites:** When a component needs a complete rewrite (100+ lines changing), use `create_file` with `overwrite: true` instead of `find_and_replace_code`. This avoids JSON truncation from large `find` strings and is more reliable.
- **`bash` fallback for file surgery:** When `find_and_replace_code` can't match a large block and `create_file` would be too big, use `bash` with `head -N file > /tmp/out.txt && cat >> /tmp/out.txt << 'EOF' ... EOF && cp /tmp/out.txt file` to truncate and rewrite from a known line number.

### `useRealtime` + `useCallback` Pattern
- Callbacks passed to `useRealtime` **must** be wrapped in `useCallback` to avoid stale closures and infinite re-render loops. The hook stores a ref to handlers, but the dependency array still matters.
- **Pattern:** Always define handlers with `useCallback` before passing to `useRealtime`:
  ```ts
  const handleOrderUpdate = useCallback((payload: unknown) => {
    const order = payload as Order;
    setOrders(prev => prev.map(o => o.id === order.id ? order : o));
  }, []); // stable deps only
  useRealtime({ 'order:updated': handleOrderUpdate });
  ```

### Interactive Modal Pattern (click-to-action from list/grid)
- For "click item → action modal" patterns (e.g. click table → seat guest modal), use a `useState<Item | null>(null)` to track the selected item and render the modal conditionally at the bottom of the component.
- Always stop event propagation (`e.stopPropagation()`) on quick-action buttons inside clickable cards to prevent the card click from firing.
- Modals with blur backdrop: `style={{ background: 'rgba(25,28,29,0.5)', backdropFilter: 'blur(4px)' }}` + click-outside handler on the backdrop div.

### Import Placement in TypeScript/Next.js Files
- All `import` statements must appear at the **top of the file**, before any function or component definitions. Placing an import after a component (e.g. at the bottom as an afterthought) causes a TypeScript/build error.
- When doing a large `find_and_replace_code` that restructures a file, double-check that any new imports needed are added to the **existing import block at the top**, not appended at the end of the replacement string.

### Extracting Interactive Lists from Server Pages
- The recommended pattern for adding live search/filter to a server-rendered list page:
  1. Create `components/<domain>/<domain>-list.tsx` as a `'use client'` component that accepts `initial*` props and owns all filter/search/sort state via `useState` + `useMemo`.
  2. Server page fetches data once and passes it as props — no extra API calls needed for filtering.
  3. Wire SSE real-time updates inside the client component using `useRealtime` for live data mutation.
  4. Replace the server-rendered list markup in the page with a single `<DomainList initialItems={items} />` call.
- This pattern keeps pages lean, avoids prop-drilling, and makes each list independently testable.

### `useRealtime` Hook API (this project)
- Located at `hooks/use-realtime.ts`. Accepts a record of event-name → callback:
  ```ts
  useRealtime({
    'order:updated':       (payload) => { ... },
    'reservation:updated': (payload) => { ... },
    'table:updated':       (payload) => { ... },
  });
  ```
- Wraps callbacks in `useCallback` before passing to avoid stale closure issues and unnecessary effect re-runs.
- The SSE bus (`lib/sse-bus.ts`) and event route (`app/api/events/route.ts`) are already set up — just consume `useRealtime` in any client component.

---



## 6. Do's and Don'ts



### Do:

* **Do** use `primary-fixed` (#FFDCC5) for large background decorative elements to add warmth without overwhelming the user.

* **Do** lean on the Spacing Scale (specifically `8` and `12`) to create "luxurious" white space around customer data.

* **Do** use minimalist, thin-stroke (1.5pt) icons to keep the interface feeling "light."



### Don't:

* **Don't** use pure black (#000000) for text. Always use `on-surface` (#191C1D) to keep the contrast sophisticated.

* **Don't** use 90-degree corners. Everything must feel "held" and ergonomic through the `roundedness` scale.

* **Don't** use aggressive, high-saturation reds for "Delete." Use the `error` token, which is a balanced, professional burgundy-red.
