/**
 * The cyphers from The Magnus Archives Roleplaying Game, chapter 6 (p105-113),
 * in the order of the d00 Cypher Table (p107).
 *
 * `effect` is a short restatement of each cypher in our own words, not the
 * book's prose. The mechanics are reproduced faithfully:
 *   level    the book's Level line, a die formula ("1d6 + 2") or a fixed number
 *   instant  the cypher is marked "(instant)" and can be used as part of
 *            another action, or in reaction to someone else's
 *   d00      the cypher's range on the Cypher Table, [low, high], 100 = "00"
 *   table    a sub-table the cypher rolls on (see MAGNUS_CYPHER_TABLES)
 */
export const MAGNUS_CYPHERS = [
  {
    name: "Another Twist", page: "107", level: "1d6", instant: true, d00: [1, 2],
    effect: "Reroll one die roll of your choice."
  },
  {
    name: "Big Picture", page: "107", level: "1d6 + 2", d00: [3, 4],
    effect: "For one hour per cypher level, you sense any movement within short range, and any large creature or object moving within long range. You also know how many things are moving and how big they are."
  },
  {
    name: "Binary", page: "107", level: "1d6 + 2", instant: true, d00: [5, 6],
    effect: "You guess the right PIN or passcode for a phone, lock, card, laptop, website or similar, as long as its level is no higher than the cypher's level."
  },
  {
    name: "Body Builder", page: "107", level: "1d6 + 2", d00: [7, 7],
    effect: "Add 1 to your Might Edge for one hour (2 if the cypher is level 5 or higher)."
  },
  {
    name: "Breathing Room", page: "107", level: "1d6 + 1", instant: true, d00: [8, 9],
    effect: "As part of a physical action (an attack, a bump, a shout, shoving past), you make an NPC within immediate range drop whatever they hold, if their level is lower than the cypher's level."
  },
  {
    name: "Burning Desire", page: "107", level: "1d6", instant: true, d00: [10, 11],
    effect: "Use 1 level of Stress as an asset on your action without triggering the usual GM intrusion (Using Stress, p129)."
  },
  {
    name: "Cheating Death", page: "108", level: "10", instant: true, d00: [12, 13],
    effect: "If you reach the last step on the damage track, you fall into a near-death coma for a week instead of dying. You keep a serious scar after you recover (Damage track, p132)."
  },
  {
    name: "Curiosity", page: "108", level: "1d6 + 2", d00: [14, 15],
    effect: "Add 1 to your Intellect Edge for one hour (2 if the cypher is level 5 or higher)."
  },
  {
    name: "Dance Through the Maze", page: "108", level: "1d6", d00: [16, 17],
    effect: "For one hour, ease every task of manual dexterity (pickpocketing, lockpicking, juggling, surgery, defusing a bomb and the like) by one step, or by two steps if the cypher is level 5 or higher."
  },
  {
    name: "Deathly Silent and Still", page: "108", level: "1d6", instant: true, d00: [18, 19],
    effect: "If there is any way to conceal yourself, nobody is aware of you for one round."
  },
  {
    name: "Desperate Effort", page: "108", level: "1d6", instant: true, d00: [20, 21],
    effect: "Apply one free level of Effort to one task without spending Pool points. It does not count toward the most Effort you can normally apply."
  },
  {
    name: "Eye Contact", page: "108", level: "1d6 + 4", instant: true, d00: [22, 23],
    effect: "Pass simple information to a known ally who can see you, using only looks, gestures or references. Only the two of you notice anything was said. The message is about one word per cypher level."
  },
  {
    name: "Flee The Hunt!", page: "108", level: "1d6", instant: true, d00: [24, 25],
    effect: "If you are being chased, you escape and the pursuer eventually gives up. If they get another chance later (say, you come back), a new chase is resolved normally."
  },
  {
    name: "Gift of The Piper", page: "108", level: "1d6", instant: true, d00: [26, 27],
    effect: "Take one extra action right away on your turn."
  },
  {
    name: "Guess You Had to Be There", page: "108", level: "1d6", d00: [28, 29],
    effect: "Perfectly recall one experience you have had, lasting up to one minute per cypher level. Every detail comes back, such as a phone number you watched someone dial."
  },
  {
    name: "Gut Feeling", page: "108", level: "1d6 + 4", d00: [30, 31],
    effect: "When choosing between two known options, you pick the more correct one: which way a quarry turned, which wire to cut, which of two suspects is guilty. It does nothing if neither option is right."
  },
  {
    name: "Hard Shoulder", page: "109", level: "1d6 + 4", instant: true, d00: [32, 33],
    effect: "Avoid one attack entirely, taking no damage or effect, if the attacker's level is lower than the cypher's level."
  },
  {
    name: "Help From a Stranger", page: "109", level: "1d6", d00: [34, 35],
    effect: "You turn out to have a needed item that is not on your sheet, or you know how to rig a makeshift replacement from materials at hand in about a minute. Use whichever suits the situation."
  },
  {
    name: "Implore The Flesh", page: "109", level: "1d6 + 2", d00: [36, 37],
    effect: "Regain points to your Speed Pool equal to the cypher's level."
  },
  {
    name: "Jigsaw Solver", page: "109", level: "1d6", d00: [38, 39],
    effect: "For one hour, ease every task of reasoning and deduction (chess, connecting clues, maths, debugging code and the like) by two steps."
  },
  {
    name: "Last Words", page: "109", level: "1d6", d00: [40, 41],
    effect: "Spend about a minute rallying nearby allies before something important. You and those allies each lose Stress equal to the cypher's level."
  },
  {
    name: "Learn From The Web", page: "109", level: "1d6", d00: [42, 43], table: "learn-from-the-web",
    effect: "For the next day, you count as trained in one predetermined skill (two if the cypher is level 5 or higher). It can be any skill, even one tied to a single device, or roll on the table to pick a common one."
  },
  {
    name: "Lesson of The Boneturner", page: "109", level: "10", d00: [44, 45],
    effect: "If you reach debilitated on the damage track and survive, then once you are hale again you gain a character advancement (skill training, +4 points to your Pools, +1 Effort, or +1 Edge) without spending 4 XP (Character advancement, p140)."
  },
  {
    name: "Librarian's Pupil", page: "110", level: "1d6", d00: [46, 47], table: "librarians-pupil",
    effect: "Ease one kind of physical action by three steps. Once active, the boost applies to the next uses of that action, up to the cypher's level in uses, within twenty-four hours. A level 3 cypher boosts the first three attempts. Roll on the table to find the action."
  },
  {
    name: "Like an Avatar", page: "110", level: "1d6 + 2", instant: true, d00: [48, 49],
    effect: "Treat your action as if you had rolled a natural 20."
  },
  {
    name: "Meat", page: "110", level: "1d6", d00: [50, 51],
    effect: "For one hour per cypher level, reduce the Stress you suffer from physical injury by 1. Stress from mental shock or despair is unchanged."
  },
  {
    name: "Nemesis", page: "110", level: "1d6 + 1", d00: [52, 53],
    effect: "One NPC within immediate range whose level is lower than the cypher's level decides to leave, and spends its next five rounds moving quickly away."
  },
  {
    name: "Nightfall", page: "110", level: "1d6", d00: [54, 55],
    effect: "For one hour per cypher level, you rely on senses other than sight. Darkness does not hinder your tasks to perceive or attack."
  },
  {
    name: "Observer Effect", page: "110", level: "1d6", d00: [56, 57],
    effect: "Looking around an immediate area, you notice any hidden clues there that matter to the current investigation."
  },
  {
    name: "Of The Beholding", page: "110", level: "1d6", d00: [58, 59],
    effect: "Gain an asset on perception tasks for one hour per cypher level."
  },
  {
    name: "Of The Flesh", page: "110", level: "1d6", d00: [60, 61],
    effect: "For one hour, ease every noncombat task of raw strength (breaking a door, lifting a boulder, forcing lift doors and the like) by two steps."
  },
  {
    name: "Panopticon", page: "110", level: "1d6", instant: true, d00: [62, 63],
    effect: "Memorise everything you see for thirty seconds per cypher level, permanently. Handy for watching someone pick a lock or key in a code."
  },
  {
    name: "Personal Space", page: "111", level: "1d6 + 4", d00: [64, 65],
    effect: "Gain an asset on Speed defense rolls for the next day."
  },
  {
    name: "Risen Wind", page: "111", level: "1d6 + 2", d00: [66, 67],
    effect: "Regain points to your Might Pool equal to the cypher's level."
  },
  {
    name: "Sculptor's Tool", page: "111", level: "1d6", instant: true, d00: [68, 69],
    effect: "Gain one extra asset on any one task using a tool, even past the normal limit of two assets."
  },
  {
    name: "Show Must Go On", page: "111", level: "1d6", d00: [70, 71],
    effect: "You find props that suit the scene (a ladder, hard hat, clipboard, cleaning cart) that let you and up to two allies get into a building without attracting attention. If challenged, your disguise and deception tasks are eased by two steps. It usually lasts several hours."
  },
  {
    name: "Smell of Blood", page: "111", level: "1d6", instant: true, d00: [72, 73],
    effect: "Your attack deals extra damage equal to the cypher's level."
  },
  {
    name: "Spiral's Luck", page: "112", level: "1d6", instant: true, d00: [74, 74],
    effect: "An attack that would give you a serious injury gives you 2 points of Stress instead."
  },
  {
    name: "Squirm", page: "112", level: "1d6", instant: true, d00: [75, 76],
    effect: "Ease the action you are taking by three steps."
  },
  {
    name: "Stare Into The Vast", page: "112", level: "1d6 + 2", d00: [77, 78],
    effect: "Regain points to your Intellect Pool equal to the cypher's level."
  },
  {
    name: "Strange Music", page: "112", level: "1d6", d00: [79, 80],
    effect: "Lose Stress equal to the cypher's level."
  },
  {
    name: "Taking Stock", page: "112", level: "1d6 + 2", d00: [81, 82],
    effect: "Ask the GM one question and get a general answer. The GM gives the question a level, and the cypher can't answer a question above its own level. As a guide, knowledge found elsewhere than where you are is level 1, obscure knowledge of the past is level 7, and knowledge of the future is level 10 and always open to interpretation."
  },
  {
    name: "Thought for the Day", page: "112", level: "1d6", d00: [83, 84],
    effect: "Recall a relevant detail about the current situation, of a kind normal research could turn up."
  },
  {
    name: "Thrill of the Chase", page: "112", level: "1d6", d00: [85, 86],
    effect: "For one minute, you can move a long distance instead of a short distance as an action."
  },
  {
    name: "Tightrope", page: "112", level: "1d6 + 2", d00: [87, 88],
    effect: "Add 1 to your Speed Edge for one hour (2 if the cypher is level 5 or higher)."
  },
  {
    name: "Uncanny Valley", page: "112", level: "1d6 + 3", instant: true, d00: [89, 90],
    effect: "After talking with someone for at least a couple of rounds, ease one deception or persuasion task against them by three steps."
  },
  {
    name: "Watcher's Know-How", page: "112", level: "1d6", d00: [91, 92],
    effect: "You know where to look, or who to ask, to find a significant piece of information. The GM may offer more than one lead. Use it when you start researching or while searching for clues."
  },
  {
    name: "Weaver's Encouragement", page: "112", level: "1d6", d00: [93, 93],
    effect: "Someone next to you gains an asset on their next task. If the cypher is level 5 or higher, you can encourage up to three characters at once."
  },
  {
    name: "Well-Being", page: "112", level: "1d6", d00: [94, 95],
    effect: "For one round per cypher level, act as if you were one step higher on the damage track than you are, as long as you are not dead (Damage track, p132)."
  },
  {
    name: "What We All Ignore", page: "113", level: "1d6", d00: [96, 97],
    effect: "For one hour per cypher level, reduce the Stress you suffer from mental shock or despair by 1 each time. Stress from physical injury is unchanged."
  },
  {
    name: "What We Lose", page: "113", level: "1d6 + 3", instant: true, d00: [98, 99],
    effect: "Brushing past someone, you lift something from their pocket, bag or other container, if they carry anything. Ease the pickpocketing task by two steps, or by four if the cypher is level 7 or higher."
  },
  {
    name: "Words of The Puppeteer", page: "113", level: "1d6", instant: true, d00: [100, 100],
    effect: "Gain one extra asset on any one task of verbal interaction, even past the normal limit of two assets."
  }
];

