# 🏗️ Bookstore System Architecture

## 🧬 System Flow Diagram

```mermaid
graph TD
    A[User Client - React] -->|1. Add to Cart| B(CartContext)
    B -->|2. Checkout| C{Order API - Express}
    C -->|3a. Save Record| D[(MongoDB)]
    C -->|3b. Update Stock| E[Book Collection]
    
    C -->|4. Return Success| A
    A -->|5. Redirect| F[WhatsApp Messenger]
    
    subgraph "Admin Workflow"
        G[Admin Panel] -->|Fetch| C
        G -->|Update Status| C
        C -->|Audit Change| D
    end
    
    subgraph "Security Layer"
        H[JWT Middleware] --> C
    end
```

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, Vite | Ultra-fast UI and state management |
| **Styling** | Vanilla CSS, Framer Motion | Premium look and smooth animations |
| **Icons** | Lucide-React | Crisp, modern iconography |
| **Backend** | Node.js, Express | Scalable API architecture |
| **Database** | MongoDB, Mongoose | Flexible NoSQL data storage |
| **Auth** | JSON Web Tokens (JWT) | Secure session management |

## 📦 Data Models Relationship

1.  **User**: Stores credentials and phone number (used for WhatsApp).
2.  **Book**: Stores title, price, description, and **live stock quantity**.
3.  **Order**: Links **User** and **Books**. It captures precisely what was bought, at what price, and current delivery status.

## 🔐 Security Architecture
- All sensitive operations (Ordering, Admin updates) require a valid JWT in the `Authorization` header.
- Password hashing is enforced using `BcryptJS` before saving to the database.
- Backend validation ensures that no order can be placed for products that do not exist (ID validation).
