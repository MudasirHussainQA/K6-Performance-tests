# Contact List API - Endpoints Reference

This document provides detailed information about all the API endpoints tested by this K6 suite.

## Base URL

```
https://thinking-tester-contact-list.herokuapp.com
```

## Authentication

All contact-related endpoints require authentication via Bearer token in the Authorization header.

```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
  'Content-Type': 'application/json'
}
```

---

## User Management Endpoints

### 1. Register User

**Endpoint:** `POST /users`

**Description:** Create a new user account

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "MyPassword123!"
}
```

**Success Response (201):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**
```json
{
  "message": "Email address is already in use"
}
```

---

### 2. Login User

**Endpoint:** `POST /users/login`

**Description:** Authenticate user and receive access token

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "MyPassword123!"
}
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Incorrect username or password"
}
```

---

### 3. Get User Profile

**Endpoint:** `GET /users/me`

**Description:** Get current user's profile information

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

**Error Response (401):**
```json
{
  "message": "Please authenticate."
}
```

---

### 4. Update User Profile

**Endpoint:** `PATCH /users/me`

**Description:** Update current user's profile

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "john.doe@example.com"
}
```

---

### 5. Logout User

**Endpoint:** `POST /users/logout`

**Description:** Logout current user and invalidate token

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Success Response (200):**
```json
{
  "message": "User logged out successfully"
}
```

---

### 6. Delete User

**Endpoint:** `DELETE /users/me`

**Description:** Delete current user account

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Contact Management Endpoints

### 7. Get All Contacts

**Endpoint:** `GET /contacts`

**Description:** Retrieve all contacts for authenticated user

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Amy",
    "lastName": "Miller",
    "birthdate": "1992-02-02",
    "email": "amiller@fake.com",
    "phone": "8005554242",
    "street1": "13 School St.",
    "street2": "Apt. 5",
    "city": "Washington",
    "stateProvince": "QC",
    "postalCode": "A1A1A1",
    "country": "USA",
    "owner": "507f1f77bcf86cd799439010"
  }
]
```

---

### 8. Add Contact

**Endpoint:** `POST /contacts`

**Description:** Create a new contact

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "Amy",
  "lastName": "Miller",
  "birthdate": "1992-02-02",
  "email": "amiller@fake.com",
  "phone": "8005554242",
  "street1": "13 School St.",
  "street2": "Apt. 5",
  "city": "Washington",
  "stateProvince": "QC",
  "postalCode": "A1A1A1",
  "country": "USA"
}
```

**Required Fields:**
- firstName
- lastName
- birthdate (format: YYYY-MM-DD)

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Amy",
  "lastName": "Miller",
  "birthdate": "1992-02-02",
  "email": "amiller@fake.com",
  "phone": "8005554242",
  "street1": "13 School St.",
  "street2": "Apt. 5",
  "city": "Washington",
  "stateProvince": "QC",
  "postalCode": "A1A1A1",
  "country": "USA",
  "owner": "507f1f77bcf86cd799439010"
}
```

**Error Response (400):**
```json
{
  "message": "Contact validation failed: firstName: Path `firstName` is required."
}
```

---

### 9. Get Contact by ID

**Endpoint:** `GET /contacts/:id`

**Description:** Retrieve a specific contact by ID

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Amy",
  "lastName": "Miller",
  "birthdate": "1992-02-02",
  "email": "amiller@fake.com",
  "phone": "8005554242",
  "street1": "13 School St.",
  "street2": "Apt. 5",
  "city": "Washington",
  "stateProvince": "QC",
  "postalCode": "A1A1A1",
  "country": "USA",
  "owner": "507f1f77bcf86cd799439010"
}
```

**Error Response (404):**
```json
{
  "message": "Contact not found"
}
```

---

### 10. Update Contact (Full)

**Endpoint:** `PUT /contacts/:id`

**Description:** Fully update a contact (replaces all fields)

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "Amy",
  "lastName": "Miller",
  "birthdate": "1992-02-02",
  "email": "amiller@fake.com",
  "phone": "8005554242",
  "street1": "13 School St.",
  "street2": "Apt. 5",
  "city": "Washington",
  "stateProvince": "QC",
  "postalCode": "A1A1A1",
  "country": "USA"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Amy",
  "lastName": "Miller",
  "birthdate": "1992-02-02",
  "email": "amiller@fake.com",
  "phone": "8005554242",
  "street1": "13 School St.",
  "street2": "Apt. 5",
  "city": "Washington",
  "stateProvince": "QC",
  "postalCode": "A1A1A1",
  "country": "USA",
  "owner": "507f1f77bcf86cd799439010"
}
```

---

### 11. Update Contact (Partial)

**Endpoint:** `PATCH /contacts/:id`

**Description:** Partially update a contact (updates only specified fields)

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "phone": "5559998888",
  "city": "New York"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "Amy",
  "lastName": "Miller",
  "birthdate": "1992-02-02",
  "email": "amiller@fake.com",
  "phone": "5559998888",
  "street1": "13 School St.",
  "street2": "Apt. 5",
  "city": "New York",
  "stateProvince": "QC",
  "postalCode": "A1A1A1",
  "country": "USA",
  "owner": "507f1f77bcf86cd799439010"
}
```

---

### 12. Delete Contact

**Endpoint:** `DELETE /contacts/:id`

**Description:** Delete a specific contact

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

**Success Response (200):**
```json
{
  "message": "Contact deleted"
}
```

**Error Response (404):**
```json
{
  "message": "Contact not found"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required or failed |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

The API may implement rate limiting. Check response headers for rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1609459200
```

---

## Notes

1. **Authentication Token**: Valid for the session duration
2. **Email Format**: Must be a valid email address
3. **Birthdate Format**: Must be YYYY-MM-DD
4. **Password Requirements**: Minimum 7 characters
5. **Contact Ownership**: Users can only access their own contacts

---

## Testing with cURL

### Register User
```bash
curl -X POST https://thinking-tester-contact-list.herokuapp.com/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"Password123!"}'
```

### Login
```bash
curl -X POST https://thinking-tester-contact-list.herokuapp.com/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123!"}'
```

### Add Contact
```bash
curl -X POST https://thinking-tester-contact-list.herokuapp.com/contacts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Amy","lastName":"Miller","birthdate":"1992-02-02","email":"amy@example.com"}'
```

---

For more details, visit the [official API documentation](https://documenter.getpostman.com/view/4012288/TzK2bEa8).

