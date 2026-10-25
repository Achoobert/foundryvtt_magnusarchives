/**
 * The 47 skills from The Magnus Archives Roleplaying Game, p16-17, plus the
 * three defense tasks that descriptors and types grant training in (for example
 * Fearless, p20, is "trained in Intellect defense"). The book lists those
 * separately from the skill table, but they are trained the same way.
 *
 * `pool` records the stat a skill most often draws on, so the Skill Item can
 * default its rolls; "choose" leaves it to the player.
 */
export const MAGNUS_SKILLS = [
  {name: "Astronomy", pool: "intellect", category: "knowledge", description: "You are well-versed in the study of the stars, planets, and cosmology in general."},
  {name: "Biology", pool: "intellect", category: "knowledge", description: "You have a deep working knowledge of living systems, including animals, plants, and insects."},
  {name: "Carpentry", pool: "intellect", category: "trade", description: "Your woodworking expertise allows you to craft a wide range of objects and structures, from furniture and cabinetry to home framing and related structural work."},
  {name: "Cooking", pool: "intellect", category: "trade", description: "You excel at preparing delicious meals of various cuisines and using a host of culinary techniques."},
  {name: "Deception", pool: "intellect", category: "social", description: "You are a capable liar, able to use speech and the written word to deceive and misinform others."},
  {name: "Discerning motive", pool: "intellect", category: "social", description: "You're practiced at ascertaining another character's lies, motives, and disposition."},
  {name: "Disguise", pool: "intellect", category: "general", description: "You're adept at disguising your identity with a false appearance using minimal accoutrements, usually with whatever's at hand."},
  {name: "Driving", pool: "speed", category: "general", description: "You can keep a car or truck on the road even under trying driving conditions."},
  {name: "Electrical repair", pool: "intellect", category: "trade", description: "You trained under an electrician and have at least a journeyman's technical knowledge (or more) of electrical systems, allowing you to install, repair, and maintain most modern technology that uses electricity."},
  {name: "Electronics", pool: "intellect", category: "trade", description: "You can design, build, troubleshoot, and repair electronic circuits and devices."},
  {name: "Endurance", pool: "might", category: "physical", description: "Regular training has improved your physical fitness, easing your climbing, jumping, and swimming tasks, plus similar feats that require sustained strength."},
  {name: "Engineering", pool: "intellect", category: "knowledge", description: "You can design, analyze, and create innovative solutions for complex problems, utilizing scientific principles and technological knowledge."},
  {name: "Equipment operation", pool: "intellect", category: "trade", description: "You're proficient in operating various heavy machinery used in construction projects, such as bulldozers, cranes, excavators, pavers, rollers, and more."},
  {name: "Forensics", pool: "intellect", category: "knowledge", description: "You know how to interpret physical evidence to work out what happened at a location, such as a crime scene, or what led to an object's current condition, such as a cause of death."},
  {name: "Geography", pool: "intellect", category: "knowledge", description: "You are well-versed in earthly landscapes, countries, human populations, and maps in general."},
  {name: "Geology", pool: "intellect", category: "knowledge", description: "You're knowledgeable about Earth's structure, composition, and processes, including earthquakes, volcanoes, and the formation of natural resources."},
  {name: "Gunsmithing", pool: "intellect", category: "trade", description: "You're proficient in crafting, repairing, and customizing firearms and ammunition."},
  {name: "Gymnastics", pool: "speed", category: "physical", description: "Regular training has improved your balance, easing tasks to avoid losing your footing and attempts to roll, dive, flip, or perform similar acrobatic movements."},
  {name: "Healing", pool: "intellect", category: "general", description: "You can attempt to diagnose physical illness, and you are skilled with healing tasks."},
  {name: "History", pool: "intellect", category: "knowledge", description: "You're well-versed in the study of past events, societies, and cultures."},
  {name: "Identifying", pool: "intellect", category: "general", description: "Your analytical mind lets you venture a guess regarding the origin of unfamiliar objects, texts, sounds, and so on."},
  {name: "Initiative", pool: "speed", category: "combat", description: "Your reactions are honed, easing your initiative tasks in combat.", initiative: true},
  {name: "Intimidation", pool: "intellect", category: "social", description: "You're good at swaying others with threatening words and/or fearsome presence."},
  {name: "Leatherworking", pool: "intellect", category: "trade", description: "You are adept at crafting a wide range of leather goods, including belts, bags, and clothing."},
  {name: "Lockpicking", pool: "speed", category: "general", description: "You are proficient at unlocking a locked mechanism without the key."},
  {name: "Mathematics", pool: "intellect", category: "knowledge", description: "You're a whiz with numbers, calculations, and pattern analysis."},
  {name: "Mechanics", pool: "intellect", category: "trade", description: "You can diagnose, repair, maintain, and (with the right tools and parts) build engines and various machines."},
  {name: "Medicine", pool: "intellect", category: "knowledge", description: "You're skilled in general medicine, a medical specialty, nursing, dentistry, optometry, audiology, or a similar practice."},
  {name: "Metalworking", pool: "intellect", category: "trade", description: "You can shape, weld, and otherwise use various metals to craft objects, from art and jewelry to mechanical parts and structural elements."},
  {name: "Occultism", pool: "intellect", category: "knowledge", description: "You study supernatural lore, including parapsychology, paranormal events, and the existence of secret organisations, and you have a working knowledge of tarot or a similar divining practice. It does not usually include knowledge of the Entities and their Avatars."},
  {name: "Perception", pool: "intellect", category: "general", description: "You have a better chance to notice what others miss when searching an area, listening closely, or using some other sense to discover what is hidden or not obvious."},
  {name: "Performance", pool: "intellect", category: "social", description: "You are skilled in some kind of performance or art: singing, comedy, playing an instrument, acting, composing, painting, or something else."},
  {name: "Persuasion", pool: "intellect", category: "social", description: "You're adept at winning people to your side of an argument through truthful reasoning, understanding, and kindness."},
  {name: "Philosophy", pool: "intellect", category: "knowledge", description: "You're conversant with critically analysing questions of existence, knowledge, ethics, and similar fundamental issues."},
  {name: "Physics", pool: "intellect", category: "knowledge", description: "You're knowledgeable about the scientifically derived laws of the physical world."},
  {name: "Pickpocketing", pool: "speed", category: "general", description: "You're skilled at separating a target from their wallet, phone, or other easily concealed valuables, and with sleight-of-hand tricks."},
  {name: "Piloting", pool: "speed", category: "general", description: "You're skilled in piloting planes, boats, or submersibles."},
  {name: "Plumbing", pool: "intellect", category: "trade", description: "You can install, maintain, and repair pipes, fixtures, and appliances that use water."},
  {name: "Programming", pool: "intellect", category: "knowledge", description: "You can code computers and computer architectures, writing applications, developing new systems, and trying to infiltrate protected digital systems."},
  {name: "Psychology", pool: "intellect", category: "knowledge", description: "You're conversant with the study of human behaviour and the therapies developed to address mental health."},
  {name: "Publishing", pool: "intellect", category: "trade", description: "You're skilled with some aspect of publishing: writing, editing, copywriting, proofing, marketing, or something else."},
  {name: "Religion", pool: "intellect", category: "knowledge", description: "You're a pastor or religious leader in a particular faith, and/or knowledgeable about the study of religious beliefs, practices, and traditions."},
  {name: "Researching", pool: "intellect", category: "general", description: "You're skilled at gathering information from databases and physical archives, or by hitting the pavement and asking around. Every form of research takes at least a few hours."},
  {name: "Riding", pool: "speed", category: "general", description: "You're skilled at riding a horse, camel, or similar mount, or alternatively a motorcycle or bicycle."},
  {name: "Sewing", pool: "intellect", category: "trade", description: "You're skilled in creating or repairing clothing, or anything else made out of cloth."},
  {name: "Stealth", pool: "speed", category: "general", description: "You're adept at sneaking and hiding, staying out of sight, and keeping any noise of your presence to a minimum."},
  {name: "Might defense", pool: "might", category: "defense", description: "You are practiced at shrugging off what would batter, poison, or exhaust a less hardy person."},
  {name: "Speed defense", pool: "speed", category: "defense", description: "You are practiced at dodging what comes at you, whether a swung fist, a thrown object, or a collapsing floor."},
  {name: "Intellect defense", pool: "intellect", category: "defense", description: "You are practiced at holding your nerve against fear, deceit, and anything that reaches for your mind."},
  {name: "Tracking", pool: "intellect", category: "general", description: "You know how to track a target through natural landscapes and urban environments."}
];
