export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=".footer">
      <p className="footer-p">Cell: +1 (239) 961-9175</p>
      <p className="footer-p">Email: patrick1bauer@gmail.com</p>
      <p className="footer-p">© {currentYear} All Rights Reserved.</p>
    </footer>
  );
}
