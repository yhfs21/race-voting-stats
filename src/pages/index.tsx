import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("../components/Chart"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen items-center justify-center p-12 ${inter.className}`}
    >
      <Chart />
    </main>
  );
}
