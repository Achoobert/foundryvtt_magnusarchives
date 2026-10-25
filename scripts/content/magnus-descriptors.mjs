/**
 * The 27 character descriptors from The Magnus Archives Roleplaying Game,
 * chapter 2 (p19-26).
 *
 * `summary` is a short original description of the descriptor, not the book's
 * prose — the full flavour text stays in the book, and `page` points at it.
 * The mechanics below are reproduced faithfully:
 *   pools        stat Pool bonus(es)
 *   trained      skills the descriptor trains outright
 *   trainedOneOf a choice of skills, trained at character creation
 *   secondSkill  the book's "Suggested Second Skill" line, as GM guidance
 *   feature      a characteristic offered instead of a second skill
 *   inability    the suggested inability
 */
export const MAGNUS_DESCRIPTORS = [
  {
    name: "Bold", page: "19", label: "Energetic",
    summary: "Self-assertive, confident and energetic. Some call you brash; you act rather than wait to learn more.",
    pools: {speed: 2}, trained: ["Initiative"],
    secondSkill: "Intellect defense or endurance.",
    inability: "Researching", inabilityNote: "You were never good at studying or retaining facts."
  },
  {
    name: "Brave", page: "19", label: "Resolve",
    summary: "Bravery is a conscious choice for you, not an absence of fear, and you can instil it in others.",
    pools: {intellect: 2}, trained: ["Persuasion"],
    secondSkill: "Stealth or Might defense.",
    inability: "Initiative", inabilityNote: "You're brave, but you have to talk yourself into it."
  },
  {
    name: "Caring", page: "20", label: "Helpful",
    summary: "Helping others is your calling, whether by treating injuries or keeping morale up.",
    pools: {intellect: 2}, trained: ["Healing"],
    secondSkill: "Persuasion or psychology.",
    inability: "Deception", inabilityNote: "You're too much of a people person to dissemble well."
  },
  {
    name: "Cautious", page: "20", label: "Cognizant",
    summary: "You study the particulars before you charge in. Others call it timid; you call it sense.",
    pools: {intellect: 2}, trained: ["Perception"],
    secondSkill: "Researching or initiative.",
    inability: "Discerning motive", inabilityNote: "Sometimes your caution leads to doubt."
  },
  {
    name: "Cheerful", page: "20", label: "Witty",
    summary: "Jovial and outgoing. You meet each new challenge with a grin and put others at ease.",
    pools: {intellect: 2}, trained: ["Persuasion"],
    secondSkill: "Performance or healing.",
    inability: "Speed defense", inabilityNote: "You're lighthearted but not fast."
  },
  {
    name: "Cynical", page: "20", label: "Skeptical",
    summary: "You question claims others take for granted, and you have often been right to.",
    pools: {intellect: 2}, trained: ["Discerning motive"],
    secondSkill: "Any scientific area of knowledge, such as physics or astronomy.",
    inability: "Speed defense", inabilityNote: "You're so absorbed in working out what's going on that you're slow to react."
  },
  {
    name: "Enigmatic", page: "21", label: "Guarded",
    summary: "The figure lurking quietly in the corner. Nobody knows where you came from or what you want.",
    pools: {}, trained: ["Stealth", "Intellect defense"],
    secondSkill: "Deception or occultism.",
    inability: "Discerning motive", inabilityNote: "You have almost as much trouble reading others as they do you."
  },
  {
    name: "Fastidious", page: "21", label: "Careful",
    summary: "A stickler for accuracy and detail. Everything you own is catalogued and in its place.",
    pools: {intellect: 2}, trained: ["Forensics"],
    secondSkill: "Researching or identifying.",
    inability: "Intellect defense", inabilityNote: "You can't stand disruptions, especially to your concentration."
  },
  {
    name: "Fearless", page: "21", label: "Dauntless",
    summary: "Fight, flight or freeze — you have only ever felt the urge to fight. A true thrill-seeker.",
    pools: {might: 2}, trained: ["Intellect defense"],
    secondSkill: "Endurance or initiative.",
    inability: "Stealth", inabilityNote: "Your fearlessness makes you impatient."
  },
  {
    name: "Ferocious", page: "22", label: "Brutish",
    summary: "Something in you screams to make them pay. You fold it away for your friends, but it is always there.",
    pools: {might: 2}, trained: ["Tracking"],
    feature: {name: "Bloodthirsty", description: "Once you begin fighting, you see only red. The first attack you make in any given combat is eased."},
    secondSkill: "Instead of an extra skill, you may take the Bloodthirsty characteristic.",
    inability: "Intellect defense", inabilityNote: "You're easily provoked."
  },
  {
    name: "Hopeful", page: "22", label: "Resilient",
    summary: "You treat setbacks as stepping stones, and your empathy shows you others' inner battles.",
    pools: {might: 2}, trained: ["Discerning motive"],
    secondSkill: "Persuasion or performance.",
    inability: "Researching", inabilityNote: "You always hope for the best, even when you should be preparing."
  },
  {
    name: "Inquisitive", page: "22", label: "Curious",
    summary: "You hunt the mysteries and occult secrets of the world, usually through somebody's archive.",
    pools: {intellect: 2}, trained: ["Researching"],
    secondSkill: "Any knowledge skill, such as astronomy, geography, or history.",
    inability: "Initiative", inabilityNote: "When you see something interesting, you hesitate as you take it all in."
  },
  {
    name: "Intimidating", page: "23", label: "Threatening",
    summary: "Imposing in manner, stature, or both. There is a touch of danger about you, and people sense it.",
    pools: {might: 2},
    poolsNote: "+2 to your Might Pool, or +2 to your Intellect Pool, or +1 to both Pools.",
    trained: ["Intimidation"],
    secondSkill: "Gunsmithing or deception.",
    inabilityNote: "You're threatening but not a quick study. Tasks related to lore and knowledge are hindered."
  },
  {
    name: "Likeable", page: "23", label: "Charismatic",
    summary: "Charming and charismatic. People like you, want to help you, and want to be your friend.",
    pools: {intellect: 2}, trained: ["Persuasion"],
    feature: {name: "Contact", description: "You have an important contact in an influential position, such as a minor celebrity, a police captain, or the editor of a news organisation. Work out the details with the GM."},
    secondSkill: "Instead of an extra skill, you may take the Contact characteristic.",
    inability: "Intellect defense", inabilityNote: "Your willpower is not one of your strong points."
  },
  {
    name: "Muscular", page: "23", label: "Strong",
    summary: "You are strong, and you enjoy the power and endurance that comes with it.",
    pools: {might: 2}, trained: ["Endurance"],
    feature: {name: "Breaking", description: "Your tasks to smash physical objects — doors, containers, and other inanimate objects — are eased."},
    secondSkill: "Instead of an extra skill, you may take the Breaking characteristic.",
    inability: "Initiative", inabilityNote: "You're strong but not quick."
  },
  {
    name: "Nervous", page: "24", label: "Jumpy",
    summary: "The world is full of unsettling things and you are not imagining it. The unease keeps you on your toes.",
    pools: {speed: 2}, trained: ["Initiative"],
    feature: {name: "High-Strung", description: "You gain an asset to your initiative tasks if you use your first action in an encounter to move a short distance away from whatever threatens you."},
    secondSkill: "Instead of an extra skill, you may take the High-Strung characteristic.",
    inability: "Intimidation", inabilityNote: "You'll never convincingly make ultimatums."
  },
  {
    name: "No-Nonsense", page: "24", label: "Austere",
    summary: "You hate frills, chitchat and gossip. You prize straight talk and the facts.",
    pools: {might: 2}, trained: ["Researching"],
    feature: {name: "Resilient", description: "You ignore the first 3 points of Stress you would otherwise take in a day from shock, such as Stress from experiencing something supernatural. Once that threshold is passed you suffer Stress normally until after your next ten-hour recovery roll, which resets it."},
    secondSkill: "Instead of an extra skill, you may take the Resilient characteristic.",
    inability: "Persuasion", inabilityNote: "People react badly to your humourless ways."
  },
  {
    name: "Obsessive", page: "24", label: "Dogged",
    summary: "Some formative loss or judgement drives you, and no setback stops you pursuing it.",
    pools: {might: 2}, trained: ["Identifying"],
    secondSkill: "Any craft-related skill, such as carpentry, cooking, leatherworking, metalworking, or sewing.",
    inability: "Persuasion", inabilityNote: "You come across as so single-minded that you put people off."
  },
  {
    name: "Pretentious", page: "25", label: "Willful",
    summary: "You are sure you know the best way to handle anything, and few can change your mind.",
    pools: {intellect: 2}, trained: ["Intellect defense"],
    secondSkill: "Any technical expertise skill, such as programming, publishing, or researching.",
    inability: "Persuasion", inabilityNote: "Pomposity doesn't lend itself to likeability."
  },
  {
    name: "Quick", page: "25", label: "Swift",
    summary: "Right place, right time — or more often, out of the wrong place in time. Not luck: speed.",
    pools: {speed: 4},
    poolsNote: "Quick offers no initial skill, but a larger stat Pool bonus.",
    secondSkill: "Endurance or gymnastics.",
    inability: "Deception", inabilityNote: "You're quick, but not quick-witted when it comes to falsehoods."
  },
  {
    name: "Ruthless", page: "25", label: "Hard",
    summary: "You harden your heart to others' suffering. What they call cruelty, you call pragmatism.",
    pools: {might: 2}, trained: ["Deception"],
    secondSkill: "Intimidation or stealth.",
    inability: "Discerning motive", inabilityNote: "You have a hard time connecting with others or sharing their feelings."
  },
  {
    name: "Scholarly", page: "26", label: "Studied",
    summary: "You studied, alone or with an instructor, and you are an expert in a couple of fields.",
    pools: {},
    poolsNote: "Scholarly offers no initial stat Pool bonus, but another skill instead.",
    trainedOneOf: [
      {choose: 1, from: "knowledge", note: "One knowledge skill, such as philosophy, geography, or history."},
      {choose: 1, from: "knowledge", note: "Another, different knowledge skill, such as astronomy, biology, or geology."}
    ],
    secondSkill: "Identifying or researching.",
    inability: "Discerning motive", inabilityNote: "You spend too long on scholarly pursuits to trust your empathy."
  },
  {
    name: "Smart", page: "26", label: "Brainy",
    summary: "A sharp memory and a quick grasp of ideas, formal education or not.",
    pools: {intellect: 4},
    poolsNote: "Smart offers no initial skill, but a larger stat Pool bonus.",
    feature: {name: "Eidetic", description: "You remember and can memorise things you experience directly. If a roll is needed to test your memory against something particularly challenging, that roll is eased."},
    secondSkill: "Instead of an extra skill, you may take the Eidetic characteristic.",
    inability: "Deception", inabilityNote: "You're good at absorbing information, but not at hiding what you know."
  },
  {
    name: "Sturdy", page: "26", label: "Rugged",
    summary: "Tough enough to take a lot of punishment. You feel the pain; you just don't let it stop you.",
    pools: {might: 4},
    poolsNote: "Sturdy offers no initial skill, but a larger stat Pool bonus.",
    feature: {name: "Resilient", description: "You ignore the first 3 points of Stress you would otherwise take in a day from physical sources, such as Stress from minor wounds. Once that threshold is passed you suffer Stress normally until after your next ten-hour recovery roll, which resets it."},
    secondSkill: "Instead of an extra skill, you may take the Resilient characteristic.",
    inability: "Intellect defense", inabilityNote: "You're brawny but not mentally flexible."
  },
  {
    name: "Superstitious", page: "26", label: "Folkwise",
    summary: "You see the patterns others overlook, and you are sure the deepest truths will come into focus.",
    pools: {intellect: 2}, trained: ["Occultism"],
    feature: {name: "Throw Salt", description: "When something unquestionably supernatural affects you adversely, you can reroll your defense roll against it. Once per encounter."},
    secondSkill: "Instead of an extra skill, you may take the Throw Salt characteristic.",
    inability: "Discerning motive", inabilityNote: "You're willing to believe a lot."
  },
  {
    name: "Suspicious", page: "26", label: "Guarded",
    summary: "The world isn't always safe. You watch for the few bad apples, and it has served you well.",
    pools: {might: 2}, trained: ["Discerning motive"],
    secondSkill: "Initiative or perception.",
    inability: "Persuasion", inabilityNote: "Sometimes you're too suspicious and put people off."
  },
  {
    name: "Tech-Savvy", page: "26", label: "Technical",
    summary: "Devices have always fascinated you. Give you a new one and you'll use it like a pro, or open it up.",
    pools: {intellect: 2},
    trainedOneOf: [{choose: 1, options: ["Programming", "Electronics"]}],
    secondSkill: "Any other technical skill, such as electrical repair or engineering.",
    inability: "Discerning motive", inabilityNote: "You're better with tech than with people."
  }
];
