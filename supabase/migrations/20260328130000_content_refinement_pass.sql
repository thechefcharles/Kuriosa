-- =============================================================================
-- Content refinement pass: difficulty rebalance, bonus coverage, trail density
-- Phase P1.3 refinement — ~50% beginner, ~35% intermediate, ~15% advanced
-- Bonus: 50–70% of topics. Every topic has 1+ outgoing trail.
-- estimatedMinutes: beginner 3–5, intermediate 5–6, advanced 6–8
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. DIFFICULTY REDISTRIBUTION (~50% beginner, ~35% intermediate, ~15% advanced)
-- -----------------------------------------------------------------------------

-- Upgrade beginner → intermediate (8 topics)
UPDATE topics SET difficulty_level = 'intermediate', estimated_minutes = 5
WHERE slug IN (
  'great-pyramid-age', 'how-caffeine-works', 'why-cats-purr', 'honey-lasts-forever',
  'how-rainbows-form', 'why-whales-sing', 'dark-side-moon', 'what-is-paradox'
);

-- Upgrade intermediate → advanced (5 topics)
UPDATE topics SET difficulty_level = 'advanced', estimated_minutes = 7
WHERE slug IN (
  'lightning-hotter-than-sun', 'library-alexandria', 'how-gps-works',
  'how-trees-communicate', 'roman-concrete-lasts'
);

-- Ensure advanced 6–8 min
UPDATE topics SET estimated_minutes = 7 WHERE difficulty_level = 'advanced';

-- -----------------------------------------------------------------------------
-- 2. BONUS QUIZZES (expand to 50–70% coverage ≈ 19 topics)
-- Add bonus to 15 more topics (already have: why-sky-blue, what-is-qr-code,
-- lightning-hotter-than-sun, how-bees-make-honey)
-- -----------------------------------------------------------------------------

