import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from './context/AuthContext.tsx';
import SaleHistory from "./pages/main/sales.tsx"
import { Link } from 'react-router';


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ?
        < SaleHistory /> : <div className="card mb-3 col-4 border-primary-subtle mx-auto">
          <div className="container-fluid">
            <div className="card-body text-center">
              <h4 className="text-center mb-3">Login to Continue</h4>
              <Link to="/login" className="btn btn-primary">Login</Link>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default App
