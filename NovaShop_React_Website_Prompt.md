# NovaShop --- React E-commerce Website Recreation Prompt

## Main Instruction

Create a **production-quality React e-commerce website** named
**NovaShop**, using the attached reference screenshot as the **primary
visual reference**.

The goal is to reproduce the reference design **as closely as possible
in layout, spacing, proportions, typography, colors, cards, icons,
sidebar, product grid, cart panel, and overall visual hierarchy**.

Do not create a generic e-commerce template. The implementation must
specifically follow the structure and visual language shown in the
reference image.

> **Reference image:** Use the attached screenshot as the visual source
> of truth. Match the design as closely as practical while using
> original/local product assets or royalty-free image URLs rather than
> copying protected assets.

------------------------------------------------------------------------

# 1. Technology Requirements

Build the project with:

-   React
-   Vite
-   JavaScript/JSX
-   React Router DOM
-   Tailwind CSS
-   Lucide React for icons
-   Framer Motion only where animation improves the UI
-   Responsive CSS
-   Component-based architecture

Use clean, beginner-friendly React code.

Do not put the entire application into one huge component.

------------------------------------------------------------------------

# 2. Required Project Structure

Create a clean structure similar to:

``` text
src/
├── assets/
│   ├── products/
│   ├── banners/
│   └── logo/
│
├── components/
│   ├── Navbar/
│   ├── Sidebar/
│   ├── HeroBanner/
│   ├── CategoryMenu/
│   ├── PromoCards/
│   ├── ProductCard/
│   ├── ProductGrid/
│   ├── CartSidebar/
│   ├── RecommendedProducts/
│   ├── TrustFeatures/
│   └── Footer/
│
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── Categories.jsx
│   ├── Deals.jsx
│   ├── Orders.jsx
│   ├── Coupons.jsx
│   ├── Addresses.jsx
│   └── AccountSettings.jsx
│
├── data/
│   └── products.js
│
├── context/
│   ├── CartContext.jsx
│   └── ThemeContext.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

Adjust the structure if necessary, but keep components reusable.

------------------------------------------------------------------------

# 3. Overall Layout

The desktop homepage should closely reproduce the screenshot:

``` text
┌─────────────────────────────────────────────────────────────────┐
│                         TOP HEADER                              │
├───────────────┬────────────────────────────────┬────────────────┤
│               │                                │                │
│   LEFT        │       MAIN CONTENT             │   RIGHT CART   │
│   SIDEBAR     │                                │   SIDEBAR      │
│               │                                │                │
│   Logo        │   Search Bar                   │   My Cart (4)  │
│   Navigation  │   Hero Banner                  │   Cart Items    │
│   Promo Card  │   Categories                   │   Coupon       │
│   Help        │   Promotional Cards             │   Summary      │
│   Theme       │   Best Deals                   │   Checkout     │
│               │   Recommended                  │                │
│               │   Trust Features               │                │
└───────────────┴────────────────────────────────┴────────────────┘
```

The page should feel like a modern premium fashion/lifestyle
marketplace.

------------------------------------------------------------------------

# 4. Left Sidebar

Create a fixed/sticky-looking desktop sidebar matching the screenshot.

## Logo

At the top:

-   Shopping bag icon
-   `NovaShop`
-   Bold dark text
-   Clean white card/container
-   Rounded corners

## Main Navigation

Include:

-   Home
-   Categories
-   Deals
-   New Arrivals
-   Best Sellers
-   Brands
-   Collections

Use Lucide React icons.

The active `Home` item must have:

-   Purple gradient/background
-   White icon
-   White text
-   Rounded pill/card shape

## Secondary Navigation

Include:

-   My Orders
-   Wishlist
-   Coupons
-   Addresses
-   Account Settings

## Sidebar Promo Card

Create a large purple/pink gradient promotional card near the lower part
of the sidebar:

``` text
Special Offer

Summer Sale

Up to 50% Off

[ Shop Now ]

