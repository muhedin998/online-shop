# Frontend Backend Reference

Definitive reference of the Online Shop API for the Angular frontend team. Includes authentication, endpoints, request/response models, validation rules, pagination, and error formats. Base path for all endpoints: `/api/v1`.

Back-end tech: Spring Boot 3, JWT auth, JPA, Flyway. Swagger/OpenAPI: `/v3/api-docs`, Swagger UI: `/swagger-ui/index.html`.


## Auth & Headers
- Authorization: `Authorization: Bearer <jwt>` for all protected routes.
- Content type: `Content-Type: application/json` for JSON bodies.
- CORS (dev): allowed origin currently set to `http://localhost:4201`. If you serve Angular on another port (e.g., 4200), backend must update CORS config.
- Token contents: JWT subject = username only; no roles in token; no refresh token.


## Error Format
Global errors use a unified shape:
```
{
  "timestamp": "2025-01-01T12:34:56.789",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "path": "/api/v1/products",
  "details": {
    "fieldName": "error message"
  }
}
```
Common `errorCode` values: `VALIDATION_ERROR`, `CONSTRAINT_VIOLATION`, `INVALID_CREDENTIALS`, `ACCOUNT_DISABLED`, `ACCOUNT_LOCKED`, `AUTHENTICATION_FAILED`, `ACCESS_DENIED`, `INTERNAL_SERVER_ERROR`.


## Pagination
Endpoints returning `Page<T>` follow Spring’s default JSON:
- Query params: `page` (0-based), `size`, `sort` (e.g., `name,asc` or `price,desc`).
- Response structure (excerpt):
```
{
  "content": [ /* array of T */ ],
  "number": 0,
  "size": 20,
  "totalElements": 123,
  "totalPages": 7,
  "first": true,
  "last": false,
  "sort": { "sorted": true, "unsorted": false, "empty": false }
}
```


## Authentication
Base: `/api/v1/auth`

- POST `/register`
  - Body:
    - `username` string (3–50, required)
    - `email` valid email (required)
    - `password` string (min 8, required)
    - `firstName` string (optional)
    - `lastName` string (optional)
  - Response 201: `UserDto`
  - Example request:
```
{
  "username": "jane",
  "email": "jane@example.com",
  "password": "StrongPass123!",
  "firstName": "Jane",
  "lastName": "Doe"
}
```
  - Example response:
