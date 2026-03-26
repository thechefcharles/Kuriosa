-- =============================================================================
-- Content expansion: 20 new topics, difficulty calibration, trails, bonus questions
-- Phase P1.3 — Content inventory and discovery depth
-- Prerequisites: categories (science, history, nature, technology, culture,
--   psychology, space, biology, philosophy, finance-economics), ten-demo topics
-- Safe to re-run: uses ON CONFLICT / NOT EXISTS where applicable
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. NEW TOPICS (20)
-- -----------------------------------------------------------------------------

-- Science
INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why are sunsets red?', 'why-sunset-red', c.id,
  'The same sky that is blue at noon turns orange at dusk. Why?',
  'The same scattering that makes the daytime sky blue makes sunsets red. When the sun is low, light travels through much more atmosphere. Blue and violet scatter away first; longer wavelengths (red, orange) pass through and reach your eyes. Dust and pollution can deepen the colors. It is the flip side of Rayleigh scattering.',
  'Mars sunsets are blue — the opposite of Earth.',
  'Pilots and photographers plan around "golden hour" for this reason.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'science' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'How do rainbows form?', 'how-rainbows-form', c.id,
  'Why does a rainbow always appear opposite the sun?',
  'Rainbows form when sunlight enters raindrops, bends (refracts), reflects off the back of the drop, and bends again as it exits. Different wavelengths bend by different amounts, so colors separate. You see a rainbow only when the sun is behind you and rain is in front — your eyes, the sun, and the rainbow center form a line. Double rainbows are a second reflection inside the drop.',
  'No two people see exactly the same rainbow — it is a personal cone of angles.',
  'Understanding refraction helps with lenses, cameras, and fiber optics.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'science' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why does ice float on water?', 'why-ice-floats', c.id,
  'Most solids sink in their liquid form. Ice does not.',
  'Water is unusual: its solid form is less dense than its liquid form. When water freezes, molecules form a hexagonal lattice with gaps. Liquid water has molecules packed more tightly. So ice floats. That is why lakes freeze from the top down — the ice insulates the water below. If ice sank, many bodies of water would freeze solid.',
  'Without this quirk, life in cold climates would be very different.',
  'Engineers and chemists rely on water''s density anomalies.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'science' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why is lightning hotter than the sun?', 'lightning-hotter-than-sun', c.id,
  'A bolt can reach 30,000 °C — five times the sun''s surface.',
  'Lightning is an enormous electric discharge. The current ionizes air and heats it to tens of thousands of degrees Celsius — hotter than the sun''s surface (about 5,500 °C). The bolt is very narrow and lasts milliseconds, so total energy is less than the sun, but the temperature spike is real. Thunder is the shock wave from that sudden expansion.',
  'Lightning can fuse sand into glass (fulgurites).',
  'Understanding plasma and electrical discharge matters for fusion research and safety.',
  'intermediate', 5, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'science' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'What is ball lightning?', 'what-is-ball-lightning', c.id,
  'Glowing orbs that float through the air — real or myth?',
  'Ball lightning is a rare, poorly understood phenomenon. Witnesses describe glowing spheres, often during thunderstorms, that drift, bounce, or pass through glass. Proposed explanations include vaporized silicon, plasma loops, or electromagnetic cavities. Scientists debate which model fits best. It is real enough to have been studied, but no one has reliably reproduced it in a lab.',
  'Some accounts date back centuries; pilots have reported it.',
  'Mysteries like this drive instrumentation and observation improvements.',
  'intermediate', 5, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'science' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- History
INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'How did Roman concrete last 2,000 years?', 'roman-concrete-lasts', c.id,
  'Modern concrete crumbles in decades. Roman harbors still stand.',
  'Roman concrete used volcanic ash (pozzolana) and lime. When seawater reacted with the mix, it formed minerals that actually strengthened over time. Modern Portland cement does not have that chemistry. Researchers are now reverse-engineering Roman recipes to make longer-lasting, lower-carbon concrete.',
  'The Pantheon''s dome is still the world''s largest unreinforced concrete dome.',
  'Durability and sustainability in construction are urgent today.',
  'intermediate', 6, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'history' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why did the Library of Alexandria matter?', 'library-alexandria', c.id,
  'It was not just a building — it was a hub of ancient knowledge.',
  'The Library of Alexandria gathered scrolls from across the known world. Scholars edited texts, produced standard editions, and advanced geometry, astronomy, and medicine. Its loss — whether gradual or in fires — became a symbol of lost knowledge. The idea of a universal library still shapes how we think about preserving and sharing information.',
  'We do not know exactly when or how it was destroyed.',
  'Libraries and archives remain central to scholarship and open access.',
  'intermediate', 6, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'history' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Technology
INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'How do barcodes work?', 'how-barcodes-work', c.id,
  'Those stripes on every product — what do they encode?',
  'A barcode encodes numbers (or text) as alternating dark and light bars of varying width. A scanner shines light, measures reflections, and decodes the pattern. The Universal Product Code (UPC) identifies the product and manufacturer. QR codes are 2D versions that hold far more data. Both rely on error-checking so smudges do not cause misreads.',
  'The first barcode scanned was a pack of gum in 1974.',
  'Inventory, shipping, and retail depend on fast, accurate scanning.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'technology' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why do computers use binary?', 'why-computers-binary', c.id,
  'Ones and zeros — why not use ten digits like us?',
  'Computers use binary because it maps cleanly to physical states: on/off, high voltage/low voltage, magnetized/not. Building reliable circuits that distinguish ten levels would be far harder. Binary also simplifies logic: AND, OR, NOT gates are straightforward. Every number, letter, and instruction is encoded as patterns of bits.',
  'A single byte can represent 256 different values.',
  'Understanding binary helps with programming, compression, and security.',
  'intermediate', 5, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'technology' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Where did the software "bug" get its name?', 'software-bug-origin', c.id,
  'A moth, a relay, and a famous notebook.',
  'In 1947, engineers debugging Harvard''s Mark II computer found a moth stuck in a relay. Grace Hopper taped it into the logbook and wrote "first actual case of bug being found." "Bug" had been used for glitches before, but this incident popularized it. "Debugging" became the standard term for fixing defects.',
  'The moth is preserved at the Smithsonian.',
  'The term shapes how developers talk about and fix problems.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'technology' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'How does GPS know where you are?', 'how-gps-works', c.id,
  'Your phone pinpoints you within meters. How?',
  'GPS satellites broadcast precise timestamps. Your receiver gets signals from several satellites and measures how long each took to arrive. By comparing those times, it can triangulate your position. You need at least four satellites for 3D position and time. The math assumes the speed of light; even tiny clock errors would break it, so satellites use atomic clocks.',
  'GPS accounts for relativity — satellites run slightly faster than ground clocks.',
  'Navigation, farming, finance, and disaster response all rely on GPS.',
  'intermediate', 6, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'technology' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- Nature / Biology (use biology or nature category)
INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'How do bees make honey?', 'how-bees-make-honey', COALESCE((SELECT id FROM categories WHERE slug = 'biology' LIMIT 1), (SELECT id FROM categories WHERE slug = 'nature' LIMIT 1)),
  'From flower nectar to the jar — what happens in between?',
  'Worker bees collect nectar and store it in a special stomach. Enzymes start breaking down sucrose into glucose and fructose. Back at the hive, they regurgitate it into cells and fan it to evaporate water. When moisture is low enough, they cap the cell with wax. The result is honey — concentrated sugar that resists spoilage and feeds the colony through winter.',
  'A single bee produces about a twelfth of a teaspoon of honey in its life.',
  'Understanding bee biology helps with conservation and pollination.',
  'beginner', 5, 'published', true, 'seed'
FROM (SELECT 1) _
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'How do spiders walk on walls?', 'how-spiders-walk-walls', COALESCE((SELECT id FROM categories WHERE slug = 'biology' LIMIT 1), (SELECT id FROM categories WHERE slug = 'nature' LIMIT 1)),
  'Gravity does not seem to apply to them.',
  'Spiders use multiple mechanisms: tiny hairs (setae) that exploit van der Waals forces — weak attractions between molecules at very close range. Some species also use a sticky silk. Their feet have thousands of contact points, so the total adhesive force exceeds their weight. Geckos use a similar principle.',
  'A spider the size of a human could theoretically scale a skyscraper.',
  'Bio-inspired adhesives are being developed for robotics and medicine.',
  'beginner', 4, 'published', true, 'seed'
