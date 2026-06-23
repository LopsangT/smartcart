function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>SmartCart 🛒</h1>
      </div>
      <div className="navbar-links">
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    </nav>
  );
}

export default Navbar;