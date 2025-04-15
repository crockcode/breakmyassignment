# BreakMyAssignment

BreakMyAssignment is a web application that helps students break down their assignments into manageable parts, providing analysis, key requirements, and estimated completion times.

## Features

### Phase 1
- Upload PDF and DOCX files to Firebase Storage
- User-friendly drag-and-drop interface
- Clean, responsive UI using Tailwind CSS and DaisyUI (cupcake theme)

### Phase 2
- Extract text content from PDFs and DOCX files
- Process assignments using OpenAI GPT-4 Turbo
- Generate detailed breakdown of assignment requirements
- Estimate time needed for each part of the assignment
- Suggest relevant resources and references
- Store assignments and analysis in MongoDB for future reference
- View detailed results page for each assignment

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, DaisyUI
- **Backend**: Next.js API Routes
- **Storage**: Firebase Storage, MongoDB
- **Document Processing**: pdf-parse, mammoth
- **AI**: OpenAI GPT-4 Turbo

## Getting Started

### Prerequisites

- Node.js 16+
- Firebase account
- MongoDB instance
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/breakmyassignment.git
   cd breakmyassignment
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file with your configuration:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   
   # OpenAI API
   OPENAI_API_KEY=your-openai-api-key
   
   # MongoDB
   MONGODB_URI=your-mongodb-connection-string
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. Navigate to the upload page.
2. Drag and drop your assignment file (PDF or DOCX).
3. Wait for the file to be processed by the AI.
4. View the detailed breakdown of your assignment.
5. (Optional) Copy the analysis or visit the detailed results page.

## File Structure

```
/app                      # Next.js app directory
  /api                    # API routes
    /process-assignment   # File processing API
    /assignments          # Assignment retrieval APIs
  /upload                 # Upload page
  /results                # Results page
/components               # React components
  /Navbar.js              # Navigation component
  /UploadBox.js           # File upload component
/lib                      # Library code
  /mongodb                # MongoDB connection and models
  /firebase.js            # Firebase configuration
/public                   # Public assets
```

## Future Enhancements

- User authentication
- History of past assignments
- Assignment collaboration features
- More detailed analysis with citation suggestions
- Support for more file formats
