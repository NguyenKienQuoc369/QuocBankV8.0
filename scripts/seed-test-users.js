// scripts/seed-test-users.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { SignJWT } = require('jose')

const prisma = new PrismaClient()

const secret = process.env.JWT_SECRET || 'quocbank-secret-key'
const key = new TextEncoder().encode(secret)

async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

function genAccountNumber() {
  return '9' + Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, '0')
}

async function ensureUser(username, fullName) {
  let user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    const hash = await bcrypt.hash('Passw0rd!', 10)
    user = await prisma.user.create({
      data: { username, password: hash, fullName },
    })
  }
  return user
}

async function ensureAccount(userId) {
  let account = await prisma.account.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' }
  })
  if (!account) {
    account = await prisma.account.create({
      data: {
        userId,
        accountNumber: genAccountNumber(),
        balance: 0,
        isLocked: false,
      }
    })
  }
  return account
}

async function main() {
  const u1 = await ensureUser('tester1', 'Tester One')
  const u2 = await ensureUser('tester2', 'Tester Two')

  const a1 = await ensureAccount(u1.id)
  const a2 = await ensureAccount(u2.id)

  // Fund tester1 for transfer/withdraw tests
  await prisma.account.update({
    where: { id: a1.id },
    data: { balance: 1_000_000 }
  })

  const token1 = await createToken({ id: u1.id, username: u1.username, fullName: u1.fullName })
  const token2 = await createToken({ id: u2.id, username: u2.username, fullName: u2.fullName })

  const output = {
    user1: {
      id: u1.id,
      username: u1.username,
      accountNumber: a1.accountNumber,
      token: token1
    },
    user2: {
      id: u2.id,
      username: u2.username,
      accountNumber: a2.accountNumber,
      token: token2
    }
  }

  console.log(JSON.stringify(output, null, 2))
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
