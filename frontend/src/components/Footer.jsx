import React from "react";
import { FaCode, FaGithub, FaLinkedin, FaTwitter, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <div style={styles.logoSection}>
              <div style={styles.logo}>
                <div style={styles.logoIcon}>
                  <FaCode size={20} />
                </div>
                <h3 style={styles.logoText}>CodeVault</h3>
              </div>
              <p style={styles.logoDescription}>
                A modern Git-like version control system for developers.
              </p>
            </div>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Product</h4>
            <ul style={styles.linkList}>
              <li><a href="/repository/create" style={styles.footerLink}>Create Repository</a></li>
              <li><a href="/connections" style={styles.footerLink}>Connections</a></li>
              <li><a href="/profile" style={styles.footerLink}>Profile</a></li>
            </ul>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Support</h4>
            <ul style={styles.linkList}>
              <li><a href="#" style={styles.footerLink}>Documentation</a></li>
              <li><a href="#" style={styles.footerLink}>Help Center</a></li>
              <li><a href="#" style={styles.footerLink}>Contact Us</a></li>
            </ul>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.sectionTitle}>Connect</h4>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.socialLink} aria-label="GitHub">
                <FaGithub size={20} />
              </a>
              <a href="#" style={styles.socialLink} aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="#" style={styles.socialLink} aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <div style={styles.footerBottomContent}>
            <p style={styles.copyright}>
              © 2024 CodeVault. Made with <FaHeart style={styles.heartIcon} /> for developers.
            </p>
            <div style={styles.footerBottomLinks}>
              <a href="#" style={styles.bottomLink}>Privacy Policy</a>
              <a href="#" style={styles.bottomLink}>Terms of Service</a>
              <a href="#" style={styles.bottomLink}>Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#161b22",
    borderTop: "1px solid #30363d",
    marginTop: "auto",
    padding: "0",
  },
  footerContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
  },
  footerContent: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "48px",
    padding: "48px 0 32px",
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
  },
  logoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    background: "#58a6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "800",
    margin: 0,
    color: "#c9d1d9",
  },
  logoDescription: {
    fontSize: "14px",
    color: "#8b949e",
    margin: 0,
    lineHeight: "1.5",
    maxWidth: "280px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#c9d1d9",
    margin: "0 0 16px 0",
  },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  footerLink: {
    color: "#8b949e",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  socialLinks: {
    display: "flex",
    gap: "16px",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    background: "#21262d",
    color: "#8b949e",
    textDecoration: "none",
    transition: "all 0.3s ease",
    border: "1px solid #30363d",
  },
  footerBottom: {
    borderTop: "1px solid #30363d",
    padding: "24px 0",
  },
  footerBottomContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  copyright: {
    fontSize: "14px",
    color: "#8b949e",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  heartIcon: {
    color: "#f85149",
    fontSize: "12px",
  },
  footerBottomLinks: {
    display: "flex",
    gap: "24px",
  },
  bottomLink: {
    color: "#8b949e",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
};

export default Footer;
