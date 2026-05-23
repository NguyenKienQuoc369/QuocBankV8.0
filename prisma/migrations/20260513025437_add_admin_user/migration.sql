-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "otpSecret" TEXT NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastFailedAt" TIMESTAMP(3),
    "lockedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_employeeId_key" ON "AdminUser"("employeeId");
