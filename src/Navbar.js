import React from 'react';
import './Navbar.css'; // Make sure to create this CSS file for styling your navbar

function Navbar({ onTabClick, activeTab, onBackClick }) {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a
                        href="#test-script"
                        className={`nav-link ${activeTab === 'test-script' ? 'active' : ''}`}
                        onClick={() => onTabClick('test-script')}
                    >
                        Test Script
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#object-map"
                        className={`nav-link ${activeTab === 'object-map' ? 'active' : ''}`}
                        onClick={() => onTabClick('object-map')}
                    >
                        Object Map
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        href="#variable-map"
                        className={`nav-link ${activeTab === 'variable-map' ? 'active' : ''}`}
                        onClick={() => onTabClick('variable-map')}
                    >
                        Variable Map
                    </a>
                </li>
            </ul>
            <div className="back-button-container">
                <button className="back-button" onClick={onBackClick}>
                    Back
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
