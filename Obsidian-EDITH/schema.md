# Users & Posts Schema

## Overview
This document describes the database schema for users and their posts.

- A user can create many posts
- A post belongs to exactly one user

---

## Tables

### Users

**Description**  
Stores application users.

**Columns**
- `id` (uuid, PK)
- `email` (text, unique)
- `name` (text)
- `created_at` (timestamp)

---

### Posts

**Description**  
Stores user-generated posts.

**Columns**
- `id` (uuid, PK)
- `user_id` (uuid, FK → users.id)
- `title` (text)
- `content` (text)
- `created_at` (timestamp)

---

## Relationships
- `users` **1 → N** `posts`
- `posts.user_id` references `users.id`

---

## ER Diagram

```mermaid
erDiagram
users ||--|| profiles : has
users }o--|| roles : assigned

    users {
        uuid id PK
        text email UK
        text name
        timestamp created_at
        boolean active
        uuid profile_id FK
        uuid role_id FK
		text salt 
		int number UK
    }
    
    roles {
	    uuid id PK
	    text name
	    text Literal
    }
    
     perms{
	    uuid id PK
	    text prem_name
    
    }
     roles_perms{
	    uuid roles_id FK
	    uuid perms_id FK 
    }
   
    
    

    project {
        uuid id PK
        uuid user_id FK
        text title
        text content
        timestamp created_at
    }

    users ||--o{ posts : writes
```