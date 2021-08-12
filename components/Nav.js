import Link from 'next/link'
const Nav = () => {
    return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light position-sticky">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">Traffikr.IO</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link href="/">
                                <a className="nav-link active" aria-current="page">Home</a>
                                </Link>
                            </li>
                        </ul>
                        <div className="d-flex">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link href="/login">
                                <a className="nav-link active" aria-current="page">Login</a>
                                </Link>
                            </li>
                            <li className="nav-item d-flex align-items-center">
                                <Link href="/register">
                                <a className="btn btn-primary btn-sm">Signup</a>
                                </Link>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
            </nav>
    )
}

export default Nav
