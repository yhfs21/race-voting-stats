const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const Papa = require('papaparse');

const csvFilePath = 'prisma/csv/result.csv';
const prisma = new PrismaClient();

function csvFileNameToModelName(filePath: string): string {
  // ファイル名から拡張子を取り除き、小文字に変換します
  const fileName = filePath.split('/').pop()?.replace(/\.[^/.]+$/, '').toLowerCase();
  // モデル名として適切なフォーマットに変換します
  return fileName ? fileName.charAt(0).toUpperCase() + fileName.slice(1) : '';
}

function isDateTimeField(value: string): boolean {
  // 日付の正規表現に一致するかを確認します（例: YYYY/MM/DD hh:mm:ss）
  const dateTimeRegex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
  return dateTimeRegex.test(value);
}

function isNumeric(value: string): boolean {
  // 数値の正規表現に一致するかを確認します
  return /^\d+$/.test(value);
}

fs.readFile(csvFilePath, 'utf8', (err: any, data: any) => {
  if (err) {
    console.error('Error reading CSV file:', err);
    return;
  }

  // CSV ファイルをパースします
  Papa.parse(data, {
    header: true,
    complete: async (results: any) => {
      if (!results.data || results.data.length === 0) {
        console.error('No data found in CSV file.');
        await prisma.$disconnect();
        return;
      }

      const headers = Object.keys(results.data[0]);
      const modelName = csvFileNameToModelName(csvFilePath);
      const model = prisma[modelName];
      if (!model) {
        console.error(`Model ${modelName} not found in Prisma.`);
        await prisma.$disconnect();
        return;
      }

      // データの挿入処理を開始します
      for (const row of results.data) {
        const data: any = {};
        for (const header of headers) {
          if (isDateTimeField(row[header])) {
            data[header] = new Date(row[header]); // DateTime型に変換
          } else if (isNumeric(row[header])) {
            data[header] = parseInt(row[header]); // Int型に変換
          } else {
            data[header] = row[header];
          }
        }
  
        // モデルの create メソッドを動的に呼び出してデータを挿入します
        try {
          await model.upsert({
            where: { id: data.id },
            update: data,
            create: data,
          });
        } catch (error) {
          console.error('Error inserting data:', error);
        }
      }

      // Prisma の接続を閉じます
      await prisma.$disconnect();
    }
  });
});
