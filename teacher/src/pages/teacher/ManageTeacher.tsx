// src/pages/Teacher/ManageTeacher.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeachers,
  deleteTeacherAsync,
  selectAllTeachers,
  selectTeacherStatus,
} from "../../redux/features/teacher/teacherSlice";
import { AppDispatch } from "../../redux/store"; // <-- adjust import
import "../../styles/teachermanage.css";

const ManageTeacher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const teachers = useSelector(selectAllTeachers);
  const status = useSelector(selectTeacherStatus);

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const itemsPerPage = 10;

  // Fetch teachers from Firestore on mount
  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  // Filtering
  const filteredTeachers = teachers.filter((t) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(searchLower) ||
      t.subject.toLowerCase().includes(searchLower) ||
      t.email.toLowerCase().includes(searchLower) ||
      (t.phone || "").includes(searchTerm)
    );
  });

  // Pagination
  const pageCount = Math.ceil(filteredTeachers.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredTeachers.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // Delete single teacher
  const handleDelete = (teacherId: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      dispatch(deleteTeacherAsync(teacherId));
    }
  };

  // Checkbox (single)
  const handleCheckboxChange = (teacherId: string) => {
    setSelectedItems((prev) =>
      prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
    );
  };

  // Select all
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const currentPageIds = currentItems.map((item) => item.id!);
      setSelectedItems(currentPageIds);
    }
    setSelectAll(!selectAll);
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      alert("Please select teachers to delete");
      return;
    }
    if (window.confirm(`Delete ${selectedItems.length} teachers?`)) {
      selectedItems.forEach((id) => dispatch(deleteTeacherAsync(id)));
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  return (
    <div className="manage-container">
      <div className="header">
        <h2>Manage Teachers</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <Link to="/admin/teacher/add" className="add-btn">
            Add New Teacher
          </Link>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="bulk-actions">
          <button onClick={handleBulkDelete} className="bulk-delete-btn">
            Delete Selected ({selectedItems.length})
          </button>
        </div>
      )}

      <div className="table-container">
        {status === "loading" ? (
          <div>Loading teachers...</div>
        ) : filteredTeachers.length === 0 ? (
          <div className="no-results">No teachers found.</div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                  </th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Join Date</th>
                  <th>Image</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((teacher,index) => (
                  <tr key={teacher.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(teacher.id!)}
                        onChange={() => handleCheckboxChange(teacher.id!)}
                      />
                    </td>
                    <td>{offset + index +1}</td>
                    <td>{teacher.name}</td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone}</td>
                    <td>{teacher.joinDate}</td>
                    <td>
                      {teacher.profileImageUrl ? (
                        <img
                          src={teacher.profileImageUrl}
                          alt={teacher.name}
                          style={{ width: "50px", borderRadius: "5px" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    {/* <td>
                      <Link to={`/admin/teacher/edit/${teacher?.id}`} className="edit-btn">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(teacher?.id!)} className="delete-btn">
                        Delete
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              forcePage={currentPage}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ManageTeacher;
