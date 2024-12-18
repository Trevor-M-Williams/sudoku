# Next.js Sudoku Game

A modern, interactive Sudoku game built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🔄 Unique puzzle generation
- 🎯 Real-time move validation
- 📝 Notes
- ⌨️ Keyboard shortcuts for efficient gameplay
- 🎨 Minimalist design

## Roadmap

- 3 errors = game over
- Toggle theme?
- Stats
  - high scores
  - Total games played
  - Percentage of games completed
  - Best time

## Tweaks
- save current game to local storage
- add top bar with difficulty and timer
- selecting a number should add to history (if there is a change)
- clicking on a cell shouldnt add to history if there is no change

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`, `yarn install`, or `pnpm install`
3. Run the development server with `npm run dev`, `yarn dev`, or `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) with your browser to play the game

## How to Play

- Use the number bar or keyboard shortcuts (Cmd/Ctrl + 1-9) to select a number
- When a number is selected:
  - hold Command/Ctrl while clicking on a cell to fill it
  - hold Option/Alt while clicking on a cell to toggle notes
- You can also fill cells by clicking on them and pressing the number on your keyboard
- Invalid moves will be highlighted in red

## Project Structure

/
├── app/ # Next.js app directory
├── components/ # React components
│ ├── sudoku/ # Sudoku-specific components
│ └── ui/ # Reusable UI components
├── contexts/ # React contexts
├── lib/ # Utility functions and game logic
└── public/ # Static assets

### Key Components

- `lib/sudoku.ts` - Core game logic including puzzle generation and validation
- `contexts/sudoku-context.tsx` - Game state management and business logic
- `components/sudoku/` - Sudoku-specific UI components:
  - `board.tsx` - Main game board
  - `cell.tsx` - Individual cell component
  - `number-bar.tsx` - Number selection interface
  - `modal.tsx` - Game completion modal

### Styling

The project uses Tailwind CSS for styling. You can customize the theme by modifying:

- `tailwind.config.ts` - Theme configuration
- `app/globals.css` - Global styles and CSS variables

### Game Difficulty

Adjust the puzzle difficulty in `contexts/sudoku-context.tsx` by modifying the difficulty constant (value between 0.0 for easiest and 1.0 for hardest).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