Decorative shopping bags / percentage graphics
```

The card should visually resemble the reference screenshot.

## Bottom Sidebar

Include:

``` text
Need Help?
24/7 Support Center
```

Then a theme control:

``` text
☀ Light Mode >
```

Make the theme switch functional.

------------------------------------------------------------------------

# 5. Top Header

The main content should start with a wide header.

## Search Bar

Create a rounded search input:

``` text
Search for products, brands and more...
```

Add a search icon on the right.

It should actually filter/search products.

## Wishlist

Show:

-   Heart icon
-   `Wishlist`

Clicking it should navigate to the wishlist page.

## Notification

Show:

-   Bell icon
-   Small red notification badge

## User Profile

Show:

-   Circular profile image
-   `Alina Putri`
-   Small dropdown chevron

Create a small profile dropdown when clicked.

------------------------------------------------------------------------

# 6. Hero Banner

Create a large rounded hero banner matching the screenshot.

Use a purple/lavender/pink gradient background.

The hero should contain:

``` text
New Collection

Find Your Style,
Love Your Look ✨

Discover the latest trends in fashion,
beauty, and lifestyle.

[ Shop Now → ]
```

On the right side show a fashionable model/product lifestyle image.

Use an appropriate royalty-free image or local asset.

Important:

-   Rounded corners
-   Purple/pink gradient
-   Large typography
-   Image positioned on the right
-   Text aligned left
-   White button
-   Small carousel dots at the bottom
-   Responsive on mobile

Implement the hero as a functional carousel with 3 slides.

------------------------------------------------------------------------

# 7. Category Section

Immediately below the hero, create circular category items.

Categories:

-   Fashion
-   Beauty
-   Electronics
-   Home & Living
-   Sports
-   More

Each category should have:

-   Circular light-colored background
-   Lucide icon
-   Category title
-   Hover animation

Clicking a category should filter/navigate to the appropriate product
list.

------------------------------------------------------------------------

# 8. Promotional Cards

Create three horizontal cards similar to the screenshot.

### Card 1

``` text
Flash Sale

Limited time deals

Up to 50% OFF

02 : 45 : 18
```

Include a fashion bag/product image.

### Card 2

``` text
Free Shipping

On orders over $50

Shop now →
```

Include a package/box image.

### Card 3

``` text
New Arrivals

Check out the latest trends

Shop now →
```

Include a sunglasses/fashion image.

Cards should have soft pastel backgrounds and rounded corners.

------------------------------------------------------------------------

# 9. Best Deals Section

Section title:

``` text
Best Deals for You
                         View All
```

Create a horizontally scrollable/product grid.

Use product cards similar to the screenshot.

Example products:

1.  Air Max 270 React
2.  Apple Watch Series 9
3.  Chanel Chance Eau Tendre EDP
4.  Sony WH-1000XM5

Each product card must include:

-   Product image
-   Discount badge
-   Wishlist heart
-   Product title
-   Category/subtitle
-   Current price
-   Previous price
-   Discount percentage
-   Rating
-   Review count
-   Add-to-cart button

Example visual information:

``` text
Air Max 270 React
Women's Shoes

$129.99   $149.99

★ 4.8 (124)
```

Do not hardcode only the UI. Store products in `products.js`.

------------------------------------------------------------------------

# 10. Recommended For You

Create another section:

``` text
Recommended for You
                         View All
```

Products should include:

-   Oversized Cotton Shirt
-   Minimalist Shoulder Bag
-   The Ordinary Niacinamide
-   Fossil Gen 6 Smartwatch

Each product card should include:

-   Product image
-   Discount badge
-   Product title
-   Price
-   Old price
-   Color options
-   Circular add-to-cart button

------------------------------------------------------------------------

# 11. Right Cart Sidebar

The right side of the desktop layout is extremely important.

Reproduce the reference cart panel closely.

Header:

``` text
My Cart (4)                              ×
```

Create four cart items.

### Cart item structure

Each item:

-   Product thumbnail
-   Product name
-   Product category
-   Price
-   Quantity controls
-   Delete icon
-   Small wishlist/heart button if appropriate

Example:

``` text
Air Max 270 React
Women's Shoes
$129.99

−   1   +
```

Repeat for:

-   Air Max 270 React
-   Chanel Chance Eau Tendre EDP
-   Minimalist Shoulder Bag
-   Gentle Monster sunglasses

------------------------------------------------------------------------

# 12. Coupon Section

Below cart items:

``` text
Promo Code

