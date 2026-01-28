
  # VitaVoice - A Multilingual Voice-First Healthcare Assistant

Overview

VitaVoice is a voice-first healthcare assistance platform designed to improve access to basic healthcare guidance for users in rural and low-resource environments. The system focuses on accessibility, multilingual interaction, and contextual responses by combining persistent patient data with conversational AI.

Rather than acting as a generic chatbot, VitaVoice maintains user context to deliver more meaningful and personalized interactions.

Problem Statement

Healthcare access is often limited by:

Language barriers

Low digital literacy

Inconsistent internet connectivity

Most existing digital healthcare tools rely heavily on text-based interfaces and assume continuous connectivity, making them unsuitable for many users.

Solution

VitaVoice addresses these challenges by:

Prioritizing voice-first interaction

Supporting multilingual communication

Persisting patient health context across sessions

Enabling context-aware chatbot responses instead of isolated replies

Key Features

Secure user authentication and session handling

Persistent storage of patient health records

Context-aware chatbot responses using stored user data

Modular architecture for future healthcare features

Tech Stack

Frontend: React (Vite), TypeScript, Tailwind CSS

Backend & Database: Supabase

Authentication: Supabase Auth

API Communication: REST APIs

AI Integration: Rule-based logic with AI-assisted conversational responses

Backend Architecture

The backend layer is responsible for managing authentication, data storage, and sharing user context across system components.

Core Responsibilities

User authentication and authorization

Database design for patient health records

Data access for chatbot and application logic

Maintaining consistent and secure user context

Design Considerations

Privacy & Safety: Careful handling of sensitive healthcare data

Scalability: Backend structured to support new modules without redesign

Reliability: Focus on data consistency across user interactions

Future Improvements

Role-based access control (patients, healthcare workers, administrators)

Offline-first data synchronization

Enhanced medical rule validation using curated datasets

Analytics and reporting for healthcare insights

Disclaimer

VitaVoice is a healthcare assistance and guidance tool, not a medical diagnostic system. It does not replace professional medical advice or consultation.

Project Status

🚧 Ongoing Final Year Project
Actively under development with emphasis on backend robustness and system integration.


  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
