# AI Workplace Productivity Assistant

## 1. Project Overview

The **AI Workplace Productivity Assistant** is a modern, responsive web application designed to help professionals improve productivity by automating everyday workplace tasks using Artificial Intelligence (AI).

The application provides tools for generating professional emails, researching information, summarising content, identifying key insights, and interacting with an AI workplace chatbot. It features a clean, professional blue and white interface designed for ease of use across desktop, tablet, and mobile devices.

The project aims to reduce time spent on routine tasks, improve workplace communication, and support informed decision making through AI generated content.

## 2. Features Implemented

### Smart Email Generator

* Generates professional emails based on user instructions and context.
* Supports Formal, Friendly, and Persuasive communication tones.
* Allows users to edit, copy, and regenerate AI generated emails.

### AI Research Assistant

* Accepts research topics, pasted articles, and website URLs.
* Generates summaries and identifies key findings.
* Provides AI generated insights and actionable recommendations.
* Supports structured research outputs for easier understanding.

### AI Chatbot

* Provides an interactive AI powered workplace assistant.
* Responds to user prompts with context relevant to the conversation.
* Supports follow up questions and conversational interaction.
* Allows users to copy and edit generated responses.

### Dashboard and User Interface

* Modern SaaS style dashboard.
* Sidebar navigation between application features.
* Responsive layout for desktop and mobile devices.
* Reusable interface components and consistent styling.
* Loading indicators, input validation, and clear feedback.

### Responsible AI

* Informs users that AI generated content may contain inaccuracies.
* Encourages users to verify information before using it professionally.
* Promotes responsible and ethical use of AI generated outputs.

## 3. Technologies and Tools Used

* **React:** Building interactive user interfaces.
* **Tailwind CSS:** Styling and responsive layouts.
* **TypeScript:** Type safety, if enabled in the project.
* **Vite:** Development server and build tooling, if used by the generated project.
* **Lovable:** AI assisted application development.
* **AI model/API integration:** Generating contextual emails, research summaries, insights, and chatbot responses.

## 4. Setup Instructions

### Prerequisites

* Node.js and npm installed.
* Access to the project source code.
* An AI provider and valid API credentials if the application requires an external AI service.

### Installation

1. Clone or download the project repository.

2. Navigate to the project directory:

   ```bash
   cd ai-workplace-productivity-assistant
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the AI integration.

   Add the required AI provider configuration using the project's supported environment variables or secure integration settings. Never expose secret API keys in client side code.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in the terminal to access the application.

### Production Build

To build the application for production, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## 5. Project Architecture

The application is designed around three primary modules:

* **Email Generator:** Collects email requirements and sends structured prompts to the AI model.
* **Research Assistant:** Processes supplied research material and requests summaries, insights, and recommendations.
* **AI Chatbot:** Accepts user prompts and displays AI generated conversational responses.

The frontend manages user interactions and presentation. AI requests must be handled through a suitable AI integration. A backend is not required if the chosen platform provides a secure AI integration mechanism; otherwise, a secure server side component may be necessary.

## 6. Team Members

**Project Developer:** Lona Gwanisheni

**Project Role:** Application design, requirements definition, AI productivity workflow planning, and development using Lovable.

## 7. Responsible AI Disclaimer

AI generated outputs may contain inaccurate, incomplete, or outdated information. Users should independently verify important facts and review generated content before sending emails, making decisions, or using research findings in a professional setting.

## 8. Future Improvements

* Add additional email templates and workplace writing tools.
* Support document uploads and expanded research capabilities.
* Introduce user preferences and export options.
* Improve source verification and research citations.
* Add secure integrations with workplace productivity platforms.

## 9. License

No license has been specified for this project. Add an appropriate open source or proprietary license before distributing the application.
