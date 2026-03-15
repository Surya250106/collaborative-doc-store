# Collaborative Document Store with MongoDB

A production-ready **collaborative wiki backend** built with **Node.js,
Express, and MongoDB**.\
This project demonstrates advanced backend engineering concepts
including:

-   Optimistic Concurrency Control (OCC)
-   MongoDB schema design
-   Full-text search
-   Aggregation pipelines for analytics
-   Schema migrations
-   Docker-based deployment

------------------------------------------------------------------------

# Architecture Overview

Client → REST API → MongoDB

Components:

-   **Express API Server**
-   **MongoDB Database (Docker container)**
-   **Migration Script**
-   **Seed Script**

------------------------------------------------------------------------

# Features

### Document Management

Create, retrieve, update, and delete wiki documents.

### Optimistic Concurrency Control

Prevents overwriting changes when multiple users edit the same document.

### Full Text Search

Search documents by keywords with relevance scoring.

### Tag Filtering

Combine text search with tag-based filtering.

### Revision History

Stores the latest 20 edits for each document.

### Analytics

Aggregation pipelines provide insights:

-   Most edited documents
-   Tag co‑occurrence statistics

### Schema Migration

Supports:

-   Lazy migration on document read
-   Background migration script

------------------------------------------------------------------------

# Tech Stack

Backend - Node.js - Express

Database - MongoDB

Containerization - Docker - Docker Compose

Libraries - mongodb - slugify - diff - dotenv

------------------------------------------------------------------------

# Project Structure

    collaborative-document-store
    │
    ├── docker-compose.yml
    ├── Dockerfile
    ├── package.json
    ├── .env.example
    ├── README.md
    │
    ├── src
    │   ├── server.js
    │   ├── config
    │   │   └── db.js
    │   ├── controllers
    │   ├── routes
    │   ├── models
    │   ├── middleware
    │   ├── services
    │   └── seed
    │
    └── scripts
        └── migrate_author_schema.js

------------------------------------------------------------------------

# Setup Instructions

## 1. Clone Repository

    git clone https://github.com/Surya250106/collaborative-doc-store.git
    cd collaborative-document-store

------------------------------------------------------------------------

## 2. Create Environment File

    cp .env.example .env

Example `.env`:

    PORT=5000
    MONGO_URI=mongodb://mongo:27017
    DATABASE_NAME=wiki_db
    NODE_ENV=development

------------------------------------------------------------------------

## 3. Run Using Docker

    docker-compose up --build

API will be available at:

    http://localhost:5000

------------------------------------------------------------------------

# API Endpoints

## Create Document

POST /api/documents

Body:

    {
      "title": "MongoDB Guide",
      "content": "MongoDB is a document database",
      "tags": ["mongodb","guide"],
      "authorName": "John Doe",
      "authorEmail": "john@example.com"
    }

------------------------------------------------------------------------

## Get Document

GET /api/documents/:slug

Example:

    GET /api/documents/mongodb-guide

------------------------------------------------------------------------

## Update Document (OCC)

PUT /api/documents/:slug

    {
     "title": "Updated Title",
     "content": "Updated content",
     "version": 1
    }

Returns **409 Conflict** if version mismatch occurs.

------------------------------------------------------------------------

## Delete Document

DELETE /api/documents/:slug

------------------------------------------------------------------------

# Search API

Search documents:

    GET /api/search?q=mongodb

Search with tags:

    GET /api/search?q=mongodb&tags=guide

------------------------------------------------------------------------

# Analytics Endpoints

Most edited documents

    GET /api/analytics/most-edited

Tag co-occurrence

    GET /api/analytics/tag-cooccurrence

------------------------------------------------------------------------

# Database Seeding

On first startup the system seeds **10,000 documents** automatically.

Includes:

-   Random metadata
-   Tags
-   Old schema documents (\~10%)

Indexes created:

-   Unique index on `slug`
-   Text index on `title` and `content`

------------------------------------------------------------------------

# Migration Script

Background migration converts old author schema.

Run manually:

    npm run migrate

or

    node scripts/migrate_author_schema.js

------------------------------------------------------------------------

# Testing

Example health check:

    GET /

Response:

    {
     "message": "Collaborative Document Store API running"
    }

You can test endpoints using:

-   Postman
-   Thunder Client
-   curl

------------------------------------------------------------------------

# Evaluation Checklist

This project satisfies all assignment requirements:

-   Dockerized application
-   MongoDB seeded with 10k documents
-   Optimistic concurrency control
-   Full-text search with ranking
-   Tag filtering
-   Aggregation analytics
-   Schema migration strategy
-   Background migration script
-   Environment configuration file

------------------------------------------------------------------------

# Author

Surya

------------------------------------------------------------------------

# License

MIT License
