# E-Commerce Business Website

A modern e-commerce storefront for browsing products, filtering a catalog, managing a cart, checking out, tracking orders, and reviewing an administrator dashboard.

## Features

- Customer registration and login simulation
- Product browsing, search, category filters, price filters, and rating filters
- Shopping cart with quantity controls
- Secure checkout modal with order creation
- Order tracking timeline
- Customer profile summary
- Product reviews and ratings
- Admin inventory table, low-stock view, order count, customer count, and sales reporting

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js

This version uses a zero-dependency Node static server so it runs immediately after download. The browser stores cart, account, and order data in `localStorage`.

## Project Structure

```text
ecommerce-website/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── images/
├── views/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── admin/
├── routes/
├── models/
├── controllers/
├── config/
├── package.json
├── server.js
└── README.md
```

## Installation

### Prerequisites

- Node.js
- npm

### Steps

1. Navigate to the project directory.

```bash
cd ecommerce-website
```

2. Start the application.

```bash
npm start
```

3. Open the site.

```text
http://localhost:3000
```

## Usage

### Customer

1. Browse or search products.
2. Filter by category, price, or rating.
3. Add products to the cart.
4. Open the cart and proceed to checkout.
5. Place an order and track it from the order tracking section.

### Administrator

1. Open the Admin section.
2. Review sales, open orders, customers, and low-stock totals.
3. Manage product inventory with the restock action.

## Future Enhancements

- Express.js API routes
- MongoDB or MySQL persistence
- Password encryption and full authentication
- Payment provider integration
- Wishlist functionality
- AI-based product recommendations
- Live customer support chat

## License

This project is licensed under the MIT License.
