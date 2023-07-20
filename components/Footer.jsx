export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=".footer">
      <p className="footer-p">Cell: 239.777.7080</p>
      <p className="footer-p">Email: patrick1bauer@gmail.com</p>
      <p className="footer-p">© {currentYear} All Rights Reserved.</p>
    </footer>
  );
}