/** Sub-tables rolled by individual cyphers. Results are plain text. */
export const MAGNUS_CYPHER_TABLES = [
  {
    id: "learn-from-the-web", name: "Learn From The Web: Skill", page: "109",
    results: [
      [[1, 10], "Melee attacks"],
      [[11, 20], "Ranged attacks"],
      [[21, 40], "One type of academic or esoteric lore (biology, history, occultism and so on)"],
      [[41, 50], "Researching"],
      [[51, 60], "Forensics"],
      [[61, 70], "Persuasion"],
      [[71, 75], "Mechanics"],
      [[76, 80], "Speed defense"],
      [[81, 85], "Intellect defense"],
      [[86, 90], "Swimming"],
      [[91, 95], "Psychology"],
      [[96, 100], "Stealth"]
    ]
  },
  {
    id: "librarians-pupil", name: "Librarian's Pupil: Action", page: "110",
    results: [
      [[1, 15], "Melee attack"],
      [[16, 30], "Ranged attack"],
      [[31, 40], "Speed defense"],
      [[41, 50], "Might defense"],
      [[51, 60], "Intellect defense"],
      [[61, 68], "Gymnastics"],
      [[69, 76], "Endurance"],
      [[77, 84], "Driving"],
      [[85, 92], "Equipment operation"],
      [[93, 94], "Stealth"],
      [[95, 96], "Initiative"],
      [[97, 98], "Perception"],
      [[99, 99], "Performance"],
      [[100, 100], "Tracking"]
    ]
  }
];
