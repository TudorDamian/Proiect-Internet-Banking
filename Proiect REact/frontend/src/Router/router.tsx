import { RouteObject, createBrowserRouter } from "react-router-dom";
import SignInSide from "../Pages/SignInSide";
import SignUp from "../Pages/SignUp";
import Dashboard from "../Pages/Dashboard";
import DashboardAdmin from "../Pages/DashboardAdmin";
import Profile from "../Pages/Profile";
import UsersAdmin from "../Pages/UsersAdmin";
import Accounts from "../Pages/Accounts";
import AccountsAdmin from "../Pages/AccountsAdmin";
import Transactions from "../Pages/Transactions";
import TransactionsAdmin from "../Pages/TransactionsAdmin";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <SignInSide />
    },
    {
        path: "/Home",
        element: <div>Prima componenta</div>
    },
    {
        path: "/sign-in",
        element: <SignInSide />
    },
    {
        path: "/sign-up",
        element: <SignUp />
    },
    {
        path: "/dashboard",
        element: <Dashboard />
    },
    {
        path: "/dashboardAdmin",
        element: <DashboardAdmin />
    },
    {
        path: "/profile",
        element: <Profile />
    },
    {
        path: "/usersAdmin",
        element: <UsersAdmin />
    },
    {
        path: "/accounts",
        element: <Accounts />
    },
    {
        path: "/accountsAdmin",
        element: <AccountsAdmin />
    },
    {
        path: "/transactions",
        element: <Transactions />
    },
    {
        path: "/transactionsAdmin",
        element: <TransactionsAdmin />
    }

];

export const router = createBrowserRouter(routes)