FROM (SELECT 1) _ ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why do whales sing?', 'why-whales-sing', COALESCE((SELECT id FROM categories WHERE slug = 'biology' LIMIT 1), (SELECT id FROM categories WHERE slug = 'nature' LIMIT 1)),
  'Their songs travel thousands of miles through the ocean.',
  'Humpback whale songs are complex, repeating patterns that can last up to 20 minutes. Males sing during breeding season — likely to attract mates or assert dominance. Songs evolve over time; populations share and change them. Low frequencies travel far in water. We still do not know every function of whale song.',
  'Whale songs were once classified and sold as recordings.',
  'Understanding whale communication informs conservation and ocean noise policy.',
  'beginner', 5, 'published', true, 'seed'
FROM (SELECT 1) _ ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'How do trees communicate?', 'how-trees-communicate', COALESCE((SELECT id FROM categories WHERE slug = 'biology' LIMIT 1), (SELECT id FROM categories WHERE slug = 'nature' LIMIT 1)),
  'They share nutrients and warnings through an underground network.',
  'Trees connect via fungal networks (mycorrhizae) that link roots. Through these, they exchange carbon, nitrogen, and chemical signals. When one tree is stressed or attacked, it can "warn" neighbors, which may ramp up defenses. Older "mother" trees can preferentially feed seedlings. The metaphor "wood wide web" captures this.',
  'Some forests have trees that are thousands of years old.',
  'Forest management and conservation increasingly consider these networks.',
  'intermediate', 6, 'published', true, 'seed'
FROM (SELECT 1) _ ON CONFLICT (slug) DO NOTHING;

-- Space
INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'What is the "dark side" of the Moon really?', 'dark-side-moon', c.id,
  'It is not actually dark — and we can see it from Earth.',
  'The "dark side" is better called the far side. The Moon is tidally locked: one face always points toward Earth. The far side gets just as much sunlight; it is "dark" only in the sense of unknown before spacecraft. We see only one hemisphere from Earth. The far side has a different surface — more craters, fewer smooth "seas."',
  'China''s Chang''e 4 landed on the far side in 2019.',
  'Understanding tidal locking applies to exoplanets and binary systems.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'space' LIMIT 1 ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why do astronauts grow taller in space?', 'astronauts-grow-taller-space', c.id,
  'They can gain an inch or two — then lose it back on Earth.',
  'Without gravity, the spine stretches. Discs between vertebrae expand, and the curvature of the spine relaxes. Astronauts can gain 1–2 inches in height. Back on Earth, gravity compresses them again within a day or two. This is one reason exercise and careful posture matter for long missions.',
  'Some astronauts report back pain when they return — the spine re-compressing.',
  'Understanding spinal adaptation helps plan Mars missions and treat back problems on Earth.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'space' LIMIT 1 ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'What happens at the event horizon of a black hole?', 'black-hole-event-horizon', c.id,
  'The point of no return — what does physics say?',
  'The event horizon is the boundary beyond which nothing can escape a black hole''s gravity. From outside, you would see an object approaching it slow down and redden (gravitational time dilation). At the horizon, time effectively stops from a distant view. What happens inside is unknown — general relativity suggests a singularity, but quantum effects may change that.',
  'A black hole the mass of the Sun would have an event horizon a few miles across.',
  'Understanding black holes tests the limits of general relativity and quantum mechanics.',
  'advanced', 7, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'space' LIMIT 1 ON CONFLICT (slug) DO NOTHING;

