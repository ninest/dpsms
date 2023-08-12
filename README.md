# DPSMS

## Development

### Database

```mermaid
erDiagram
    User ||--o{ HostUser : "1"  
    User ||--o{ TenantUser : "1" 
    User ||--o{ MoverUser : "1"  
    User ||--|{ Trust : "0..*"   
    User ||--|{ Trust : "0..*"   
    HostUser ||--o| HostListing : "0..*" 
    TenantUser ||--o| TenantRequest : "0..*" 
    TenantUser ||--o{ Tenancy : "0..*" 
    TenantRequest ||--o| TenantRequestListing : "0..*" 
    TenantRequestListing ||--|| HostListing : "0..*" 
    Tenancy |o--|| HostListing : "0..*" 
```

### Commands

- `yarn prisma:generate`: Generate Prisma client

### Docker

Create a DB for dev with

```bash
# Destroy the dev DB
yarn run db:down
# Create the dev DB
yarn run db:up
# Push the schema
yarn run db:push
# Generate the schema
yarn run prisma:generate
```