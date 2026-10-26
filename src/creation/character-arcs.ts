/**
 * Character arcs from The Magnus Archives Roleplaying Game.
 *
 * `summary` is a short original description, not the book's prose. `beats`
 * keeps only the book's short beat titles (Opening, Step(s), Climax,
 * Resolution) so players can track where they are; the full text stays in the
 * book.
 */
export interface CharacterArcBeats {
  readonly opening: string;
  readonly steps: readonly string[];
  readonly climax: string;
  readonly resolution: string;
}

export interface CharacterArcDefinition {
  readonly key: string;
  readonly name: string;
  readonly summary: string;
  readonly beats: CharacterArcBeats;
}

/** XP earned per arc part: each step, the climax (success or failure), and the resolution. */
export const ARC_XP = {step: 2, climaxSuccess: 4, climaxFailure: 2, resolution: 1} as const;

const arc = (
  key: string,
  name: string,
  summary: string,
  opening: string,
  steps: readonly string[],
  climax: string,
  resolution: string
): CharacterArcDefinition => ({key, name, summary, beats: {opening, steps, climax, resolution}});

export const CHARACTER_ARCS: readonly CharacterArcDefinition[] = [
  arc(
    "aid-a-friend",
    "Aid a Friend",
    "Help another character, PC or NPC, with an arc of their own.",
    "Answering the call",
    ["Depends on the friend's arc"],
    "Depends on the friend's arc",
    "Talk it over with your friend"
  ),
  arc(
    "assist-an-organization",
    "Assist an Organization",
    "Take on one clear task that moves a group you are tied to forward.",
    "Responding to the call",
    ["Sizing up the task", "Undertaking the task"],
    "Completing the task",
    "Collecting your reward"
  ),
  arc(
    "avenge",
    "Avenge",
    "Someone close to you was wronged, and you mean to make the guilty party answer for it.",
    "Declaration",
    ["Tracking the guilty", "Finding the guilty"],
    "Confrontation",
    "Deal with the aftermath"
  ),
  arc(
    "birth",
    "Birth",
    "You are becoming a parent and must see the pregnancy safely through.",
    "Impregnation",
    ["Finding a caretaker", "Complication", "Preparation"],
    "Delivery",
    "Settle in with the baby"
  ),
  arc(
    "build",
    "Build",
    "Put up or rebuild a physical structure, such as a house, workshop or lab.",
    "Make a plan",
    ["Find a site", "Gather materials", "Construction"],
    "Completion",
    "Put the structure to use"
  ),
  arc(
    "cleanse",
    "Cleanse",
    "Rid a person, place or thing of a supernatural taint, curse or infestation.",
    "Analyze the threat",
    ["Find the solution", "Getting ready"],
    "The cleansing",
    "Reflect on what happened"
  ),
  arc(
    "creation",
    "Creation",
    "Make something: a painting, a novel, a machine, or even an artefact.",
    "Make a plan",
    ["Gather materials", "Progress"],
    "Completion",
    "Enjoy what you made"
  ),
  arc(
    "defeat-a-foe",
    "Defeat a Foe",
    "Overcome a rival who stands in your way. It need not mean a fight.",
    "Sizing up the competition",
    ["Investigation", "Diving in"],
    "Confrontation",
    "Reflect on the outcome"
  ),
  arc(
    "defense",
    "Defense",
    "Protect a threatened person, place or thing from the danger coming for it.",
    "Analyze the situation",
    ["Account for your resources", "Fend off danger"],
    "Protect",
    "Assess its safety going forward"
  ),
  arc(
    "develop-a-bond",
    "Develop a Bond",
    "Grow closer to another character as a friend, mentor or something more.",
    "Getting to know you",
    ["Initial attempt", "Building a relationship"],
    "Bond",
    "Enjoy the new relationship"
  ),
  arc(
    "enterprise",
    "Enterprise",
    "Start and run a business or organization of your own.",
    "Drawing up a plan",
    ["Account for your resources", "Finding a location", "Building the enterprise"],
    "Profit and loss",
    "Reflect on how to move forward"
  ),
  arc(
    "establishment",
    "Establishment",
    "Prove yourself as someone who matters, socially, professionally or otherwise.",
    "Assessment",
    ["Appearances matter", "Self-aggrandizement"],
    "Grabbing attention",
    "Reflect on where you go next"
  ),
  arc(
    "explore",
    "Explore",
    "Uncover the secrets of an unknown place, from a lost ruin to a twisted dimension.",
    "Make a plan",
    ["Gather resources", "Travel", "Exploration"],
    "Conquest",
    "Return home and share findings"
  ),
  arc(
    "fall-from-grace",
    "Fall From Grace",
    "A chosen downward spiral of your own making, often setting up a later Redemption.",
    "The descent",
    ["Further descent", "Lashing out"],
    "Rock bottom",
    "Wallow in your own misery"
  ),
  arc(
    "finish-a-great-work",
    "Finish a Great Work",
    "Complete something someone else began long ago.",
    "Assessing the past",
    ["Conceive a plan", "Progress"],
    "Completion",
    "Reflect on what you did"
  ),
  arc(
    "growth",
    "Growth",
    "Change who you are inside, becoming braver, kinder or more of a leader.",
    "The beginning",
    ["Change", "Overcoming an obstacle"],
    "Self-evident change",
    "Recognize the change in yourself"
  ),
  arc(
    "instruction",
    "Instruction",
    "Teach a pupil a skill, a body of lore or a special ability.",
    "Taking on the student",
    ["Getting to know them", "The lessons", "Breakdown"],
    "Graduation",
    "Say your goodbyes"
  ),
  arc(
    "join-an-organization",
    "Join an Organization",
    "Become a member of a company, cult, secret society or similar group.",
    "Getting the details",
    ["Making a contact", "Performing a deed"],
    "Proving your worth",
    "Assess what membership gets you"
  ),
  arc(
    "justice",
    "Justice",
    "Right a wrong or bring a wrongdoer to justice.",
    "Declaration",
    ["Tracking the guilty", "Helping the victim"],
    "Confrontation",
    "Resolve the outcome"
  ),
  arc(
    "learn",
    "Learn",
    "Gain a new skill or field of knowledge, such as a language or an instrument.",
    "Focusing on the problem",
    ["Finding a teacher", "Learn"],
    "The test",
    "Relax and decide what's next"
  ),
  arc(
    "master-a-skill",
    "Master a Skill",
    "Go from skilled to the very best, often after a Learn arc.",
    "Finding the path",
    ["Discovering a master", "Learn", "The last step"],
    "The test",
    "Relax and decide what's next"
  ),
  arc(
    "mysterious-background",
    "Mysterious Background",
    "Dig into a mystery in your own past, such as unknown parents or a strange mark.",
    "Beginning the search",
    ["Research", "Investigation"],
    "Discovery",
    "Consider what you now know"
  ),
  arc(
    "new-discovery",
    "New Discovery",
    "Invent a device, process or ritual nobody has made before.",
    "The idea",
    ["Research", "Trial and error"],
    "Eureka!",
    "Write it all down"
  ),
  arc(
    "raise-a-child",
    "Raise a Child",
    "Bring up a child to adulthood, by birth, adoption or as a protege.",
    "Sharing your home",
    ["Care and feeding", "Basic instruction", "The rewards are many", "Ethical instruction"],
    "Adulthood",
    "Reflect on the memories"
  ),
  arc(
    "recover-from-a-wound",
    "Recover From a Wound (or Trauma)",
    "Heal from a major injury, illness, loss or emotional trauma.",
    "Rest",
    ["Self-care", "Getting aid", "Medicine", "Therapy"],
    "Acceptance or recovery",
    "Get on with your life"
  ),
  arc(
    "redemption",
    "Redemption",
    "You did something very wrong and want to atone for it.",
    "Regret",
    ["Forgiveness", "Identifying the needs"],
    "Making good",
    "Look to the future"
  ),
  arc(
    "repay-a-debt",
    "Repay a Debt",
    "Make good on something you owe, through money or a deed.",
    "Debts come due",
    ["Talking it over"],
    "Repayment",
    "Relax knowing the debt is paid"
  ),
  arc(
    "rescue",
    "Rescue",
    "Someone or something important was taken, and you will get them back.",
    "Heeding the call",
    ["Tracking", "Travel"],
    "Rescue operation",
    "Return them home"
  ),
  arc(
    "restoration",
    "Restoration",
    "Rebuild your good name, home or fortune after losing it.",
    "Vow to yourself",
    ["Work"],
    "The final act",
    "Enjoy a return to how things were"
  ),
  arc(
    "revenge",
    "Revenge",
    "Someone harmed you personally, and you want them to pay.",
    "Vow",
    ["Finding a clue"],
    "Confrontation",
    "Deal with the aftermath"
  ),
  arc(
    "romance",
    "Romance",
    "Start a relationship with a romantic partner.",
    "Caught someone's eye",
    ["Courtship"],
    "Commitment",
    "Think about the future"
  ),
  arc(
    "solve-a-mystery",
    "Solve a Mystery",
    "Find out the truth behind a recent crime or strange event.",
    "Pledging to solve the mystery",
    ["Research", "Investigation"],
    "Discovery",
    "Act on what you found"
  ),
  arc(
    "theft",
    "Theft",
    "Steal something you want, or something someone shouldn't have.",
    "Setting your sights",
    ["Casing the joint", "Getting to the object"],
    "The attempt",
    "Decide what to do with it"
  ),
  arc(
    "train-a-creature",
    "Train a Creature",
    "Tame and train an animal that isn't already domesticated.",
    "Getting acquainted",
    ["Research", "Domestication", "Training"],
    "Completion",
    "Reflect on the experience"
  ),
  arc(
    "transformation",
    "Transformation",
    "Change yourself in a specific outward way, often with real risk.",
    "Deciding on the transformation",
    ["Research", "Investigation"],
    "Change",
    "Consider how it affects you"
  ),
  arc(
    "uncover-a-secret",
    "Uncover a Secret",
    "Seek out hidden knowledge, a lost formula or a cult's true leader.",
    "Naming the secret",
    ["Research", "Investigation", "Tracking"],
    "Revelation",
    "Consider how it affects you and the world"
  ),
  arc(
    "undo-a-wrong",
    "Undo a Wrong",
    "Reverse lasting damage from something horrible done in the past.",
    "Vowing to put right what once went wrong",
    ["Make a plan", "Progress"],
    "Change",
    "Reflect on what you did"
  )
];

export function characterArc(key: string): CharacterArcDefinition | undefined {
  return CHARACTER_ARCS.find((entry) => entry.key === key);
}
