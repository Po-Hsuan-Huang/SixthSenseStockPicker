# 🌌 Synesthetic Stock Radar (React + Three.js)

**Experience stocks through AI's sixth sense** - A stunningA 3D data visualization tool that maps financial metrics to physical properties (size, color, glow, motion) to help investors intuitively spot opportunities.

[**View Visual Walkthrough**](WALKTHROUGH.md)

## ✨ Features

- **🌌 3D Radar View**: Real-time physics-based visualization with 80+ stocks
- **🎮 Interactive Controls**: Adjust gravity, time speed, collision detection
- **📊 Rule of 40 Classic**: Traditional 2D scatter plot analysis
- **📖 Educational Content**: Learn about post-scarcity economics
- **🎨 Premium UI**: Dark space theme with glassmorphism effects
- **⚡ Real-time Physics**: 60 FPS gravity simulation with elastic collisions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd sixth_sense_stock_picker

# Install dependencies
npm install

# Start the backend API server (in one terminal)
node server/api.js

# Start the frontend dev server (in another terminal)
npm run dev
```

Then open your browser to: **http://localhost:5173**

## 🎮 Controls

### Radar View
- **Mouse Drag**: Orbit camera around the scene
- **Scroll**: Zoom in/out
- **Hover**: View detailed stock information
- **Control Panel**:
  - Filter stocks (All, Top Gainers, Most Traded, Best Value)
  - Adjust time speed (0.1x to 10x)
  - Control gravity strength
  - Toggle physics simulation, collisions, and labels

## 🧠 The Synesthetic Mappings

| Financial Metric | 3D Property | What It Means |
|-----------------|-------------|---------------|
| 🔵 **Market Cap** | **Bubble Size** | Bigger companies = larger spheres |
| 🎨 **Price Change** | **Color** | Blue (falling) → Red (rising) |
| ✨ **Rule of 40** | **Glow Intensity** | Brighter = better value |
| 🌫️ **Debt Level** | **Opacity** | More transparent = higher debt |
| 🚀 **Revenue Growth** | **Velocity** | Faster movement = higher growth |
| 🏀 **Volatility** | **Elasticity** | Bouncier = more volatile |

## 📦 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **3D Rendering**: Three.js + React Three Fiber
- **State Management**: Zustand
- **Effects**: React Three Postprocessing (Bloom, etc.)
- **Backend**: Express.js (Node.js)
- **Styling**: Vanilla CSS with glassmorphism

## 🎨 API Endpoints

```
GET  /api/stocks              - All stocks
GET  /api/stocks/gainers      - Top gaining stocks
GET  /api/stocks/most-traded  - Highest volume stocks
GET  /api/stocks/best-value   - High Rule of 40 scores
POST /api/cache/clear         - Clear data cache
```

## 🛠️ Project Structure

```
sixth_sense_stock_picker/
├── src/
│   ├── components/         # React components
│   │   ├── RadarView.tsx   # 3D scene
│   │   ├── StockBubble.tsx # Individual stock spheres
│   │   ├── PhysicsEngine.tsx # Physics simulation
│   │   ├── ValueCore.tsx   # Central gravity well
│   │   ├── ControlPanel.tsx # Settings UI
│   │   ├── ClassicView.tsx # 2D scatter plot
│   │   └── LearnView.tsx   # Educational content
│   ├── hooks/
│   │   └── useStockData.ts # Data fetching
│   ├── stores/
│   │   └── stockStore.ts   # Global state (Zustand)
│   ├── utils/
│   │   ├── physics.ts      # Physics calculations
│   │   └── formatters.ts   # Data formatting
│   └── App.tsx             # Main app
├── server/
│   └── api.js              # Express API server
└── package.json
```

## 🔮 Future Enhancements

- [ ] Sector clustering with color-coded zones
- [ ] Historical playback (time-travel through market data)
- [ ] Portfolio tracking
- [ ] Achievement system (gamification)
- [ ] Real Yahoo Finance API integration
- [ ] VR/AR mode for immersive experience
- [ ] AI-powered pattern detection

## 📝 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- Original Python/Dash version: [stocks_website](../stocks_website)
- Built with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Inspired by synesthetic data visualization principles

---

**Made with ✨ by transforming abstract data into intuitive experiences**
