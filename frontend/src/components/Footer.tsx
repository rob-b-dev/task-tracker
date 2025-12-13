import "../styles/footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="main-container footer__container">
        <div className="footer__content">
          <div className="footer__copyright">
            © {currentYear} Task Tracker. All rights reserved.
          </div>

          <div className="footer__links">
            <a href="#" className="footer__link">
              About
            </a>
            <a href="#" className="footer__link">
              Privacy
            </a>
            <a href="#" className="footer__link">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
