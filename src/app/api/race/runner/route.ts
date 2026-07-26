import { NextRequest, NextResponse } from "next/server";
import { getRaceEntries, computeResults, formatTime, calcPace, getAgeGroup } from "@/lib/race";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bib = searchParams.get("bib");

  if (!bib) {
    return NextResponse.json({ error: "Missing bib" }, { status: 400 });
  }

  const entries = getRaceEntries();
  const results = computeResults(entries);
  const runner = results.find((r) => r.bib === Number(bib));

  if (!runner) {
    return NextResponse.json({ error: "Runner not found" }, { status: 404 });
  }

  const totalFinished = results.filter((r) => r.finishTime).length;
  const genderResults = results.filter(
    (r) => r.gender === runner.gender && r.finishTime
  );
  const genderPos = runner.position
    ? genderResults.findIndex((r) => r.bib === runner.bib) + 1
    : undefined;

  const ageGroup = getAgeGroup(runner.age);
  const ageResults = results.filter(
    (r) => r.finishTime && r.gender === runner.gender && getAgeGroup(r.age) === ageGroup
  );
  const agePos = runner.position
    ? ageResults.findIndex((r) => r.bib === runner.bib) + 1
    : undefined;

  let recap = "";
  if (runner.finishTime && runner.startTime) {
    const netMs = runner.finishTime - runner.startTime;
    const pace = calcPace(netMs);
    const time = formatTime(netMs);
    const percentile = Math.round(
      ((totalFinished - (runner.position || 0) + 1) / totalFinished) * 100
    );

    const recapData = {
      name: runner.firstName,
      fullName: `${runner.firstName} ${runner.lastName}`,
      time,
      pace,
      position: runner.position || 0,
      total: totalFinished,
      genderPos: genderPos || 0,
      genderTotal: genderResults.length,
      gender: runner.gender,
      ageGroup,
      agePos: agePos || 0,
      ageTotal: ageResults.length,
      age: runner.age,
      percentile,
      confidence: runner.timingConfidence || "medium",
    };

    recap = await generateAIRecap(recapData);
  }

  return NextResponse.json({
    runner,
    stats: {
      totalFinished,
      genderPos,
      genderTotal: genderResults.length,
      ageGroup,
      agePos,
      ageTotal: ageResults.length,
    },
    recap,
  });
}

async function generateAIRecap(d: {
  name: string;
  fullName: string;
  time: string;
  pace: string;
  position: number;
  total: number;
  genderPos: number;
  genderTotal: number;
  gender: string;
  ageGroup: string;
  agePos: number;
  ageTotal: number;
  age: number;
  percentile: number;
  confidence: string;
}): Promise<string> {
  // Try Claude API first
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const client = new Anthropic({ apiKey });
      const topPercent = 100 - d.percentile;

      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `Write a personalized, warm, and celebratory race recap for a runner at the Gada Global 5K (a celebration of Oromo heritage and the Irrecha festival, held at the Rock Creek Park Tennis Center in Washington DC). Keep it to 3-4 sentences. Be specific with their stats. Do not use emojis.

Runner: ${d.fullName}, age ${d.age}, ${d.gender}
Official time: ${d.time}
Pace: ${d.pace}/mile
Overall position: ${d.position} out of ${d.total} runners
${d.gender} category: ${d.genderPos} out of ${d.genderTotal}
Age group (${d.ageGroup}): ${d.agePos} out of ${d.ageTotal}
Finished ahead of ${d.percentile}% of runners (top ${topPercent}%)
Timing confidence: ${d.confidence}

Write the recap now:`,
          },
        ],
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (textBlock && textBlock.type === "text") {
        return textBlock.text;
      }
    } catch (e) {
      console.error("Claude API error, falling back to template:", e);
    }
  }

  // Fallback: template-based recap
  return generateTemplateRecap(d);
}

function generateTemplateRecap(d: {
  name: string;
  time: string;
  pace: string;
  position: number;
  total: number;
  genderPos: number;
  genderTotal: number;
  ageGroup: string;
  agePos: number;
  ageTotal: number;
  percentile: number;
}) {
  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const paceComment =
    parseFloat(d.pace) < 7 ? "An elite-level pace" :
    parseFloat(d.pace) < 8 ? "A very strong competitive pace" :
    parseFloat(d.pace) < 9 ? "A solid pace that shows real training" :
    parseFloat(d.pace) < 10 ? "A great pace for the course" :
    "A steady, consistent effort";

  const topPercent = 100 - d.percentile;

  return `Congratulations, ${d.name}! You crossed the finish line at the Gada Global 5K with an official time of ${d.time}, finishing ${ordinal(d.position)} overall out of ${d.total} runners. ${paceComment} at ${d.pace}/mile. You placed ${ordinal(d.genderPos)} among ${d.genderTotal} runners in your gender category, and ${ordinal(d.agePos)} out of ${d.ageTotal} in the ${d.ageGroup} age group. You finished ahead of ${d.percentile}% of all participants${topPercent <= 10 ? " \u2014 placing you in the top " + topPercent + "%!" : "."} Thank you for celebrating Oromo heritage through running at Rock Creek Park. See you next year!`;
}
