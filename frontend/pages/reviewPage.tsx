import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../state/interviewStore";
import ReviewCard from "../components/review/reviewCard";
import EditableReviewRow from "../components/review/editableRow";
import { saveSession, submitFarmer } from "../services/sessionService";
import voiceEngine from "../services/speech/tts";
import { SpeechPriority } from "../types/speech";
import { useLanguage } from "../hooks/useLanguage";
import { useTranslation } from "../hooks/useTranslation";

export default function ReviewPage() {
  const { responses, questions, sessionId } = useInterviewStore((state) => ({
    responses: state.responses,
    questions: state.questions,
    sessionId: state.sessionId,
  }));

  const navigate = useNavigate();
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const hasAutoRead = useRef(false);
  
  const handleRowSave = () => undefined;

  // Refs for auto-scrolling
  const farmerRef = useRef<HTMLDivElement>(null);
  const farmRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Helper to safely check if a value exists (so we don't skip "0" or false)
  const hasValue = (val: any) => val !== undefined && val !== null && val !== "";

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const result = await submitFarmer(sessionId);
      navigate("/success", {
        state: { submissionId: result.farmerId },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit farmer");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

    autosaveTimer.current = setTimeout(() => {
      saveSession(sessionId, responses, "review");
    }, 500);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [responses, sessionId]);

  const getQuestionForField = (field: string) => {
    const normalizedField = field.replace(
      /^block(\d+)\./,
      (_, index) => `blocks[${index}].`
    );
    return questions.find((question) => question.field === normalizedField);
  };

  const speakDigits = (value: string | number) =>
  String(value).split("").join(" ");

  // The Sequential Auto-Read Logic
  const handleReadPage = async () => {
    // Utility to add pauses between sections for natural reading and smooth scrolling
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Fetch localized units with English fallbacks
    const yearsText = t("review.years") || "years";
    const acresText = t("review.acres") || "acres";

    // 1. Intro
    await voiceEngine.playSequence({
      priority: SpeechPriority.USER_ACTION,
      items: [{ text: t("review.title") || "Here is the summary of your answers.", language },{ text: t("review.subtitle") || "Please review your answers.", language }],
    });
    await wait(500);

    // 2. Farmer Section
    const farmerItems = [];
    const f = responses?.farmer;
    if (f) {
      if (hasValue(f.name)) farmerItems.push({ text: `${t("review.fields.name")} ${f.name}`, language });
      if (hasValue(f.age)) farmerItems.push({ text: `${t("review.fields.age")} ${f.age} ${yearsText}`, language });
      if (hasValue(f.gender)) farmerItems.push({ text: `${t("review.fields.gender")} ${f.gender}`, language });
      if (hasValue(f.mobile_num)) farmerItems.push({ text: `${t("review.fields.mobile_num")} ${f.mobile_num}`, language });
      if (hasValue(f.village)) farmerItems.push({ text: `${t("review.fields.village")} ${f.village}`, language });
      if (hasValue(f.pincode)) farmerItems.push({ text: `${t("review.fields.pincode")} ${speakDigits(f.pincode)}`, language });
    }

    if (farmerItems.length > 0 && farmerRef.current) {
      farmerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      await wait(400); 
      await voiceEngine.playSequence({ priority: SpeechPriority.USER_ACTION, items: farmerItems });
      await wait(600); 
    }

    // 3. Farm Section
    const farmItems = [];
    const fm = responses?.farm;
    if (fm) {
      if (hasValue(fm.name)) farmItems.push({ text: `${t("review.fields.farmName")} ${fm.name}`, language });
      if (hasValue(fm.address)) farmItems.push({ text: `${t("review.fields.address")} ${fm.address}`, language });
      if (hasValue(fm.Tarea)) farmItems.push({ text: `${t("review.fields.tarea")} ${fm.Tarea} ${acresText}`, language });
      if (hasValue(fm.Uarea)) farmItems.push({ text: `${t("review.fields.uarea")} ${fm.Uarea} ${acresText}`, language });
      if (hasValue(fm.type)) farmItems.push({ text: `${t("review.fields.farmType")} ${fm.type}`, language });
      if (hasValue(fm.watersrc)) farmItems.push({ text: `${t("review.fields.waterSource")} ${fm.watersrc}`, language });
      if (hasValue(fm.blockCount)) farmItems.push({ text: `${t("review.fields.blockCount")} ${fm.blockCount}`, language });
    }

    if (farmItems.length > 0 && farmRef.current) {
      farmRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      await wait(400);
      await voiceEngine.playSequence({ priority: SpeechPriority.USER_ACTION, items: farmItems });
      await wait(600); 
    }

    // 4. Blocks Section
    const blocks = responses?.blocks ?? [];
    for (let i = 0; i < blocks.length; i++) {
      const blockItems = [];
      const b = blocks[i];
      if (b) {
        blockItems.push({ text: `${t("review.block") || "Block"} ${i + 1}`, language });
        if (hasValue(b.name)) blockItems.push({ text: `${t("review.fields.blockName")} ${b.name}`, language });
        if (hasValue(b.area)) blockItems.push({ text: `${t("review.fields.area")} ${b.area} ${acresText}`, language });
        if (hasValue(b.farmingType)) blockItems.push({ text: `${t("review.fields.farmingType")} ${b.farmingType}`, language });
        if (hasValue(b.soil)) blockItems.push({ text: `${t("review.fields.soilType")} ${b.soil}`, language });
      }

      if (blockItems.length > 0 && blockRefs.current[i]) {
        blockRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
        await wait(400);
        await voiceEngine.playSequence({ priority: SpeechPriority.USER_ACTION, items: blockItems });
        await wait(600);
      }
    }
  };

// Auto-Start Reading on Mount (Strict-Mode Safe)
  useEffect(() => {
    // 1. Wait until responses are actually hydrated
    if (!responses || !responses.farmer) return;
    
    // 2. Ensure it only runs once per mount
    if (hasAutoRead.current) return;
    
    let isMounted = true;

    // 3. Initial delay before speaking so the user gets oriented
    const timer = setTimeout(() => {
      if (isMounted) {
        hasAutoRead.current = true; // Mark as read ONLY when timer finishes
        
        // Fire the read function and catch any potential browser audio errors
        handleReadPage().catch((err) => {
          console.error("Auto-read failed:", err);
        });
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer); // Cancels the timer if React unmounts quickly
      voiceEngine.stop(); 
    };
    
    // We only depend on the presence of farmer data so it doesn't re-trigger on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses?.farmer]);

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            {t("review.title") || "Review Your Information"}
          </h1>
          <p className="text-slate-500 mt-3">
            {t("review.subtitle") || "Please review your answers before submitting."}
          </p>
        </div>

        {/* Farmer Details */}
        <div ref={farmerRef}>
          <ReviewCard title={t("review.farmerDetails") || "Farmer Details"}>
            <EditableReviewRow
              label={t("review.fields.name") || "Name"}
              value={responses?.farmer?.name ?? ""}
              section="farmer"
              field="farmer.name"
              question={getQuestionForField("farmer.name")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.age") || "Age"}
              value={responses?.farmer?.age ?? ""}
              section="farmer"
              field="farmer.age"
              question={getQuestionForField("farmer.age")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.gender") || "Gender"}
              value={responses?.farmer?.gender ?? ""}
              section="farmer"
              field="farmer.gender"
              question={getQuestionForField("farmer.gender")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.mobile_num") || "Mobile Number"}
              value={responses?.farmer?.mobile_num ?? ""}
              section="farmer"
              field="farmer.mobile_num"
              question={getQuestionForField("farmer.mobile_num")}
              editable={false}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.village") || "Village"}
              value={responses?.farmer?.village ?? ""}
              section="farmer"
              field="farmer.village"
              question={getQuestionForField("farmer.village")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.pincode") || "Pincode"}
              value={responses?.farmer?.pincode ?? ""}
              section="farmer"
              field="farmer.pincode"
              question={getQuestionForField("farmer.pincode")}
              onSave={handleRowSave}
            />
          </ReviewCard>
        </div>

        {/* Farm Details */}
        <div ref={farmRef}>
          <ReviewCard title={t("review.farmDetails") || "Farm Details"}>
            <EditableReviewRow
              label={t("review.fields.farmName") || "Farm Name"}
              value={responses?.farm?.name ?? ""}
              section="farm"
              field="farm.name"
              question={getQuestionForField("farm.name")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.address") || "Address"}
              value={responses?.farm?.address ?? ""}
              section="farm"
              field="farm.address"
              question={getQuestionForField("farm.address")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.tarea") || "Total Area"}
              value={responses?.farm?.Tarea ?? ""}
              section="farm"
              field="farm.Tarea"
              question={getQuestionForField("farm.Tarea")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.uarea") || "Used Area"}
              value={responses?.farm?.Uarea ?? ""}
              section="farm"
              field="farm.Uarea"
              question={getQuestionForField("farm.Uarea")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.farmType") || "Farm Type"}
              value={responses?.farm?.type ?? ""}
              section="farm"
              field="farm.type"
              question={getQuestionForField("farm.type")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.waterSource") || "Water Source"}
              value={responses?.farm?.watersrc ?? ""}
              section="farm"
              field="farm.watersrc"
              question={getQuestionForField("farm.watersrc")}
              onSave={handleRowSave}
            />
            <EditableReviewRow
              label={t("review.fields.blockCount") || "Block Count"}
              value={responses?.farm?.blockCount ?? ""}
              section="farm"
              field="farm.blockCount"
              question={getQuestionForField("farm.blockCount")}
              onSave={handleRowSave}
            />
          </ReviewCard>
        </div>

        {/* Blocks Details */}
        {(responses?.blocks ?? []).map((block, index) => (
          <div 
            key={index} 
            ref={(el) => { blockRefs.current[index] = el; }}
          >
            <ReviewCard title={`${t("review.block") || "Block"} ${index + 1}`}>
              <EditableReviewRow
                label={t("review.fields.blockName") || "Block Name"}
                value={block?.name ?? ""}
                section="block"
                field={`block${index}.name`}
                question={getQuestionForField(`block${index}.name`)}
                onSave={handleRowSave}
              />
              <EditableReviewRow
                label={t("review.fields.area") || "Area"}
                value={block?.area ?? ""}
                section="block"
                field={`block${index}.area`}
                question={getQuestionForField(`block${index}.area`)}
                onSave={handleRowSave}
              />
              <EditableReviewRow
                label={t("review.fields.farmingType") || "Farming Type"}
                value={block?.farmingType ?? ""}
                section="block"
                field={`block${index}.farmingType`}
                question={getQuestionForField(`block${index}.farmingType`)}
                onSave={handleRowSave}
              />
              <EditableReviewRow
                label={t("review.fields.soilType") || "Soil Type"}
                value={block?.soil ?? ""}
                section="block"
                field={`block${index}.soil`}
                question={getQuestionForField(`block${index}.soil`)}
                onSave={handleRowSave}
              />
            </ReviewCard>
          </div>
        ))}

        {/* Navigation */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <button
            onClick={() => navigate("/interview")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors sm:w-auto"
          >
            ← {t("review.backToQuestions") || "Back to Questions"}
          </button>

          <button
            onClick={() => {
              voiceEngine.stop(); // Stop any active reading before restarting
              handleReadPage();
            }}
            className="mr-2 w-full sm:w-auto px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            {t("common.readPage") || "Read Page"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-slate-400 transition"
          >
            {submitting ? (t("review.submitting") || "Submitting...") : (t("common.submit") || "Submit")}
          </button>
        </div>

      </div>
    </div>
  );
}