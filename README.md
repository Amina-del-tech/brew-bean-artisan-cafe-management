# ☕ Brew & Bean — Artisan Café Management System

A full-stack, role-based café management web application built with **HTML, CSS, JavaScript, PHP, and MySQL**. It brings customers, staff, and administrators onto a single platform to manage ordering, reservations, staff operations, and business analytics.

---

## 📖 About The Project

Most small cafés rely on manual, paper-based processes for orders, reservations, and staff coordination — leading to delays and miscommunication. **Brew & Bean** digitizes these operations into one secure, easy-to-use web system with three distinct user roles.

---

## ✨ Features

- 🔐 **Role-based authentication** — separate dashboards for Customer, Staff, and Admin
- 🍽️ **Dynamic menu** with category filtering and live search
- 🛒 **Shopping cart & checkout** with unique order numbers
- 📅 **Table reservation** system
- ⭐ **Favourites** and a **loyalty points** tier system (Silver / Gold / Platinum)
- 👨‍🍳 **Staff dashboard** — live order queue, shift clock-in/out, task checklist
- 📊 **Admin dashboard** — real-time revenue, orders, customers, and analytics
- 🌙 **Dark / Light mode**
- 🔒 **Secure** — bcrypt password hashing & prepared statements (SQL-injection safe)
- 📱 **Responsive design** for desktop, tablet, and mobile

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6) |
| Backend | PHP (with PDO) |
| Database | MySQL |
| Communication | REST-style JSON APIs (Fetch API / AJAX) |
| Icons & Fonts | Font Awesome, Google Fonts |
| Environment | XAMPP (Apache + MySQL) |

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL)
- A modern web browser (Chrome, Firefox, Edge)

### Installation

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/Amina-del-tech/brew-bean-artisan-cafe-management.git
   ```

2. **Move the project** into your XAMPP `htdocs` folder:
   ```
   C:/xampp/htdocs/cafe
   ```

3. **Start Apache and MySQL** from the XAMPP Control Panel.

4. **Create the database:**
   - Open `http://localhost/phpmyadmin`
   - Create a new database named **`cafe_db`**
   - Import the provided SQL file (`cafe_db.sql`) into it

5. **Run the project** in your browser:
   ```
   http://localhost/cafe/index.html
   ```

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Customer** | Register, browse menu, order, book tables, favourites, loyalty points |
| **Staff** | View order queue, update order status, clock in/out, manage tasks |
| **Admin** | View analytics, manage orders, customers, reservations, and messages |

---

## 🗄️ Database Structure

The database `cafe_db` contains 8 tables:

`users` · `orders` · `reservations` · `favourites` · `notifications` · `tasks` · `shifts` · `contact_messages`

---

## 🔮 Future Enhancements

- Real payment gateway integration (Stripe / JazzCash)
- Real-time push notifications using WebSockets
- Automated email notifications via a production mail server
- Progressive Web App (PWA) / native mobile version
- AI-based menu recommendations and demand forecasting

---

## 👤 Author

**Amina** — [GitHub Profile](https://github.com/Amina-del-tech)

---

## 📄 License

This project was developed for academic purposes as part of a Web Technology course.
