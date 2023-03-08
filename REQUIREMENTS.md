# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

User API
1. index:/users [GET] [token required]
2. create: /users [POST][token required]
3. show:/users/:id [GET] [token required]
4. update:/users/:id [PUT] [token required]
5. destroy:/users/:id [DELETE] [token required]
6. authenticate:/users/auth [POST][token required]

Product API
1. index:/products [GET] 
2. create: /products [POST][token required]
3. show:/products/:id [GET] 
4. update:/products/:id [PUT] [token required]
5. destroy:/products/:id [DELETE] [token required]
6. show product by category:/product-by-category/:cat [GET] [token required]

Orders API
1. index:/orders [GET] [token required]
2. create: /orders [POST][token required]
3. show:/orders/:id [GET] [token required]
4. update:/orders/:id [PUT] [token required]
5. destroy:/orders/:id [DELETE] [token required]
6. show Order by status:/order-by-status/:status [GET] [token required]
7. add product to order:/order-product-cart [POST] [token required]
6. view product in order:/order-product-cart/:id [GET] [token required]


## Data Shapes

#### product
-  id
- name
- price
- category

#### user
- id
- fname
- lname
- pasword
- email

#### orders
- id
- order_status
- order_date
- user_id

#### product_orders
- id
- prod_id
- order_id
- quantity


