-- CreateEnum
CREATE TYPE "SecuritySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "SecurityLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "severity" "SecuritySeverity" NOT NULL DEFAULT 'LOW',
    "status" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "userAgent" TEXT,
    "fingerprint" TEXT,
    "requestPath" TEXT,
    "requestMethod" TEXT,
    "requestId" TEXT,
    "targetModel" TEXT,
    "targetId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "SecurityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SecurityLog_createdAt_idx" ON "SecurityLog"("createdAt");

-- CreateIndex
CREATE INDEX "SecurityLog_severity_createdAt_idx" ON "SecurityLog"("severity", "createdAt");

-- CreateIndex
CREATE INDEX "SecurityLog_userId_createdAt_idx" ON "SecurityLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SecurityLog_action_createdAt_idx" ON "SecurityLog"("action", "createdAt");

-- AddForeignKey
ALTER TABLE "SecurityLog" ADD CONSTRAINT "SecurityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
