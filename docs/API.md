# API Documentation

This document describes the AJAX API endpoints used by the Pustaka Ilmu Bookstore application for cart management and order processing.

## Overview

The application uses several PHP endpoints to handle AJAX requests for cart functionality. All endpoints return JSON responses and use POST method for data modification.

## Authentication & Sessions

- All cart operations use PHP sessions to maintain state
- No authentication required for cart operations
- Session data includes `cart_items` and `cart_count`
- Sessions persist until browser closure or explicit clearing

## Base URL

All API endpoints are relative to the application root:
```
http://localhost:8000/
```

## Endpoints

### 1. Add to Cart

**Endpoint:** `POST /add_to_cart.php`

Adds a book to the shopping cart or increments quantity if already exists.

#### Request
```http
POST /add_to_cart.php
Content-Type: application/x-www-form-urlencoded

book_id=1
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| book_id | integer | Yes | ID of the book to add to cart |

#### Response

**Success (200 OK):**
```json
{
    "success": true,
    "cart_count": 3,
    "message": "Item added to cart successfully"
}
```

**Error (400 Bad Request):**
```json
{
    "success": false,
    "message": "Invalid request"
}
```

#### Example Usage
```javascript
fetch('add_to_cart.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'book_id=1'
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('Added to cart:', data.cart_count);
    }
});
```

---

### 2. Update Cart Quantity

**Endpoint:** `POST /update_cart.php`

Updates the quantity of a specific item in the cart.

#### Request
```http
POST /update_cart.php
Content-Type: application/x-www-form-urlencoded

book_id=1&change=-1
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| book_id | integer | Yes | ID of the book to update |
| change | integer | Yes | Quantity change (+1 to increase, -1 to decrease) |

#### Response

**Success (200 OK):**
```json
{
    "success": true,
    "quantity": 2,
    "subtotal": 198000.00,
    "cart_count": 5
}
```

**Item Removed (quantity became 0):**
```json
{
    "success": true,
    "quantity": 0,
    "removed": true,
    "cart_count": 4
}
```

**Error (400 Bad Request):**
```json
{
    "success": false,
    "message": "Item not in cart"
}
```

**Database Error (500 Internal Server Error):**
```json
{
    "success": false,
    "message": "Database error"
}
```

#### Example Usage
```javascript
function updateQuantity(bookId, change) {
    fetch('update_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `book_id=${bookId}&change=${change}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.removed) {
                // Item was removed, reload page or update UI
                location.reload();
            } else {
                // Update quantity display
                updateCartDisplay(data);
            }
        }
    });
}
```

---

### 3. Remove from Cart

**Endpoint:** `POST /remove_from_cart.php`

Completely removes an item from the cart regardless of quantity.

#### Request
```http
POST /remove_from_cart.php
Content-Type: application/x-www-form-urlencoded

book_id=1
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| book_id | integer | Yes | ID of the book to remove from cart |

#### Response

**Success (200 OK):**
```json
{
    "success": true,
    "message": "Item removed from cart",
    "cart_count": 2,
    "items_count": 1
}
```

**Error (400 Bad Request):**
```json
{
    "success": false,
    "message": "Item not found in cart"
}
```

#### Example Usage
```javascript
function removeItem(bookId) {
    if (confirm('Remove this item from cart?')) {
        fetch('remove_from_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `book_id=${bookId}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload(); // Refresh cart display
            }
        });
    }
}
```

---

### 4. Clear Cart

**Endpoint:** `POST /clear_cart.php`

Removes all items from the cart and resets cart count.

#### Request
```http
POST /clear_cart.php
Content-Type: application/x-www-form-urlencoded
```

#### Parameters
None required.

#### Response

**Success (200 OK):**
```json
{
    "success": true,
    "message": "Cart cleared successfully",
    "cart_count": 0,
    "items_count": 0
}
```

**Error (405 Method Not Allowed):**
```json
{
    "success": false,
    "message": "Invalid request method"
}
```

#### Example Usage
```javascript
function clearCart() {
    if (confirm('Clear all items from cart?')) {
        fetch('clear_cart.php', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload(); // Refresh page
            }
        });
    }
}
```

---

### 5. Process Order

**Endpoint:** `POST /process_order.php`

Processes a complete order with customer information and cart items.

#### Request
```http
POST /process_order.php
Content-Type: application/x-www-form-urlencoded

customer_name=John+Doe&customer_email=john@example.com&customer_phone=081234567890&customer_address=Jl.+Test+No.+123&payment_method=transfer&notes=Please+handle+with+care
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| customer_name | string | Yes | Customer full name |
| customer_email | string | Yes | Customer email address |
| customer_phone | string | Yes | Customer phone number |
| customer_address | string | Yes | Customer shipping address |
| payment_method | string | Yes | Payment method (transfer/cod/ewallet) |
| notes | string | No | Optional order notes |

#### Response

