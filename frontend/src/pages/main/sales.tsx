import { useEffect, useState } from "react";
import axios from "axios";
import SalesList from "../../components/sales/Sales";

const Sale = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize] = useState<number>(10);

  useEffect(() => {
    const getSaleHistory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:4000/api/sales", {
          params: {
            page: currentPage,
            pageSize: pageSize,
          },
          withCredentials: true, // Include credentials (cookies)
        });
        console.log(response);
        setSales(response.data.data);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    getSaleHistory();
  }, [currentPage]); // Refetch when currentPage changes

  // Handle next page click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>

      <h4 className="text-center">Sales History</h4>
      {/* <div className="mb-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
        <input type="date" name="date" id="" className="form-control bg-primary-subtle p-3" />
      </div> */}
      <div className="container">
        <div className="table-responsive">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                  <th scope="col">Sold by</th>
                </tr>
              </thead>
              <tbody id="results">
                <SalesList sales={sales} />
              </tbody>
            </table>
          )}
        </div>

        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            <li className="page-item">
              <span className="page-link">
                Page {currentPage} of {totalPages}
              </span>
            </li>
            <li className="page-item">
              <button
                className="page-link"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sale;
