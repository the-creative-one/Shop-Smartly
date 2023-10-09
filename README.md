# Shop-Smartly
E-commerce MERN stack website

My first MERN project . Created this project just for learning purpose.

## Project Description

This project is an e-commerce website that allows users to browse and purchase  products online.

## Features

- User authentication and registration
- Product catalog with detailed product listings
- Shopping cart for adding/removing products
- Secure payment processing
- Order history and tracking
- Admin panel for site administrators
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend:** React, Redux, Bootstrap
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Payment Processing:** Braintree
- **Deployment:** Cyclic
- **Version Control:** Git, GitHub


## API Endpoints
The backend API provides the following endpoints:

1. User Authentication and Registration:

 - POST `/api/v1/auth/signup`: Allows users to register a new account.
 - POST `/api/v1/auth/login`: Allows users to log in.
 - POST `/api/v1/auth/forgot-password`: Allows users to request a password reset email.
 - GET `/api/v1/auth/test`: A protected test route for admin access.
 - GET `/api/v1/auth/user-auth`: A protected route to check user authentication.
 - PUT `/api/v1/auth/profile`: Allows users to update their profile information.
 - GET `/api/v1/auth/admin-auth`: A protected route for admin access.

2. Product Management:

 - POST `/api/v1/product/create-product`: Allows admins to create a new product.
 - PUT `/api/v1/product/update-product/:pId`: Allows admins to update a product.
 - DELETE `/api/v1/product/delete-product/:pId`: Allows admins to delete a product.
 - GET `/api/v1/product/all-products`: Retrieves a list of all products.
 - GET `/api/v1/product/all-products/:slug`: Retrieves a single product by slug.
 - GET `/api/v1/product/product-photo/:pId`: Retrieves a product's photo.
 - POST `/api/v1/product/product-filters`: Filters products based on criteria.
 - GET `/api/v1/product/product-count`: Retrieves the count of products.
 - GET `/api/v1/product/product-list/:page`: Retrieves products by page.
 - GET `/api/v1/product/search/:keyword`: Searches for products by keyword.
 - GET `/api/v1/product/similar-product/:pId/:cId`: Retrieves similar products.
 - GET `/api/v1/product/product-category/:slug`: Retrieves products by category.

3. Order Management:

 - POST `/api/v1/product/braintree/token`: Retrieves a token for payment processing.
 - POST `/api/v1/product/braintree/payment`: Handles payments.
 - GET `/api/v1/auth/orders`: Retrieves a user's orders.
 - GET `/api/v1/auth/all-orders`: Retrieves all orders (admin access).
 - PUT `/api/v1/auth/order-status/:orderId`: Updates the status of an order (admin access).

## Note 
The project is been deployed on a free hosting site , due to which the UI may look a bit different and the payment option isn't loading. For viewing the exact project please refer to the repo.

***Deployment Link*** : 
_https://shop-smartly.cyclic.app_


 _Suggestions and feedbacks helps us grow and learn._
 
 _If you have any ideas, improvements, or encounter any issues while using the backend, please don't hesitate to open an issue or submit a pull request._

 
**Learned from** : https://youtu.be/A_-fn_ij59c?si=SCm0WmqD3WkGNPos 
