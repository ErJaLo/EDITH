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
   
	profiles{
		uuid id UK
		uuid user_id FK
		text description
		text img
	} 
	
	profilecomment{
		uuid id UK
		uuid profile_id FK
		uuid comment_id FK
	}
	
	projectcomment{
		uuid id UK
		uuid project_id FK
		uuid comment_id FK
	}
	
	comment{
		uuid id UK
		timestamp created_at
		text content 
		number val
		uuid author_id
		boolean visibilty
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
   
	afiliated{
	    uuid creator FK
	    uuid user FK 
    }
    
    
	userproject{
		uuid id UK    
	    uuid user_id FK
		uuid project_id FK
	}
    project {
        uuid id PK
        text title
        text content
        timestamp created_at
	    boolean active
	    boolean public
	    uuid author_id FK
    }
	projectrating{
		uuid id UK
		uuid project_id
		uuid user_id
		boolean like
		int rating
	}


```


```mermaid
erDiagram
    users ||--o| profiles : has
    users }o--o| roles : has
    users ||--o{ projects : creates
    users ||--o{ comments : authors
    users }o--o{ projects : collaborates
    users }o--o{ users : follows
    users }o--o{ projects : rates
    
    roles ||--o{ role_permissions : has
    permissions ||--o{ role_permissions : granted_by
    
    profiles ||--o{ comments : receives
    projects ||--o{ comments : receives

    users {
        uuid id PK
        text email UK "NOT NULL"
        text password_hash "NOT NULL"
        text name
        int number UK
        uuid role_id FK
        boolean active "DEFAULT true"
        timestamp created_at
        timestamp updated_at
        timestamp last_login
    }
    
    profiles {
        uuid id PK
        uuid user_id FK, UK "NOT NULL"
        text description
        text avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    comments {
        uuid id PK
        uuid author_id FK "NOT NULL"
        text commentable_type "NOT NULL (profile/project)"
        uuid commentable_id FK "NOT NULL"
        uuid parent_comment_id FK "NULL (for replies)"
        text content "NOT NULL"
        boolean is_visible "DEFAULT true"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    roles {
        uuid id PK
        text name UK "NOT NULL"
        text description
    }
    
    permissions {
        uuid id PK
        text name UK "NOT NULL"
        text description
    }
    
    role_permissions {
        uuid id PK
        uuid role_id FK
        uuid permission_id FK
    }
    
    affiliations {
        uuid id PK
        uuid follower_id FK
        uuid following_id FK
        timestamp created_at
    }
    
    project_collaborators {
        uuid id PK
        uuid user_id FK
        uuid project_id FK
        text role "owner/editor/viewer"
        timestamp joined_at
    }
    
    projects {
        uuid id PK
        uuid author_id FK "NOT NULL"
        text title "NOT NULL"
        text content
        boolean is_active "DEFAULT true"
        boolean is_public "DEFAULT false"
        timestamp created_at
        timestamp updated_at
    }
    
    project_ratings {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        int rating "1-5"
        timestamp created_at
        timestamp updated_at
    }
```