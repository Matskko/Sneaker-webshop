# Angular Sneaker Shop 👟

A modern, responsive e-commerce website for sneakers built with Angular 17, featuring a clean design and smooth user experience.

## 🚀 Features

- **Product Catalog**: Browse through a collection of premium sneakers
- **Product Details**: Click on any shoe to view detailed information in a modal
- **Shopping Cart**: Add items to cart with persistent storage
- **Favorites**: Save your favorite sneakers for later
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations

## 🛠️ Technologies Used

- **Frontend**: Angular 17, TypeScript, CSS3
- **Backend**: Supabase (Database & Authentication)
- **Styling**: Custom CSS with modern design principles
- **Icons**: Emoji-based icons for cross-platform compatibility

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/angular-sneaker-shop.git
   cd angular-sneaker-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
   ```

4. **Configure your environment files**
   
   Edit `src/environments/environment.ts` and add your actual API keys:
   ```typescript
   export const environment = {
     production: false,
     googleMapsApiKey: 'your-actual-google-maps-api-key',
     firebaseConfig: {
       // Your Firebase config
     },
     supabaseUrl: 'your-supabase-url',
     supabaseKey: 'your-supabase-anon-key'
   };
   ```

5. **Start the development server**
   ```bash
   ng serve
   ```
   
   Navigate to `http://localhost:4200/` in your browser.

## 🌐 Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard

### Netlify
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod`


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Info**
- Email: Tobiasvdvaart@gmail.com

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Supabase for the backend infrastructure
- All the sneaker brands for inspiration

---

⭐ Star this repository if you found it helpful!
