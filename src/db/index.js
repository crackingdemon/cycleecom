// import pkg from "@prisma/client";
const pkg = require('@prisma/client')
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
// export default prisma;

module.exports = prisma;