# Audio script generation (Phase 4.7)

## What it does

**`generateAudioScript(options)`** produces a **spoken-style narration script** (plus **transcript**, **duration estimate**, optional **intro/closing**, **voice hint**). There is **no TTS**, **no file upload**, and **no DB write** yet.

Output is **JSON** → parse → **Zod** validation.

## Files involved

| File | Role |
|------|------|
| `src/lib/ai/prompts/audio-prompts.ts` | Builds messages from topic, category, lesson text or **`generatedLesson`**, duration/word targets |
| `src/lib/ai/generators/generate-audio-script.ts` | **`generateAudioScript(options)`** |
| `src/lib/ai/parsers/audio-parser.ts` | Safe JSON + validation |
| `src/lib/validations/generated-audio.ts` | Schema + consistency checks (transcript vs segments, WPM band) |
| `src/types/content-generation.ts` | **`GeneratedAudioRequestOptions`**, **`GeneratedAudioScript`**, **`GeneratedAudioContent`**, **`generatedAudioToCuriosityFields()`** |
| `src/lib/services/content/prepare-audio-for-tts.ts` | **`prepareAudioForTts()`** — single string for future TTS |
| `src/lib/ai/examples/run-audio-generation-example.ts` | **`npm run ai:audio`** |

## Prompt building

- **System**: speakable, natural, curiosity-first.
- **User**: lesson from **`lessonText`** or **`composeLessonTextFromGenerated(generatedLesson)`**, plus **target duration** or **word count**, **tone**, **audience**.
- Model returns **`{ "audio": { ... } }`**.

## Validation

- Minimum **main narration** length; **transcript** word count must align with **intro + main + closing**.
- **durationSecondsEstimate** must imply ~**95–210** words/min over the **full transcript**.
- **estimatedWordCount** ~**±12%** of transcript words.

## CuriosityExperience & later TTS

| Generated | Later `CuriosityAudio` |
|-----------|-------------------------|
| `transcriptText` | `transcript` |
| `durationSecondsEstimate` | `durationSeconds` |
| — | `audioUrl` after TTS + storage |

**`prepareAudioForTts()`** builds **`ttsPlainText`** for a future provider; **`generatedAudioToCuriosityFields()`** fills transcript + duration for assembly.

## Run the example

```bash
npm run ai:audio
```

Requires **`OPENAI_API_KEY`** in `.env.local`. Expect **two** topics logged with excerpts and metadata.

## Later phases

TTS → upload → **`audioUrl`** → Listen Mode → admin review; same **prompts → generator → parser** pattern as 4.2–4.6.
