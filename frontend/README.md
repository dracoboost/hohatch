# HoHatch

**HoHatch** is a desktop application for converting image formats between JPG and DDS, specifically designed for use with the Special K tool.

This application provides a user-friendly interface to manage and convert images for game modding purposes. The frontend is built with Next.js, React, and Tailwind CSS, while the backend logic is handled by a Python server using PyWebView.

## Features

A detailed list of features can be found in [`docs/FEATURES.md`](../docs/FEATURES.md).

### Core Functionality

- **JPG to DDS Conversion**: Convert JPG images to DDS format for injection.
- **DDS to JPG Conversion**: Convert DDS images (dumped by Special K) to JPG format.
- **Image Management**: View, manage, and delete images in the inject and dump folders.
- **Batch Operations**: Convert or delete multiple images at once.

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm

### Installation & Running

1. **Clone the repository:**

    ```bash
    git clone https://github.com/dracoboost/hohatch.git
    cd hohatch
    ```

2. **Set up the Python environment:**

    ```bash
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
    ```

3. **Set up the frontend:**

    ```bash
    cd frontend
    npm install
    ```

4. **Run the application:**
    ```bash
    npm run dev
    ```

    To run comprehensive checks before committing, use:
    ```bash
    npm run preflight
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building the Executable

To build a standalone executable for Windows, run the following command from the `frontend` directory:

```bash
npm run backend
```

This will create a distributable executable in the `frontend/dist` directory.

## Development

This project uses a combination of Python for the backend and React/Next.js for the frontend.

- **Backend**: The core logic resides in `app.py` (or similar, in the root directory). It uses `pywebview` to create a webview window and expose Python functions to the JavaScript frontend.
- **Frontend**: The UI is located in the `frontend` directory. See the [`frontend/README.md`](README.md) for more details on the frontend architecture and development process.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
velopment process.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.
