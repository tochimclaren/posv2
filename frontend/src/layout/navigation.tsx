
import { Link } from "react-router"



function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Tiny POS</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">Signup</Link>
            </li>
            <li className="nav-item">
              <Link to="/logout" className="nav-link">Logout</Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">Products</Link>
            </li>

            <li className="nav-item">
              <Link to="/sales/new" className="nav-link">New Sale</Link>
            </li>
            <li className="nav-item">
              <Link to="/sales" className="nav-link">Sale history</Link>
            </li>
          </ul>
          <ul className="ms-auto">
            <li className="nav-item">&#8358; 1650.0 = $1</li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
