# Blog System Setup Guide

## Overview
This is a full-stack blog system built with NestJS backend, Angular frontend, and MySQL database. The system supports multi-language content (Korean, English, Japanese) and features a modern blog platform for a web development company.

## Tech Stack

### Backend
- **NestJS** 11.0.1 - Node.js framework
- **Prisma** 7.1.0 - ORM for database
- **MySQL** - Database
- **bcrypt** - Password hashing
- **class-validator** - Request validation

### Frontend
- **Angular** 21.0.0 - Frontend framework
- **RxJS** 7.8.0 - Reactive programming
- **Angular SSR** - Server-side rendering
- **TypeScript** 5.7.3

## Project Structure

```
NestAngular/
├── server/                  # NestJS backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seeds/          # Seed data
│   └── src/
│       ├── modules/
│       │   ├── categories/ # Category API
│       │   └── blog-posts/ # Blog post API
│       └── main.ts
├── client-fitsystem/       # Angular frontend
│   └── src/
│       ├── app/
│       │   ├── components/ # Reusable components
│       │   ├── pages/      # Page components
│       │   ├── services/   # HTTP services
│       │   └── models/     # TypeScript interfaces
│       └── index.html
└── docker-compose.yml      # MySQL database
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Docker** and **Docker Compose** (for MySQL)
4. **Git**

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone git@github.com:normad-system/glowing-broccoli.git
cd glowing-broccoli/NestAngular
\`\`\`

### 2. Start MySQL Database

\`\`\`bash
# Start MySQL container
docker-compose up -d

# Verify MySQL is running
docker-compose ps
\`\`\`

The MySQL database will be available at:
- Host: `localhost`
- Port: `3306`
- Database: `nest_angular_db`
- User: `nest_user`
- Password: `nest_password`

### 3. Setup Backend

\`\`\`bash
cd server

# Install dependencies
npm install

# Create Prisma migration
npx prisma migrate dev --name init_blog_system

# Generate Prisma client
npx prisma generate

# Seed the database
npm run prisma:seed

# Start the backend server
npm run start:dev
\`\`\`

The backend API will be available at: `http://localhost:3000/api`

### 4. Setup Frontend

Open a new terminal:

\`\`\`bash
cd client-fitsystem

# Install dependencies
npm install

# Start the development server
npm start
\`\`\`

The frontend will be available at: `http://localhost:4200`

## Available API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `GET /api/categories/:slug/posts` - Get posts by category

### Blog Posts
- `GET /api/blog-posts` - Get all published posts (with pagination)
- `GET /api/blog-posts/featured` - Get featured posts
- `GET /api/blog-posts/:slug` - Get post by slug
- `POST /api/blog-posts` - Create new post (admin only)
- `PATCH /api/blog-posts/:slug` - Update post (admin only)
- `PATCH /api/blog-posts/:slug/like` - Increment like count
- `DELETE /api/blog-posts/:slug` - Delete post (admin only)

## Frontend Routes

- `/` - Homepage
- `/about` - About company page
- `/contact` - Contact page
- `/blog` - Blog list with filters
- `/blog/:slug` - Blog post detail
- `/category/:slug` - Category-specific posts

## Database Schema

### User
- id, email, username, passwordHash
- role (USER, ADMIN, EDITOR)
- bio, avatar
- createdAt, updatedAt

### Category
- id, slug
- nameKo, nameEn, nameJa (multi-language names)
- descriptionKo, descriptionEn, descriptionJa
- icon, color, order
- createdAt, updatedAt

### BlogPost
- id, slug
- titleKo, titleEn, titleJa
- contentKo, contentEn, contentJa
- excerptKo, excerptEn, excerptJa
- thumbnail, metaKeywords
- difficulty (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
- readingTimeMinutes
- viewCount, likeCount
- published
- authorId, categoryId
- createdAt, updatedAt

## Default Categories

1. **Tutorials** (튜토리얼) - Step-by-step guides
2. **Git** (Git 사용법) - Version control guides
3. **Web Security** (웹 보안) - Security best practices
4. **Azure** (Azure) - Microsoft Azure guides
5. **AWS** (AWS) - Amazon Web Services guides
6. **Tech Issues** (기술 이슈) - Common problems and solutions
7. **Performance** (성능 최적화) - Optimization techniques

## Default Admin Account

After running the seed script, you can use:
- Email: `admin@normad-system.com`
- Password: `admin123`

⚠️ **Important**: Change this password in production!

## Multi-Language Support

The system supports three languages:
- **Korean (KO)** - Default
- **English (EN)**
- **Japanese (JA)**

Users can switch languages using the language selector in the header. The selected language is persisted in localStorage.

## Development Commands

### Backend
\`\`\`bash
cd server

# Development mode with watch
npm run start:dev

# Production mode
npm run start:prod

# Run tests
npm test

# Format code
npm run format

# Prisma Studio (database GUI)
npx prisma studio
\`\`\`

### Frontend
\`\`\`bash
cd client-fitsystem

# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
\`\`\`

## Environment Variables

### Backend (.env file in server/)
\`\`\`env
DATABASE_URL="mysql://nest_user:nest_password@localhost:3306/nest_angular_db"
PORT=3000
NODE_ENV=development
\`\`\`

### Frontend (environment files in client-fitsystem/src/)
Create `environment.ts` and `environment.prod.ts` if needed for API URL configuration.

## Troubleshooting

### MySQL Connection Issues
\`\`\`bash
# Check if MySQL is running
docker-compose ps

# Restart MySQL
docker-compose restart

# View MySQL logs
docker-compose logs mysql
\`\`\`

### Prisma Migration Issues
\`\`\`bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-run migrations
npx prisma migrate dev
\`\`\`

### Port Already in Use
\`\`\`bash
# Backend (port 3000)
# Change PORT in .env file

# Frontend (port 4200)
# Use different port: ng serve --port 4201
\`\`\`

## Next Steps

1. **Create Content**: Start creating blog posts through the API
2. **Add Authentication**: Implement JWT authentication for admin routes
3. **File Upload**: Add image upload functionality for thumbnails
4. **Markdown Editor**: Integrate a WYSIWYG or markdown editor
5. **Comments**: Add comment system for blog posts
6. **SEO**: Add meta tags and sitemap generation
7. **Analytics**: Integrate Google Analytics or similar
8. **Email**: Setup email notifications for new comments
9. **Search**: Add full-text search functionality
10. **RSS Feed**: Generate RSS feed for blog posts

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add my feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
- Email: contact@normad-system.com
- GitHub Issues: https://github.com/normad-system/glowing-broccoli/issues
