import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext.tsx';
import { ExchangeRateProvider } from './context/ExchangeContext.tsx';
// import { ExchangeRateProvider } from './context/ExchangeContext.tsx';
import App from './App.tsx';
import Login from './pages/auth/login.tsx';
import Logout from './pages/auth/logout.tsx';
import Signup from './pages/auth/signup.tsx';
import NavBar from './layout/nav.tsx';
import Product from './pages/main/products.tsx';
import CreateProcuct from './pages/main/products.create.tsx';
import UpdateProduct from "./pages/main/products.update.tsx";
import DeleteProduct from "./pages/main/products.delete.tsx";
import SalesHistory from "./pages/main/sales.tsx";
import CreateSale from "./pages/main/sales.create.tsx";
import DeleteSale from "./pages/main/sales.delete.tsx";

import { Toaster } from 'sonner';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ExchangeRateProvider>
            <NavBar />
            <Routes>
              <Route path="/" element={<App />} />
              {/* sales routes */}
              <Route path="/sales/history" element={<SalesHistory />} />
              <Route path="/sales/new" element={<CreateSale />} />
              <Route path="/sales/:id" element={<DeleteSale />} />
              {/* product routes */}
              <Route path="/products" element={<Product />} />
              <Route path="/products/new" element={<CreateProcuct />}></Route>
              <Route path="/products/update/:id" element={<UpdateProduct />}></Route>
              <Route path="/products/delete/:id" element={<DeleteProduct />}></Route>
              {/* auth routes */}
              <Route path="/login" element={<Login />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
              <Route path="/signup" element={<Signup />}></Route>
            </Routes>
          </ExchangeRateProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