[ Enter code              ] [ Apply ]
```

Implement working coupon behavior.

Example coupon:

``` text
SAVE10
```

When valid, calculate a discount.

------------------------------------------------------------------------

# 13. Cart Summary

Show:

``` text
Subtotal                 $459.97
Discount                 -$46.90
Shipping                 Free

Total                    $413.07
```

Make calculations dynamic based on cart state.

------------------------------------------------------------------------

# 14. Checkout Button

Large purple button:

``` text
🔒 Checkout (4) →
```

The number should dynamically reflect the total quantity in the cart.

Button should work and navigate to a checkout page or show a checkout
confirmation.

------------------------------------------------------------------------

# 15. Payment Methods

At the bottom of the cart panel show small payment method logos/text
such as:

-   Visa
-   Mastercard
-   PayPal
-   Apple Pay
-   Google Pay

Keep them visually subtle and aligned like the reference.

------------------------------------------------------------------------

# 16. You Might Also Like

Below the cart summary create:

``` text
You might also like
```

Show small recommendation cards.

Example:

``` text
Ray-Ban Wayfarer
Classic Black
$158.00        +

Nike Air Force 1 '07
White
$109.99        +
```

The `+` button must add the product to the cart.

------------------------------------------------------------------------

# 17. Recently Viewed

Create:

``` text
Recently Viewed
```

Display small square product thumbnails in a horizontal row.

Use:

-   Watch
-   Purple hoodie
-   Green bag
-   Perfume

Clicking an item should open the product details page.

------------------------------------------------------------------------

# 18. Trust Feature Bar

At the bottom of the main content area create four features:

``` text
Secure Payment
100% secure payment

Easy Returns
30-day return policy

24/7 Support
Dedicated support

Trusted by Thousands
4.8 average rating
```

Use appropriate Lucide icons.

Use a very light purple background and rounded container.

------------------------------------------------------------------------

# 19. Footer

Create a polished responsive footer below the homepage.

Include:

### NovaShop

``` text
Shop smarter. Live better.
```

### Shop

-   All Products
-   New Arrivals
-   Best Sellers
-   Deals

### Customer Service

-   Contact Us
-   Shipping
-   Returns
-   FAQ

### Follow Us

Use Lucide/social icons.

### Newsletter

``` text
Subscribe to our newsletter

[ Your email ] [ Subscribe ]
```

Footer must work in both light and dark mode.

------------------------------------------------------------------------

# 20. Product Data

Create a realistic product dataset with at least **30 products**.

Each object should contain:

``` js
{
  id,
  name,
  category,
  subcategory,
  price,
  oldPrice,
  discount,
  rating,
  reviews,
  image,
  colors,
  description,
  featured,
  bestDeal,
  recommended
}
```

Include categories:

-   Fashion
-   Beauty
-   Electronics
-   Home & Living
-   Sports
-   Accessories

------------------------------------------------------------------------

# 21. Functional Features

The application must not be only a visual mockup.

Implement:

### Product Search

Search by:

-   Product name
-   Category
-   Brand

### Category Filtering

Click category → show matching products.

### Add to Cart

Add products from:

-   Product cards
-   Recommended section
-   You might also like section
-   Product details

### Quantity

Support:

-   Increase quantity
-   Decrease quantity
-   Remove product

### Wishlist

Heart buttons should toggle wishlist state.

### Cart Count

Navbar/cart count must update dynamically.

### Product Details

Clicking a product opens:

``` text
/products/:id
```

with:

-   Large image
-   Product name
-   Price
-   Rating
-   Description
-   Colors
-   Quantity
-   Add to cart

### Coupon

Implement at least one working coupon such as:

``` text
SAVE10
```

### Theme

Implement:

-   Light Mode
-   Dark Mode

Persist selected theme using `localStorage`.

### Responsive Navigation

On mobile:

-   Hide desktop sidebar
-   Use mobile top navbar
-   Add hamburger menu
-   Cart opens as a drawer
-   Product grid becomes 1--2 columns

------------------------------------------------------------------------

# 22. Routing

Use `react-router-dom`.

Required routes:

``` text
/
 /products
 /products/:id
 /categories
 /deals
 /new-arrivals
 /best-sellers
 /brands
 /collections
 /orders
 /wishlist
 /coupons
 /addresses
 /account-settings
 /cart
 /checkout
