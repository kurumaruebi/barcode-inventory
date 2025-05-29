# Barcode Inventory Management System

## Project Overview
This is a Next.js-based barcode inventory management system that allows users to scan barcodes and manage product inventory.

## Technology Stack
- **Frontend**: Next.js 15.3.2 with React 19
- **Styling**: Tailwind CSS v4
- **Barcode Scanning**: @zxing/browser and jsqr
- **Language**: TypeScript
- **Package Manager**: npm

## Project Structure
```
src/
├── app/
│   ├── components/          # React components
│   │   ├── BarcodeScanner.tsx    # Barcode scanning functionality
│   │   └── ProductDisplay.tsx    # Product display component
│   ├── data/               # Data files
│   │   └── products.ts     # Product data and types
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
```

## Key Features
- Barcode scanning using device camera
- Product lookup and display
- Inventory management
- Responsive design with Tailwind CSS

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Important Notes for Claude
- This project uses the latest versions of Next.js (15.3.2) and React (19.0.0)
- Barcode scanning is implemented using browser APIs
- The app follows modern React patterns with TypeScript
- All styling is done with Tailwind CSS v4

## Current Issues and TODOs
- Ensure barcode scanning works across different browsers
- Add error handling for camera access
- Implement product database integration
- Add unit tests for components