import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchTeachers, Teacher } from '../../redux/features/teacher/teacherSlice';
import '../../styles/Manage.css';

const ManageTeacher: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teachers, status, error } = useSelector((state: RootState) => state.teacher);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Teacher | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  // Sorting
  const sortedTeachers = [...teachers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const key = sortConfig.key;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    const aValue = a[key] ?? '';
    const bValue = b[key] ?? '';
    if (aValue < bValue) return -1 * dir;
    if (aValue > bValue) return 1 * dir;
    return 0;
  });

  // Filtering
  const filteredTeachers = sortedTeachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const pageCount = Math.ceil(filteredTeachers.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredTeachers.slice(offset, offset + itemsPerPage);
  const handlePageClick = ({ selected }: { selected: number }) => setCurrentPage(selected);

  // Selection
  const handleCheckboxChange = (id: string) =>
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  const handleSelectAllChange = () => {
    if (selectAll) setSelectedItems([]);
    else setSelectedItems(currentItems.map((item) => item.id));
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const allSelected = currentItems.every((item) => selectedItems.includes(item.id));
    setSelectAll(currentItems.length > 0 && allSelected);
  }, [selectedItems, currentItems]);

  const requestSort = (key: keyof Teacher) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(0);
  };

  const getSortIndicator = (key: keyof Teacher) => (sortConfig.key !== key ? null : sortConfig.direction === 'asc' ? '↑' : '↓');

  const handleDelete = (id: string) => alert(`Teacher ${id} would be deleted`);
  const handleBulkDelete = () => {
    if (!selectedItems.length) return alert('Select items to delete');
    alert(`Deleting teachers: ${selectedItems.join(', ')}`);
    setSelectedItems([]);
    setSelectAll(false);
  };

  if (status === 'loading') return <div>Loading teachers...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className="manage-teacher-container">
      <div className="header">
        <h2>Manage Teachers</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <Link to="/admin/add-teacher" className="add-teacher-btn">
            Add Teacher
          </Link> */}
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="bulk-actions">
          <button onClick={handleBulkDelete}>Delete Selected ({selectedItems.length})</button>
        </div>
      )}

      <table className="teacher-table">
        <thead>
          <tr>
            <th><input type="checkbox" checked={selectAll} onChange={handleSelectAllChange} /></th>
            <th>ID</th>
            <th onClick={() => requestSort('name')}>Name {getSortIndicator('name')}</th>
            <th onClick={() => requestSort('email')}>Email {getSortIndicator('email')}</th>
            <th onClick={() => requestSort('subject')}>Subject {getSortIndicator('subject')}</th>
            {/* <th>Status</th> */}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((teacher, index) => (
            <tr key={teacher.id} className={selectedItems.includes(teacher.id) ? 'selected-row' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(teacher.id)}
                  onChange={() => handleCheckboxChange(teacher.id)}
                />
              </td>
              {/* Numeric ID instead of Firestore ID */}
              <td>{offset + index + 1}</td>
              <td>{teacher.name}</td>
              <td>{teacher.email}</td>
              <td>{teacher.subject || '-'}</td>
              <td>{teacher.status}</td>
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
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        activeClassName={'active'}
        disabledClassName={'disabled'}
      />

    </div>
  );
};

export default ManageTeacher;