```

All navigation links must work.

No broken routes.

------------------------------------------------------------------------

# 23. Design System

Follow the screenshot closely.

### Main colors

Use a palette around:

-   White
-   Very light gray
-   Soft lavender
-   Purple
-   Violet
-   Pink accents
-   Dark charcoal text
-   Light gray borders

Primary action color should be a modern purple/violet.

### Border radius

Use generous rounded corners:

-   Cards: `16px–22px`
-   Buttons: `10px–14px`
-   Search: pill/rounded
-   Product images: rounded corners

### Shadows

Use soft, subtle shadows.

Avoid heavy black shadows.

### Typography

Use a modern clean font such as:

``` text
Inter
```

or another close modern sans-serif.

------------------------------------------------------------------------

# 24. Exact Visual Matching Requirements

Compare the finished website with the reference screenshot.

Pay special attention to:

1.  Sidebar width
2.  Main content width
3.  Right cart panel width
4.  Header height
5.  Hero banner height
6.  Product card dimensions
7.  Gaps between cards
8.  Border radius
9.  Font sizes
10. Font weights
11. Purple gradient
12. Pastel backgrounds
13. Icon sizes
14. Image cropping
15. Button shapes
16. White space
17. Alignment
18. Vertical spacing
19. Cart item spacing
20. Overall page proportions

Do not randomly redesign the layout.

The screenshot is the visual reference.

------------------------------------------------------------------------

# 25. Responsive Design

### Desktop

Reproduce the 3-column structure:

``` text
Sidebar | Main Content | Cart
```

### Tablet

Use:

``` text
Sidebar | Main Content
```

The cart can become a drawer.

### Mobile

Use:

``` text
Top Navbar
Hero
Categories
Promo Cards
Product Sections
Bottom/Drawer Cart
```

No horizontal page overflow.

All text and buttons must remain usable.

------------------------------------------------------------------------

# 26. Accessibility

Add:

-   Semantic HTML
-   `alt` text for images
-   Accessible buttons
-   Keyboard-friendly controls
-   Proper form labels
-   Good color contrast
-   Focus states

------------------------------------------------------------------------

# 27. Performance

Optimize the website:

-   Reusable components
-   Avoid unnecessary re-renders
-   Lazy-load large images where appropriate
-   Keep product data separate
-   Use stable React keys
-   Avoid duplicated code

------------------------------------------------------------------------

# 28. Error Prevention

Before finishing:

-   Check every import
-   Check every route
-   Check every image path
-   Check every component name
-   Check every state variable
-   Check event handlers
-   Check Tailwind classes
-   Check responsive behavior
-   Check browser console for errors

The final project must run with:

``` bash
npm install
npm run dev
```

and must not produce unresolved import errors.

------------------------------------------------------------------------

# 29. Important Implementation Rule

Do not replace functional behavior with fake buttons.

Every important interaction should work:

-   Search
-   Navigation
-   Category filtering
-   Add to cart
-   Quantity update
-   Remove from cart
-   Wishlist
-   Coupon
-   Theme switch
-   Product details
-   Checkout
-   Mobile menu

Use React state/context where appropriate.

------------------------------------------------------------------------

# 30. Final Quality Target

The final website should feel like a **real premium e-commerce
application**, not a simple student demo.

Target qualities:

-   Pixel-close to the reference screenshot
-   Modern
-   Clean
-   Premium
-   Responsive
-   Functional
-   Accessible
-   Componentized
-   Maintainable
-   Smooth interactions
-   No console errors
-   No broken links
-   No missing images
-   No unfinished sections

## Final instruction

**Use the attached NovaShop screenshot as the primary visual reference
and recreate the page as closely as possible in React. Preserve the same
overall composition, 3-column desktop layout, sidebar navigation, hero
banner, categories, promotional cards, product sections, right-side
cart, recommendation areas, trust bar, colors, spacing, rounded cards,
typography, and visual hierarchy.**

Where the screenshot contains an image or brand/product asset that
cannot be legally or technically reused, use a visually similar
royalty-free/local asset while preserving the same layout and
appearance.

Build the complete working application rather than only creating the
homepage UI.
