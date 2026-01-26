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
    users ||--o{ project_collaborators : "collaborates_via"
    users ||--o{ project_ratings : rates
    users ||--o{ affiliations : "refers_as_creator"
    users ||--o{ affiliations : "referred_as_affiliate"
    users ||--o{ referral_codes : generates
    
    roles ||--o{ role_permissions : has
    permissions ||--o{ role_permissions : granted_by
    
    profiles ||--o{ comments : receives
    projects ||--o{ comments : receives
    projects ||--o{ project_collaborators : has
    projects ||--o{ project_ratings : rated_on
    
    referral_codes ||--o{ affiliations : "used_in"

    users {
        uuid id PK
        text email UK
        text password_hash
        text name
        int number UK
        uuid role_id FK
        boolean active
        timestamp created_at
        timestamp updated_at
        timestamp last_login
    }
    
    profiles {
        uuid id PK
        uuid user_id FK,UK
        text description
        text avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    comments {
        uuid id PK
        uuid author_id FK
        text commentable_type
        uuid commentable_id FK
        uuid parent_comment_id FK
        text content
        boolean is_visible
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    roles {
        uuid id PK
        text name UK
        text description
    }
    
    permissions {
        uuid id PK
        text name UK
        text description
    }
    
    role_permissions {
        uuid id PK
        uuid role_id FK
        uuid permission_id FK
    }
    
    referral_codes {
        uuid id PK
        uuid creator_id FK
        text code UK
        int usage_count
        int usage_limit
        timestamp expires_at
        boolean is_active
        timestamp created_at
    }
    
    affiliations {
        uuid id PK
        uuid creator_id FK
        uuid affiliated_user_id FK
        uuid referral_code_id FK
        text metadata
        timestamp created_at
        timestamp expires_at
        boolean is_active
    }
    
    project_collaborators {
        uuid id PK
        uuid user_id FK
        uuid project_id FK
        text role
        timestamp joined_at
    }
    
    projects {
        uuid id PK
        uuid author_id FK
        text title
        text content
        boolean is_active
        boolean is_public
        timestamp created_at
        timestamp updated_at
    }
    
    project_ratings {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        int rating
        timestamp created_at
        timestamp updated_at
    }


```