# Node.js Microservices Architecture for E-commerce Platform

# Overview

Our E-commerce platform is powered by a robust microservices architecture designed to offer scalable, efficient, and modular services tailored to e-commerce operations. This architecture comprises several key microservices: CloudManager, Customer, Product, Shopping, Vendor, Deliveryman, and Feedback. Each service is designed to operate independently, communicating through RabbitMQ for message queuing, ensuring loose coupling and high cohesion.

# Technologies

The microservices are built on a stack of modern technologies including Node.js, Express, TypeScript, and various databases (MongoDB, MySQL, PostgreSQL), and they interact with external services like Google Cloud Platform. Common libraries such as amqplib for RabbitMQ integration, jsonwebtoken for authentication, and pino for logging are used across the services to maintain consistency and reliability.

# Microservices Overview

# CloudManager Service

Capabilities: Interacts with GCP for file uploads and signed URL generation; converts addresses to lat/long; identifies nearest delivery personnel.
Technologies: Node.js, TypeScript, Express, various @types/\* for type definitions.
Database: Interacts with various databases storing different kinds of data.

# Customer Service

Capabilities: Handles customer creation, authentication, token refresh, and updates; manages carts and wishlists; communicates updates across services.
Technologies: Express, bcrypt, jsonwebtoken, MongoDB for data storage.
Integration: Extensively uses RabbitMQ for event-driven updates.
Product Service
Capabilities: Manages food items creation; integrates with Vendor server via RabbitMQ; handles cart and wishlist updates.
Technologies: Sequelize for MySQL interaction, Express, RabbitMQ for messaging.
Database: MySQL, managed through Sequelize.

# Shopping Server

Capabilities: Converts cart to orders; integrates with CloudManager for delivery optimization; manages vendor-specific orders and administrative analytics.
Technologies: TypeScript, Node.js, Express.
Database: PostgreSQL for order management and analytics.

# Vendor Server

Capabilities: Vendor management; receives and processes feedback and orders; updates vendor information across services.
Technologies: Express, MongoDB for storing feedback and orders, Redis for caching.
Integration: Communicates with Customer and Feedback servers via RabbitMQ.

# Deliveryman Server

Capabilities: Manages delivery personnel profiles, authentication, feedback processing, and profile updates.
Technologies: Sequelize for MySQL interaction, Express, RabbitMQ for receiving feedback.
Database: MySQL, managed through Sequelize.

# Feedback Server

Capabilities: Manages creation, update, and deletion of feedback; communicates feedback to relevant parties.
Technologies: TypeScript, Node.js, Express.
Database: PostgreSQL for feedback storage.
