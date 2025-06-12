---
slug: create-a-one-to-one-mapping-relationship-in-prisma
title: 在 Prisma 中创建一对一映射关系
authors: [1adybug]
date: 2025-06-12
tags: [prisma, database, relationship]
---

在 `Prisma` 中，创建一对一映射关系非常简单。只需要在 `schema.prisma` 文件中添加以下代码：

```prisma
model User {
    id               String    @id @default(uuid())
    name             String
    profiles         Profile[] @relation("UserProfile")
    currentProfileId String?   @unique
    currentProfile   Profile?  @relation("CurrentProfile", fields: [currentProfileId], references: [id])
}

model Profile {
    id          String @id @default(uuid())
    name        String
    userId      String
    user        User   @relation("UserProfile", fields: [userId], references: [id])
    currentUser User?  @relation("CurrentProfile")
}
```
