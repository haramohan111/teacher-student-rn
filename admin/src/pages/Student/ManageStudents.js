import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/Student/ManageStudents.tsx
import { useState, useMemo, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import '../../styles/Manage.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, toggleVerified } from '../../redux/features/student/studentSlice';
const ManageStudents = () => {
    const dispatch = useDispatch();
    const { students } = useSelector((state) => state.students);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [sortConfig, setSortConfig] = useState({
        key: 'id',
        direction: 'ascending'
    });
    const [loading, setLoading] = useState(true);
    // Sorting
    const requestSort = (key) => {
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
                    const nameA = `${a === null || a === void 0 ? void 0 : a.firstName} ${a === null || a === void 0 ? void 0 : a.lastName}`.toLowerCase();
                    const nameB = `${b === null || b === void 0 ? void 0 : b.firstName} ${b === null || b === void 0 ? void 0 : b.lastName}`.toLowerCase();
                    if (nameA < nameB)
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (nameA > nameB)
                        return sortConfig.direction === 'ascending' ? 1 : -1;
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
            var _a, _b, _c, _d, _e;
            const searchLower = searchTerm.toLowerCase();
            return (((_a = student === null || student === void 0 ? void 0 : student.firstName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower)) ||
                ((_b = student === null || student === void 0 ? void 0 : student.lastName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower)) ||
                ((_c = student === null || student === void 0 ? void 0 : student.email) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower)) ||
                ((_d = student === null || student === void 0 ? void 0 : student.status) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(searchLower)) ||
                ((_e = student === null || student === void 0 ? void 0 : student.id) === null || _e === void 0 ? void 0 : _e.toString().includes(searchTerm)));
        });
    }, [sortedStudents, searchTerm]);
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const studentsPerPage = 10;
    const pageCount = Math.ceil(filteredStudents.length / studentsPerPage);
    const offset = currentPage * studentsPerPage;
    const currentStudents = filteredStudents.slice(offset, offset + studentsPerPage);
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
        setSelectAll(false);
    };
    // Delete handlers
    const handleDelete = (studentId) => {
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
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
        setSelectedStudents([]);
        setSelectAll(false);
    };
    // Selection
    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
    };
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedStudents([]);
        }
        else {
            setSelectedStudents(currentStudents.map(student => student.id));
        }
        setSelectAll(!selectAll);
    };
    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
        }
        return null;
    };
    useEffect(() => {
        dispatch(fetchStudents()).finally(() => setLoading(false));
    }, [dispatch]);
    return (_jsxs("div", { className: "manage-container", children: [_jsxs("div", { className: "header", children: [_jsx("h2", { children: "Manage Students" }), _jsx("div", { className: "header-actions", children: _jsxs("div", { className: "search-container", children: [_jsx("input", { type: "text", placeholder: "Search students...", value: searchTerm, onChange: handleSearchChange, className: "search-input" }), _jsx("span", { className: "search-icon", children: "\uD83D\uDD0D" })] }) })] }), selectedStudents.length > 0 && (_jsxs("div", { className: "bulk-actions", children: [_jsxs("span", { children: [selectedStudents.length, " student(s) selected"] }), _jsx("button", { onClick: handleBulkDelete, className: "bulk-delete-btn", children: "Delete Selected" })] })), loading ? (_jsxs("div", { className: "loader-container", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "Loading students..." })] })) : (_jsx("div", { className: "table-container", children: (students === null || students === void 0 ? void 0 : students.length) === 0 ? (_jsx("div", { className: "no-results", children: "No students found matching your search criteria." })) : (_jsxs(_Fragment, { children: [_jsxs("table", { className: "data-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: _jsx("input", { type: "checkbox", checked: selectAll, onChange: toggleSelectAll }) }), _jsxs("th", { onClick: () => requestSort('id'), children: ["ID", getSortIndicator('id')] }), _jsxs("th", { onClick: () => requestSort('name'), children: ["Name", getSortIndicator('name')] }), _jsxs("th", { onClick: () => requestSort('email'), children: ["Email", getSortIndicator('email')] }), _jsxs("th", { onClick: () => requestSort('status'), children: ["Status", getSortIndicator('status')] }), _jsxs("th", { onClick: () => requestSort('lastLogin'), children: ["Last Login", getSortIndicator('lastLogin')] }), _jsxs("th", { onClick: () => requestSort('verified'), children: ["Verified", getSortIndicator('verified')] })] }) }), _jsx("tbody", { children: currentStudents.map(student => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("input", { type: "checkbox", checked: selectedStudents.includes(student.id), onChange: () => toggleStudentSelection(student.id) }) }), _jsx("td", { children: student.id }), _jsx("td", { children: student.name }), _jsx("td", { children: student.email }), _jsx("td", { children: _jsx("span", { className: `status-badge ${student.verified}`, children: student.verified ? 'verified' : 'not-verified' }) }), _jsx("td", { children: student.lastLogin || 'Never' }), _jsxs("td", { children: [_jsx("span", { className: `status-badge ${student.verified ? 'verified' : 'not-verified'}`, children: student.verified ? 'Yes' : 'No' }), _jsx("button", { className: "verify-btn", onClick: () => dispatch(toggleVerified({ uid: student.uid, verified: !student.verified })), children: student.verified ? 'Revoke' : 'Approve' })] })] }, student.id))) })] }), _jsx(ReactPaginate, { previousLabel: '← Previous', nextLabel: 'Next →', pageCount: pageCount, onPageChange: handlePageClick, forcePage: currentPage, containerClassName: 'pagination', previousLinkClassName: 'pagination__link', nextLinkClassName: 'pagination__link', disabledClassName: 'pagination__link--disabled', activeClassName: 'pagination__link--active', pageRangeDisplayed: 5, marginPagesDisplayed: 2 })] })) }))] }));
};
export default ManageStudents;
