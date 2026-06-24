#  E-Commerce App

A full-stack e-commerce application built with **NestJS** (Backend) and **React Native** (Mobile), JWT authentication, role-based access control, and Stripe mock payments.

---

## Author

**Mujtaba Fadiel**
GitHub: [@MujtabaFadiel](https://github.com/MujtabaFadiel)

---

##  Screenshots



https://github.com/user-attachments/assets/49c502cc-8bd1-4f89-bcb9-2cb938148093
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
   <img width="150" alt="0f3d85f0-2c70-4dbd-b4b5-4e9e8111ef41" src="https://github.com/user-attachments/assets/6b4c31d7-6769-4f59-aa43-702705d89dd9" />
<img width="150" alt="3b03af7e-648b-47e5-baa4-01c824cd7f7c" src="https://github.com/user-attachments/assets/86e30a14-7024-4aec-8bb2-c0f78236fb55" />
<img width="150"  alt="e9598fc2-a4d5-4ce4-8966-e7b459d75790" src="https://github.com/user-attachments/assets/3a3f17ce-6190-4f99-a26f-bd6a16ccabde" />
<img width="150" alt="c2686967-0c09-485a-84ed-d3da34a662ac" src="https://github.com/user-attachments/assets/1d1d5ed0-cee5-4ea6-a1ec-c4d77c16bb53" />
<img width="150" alt="87e613ba-8490-4157-8038-cfe00bf34908" src="https://github.com/user-attachments/assets/00868bbb-25ef-42ef-8230-35e8d0b1de83" />
<img width="150" alt="09ca0660-86e1-4869-963e-69a853ea6aea" src="https://github.com/user-attachments/assets/074644bc-d3a8-4674-a579-e8ac93a0bf63" />

</div>

---

##  Features

### Mobile (React Native)
- Authentication (Login / Register)
- Product listing with search & category filter
- Product detail with quantity selector
- Cart management (add, remove, update quantity)
- Checkout with order confirmation
- Order history
- User profile & logout

### Backend (NestJS)
- JWT Authentication with role-based access (Admin / User)
- Products CRUD with search & pagination
- Categories management
- Orders management with stock tracking
- Stripe mock payment integration
- Swagger API documentation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + TypeScript |
| State Management | Zustand |
| HTTP Client | Axios |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL |
| ORM | TypeORM |
| Authentication | JWT + Passport |
| Payment | Stripe Mock |
| API Docs | Swagger |

---

## Project Structure

```
e-commerce/
├── ecommerce-backend/          # NestJS Backend
│   └── src/
│       ├── auth/               # JWT + Guards
│       ├── users/              # User management
│       ├── products/           # Products CRUD
│       ├── categories/         # Categories
│       ├── orders/             # Orders + stock
│       └── payments/           # Stripe mock
│
└── EcommerceApp/               # React Native Mobile
    └── src/
        ├── api/                # Axios instance
        ├── store/              # Zustand stores
        ├── screens/            # App screens
        │   ├── Auth/
        │   ├── Products/
        │   ├── Cart/
        │   └── Orders/
        └── navigation/         # React Navigation
```

---



```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=
JWT_SECRET=
```

