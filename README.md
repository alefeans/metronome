# Metrow - Modern Web Metronome

A sleek, professional web metronome designed for musicians, featuring precise timing, customizable time signatures, and an intuitive interface.

## 🎵 Features

- **Precise Timing**: Accurate BPM control from 40 to 240 beats per minute
- **Time Signatures**: Support for common time signatures (2/4, 3/4, 4/4, 5/4, 6/8, 7/8, 9/8, 12/8)
- **Visual Feedback**: Beat indicators with accent highlighting on downbeats
- **Audio Options**: Distinct sounds for accented and normal beats
- **Tap Tempo**: Set tempo by tapping rhythm
- **Subdivision Support**: Practice with 8th, 16th, and triplet subdivisions
- **Keyboard Shortcuts**: Quick access to essential functions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

[View Live Demo](#) *(Link will be added after deployment)*

## 💻 Usage

1. **Set Tempo**: Use the slider or +/- buttons to adjust BPM (40-240)
2. **Choose Time Signature**: Select from dropdown menu
3. **Start/Stop**: Click the play button or press Spacebar
4. **Tap Tempo**: Click "Tap Tempo" button in rhythm to set BPM
5. **Volume Control**: Adjust metronome volume independently
6. **Subdivisions**: Toggle 8th, 16th, or triplet subdivisions for practice

### Keyboard Shortcuts

- **Spacebar**: Start/Stop metronome
- **T**: Open Tap Tempo
- **↑/↓**: Increase/Decrease BPM
- **1-8**: Quick select time signatures

## 🛠️ Development Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/metrow.git
cd metrow
```

2. Serve the files:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server app/src -p 8000

# Or simply open index.html in your browser
```

3. Open your browser to `http://localhost:8000`

### Project Structure

```
metrow/
├── app/
│   ├── src/
│   │   ├── index.html       # Main HTML file
│   │   ├── styles.css       # Styling
│   │   ├── metronome.js     # Core metronome logic
│   │   └── ui.js            # UI interactions
│   ├── docs/                # Documentation
│   └── tests/               # Test files
├── README.md
├── netlify.toml             # Netlify config
├── vercel.json              # Vercel config
└── .gitignore
```

## 📦 Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Netlify will auto-detect settings from `netlify.toml`
4. Deploy!

Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Vercel will use `vercel.json` configuration
4. Deploy!

Or use Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

### Deploy to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select branch and `/app/src` folder
4. Save and wait for deployment

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --primary-color: #2563eb;
  --background: #0f172a;
  --surface: #1e293b;
  /* ... more variables */
}
```

### Adding New Features

- **Metronome Logic**: Edit `metronome.js`
- **UI Components**: Modify `ui.js`
- **Styling**: Update `styles.css`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

Built with vanilla JavaScript for maximum performance and compatibility.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ♪ by musicians, for musicians
