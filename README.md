# Giftbox

A playful, interactive web application for creating and sharing digital gift boxes / scrapbooks with various multimedia elements on an infinite canvas. Built with Next.js, TypeScript, and PocketBase.

## Features

- 📝 **Sticky Notes**: Add text notes with customizable, playful background colors.
- 📷 **Photos**: Upload and add photos with customizable captions.
- 🎤 **Voice Messages**: Record voice messages directly in the browser using the Web Audio API.
- 🎵 **Spotify Tracks**: Embed interactive Spotify player cards via simple URLs.
- ✏️ **Doodles & Sketches**: Draw doodles freely on a sketchpad and place them on the canvas.
- 🔗 **Shareable Links**: Save and generate a shareable URL to share with others.

---

## Getting Started

### Local Development (Manual Setup)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Heracraft/giftbox.git
   cd giftbox
   ```

2. **Configure Environment Variables**:
   Copy the example environment file and configure your PocketBase instance URL:
   ```bash
   cp .env.example .env
   ```
   For local development, this typically points to:
   ```env
   NEXT_PUBLIC_POCKETBASE_INSTANCE_URL=http://localhost:8080
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment & Hosting

### 1. Standard Self-Hosting (Vanilla Docker)

If you wish to self-host the stack (Next.js + PocketBase) using standard Docker Compose, use `docker-compose_vanilla.yml`.

1. Copy `.env.example` to `.env` and fill in your domain/public URL for PocketBase:
   ```env
   NEXT_PUBLIC_POCKETBASE_INSTANCE_URL=https://pb.yourdomain.com
   ```

2. Spin up the containers:
   ```bash
   docker-compose -f docker-compose_vanilla.yml up -d
   ```
   *The Next.js container will build the app and correctly inline your public PocketBase URL.*

---

### 2. Coolify Deployment

This repository includes a default `docker-compose.yml` pre-configured for deployment on **Coolify**.

It leverages Coolify's **Magic Environment Variables** feature to handle internal and public URL mappings.

#### Coolify Magic Environment Variables:
1. When Coolify provisions the `pocketbase` container, it dynamically generates an environment variable containing its public URL: `SERVICE_URL_POCKETBASE_8080`.
2. This variable is automatically inherited by other services defined in the same compose file.
3. In `docker-compose.yml`, the Next.js application (`web`) references this generated variable during both build time and runtime:
   ```yaml
   args:
     - NEXT_PUBLIC_POCKETBASE_INSTANCE_URL=${SERVICE_URL_POCKETBASE_8080}
   environment:
     - NEXT_PUBLIC_POCKETBASE_INSTANCE_URL=${SERVICE_URL_POCKETBASE_8080}
   ```
4. As a result, the Next.js frontend is built with the correct public PocketBase endpoint mapped automatically, without requiring any manual environment configuration in the Coolify UI.

---

## Usage

- **Toolbar**: Click toolbar icons at the bottom of the screen to add elements (Sticky Notes, Photos, Voice Notes, Spotify Cards, or Doodles).
- **Navigation**: Left-click and drag the empty canvas background to pan around. Use your mouse wheel or trackpad pinch gestures to zoom.
- **Item Manipulation**:
  - Drag items by their body to reposition them.
  - Hover over an item to access controls: delete the item, rotate it, or manage its layering (bring to front / send to back).
- **Saving**: Click the Share/Save icon in the toolbar. The current state of your box is saved to PocketBase, and a shareable link is copied to your clipboard.

## License

MIT
