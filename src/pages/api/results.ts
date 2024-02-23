import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Result } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result[]>,
) {
  // todoテーブルから全件取得
  const results: Result[] = await prisma.result.findMany()
  res.status(200).json(results);
}
