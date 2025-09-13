import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../../styles/ManageUsers.css";
import { fetchUsers } from "../../redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";

// Define User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const ManageUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.users);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | "name";
    direction: "ascending" | "descending";
  }>({
    key: "id",
    direction: "ascending",
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Sorting function
  const requestSort = (key: keyof User | "name") => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort users based on sortConfig
  const sortedUsers = useMemo(() => {
    const sortableUsers = [...users]; // ✅ clone array, not wrap inside []

    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (sortConfig.key === "lastLogin") {
          const dateA = new Date(a.lastLogin).getTime();
          const dateB = new Date(b.lastLogin).getTime();
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA;
        }

        if (sortConfig.key === "name") {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return sortConfig.direction === "ascending"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }

        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.role?.toLowerCase().includes(searchLower) ||
        user.status?.toLowerCase().includes(searchLower) ||
        user.id?.toString().includes(searchTerm)
      );
    });
  }, [sortedUsers, searchTerm]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const usersPerPage = 10;
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const offset = currentPage * usersPerPage;
  const currentUsers = filteredUsers.slice(offset, offset + usersPerPage);

  // Pagination handler
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    setSelectAll(false);
  };

  // Delete single user
  const handleDelete = (userId: string) => {
    alert(`User ${userId} would be deleted in a real application`);
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to delete");
      return;
    }
    alert(`Users ${selectedUsers.join(", ")} would be deleted in a real application`);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const getSortIndicator = (key: keyof User | "name") => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return null;
  };

  useEffect(() => {
    dispatch(fetchUsers()).finally(() => setLoading(false));
  }, [dispatch]);

  return (
    <div className="manage-users-container">
      <div className="header">
        <h2>Manage Users</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <Link to="/admin/add-user" className="add-user-btn">
            Add New User
          </Link>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedUsers.length} user(s) selected</span>
          <button onClick={handleBulkDelete} className="bulk-delete-btn">
            Delete Selected
          </button>
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="spinner" />
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="users-table-container">
          {users?.length === 0 ? (
            <div className="no-results">No users found matching your search criteria.</div>
          ) : (
            <>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                    </th>
                    <th onClick={() => requestSort("id")}>ID{getSortIndicator("id")}</th>
                    <th onClick={() => requestSort("name")}>Name{getSortIndicator("name")}</th>
                    <th onClick={() => requestSort("email")}>Email{getSortIndicator("email")}</th>
                    <th onClick={() => requestSort("role")}>Role{getSortIndicator("role")}</th>
                    <th onClick={() => requestSort("status")}>
                      Status{getSortIndicator("status")}
                    </th>
                    <th onClick={() => requestSort("lastLogin")}>
                      Last Login{getSortIndicator("lastLogin")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                        />
                      </td>
                      <td>{user.id}</td>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.lastLogin ? user.lastLogin.toString() : ""}</td>
                      <td className="actions">
                        <Link to={`/admin/user/edit-user/${user.id}`} className="edit-btn">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(user.id)} className="delete-btn">
                          Delete
                        </button>
                      </td>
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

export default ManageUsers;
