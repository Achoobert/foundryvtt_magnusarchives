/**
 * The artefacts and books from The Magnus Archives Roleplaying Game,
 * chapter 13 (p248-284).
 *
 * Every entry keeps the book's stat block faithfully: level (a number or a
 * roll such as "1d6+2"), related Entity, the automatic Stress it deals and the
 * fear (its triggered GM intrusion). `description` is a short original
 * rewording of what the object does, not the book's prose; the epigraphs and
 * podcast quotes stay in the book, and `page` points at them.
 *   kind      "artefact" or "book" (books are a subcategory of artefact, p267)
 *   entities  the related Entity or Entities
 *   stress    when, and how much, Stress it deals (no defense roll applies)
 *   effect    an array of paragraphs; a nested array renders as a list
 *   fear      the triggered intrusion
 */
export const MAGNUS_ARTEFACTS = [
  {
    name: "Blood money pouch", kind: "artefact", page: "251", level: "6",
    entities: ["The Slaughter"],
    stress: "3 on understanding how to use the pouch (or recognizing what a given coin, or the pouch, has been doing); 2 with each use.",
    effect: [
      "A leather pouch of 1888 Morgan silver dollars. Someone who is given one of the coins (as a gift, as payment, or slipped among their things) makes an Intellect defense roll each night they keep it. On a failure they sleepwalk and attempt something grisly (roll a d6 below).",
      "Each time someone calls the sleepwalker's name or tells them to stop, they get another Intellect defense roll; a success wakes them with no memory. Otherwise they finish the deed if they can and go back to bed, even if seriously wounded, and wake remembering nothing.",
      "Giving the coin away spares the recipient further direct harm and passes the curse on. If a recipient dies, the coin returns to the pouch after a few days unless someone else claims it first.",
      [
        "1: Tries to remove the face of the nearest living creature.",
        "2: Stealthily waylays the nearest stranger and brings their tongue home to hide under the bed.",
        "3: Tries to drain and drink the blood of the nearest living creature.",
        "4: Tries to kill the nearest living creature and hang it up like game, perhaps cooking some of it.",
        "5: Takes a vehicle and attempts a string of hit-and-runs.",
        "6: Breaks every nearby mirror, collects the shards and \"drinks\" them, taking a serious injury."
      ]
    ],
    fear: "The pouch's owner suffers as if they had been given a coin, until they give up the pouch."
  },
  {
    name: "Boatswain's call", kind: "artefact", page: "252", level: "6",
    entities: ["The Lonely"],
    stress: "3 on acquiring the whistle and understanding how to use it; 1 with each use.",
    effect: [
      "Blowing this tarnished brass nautical whistle raises heavy rolling fog about 3 miles (5 km) in radius for one hour. Visibility in the fog drops to immediate range.",
      "Anyone alone in the fog (at least a long distance from everyone else) is banished into The Lonely on a failed Intellect defense roll: a muted, misted mirror of reality with no one else in it. They take 1 Stress each hour they fail an Intellect defense roll, and can make an Intellect-based task each minute they search for a way out. On a success they reappear somewhere between a few yards and a few miles from where they vanished."
    ],
    fear: "The user loses track of their allies and risks ending up alone in the fog."
  },
  {
    name: "Calliope", kind: "artefact", page: "252", level: "5",
    entities: ["The Stranger"],
    stress: "3 on acquiring the steam organ and understanding how to use it (or realizing what it has been doing); 1 with each use.",
    effect: [
      "A performer who plays this antique steam organ and succeeds at a difficulty 1 performance task chooses one effect below. If the performer doesn't know the organ is unusual, or fails the task, Circus Clown is chosen for them and aimed at one of their allies.",
      [
        "<strong>Circus Clown:</strong> a nearby toy animates (as a clown doll, p206) and goes after someone the performer chooses.",
        "<strong>Crowd of Strangers:</strong> once per day, listeners within long range other than the performer and chosen allies who fail an Intellect defense roll become strangers to themselves for an hour, acting callous, cruel and antisocial. They can retry the defense each minute, or each round if someone calls out their behavior.",
        "<strong>Strange Control:</strong> one listener within long range who fails an Intellect defense roll does as the performer wishes for an hour. They retry the defense each minute and each time they take damage.",
        "<strong>Thrilling Shriek:</strong> once per day, listeners within long range each gain an asset on one task of their choice within the next hour. Horror Mode begins, or if already active its range increases by 1 until it ends."
      ]
    ],
    fear: "The organ's player or owner becomes the target of the Circus Clown effect."
  },
  {
    name: "Camera of occultation", kind: "artefact", page: "253", level: "8",
    entities: ["The Spiral"],
    stress: "3 on recognizing what the camera can do; 1 for each week of using it.",
    effect: [
      "An old camera with a cracked lens. It hides everything within very long range from being sensed by the Entities (The Spiral included) and their Avatars and aspects, and it blocks the active use of paranormal abilities in that area."
    ],
    fear: "The camera stores up the worry of a life in hiding. When it is taken or stolen, it releases all of it to feed The Spiral: the owner dies on a failed Intellect defense roll, and everyone in short range takes a serious injury on a failed Speed defense roll."
  },
  {
    name: "Chelicerae", kind: "artefact", page: "254", level: "5",
    entities: ["The Web"],
    stress: "3 when a viewer realizes what the website is for; 3 when used.",
    effect: [
      "A hard-to-find, primitive message board where every thread is titled with a person's name. A user who starts a thread named for someone they want dead and posts a horrible true experience they (or a loved one) suffered brings that person to The Web's attention. Impressing The Web (or an Avatar such as The Weaver) takes a difficulty 5 Intellect-based storytelling roll; on a success the named person is marked for death.",
      "A marked NPC of level 5 or lower \"dies\" within the week and becomes a bewebbed puppet (p200).",
      "A marked PC enters a personal Horror Mode whose range grows by 1 each day. Once the range reaches 1-5, their next triggered intrusion starts the change: they make a Might defense roll every few hours, and if they fail three before succeeding on three, they become a bewebbed puppet.",
      "Hacking the site and deleting the thread before the victim succumbs makes The Web lose interest."
    ],
    fear: "The story fails to impress The Web, and the poster is marked for death instead."
  },
  {
    name: "Coffin of The Buried", kind: "artefact", page: "254", level: "7",
    entities: ["The Buried"],
    stress: "3 on acquiring it; 1 when trying to use it against someone; 1 for each hour spent trapped in The Buried through it.",
    effect: [
      "An unvarnished wooden coffin bound with a padlocked chain, \"Do Not Open\" scratched into its lid. The key is always easy to find. Opened, it reveals rough stone stairs leading down into the domain of The Buried.",
      "Each time it is opened, someone within immediate range (usually whoever is closest) must succeed on an Intellect defense roll or start down the stairs. The steps narrow into passages that close in until the explorer is entombed in slowly crushing earth or stone, sometimes toyed with by a buried thing (p204) for a few rounds. Most are trapped forever, or until fear and horror finish them."
    ],
    fear: "Someone sleeping near the coffin sleepwalks to it and climbs in on a failed Intellect defense roll."
  },
  {
    name: "Dark star", kind: "artefact", page: "255", level: "7",
    entities: ["The Dark"],
    stress: "3 on acquiring the dark star and understanding how to use it; 3 with each use.",
    effect: [
      "A sphere of inky darkness, normally kept inside a structure or container. Anyone who looks at it must succeed on an Intellect defense roll or be consumed by its negative radiance. Having pledged oneself to The Dark eases this defense by four steps.",
      "A survivor of its gaze can use it to cause an apparent solar eclipse over an area 25 miles (40 km) across for one minute. This takes a one-minute ritual and a difficulty 7 Intellect task, eased by one or more steps by helpers who have also looked on it and survived."
    ],
    fear: "Someone misjudges the edge of the dark star and, on a failed Speed defense roll, falls in, taking a serious injury each round until they escape its grasp."
  },
  {
    name: "Dark wardrobe", kind: "artefact", page: "256", level: "4",
    entities: ["The Dark"],
    stress: "3 on acquiring it and realizing no light can exist inside.",
    effect: [
      "An ordinary-seeming oak wardrobe, except that no light reaches its interior, so everything stored inside must be found by touch.",
      "After a couple of days, probably while the owner is away, it spawns a lightless beast (p224) that slithers off to menace the owner or someone they know. Later it may spawn another, this time waiting until someone is there to watch it emerge."
    ],
    fear: "The Sandman (p236) emerges instead of a lightless beast."
  },
  {
    name: "Death's game piece", kind: "artefact", page: "256", level: "1d6+2",
    entities: ["The End"],
    stress: "3 on acquiring one of the pieces and understanding how to use it; 1 for each game played with it.",
    effect: [
      "A domino, die, chess piece or similar token carved from old bone. While a game using one is played, its players are wrapped in a bubble of timelessness; no time passes outside. The bubble collapses if a player tries to affect anyone or anything outside it, if anyone leaves, or if someone wins."
    ],
    fear: "Death (p210) takes an interest in one of the players."
  },
  {
    name: "Entombing crate", kind: "artefact", page: "256", level: "1d6",
    entities: ["The Buried"],
    stress: "3 on realizing the threat the crate poses (and/or on being entombed).",
    effect: [
      "Opening this old wooden crate while it's empty draws The Buried's attention to the opener for four days, wherever they go. If they stay awake for all 96 hours, nothing happens. If they doze off, they wake sealed inside the crate in total darkness, pressed in on every side by splintering wood.",
      "One day passes outside for every four inside. A trapped victim can try a Might-based escape, hindered by two steps; each failure deals 1 Stress from splinters. They also take 1 Stress for each hour of confinement as the space shrinks. Otherwise they must wait for someone outside to open the crate. Anyone who dies in there isn't in the crate when it's next opened."
    ],
    fear: "A distraction or accident means the marked character falls asleep."
  },
  {
    name: "Flesh grinder", kind: "artefact", page: "257", level: "5",
    entities: ["The Flesh"],
    stress: "3 on recognizing what it can do; 2 with each use.",
    effect: [
      "A rusty antique iron meat grinder with a vise clamp and crank. While no one has claimed it, each new person who sees it must succeed on an Intellect defense roll or become fascinated and claim it.",
      "Its claimant (or anyone who identifies it) can regrow a lost finger, hand, foot, arm or leg by feeding the stump into the funnel and cranking until a new limb emerges from the mince. The new tissue can be reattached with full use, or put to some other purpose.",
      "Someone fascinated with the grinder must succeed on an Intellect defense roll each day or use it even when they have no need."
    ],
    fear: "The user can't stop themselves feeding another hand, foot or limb into the grinder, destroying the original."
  },
  {
    name: "Fractal pot", kind: "artefact", page: "258", level: "6",
    entities: ["The Spiral"],
    stress: "3 on acquiring the pot and understanding how to use it (or realizing what it has been doing); 1 for each object it annuls.",
    effect: [
      "A Ming-style ceramic pot painted with blue geometric lines that converge endlessly. Whoever first claims it must succeed on an Intellect defense roll; on a failure it starts erasing things they value, about one a day, so thoroughly that the objects never existed except in the owner's memory.",
      "If the owner tries to destroy the pot, watches it closely for several hours, or gives it away after it has begun taking things, it spits everything back out. A round later, long pale fingers creep over the rim and an aspect of The Stranger (level 6) emerges, impossible to remember once someone looks away. It tries to drag the owner into the pot; enough force drives it back, otherwise the owner vanishes. An owner who flees is safe, and the pot can then be claimed by or sold to someone else."
    ],
    fear: "Someone the owner cares about is erased from existence."
  },
  {
    name: "Gorilla skin", kind: "artefact", page: "259", level: "5",
    entities: ["The Stranger"],
    stress: "1 on acquiring it and recognizing its significance; 1 with each use.",
    effect: [
      "An ancient taxidermized gorilla hide. Worn like a cape, it makes the wearer appear as a stranger even to people who know them; not anyone in particular, just someone nobody knows. Where it matters, the wearer's stealth and disguise tasks are eased by three steps.",
      "It can serve as the Unknowing ritual's \"costume of special power or distinction\" (p175)."
    ],
    fear: "The wearer stops recognizing themself in the mirror, and their body sometimes acts as if it belongs to someone else, randomly hindering some tasks and easing others."
  },
  {
    name: "Lonely painting", kind: "artefact", page: "259", level: "1d6",
    entities: ["The Lonely"],
    stress: "3 on acquiring the painting and understanding its effect.",
    effect: [
      "A drab landscape with no people, animals or action in it. After owning it for a few days, the owner is pulled into The Lonely on a failed Intellect defense roll, wandering alone through a muted, misted mirror of the painted scene. They take 1 Stress each hour they fail an Intellect defense roll, and can make an Intellect-based task each minute they search for a way out; on a success they reappear between a few yards and a few miles from where they vanished."
    ],
    fear: "However it was stored, covered or hidden, the painting is inexplicably back on full display."
  },
  {
    name: "Mirror of beholding", kind: "artefact", page: "260", level: "1d6",
    entities: ["The Eye"],
    stress: "2 on recognizing the mirror's horrible reflection; 1 when using it on someone else.",
    effect: [
      "Anyone who sees their own reflection in this antique hand mirror also sees a huge staring face somewhere behind them. Whatever they do next, even smashing the mirror, they become the observed subject of a mirror haunt (p228) on a failed Intellect defense roll."
    ],
    fear: "Despite every precaution, an accident leaves the bearer (or someone nearby) looking at their own reflection in the mirror."
  },
  {
    name: "Patterned rug", kind: "artefact", page: "260", level: "5",
    entities: ["The Spiral"],
    stress: "3 on recognizing the pattern as a personal threat; 3 on seeing the pattern attack someone else.",
    effect: [
      "When this old rug is unrolled and its pattern of squares and diamonds is glanced at, an aspect of The Spiral (level 5, stealth as level 7; an immediate-range gaze attack dealing 3 Stress) forms from the design and looks back. If several people look, it fixes on the nearest; the rest see only a pattern.",
      "Within three hours (perhaps at once) the aspect leaves the rug to hunt its chosen target. If it kills them, the pattern enters the corpse, which thrashes for about a minute and goes still. Within an hour, a deceitful arc (p211) blazing with the rug's pattern bursts from the body, burning it to ash, and escapes into the sky unless the rug binds it."
    ],
    fear: "Whatever holds the rug closed (container, strap or similar) fails, and it flops out and unrolls."
  },
  {
    name: "Pestilent scalpel", kind: "artefact", page: "261", level: "5",
    entities: ["The Corruption"],
    stress: "3 on acquiring it and realizing it can't be sterilized; 1 each time it is used to attack someone.",
    effect: [
      "A corroded, pitted scalpel, usually kept in a sealed plastic box. Whenever it's exposed to air (and about once a day while it stays exposed), it sheds a new airborne disease. Everyone in immediate range must succeed on a Might defense roll or catch it (a level 5 disease) and immediately take 2 Stress. Each day the sick must succeed on a Might defense roll or take a serious injury; three successes and they shake it off.",
      "It works as a light weapon (p100). Each hit gives the target another new disease on a failed Might defense roll."
    ],
    fear: "The sealed box holding the scalpel cracks, leaks or shatters."
  },
  {
    name: "Rock eye", kind: "artefact", page: "261", level: "5",
    entities: ["The Eye"],
    stress: "3 when the owner understands its effect; 1 with each use.",
    effect: [
      "A carved stone eye kept in a black velvet bag. Taking it out eases the holder's perception tasks by two steps, but their other Intellect-based tasks are hindered for an hour after they remove it from the bag."
    ],
    fear: "The Abiding Watcher (p196) notices the rock eye's owner."
  },
  {
    name: "Slaughter gun", kind: "artefact", page: "261", level: "5",
    entities: ["The Slaughter"],
    stress: "3 on acquiring the pistol and realizing where it came from.",
    effect: [
      "A Luger pistol (a long-range medium weapon, p100). Handling it without gloves means a Speed defense roll or 1 Stress from splinters in the grip. The gun seems eager: the user can spray shots at one target to ease the attack, spending only one round of ammunition.",
      "Once someone fires it, they must succeed on an Intellect defense roll or attack every living creature within short range, without using any ammunition. Each round they can make an Intellect defense roll to drop the gun and end the compulsion, taking 3 Stress from the experience."
    ],
    fear: "Someone who handled the gun safely (or shook off its compulsion) begins secretly to crave it. If they don't seek it out within the week, it turns up among their belongings anyway."
  },
  {
    name: "Slaughter knife", kind: "artefact", page: "262", level: "5",
    entities: ["The Slaughter"],
    stress: "3 on acquiring the knife and realizing its power.",
    effect: [
      "A rusted military trench knife (a light weapon, p100). Anyone who handles it directly must succeed on an Intellect defense roll or attack every living creature within short range with it. Each round they can make an Intellect defense roll to drop it and end the compulsion."
    ],
    fear: "The wielder turns the knife on themself and takes a serious injury, and keeps doing so each round until they drop it with an Intellect defense roll or an ally wrestles it away."
  },
  {
    name: "Syringe of Dr. Snow", kind: "artefact", page: "262", level: "6",
    entities: ["The Corruption"],
    stress: "1 on recognizing it as a supernatural object; 3 on realizing its protection is gone after losing it.",
    effect: [
      "A well-kept Victorian syringe in its own small case, said to have belonged to the physician John Snow. Whoever holds it eases their defense tasks against disease by three steps, and nearby manifestations of The Corruption (disease, paranormal rot, insect swarms and the like) are suppressed or hindered by three steps."
    ],
    fear: "The syringe is lost, sold or goes missing, and the owner draws the vengeful attention of The Corruption or one of its Avatars, such as The Plaguebearer (p233)."
  },
  {
    name: "Thrumming cocoon", kind: "artefact", page: "263", level: "5",
    entities: ["The Web"],
    stress: "3 on seeing the cocoon and recognizing it as a threat; 1 when deliberately revealing it to someone else.",
    effect: [
      "A silk-wrapped object usually kept in a steamer trunk. When first seen it begins to vibrate and thrum. The viewer (or whoever is nearest, if several see it) is frozen with horror on a failed Intellect defense roll as the silk falls away from an animate metal spider (level 5, health 20).",
      "The spider hollows out and drinks the helpless victim, inflicting a serious injury every few rounds, unless others distract or destroy it. The victim can retry the Intellect defense roll each round to break free of their paralysis."
    ],
    fear: "The metal spider animates by itself and stealthily seeks out someone who saw it and survived, someone otherwise marked by The Web, or a random victim."
  },
  {
    name: "Web lighter", kind: "artefact", page: "264", level: "1d6+3",
    entities: ["The Web"],
    stress: "3 on realizing its true nature.",
    effect: [
      "A gold flip lighter embossed with a spiderweb. It never runs out of fuel, and if lost or stolen it quietly turns up among its owner's things again.",
      "The owner never consciously notices they carry it; if someone points it out, they change the subject on a failed Intellect defense roll. Yet it is always to hand when fire would only make things worse. Avatars of The Web, including The Weaver, can track its owner and manifest their power around them."
    ],
    fear: "Even when deliberately left behind it finds its way back. If destroyed, a new one is delivered."
  },
  {
    name: "Web table", kind: "artefact", page: "264", level: "7",
    entities: ["The Web"],
    stress: "1 on studying the table; 1 when using it.",
    effect: [
      "A large dark-wood table carved with a hypnotic pattern that draws the eye to a small square recess at its center. Someone who knows about the Entities, such as a dabbler (p209), or who has identified the table, can make an Intellect-based attack against an Avatar or aspect of an Entity within short range. On a success the target is swallowed by the table, able to see and hear what happens around it but not act.",
      "An Avatar or similarly powerful being can still remanifest, but can't stray more than very long range from the table, has all its tasks hindered by three steps, and can't harm the table itself."
    ],
    fear: "By accident, design or misunderstanding, the table is destroyed, freeing at least one bound Avatar or aspect, such as an angry NotThem (p230)."
  },
  {
    name: "Web tape recorder", kind: "artefact", page: "265", level: "1d6+2",
    entities: ["The Web"],
    stress: "1 each time someone notices one that shouldn't be there, or it starts recording by itself.",
    effect: [
      "These look and work like 1980s cassette recorders. Most people never notice anything odd, except that they capture statements of supernatural events (or the events themselves) with less distortion than digital recorders.",
      "Once someone draws the attention of The Weaver or another powerful Avatar of The Web, the recorders begin creeping into their life, at first plausibly, later appearing from nowhere to record. The sending Avatar hears everything they record."
    ],
    fear: "Someone who realizes where the recorder's loyalty lies forgets the incident that revealed it."
  },
  {
    name: "Yushanka chatbot", kind: "artefact", page: "265", level: "4",
    entities: ["The Spiral", "The Flesh"],
    stress: "1 the first time the chat window is opened and used; 1 for every few hours of the video watched (seventeen hours in all); 1 each time the video starts playing on another screen near the victim.",
    effect: [
      "A basic chatbot program, found in several digital forms such as a file named YushankasDespair.exe. A prompt is answered with a scrolling jumble of symbols in which words and phrases surface, until a video starts: a weeping man eating keyboard keys.",
      "If the viewer shuts the computer down, the video moves to another nearby screen (even one switched off or unplugged), visible only to them, and follows them wherever they go with growing sounds and muttering. The haunting ends only when the viewer sits through all seventeen hours, however sick and dizzy it makes them."
    ],
    fear: "The viewer is compelled to eat their own keyboard; if they go through with it, they take a serious injury."
  },
  {
    name: "The Anatomy of Melancholy", kind: "book", page: "268", level: "5",
    entities: ["The Eye"],
    stress: "3 if a reader resists the book's attempt to read them; none if they succumb.",
    effect: [
      "A unique Russian translation of Robert Burton's study of melancholy. Anyone who glances at a page, even without reading the language, must succeed on an Intellect defense roll or be \"read back\" and drained of emotion for about an hour.",
      "A drained victim can't act on their own will. They carry out tasks others command, without feeling, but lapse into stillness unless the command is constantly repeated. They can make an Intellect defense roll each minute to end the effect early."
    ],
    fear: "On a failed Might defense roll, the book reads more than emotion and physically erases part of the reader's body: an ear, an eye, a hand, or sometimes all of them."
  },
  {
    name: "The Boneturner's Tale", kind: "book", page: "268", level: "6",
    entities: ["The Flesh"],
    stress: "3 on realizing the book's power; 1 with each use.",
    effect: [
      "A thick, anonymous black paperback in which a new pilgrim, the Bonesmith, joins the Canterbury pilgrims, with grisly results. Each hour spent studying it lets the reader attempt one permanent gross change to their own body: taller by up to a foot (30 cm), sharpened fingers, more attractive, extra muscle, an extra organ, eye or mouth, and so on.",
      "A purely cosmetic change takes a difficulty 2 Intellect-based roll. A change with a basic mechanical benefit (easing Might-based tasks from muscle, easing interaction from uncanny symmetry, +1 damage from sharpened fingers) takes difficulty 4. Each further change made while benefiting from an earlier one is hindered by an additional step.",
      "On a failure, the reader takes 3 Stress as their body slumps like wet clay, hindering all physical tasks and undoing earlier benefits for about ten hours, during which no more changes can be tried.",
      "The reader can change a willing person the same way. Against an unwilling one, they must first hit with an attack roll, then make the Intellect-based roll.",
      "If stored with ordinary books after use, the books around it start to bleed."
    ],
    fear: "The reader draws an Entity's attention. They must stop using the book entirely, or keep going knowing they are entering a contract with The Flesh that may demand they become an Avatar."
  },
  {
    name: "Book of the Dead", kind: "book", page: "269", level: "6",
    entities: ["The End"],
    stress: "1 on realizing the book details the reader's future; 3 each time it is reopened and the predicted death has changed.",
    effect: [
      "A heavy, worn black-cloth book whose text shifts from Latin through Middle English to modern English. Each entry describes a death in graphic detail; every one recorded really happened as written. The second-to-last entry is the death of its previous owner, and the last predicts the current reader's horrible death about eleven years from now.",
      "Each time the reader closes and reopens it, the manner of death changes, just as bad or worse, and the date moves about 20 percent closer. A reader who stops checking meets the last death described. Someone with ties to other Entities might save themself, though Avatars of The End become their enemies.",
      "If several people pass it around at once, its final pages may hold several predictions; handing it on doesn't change the previous reader's fate. The d10 Unpleasant Deaths table (p271) offers inspiration."
    ],
    fear: "Rather than drawing 20 percent closer, the reader's predicted death is set for the next three days."
  },
  {
    name: "Catalogue of the Trapped Dead", kind: "book", page: "270", level: "7",
    entities: ["The End"],
    stress: "3 on acquiring the book and realizing its power; 3 when performing the ritual to make a new page; 1 each time a spirit is questioned.",
    effect: [
      "A large, misshapen book of crude parchment pages handwritten in Sanskrit and other languages; anyone can read a page whether or not they know the language. Each page describes how one person died.",
      "Reading a page thickens the air with a smell of wet earth and summons that person's immaterial spirit, which the reader can question about anything it knew in life. It needn't answer, and may beg or bargain instead. Most spirits are in constant pain and want release; removing and burning their page frees them, while a removed page that is kept can still summon them later.",
      "A spirit (or another source) can teach the binding ritual: kill someone, ink a description of their death onto their skin, cut that skin away, dry it and stitch it in as a new page."
    ],
    fear: "The Tome Hoarder (p240) appears to reclaim what she considers her property."
  },
  {
    name: "Dead Animals", kind: "book", page: "271", level: "3",
    entities: ["The Flesh"],
    stress: "3 on realizing the book materializes bones.",
    effect: [
      "An unremarkable book of Sanskrit poems about dead animals. If passed through a shadow before being opened, a handful of slightly warped small-animal bones falls out. This can be repeated; after a few times in one encounter, Horror Mode begins, or if already active its range increases by 1 until the encounter ends."
    ],
    fear: "A nearby animal a character noticed is gone, leaving only a small pile of fur, feathers or scales."
  },
  {
    name: "Dictionnaire Infernal", kind: "book", page: "272", level: "4",
    entities: ["The Eye"],
    stress: "3 on realizing the book's power; 1 with each use.",
    effect: [
      "A unique edition of de Plancy's \"Infernal Dictionary\", dated 1908. Reading a few words from it eases the reader's tasks to perceive abnormal presences and influences for one hour, including ones normally imperceptible. For the same hour, tasks to hide from or defend against those presences and influences are hindered."
    ],
    fear: "The book summons an aspect of an Entity, such as a lightless beast (p224), greyling (p220) or buried thing (p204), which attacks the reader."
  },
  {
    name: "DIG", kind: "book", page: "272", level: "4",
    entities: ["The Buried"],
    stress: "1 after reading a few pages; 1 each time a defense roll against its compulsion is failed.",
    effect: [
      "Every page holds the single word DIG. Anyone who reads a few pages slowly develops an obsession with digging down to somewhere safe beneath the crushing earth. Once a day they make an Intellect defense roll; three successes before three failures breaks the obsession.",
      "After three failures, they find somewhere to bury themself in the earth (or whatever is nearest), with bare fingernails if need be. Those who do it unobserved usually smother. Someone saved by a third party gets three more Intellect defense rolls to shake the fascination."
    ],
    fear: "The book's containment (a wrapping, a welded metal box) is disturbed and the blurred letters of its cover are left on view, inviting the curious."
  },
  {
    name: "A Disappearance", kind: "book", page: "273", level: "6",
    entities: ["The Lonely"],
    stress: "3 on realizing the book's power; 1 with each use.",
    effect: [
      "A twelve-page 1910 pamphlet. Reading just a word or two makes the reader invisible and intangible, beyond the reach even of spells and abilities that normally find hidden things, until they choose to reveal themself.",
      "Reading it cover to cover (about a minute) removes the reader from the world, with no defense roll, into The Lonely. They wander alone through a muted, misted mirror of reality, taking 1 Stress each hour they fail an Intellect defense roll, and can make an Intellect-based task each minute they search for a way out; on a success they reappear between a few yards and a few miles from where they vanished."
    ],
    fear: "Whether they mean to or not, the reader starts reading the whole pamphlet on a failed Intellect defense roll."
  },
  {
    name: "Ex Altiora", kind: "book", page: "273", level: "6",
    entities: ["The Vast"],
    stress: "3 each time the woodcut of the clear night sky is examined carefully.",
    effect: [
      "A calf-bound Latin poem in the style of Virgil about a creature so vast its head is lost in the clouds, ending with villagers throwing themselves off a cliff. It includes woodcuts of mountains, cliffs and an empty night sky. A glance at the night-sky woodcut brings a brief feeling of falling.",
      "Studying that woodcut carefully calls for an Intellect defense roll. On a success, for seven days the reader can land safely from a fall of any height, taking only 3 Stress. On a failure, extreme vertigo hinders all their physical tasks by three steps for an hour."
    ],
    fear: "Someone using the book's protection instead falls endlessly for an hour through a seemingly infinite layer of The Vast. They can make an Intellect defense roll each round to end it, and otherwise take 1 Stress every ten minutes."
  },
  {
    name: "A Guest for Mr. Spider", kind: "book", page: "274", level: "6",
    entities: ["The Web"],
    stress: "2 after reading the first scene (Mr. Bluebottle); 1 for each later scene the reader is compelled to read.",
    effect: [
      "A children's picture book in which Mr. Spider receives a series of visitors through the left-hand door of a bare room, is never satisfied with their gifts, and is implied to eat each one: Mr. Bluebottle, Mrs. Fruit, Mr. Horse and his son. Its second-to-last page shows the right-hand door with a flap to open, and a polite request that the reader knock, because Mr. Spider wants another dinner guest.",
      "After reading the first scene the reader must succeed on an Intellect defense roll or keep reading, with another roll after each scene to stop, unless someone intervenes. Failing on the second-to-last page compels the reader to travel to a nearby dwelling where a huge spider-shaped aspect of The Web waits (level 6; webbing grabs a target on a hit; a grabbed target takes a serious injury each round until they escape; its kills rise as bewebbed puppets, p200). Whoever knocks is seized and dragged inside, and eaten if they can't escape."
    ],
    fear: "Wherever someone who has read even one page goes, a spider is somewhere watching them, always the same spider."
  },
  {
    name: "Infinity Above: A Book of Astronomy", kind: "book", page: "275", level: "4",
    entities: ["The Vast"],
    stress: "3 on realizing most of the book shows strange constellations; 1 each time a reader gains the ability to see in the dark.",
    effect: [
      "A modern coffee-table book of color-corrected telescope photographs. After the first few, the constellations match nothing on Earth and carry names like Corpse King and Fang in the Night.",
      "A reader who realizes this (or anyone who flips through a handful of pages) can see in the dark for a day and can always see the stars overhead, even indoors or underground, day or night. Meanwhile the strange constellations are reflected in their eyes."
    ],
    fear: "A reader who still owns the book is whisked up into what seems like open space but is a breathable layer of The Vast. They make an Intellect defense roll each round: three successes before three failures returns them; three failures first leaves them spinning there forever, or until rescued."
  },
  {
    name: "An Introduction to Higher Anatomy", kind: "book", page: "276", level: "6",
    entities: ["The Flesh"],
    stress: "3 on realizing the book's power; 3 the first time a reader eats human brain.",
    effect: [
      "An early-1900s study of the nervous system and brain. Anyone who skims a page or two must succeed on an Intellect defense roll or, unless stopped, read it all, which takes a couple of hours.",
      "Finishing it brings numbness, tingling and weakness in the hands and feet, hindering physical tasks. The reader becomes convinced that eating untainted nerve tissue will cure them, and is right: animal brains give a few hours' relief, human brains a real cure.",
      "A reader who stops after just a page or two instead eases their Intellect defense rolls by two steps for one day."
    ],
    fear: "Human brains relieve the affliction for only about a month before it returns, and the relief gets shorter each time, demanding more brains."
  },
  {
    name: "A Journal of the Plague Year", kind: "book", page: "276", level: "6",
    entities: ["The Corruption"],
    stress: "3 on realizing the book's power; 1 with each use.",
    effect: [
      "A unique copy of Defoe's novel of the London plague. Reading a couple of pages makes the reader immune to disease and poison for seven days, but on a failed Might defense roll they also become a symptomless carrier of a new airborne disease for that time.",
      "Anyone who comes within immediate range of a carrier must succeed on a Might defense roll or catch it and immediately take 2 Stress. Each day they fail a Might defense roll they take a serious injury; three successes and they recover. Someone who knows the book can try to keep to themselves for the week.",
      "The owner can instead take a disease from someone infected, curing them but becoming a carrier of a virulent strain of it.",
      "Left open and unattended in one place for more than a day, the book infects the building itself, which rots and, within seven days, collapses into rotten wood and powdered stone."
    ],
    fear: "The reader risks catching the disease they once carried unless they read a few more pages and spawn a new pathogen."
  },
  {
    name: "The Joy of Eating", kind: "book", page: "277", level: "5",
    entities: ["The Flesh"],
    stress: "1 each time someone understands a recipe; 3 if the book tries to eat the cook.",
    effect: [
      "A glossy modern cookbook whose cover chef is not smiling but grimacing in terror. Every recipe uses meat. Understanding a recipe takes a successful Intellect defense roll each time it's attempted; if the dish is then made that day, everyone who eats it gains a free one-action recovery roll (once per day)."
    ],
    fear: "The book begins eating the reader, starting with their hands, its letters gnashing like teeth. Each round they fail a Might defense roll they take a serious injury; three successes before they die and they pull free."
  },
  {
    name: "The Key of Solomon", kind: "book", page: "278", level: "6",
    entities: ["Potentially all the Entities"],
    stress: "3 on realizing the book's true nature; 1 for each attempt to summon a monster.",
    effect: [
      "What looks like an English edition of a demonology grimoire is really a treatise on the Entities. Spending a minute searching it per specific question eases a related knowledge task about the Entities, their Avatars and aspects.",
      "Reading from it for a minute and succeeding at an Intellect-based roll (eased by prior study of the book and other sorcery-related skills) summons a monster of level 5 or lower tied to an Entity, arriving in a way that suits it (out of the shadows for The Dark, rising from a corpse for The End). It obeys until its task is done or a day passes, whichever comes first."
    ],
    fear: "The monster ignores the summoner and attacks the nearby ally with the lowest Might, or finishes its task and then returns to destroy the summoner."
  },
  {
    name: "Killer's Song", kind: "book", page: "278", level: "4",
    entities: ["The Slaughter"],
    stress: "3 on understanding and claiming the book; 1 with each use, successful or not.",
    effect: [
      "A neglected old paperback following a nameless character through ever more brutal fights, growing eager for each one, until a gruesome death.",
      "Once it's identified, reading a few pages and succeeding at a difficulty 4 Intellect-based task eases the reader's attack rolls for about an hour. On a failure, the reader attacks every living creature within short range with whatever is at hand, and can make an Intellect defense roll each round to come back to their senses."
    ],
    fear: "An affected reader rips the book in two down the spine, releasing an invisible manifestation of The Slaughter. Everyone in very long range who fails an Intellect defense roll attacks everyone and everything within short range, then themselves; each can make another Intellect defense roll each round to stop."
  },
  {
    name: "Roaring Desolation", kind: "book", page: "279", level: "5",
    entities: ["The Desolation"],
    stress: "3 on realizing the book's power; 3 each day the owner doesn't burn something.",
    effect: [
      "A small red-leather book of biblical-style verses praising \"The Lightless Flame\". After reading a few pages, the reader becomes supernaturally fascinated with fire: each day they don't burn something new, they take 3 Stress that can't be recovered until they do. Burning the same thing again (a cigarette, say) only counts the first time.",
      "Passing the book to someone else, or ridding themself of it permanently (sinking it at sea, sealing it in concrete), ends the fascination."
    ],
    fear: "The owner decides to set part or all of themself alight, and does so on a failed Intellect defense roll."
  },
  {
    name: "Seen", kind: "book", page: "279", level: "4",
    entities: ["The Eye"],
    stress: "3 on becoming fascinated with the book; 1 each time someone tries to tell the fascinated reader its pages are blank.",
    effect: [
      "An old, crumbling book with blank pages. Anyone who looks through it must succeed on an Intellect defense roll or become fascinated, convinced it holds a revolutionary work on something they care about. They can barely think or talk of anything else, hindering all their Intellect-based tasks.",
      "Each day someone tries to persuade them the pages are blank, they can make another Intellect roll; after three successes the fascination ends."
    ],
    fear: "A watcher's husk (p245) rises in a distant tomb and slowly stalks the reader, who sees it drawing closer whenever they close their eyes."
  },
  {
    name: "Security camera instruction manual", kind: "book", page: "280", level: "6",
    entities: ["The Eye"],
    stress: "2 on seeing one's own face in it; 3 on realizing what it can do; 1 with each use.",
    effect: [
      "A yellowed, water-damaged ten-page pamphlet for a multicamera recorder. Anyone who glances through it has an even chance of finding a black-and-white photo of their own face inside.",
      "Whoever identifies or studies it can use the abilities below while carrying it, without needing access or a device. Each use begins Horror Mode, or if it's already active increases its range by 1 until the end of the day or encounter, whichever is longer.",
      [
        "Use an action to see through any camera within very long range.",
        "Delete or insert sound and images, up to a couple of rounds per use, in digital footage from any security camera within very long range."
      ]
    ],
    fear: "The owner becomes fascinated with the manual and with watching others through surveillance, neglecting everything else. Each day someone tries to convince them this is strange, they can make an Intellect roll; three successes end it. Three failures (or three days without a roll) and the nearest CCTV system consumes them bodily, their spirit watching from it forever."
  },
  {
    name: "The Seven Lamps of Architecture", kind: "book", page: "281", level: "6",
    entities: ["The Buried"],
    stress: "3 on realizing the book's abilities; 1 each time the reader feels the walls pressing in; 1 each time one of its abilities is used.",
    effect: [
      "An impossible early edition of Ruskin's book with handwritten notes in its margins. Touching or reading it inside a building means a Might defense roll or labored breathing and the sense of walls closing in, hindering physical tasks until the reader has been outside for about a minute.",
      "Someone who identifies it can use these abilities while they have it:",
      [
        "After concentrating for a few rounds, find the way through a structure or artificial tunnel to a known room, area, person or object, with an Intellect-based task at the level of the structure or the thing sought.",
        "After reading for one round, make an attack roll to reshape the building or tunnel they're in, walling off someone they can see inside it. The victim must overcome a level 6 doorless room (or sometimes a maze) or wait to be freed by someone with the same book or ability."
      ]
    ],
    fear: "Read too recklessly (flipped through, or its powers called on too often), it entombs the reader in a lightless cavity inside the walls, too narrow to move or read in."
  },
  {
    name: "Spiders Are Eating", kind: "book", page: "282", level: "4",
    entities: ["The Web"],
    stress: "1 the first time the novella is read; 1 on realizing spiders are drawn to the book.",
    effect: [
      "A thin hardcover novella about spiders, from ordinary to house-sized, eating everyone in a small town. Left alone for more than a few hours, it is always found crawling with spiders, however it was sealed away.",
      "After about a week with a new owner, it manifests a monstrous spider nearly twice a person's size in the nearest basement, cellar or other hidden place (level 4, stealth as level 7; climbs a short distance each round; an immediate-range web catches a target on a failed Speed defense roll, preventing physical actions until they escape, and each round it adds a layer that hinders escape by another step). It webs up and eats people nearby at its leisure, saving the owner for last, and crumbles to dust and cobwebs if defeated."
    ],
    fear: "Someone the owner knows is found completely cocooned in web, dry and drained of blood."
  },
  {
    name: "The Stalwart Hunters' Almanac", kind: "book", page: "283", level: "4",
    entities: ["The Flesh", "The Hunt"],
    stress: "2 each time a topic in it is read; 1 each time knowledge from it is put to use.",
    effect: [
      "A leather-bound book of grisly hunting anecdotes, some about animals and a few about people, most ending with the prey butchered for a meal. Reading an anecdote (about ten minutes) and succeeding at a difficulty 4 Intellect-based task to understand it eases the reader's tracking tasks for one day."
    ],
    fear: "A manifestation of The Flesh and The Hunt marks the reader as prey, and if it catches them does to them what the almanac describes."
  },
  {
    name: "The Tale of a Field Hospital", kind: "book", page: "283", level: "5",
    entities: ["The Corruption"],
    stress: "1 from each papercut; 3 on realizing the papercut is horribly infected.",
    effect: [
      "What seems a proof or draft of Sir Frederick Treves's account of the Second Boer War, with pages printed at different times. Its anecdotes dwell on sudden deaths from sepsis, fever and stranger diseases, and keep returning to a Private Amherst who dies, comes back with a new ailment, and dies again."
    ],
    fear: "The reader gets a papercut from its pages that quickly putrefies. Each day they must succeed on a Might defense roll or take a serious injury; three successes before dying and they survive, perhaps only by losing a finger, hand or arm to amputation."
  },
  {
    name: "The Travels", kind: "book", page: "284", level: "5",
    entities: ["The Spiral"],
    stress: "3 on realizing the book's power; 1 with each use.",
    effect: [
      "A pale blue, gold-tooled English translation of Ibn Battuta's travels. Once it's identified, the reader can read from it for at least a minute and then step through the nearest closed door, aiming for a place they have visited or know exists. On a difficulty 5 Intellect roll, windowless corridors beyond lead there after a minute or so of walking; on a failure, the door opens where it normally would."
    ],
    fear: "The reader steps into a windowless corridor of green swirling wallpaper, wall lamps, mirrors and paintings of the same corridor, and is lost in a maze. Each minute they can make an Intellect-based roll to find a door or break a mirror leading out; each failure deals 1 Stress. A traveler who dies inside is spat out of the door they entered a few minutes after they went in, however long they spent inside."
  },
  {
    name: "Whispers in White Matter", kind: "book", page: "284", level: "5",
    entities: ["The Spiral"],
    stress: "3 on realizing the book's power; 1 each time it is deliberately used to add or remove a memory.",
    effect: [
      "A scuffed, bulky journal, its title in black marker, filled with handwritten entries by several different people. On realizing this, the reader must succeed on an Intellect defense roll or the last entry they read vanishes from the page and becomes their own memory.",
      "Someone who understands it can erase memories from their own mind by writing them in it, or take on memories written there (without knowing what they'll get until they read). After a couple of rounds of uninterrupted writing, the owner can make an Intellect attack against someone in short range; on a success they delete a simple memory from that person or plant a simple false one."
    ],
    fear: "The reader takes on a horrifying entry about getting ever more lost in The Spiral's endless corridors. On a failed Intellect defense roll they are catatonic, wandering The Spiral in their memory, until a third party removes it."
  }
];
