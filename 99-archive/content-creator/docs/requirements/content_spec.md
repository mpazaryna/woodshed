# AI Content Creator - DisplayCRM Feature Specification

## Project Overview
The AI Content Creator is a module within DisplayCRM that leverages Retrieval-Augmented Generation (RAG) to generate marketing content from uploaded source documents. It supports generation of social media content, blog posts, case studies, and other formats, with adjustable filters and tone options.

## Goals
- Enable users to upload source materials (PDFs, Docs, etc.)
- Generate marketing content tailored to input documents
- Let users define generation filters like tone, audience, and content length
- Display multiple content options in card format
- Allow users to save and reuse generated content

## User Flow Overview
1. Upload Source Document
2. Select Content Type (e.g., Social, Blog, Case Study)
3. Adjust Generation Settings
4. Generate Options
5. Preview Outputs in Cards
6. Save or Export Selected Content

## Core Features & Components

### Upload Zone
- Drag & drop or browse to upload source documents
- File types: PDF, DOCX, TXT
- Upload confirmation with filename display

### Top Action Area
- CTA Buttons: "Upload Document", "Generate Content", "Save All"
- Content type selector: Dropdown (Social, Blog, Case Study)

### Filters & Content Settings
- Tone of Voice: Professional, Conversational, Playful, Bold, Technical, etc.
- Audience Type: B2B, Consumer, Executive, Technical, etc.
- Headline Length: Short, Medium, Long
- Body Length: Tweet-sized, Paragraph, Extended
- Keywords/Tags: Free-form input or suggested via AI
- # of Options: Numeric selector (1–10)

### Output Display Area
- Results in card format with: Headline, body copy, tags, keywords
- Each card includes: "Copy", "Save", "Regenerate"
- Saved state visually indicated

### Backend Logic (RAG Environment)
- Indexed document content feeds retrieval layer
- Prompts tuned to user-defined filters
- AI model generates output using retrieved chunks + prompt injection
- Results cached per session to enable save/export

### Saving Functionality
- User can save:
  - Individual outputs
  - All generated options
- Saved content linked to user's project or CRM record

## File Delivery
Figma file includes 3 layout frames:
1. Action Area (upload + CTA)
2. Filter/Dropdown Controls
3. Card Layout for Output Display

## Stretch Features (Post-MVP)
- Editing interface for each card
- Export to PDF, .docx, or social-ready image
- Tag recommendations using keyword clustering
- AI voice assistant to walk users through generation

## Step-by-Step User Guide

### Screen 1: Initial Input Interface
**Purpose**: Begin a new content campaign by setting the parameters for AI-generated marketing content.

**Steps**:
1. Enter Campaign Name
   - Internal-only field for organizing campaigns
   - Will not appear in the generated social content
2. Choose Source Material
   - Select from Previously Uploaded Documents, or
   - Use Upload New Content to drop in a fresh file
3. Set Content Filters
   - Content Type – Social Post, Blog, Fact Sheet, Case Study
   - Tone of Voice – Playful, Professional, Bold, Calm
   - Headline Length – Short, Medium, Long, or Auto (AI Decides)
   - Body Length – Same options as headline
   - Custom Prompts – Optional AI steering input
   - # of Options – How many variations to generate
4. Click "Create"
   - Generates content cards based on your input criteria

### Screen 2: Filter Dropdown Expanded
**Purpose**: Preview and refine content generation settings.

**Highlights**:
- Expanded menus show the full range of inputs
- All selections remain editable before clicking Create

### Screen 3: Output Display – Content Campaigns
**Purpose**: View and manage your generated marketing content.

**Layout**:
- Each card includes:
  - Headline
  - Post Copy
  - CTA
  - Hashtags
  - Options to Edit or Archive
- Campaigns are timestamped and labeled for clarity
- Top-right link to View Archives lets you browse past content

### Screen 4: Ask AI to Refine
**Purpose**: Refine generated content using smart AI prompts.

**Features**:
- Add instructions in plain language like:
  - "Make this more casual"
  - "Include a benefit statement" 
  - "Add emojis for social"
- Click Submit and AI will provide revised copy within the same card structure

## Legal Notice
This document and the information contained within it are intended solely for the development and implementation of the AI Content Creator feature within the DisplayCRM platform. It is part of a collaboration exclusively between the Variant team and the DisplayCRM team. This material may not be used, reproduced, or distributed in any other client environment, platform, or product without prior written consent from the owners of DisplayCRM.