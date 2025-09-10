// src/pages/Student/ManageStudents.tsx
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../../styles/Manage.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, toggleVerified  } from '../../redux/features/student/studentSlice';

const ManageStudents = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state: any) => state.students);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'ascending'
  });
  const [loading, setLoading] = useState(true);

  // Sorting
  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = useMemo(() => {
    let sortableStudents = [...students];
    if (sortConfig.key) {
      sortableStudents.sort((a, b) => {
        if (sortConfig.key === 'lastLogin') {
          const dateA = new Date(a.lastLogin || 0);
          const dateB = new Date(b.lastLogin || 0);
          return sortConfig.direction === 'ascending' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        }

        if (sortConfig.key === 'name') {
          const nameA = `${a?.firstName} ${a?.lastName}`.toLowerCase();
          const nameB = `${b?.firstName} ${b?.lastName}`.toLowerCase();
          if (nameA < nameB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (nameA > nameB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [students, sortConfig]);

  // Filtering
  const filteredStudents = useMemo(() => {
    return sortedStudents.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student?.firstName?.toLowerCase().includes(searchLower) ||
        student?.lastName?.toLowerCase().includes(searchLower) ||
        student?.email?.toLowerCase().includes(searchLower) ||
        student?.status?.toLowerCase().includes(searchLower) ||
        student?.id?.toString().includes(searchTerm)
      );
    });
  }, [sortedStudents, searchTerm]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const studentsPerPage = 10;
  const pageCount = Math.ceil(filteredStudents.length / studentsPerPage);
  const offset = currentPage * studentsPerPage;
  const currentStudents = filteredStudents.slice(offset, offset + studentsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    setSelectAll(false);
  };

  // Delete handlers
  const handleDelete = (studentId: number) => {
    console.log(`Student ${studentId} would be deleted`);
    alert(`Student ${studentId} would be deleted in a real application`);
  };

  const handleBulkDelete = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student to delete');
      return;
    }
    console.log(`Students ${selectedStudents.join(', ')} would be deleted`);
    alert(`Students ${selectedStudents.join(', ')} would be deleted in a real application`);
    setSelectedStudents([]);
    setSelectAll(false);
  };

  // Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
    setSelectedStudents([]);
    setSelectAll(false);
  };

  // Selection
  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(currentStudents.map(student => student.id));
    }
    setSelectAll(!selectAll);
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return null;
  };

  useEffect(() => {
    dispatch(fetchStudents() as any).finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <div className="manage-container">
      <div className="header">
        <h2>Manage Students</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          {/* <Link to="/admin/add-student" className="add-btn">
            Add New Student
          </Link> */}
        </div>
      </div>

      {selectedStudents.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedStudents.length} student(s) selected</span>
          <button onClick={handleBulkDelete} className="bulk-delete-btn">
            Delete Selected
          </button>
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="spinner" />
          <p>Loading students...</p>
        </div>
      ) : (
        <div className="table-container">
          {students?.length === 0 ? (
            <div className="no-results">No students found matching your search criteria.</div>
          ) : (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    </th>
                    <th onClick={() => requestSort('id')}>ID{getSortIndicator('id')}</th>
                    <th onClick={() => requestSort('name')}>Name{getSortIndicator('name')}</th>
                    <th onClick={() => requestSort('email')}>Email{getSortIndicator('email')}</th>
                    <th onClick={() => requestSort('status')}>Status{getSortIndicator('status')}</th>
                    <th onClick={() => requestSort('lastLogin')}>Last Login{getSortIndicator('lastLogin')}</th>
                    <th onClick={() => requestSort('verified')}>Verified{getSortIndicator('verified')}</th>
                    {/* <th>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                        />
                      </td>
                      <td>{student.id}</td>
                      <td>
                        {student.name}
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <span className={`status-badge ${student.verified}`}>
                          {student.verified ? 'verified' : 'not-verified'}
                        </span>
                      </td>
                      <td>{student.lastLogin || 'Never'}</td>
                      <td>
                        <span className={`status-badge ${student.verified ? 'verified' : 'not-verified'}`}>
                          {student.verified ? 'Yes' : 'No'}
                        </span>
                        <button
                          className="verify-btn"
                          onClick={() =>
                            dispatch(toggleVerified({ uid: student.uid, verified: !student.verified }) as any)
                          }
                        >
                          {student.verified ? 'Revoke' : 'Approve'}
                        </button>
                      </td>
                      {/* <td className="actions">
                        <Link to={`/admin/student/edit-student/${student.id}`} className="edit-btn">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(student.id)} className="delete-btn">
                          Delete
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>

              <ReactPaginate
                previousLabel={'← Previous'}
                nextLabel={'Next →'}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                forcePage={currentPage}
                containerClassName={'pagination'}
                previousLinkClassName={'pagination__link'}
                nextLinkClassName={'pagination__link'}
                disabledClassName={'pagination__link--disabled'}
                activeClassName={'pagination__link--active'}
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
