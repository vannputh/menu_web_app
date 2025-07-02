# 🍽️ Menu Web App 

A **modern, scalable restaurant menu management system** built with Angular and TypeScript. This application provides a comprehensive solution for menu browsing, order management, and administrative control using contemporary web development patterns.

---

## ⚡ Technical Overview

🏗️ **Standalone Component Architecture** - Modern Angular 17+ implementation  
🔧 **TypeScript First** - Full type safety with strict compilation  
📦 **Optimized Bundle** - Tree-shaking and efficient module loading  
🎨 **Component Library** - Reusable base components and shared services  
🔒 **Authentication System** - Session-based security with route guards  
📱 **Responsive Framework** - Mobile-first design with Tailwind CSS  

---

## 🏗️ Architecture

The application follows Angular standalone component architecture with clear separation of concerns:

```
src/app/
├── shared/                    # Core application layer
│   ├── components/           # Reusable UI components
│   │   ├── base-card/       # Generic card component
│   │   ├── menu-category/   # Category display component
│   │   ├── cart-dialog/     # Modal dialog for cart operations
│   │   ├── cart-item/       # Individual cart item component
│   │   └── receipt-dialog/  # Receipt generation component
│   ├── interfaces/           # TypeScript type definitions
│   │   ├── menu-item.interface.ts    # Menu item data structure
│   │   ├── cart-item.interface.ts    # Cart item data structure
│   │   └── order.interface.ts        # Order data structure
│   └── services/            # Business logic layer
│       ├── menu.service.ts          # Menu data operations
│       ├── cart-dialog.service.ts   # Cart modal management
│       ├── order.service.ts         # Order processing
│       └── auth.service.ts          # Authentication logic
├── admin/                    # Administrative interface
│   ├── admin-dashboard/     # Order management dashboard
│   ├── admin.component.*    # Login interface
│   └── admin.guard.ts       # Route protection
├── cart/                     # Shopping cart functionality
├── menu-item/               # Individual menu item display
└── [category-components]/   # Drinks, main-dishes, side-dishes
```

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **Angular 17+** - Standalone component architecture
- **TypeScript 5+** - Static type checking and modern ES features
- **RxJS** - Reactive programming with Observables
- **Angular Material** - UI component library for dialogs and forms
- **Tailwind CSS** - Utility-first CSS framework
- **SCSS** - CSS preprocessing with variables and mixins

### **State Management & Data Flow**
- **Services with BehaviorSubject** - Reactive state management
- **HTTP Client** - RESTful API communication with interceptors
- **Form Handling** - Reactive forms with validation
- **Route Guards** - Authentication and authorization

### **Build & Development Tools**
- **Angular CLI** - Project scaffolding and build optimization
- **Webpack** - Module bundling with tree-shaking
- **ESLint + Prettier** - Code quality and formatting
- **TypeScript Compiler** - Strict mode compilation

### **Backend Integration**
- **Node.js + Express** - RESTful API server
- **MongoDB** - Document-based data storage
- **Nodemailer** - Email service integration
- **jsPDF** - Client-side PDF generation
- **QRCode** - Payment QR code generation

---

## 🚀 Installation & Setup

### **Prerequisites**
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Angular CLI >= 17.0.0
```

### **Development Environment**

1. **Repository Setup:**
   ```bash
   git clone https://github.com/vannputh/menuWebApp.git
   cd menuWebApp
   ```

2. **Dependency Installation:**
   ```bash
   npm install
   ```

3. **Development Server:**
   ```bash
   ng serve
   # Application available at http://localhost:4200
   ```

4. **Build Process:**
   ```bash
   # Development build
   ng build
   
   # Production build with optimization
   ng build --configuration production
   ```

### **Docker Deployment**

```bash
# Build and run containerized application
docker-compose up --build

