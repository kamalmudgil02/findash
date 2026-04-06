# FinDash — Personal Finance Dashboard

A modern, responsive personal finance dashboard built with React.js and Vite. Track your income, expenses, savings goals, and get visual insights into your spending habits — all in one place.

## Live Demo

[https://financetracker-findash.netlify.app](https://financetracker-findash.netlify.app)

---

## Features

- Authentication — login, signup, and auto-logout after 10 minutes of inactivity
- Role-based access — Admin and Viewer roles with different permissions
- Dashboard — summary cards, balance history chart, expense breakdown, savings goal, and recent transactions
- Transactions — add, edit, delete, filter, and search transactions by category or date
- Analytics — visual charts for spending trends and category breakdowns
- Notifications — real-time alerts for income, expenses, and budget warnings
- Profile — edit personal info and upload avatar
- Settings — toggle dark/light mode, currency, language, notification preferences, and compact view
- Help Center — searchable FAQ section
- Multi-account support — each account's data is isolated in localStorage
- Fully responsive — works on mobile, tablet, and desktop

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool and dev server |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Data visualization |
| Lucide React | Icons |
| localStorage | Client-side data persistence |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/kamalmudgil02/findash.git

# Navigate into the project
cd findash

# Install dependencies
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/        # Reusable UI components (Dashboard, Charts, Sidebar, etc.)
├── context/           # AppContext — global state management via React Context API
├── data/              # Static data (FAQs)
├── pages/             # Route-level page components
├── App.jsx            # Root component with routing setup
├── main.jsx           # App entry point
└── index.css          # Global styles
```

---

## State Management

This app uses React Context API (`src/context/AppContext.jsx`) for global state. It manages:

- User authentication and session
- Transactions (CRUD)
- User profile and settings
- Theme (dark/light)
- Notifications
- Categories
- Currency formatting

No external state library (Redux/Zustand) is needed at this scale.

---

## Default Login

If you want to try the app without signing up:

> Sign up with any email and password — data is stored locally in your browser.

---

## Known Limitations

- No real backend — all data lives in `localStorage` and is browser-specific
- Data does not sync across devices or browsers
- No real authentication — passwords are stored in localStorage (not suitable for production)

---

## License

MIT
