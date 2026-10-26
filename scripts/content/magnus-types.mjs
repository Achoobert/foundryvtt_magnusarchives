/**
 * The four character types from The Magnus Archives Roleplaying Game,
 * chapter 3 (p27-57): Investigator, Protector, Elocutionist and Occultist.
 *
 * `summary` and every ability `text` are short original paraphrases, not the
 * book's prose — the flavour text stays in the book, and `page` points at it.
 * The mechanics are reproduced faithfully:
 *   pools        the type's starting Pool values (before the 6 free points)
 *   edges        the type's first-tier Edge in each Pool
 *   weapons      weapon categories practiced without penalty
 *   cyphers      cypher limit by tier
 *   skills       first-tier skills: `trained` outright, `choose` from `options`
 *   tier1        the first-tier ability list the player picks two from
 *   tiers        tier 2-6 ability lists (pick two per tier, or from a lower tier)
 *
 * An ability's `cost` is "<amount>[+] <Pool>[|<Pool>]"; `stress` is the Stress
 * the user gains for using it. `supernatural` marks the abilities the book
 * flags with the eye icon: they need 10 levels of supernatural Stress (p27),
 * except for an Occultist with Already Tainted. `inflicts` is Stress dealt to a
 * PC target (NPCs take the same number as damage, or the noted amount).
 */

const ab = (name, page, cost, activation, text, extra = {}) => ({name, page, cost, activation, text, ...extra});
const sup = {supernatural: true};

const SKILL_WITH_DEFENSE = "Pick one type of defense task (Might, Speed or Intellect) you aren't trained in. You become trained in it.";
const SKILL_WITH_ATTACKS = "Pick one attack type you aren't trained in: light, medium or heavy, and bashing, bladed or ranged (for example medium bladed). You become trained in attacks of that type. You can take this more than once, picking a different type each time.";
const MASTERY_WITH_ATTACKS = "Pick one attack type you're already trained in (light, medium or heavy; bashing, bladed or ranged). You become specialized in it. If you aren't trained in an attack, take Skill With Attacks first.";
const MASTERY_WITH_DEFENSE = "Pick one defense task type you're trained in (Might, Speed or Intellect) and become specialized in it. You can take this up to three times, once per defense type.";
const HEIGHTENED_SKILLS = "You become trained in two tasks of your choice other than attacks or defense. A task you're already trained in becomes specialized instead; you can't pick one you're already specialized in.";
const SEEN_SOME_STUFF = "Stress you take from mental shock or despair is reduced by 1. Stress from physical injury is unchanged.";
const SCARRED_AND_HARDENED = "Stress you take from physical injury is reduced by 1. Stress from mental shock or despair is unchanged.";
const SHRUG_IT_OFF = "Your first Stress level imposes no penalties.";
const QUICK_RECOVERY = "Your ten-minute recovery roll takes only one action.";
const THINK_YOUR_WAY_OUT = "On any noncombat action, you can spend Intellect points in place of Might or Speed points.";
const SURVEILLANCE = "Tasks to monitor, watch or tail a person or place are eased, including setting up cameras, microphones and similar gear.";
const LOOK_FOR_THE_TELL = "After talking with someone for at least a minute, you can tell when they lie for the next minute.";
const COLD_READING = "After talking with someone for at least five minutes, ask the GM one question about them and get an answer, or instead ease all your interaction tasks with them for 24 hours. Once per person per 24 hours. Action to initiate; five minutes to complete.";
const UNDERSTANDING = "You observe or study a creature or object. Your next interaction with it gains an asset.";
const KNOWLEDGE_SKILLS = "You become trained in two areas of knowledge you aren't already trained in, such as history, geography or psychology. You can take this more than once, picking two different skills each time.";

