# Study Reels Feature

## Overview
The Study Reels feature provides an interactive, TikTok-style learning experience with YouTube Shorts embedded alongside comprehensive educational articles.

## Features
- 📹 **YouTube Shorts Integration**: Embedded YouTube videos for visual learning
- 📚 **Comprehensive Articles**: Detailed explanations with code examples
- 🎨 **Resizable Layout**: Drag to adjust video/article panel sizes
- 🔄 **Smooth Navigation**: Scroll or click to navigate between reels
- 💡 **Code Examples**: Syntax-highlighted code snippets
- 🔗 **Related Resources**: Links to additional learning materials

## Current Topics (10 Reels)
1. **Arrow Functions** - ES6 arrow function syntax and use cases
2. **Spread Operator** - Array and object spreading techniques
3. **Optional Chaining** - Safe property access with `?.`
4. **Math.random()** - Random number generation
5. **Math.ceil()** - Rounding up numbers
6. **Math.abs()** - Absolute values
7. **Math.floor()** - Rounding down numbers
8. **Ternary Operator** - Conditional expressions
9. **Truthy and Falsy** - Boolean coercion in JavaScript
10. **Map Function** - Array transformation with `map()`

## Backend Setup

### Database Model
- **Reel Model** (`src/models/Reel.js`)
  - Title, description, author
  - YouTube URL and embed URL
  - Article with content, code examples, topics
  - Difficulty level and read time

### API Endpoints
- `GET /api/reels` - Get all reels
- `GET /api/reels/:id` - Get single reel by ID
- `POST /api/reels` - Create new reel (auth required)
- `PUT /api/reels/:id` - Update reel (auth required)
- `DELETE /api/reels/:id` - Delete reel (auth required)

### Seeding the Database
```bash
# Run the seed script
npm run seed:reels

# Or manually
node src/seeds/seedReels.js
```

## Frontend Implementation

### Component Structure
- **Reels.jsx** - Main component
- **reelService.js** - API service for fetching reels

### Features
- Fetches reels from backend API
- YouTube iframe embed with autoplay
- Resizable split-pane layout
- Scroll/click navigation
- Loading and error states
- Responsive design

### Usage
```javascript
import Reels from './components/Reels';

function App() {
  return <Reels />;
}
```

## Adding New Reels

### Option 1: Via Seed File
1. Edit `server/src/seeds/reelsData.js` or `reelsDataPart2.js`
2. Add new reel object with:
   - Title, description, author
   - YouTube URL and embed URL
   - Article content with code examples
   - Topics and related links
3. Run `npm run seed:reels`

### Option 2: Via API
```javascript
POST /api/reels
{
  "title": "Your Topic",
  "description": "Brief description",
  "youtubeUrl": "https://youtube.com/shorts/...",
  "embedUrl": "https://www.youtube.com/embed/...",
  "author": "Instructor Name",
  "article": {
    "title": "Article Title",
    "content": "Detailed content...",
    "readTime": "5 min read",
    "difficulty": "Beginner",
    "topics": ["JavaScript", "ES6"],
    "codeExamples": [
      {
        "title": "Example Title",
        "code": "const example = 'code';",
        "language": "javascript"
      }
    ],
    "relatedLinks": [
      {
        "title": "MDN Docs",
        "url": "https://developer.mozilla.org"
      }
    ]
  }
}
```

## YouTube Embed URL Format
Convert YouTube Shorts URL to embed URL:
- **Shorts URL**: `https://youtube.com/shorts/VIDEO_ID?si=...`
- **Embed URL**: `https://www.youtube.com/embed/VIDEO_ID`

Example:
- Shorts: `https://youtube.com/shorts/dg0QhMxU31U?si=V-EkOx7fS0GxnjpC`
- Embed: `https://www.youtube.com/embed/dg0QhMxU31U`

## Styling
- Dark theme (bg-gray-900, bg-black)
- Purple/pink gradient accents
- Glassmorphism effects
- Smooth transitions
- Responsive layout

## Future Enhancements
- [ ] User progress tracking
- [ ] Bookmarking favorite reels
- [ ] Search and filter functionality
- [ ] Quiz integration after each reel
- [ ] User-submitted reels
- [ ] Comments and discussions
- [ ] Playlist creation
- [ ] Mobile app version

## Technologies Used
- **Frontend**: React, Tailwind CSS, React Icons
- **Backend**: Node.js, Express, MongoDB
- **Video**: YouTube Embed API
- **State Management**: React Hooks

## Notes
- Videos are embedded from YouTube (no local storage needed)
- All content is stored in MongoDB
- Fully responsive and mobile-friendly
- Optimized for learning and engagement