-- why-sunset-red
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'On Mars, sunsets appear what color?', 'Different atmosphere scatters differently — Mars sunsets are blue.', 'beginner', 1
FROM topics t WHERE t.slug = 'why-sunset-red' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-sunset-red' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Blue', true), ('Red', false), ('Green', false), ('Yellow', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-rainbows-form
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Where must the sun be relative to you to see a rainbow?', 'Behind you — light refracts through rain in front.', 'beginner', 1
FROM topics t WHERE t.slug = 'how-rainbows-form' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-rainbows-form' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Behind you', true), ('In front of you', false), ('Directly overhead', false), ('Under the horizon', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-ice-floats
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why do lakes freeze from the top down?', 'Ice floats, so it forms on the surface and insulates the water below.', 'beginner', 1
FROM topics t WHERE t.slug = 'why-ice-floats' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-ice-floats' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Ice floats and insulates the water below', true), ('Cold sinks to the bottom', false), ('Surface loses heat fastest', false), ('Pressure melts bottom ice', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- what-is-ball-lightning
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Has ball lightning been reliably reproduced in a lab?', 'No — it remains a witnessed but not fully explained phenomenon.', 'intermediate', 1
FROM topics t WHERE t.slug = 'what-is-ball-lightning' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'what-is-ball-lightning' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('No', true), ('Yes, routinely', false), ('Only in space', false), ('Only in the 1800s', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- great-pyramid-age
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Cleopatra lived closer in time to us or to the pyramid''s construction?', 'Closer to us — the pyramid is that old.', 'intermediate', 1
FROM topics t WHERE t.slug = 'great-pyramid-age' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'great-pyramid-age' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Closer to us', true), ('Closer to the pyramid', false), ('Exactly in between', false), ('We do not know', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- do-trees-sleep
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What did scientists use to measure branch movement at night?', 'Lasers — precise enough to detect subtle drooping.', 'beginner', 1
FROM topics t WHERE t.slug = 'do-trees-sleep' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'do-trees-sleep' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Lasers', true), ('Satellites', false), ('Manual rulers', false), ('Timelapse cameras only', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-caffeine-works
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Does caffeine add energy or block a signal?', 'It blocks adenosine — you feel less tired, not more energized.', 'intermediate', 1
FROM topics t WHERE t.slug = 'how-caffeine-works' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-caffeine-works' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Blocks the "tired" signal', true), ('Adds ATP to cells', false), ('Increases blood sugar', false), ('Replaces sleep', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- printing-press-gutenberg
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Where did Gutenberg develop his printing system?', 'Mainz, Germany — mid-1400s.', 'beginner', 1
FROM topics t WHERE t.slug = 'printing-press-gutenberg' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'printing-press-gutenberg' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Mainz, Germany', true), ('Florence, Italy', false), ('London, England', false), ('Paris, France', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-cats-purr
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Do lions purr?', 'Lions generally roar; cheetahs and smaller cats purr.', 'intermediate', 1
FROM topics t WHERE t.slug = 'why-cats-purr' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-cats-purr' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Generally no — they roar instead', true), ('Yes, always', false), ('Only when cubs', false), ('Only in captivity', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- cloud-computing-simple
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Where did the "cloud" name come from?', 'Network diagrams used a cloud shape for the internet.', 'beginner', 1
FROM topics t WHERE t.slug = 'cloud-computing-simple' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'cloud-computing-simple' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Network diagrams drew the internet as a cloud', true), ('Data floats in the sky', false), ('From "cloud nine"', false), ('A brand name', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- honey-lasts-forever
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Where has edible honey been found by archaeologists?', 'Egyptian tombs — sealed honey can last millennia.', 'intermediate', 1
FROM topics t WHERE t.slug = 'honey-lasts-forever' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'honey-lasts-forever' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Egyptian tombs', true), ('Only in labs', false), ('Ice cores', false), ('Ocean floor', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-barcodes-work
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What was the first product ever scanned with a UPC?', 'A pack of gum in 1974.', 'beginner', 1
FROM topics t WHERE t.slug = 'how-barcodes-work' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-barcodes-work' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('A pack of gum', true), ('A book', false), ('A car part', false), ('Milk', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- software-bug-origin
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Where is the original "bug" moth today?', 'Smithsonian — preserved from the 1947 incident.', 'beginner', 1
FROM topics t WHERE t.slug = 'software-bug-origin' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'software-bug-origin' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Smithsonian', true), ('MIT', false), ('Lost', false), ('Harvard', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-spiders-walk-walls
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What forces do spider feet exploit?', 'Van der Waals — weak molecular attractions at close range.', 'beginner', 1
FROM topics t WHERE t.slug = 'how-spiders-walk-walls' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-spiders-walk-walls' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Van der Waals forces', true), ('Static electricity', false), ('Suction', false), ('Sticky glue only', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- dark-side-moon
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Which country landed on the far side of the Moon first?', 'China''s Chang''e 4 in 2019.', 'intermediate', 1
FROM topics t WHERE t.slug = 'dark-side-moon' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'dark-side-moon' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('China', true), ('USA', false), ('Russia', false), ('No one yet', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-yawn-contagious
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'At what age does contagious yawning typically appear?', 'Around four or five years old.', 'beginner', 1
FROM topics t WHERE t.slug = 'why-yawn-contagious' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-yawn-contagious' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Around four or five', true), ('At birth', false), ('In teens', false), ('Only in adults', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-cant-tickle-self
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Which brain area helps distinguish self from other touch?', 'The cerebellum is involved in self-prediction.', 'intermediate', 1
FROM topics t WHERE t.slug = 'why-cant-tickle-self' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-cant-tickle-self' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Cerebellum', true), ('Prefrontal cortex only', false), ('Hippocampus', false), ('Visual cortex', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- -----------------------------------------------------------------------------
-- 3. TRAILS — ensure every topic has 1+ outgoing (add missing)
-- -----------------------------------------------------------------------------

-- why-sunset-red → how-rainbows-form (same light physics)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Refraction in rain — how rainbows extend the same light story.', 0
FROM topics f, topics t WHERE f.slug = 'why-sunset-red' AND t.slug = 'how-rainbows-form' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- how-rainbows-form → why-sky-blue (light scattering)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Back to the source — why the sky scatters blue in the first place.', 0
FROM topics f, topics t WHERE f.slug = 'how-rainbows-form' AND t.slug = 'why-sky-blue' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- what-is-ball-lightning → lightning-hotter-than-sun (thunderstorm physics)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'The extreme heat of ordinary lightning — what we understand better.', 0
FROM topics f, topics t WHERE f.slug = 'what-is-ball-lightning' AND t.slug = 'lightning-hotter-than-sun' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- how-barcodes-work → what-is-qr-code (2D evolution)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'From 1D to 2D — how QR codes extend the same idea.', 0
FROM topics f, topics t WHERE f.slug = 'how-barcodes-work' AND t.slug = 'what-is-qr-code' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- how-bees-make-honey → honey-lasts-forever
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Why the result of that process lasts so long.', 0
FROM topics f, topics t WHERE f.slug = 'how-bees-make-honey' AND t.slug = 'honey-lasts-forever' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- roman-concrete-lasts → great-pyramid-age (ancient engineering)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Another ancient wonder — stone that has lasted millennia.', 0
FROM topics f, topics t WHERE f.slug = 'roman-concrete-lasts' AND t.slug = 'great-pyramid-age' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- library-alexandria → printing-press-gutenberg (knowledge distribution)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'From scrolls to print — how knowledge spread changed.', 0
FROM topics f, topics t WHERE f.slug = 'library-alexandria' AND t.slug = 'printing-press-gutenberg' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- how-trees-communicate → do-trees-sleep
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Trees have rhythms — do they "sleep"?', 0
FROM topics f, topics t WHERE f.slug = 'how-trees-communicate' AND t.slug = 'do-trees-sleep' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- software-bug-origin → why-computers-binary (computing history)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Why computers use ones and zeros — the foundation.', 0
FROM topics f, topics t WHERE f.slug = 'software-bug-origin' AND t.slug = 'why-computers-binary' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- untranslatable-words → break-a-leg-theatre
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Theatre gave us "break a leg" — another idiom with a story.', 0
FROM topics f, topics t WHERE f.slug = 'untranslatable-words' AND t.slug = 'break-a-leg-theatre' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- black-hole-event-horizon → how-gps-works (relativity connects both)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'GPS corrects for relativity — same physics, everyday application.', 0
FROM topics f, topics t WHERE f.slug = 'black-hole-event-horizon' AND t.slug = 'how-gps-works' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- how-caffeine-works → why-cats-purr (body/brain signals)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Another "why does the body do that?" — purring.', 0
FROM topics f, topics t WHERE f.slug = 'how-caffeine-works' AND t.slug = 'why-cats-purr' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- printing-press-gutenberg → library-alexandria
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Before print — how knowledge was gathered and lost.', 0
FROM topics f, topics t WHERE f.slug = 'printing-press-gutenberg' AND t.slug = 'library-alexandria' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- why-cats-purr → why-whales-sing (animal communication)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'From purrs to songs — how animals communicate.', 0
FROM topics f, topics t WHERE f.slug = 'why-cats-purr' AND t.slug = 'why-whales-sing' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- cloud-computing-simple → how-gps-works (tech / signals)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'From cloud to satellites — how your phone knows where you are.', 0
FROM topics f, topics t WHERE f.slug = 'cloud-computing-simple' AND t.slug = 'how-gps-works' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- why-yawn-contagious → why-cant-tickle-self (brain / social)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Another brain quirk — why we cannot tickle ourselves.', 0
FROM topics f, topics t WHERE f.slug = 'why-yawn-contagious' AND t.slug = 'why-cant-tickle-self' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- why-cant-tickle-self → why-yawn-contagious
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Mirror neurons and contagious yawning — social brains.', 0
FROM topics f, topics t WHERE f.slug = 'why-cant-tickle-self' AND t.slug = 'why-yawn-contagious' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- what-is-paradox → untranslatable-words (concepts / language)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Words that resist translation — limits of language.', 0
FROM topics f, topics t WHERE f.slug = 'what-is-paradox' AND t.slug = 'untranslatable-words' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- how-spiders-walk-walls → why-ice-floats (physics / nature)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Another everyday physics puzzle — why ice floats.', 0
FROM topics f, topics t WHERE f.slug = 'how-spiders-walk-walls' AND t.slug = 'why-ice-floats' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

-- why-whales-sing → how-spiders-walk-walls (nature / adaptation)
INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'From ocean songs to wall-walking — nature''s adaptations.', 0
FROM topics f, topics t WHERE f.slug = 'why-whales-sing' AND t.slug = 'how-spiders-walk-walls' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);