**Success (302 Redirect):**
```http
HTTP/1.1 302 Found
Location: order_confirmation.php?order_id=123
```

**Validation Error (302 Redirect):**
```http
HTTP/1.1 302 Found
Location: cart.php
Set-Cookie: order_error=Missing+required+fields
```

**Database Error (302 Redirect):**
```http
HTTP/1.1 302 Found
Location: cart.php
Set-Cookie: order_error=Database+connection+failed
```

#### Session Variables Set
- `$_SESSION['last_order']` - Order details for confirmation page
- `$_SESSION['order_error']` - Error message if processing failed
- `$_SESSION['cart_items']` - Cleared on successful order
- `$_SESSION['cart_count']` - Reset to 0 on successful order

#### Example Usage
```html
<form method="POST" action="process_order.php">
    <input type="text" name="customer_name" required>
    <input type="email" name="customer_email" required>
    <input type="tel" name="customer_phone" required>
    <textarea name="customer_address" required></textarea>
    <select name="payment_method" required>
        <option value="transfer">Bank Transfer</option>
        <option value="cod">Cash on Delivery</option>
        <option value="ewallet">E-Wallet</option>
    </select>
    <textarea name="notes"></textarea>
    <button type="submit">Place Order</button>
</form>
```

## Error Handling

### Common HTTP Status Codes
- `200 OK` - Request successful
- `302 Found` - Redirect (used by process_order.php)
- `400 Bad Request` - Invalid parameters or missing data
- `405 Method Not Allowed` - Wrong HTTP method
- `500 Internal Server Error` - Database or server error

### Error Response Format
All error responses follow this JSON structure:
```json
{
    "success": false,
    "message": "Descriptive error message"
}
```

### Client-Side Error Handling
```javascript
fetch('/api/endpoint', options)
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
})
.then(data => {
    if (!data.success) {
        console.error('API Error:', data.message);
        // Handle specific error
        return;
    }
    // Handle success
})
.catch(error => {
    console.error('Network Error:', error);
    // Handle network/parsing errors
});
```

## Session Data Structure

### Cart Items
```php
$_SESSION['cart_items'] = [
    1 => 2,    // book_id => quantity
    3 => 1,    // book_id => quantity
    5 => 3     // book_id => quantity
];
```

### Cart Count
```php
$_SESSION['cart_count'] = 6; // Total items across all books
```

### Order Data (after successful order)
```php
$_SESSION['last_order'] = [
    'order_id' => 123,
    'customer_name' => 'John Doe',
    'customer_email' => 'john@example.com',
    'total_amount' => 299000.00,
    'order_date' => '2025-10-04 12:34:56'
];
```

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider:
- Limiting cart operations per session/IP
- Throttling order submissions
- Implementing CAPTCHA for order forms

## Security Considerations

### Input Validation
- All user inputs are validated and sanitized
- SQL injection protection via prepared statements
- XSS protection via `htmlspecialchars()`

### CSRF Protection
Currently not implemented. For production, add CSRF tokens:
```php
// Generate token
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

// Validate token
if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
    throw new Exception('Invalid CSRF token');
}
```

### Recommendations
1. Implement CSRF protection for all forms
2. Add rate limiting for API endpoints
3. Use HTTPS in production
4. Validate file uploads if implemented
5. Sanitize all user inputs
6. Log suspicious activities

## Testing

### Manual Testing
Use browser developer tools or tools like Postman:

```javascript
// Test add to cart
fetch('/add_to_cart.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'book_id=1'
}).then(r => r.json()).then(console.log);
```

### Automated Testing
The project includes Playwright tests that cover API functionality:

```bash
# Run API integration tests
npx playwright test tests/api-integration.spec.js
```

## Performance Considerations

### Optimization Tips
1. **Database Queries**: Use prepared statements and proper indexing
2. **Session Storage**: Consider Redis for high-traffic sites
3. **Caching**: Implement response caching for book data
4. **Database Connections**: Use connection pooling
5. **JSON Responses**: Keep response payloads minimal

### Monitoring
Track these metrics in production:
- Response times for each endpoint
- Error rates and types
- Cart abandonment rates
- Order completion rates
- Database query performance

## Future Enhancements

### Planned Features
- [ ] User authentication and accounts
- [ ] Wishlist functionality
- [ ] Order status updates via API
- [ ] Inventory tracking
- [ ] Coupon/discount system
- [ ] Payment gateway integration

### API Versioning
When breaking changes are needed:
```
/api/v1/cart/add
/api/v2/cart/add
```

Consider implementing proper REST endpoints:
```
GET    /api/cart          # Get cart contents
POST   /api/cart/items    # Add item to cart
PUT    /api/cart/items/1  # Update item quantity
DELETE /api/cart/items/1  # Remove item from cart
DELETE /api/cart          # Clear entire cart
POST   /api/orders        # Create new order
GET    /api/orders/123    # Get order details
```
