import React from "react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="pagination">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1} 
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages+1}
      </span>
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages+1} 
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;