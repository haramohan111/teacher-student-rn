import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
// <React.StrictMode>
_jsx(Provider, { store: store, children: _jsx(App, {}) })
// </React.StrictMode>
);