export const MAGNUS_TYPES = [
  {
    name: "Investigator",
    page: "28",
    summary: "You haunt libraries and record offices as readily as abandoned houses, and you would always rather know the truth. Investigators are the core of most Magnus groups: researchers, private eyes and archivists who find clues and piece them together.",
    pools: {might: 10, speed: 9, intellect: 9},
    edges: {might: 0, speed: 1, intellect: 1},
    edgeGrantPool: "intellect",
    weapons: ["light", "medium"],
    heavyInability: true,
    cyphers: {1: 2, 3: 3, 5: 4},
    skills: {
      choose: 2,
      options: ["Discerning motive", "Forensics", "Intimidation", "Perception", "Persuasion", "Researching", "Tracking"],
      label: "Investigative Skills"
    },
    abilityLabel: "Investigative Abilities",
    tier1: [
      ab("Careful Observation", "29", "1 Intellect", "action", "Spend a minute studying your surroundings. On a difficulty 4 perception task you spot one overlooked inanimate detail within immediate distance that bears on your investigation, or learn there is none. Each further detail needs the next difficulty up (5, 6 and so on), all from the one roll."),
      ab("Decipher", "29", "1 Intellect", "action", "Spend a minute on writing or code in a language you don't know and make an Intellect roll (usually difficulty 3, higher for complex languages or codes) to get the gist. Action to initiate; one minute to complete."),
      ab("Fleet of Foot", "29", "1+ Speed", "enabler", "You can move a short distance as part of another action, or a long distance as your whole action. If you apply a level of Effort, you can move a long distance and make a hindered attack as your whole action."),
      ab("Follow the Trail", "29", "", "enabler", "When you apply Effort to a perception or tracking task to find a specific person or place, you get one free level of Effort."),
      ab("Knowledge Skills", "29", "", "enabler", KNOWLEDGE_SKILLS),
      ab("Missing Detail", "29", "2 Intellect", "enabler", "When you hear or read a substantial account, such as an eyewitness story or a statement, you notice something left unsaid or implied. The GM gives you that brief fact as a hint."),
      ab("Operate in the Dark", "30", "1 Intellect", "action", "For the next hour your other senses make up for missing sight: being blind or in darkness doesn't hinder you. Action to initiate."),
      ab("Ready for Danger", "30", "", "enabler", "You're trained in initiative."),
      ab("Surging Confidence", "30", "1 Might", "enabler", "You can use your one-action recovery roll as part of another action.")
    ],
    tiers: {
      2: [
        ab("Escape", "30", "2 Speed", "action", "You slip restraints, squeeze between bars, break a grip, pull free of quicksand, or otherwise get loose from whatever holds you."),
        ab("Eye for Detail", "30", "2 Intellect", "action", "After at least five minutes exploring an area up to a short distance across, ask the GM one question about it and get an answer. Once per area per 24 hours. Action to initiate; five minutes to complete."),
        ab("Hand to Eye", "30", "2 Speed", "action", "For one minute you gain an asset on tasks of manual dexterity, such as pickpocketing, lockpicking or games of agility. Action to initiate."),
        ab("Just a Hunch", "31", "2 Intellect", "action", "When you're stuck on an urgent problem, the GM gives you a small clue or a course of action. You can't use this again until after your next ten-hour recovery roll, and only once you've followed up your last hunch."),
        ab("Research", "31", "2 Intellect", "enabler", "With at least two hours and a suitable source (the internet, a library, the archives, a good book), ask the GM one question on a topic and get an answer fitting what that source would hold."),
        ab("Skill With Defense", "31", "", "enabler", SKILL_WITH_DEFENSE),
        ab("Skim", "31", "2 Intellect", "action", "In one minute you get the gist of a book, database, diary, ledger or similar source. On a difficulty 4 Intellect task you also learn one prominent or surprising fact you didn't know. Action to initiate; one minute to complete."),
        ab("Surveillance", "31", "", "enabler", SURVEILLANCE),
        ab("Travel Skills", "31", "", "enabler", "You become trained in two of: driving, endurance, geography, piloting or riding. You can take this more than once, picking two different skills each time.")
      ],
      3: [
        ab("Interaction Skills", "31", "", "enabler", "You become trained in two of: deception, discerning motive, intimidation or persuasion. You can take this more than once, picking two different skills each time."),
        ab("Quick Recovery", "31", "", "enabler", QUICK_RECOVERY),
        ab("Scarred and Hardened", "31", "", "enabler", SCARRED_AND_HARDENED),
        ab("Seen Some . . . Stuff", "31", "", "enabler", SEEN_SOME_STUFF),
        ab("Skill With Attacks", "32", "", "enabler", SKILL_WITH_ATTACKS),
        ab("Think Your Way Out", "32", "", "enabler", THINK_YOUR_WAY_OUT),
        ab("Trapfinder", "32", "3+ Intellect", "action", "Instead of rolling, you find any traps or mechanical triggers that could threaten you, without setting them off. This automatically finds traps of level 4 or lower; each level of Effort raises that limit by 2."),
        ab("Unnatural Dream", "32", "3 Intellect", "action", "When you next sleep, you dream about a situation you currently face (you don't pick the subject). The GM gives you insight you probably couldn't learn by normal means.", {stress: 3, ...sup})
      ],
      4: [
        ab("Credible Hypothesis", "32", "4 Intellect", "action", "You examine an immediate area (roughly a room) for precise, useful details about its past. Ask the GM up to four questions, each needing its own roll (default difficulty 4)."),
        ab("Heightened Skills", "32", "", "enabler", HEIGHTENED_SKILLS),
        ab("Look for the Tell", "32", "4 Intellect", "action", `${LOOK_FOR_THE_TELL} Action to initiate.`),
        ab("Perfect Tracker", "32", "", "enabler", "Once you find a set of tracks, you follow them without error unless conditions make it impossible (heavy rain, total darkness and so on)."),
        ab("Subtle Steps", "32", "", "enabler", "When you move no more than a short distance, you make no sound, whatever the surface."),
        ab("Take Their Measure", "32", "3 Intellect", "action", "You learn the level of every creature you can see, and any special weakness they have (such as vulnerability to fire)."),
        ab("Versatile Mind", "32", "", "enabler", "On Speed defense rolls, you can spend Intellect points instead of Speed points."),
        ab("Supernatural Senses", "33", "4 Intellect", "action", "While exploring, you stretch your senses up to 1 mile (1.6 km) in any direction and ask the GM a simple, usually yes-or-no question about that area. If the answer isn't there, you learn nothing.", {stress: 3, ...sup})
      ],
      5: [
        ab("Hard to Kill", "33", "", "enabler", "You can reroll any defense task, but no more than once per round."),
        ab("Mastery With Defense", "33", "", "enabler", MASTERY_WITH_DEFENSE),
        ab("Seize the Moment", "33", "4+ Speed", "enabler", "When you succeed on a Speed defense roll against an attack, you gain an action you can take immediately, even if you've already acted this round. You lose your action next round unless you applied a level of Effort to this ability."),
        ab("Shrug It Off", "34", "", "enabler", SHRUG_IT_OFF),
        ab("Vigilant", "34", "5 Might", "enabler", "You're unaffected by any attack or effect that would daze or stun you or make you lose your next action."),
        ab("See the Past", "34", "5 Intellect", "action", "Touch an object and ask the GM a question about its past; you get a general answer, often as brief images or sensations. The GM sets the question's level: something findable elsewhere is level 1, obscure history level 7. Afterward you have an asset on identifying the object.", {stress: 3, ...sup})
      ],
      6: [
        ab("Advanced Research", "34", "6 Intellect", "action", "By luck, hunch or preparation, you've already researched the topic in front of you, and know what a full week with a suitable source would have taught you."),
        ab("General Knowledge", "34", "", "enabler", "All tasks of knowledge, research, observation or assessment are eased."),
        ab("Impossible Clue", "34", "6 Intellect", "action", "Focus for one action on an immediate area or one person and learn, with no roll, a fact about them you seemingly couldn't know. The GM gives the always-correct conclusion; you and the GM can then invent the clue that led to it, or skip it."),
        ab("Mastery With Attacks", "35", "", "enabler", MASTERY_WITH_ATTACKS),
        ab("See the Future", "35", "6 Intellect", "enabler", "You read the variables around you and predict the next few minutes. For ten minutes your defense rolls gain an asset; you gain an asset to see through deception and betrayal and to avoid traps and ambushes; and you gain an asset on interaction and deception tasks because you know what people will say.", {stress: 3, ...sup})
      ]
    }
  },
  {
    name: "Protector",
    page: "36",
    summary: "Someone has to shine a light into the dark, and someone has to watch their back. Protectors are physical, action-minded people (soldiers, guards, police, mercenaries) who take and deal the most punishment and shield the rest of the group.",
    pools: {might: 10, speed: 10, intellect: 8},
    edges: {might: 1, speed: 1, intellect: 0},
    edgeGrantPool: "might",
    weapons: ["light", "medium", "heavy"],
    heavyInability: false,
    cyphers: {1: 2, 3: 3, 5: 4},
    skills: {
      choose: 1,
      options: ["Discerning motive", "Forensics", "Intimidation", "Perception", "Stealth", "Tracking"],
      label: "Protector Knowledge"
    },
    abilityLabel: "Protective Abilities",
    tier1: [
      ab("Combat Prowess", "37", "", "enabler", "Pick melee or ranged attacks: they deal 1 additional point of damage. You can take this twice, once for each."),
      ab("No Need for Weapons", "37", "", "enabler", "Your unarmed attacks (punches, kicks and the like) deal 2 additional points of damage."),
      ab("One Against Many", "37", "1+ Speed", "action", "Attack the highest-level foe in a group or swarm. If you hit, instead of dealing damage, every foe within immediate distance either moves within an immediate area as you direct, or can't enter an immediate space you pick (to shield allies who stay put, not yourself). Affects level 1 foes; each extra Speed point raises the level affected by 1, and you must cover the highest-level foe."),
      ab("Other Knowledge", "37", "", "enabler", "You become trained in one non-physical skill of your choice that you aren't already trained in."),
      ab("Overwatch", "37", "1 Intellect", "action", "Cover a limited area (a doorway, a hallway) with a ranged weapon and attack the next viable target to enter it, just before they act. The target gets no benefit from cover, position, range or visibility, and the attack deals 1 additional point of damage. You can stay on overwatch as long as is reasonable."),
      ab("Physical Skills", "37", "", "enabler", "You become trained in endurance or gymnastics. This doesn't improve a skill you're already trained in."),
      ab("Protector", "37", "", "enabler", "Name one character as your charge (you can change it each round, one at a time). While they're within immediate range, they gain an asset on Speed defense tasks."),
      ab("Slow Them Down", "37", "1 Might|Speed", "action", "A pummelling melee attack or covering-fire ranged attack that deals 1 less point of damage but dazes the target for a round: their tasks are hindered and they move at half speed."),
      ab("Take the Hit", "37", "2 Might", "enabler", "When someone you could touch is struck and would take damage, you take the hit instead. They suffer nothing, and you gain 3 points of Stress whatever the original damage.")
    ],
    tiers: {
      2: [
        ab("Bodyguard", "38", "", "enabler", "An ally standing next to you has their initiative tasks eased."),
        ab("Coping With the Impossible", "38", "2 Intellect", "action", "Facing something supernatural that is hard or impossible to harm normally, you improvise with the environment or situation. On a successful Intellect-based task, the target loses its next turn. Later attempts on the same target are hindered."),
        ab("Intimidating Demeanor", "38", "", "enabler", "You gain an asset to intimidate someone who can see you while you show a threat of violence."),
        ab("Quick Recovery", "38", "", "enabler", QUICK_RECOVERY),
        ab("Scarred and Hardened", "38", "", "enabler", SCARRED_AND_HARDENED),
        ab("Skill With Attacks", "38", "", "enabler", SKILL_WITH_ATTACKS),
        ab("Skill With Defense", "38", "", "enabler", SKILL_WITH_DEFENSE),
        ab("Stand Watch", "38", "2 Might", "action", "While standing watch (mostly staying put for a long time) you stay awake and alert for up to eight hours, and are trained in perception and in stealth to stay hidden from anyone approaching. Action to initiate."),
        ab("Support the Team", "39", "2 Might", "enabler", "While you stand watch and do nothing else, allies within short distance gain an asset on perception tasks.")
      ],
      3: [
        ab("Combat Medic", "39", "", "action", "You're trained in healing. If a person reaches the dead step of the damage track and you reach them within one round, your action keeps them from dying. They stay debilitated, likely unconscious, and need lengthy medical care to recover."),
        ab("Deadly Aim", "39", "3 Speed", "action", "For the next minute your ranged attacks deal 2 additional points of damage. Action to initiate."),
        ab("Lunge", "39", "2 Might", "action", "A hindered, overextended stab or smash. If it hits, it deals 4 additional points of damage."),
        ab("Reaction", "39", "", "enabler", "If a creature you hit in melee last turn uses its action to move out of immediate range, you gain an action to attack it as it goes, even if you've already acted this round."),
        ab("Seen Some . . . Stuff", "39", "", "enabler", SEEN_SOME_STUFF),
        ab("Spray", "39", "2 Speed", "action", "With a rapid-fire weapon, spray shots to improve your chance to hit. Uses 1d6 + 1 rounds of ammo (or all that's left). A hit deals 1 less point of damage. Also works with several thrown weapons you carry or can reach."),
        ab("Tactical Plan", "39", "3 Intellect", "action", "Spend an hour planning a visit to a place you can study through records or anecdotes. On that visit, you and up to five allies you brief get three of these benefits (your choice): first initiative roll eased; first point of Stress ignored; first perception roll eased; first interaction roll eased; first defense roll eased; any task to flee or escape the location eased. Action to initiate; one hour to devise."),
        ab("Tough", "39", "", "enabler", "You gain an extra step on the damage track, hurt, between hale and impaired. Being hurt has no other effect; it's just bruises."),
        ab("Vigilance", "40", "2 Intellect", "action", "You fight defensively: Speed defense rolls gain an asset and your attacks are hindered. Lasts as long as you like, ending when no combat is within range of your senses. Action to initiate."),
        ab("Impossible Strength", "40", "3 Might", "action", "For one minute you have inhuman strength: an asset on noncombat tasks needing physical strength, +2 Might Edge, and melee attacks deal 4 additional points of damage. Action to initiate.", {stress: 3, ...sup})
      ],
      4: [
        ab("Amazing Effort", "40", "", "enabler", "Pick Might Effort or Speed Effort. When you apply at least one level of that Effort to a noncombat task, you get a free level of Effort on it."),
        ab("Bury the Bodies", "40", "", "enabler", "You gain an asset on covering up a crime scene, violence, a break-in or the like, including talking to the authorities about it."),
        ab("Capable Fighter", "40", "", "enabler", "Your attacks deal 1 additional point of damage."),
        ab("Expert Bodyguard", "40", "", "enabler", "Once per turn, pick an ally next to you: their defense tasks are eased."),
        ab("Free From Danger", "40", "4 Might", "action", "As your whole action, grab up to two allies (conscious or not, even if held fast) and move them a short distance. For the rest of the round, you and they have an asset on defense rolls."),
        ab("Momentum", "40", "", "enabler", "If you use an action to move, your next melee attack before the end of the next round deals 2 additional points of damage."),
        ab("Size Them Up", "40", "3 Intellect", "action", "Study a creature you can see for one action. For 24 hours your attacks against it and your defense rolls against its attacks are eased."),
        ab("Snipe", "40", "2 Speed", "action", "Spend one action aiming; next round you make a precise ranged attack with an asset that deals 4 additional points of damage if it hits."),
        ab("Touch the Untouchable", "40", "4 Might", "action", "For one minute you can physically interact with something that normally can't be touched, or not safely, like an intangible ghost or molten magma. Action to initiate.", {stress: 3, ...sup})
      ],
      5: [
        ab("Arc Spray", "41", "3 Speed", "action", "With a rapid-fire weapon, fire at up to three adjacent targets at once, making a separate hindered attack roll against each."),
        ab("Got Your Back", "41", "4 Speed", "enabler", "When an ally within immediate distance fails a physical task (attacks and defense rolls included), they can reroll. If the reroll also fails, you gain 1 point of Stress."),
        ab("Improved Success", "41", "", "enabler", "On an attack roll of 17 or higher that deals damage, you deal 1 additional point. A natural 20 used for damage instead of a major effect deals 5 extra points rather than 4."),
        ab("Mastery With Attacks", "41", "", "enabler", MASTERY_WITH_ATTACKS),
        ab("Mastery With Defense", "41", "", "enabler", MASTERY_WITH_DEFENSE),
        ab("Parry", "41", "5 Speed", "enabler", "For the next ten rounds, all your Speed defense rolls are eased."),
        ab("Shrug It Off", "41", "", "enabler", SHRUG_IT_OFF),
        ab("Savagery", "41", "5 Might", "action", "You become a savage, inhuman beast for an hour: +8 Might Pool, +2 Might Edge, +4 Speed Pool, +2 Speed Edge. You can spend Intellect only to try to change back early (difficulty 2), and you attack every living creature within short range. Afterward you have -1 to all rolls for an hour, or -2 for 24 hours if you didn't kill and eat a substantial creature. Eating an intelligent creature gives you 3 points of Stress. Action to change or change back.", {stress: 3, ...sup})
      ],
      6: [
        ab("Again and Again", "41", "8 Speed", "enabler", "You can take an additional action in a round in which you have already acted."),
        ab("Beacon of Hope", "41", "", "enabler", "When you make a successful attack roll, one ally within short distance who can see you has their next task eased."),
        ab("Fight On", "41", "", "enabler", "You ignore the normal penalties for being impaired. When debilitated, you can still act, but all your tasks are hindered."),
        ab("Finishing Blow", "42", "5 Might", "enabler", "If your foe is prone, stunned, helpless or incapacitated when you hit, you deal 7 additional points of damage."),
        ab("Spin Attack", "42", "5+ Speed", "action", "Stand still and attack up to five foes in one action, all with the same kind of attack (melee or ranged), rolling separately for each. Effort is still limited for the action, and modifiers apply to every attack. Each level of Effort can instead add one more foe."),
        ab("Self-Sacrifice", "42", "6 Might", "action", "You do nothing but stand and defend for one round. Every foe within long range attacks you instead of your allies, no roll needed. That round you ignore minor injuries (Stress other than this ability's cost) and the first serious injury you take.", {stress: 5, ...sup})
      ]
    }
  },
  {
    name: "Elocutionist",
    page: "43",
    summary: "Getting people to talk about the strange things that happened to them is half the job, and you're good at it. Elocutionists are charming, perceptive spokespeople and fast talkers who read what goes unsaid, invent cover stories and keep their allies' spirits up.",
    pools: {might: 8, speed: 9, intellect: 11},
    edges: {might: 0, speed: 0, intellect: 1},
    edgeGrantPool: "intellect",
    weapons: ["light", "medium"],
    heavyInability: true,
    cyphers: {1: 2, 3: 3, 5: 4},
    skills: {
      choose: 2,
      options: ["Deception", "Discerning motive", "Intimidation", "Persuasion", "Performance"],
      label: "People Skills"
    },
    abilityLabel: "Locution Abilities",
    tier1: [
      ab("Connected", "45", "", "enabler", "You know people who get things done, from respected authorities to hackers and street criminals. They aren't necessarily friends or trustworthy, but they owe you a favor. Work out the details with the GM."),
      ab("De-Stress", "45", "1 Intellect", "enabler", "When you rest or relax with allies for an hour, you and they each lose 1 more point of Stress than normal."),
      ab("Encouragement", "45", "1 Intellect", "action", "While you keep up an inspiring speech, allies within short range ease one task type you choose: defense, attacks, or tasks for any skill you're trained or specialized in."),
      ab("Enthrall", "45", "1 Intellect", "action", "Your talk holds another creature's attention even if it can't understand you. As long as you do nothing but speak (not even move), it takes no actions except to defend itself, even across several rounds. Attacking it ends the effect."),
      ab("Inner Defense", "45", "", "enabler", "You're trained in resisting attempts to discern your feelings, beliefs or plans, and in resisting torture, telepathic intrusion and mind control."),
      ab("Knowledge Skills", "45", "", "enabler", KNOWLEDGE_SKILLS),
      ab("Secret Agendas", "45", "1 Intellect", "enabler", "After talking with at least two NPCs for a minute, you pick up one of two things (your choice): how they really feel about each other, or (with three or more) which of them is the odd one out. You might sense, for example, that one of a group secretly serves The Web, though not the details."),
      ab("Understanding", "45", "1 Intellect", "action", UNDERSTANDING),
      ab("Verbal Disguise", "45", "1 Intellect", "enabler", "Mimic the voice and speech of someone you've heard to make one significant statement; each further important statement costs 1 more Intellect point. Anyone who sees you isn't fooled, so it suits phones, darkness or a heavy disguise. It doesn't make you more persuasive. If the GM rules the speaker would never say something, you fail at once, and if you said several things, the listener knows none came from them.")
    ],
    tiers: {
      2: [
        ab("Agitate", "46", "2 Intellect", "action", "Shout at a target you can see who can easily hear you. On a successful Intellect-based roll, they move an immediate distance in any direction you choose, startled or fooled by a fake warning."),
        ab("Cold Reading", "46", "2 Intellect", "action", COLD_READING),
        ab("Defuse", "46", "1 Intellect", "action", "With evasion, distraction or calming words, you stop a person from attacking anyone or anything for one round, and your next interaction with them is eased."),
        ab("Disincentivize", "46", "1 Intellect", "action", "Demoralizing words hinder all actions for one round by any number of targets you choose within short range who can understand you."),
        ab("Gather Intelligence", "46", "2 Intellect", "action", "Ask around a large group of people about a topic and come away with useful information: an answer to a specific question, or general facts plus a working knowledge of the area's layout, its major sites and perhaps obscure details. Action to initiate; about an hour to complete."),
        ab("Inspire Aggression", "46", "2 Intellect", "action", "Your words unlock the primitive instincts of a character within short range who understands you. They gain an asset on Might-based attack rolls for one minute."),
        ab("Inspiring Ease", "46", "", "enabler", "Through stories, songs or other entertainment, friends who've spent 24 hours with you can each ease one task of their choice once per day. It lasts while you're in their company, pauses if you leave, resumes if you return within 24 hours, and otherwise needs another 24 hours together."),
        ab("Quick Wits", "46", "", "enabler", "When a task would cost Intellect points, you can spend Speed points instead."),
        ab("Skill With Defense", "46", "", "enabler", SKILL_WITH_DEFENSE)
      ],
      3: [
        ab("Blend In", "47", "4 Intellect", "action", "For a minute, creatures see you but attach no importance to you; you're specialized in stealth and Speed defense. Attacking, using an ability, moving something large and the like ends it, but an action spent seeming innocuous resumes the remaining time. Action to initiate or reinitiate."),
        ab("Communication", "47", "2 Intellect", "action", "You convey a basic concept to a creature that can't normally speak or understand speech, and it can give you a very basic answer to a simple question."),
        ab("Grand Deception", "47", "3 Intellect", "action", "You convince an intelligent, non-hostile creature that understands you of something wildly and obviously untrue."),
        ab("Mind Games", "47", "3 Intellect", "action", "Lies, mockery or vile language against a foe who understands you. If successful, it's stunned and can't act for one round, then dazed the next round with its tasks hindered."),
        ab("Oratory", "47", "4 Intellect", "action", "You convince a non-hostile group of intelligent creatures that understands you to take one reasonable action next round, one that doesn't put them or their allies in obvious danger or go wildly against their nature."),
        ab("Seen Some . . . Stuff", "47", "", "enabler", SEEN_SOME_STUFF),
        ab("Slip of the Tongue", "47", "3 Intellect", "action", "Verbal trickery gets an NPC to reveal an important piece of information they were hiding. You can steer the topic, but the GM decides what they actually say."),
        ab("Surveillance", "47", "", "enabler", SURVEILLANCE),
        ab("Irresistible Question", "47", "3 Intellect", "enabler", "Ask one creature within short distance a question. On a successful Intellect roll, it must answer as truthfully and completely as it can.", {stress: 3, ...sup})
      ],
      4: [
        ab("Anticipate Attack", "47", "4 Intellect", "action", "You sense when and how attackers will strike: your Speed defense rolls are eased for one minute."),
        ab("Cover Story", "48", "4 Intellect", "action", "After studying a group, organization or person for at least five minutes, you craft an elaborate lie they're very likely to believe. Anyone using the cover story has deception, persuasion, disguise and similar related tasks eased until it's irrefutably disproved. Action to initiate."),
        ab("Heightened Skills", "48", "", "enabler", HEIGHTENED_SKILLS),
        ab("Look for the Tell", "48", "4 Intellect", "action", `${LOOK_FOR_THE_TELL} Action to initiate.`),
        ab("Scarred and Hardened", "48", "", "enabler", SCARRED_AND_HARDENED),
        ab("Skill With Attacks", "48", "", "enabler", SKILL_WITH_ATTACKS),
        ab("Spur Effort", "48", "5 Intellect", "enabler", "Pick an ally within immediate range. If they apply Effort to a task on their next turn, they get a free level of Effort on it."),
        ab("Stress", "48", "5 Intellect", "action", "Insidious, terrifying words deal 3 points of Stress (4 points of damage to NPCs) to up to five people you choose within short range who can hear and understand you. Make a separate attack roll against each.", {inflicts: 3, npcDamage: 4, roll: "attack"}),
        ab("Understanding Why", "48", "4 Intellect", "action", "If you succeed at a discerning motive task, you grasp a person's motives and the root causes of their behavior: general insight rather than details."),
        ab("Terrorize", "48", "4 Might", "action", "A creature within short distance who understands you suffers 3 points of Stress (4 points of damage to an NPC) and spends its next action fleeing you as fast as it can. It won't approach you for an hour unless threatened.", {stress: 3, inflicts: 3, npcDamage: 4, ...sup})
      ],
      5: [
        ab("Performance", "48", "4 Intellect", "action", "For an hour your voice is a perfect instrument: any tone, range or accent, even flawless imitation of anyone. Listeners are impressed and well disposed, and for 24 hours you gain an asset on interaction tasks with them. Action to initiate."),
        ab("Shrug It Off", "49", "", "enabler", SHRUG_IT_OFF),
        ab("Soft Speech", "49", "5 Intellect", "enabler", "After one minute of conversation, someone treats you as a trusted confidant, and you need no further rolls to get them to tell you anything."),
        ab("Stimulate", "49", "6 Intellect", "action", "Your words encourage a creature you touch who understands you: its next action is eased by three steps."),
        ab("Think Your Way Out", "49", "", "enabler", THINK_YOUR_WAY_OUT),
        ab("Control", "49", "5 Intellect", "action", "You control the actions of a creature within short distance who understands you, for ten minutes or until it leaves range. Making it do something it never normally would needs another roll to keep control.", {stress: 3, ...sup})
      ],
      6: [
        ab("Inspiring Success", "50", "6 Intellect", "enabler", "When you learn this, choose Might, Speed or Intellect tasks with your group. When you apply Effort to a task of that stat and succeed, pick another character within short range: on their next turn they have an asset on their next task using that stat."),
        ab("Mastery With Defense", "50", "", "enabler", MASTERY_WITH_DEFENSE),
        ab("Soothing Words", "50", "6 Intellect", "action", "A creature you speak with for at least ten minutes loses all its accumulated Stress. Action to initiate."),
        ab("True Communication", "50", "6 Intellect", "action", "You form an uncanny, permanent bond with one person or creature: you understand each other without a shared language, even through a single sense (seeing but not hearing, or the reverse). One bond at a time."),
        ab("Condemn", "50", "6 Intellect", "action", "Drawing on dark forces, you tell someone something horrifying about themselves (true or not) that they come to believe deeply. They lose their next action, and all their actions afterward are hindered by two steps. Most flee if they can.", {stress: 3, ...sup})
      ]
    }
  },
  {
    name: "Occultist",
    page: "51",
    summary: "The things you were told to leave alone have always called to you. Occultists are well-read, brooding people steeped in dark lore, often the first to recognise what the group is facing and the most likely to develop real paranormal powers.",
    pools: {might: 7, speed: 9, intellect: 12},
    edges: {might: 0, speed: 0, intellect: 1},
    edgeGrantPool: "intellect",
    weapons: ["light", "medium"],
    heavyInability: true,
    cyphers: {1: 3, 3: 4, 5: 5},
    skills: {
      trained: ["Occultism"],
      choose: 1,
      options: "knowledge",
      extraOptions: ["Researching"],
      exclude: ["Occultism"],
      label: "Knowledge Skills"
    },
    abilityLabel: "Occult Abilities",
    tier1: [
      ab("Already Tainted", "52", "", "enabler", "You start the game able to choose supernatural abilities, without first gaining 10 levels of supernatural Stress. Check with the GM that this suits the campaign."),
      ab("Artefact Affinity", "52", "", "enabler", "Tasks to identify or use an artefact are eased."),
      ab("Esoteric Skills", "52", "", "enabler", "You become trained in two of: biology, history, identifying, philosophy, physics, publishing, religion or researching."),
      ab("Intuition", "52", "2 Intellect", "enabler", "The GM, not you, decides when this triggers: you spend the points and get a weird feeling that something is wrong, with a clue to what. It should be an occasional surprise, not something to rely on, and it fails if you can't pay."),
      ab("Sensitive", "53", "1 Intellect", "action", "For ten minutes, tasks to perceive abnormal presences or influences, even ones people and animals normally can't sense, are eased. Action to initiate."),
      ab("Slightly Sinister Skills", "53", "", "enabler", "You become trained in two of: deception, disguise, intimidation, pickpocketing or stealth. You can take this more than once, picking two different skills each time."),
      ab("Supernatural Comprehension", "53", "2 Intellect", "action", "With about a minute of study, you identify the parameters of an unnatural effect within immediate distance, such as a curse, a spell or the presence of something inhuman. Action to initiate."),
      ab("Understanding", "53", "1 Intellect", "action", UNDERSTANDING),
      ab("Ventriloquism", "53", "1 Intellect", "action", "For one round your voice seems to come from anywhere you choose within immediate distance."),
      ab("Mesmerism", "53", "1 Intellect", "action", "You transfix a person within immediate distance. They lose their next action and notice nothing that round unless attacked or shaken out of it; the following round they're disoriented and their actions are hindered.", {stress: 1, ...sup})
    ],
    tiers: {
      2: [
        ab("Cold Reading", "53", "2 Intellect", "action", COLD_READING),
        ab("Hoax", "53", "2 Intellect", "action", "With at least ten minutes' preparation and common materials, you stage a brief, simple, mostly visual fake event lasting about a round: a shadow in a doorway, a figure fleeing, a severed finger. Fooling someone far away is eased. Action to initiate."),
        ab("Practiced With Medium Weapons", "53", "", "enabler", "You use light and medium weapons without penalty. Attacks with heavy weapons are hindered."),
        ab("Seen Some . . . Stuff", "53", "", "enabler", SEEN_SOME_STUFF),
        ab("Skill With Defense", "53", "", "enabler", SKILL_WITH_DEFENSE),
        ab("Spout Nonsense", "54", "2+ Intellect", "action", "You fast-talk about the occult with jargon and looping logic that baffles even experts. The person you're talking to is too bewildered to act for one round. Each extra Intellect point affects one more person within immediate distance."),
        ab("Premonition", "54", "2 Intellect", "action", "Learn one random fact about a creature, object or place relevant to a topic you name. Alternatively, learn a creature's level, but then you can't learn anything else about it with this ability.", sup),
        ab("Send Thoughts", "54", "2+ Intellect", "action", "Send a message of up to ten words, or an image, into the mind of someone you know well within 1 mile (1.6 km). Each extra Intellect point adds another mile.", {stress: 2, ...sup})
      ],
      3: [
        ab("Cooperative Sorcery", "54", "4 Intellect", "action", "When someone next to you uses a supernatural power, you boost it: one range category further, double the targets, or eased to take effect. If the power gives its user Stress, you take the same Stress too."),
        ab("Embracing the Unknown", "54", "", "enabler", "Interaction tasks with supernatural beings are eased."),
        ab("Intense Practitioner", "54", "", "enabler", "When you apply at least one level of Effort to a task involving the supernatural, you get a free level of Effort on it."),
        ab("Peering Beyond the Veil", "54", "3 Intellect", "action", "For an hour you see invisible creatures and objects and hear inaudible sounds within short distance, and you sense any supernatural activity there in the last 24 hours.", {stress: 3, ...sup}),
        ab("Resistance to the Uncanny", "54", "", "enabler", "Using an artefact gives you 1 less point of Stress than normal."),
        ab("Shatter", "54", "2+ Intellect", "action", "Detonate a small mundane object of uniform material (a cup, a doorknob, a rock) within long range. It deals 1 point of damage to every creature and object within immediate radius, even if the attack roll fails. Each level of Effort applied to damage adds 2 points instead of 3.", {stress: 3, ...sup}),
        ab("Supernatural Resistance", "54", "", "enabler", "Your defense tasks against supernatural effects are eased.")
      ],
      4: [
        ab("Combating the Uncanny", "55", "", "enabler", "Your attacks against supernatural beings are eased."),
        ab("Heightened Skills", "55", "", "enabler", HEIGHTENED_SKILLS),
        ab("Shrug It Off", "55", "", "enabler", SHRUG_IT_OFF),
        ab("Think Your Way Out", "55", "", "enabler", THINK_YOUR_WAY_OUT),
        ab("Cypher Manifestation", "55", "4 Might", "action", "Turn one of your cyphers into a small handheld object you can give to someone else to use. It counts toward their cypher limit.", {stress: 3, ...sup}),
        ab("Edit Memories", "55", "4 Intellect", "action", "Reach into the mind of a person within immediate range and rewrite their last five minutes of memory: a guard forgets seeing you, a code is misremembered, the wrong person gets the blame.", {stress: 3, ...sup})
      ],
      5: [
        ab("See the Truth", "55", "", "enabler", "You see through magical disguises, veils, illusions and similar concealment with no roll. The truth can be dangerous, and revelations may cause Stress."),
        ab("Skill With Attacks", "55", "", "enabler", SKILL_WITH_ATTACKS),
        ab("Stern Stuff", "55", "", "enabler", "You no longer take Stress from witnessing the supernatural. Other stressful events, including using the supernatural yourself, still affect you."),
        ab("Stressed Mind", "55", "4 Intellect", "action", "With a touch and a whisper, a creature suffers 6 points of Stress (6 points of damage for an NPC).", {stress: 3, inflicts: 6, npcDamage: 6, ...sup}),
        ab("Vanish From Sight", "56", "5 Intellect", "action", "You turn invisible for up to one minute. You can only move or gently handle objects (open doors); doing anything else, like talking or attacking, reveals you, but an action spent hiding resumes the remaining time. Action to initiate.", {stress: 4, ...sup})
      ],
      6: [
        ab("Craft Artefact", "56", "", "special", "You create one artefact; take this again for each further one. Work out the details with the GM, but expect: hard-won plans or visions from a past Avatar, occultist or Entity; months or years of work; money on the scale of an exorbitant item; and likely 3 points of Stress per day of work plus a permanent loss of 3 points from your stat Pools. The result produces one effect equal to a sixth-tier type or focus ability, costing 3 Stress to use."),
        ab("Defending Others", "56", "", "enabler", "Allies within immediate distance ease their defenses against supernatural effects."),
        ab("Mastery With Defense", "56", "", "enabler", MASTERY_WITH_DEFENSE),
        ab("Meditative Restoration", "56", "8 Intellect", "action", "You lose 3 points of Stress for each minute you do nothing else. Action to initiate."),
        ab("Ghost", "56", "6 Intellect", "action", "For ten minutes you have an asset on sneaking tasks, can pass through solid barriers at 1 foot (30 cm) per round, and can perceive while inside a barrier or object, letting you see through walls. Action to initiate.", {stress: 5, ...sup}),
        ab("Psychokinetic Attack", "56", "6 Might", "action", "Either hurl a heavy object at someone within short range as an Intellect action, dealing 6 points of damage to both target and object (throwing a foe at another foe takes two rolls), or unleash a burst that destroys an inanimate object no larger than half your size on an Intellect roll eased by three steps compared to breaking it by force.", {stress: 5, ...sup})
      ]
    }
  }
];
