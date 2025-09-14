import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/Teacher/ManageTeacher.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachers, deleteTeacherAsync, selectAllTeachers, selectTeacherStatus, } from "../../redux/features/teacher/teacherSlice";
import "../../styles/Manage.css";
const ManageTeacher = () => {
    const dispatch = useDispatch();
    const teachers = useSelector(selectAllTeachers);
    const status = useSelector(selectTeacherStatus);
    // State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const itemsPerPage = 10;
    // Fetch teachers from Firestore on mount
    useEffect(() => {
        dispatch(fetchTeachers());
    }, [dispatch]);
    // Filtering
    const filteredTeachers = teachers.filter((t) => {
        const searchLower = searchTerm.toLowerCase();
        return (t.name.toLowerCase().includes(searchLower) ||
            t.subject.toLowerCase().includes(searchLower) ||
            t.email.toLowerCase().includes(searchLower) ||
            (t.phone || "").includes(searchTerm));
    });
    // Pagination
    const pageCount = Math.ceil(filteredTeachers.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredTeachers.slice(offset, offset + itemsPerPage);
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };
    // Delete single teacher
    const handleDelete = (teacherId) => {
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            dispatch(deleteTeacherAsync(teacherId));
        }
    };
    // Checkbox (single)
    const handleCheckboxChange = (teacherId) => {
        setSelectedItems((prev) => prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]);
    };
    // Select all
    const handleSelectAllChange = () => {
        if (selectAll) {
            setSelectedItems([]);
        }
        else {
            const currentPageIds = currentItems.map((item) => item.id);
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
    return (_jsxs("div", { className: "manage-container", children: [_jsxs("div", { className: "header", children: [_jsx("h2", { children: "Manage Teachers" }), _jsxs("div", { className: "header-actions", children: [_jsxs("div", { className: "search-container", children: [_jsx("input", { type: "text", placeholder: "Search teachers...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "search-input" }), _jsx("span", { className: "search-icon", children: "\uD83D\uDD0D" })] }), _jsx(Link, { to: "/admin/teacher/add-teacher", className: "add-btn", children: "Add New Teacher" })] })] }), selectedItems.length > 0 && (_jsx("div", { className: "bulk-actions", children: _jsxs("button", { onClick: handleBulkDelete, className: "bulk-delete-btn", children: ["Delete Selected (", selectedItems.length, ")"] }) })), _jsx("div", { className: "table-container", children: status === "loading" ? (_jsx("div", { children: "Loading teachers..." })) : filteredTeachers.length === 0 ? (_jsx("div", { className: "no-results", children: "No teachers found." })) : (_jsxs(_Fragment, { children: [_jsxs("table", { className: "data-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: _jsx("input", { type: "checkbox", checked: selectAll, onChange: handleSelectAllChange }) }), _jsx("th", { children: "ID" }), _jsx("th", { children: "Name" }), _jsx("th", { children: "Subject" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Phone" }), _jsx("th", { children: "Join Date" }), _jsx("th", { children: "Image" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: currentItems.map((teacher, index) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("input", { type: "checkbox", checked: selectedItems.includes(teacher.id), onChange: () => handleCheckboxChange(teacher.id) }) }), _jsx("td", { children: offset + index + 1 }), _jsx("td", { children: teacher.name }), _jsx("td", { children: teacher.subject }), _jsx("td", { children: teacher.email }), _jsx("td", { children: teacher.phone }), _jsx("td", { children: teacher.joinDate }), _jsx("td", { children: teacher.profileImageUrl ? (_jsx("img", { src: teacher.profileImageUrl, alt: teacher.name, style: { width: "50px", borderRadius: "5px" } })) : ("No Image") }), _jsxs("td", { children: [_jsx(Link, { to: `/admin/teacher/edit/${teacher === null || teacher === void 0 ? void 0 : teacher.id}`, className: "edit-btn", children: "Edit" }), _jsx("button", { onClick: () => handleDelete(teacher === null || teacher === void 0 ? void 0 : teacher.id), className: "delete-btn", children: "Delete" })] })] }, teacher.id))) })] }), _jsx(ReactPaginate, { previousLabel: "← Previous", nextLabel: "Next →", pageCount: pageCount, onPageChange: handlePageClick, forcePage: currentPage, containerClassName: "pagination", previousLinkClassName: "pagination__link", nextLinkClassName: "pagination__link", disabledClassName: "pagination__link--disabled", activeClassName: "pagination__link--active" })] })) })] }));
};
export default ManageTeacher;
