import React from 'react';
import { Link, NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext'; // Import the custom hook to access authentication state
import Cart from '../components/sales/Cart';
import CartBtn from '../components/sales/CartBtn';
import ExchangeRate from '../components/main/ExchangeRate';





const Navbar: React.FC = () => {
    const { user, isAuthenticated } = useAuth(); // Get user, logout, and isAuthenticated from context

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary mb-3">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">TINY POS</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            {isAuthenticated ? (
                                <>
                                    <li className='nav-item'>
                                        <span className="nav-link">{user?.username}</span>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/products" className="nav-link">Products</NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/sales/new" className="nav-link">New Sale</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/sales/history" className="nav-link">Sale history</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/logout" className="nav-link">Logout</NavLink>
                                    </li>
                                    <li className="mx-auto">
                                        < CartBtn />
                                    </li>
                                </>
                            ) : <>
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/signup" className="nav-link">Signup</NavLink>
                                </li>

                            </>}
                        </ul>
                        <ul className="ms-auto">
                            <ExchangeRate />
                        </ul>
                    </div>
                </div>
            </nav>
            <Cart />
        </>
    )
};

export default Navbar;
