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



## 6. Do's and Don'ts



### Do:

* **Do** use `primary-fixed` (#FFDCC5) for large background decorative elements to add warmth without overwhelming the user.

* **Do** lean on the Spacing Scale (specifically `8` and `12`) to create "luxurious" white space around customer data.

* **Do** use minimalist, thin-stroke (1.5pt) icons to keep the interface feeling "light."



### Don't:

* **Don't** use pure black (#000000) for text. Always use `on-surface` (#191C1D) to keep the contrast sophisticated.

* **Don't** use 90-degree corners. Everything must feel "held" and ergonomic through the `roundedness` scale.

* **Don't** use aggressive, high-saturation reds for "Delete." Use the `error` token, which is a balanced, professional burgundy-red.
