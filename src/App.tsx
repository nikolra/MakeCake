import React from 'react';
import {Routes, Route} from 'react-router-dom'
import './App.css'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/login/login.page'
import Register from './pages/register/register.page'
import MainLayout from './pages/layouts/main.layout'
import DashboardLayout from './pages/layouts/dashboard.layout'
import Dashboard from './pages/dashboard/dashboard.page'
import Customers from './pages/customers/customers.page'
import Orders from './pages/orders/orders.page'
import Ingredients from './pages/ingredients/ingredients.page'
import Recipes from './pages/recipes/recipes.page'
import Settings from './pages/settings/settings.page'
import PasswordRestore from './pages/password-restore/password-restore.page'
import AddOrder from "./pages/orders/add-order.page";
import AddCustomer from "./pages/customers/add-customer.page";
import AddIngredient from "./pages/ingredients/add-ingredient.page";
import AddRecipePage from "./pages/recipes/add-recipe.page";
import EditRecipePage from "./pages/recipes/edit-recipe.page";
import EditCustomerPage from "./pages/customers/edit-customer.page";
import EditIngredientPage from "./pages/ingredients/edit-ingredient.page";
import EditOrderPage from "./pages/orders/edit-order.page";
import AuthPage from "./pages/register/auth.page";
import SetNewPasswordPage from "./pages/password-restore/set-new-password.page";

function App() {
    return (
        <>
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="register/auth" element={<AuthPage/>}/>
                <Route path="forgot-password" element={<PasswordRestore/>}/>
                <Route path="set-new-password" element={<SetNewPasswordPage/>}/>
            </Route>
            <Route path="/" element={<DashboardLayout/>}>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="orders" element={<Orders/>}/>
                <Route path="orders/new" element={<AddOrder/>}/>
                <Route path="orders/edit/:id" element={<EditOrderPage/>}/>
                <Route path="customers" element={<Customers/>}/>
                <Route path="customers/new" element={<AddCustomer/>}/>
                <Route path="customers/edit/:email" element={<EditCustomerPage/>}/>
                <Route path="recipes" element={<Recipes/>}/>
                <Route path="recipes/new" element={<AddRecipePage/>}/>
                <Route path="recipes/edit/:id" element={<EditRecipePage/>}/>
                <Route path="ingredients" element={<Ingredients/>}/>
                <Route path="ingredients/new" element={<AddIngredient/>}/>
                <Route path="ingredients/edit/:id" element={<EditIngredientPage/>}/>
                <Route path="settings" element={<Settings/>}/>
            </Route>
        </Routes>
        <ToastContainer autoClose={200} hideProgressBar />
        </>
    );
}

export default App;
