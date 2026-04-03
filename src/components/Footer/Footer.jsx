/**
 * FOOTER COMPONENT
 * Site footer with links and copyright information.
 * Features:
 * - Multi-column link layout
 * - Responsive grid design
 * - Copyright information
 */

import React from 'react';
import './Footer.css';

const Footer = () => {
  // Footer link groups
  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Press", "Contact"]
    },
    {
      title: "Support",
      links: ["Help Center", "Safety Information", "Cancellation Options", "Terms of Use"]
    },
    {
      title: "Legal",
      links: ["Privacy", "Cookie Preferences", "Corporate Information", "Legal Notices"]
    },
    {
      title: "Social",
      links: ["Facebook", "Twitter", "Instagram", "YouTube"]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          {footerLinks.map((section, index) => (
            <div key={index} className="footer-column">
              <h4 className="footer-column-title">{section.title}</h4>
              {section.links.map((link, linkIndex) => (
                <a 
                  key={linkIndex} 
                  href="#" 
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`${link} - This is a demonstration link.`);
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        
        <div className="footer-copyright">
          <p>© 2024 Netflix Clone - Educational Project</p>
          <p>This is a student project for WEB101 assignment purposes only.</p>
          <p>Student ID: 02190108_WEB101_PA1</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;