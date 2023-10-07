# DPSMS

![image](assets/1.png)
![image](assets/2.png)
![image](assets/3.png)
![image](assets/4.png)
![image](assets/5.png)
![image](assets/6.png)
![image](assets/7.png)
![image](assets/8.png)
![image](assets/9.png)
![image](assets/10.png)
![image](assets/11.png)
![image](assets/12.png)
![image](assets/13.png)
![image](assets/14.png)
![image](assets/15.png)
![image](assets/16.png)
![image](assets/17.png)

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

Add

```env
DATABASE_URL=postgres://user:password@localhost:2429/dpsms_db
```

To your `.env`.