```
{
  "id": 1,
  "username": "jane",
  "email": "jane@example.com",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

- POST `/login`
  - Body:
    - `username` string (required)
    - `password` string (required)
    - `permanent` boolean (optional, unused server-side)
  - Response 200: `{ "token": string }`
  - Notes: token JWT contains only subject=username.

- POST `/forgot-password`
  - Body: `{ "email": string }` (required, valid email)
  - Response 200: `{ "message": string }` (generic success to avoid email enumeration)

- POST `/reset-password`
  - Body:
    - `token` string (required)
    - `newPassword` string (min 8, required)
  - Response 200: `{ "message": string }`

Models:
- `UserDto`: `{ id: number, username: string, email: string, firstName?: string, lastName?: string }`


## Users
Base: `/api/v1/users` (auth required)

- GET `/{username}` → `UserDto`
  - Path: `userUsername` = username string
  - Response 200: `UserDto`
  - Note: There is no `/me` endpoint; FE must track username after login (from form) or decode JWT subject to fetch this.

- GET `/{username}/roles` → `UserRolesDto`
  - Response 200:
```
{ "username": "jane", "roles": ["ROLE_USER", "ROLE_ADMIN"] }
```


## Products
Base: `/api/v1/products`

- POST `/` (ROLE_ADMIN)
  - Body `CreateProductRequestDto`:
```
{
  "name": "string",                // required, not blank
  "description": "string",          // optional
  "price": 9.99,                     // required, > 0
  "stockQuantity": 10,               // required, >= 0
  "featured": true,                  // required
  "categoryId": 1                    // optional (can be null)
}
```
  - Response 201: `ProductDto`

- DELETE `/{productId}` (ROLE_ADMIN)
  - Response 204

- PUT `/update/{productId}` (ROLE_ADMIN or ROLE_EMPLOYEE)
  - Body `UpdateProductRequestDto` (all optional; only send fields to update):
```
{
  "name": "string",
  "description": "string",
  "price": 19.99,                    // > 0
  "stockQuantity": 5,                // >= 0
  "featured": false,
  "categoryId": 2
}
```
  - Response 200: `ProductDto`

- GET `/featured` (public)
  - Response 200: `ProductDto[]`

- GET `/` (public)
  - Query: pagination `page,size,sort`
  - Response 200: `Page<ProductDto>` (non-featured products only)

- GET `/{productId}` (public)
  - Response 200: `ProductDto`

- GET `/search` (public)
  - Query params (all optional):
    - `searchText` string (<=255)
    - `categoryId` number (>=1)
    - `minPrice` number (>=0)
    - `maxPrice` number (>=0)
    - `featured` boolean
    - `inStock` boolean
    - plus pagination `page,size,sort`
  - Response 200: `Page<ProductDto>`

Models:
- `ProductDto`:
```
{
  "id": 1,
  "name": "string",
  "description": "string",
  "price": 9.99,
  "stockQuantity": 25,
  "featured": true,
  "mainImageUrl": "https://...",
  "carouselImageUrls": ["https://...", "https://..."],
  "category": { "id": 1, "name": "string", "description": "string" }
}
```


## Categories
Base: `/api/v1/categories`

- GET `/` (public) → `ProductCategoryDto[]`
- GET `/{id}` (public) → `ProductCategoryDto`
- POST `/` (ROLE_ADMIN)
  - Body `CreateProductCategoryRequestDto`:
```
{ "name": "string", "description": "string" }
```
  - `name` required, not blank; `description` optional
  - Response 201: `ProductCategoryDto`
- PUT `/{id}` (ROLE_ADMIN)
  - Body `UpdateProductCategoryRequestDto` (same shape; `name` required)
  - Response 200: `ProductCategoryDto`
- DELETE `/{id}` (ROLE_ADMIN) → 204

Model:
- `ProductCategoryDto`: `{ id: number, name: string, description?: string }`


## Cart
Base: `/api/v1/cart` (auth required)

- GET `/{userId}` → `CartDto`

- POST `/add`
  - Body `AddItemToCartRequestDto`:
```
{ "productId": 5, "userId": 1, "quantity": 2 } // quantity >= 1
```
  - Response 200: `CartDto`

- PUT `/{userId}/update-quantity/{itemId}`
  - Path `itemId` is the cart item ID returned in `CartItemDto.id`
  - Body `UpdateItemQuantityDto`:
```
{ "quantity": 3 } // >= 1
```
  - Response 200: `CartDto`

- DELETE `/delete/{userId}/items/{itemId}` → 204

Models:
- `CartDto`:
```
{
  "id": 10,
  "userId": 1,
  "items": [ { "id": 42, "productId": 5, "productName": "string", "quantity": 2, "price": 9.99 } ],
  "totalPrice": 19.98
}
```
- `CartItemDto`: `{ id: number, productId: number, productName: string, quantity: number, price: number }`


## Orders
Base: `/api/v1/orders` (auth required; admin-specific path noted below)

- GET `/{orderId}` → `OrderDto`
- POST `/create/{userId}`
  - Body `CreateOrderRequestDto` (one of):
```
{ "addressId": 123 }                    // use saved address
// or
{ "shippingAddress": AddressDto }       // create from provided address snapshot
```
  - Response 201: `OrderDto`

- POST `/cancel/{orderId}` → 204

- GET `/user/{userId}` → `OrderDto[]`

- PUT `/admin/{orderId}/status` (ROLE_ADMIN)
  - Body `UpdateOrderStatusRequestDto`:
```
{ "status": "PAID" } // enum OrderStatus
```
  - Response 200: `OrderDto`

Models:
- `OrderDto`:
```
{
  "id": 100,
  "orderDate": "2025-01-01T12:00:00",
  "status": "PENDING",          // enum OrderStatus
  "totalPrice": 59.97,
  "items": [ { "productId": 5, "productName": "Widget", "quantity": 3, "priceAtPurchase": 19.99 } ],
  "trackingNumber": "TRK-XYZ-123"
}
```
- `OrderItemDto`: `{ productId: number, productName: string, quantity: number, priceAtPurchase: number }`
 - `OrderStatus` enum values: `PENDING`, `SHIPPED`, `DELIVERED`, `CANCELED`, `RETURNED`, `REFUNDED`, `COMPLETED`, `ON_HOLD`, `AWAITING_PAYMENT`.


## Addresses
Base: `/api/v1/addresses` (auth required)

- POST `/{userId}`
  - Body `AddressDto` (validation shown inline)
  - Response 201: `AddressDto`

- GET `/{userId}` → `AddressDto[]`

Model:
- `AddressDto`:
```
{
  "id": 1,
  "fullName": "Jane Doe",              // required
  "addressLine1": "123 Main St",       // required
  "addressLine2": "Apt 4B",
  "city": "Springfield",               // required
  "state": "IL",
  "postalCode": "62704",               // required
  "countryCode": "US",                 // required, 2-letter
  "phone": "+1-555-0100",
  "label": "Home",
  "isDefaultShipping": true,
  "isDefaultBilling": false
}
```


## Roles and Route Protection
- Public: `GET /products/**`, `GET /categories/**`, `/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`.
- Authenticated: `/orders/**`, `/addresses/**`, `/cart/**`, `/users/**`.
- Admin: `POST/PUT/DELETE /categories/**`, `POST /products`, `PUT /products/**`, `DELETE /products/**`, `PUT /orders/admin/**`.
- JWT does not embed roles and `GET /users/{username}` does not return roles. FE should rely on server enforcement; optionally display admin features optimistically and handle 403, or add a dedicated BE endpoint that returns roles if client-side gating is desired.


## Query Examples
- Products list (non-featured): `GET /api/v1/products?page=0&size=12&sort=price,asc`
- Products search: `GET /api/v1/products/search?searchText=phone&categoryId=3&minPrice=100&maxPrice=500&inStock=true&page=0&size=20`
- Category CRUD (admin):
  - Create: `POST /api/v1/categories`
  - Update: `PUT /api/v1/categories/7`
  - Delete: `DELETE /api/v1/categories/7`
- Cart ops:
  - Add: `POST /api/v1/cart/add` `{ "userId":1, "productId":5, "quantity":2 }`
  - Update qty: `PUT /api/v1/cart/1/update-quantity/42` `{ "quantity": 3 }`
  - Remove: `DELETE /api/v1/cart/delete/1/items/42`
- Orders:
  - Create from saved address: `POST /api/v1/orders/create/1` `{ "addressId": 10 }`
  - Create with new address: `POST /api/v1/orders/create/1` `{ "shippingAddress": { ...AddressDto } }`
  - Cancel: `POST /api/v1/orders/cancel/100`
  - Update status (admin): `PUT /api/v1/orders/admin/100/status` `{ "status": "SHIPPED" }`


## Validation Highlights
- Strings annotated with `@NotBlank` must be non-empty and non-whitespace.
- Numeric constraints:
  - `price` > 0; `stockQuantity` >= 0; `quantity` >= 1
  - `categoryId` >= 1 when provided in filters
  - `minPrice`/`maxPrice` >= 0
- Address requires: `fullName`, `addressLine1`, `city`, `postalCode`, `countryCode` (2 letters)
- On validation errors, response uses the unified error format with `details` per-field messages.


## Swagger/OpenAPI
- JSON: `GET http://localhost:8080/v3/api-docs`
- UI: `GET http://localhost:8080/swagger-ui/index.html`
- Use this to regenerate the Angular client (`ng-openapi-gen`) as the single source of truth for request/response shapes.


## Dev Notes for FE
- Derive `username` for `/users/{username}` from the login form or decode JWT subject; token includes only username.
- Use `GET /cart/{userId}` to refresh cart after mutations.
- CORS: Update backend CORS allowed origin to match the actual Angular dev server (e.g., `http://localhost:4200`).
- Admin feature gating on FE is now possible by calling `/users/{username}/roles` but still rely on BE for enforcement.
- Password reset link: backend email composes `${APP_FRONTEND_URL}/reset-password?token=...`. Ensure Angular handles that route (alias `/reset-password`) or set `APP_FRONTEND_URL` accordingly (e.g., include `/auth` path if your FE route is `/auth/reset-password`).


## Known Integration Notes
- Roles: JWT does not include roles; `UserDto` does not expose roles. If FE needs to gate admin UI reliably, add an endpoint that returns roles.
