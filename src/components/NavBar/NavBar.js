import { Link } from 'react-router-dom';

export default function NavBar(props) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link to={'/'} className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/customer'} className="nav-link">Customer</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/item'} className="nav-link">Item</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/order'} className="nav-link">Order</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}