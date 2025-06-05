FantasyWorldBuilder

A web-based tool for creating and managing fantasy worlds, including lore, characters, timelines, maps, notes, and connections. Built with React, TypeScript, Tailwind CSS, and Zustand.

Features

Lore Module: Manage lore entries and magic trees.

Characters Module: Create and edit characters with relationships.

Timeline Module: Build event chronologies.

Map Module: Design locations and boundaries.

Notes Module: Organize notes with folders and tags.

Connections Module: Visualize entity relationships using vis-network.

Global Search: Search across all modules with fuse.js.

Onboarding: Interactive tutorial for new users.

Templates Module: Predefined templates for entities.

Dashboard Module: Analytics and statistics.

Export/Import Module: Export and import data in JSON.

Localization: Supports Ukrainian, Polish, and English.

Sound Effects: Toggleable fantasy-themed sounds.

Installation

Clone the repository:

git clone https://github.com/hkapets/FantasyWorldBuilder.git
cd FantasyWorldBuilder

Install dependencies:

npm install

Add sound files to public/audio/:

parchment-rustle.mp3

quill-button.mp3

button-click.mp3

magic-chime.wav

Run the development server:

npm run dev

Testing

Run unit tests:

npm test

Run Cypress E2E tests:

npx cypress open

Deployment

Build the project:

npm run build

Deploy the dist/ folder to your hosting service.

License

MIT License