-- Psychology
INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why do we yawn when others yawn?', 'why-yawn-contagious', c.id,
  'You read this and might yawn. Why?',
  'Contagious yawning is linked to empathy and mirror neurons — brain cells that fire when we see someone else act. People with higher empathy yawn more in response. It may strengthen social bonds or help groups stay alert. Dogs and some primates also catch yawns from humans.',
  'Contagious yawning appears around age four or five.',
  'Studying it sheds light on social cognition and developmental disorders.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'psychology' LIMIT 1 ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why can''t we tickle ourselves?', 'why-cant-tickle-self', c.id,
  'Your brain predicts your own actions and cancels the surprise.',
  'When you move, your brain predicts the sensory feedback. That prediction suppresses the tickle response — you already "know" what is coming. When someone else tickles you, the surprise remains, so you react. The cerebellum is involved in this self-versus-other distinction.',
  'Some people with schizophrenia can tickle themselves — the prediction system may differ.',
  'Understanding self-prediction illuminates agency, body ownership, and psychiatric conditions.',
  'beginner', 4, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'psychology' LIMIT 1 ON CONFLICT (slug) DO NOTHING;

-- Philosophy (use philosophy or add if missing)
INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'What is a paradox?', 'what-is-paradox', COALESCE((SELECT id FROM categories WHERE slug = 'philosophy' LIMIT 1), (SELECT id FROM categories WHERE slug = 'science' LIMIT 1)),
  'Statements that seem to contradict themselves — but matter.',
  'A paradox is a statement or situation that leads to a logical contradiction or challenges intuition. Examples: the liar paradox ("This statement is false"), Zeno''s paradoxes of motion, or the grandfather paradox in time travel. Paradoxes have driven advances in logic, mathematics, and philosophy. They expose the limits of our concepts.',
  'Gödel used self-reference to prove limits of formal systems.',
  'Paradoxes appear in computing, law, and decision theory.',
  'beginner', 5, 'published', true, 'seed'
FROM (SELECT 1) _ ON CONFLICT (slug) DO NOTHING;

-- Culture
INSERT INTO topics (title, slug, category_id, hook_text, lesson_text, surprising_fact, real_world_relevance, difficulty_level, estimated_minutes, status, is_random_featured, source_type)
SELECT 'Why do some words seem untranslatable?', 'untranslatable-words', c.id,
  'Concepts that resist a simple English equivalent.',
  'Some words capture cultural or experiential nuances that do not map cleanly to another language. "Saudade" (Portuguese), "hygge" (Danish), "Schadenfreude" (German) are examples. They reflect how language shapes thought and how different cultures categorize experience. "Untranslatable" does not mean impossible — it means no single word does the job.',
  'Languages can borrow these words; "schadenfreude" is used in English.',
  'Translation, localization, and cross-cultural communication depend on this awareness.',
  'intermediate', 5, 'published', true, 'seed'
FROM categories c WHERE c.slug = 'culture' LIMIT 1 ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. QUIZZES + QUIZ_OPTIONS (new topics)
-- -----------------------------------------------------------------------------

