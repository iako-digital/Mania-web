import { useState } from "react";
import { useRouter } from "next/router";

export function PatternDownloadButton({ userId, patternCategory, steps }: { userId: string; patternCategory: string; steps: string[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patternData, setPatternData] = useState<any>(null);
  const router = useRouter();

  async function handleGeneratePattern() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/patterns/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, patternCategory, steps }),
      });

      if (res.status === 403) {
        router.push("/checkout");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to generate pattern");
      }

      const data = await res.json();
      setPatternData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (patternData) {
    return (
      <div>
        <h2>Pattern Generated</h2>
        <p>{patternData.testBoxNotice}</p>
        <iframe src={patternData.videoUrl} title="Tutorial Video" />
        <div>
          {patternData.diagrams.map((diagram: string, index: number) => (
            <img key={index} src={diagram} alt={`Step ${index + 1}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <button onClick={handleGeneratePattern} disabled={loading}>
      {loading ? "Generating..." : "Generate Pattern"}
    </button>
  );
}
