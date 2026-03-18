-- =============================================================================
-- Ten demo curiosities — run in Supabase SQL Editor (or: supabase db execute)
-- Prerequisites: categories seeded (science, history, nature, technology, culture)
-- Safe to re-run: skips topics that already exist (by slug).
-- =============================================================================

-- 1) Why is the sky blue?
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'Why is the sky blue?',
  'why-sky-blue',
  c.id,
  'If space is black, why do we see blue overhead?',
  'Sunlight looks white but contains every color. When it enters our atmosphere, it bumps into tiny air molecules. Blue light has a shorter wavelength and scatters in all directions much more than red or yellow — so wherever you look (except straight at the sun), scattered blue light reaches your eyes. At sunrise and sunset, light travels through more air; blue scatters away first, leaving reds and oranges.',
  'On Mars, the sky often looks butterscotch or pink — different atmosphere, different scattering.',
  'Pilots and photographers use this idea: clear days = strong blue; hazy days = paler sky.',
  'beginner',
  4,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'science' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'Why does the daytime sky usually look blue?',
  'Shorter wavelengths (blue) scatter more off air molecules than longer wavelengths.',
  'beginner', 0
FROM topics t WHERE t.slug = 'why-sky-blue'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-sky-blue'
CROSS JOIN (VALUES
  ('Because the ocean reflects into the sky', false),
  ('Blue light scatters more in the atmosphere than other colors', true),
  ('The sun only emits blue light', false),
  ('Clouds dye the air blue', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 2) Great Pyramid age
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'How old is the Great Pyramid of Giza?',
  'great-pyramid-age',
  c.id,
  'Was it built before the Roman Empire — or after dinosaurs?',
  'The Great Pyramid was completed around 2560 BCE for Pharaoh Khufu. That is over 4,500 years ago — older than many civilizations people learn about in school. The Romans visited it as an ancient wonder; Cleopatra lived closer in time to us than to the pyramid''s construction.',
  'It was the tallest human-made structure in the world for nearly 4,000 years.',
  'Dating ancient stone helps archaeologists piece together trade, labor, and belief systems.',
  'beginner',
  5,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'history' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'Roughly how old is the Great Pyramid of Giza?',
  'Scholars place its completion around 2560 BCE.',
  'beginner', 0
FROM topics t WHERE t.slug = 'great-pyramid-age'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'great-pyramid-age'
CROSS JOIN (VALUES
  ('About 500 years', false),
  ('About 2,000 years', false),
  ('Over 4,000 years', true),
  ('From the age of dinosaurs', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 3) Trees "sleep"
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'Do trees sleep?',
  'do-trees-sleep',
  c.id,
  'Branches droop at night — is that rest?',
  'Trees don''t have brains or eyelids, but many show a day–night rhythm. Some species let their branches relax slightly at night (measured with lasers). Photosynthesis pauses in the dark; they still respire. So "sleep" is a metaphor — but living wood really does change behavior with light.',
  'Corn plants can "lean" toward predicted sunrise before dawn.',
  'Understanding plant clocks helps farming, forestry, and climate models.',
  'beginner',
  4,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'nature' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'Which statement best fits what science says about trees at night?',
  'Metabolic rhythms and branch position can change; it is not sleep like animals.',
  'beginner', 0
FROM topics t WHERE t.slug = 'do-trees-sleep'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'do-trees-sleep'
CROSS JOIN (VALUES
  ('They sleep exactly like humans', false),
  ('They show no change between day and night', false),
  ('Some show rhythms and branch movement; not sleep in the animal sense', true),
  ('All trees close their leaves every night', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 4) QR codes
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'What is a QR code?',
  'what-is-qr-code',
  c.id,
  'Those square pixel mazes — what are they really?',
  'QR stands for Quick Response. Invented in Japan for tracking auto parts, a QR code stores text (often a URL) in a two-dimensional grid. Phone cameras read the position markers and decode the pattern in milliseconds. Error correction means part of the code can be damaged and it still works.',
  'A single QR can hold thousands of characters — far more than a barcode line.',
  'Payments, menus, and tickets rely on the same idea: camera + decoder app.',
  'beginner',
  4,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'technology' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'What does the "QR" in QR code stand for?',
  'Denso Wave coined "Quick Response" for fast scanning.',
  'beginner', 0
FROM topics t WHERE t.slug = 'what-is-qr-code'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'what-is-qr-code'
CROSS JOIN (VALUES
  ('Quick Response', true),
  ('Quantum Reader', false),
  ('Quality Rating', false),
  ('Query Router', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 5) Break a leg
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'Why do actors say "break a leg"?',
  'break-a-leg-theatre',
  c.id,
  'It sounds violent — so why is it good luck?',
  'No single origin is proven. Favorite theories: reverse psychology (like not jinxing a show), or bowing so deep you "break" the line of the leg on stage. Another links to the German phrase meaning "lots of success." Today it simply means "good luck" in theatre — never say "good luck" backstage!',
  'In ballet, people sometimes say "merde" — another tradition with murky roots.',
  'Idioms show how groups create shared meaning over centuries.',
  'beginner',
  4,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'culture' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'In theatre, "break a leg" usually means:',
  'It is a traditional way to wish someone well before a performance.',
  'beginner', 0
FROM topics t WHERE t.slug = 'break-a-leg-theatre'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'break-a-leg-theatre'
CROSS JOIN (VALUES
  ('Good luck', true),
  ('Leave the stage immediately', false),
  ('The show is cancelled', false),
  ('You forgot your lines', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 6) Caffeine
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'How does caffeine wake you up?',
  'how-caffeine-works',
  c.id,
  'Why does coffee push away the fog?',
  'Your brain builds adenosine while you are awake; it binds to receptors and makes you feel tired. Caffeine has a similar shape and parks in those receptors first — blocking adenosine. You do not suddenly have more energy; you feel less of the "sleepy" signal. It wears off as caffeine is metabolized.',
  'Tea also has caffeine, often called theine — same molecule.',
  'Timing and dose affect sleep quality even when you still "feel" fine.',
  'beginner',
  5,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'science' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'Caffeine mainly makes you feel more alert by:',
  'Blocking adenosine from binding to its receptors.',
  'beginner', 0
FROM topics t WHERE t.slug = 'how-caffeine-works'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-caffeine-works'
CROSS JOIN (VALUES
  ('Adding extra ATP to cells', false),
  ('Blocking adenosine receptors', true),
  ('Increasing blood oxygen instantly', false),
  ('Replacing lost sleep', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 7) Printing press
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'Who gets credit for the printing press?',
  'printing-press-gutenberg',
  c.id,
  'Books existed before — what changed around 1440?',
  'Movable type and presses existed in Asia earlier, but Johannes Gutenberg''s mid-1400s system in Mainz combined metal type, oil-based ink, and a wine press–like machine to mass-produce Latin Bibles. Ideas spread faster; literacy debates began. "Gutenberg" became shorthand for that European revolution.',
  'The Gutenberg Bible is among the most famous early printed books.',
  'Cheap copies shaped religion, science, and politics across continents.',
  'beginner',
  5,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'history' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'Who is most associated with the European printing press revolution (~1440)?',
  'Gutenberg''s workshop in Mainz is the usual anchor point in Western history.',
  'beginner', 0
FROM topics t WHERE t.slug = 'printing-press-gutenberg'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'printing-press-gutenberg'
CROSS JOIN (VALUES
  ('Leonardo da Vinci', false),
  ('Johannes Gutenberg', true),
  ('Isaac Newton', false),
  ('Marco Polo', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 8) Why cats purr
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'Why do cats purr?',
  'why-cats-purr',
  c.id,
  'Happy cat — but also hurt cats. Why?',
  'Purring often signals contentment, but cats also purr when stressed or in pain — possibly as self-soothing. The mechanism involves rapid twitching of muscles in the voice box and diaphragm, creating vibrations in the airway. Some research suggests those frequencies may promote healing — still debated.',
  'Big cats like cheetahs purr; lions generally do not (they roar instead).',
  'Reading body context matters: relaxed purr vs. vet-visit purr differ.',
  'beginner',
  4,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'nature' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'Cats purr mostly when:',
  'Context matters — comfort is common but not the only case.',
  'beginner', 0
FROM topics t WHERE t.slug = 'why-cats-purr'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-cats-purr'
CROSS JOIN (VALUES
  ('They are only happy', false),
  ('They are only hungry', false),
  ('Often when content, but also when stressed or in pain — context matters', true),
  ('To communicate only with dogs', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 9) Cloud computing
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'What is cloud computing (simply)?',
  'cloud-computing-simple',
  c.id,
  'It is not actually in the clouds.',
  '"The cloud" means someone else''s computers on the internet run software or store your files. You use apps and pay (or not) for storage and processing over the network instead of only your laptop. Data centers worldwide host these services — redundant, scalable, and maintained by providers.',
  'The name came from network diagrams where the internet was drawn as a cloud.',
  'Streaming, email, and backups often live in the cloud.',
  'beginner',
  4,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'technology' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'In everyday terms, "the cloud" usually means:',
  'Services and storage on providers'' internet-connected computers.',
  'beginner', 0
FROM topics t WHERE t.slug = 'cloud-computing-simple'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'cloud-computing-simple'
CROSS JOIN (VALUES
  ('Weather data only', false),
  ('Programs running on remote servers over the internet', true),
  ('A backup on a USB stick', false),
  ('Wi-Fi radio waves', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- 10) Honey never spoils (fun food science)
INSERT INTO topics (
  title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance,
  difficulty_level, estimated_minutes, status, is_random_featured, source_type
)
SELECT
  'Why can honey last for thousands of years?',
  'honey-lasts-forever',
  c.id,
  'Archaeologists found edible honey in ancient pots. How?',
  'Honey is very low in water and very high in sugar — most bacteria and molds cannot grow in it. Bees add enzymes that create small amounts of hydrogen peroxide. Acidity helps too. If you dilute honey (or leave it open), it can ferment. Sealed dry honey is a natural preservative.',
  'Edible honey has been found in Egyptian tombs.',
  'Food chemistry explains shelf life without modern additives.',
  'beginner',
  4,
  'published',
  true,
  'seed'
FROM categories c WHERE c.slug = 'science' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice',
  'A main reason sealed honey stays safe for so long is:',
  'Low water activity + sugar concentration + acidity inhibit microbes.',
  'beginner', 0
FROM topics t WHERE t.slug = 'honey-lasts-forever'
AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);

INSERT INTO quiz_options (quiz_id, option_text, is_correct)
SELECT q.id, o.opt, o.ok
FROM quizzes q
JOIN topics t ON t.id = q.topic_id AND t.slug = 'honey-lasts-forever'
CROSS JOIN (VALUES
  ('It contains no sugar', false),
  ('Low moisture and high sugar make it hostile to most microbes', true),
  ('Bees add artificial preservatives', false),
  ('Honey is frozen in the hive', false)
) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- Optional: set today (UTC) daily pick to first topic (edit date if needed)
-- INSERT INTO daily_curiosity (date, topic_id, theme)
-- SELECT CURRENT_DATE AT TIME ZONE 'UTC', t.id, 'Demo seed'
-- FROM topics t WHERE t.slug = 'why-sky-blue'
-- ON CONFLICT (date) DO UPDATE SET topic_id = EXCLUDED.topic_id, theme = EXCLUDED.theme;
