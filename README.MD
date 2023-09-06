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
- [pnpm](https://pnpm.io/installation) installed.

### Frontend Setup

1. **Create a folder** to store the frontend code.
- example:  folder `erp-ams-fe`

2. **Open a command prompt** in the created folder.

3. **Clone the frontend repository** using the following command:

   ```bash
   https://github.com/ncc-erp/ncc-erp-ams-fe
   ```

4. Open the frontend using **Visual Studio Code**:
- Open `Visual Studio Code`.
- Navigate to the folder `erp-ams-fe` and open the file.

5. **Setup the project env:**
- Copy and rename `.env.example` file into `.env.local`.

6. **Install project's dependencies**:
- Install pnpm (if not yet installed):
Using PowerShell:

```bash
iwr https://get.pnpm.io/install.ps1 -useb | iex

```
- Install dependencies:
```bash
pnpm install
```

### Running
To run the project, follow these steps:

1. Open the frontend using `Visual Studio Code` and termimal.

2. Start the frontend serve:

```bash
pnpm run dev
```
