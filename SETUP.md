# ERP-AMS Front-end

## Overview

The ERP-AMS is an open-source application used to track and manage the company's office equipment and employees to optimize management time. It includes various functions such as inventory management, confirming equipment allocation or retrieval with email notifications, monitoring activities within the application, and managing employees' personal devices. This repository contains the front-end code of ams.

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Running](#running)

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Visual Studio Code](https://code.visualstudio.com/download) installed.
- [NodeJS](https://nodejs.org/en/download) installed

---

## Frontend Setup

### Steps:
1. **Create a folder** to store the frontend code.
   - Example: `erp-ams-fe`

2. **Clone the frontend repository**:
   ```bash
   git clone https://github.com/ncc-erp/ncc-erp-ams-fe
   ```

3. **Open the frontend folder** in Visual Studio Code.

4. **Setup environment variables**:
   - Copy and rename `.env.example` to `.env.local`.
   - Update the API proxy and authentication variables:
     ```env
     REACT_APP_API_PROXY=http://127.0.0.1:8000/api/v1
     REACT_APP_AUTH_CLIENT_ID=<YOUR_CLIENT_ID>
     REACT_APP_AUTH_SECRET_KEY=<YOUR_SECRET_KEY>
     REACT_APP_SHOW_MANUAL_LOGIN=true
     ```

5. **Install dependencies**:
   ```bash
   npm install
   ```

6. **Start the frontend server**:
   ```bash
   npm run dev
   ```

---

## Testing

### Frontend Testing:
1. **Run Jest tests**:
   ```bash
   npm run test
   ```

---

## Additional Notes
- Ensure the frontend server is running on port `3000`.
- Use the provided `.env.local` file to configure your environment variables.
