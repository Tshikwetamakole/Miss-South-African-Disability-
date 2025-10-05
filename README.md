# Miss South Africa Disability Website 👑♿

![Miss South Africa Disability](assets/images/Miss2.jpg)

> Empowering women with disabilities through beauty, advocacy, and leadership in South Africa

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)
[![WCAG AA](https://img.shields.io/badge/WCAG-AA-blue.svg)](https://www.w3.org/WAI/WCAG2AA-Conformance)
[![Accessibility](https://img.shields.io/badge/Accessibility-Compliant-brightgreen.svg)](https://www.w3.org/WAI/)
[![Mobile First](https://img.shields.io/badge/Mobile-First-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## 🌟 Overview

The Miss South Africa Disability website is a comprehensive digital platform designed to celebrate, empower, and advocate for women with disabilities. This inclusive beauty pageant platform promotes diversity, accessibility, and equal representation while providing a seamless user experience for all visitors.

## ✨ Key Features

### 🎯 Core Functionality
- **Inclusive Application System**: Streamlined registration and application process
- **Event Calendar**: Interactive calendar with RSVP functionality for pageant events
- **Alumni Showcase**: Highlighting past winners and their achievements
- **Resource Library**: Educational materials and accessibility resources
- **Live Chat Support**: Real-time assistance with accessibility features
- **Blog & News**: Latest updates, success stories, and advocacy content
- **Gallery**: Photo galleries from events and celebrations
- **Sponsor Portal**: Information for potential sponsors and partners

### ♿ Accessibility Features
- **WCAG AA Compliance**: Meets international accessibility standards
- **Screen Reader Support**: Full compatibility with assistive technologies
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast Mode**: Enhanced visibility options
- **Alternative Text**: Comprehensive image descriptions
- **Focus Management**: Clear focus indicators and logical tab order
- **ARIA Labels**: Semantic markup for assistive technologies

### 📱 Progressive Web App (PWA)
- **Offline Support**: Service Worker implementation for offline functionality
- **App-like Experience**: Installable web application
- **Push Notifications**: Event reminders and updates
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility standards
- **CSS3**: Modern styling with custom properties and Grid/Flexbox
- **JavaScript (ES6+)**: Vanilla JavaScript for interactive functionality
- **Service Worker**: PWA capabilities and caching strategies

### Design System
- **Typography**: Playfair Display & Poppins font families
- **Color Palette**: Orange (#f97316) primary with accessible contrast ratios
- **Icons**: Font Awesome 6.4.0 icon library
- **Layout**: CSS Grid and Flexbox for responsive layouts

### Development Tools
- **Version Control**: Git with GitHub
- **Code Standards**: ESLint and Prettier configurations
- **Performance**: Lighthouse optimization
- **Testing**: Cross-browser and accessibility testing

## 📁 Project Structure

```
Miss-South-African-Disability-/
├── 📄 index.html              # Homepage with hero section and key features
├── 📄 about.html              # About the pageant and mission
├── 📄 apply.html              # Application information
├── 📄 registration.html       # Registration form
├── 📄 blog.html               # News and blog posts
├── 📄 events.html             # Events and calendar
├── 📄 gallery.html            # Photo galleries
├── 📄 contact.html            # Contact information and form
├── 📄 sponsors.html           # Sponsor information
├── 📄 press.html              # Press releases and media
├── 📄 faq.html                # Frequently asked questions
├── 📄 accessibility-statement.html  # Accessibility commitment
├── 📄 privacy-policy.html     # Privacy policy
├── 📄 terms-of-service.html   # Terms of service
├── 🎨 style.css               # Main stylesheet with design system
├── ⚡ script.js               # Interactive functionality
├── 🔧 sw.js                   # Service Worker for PWA features
├── 🌐 translations.js         # Multi-language support
├── 📋 manifest.json           # PWA manifest
├── 📁 assets/
│   ├── 🖼️ images/             # Event photos and graphics
│   └── 🏷️ logos/              # Brand logos and icons
└── 📁 jules-scratch/
    └── 🔍 verification/        # Code verification tools
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tshikwetamakole/Miss-South-African-Disability-.git
   cd Miss-South-African-Disability-
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Development Setup

1. **Install development dependencies** (if using build tools)
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📖 Usage Guide

### For Contestants
1. **Browse the Homepage**: Learn about the pageant and its mission
2. **Read About Section**: Understand the values and history
3. **Check Events**: View upcoming events and RSVP
4. **Apply**: Use the registration form to submit your application
5. **Stay Updated**: Follow the blog for latest news and tips

### For Visitors
1. **Explore Gallery**: View photos from past events
2. **Read Success Stories**: Learn about alumni achievements
3. **Access Resources**: Download accessibility guides and materials
4. **Get Support**: Use the live chat for assistance
5. **Stay Connected**: Subscribe to the newsletter

### For Sponsors
1. **Review Opportunities**: Check the sponsors page for partnership options
2. **Contact Team**: Use the contact form for partnership inquiries
3. **Media Kit**: Access press materials and brand guidelines

## ♿ Accessibility Commitment

This website is designed to be accessible to all users, including those with disabilities. We are committed to:

- **WCAG AA Compliance**: Meeting international accessibility standards
- **Universal Design**: Creating inclusive experiences for everyone
- **Assistive Technology**: Full compatibility with screen readers and other tools
- **Continuous Improvement**: Regular accessibility audits and updates

### Accessibility Features:
- Alt text for all images
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatibility
- Focus indicators
- Semantic HTML structure
- ARIA labels and descriptions

## 🧪 Testing

### Accessibility Testing
```bash
# Run accessibility audit
npm run test:a11y

# Check WCAG compliance
npm run test:wcag
```

### Performance Testing
```bash
# Lighthouse audit
npm run test:lighthouse

# Performance metrics
npm run test:performance
```

### Cross-browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### GitHub Pages
The site is automatically deployed to GitHub Pages on push to main branch.

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to your hosting provider
# Upload the dist/ folder contents
```

### Environment Variables
```bash
# For production deployment
SITE_URL=https://misssouthafricadisability.co.za
CONTACT_EMAIL=info@misssouthafricadisability.co.za
ANALYTICS_ID=your-analytics-id
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- Follow accessibility best practices
- Use semantic HTML
- Maintain consistent code formatting
- Include appropriate ARIA labels
- Test with screen readers
- Ensure keyboard navigation works

## 📝 Changelog

### v2.0.0 (Current)
- ✨ Added interactive event calendar with RSVP functionality
- 🎓 Implemented alumni showcase and resources library
- 💬 Integrated live chat widget with accessibility support
- 📧 Enhanced newsletter integration with anti-spam protection
- 🔧 Improved Service Worker with analytics support
- ♿ Enhanced accessibility features and WCAG AA compliance

### v1.0.0
- 🚀 Initial release with core pageant website functionality
- 📱 PWA implementation with offline support
- ♿ Accessibility-first design and development
- 🎨 Responsive design system with brand identity

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Website**: [https://misssouthafricadisability.co.za](https://misssouthafricadisability.co.za)
- **Email**: info@misssouthafricadisability.co.za
- **Phone**: +27 (0) XXX XXX XXXX
- **Social Media**: 
  - Facebook: [@MissSADisability](https://facebook.com/MissSADisability)
  - Instagram: [@miss_sa_disability](https://instagram.com/miss_sa_disability)
  - Twitter: [@MissSADisability](https://twitter.com/MissSADisability)

## 🙏 Acknowledgments

- **Miss South Africa Organization**: For supporting inclusive beauty pageants
- **Accessibility Community**: For guidance on inclusive design practices
- **Contributors**: All developers and advocates who have contributed to this project
- **Contestants & Alumni**: For inspiring this platform with their strength and leadership

## 📊 Project Stats

- **Launch Date**: 2024
- **Contributors**: 5+
- **Pages**: 13
- **Languages**: English (South African)
- **Accessibility Level**: WCAG AA
- **Performance Score**: 95+ (Lighthouse)
- **Mobile Friendly**: ✅
- **PWA Ready**: ✅

---

**Made with ❤️ for the disability advocacy community in South Africa**

*Empowering women with disabilities through technology, accessibility, and inclusive design.*