-- why-sunset-red
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why do sunsets often look red or orange?', 'Longer wavelengths pass through more atmosphere when the sun is low; blue scatters away first.', 'beginner', 0
FROM topics t WHERE t.slug = 'why-sunset-red' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-sunset-red' CROSS JOIN (VALUES
  ('Blue light scatters away first, leaving red and orange', true),
  ('The sun changes color at dusk', false),
  ('Pollution always makes sunsets red', false),
  ('Clouds filter out blue light', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-rainbows-form
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'How does a rainbow form?', 'Light refracts and reflects inside raindrops; colors separate by wavelength.', 'beginner', 0
FROM topics t WHERE t.slug = 'how-rainbows-form' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-rainbows-form' CROSS JOIN (VALUES
  ('Sunlight refracts and reflects inside raindrops', true),
  ('Raindrops are naturally colored', false),
  ('Rainbows are optical illusions only', false),
  ('The rainbow is painted by moisture', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-ice-floats
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why does ice float on liquid water?', 'Ice is less dense than water because of the hexagonal crystal structure.', 'beginner', 0
FROM topics t WHERE t.slug = 'why-ice-floats' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-ice-floats' CROSS JOIN (VALUES
  ('Ice is less dense than liquid water', true),
  ('Ice has air bubbles that make it light', false),
  ('Water expands when heated', false),
  ('Ice absorbs salt from water', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- lightning-hotter-than-sun
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why can lightning be hotter than the sun''s surface?', 'The electric current ionizes air and heats it to extreme temperatures in a narrow channel.', 'intermediate', 0
FROM topics t WHERE t.slug = 'lightning-hotter-than-sun' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'lightning-hotter-than-sun' CROSS JOIN (VALUES
  ('The electric discharge ionizes and heats air to tens of thousands of degrees', true),
  ('Lightning is made of plasma like the sun', false),
  ('Lightning comes from the sun', false),
  ('The sun''s surface is actually cold', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- what-is-ball-lightning
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Ball lightning is best described as:', 'A rare, poorly understood phenomenon with multiple proposed explanations.', 'intermediate', 0
FROM topics t WHERE t.slug = 'what-is-ball-lightning' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'what-is-ball-lightning' CROSS JOIN (VALUES
  ('A rare, witnessed phenomenon with no agreed scientific explanation yet', true),
  ('A myth with no real observations', false),
  ('A type of regular lightning', false),
  ('Fully explained as vaporized silicon', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- roman-concrete-lasts
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What made Roman concrete more durable than many modern mixes?', 'Volcanic ash and lime reacted with seawater to form strengthening minerals over time.', 'intermediate', 0
FROM topics t WHERE t.slug = 'roman-concrete-lasts' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'roman-concrete-lasts' CROSS JOIN (VALUES
  ('Volcanic ash and lime that strengthened when reacting with seawater', true),
  ('They used stronger rocks', false),
  ('Modern concrete is weaker by design', false),
  ('Romans had secret ingredients we lost', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- library-alexandria
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why did the Library of Alexandria matter historically?', 'It was a hub for gathering, editing, and advancing knowledge across disciplines.', 'intermediate', 0
FROM topics t WHERE t.slug = 'library-alexandria' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'library-alexandria' CROSS JOIN (VALUES
  ('It gathered scrolls and supported scholars who advanced many fields', true),
  ('It was the first library ever built', false),
  ('It held the only copies of ancient texts', false),
  ('It was primarily for religious texts', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-barcodes-work
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'How does a barcode store information?', 'Dark and light bars of varying width encode numbers; a scanner reads the pattern.', 'beginner', 0
FROM topics t WHERE t.slug = 'how-barcodes-work' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-barcodes-work' CROSS JOIN (VALUES
  ('As patterns of dark and light bars of varying width', true),
  ('As tiny magnets', false),
  ('As hidden text readable by laser', false),
  ('As radio signals', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-computers-binary
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why do computers use binary instead of base 10?', 'Binary maps to simple physical states: on/off, high/low voltage.', 'intermediate', 0
FROM topics t WHERE t.slug = 'why-computers-binary' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-computers-binary' CROSS JOIN (VALUES
  ('Binary maps cleanly to on/off physical states', true),
  ('Base 10 was not invented yet', false),
  ('Binary is faster for humans to read', false),
  ('Computers cannot count past 2', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- software-bug-origin
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Where did the term "bug" for a software defect become famous?', 'Grace Hopper and the 1947 moth in the Mark II computer.', 'beginner', 0
FROM topics t WHERE t.slug = 'software-bug-origin' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'software-bug-origin' CROSS JOIN (VALUES
  ('A moth found in Harvard''s Mark II computer in 1947', true),
  ('A virus in early mainframes', false),
  ('A typo in the first program', false),
  ('A hacker''s nickname', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-gps-works
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'How does GPS determine your position?', 'It measures signal travel times from multiple satellites and triangulates.', 'intermediate', 0
FROM topics t WHERE t.slug = 'how-gps-works' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-gps-works' CROSS JOIN (VALUES
  ('By measuring signal travel times from multiple satellites', true),
  ('By tracking your phone''s Wi-Fi', false),
  ('By reading cell tower locations', false),
  ('By using the Earth''s magnetic field', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-bees-make-honey
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What do bees do to turn nectar into honey?', 'They add enzymes, evaporate water, and cap the cells when ready.', 'beginner', 0
FROM topics t WHERE t.slug = 'how-bees-make-honey' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-bees-make-honey' CROSS JOIN (VALUES
  ('Add enzymes, evaporate water, and cap cells with wax', true),
  ('Boil the nectar in the hive', false),
  ('Filter pollen from flowers', false),
  ('Mix nectar with soil', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-spiders-walk-walls
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What mainly lets spiders cling to walls?', 'Van der Waals forces from many tiny hairs (setae) on their feet.', 'beginner', 0
FROM topics t WHERE t.slug = 'how-spiders-walk-walls' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-spiders-walk-walls' CROSS JOIN (VALUES
  ('Tiny hairs that exploit van der Waals forces', true),
  ('Sticky glue on their feet', false),
  ('Suction cups', false),
  ('Static electricity', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-whales-sing
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why do humpback whales sing?', 'Males sing during breeding season, likely for mating or dominance.', 'beginner', 0
FROM topics t WHERE t.slug = 'why-whales-sing' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-whales-sing' CROSS JOIN (VALUES
  ('Males sing during breeding season, likely for mating or dominance', true),
  ('To navigate in the dark', false),
  ('To scare away predators', false),
  ('All whales sing the same song', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- how-trees-communicate
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'How do trees "communicate" with each other?', 'Through fungal networks linking roots, exchanging carbon and chemical signals.', 'intermediate', 0
FROM topics t WHERE t.slug = 'how-trees-communicate' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-trees-communicate' CROSS JOIN (VALUES
  ('Through fungal networks that link their roots', true),
  ('By releasing scents into the air', false),
  ('Through their leaves touching', false),
  ('They do not communicate', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- dark-side-moon
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What is the "dark side" of the Moon?', 'The far side — it gets sunlight but never faces Earth due to tidal locking.', 'beginner', 0
FROM topics t WHERE t.slug = 'dark-side-moon' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'dark-side-moon' CROSS JOIN (VALUES
  ('The far side that never faces Earth; it still gets sunlight', true),
  ('A side that is permanently shadowed', false),
  ('The side facing away from the sun', false),
  ('A myth — we see all sides', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- astronauts-grow-taller-space
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why do astronauts temporarily grow taller in space?', 'Without gravity, the spine stretches and discs expand.', 'beginner', 0
FROM topics t WHERE t.slug = 'astronauts-grow-taller-space' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'astronauts-grow-taller-space' CROSS JOIN (VALUES
  ('The spine stretches when gravity is removed', true),
  ('Bones grow faster in microgravity', false),
  ('Muscles expand', false),
  ('It is a measurement error', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- black-hole-event-horizon
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What is the event horizon of a black hole?', 'The boundary beyond which nothing can escape the black hole''s gravity.', 'advanced', 0
FROM topics t WHERE t.slug = 'black-hole-event-horizon' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'black-hole-event-horizon' CROSS JOIN (VALUES
  ('The boundary beyond which nothing can escape', true),
  ('The surface of the black hole', false),
  ('The point where light bends', false),
  ('The edge of the galaxy', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-yawn-contagious
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why is yawning contagious?', 'Linked to empathy and mirror neurons; we mirror what we see.', 'beginner', 0
FROM topics t WHERE t.slug = 'why-yawn-contagious' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-yawn-contagious' CROSS JOIN (VALUES
  ('Empathy and mirror neurons make us imitate others', true),
  ('We need the same amount of oxygen', false),
  ('Yawning is a reflex we cannot control', false),
  ('It is random coincidence', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- why-cant-tickle-self
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Why can''t we tickle ourselves?', 'The brain predicts our own actions and suppresses the surprise response.', 'beginner', 0
FROM topics t WHERE t.slug = 'why-cant-tickle-self' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-cant-tickle-self' CROSS JOIN (VALUES
  ('The brain predicts our own touch and cancels the surprise', true),
  ('Our hands are not sensitive enough', false),
  ('Tickling requires two people', false),
  ('It is a learned behavior', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- what-is-paradox
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What is a paradox?', 'A statement or situation that leads to logical contradiction or challenges intuition.', 'beginner', 0
FROM topics t WHERE t.slug = 'what-is-paradox' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'what-is-paradox' CROSS JOIN (VALUES
  ('A statement that leads to contradiction or challenges intuition', true),
  ('A false statement', false),
  ('A very long argument', false),
  ('A type of joke', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- untranslatable-words
INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', '"Untranslatable" words usually mean:', 'No single word in another language captures the same nuance.', 'intermediate', 0
FROM topics t WHERE t.slug = 'untranslatable-words' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'untranslatable-words' CROSS JOIN (VALUES
  ('No single word in another language captures the same nuance', true),
  ('They cannot be explained at all', false),
  ('They are from dead languages', false),
  ('They are technical terms only', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- -----------------------------------------------------------------------------
-- 3. BONUS QUIZZES (sort_order 1) for selected topics
-- -----------------------------------------------------------------------------

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'On Mars, what color do sunsets typically appear?', 'Different atmosphere composition scatters light differently — Mars sunsets are blue.', 'beginner', 1
FROM topics t WHERE t.slug = 'why-sky-blue' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'why-sky-blue' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Blue', true), ('Red', false), ('Green', false), ('Yellow', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'QR codes were originally invented for which industry?', 'Denso Wave created them for tracking auto parts in Japan.', 'beginner', 1
FROM topics t WHERE t.slug = 'what-is-qr-code' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'what-is-qr-code' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('Auto parts tracking', true), ('Retail checkout', false), ('Social media', false), ('Gaming', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'What creates the sound of thunder?', 'The shock wave from air rapidly expanding due to the lightning heat.', 'intermediate', 1
FROM topics t WHERE t.slug = 'lightning-hotter-than-sun' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'lightning-hotter-than-sun' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('The shock wave from rapidly expanding heated air', true), ('Clouds colliding', false), ('Rain hitting the ground', false), ('Wind', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

INSERT INTO quizzes (topic_id, quiz_type, question_text, explanation_text, difficulty_level, sort_order)
SELECT t.id, 'multiple_choice', 'Roughly how much honey does a single worker bee produce in its lifetime?', 'About one twelfth of a teaspoon.', 'beginner', 1
FROM topics t WHERE t.slug = 'how-bees-make-honey' AND NOT EXISTS (SELECT 1 FROM quizzes q WHERE q.topic_id = t.id AND q.sort_order = 1);
INSERT INTO quiz_options (quiz_id, option_text, is_correct) SELECT q.id, o.opt, o.ok FROM quizzes q JOIN topics t ON t.id = q.topic_id AND t.slug = 'how-bees-make-honey' AND q.sort_order = 1 CROSS JOIN (VALUES
  ('About one twelfth of a teaspoon', true), ('A full jar', false), ('One pound', false), ('None', false)) AS o(opt, ok)
WHERE NOT EXISTS (SELECT 1 FROM quiz_options x WHERE x.quiz_id = q.id);

-- -----------------------------------------------------------------------------
-- 4. TOPIC_FOLLOWUPS (for discovery / What's next)
-- -----------------------------------------------------------------------------

INSERT INTO topic_followups (topic_id, question_text, answer_text, sort_order)
SELECT t.id, 'What causes the different colors at sunrise vs sunset?', 'Similar scattering; the angle and path of light through the atmosphere shift the mix of colors you see.', 0
FROM topics t WHERE t.slug = 'why-sky-blue' AND NOT EXISTS (SELECT 1 FROM topic_followups f WHERE f.topic_id = t.id);

INSERT INTO topic_followups (topic_id, question_text, answer_text, sort_order)
SELECT t.id, 'What other ancient structures rival the pyramid''s age?', 'Stonehenge, parts of the Great Wall, and some Mesopotamian ruins — but the Great Pyramid remains one of the oldest intact wonders.', 0
FROM topics t WHERE t.slug = 'great-pyramid-age' AND NOT EXISTS (SELECT 1 FROM topic_followups f WHERE f.topic_id = t.id);

INSERT INTO topic_followups (topic_id, question_text, answer_text, sort_order)
SELECT t.id, 'Do plants have a sleep cycle?', 'Many plants show circadian rhythms — opening and closing leaves, varying photosynthesis — though it is not sleep in the animal sense.', 0
FROM topics t WHERE t.slug = 'do-trees-sleep' AND NOT EXISTS (SELECT 1 FROM topic_followups f WHERE f.topic_id = t.id);

INSERT INTO topic_followups (topic_id, question_text, answer_text, sort_order)
SELECT t.id, 'How are QR codes different from barcodes?', 'QR codes store data in 2D (both rows and columns), so they can hold far more information than a 1D barcode.', 0
FROM topics t WHERE t.slug = 'what-is-qr-code' AND NOT EXISTS (SELECT 1 FROM topic_followups f WHERE f.topic_id = t.id);

INSERT INTO topic_followups (topic_id, question_text, answer_text, sort_order)
SELECT t.id, 'What is the origin of "break a leg"?', 'Several theories exist: reverse psychology, bowing so deep you "break" the leg line, or a German phrase meaning good luck.', 0
FROM topics t WHERE t.slug = 'break-a-leg-theatre' AND NOT EXISTS (SELECT 1 FROM topic_followups f WHERE f.topic_id = t.id);

-- -----------------------------------------------------------------------------
-- 5. TOPIC_TRAILS (meaningful exploration chains)
-- -----------------------------------------------------------------------------

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Same scattering, different angle — see why sunsets flip the colors.', 0
FROM topics f, topics t WHERE f.slug = 'why-sky-blue' AND t.slug = 'why-sunset-red' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Refraction and reflection — how rainbows use the same light physics.', 1
FROM topics f, topics t WHERE f.slug = 'why-sky-blue' AND t.slug = 'how-rainbows-form' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'One mystery leads to another — rare glowing orbs during storms.', 0
FROM topics f, topics t WHERE f.slug = 'lightning-hotter-than-sun' AND t.slug = 'what-is-ball-lightning' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'QR codes evolved from barcodes — see the 1D origin.', 0
FROM topics f, topics t WHERE f.slug = 'what-is-qr-code' AND t.slug = 'how-barcodes-work' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'You know why it lasts — now discover how it is made.', 0
FROM topics f, topics t WHERE f.slug = 'honey-lasts-forever' AND t.slug = 'how-bees-make-honey' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Ancient engineering — from stone to concrete that strengthened over time.', 0
FROM topics f, topics t WHERE f.slug = 'great-pyramid-age' AND t.slug = 'roman-concrete-lasts' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Trees have rhythms — and they talk to each other through the soil.', 0
FROM topics f, topics t WHERE f.slug = 'do-trees-sleep' AND t.slug = 'how-trees-communicate' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'From lunar cycles to what happens to human bodies in microgravity.', 0
FROM topics f, topics t WHERE f.slug = 'dark-side-moon' AND t.slug = 'astronauts-grow-taller-space' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'From human-scale space effects to the edge of physics.', 0
FROM topics f, topics t WHERE f.slug = 'astronauts-grow-taller-space' AND t.slug = 'black-hole-event-horizon' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'The same scattering that makes sunsets red makes the daytime sky blue.', 0
FROM topics f, topics t WHERE f.slug = 'why-sunset-red' AND t.slug = 'why-sky-blue' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Water''s density quirk — why ice floats and life in cold climates is possible.', 0
FROM topics f, topics t WHERE f.slug = 'why-ice-floats' AND t.slug = 'why-sky-blue' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'Theatre idioms lead to words that resist translation.', 0
FROM topics f, topics t WHERE f.slug = 'break-a-leg-theatre' AND t.slug = 'untranslatable-words' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'From bits to bugs — a classic computing story.', 0
FROM topics f, topics t WHERE f.slug = 'why-computers-binary' AND t.slug = 'software-bug-origin' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);

INSERT INTO topic_trails (from_topic_id, to_topic_id, reason_text, sort_order)
SELECT f.id, t.id, 'GPS needs relativity to work — and so does understanding black holes.', 0
FROM topics f, topics t WHERE f.slug = 'how-gps-works' AND t.slug = 'black-hole-event-horizon' AND f.id != t.id
AND NOT EXISTS (SELECT 1 FROM topic_trails tr WHERE tr.from_topic_id = f.id AND tr.to_topic_id = t.id);
