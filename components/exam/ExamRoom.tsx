"use client";

import { useEffect, useState } from "react";
import type { ExamQuestion } from "@/lib/shuffle";
import { shuffleArray, shuffleOptions, type ShuffledQuestion } from "@/lib/shuffle";
import {
  getHistory,
  recordAttempt,
  type ExamConfig,
  type ExamAttemptRecord,
} from "@/lib/examProgress";
import { trackInteract } from "@/lib/track";
import ExamConfigurator from "@/components/exam/ExamConfigurator";
import ExamRunner from "@/components/exam/ExamRunner";
import ExamResults from "@/components/exam/ExamResults";
import ExamReview from "@/components/exam/ExamReview";

type Stage = "configure" | "running" | "results" | "review";

export default function ExamRoom({
  bank,
  topics,
  storageKey,
  backHref,
  roomPath,
}: {
  bank: ExamQuestion[];
  topics: { id: string; label: string }[];
  storageKey: string;
  backHref: string;
  roomPath: string;
}) {
  const [stage, setStage] = useState<Stage>("configure");
  const [history, setHistory] = useState<ExamAttemptRecord[]>([]);
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [lastRecord, setLastRecord] = useState<ExamAttemptRecord | null>(null);

  useEffect(() => {
    setHistory(getHistory(storageKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleStart(newConfig: ExamConfig) {
    const pool = bank.filter((q) => newConfig.topics.includes(q.topic));
    const selected = shuffleArray(pool).slice(0, newConfig.questionCount);
    const shuffled = selected.map(shuffleOptions);
    setQuestions(shuffled);
    setConfig(newConfig);
    setStage("running");
    trackInteract();
  }

  function handleFinish(finalAnswers: (number | null)[]) {
    if (!config) return;
    let correctCount = 0;
    let rawScore = 0;
    const topicBreakdown: Partial<Record<string, { correct: number; total: number }>> = {};

    questions.forEach((q, i) => {
      const bucket = topicBreakdown[q.topic] ?? { correct: 0, total: 0 };
      bucket.total += 1;
      const isCorrect = finalAnswers[i] === q.correctIndex;
      if (isCorrect) {
        correctCount += 1;
        rawScore += 1;
        bucket.correct += 1;
      } else if (finalAnswers[i] !== null && config.negativeMarking) {
        rawScore -= 0.25;
      }
      topicBreakdown[q.topic] = bucket;
    });

    const record: ExamAttemptRecord = {
      timestamp: Date.now(),
      totalQuestions: questions.length,
      correctCount,
      rawScore,
      topicBreakdown,
      config,
    };

    recordAttempt(storageKey, record);
    setHistory(getHistory(storageKey));
    setAnswers(finalAnswers);
    setLastRecord(record);
    setStage("results");
  }

  if (stage === "running" && config) {
    return <ExamRunner questions={questions} config={config} topics={topics} onFinish={handleFinish} />;
  }

  if (stage === "results" && lastRecord) {
    return (
      <ExamResults
        record={lastRecord}
        history={history}
        topics={topics}
        backHref={backHref}
        onReview={() => setStage("review")}
        onRetry={() => setStage("configure")}
      />
    );
  }

  if (stage === "review") {
    return (
      <ExamReview
        questions={questions}
        answers={answers}
        topics={topics}
        roomPath={roomPath}
        onBack={() => setStage("results")}
      />
    );
  }

  return <ExamConfigurator history={history} bank={bank} topics={topics} onStart={handleStart} />;
}