# Access application at http://localhost:3000
```

---

## 🔧 Application Features

### **Core Functionality**
- **Menu Management** - Dynamic menu display with categorization
- **Shopping Cart** - Real-time cart operations with local storage persistence
- **Order Processing** - Complete order workflow with status tracking
- **Payment Integration** - Multiple payment methods (Cash, KHQR)
- **Receipt Generation** - PDF creation with email delivery
- **Admin Dashboard** - Order management with real-time updates

### **Component Architecture**
- **BaseCard Component** - Generic card layout with slots
- **MenuCategory Component** - Category-specific item display
- **CartDialog Service** - Modal management for item customization
- **Authentication Guard** - Route protection with session management
- **Order Service** - HTTP operations with error handling

### **UI/UX Implementation**
- **Responsive Design** - Mobile-first approach with breakpoint management
- **Dark Mode Support** - CSS custom properties with theme switching
- **Loading States** - Skeleton loading and progress indicators
- **Error Handling** - User-friendly error messages with retry mechanisms
- **Accessibility** - ARIA labels and keyboard navigation support

---

## 📱 API Endpoints

### **Menu Operations**
```typescript
GET    /api/menu/categories     // Retrieve menu categories
GET    /api/menu/items/:category // Get items by category
POST   /api/menu/items         // Create menu item (admin)
PUT    /api/menu/items/:id     // Update menu item (admin)
DELETE /api/menu/items/:id     // Delete menu item (admin)
```

### **Order Management**
```typescript
POST   /api/orders             // Create new order
GET    /api/orders             // Get all orders (admin)
PATCH  /api/orders/:id/status  // Update order status
POST   /api/orders/email       // Send receipt email
```

### **Authentication**
```typescript
POST   /api/auth/login         // Admin authentication
POST   /api/auth/logout        // Session termination
GET    /api/auth/verify        // Session validation
```

---

## 🔧 Development Commands

```bash
# Development
ng serve                      # Start development server
ng build                      # Build application
ng test                       # Run unit tests
ng e2e                        # Run end-to-end tests
ng lint                       # Code linting

# Code Quality
npm run format                # Format code with Prettier
npm run lint:fix              # Fix linting issues
npm run type-check            # TypeScript compilation check

# Docker Operations
docker-compose up -d          # Run in detached mode
docker-compose logs -f        # Follow logs
docker-compose down           # Stop containers
```

---

## 🧪 Testing Strategy

### **Unit Testing**
- **Jasmine + Karma** - Component and service testing
- **TestBed** - Angular testing utilities
- **Mocking** - HTTP interceptors and service mocks
- **Coverage Reports** - Code coverage analysis

### **Integration Testing**
- **Component Integration** - Parent-child component interaction
- **Service Integration** - HTTP client and backend communication
- **Form Testing** - Reactive form validation and submission

---

## 🔒 Security Implementation

### **Authentication & Authorization**
- **Session-based Authentication** - Secure session management
- **Route Guards** - CanActivate interface implementation
- **HTTP Interceptors** - Automatic token attachment
- **Session Timeout** - Automatic logout after inactivity

### **Data Validation**
- **Input Sanitization** - XSS prevention
- **Form Validation** - Client-side and server-side validation
- **Type Safety** - TypeScript interface enforcement
- **Error Boundaries** - Graceful error handling

---

## 📦 Deployment Configuration

### **Environment Management**
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  sessionTimeout: 1800000 // 30 minutes
};
```

### **Build Optimization**
- **Tree Shaking** - Unused code elimination
- **Lazy Loading** - Route-based code splitting
- **Service Workers** - Caching strategies
- **Bundle Analysis** - webpack-bundle-analyzer integration

---

## 🤝 Contributing

### **Development Workflow**
1. Fork repository and create feature branch
2. Follow Angular style guide and coding standards
3. Implement with TypeScript strict mode
4. Add unit tests for new functionality
5. Update documentation for API changes
6. Submit pull request with detailed description

### **Code Standards**
- **TypeScript strict mode** - No implicit any types
- **Angular style guide** - Official Angular conventions
- **Component architecture** - Single responsibility principle
- **Service layer** - Business logic separation
- **Error handling** - Comprehensive error management

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

### **Technology Stack**

![Angular](https://img.shields.io/badge/Angular-DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

---

**Modern Angular application built for scalability and maintainability**

</div>

