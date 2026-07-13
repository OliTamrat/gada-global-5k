"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Dispute {
  id: string;
  bib: number;
  runnerName: string;
  reason: string;
  submittedAt: number;
  status: "pending" | "accepted" | "rejected";
  resolution?: string;
  resolvedAt?: number;
  originalTime?: number;
  adjustedTime?: number;
  evidence?: string[];
}

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [tab, setTab] = useState<"submit" | "review">("submit");
  const [bibInput, setBibInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Admin resolve
  const [resolutionText, setResolutionText] = useState("");
  const [adjustedTime, setAdjustedTime] = useState("");

  useEffect(() => {
    fetchDisputes();
    const interval = setInterval(fetchDisputes, 5000);
    return () => clearInterval(interval);
  }, []);

  async function fetchDisputes() {
    try {
      const res = await fetch("/api/race/disputes");
      const data = await res.json();
      setDisputes(data.disputes || []);
    } catch { /* ignore */ }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("File too large. Max 5MB per image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setEvidenceFiles((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  }

  function removeEvidence(index: number) {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmitDispute(e: React.FormEvent) {
    e.preventDefault();
    if (!bibInput || !reasonInput) return;
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/race/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          bib: Number(bibInput),
          reason: reasonInput,
          evidence: evidenceFiles,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Dispute submitted successfully. An official will review it shortly.");
        setBibInput("");
        setReasonInput("");
        setEvidenceFiles([]);
        fetchDisputes();
      } else {
        setMessage(data.error || "Failed to submit");
      }
    } catch {
      setMessage("Network error");
    }
    setSubmitting(false);
  }

  async function handleResolve(disputeId: string, status: "accepted" | "rejected") {
    if (!resolutionText) return;

    const body: Record<string, unknown> = {
      action: "resolve",
      disputeId,
      status,
      resolution: resolutionText,
    };

    if (status === "accepted" && adjustedTime) {
      const parts = adjustedTime.split(":");
      if (parts.length === 2) {
        const ms = (parseInt(parts[0]) * 60 + parseInt(parts[1])) * 1000;
        body.adjustedMs = ms;
      }
    }

    try {
      await fetch("/api/race/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setResolutionText("");
      setAdjustedTime("");
      fetchDisputes();
    } catch { /* ignore */ }
  }

  const pending = disputes.filter((d) => d.status === "pending");
  const resolved = disputes.filter((d) => d.status !== "pending");

  return (
    <main className="bg-charcoal min-h-screen pt-24 pb-20 px-6 md:px-16 lg:px-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold tracking-[4px] uppercase text-yellow mb-4 block">
            Timing Disputes
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-white mb-2 tracking-tight">
            Dispute Resolution Center
          </h1>
          <p className="text-[13px] text-white/40">
            Flag a timing issue or review pending disputes.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["submit", "review"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 rounded-xl font-bold text-[13px] uppercase tracking-wider border-none cursor-pointer transition-all ${
                tab === t ? "yellow-card" : "bg-white/5 text-white/40 hover:text-white/70"
              }`}
            >
              {t === "submit" ? "Submit Dispute" : `Review (${pending.length})`}
            </button>
          ))}
        </div>

        {tab === "submit" && (
          <form onSubmit={handleSubmitDispute} className="dark-card rounded-2xl p-8 mb-8">
            <h3 className="text-[14px] font-bold text-white mb-6">Flag a Timing Issue</h3>

            <div className="mb-5">
              <label className="block text-[11px] font-bold tracking-[2px] uppercase text-white/30 mb-2">Bib Number</label>
              <input
                type="number"
                inputMode="numeric"
                value={bibInput}
                onChange={(e) => setBibInput(e.target.value)}
                placeholder="Enter your bib number"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-yellow/40 transition-colors"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-bold tracking-[2px] uppercase text-white/30 mb-2">Reason</label>
              <textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Describe the issue (e.g., 'My finish time seems too slow — I was ahead of bib #5 but recorded behind them')"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-yellow/40 transition-colors resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[11px] font-bold tracking-[2px] uppercase text-white/30 mb-2">
                Evidence (photos/screenshots)
              </label>
              <label className="flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 border-dashed border-white/10 hover:border-yellow/30 cursor-pointer transition-colors group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 group-hover:text-yellow/60 transition-colors">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-[13px] text-white/30 group-hover:text-white/50 transition-colors">
                  Upload finish line photo, screenshot, or video frame
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-white/20 mt-2">Max 5MB per image. Accepted: JPG, PNG, HEIC</p>

              {evidenceFiles.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {evidenceFiles.map((src, i) => (
                    <div key={i} className="relative group/thumb">
                      <img
                        src={src}
                        alt={`Evidence ${i + 1}`}
                        className="w-20 h-20 rounded-lg object-cover border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeEvidence(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-oromo text-white flex items-center justify-center text-[10px] cursor-pointer border-none opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !bibInput || !reasonInput}
              className="w-full yellow-card py-3 rounded-xl font-bold text-[13px] tracking-wider uppercase cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
            >
              {submitting ? "Submitting..." : "Submit Dispute"}
            </button>

            {message && (
              <p className={`text-[13px] mt-4 text-center ${message.includes("success") ? "text-green-light" : "text-red-oromo"}`}>
                {message}
              </p>
            )}
          </form>
        )}

        {tab === "review" && (
          <div>
            {/* Pending */}
            {pending.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[11px] font-bold tracking-[3px] uppercase text-yellow/60 mb-4">
                  Pending ({pending.length})
                </h3>
                <div className="space-y-4">
                  {pending.map((d) => (
                    <div key={d.id} className="dark-card rounded-2xl p-6 border-l-4 border-yellow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[14px] font-bold text-white">{d.runnerName}</span>
                          <span className="text-white/30 text-[12px] ml-2">Bib #{d.bib}</span>
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-lg bg-yellow/15 text-yellow">
                          Pending
                        </span>
                      </div>
                      <p className="text-[13px] text-white/60 mb-3">{d.reason}</p>

                      {d.evidence && d.evidence.length > 0 && (
                        <div className="mb-4">
                          <div className="text-[10px] font-bold tracking-[2px] uppercase text-white/25 mb-2">
                            Evidence ({d.evidence.length} {d.evidence.length === 1 ? "photo" : "photos"})
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {d.evidence.map((src, i) => (
                              <a key={i} href={src} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={src}
                                  alt={`Evidence ${i + 1}`}
                                  className="w-24 h-24 rounded-lg object-cover border border-white/10 hover:border-yellow/40 transition-colors cursor-pointer"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {d.originalTime && (
                        <p className="text-[12px] text-white/30 mb-4">
                          Current time: {formatTime(d.originalTime)}
                        </p>
                      )}

                      <div className="border-t border-white/6 pt-4 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <input
                            placeholder="Resolution note..."
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[13px] placeholder:text-white/20 focus:outline-none focus:border-yellow/40"
                          />
                          <input
                            placeholder="Adjusted time (MM:SS)"
                            value={adjustedTime}
                            onChange={(e) => setAdjustedTime(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[13px] placeholder:text-white/20 focus:outline-none focus:border-yellow/40"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolve(d.id, "accepted")}
                            disabled={!resolutionText}
                            className="flex-1 py-2 rounded-lg bg-green-deep text-white font-bold text-[12px] uppercase tracking-wider cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-light transition-all"
                          >
                            Accept & Adjust
                          </button>
                          <button
                            onClick={() => handleResolve(d.id, "rejected")}
                            disabled={!resolutionText}
                            className="flex-1 py-2 rounded-lg bg-red-oromo/20 text-red-oromo font-bold text-[12px] uppercase tracking-wider cursor-pointer border-none disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-oromo/30 transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolved */}
            {resolved.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[11px] font-bold tracking-[3px] uppercase text-white/30 mb-4">
                  Resolved ({resolved.length})
                </h3>
                <div className="space-y-3">
                  {resolved.map((d) => (
                    <div key={d.id} className={`dark-card rounded-xl p-5 border-l-4 ${d.status === "accepted" ? "border-green-light" : "border-red-oromo/50"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold text-white">{d.runnerName} <span className="text-white/30 font-normal">#{d.bib}</span></span>
                        <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                          d.status === "accepted" ? "bg-green-deep/20 text-green-light" : "bg-red-oromo/10 text-red-oromo/70"
                        }`}>
                          {d.status}
                        </span>
                      </div>
                      <p className="text-[12px] text-white/40">{d.reason}</p>
                      {d.resolution && (
                        <p className="text-[12px] text-white/60 mt-2 italic">Resolution: {d.resolution}</p>
                      )}
                      {d.originalTime && d.adjustedTime && (
                        <p className="text-[11px] text-yellow/70 mt-1">
                          Time adjusted: {formatTime(d.originalTime)} &rarr; {formatTime(d.adjustedTime)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {disputes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-white/30 text-[14px]">No disputes filed yet.</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center mt-10">
          <Link href="/race" className="bg-white/8 text-white px-6 py-3 rounded-xl font-bold text-[12px] tracking-wider uppercase border border-white/10 hover:border-yellow/40 hover:text-yellow transition-all no-underline">
            Live Results
          </Link>
          <Link href="/race/scan" className="bg-white/8 text-white px-6 py-3 rounded-xl font-bold text-[12px] tracking-wider uppercase border border-white/10 hover:border-yellow/40 hover:text-yellow transition-all no-underline">
            Scanner
          </Link>
        </div>
      </div>
    </main>
  );
}
