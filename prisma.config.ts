import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Вставь сюда свою ссылку от Neon без кавычек внутри
    url: "postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/social-media?sslmode=require",
  },
});
