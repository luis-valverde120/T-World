# T-World: Scalable Ecommerce Architecture
T-World is a full-stack ecommerce platform designed to handle custom apparel sales. The project was built with the goal of creating a seamless transition between a high-performance frontend and a robust data layer, specifically tailored for categorized products like Anime, Rock, and Pop culture merchandise.

## The Vision
The core objective was to build an MVP that didn't compromise on type safety or scalability. By choosing a unified stack, I was able to focus on business logic—such as inventory management and secure checkout flows—while maintaining a clean codebase that is easy to maintain and extend.

## Technical Decisions
### Unified Full-Stack Framework
I implemented Next.js using the App Router. This allowed for a centralized architecture where frontend components and server-side logic (API Routes) coexist. This decision significantly reduced latency in data fetching and simplified the deployment pipeline.

### Data Integrity with Prisma & PostgreSQL
For the persistence layer, I chose PostgreSQL coupled with Prisma ORM.

- **Why Prisma?** It provides an automated type-safe client that prevents common runtime errors during database queries.

- **Schema Design:** The relational model was designed to handle complex product variations, including sizes, colors, and hierarchical categories, ensuring that the inventory stays consistent across all user sessions.

### Security and Sessions
Authentication is handled via NextAuth.js, implementing a secure layer for user sessions. This ensures that sensitive operations, such as order history and profile management, are strictly protected and follow industry standards.

## Key Features
- **Dynamic Catalog:** Real-time filtering and categorization based on cultural interests.

- **State-Managed Checkout:** A robust cart system that preserves user selections across the application.

- **Relational Database:** Optimized PostgreSQL schema for fast retrieval of product metadata.

- **Admin-Ready Architecture:** Structured to allow future implementation of an administrative dashboard for inventory control.

### Development and Environment
#### Prerequisites
- Node.js 18+
- Docker and Docker Compose (recommended for database local environment)

#### Local Setup
- Clone the repository.

- Install dependencies: `npm install`.

- Set up your environment variables in a .env file (Database URL, NextAuth Secret).

- Run Prisma migrations: `npx prisma migrate dev`.

- Start the development server: `npm run dev`.

#### Containerization
The project includes a Docker configuration to ensure consistent environments across development and production. To spin up the entire stack including the PostgreSQL database:


```Bash
docker-compose up --build
```