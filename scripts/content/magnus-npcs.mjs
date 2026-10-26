/**
 * The NPCs and monsters from The Magnus Archives Roleplaying Game, chapter 12
 * (p192-247), plus the Other Encounters tables (p195, also printed as the
 * FREE PREVIEW p15).
 *
 * Mechanics are reproduced faithfully: level, health, damage inflicted,
 * movement, modifications, the Stress a PC takes on first seeing the monster,
 * and every combat ability. Descriptions, interaction and use notes are short
 * paraphrases, not the book's prose; the podcast quotes are left out.
 *
 *   damage       "serious" for a serious injury, or a number of Stress points
 *   visage       the Stress graphic beside the level (0 when the book prints none)
 *   mods         modifications; `contexts` are the roll tags they apply to:
 *                  attack   a PC attacking the NPC (its Speed defense)
 *                  defense  a PC defending against the NPC's attack
 *                  anything else is a descriptive tag for the GM
 *   sidebar      true for a stat line printed in a margin note rather than a
 *                full entry
 */

/** A modification. `mode` defaults to the book's usual "as level N". */
function mod(label, contexts, value, note = "", mode = "levelOverride", predicate = {}) {
  return {label, contexts, value, note, mode, predicate};
}

const ATTACK = ["attack"];
const DEFENSE = ["defense"];

export const MAGNUS_NPC_FOLDERS = [
  "The Buried",
  "The Corruption",
  "The Dark",
  "The Desolation",
  "The End",
  "The Eye",
  "The Flesh",
  "The Hunt",
  "The Lonely",
  "The Slaughter",
  "The Spiral",
  "The Stranger",
  "The Vast",
  "The Web",
  "Any Entity",
  "Animals",
  "People"
];

export const MAGNUS_MONSTERS = [
  {
    id: "abiding-watcher", name: "The Abiding Watcher", page: 196, folder: "The Eye",
    level: 6, health: 21, visage: 0, entity: "The Eye", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Perception", ["perception"], 9)],
    summary: "A long-lived Avatar of The Eye who hops from body to body across the centuries. His current host is a reserved, oddly young-looking man with an old-fashioned haircut and cold grey eyes far older than his face.",
    combat: "He might pummel a target with an improvised weapon such as a hammer or pipe, but mostly relies on his supernatural abilities.",
    abilities: [
      ["Alter Memory", "A target he can see who fails an Intellect defense roll gains a short memory or piece of information (or disinformation) of his choosing. He can insert recorded footage, such as CCTV, the same way."],
      ["Body Hop", "After one hour of \"operating\" on a helpless target, his consciousness passes into them if they fail three Intellect defense rolls (one each round) before succeeding on three. The new body's eyes are replaced with those of his previous body."],
      ["Eye of Knowing", "He learns about a topic by concentrating on it. If the topic is a character, they keep their secret only with a successful Intellect defense roll."],
      ["Open the Eye", "As his action he can see out of any eyelike object or image, camera, or actual eye anywhere in the world that isn't protected from supernatural scrutiny. A character resists him seeing through their eyes with a successful Intellect defense roll."]
    ],
    interaction: "He only admits his true nature to those who have already guessed it, and hides his real purpose: enacting the Watcher's Crown, a ritual to make The Eye ascendant. That is why he watches, and sometimes attacks, other Avatars.",
    use: "The PCs might know him under another guise, perhaps as the head of their own paranormal investigation group.",
    gmIntrusion: "The character feels a distant call and, on a failed Intellect defense roll, feels compelled to follow it. It leads to The Abiding Watcher.",
    extra: ["Podcast name: Elias Bouchard, the latest of many stolen identities going back to Jonah Magnus.", "See The Watcher's Crown (p172)."]
  },
  {
    id: "anglerfish", name: "The Anglerfish", page: 197, folder: "The Stranger",
    level: 7, health: 23, visage: 3, entity: "The Stranger", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Stealth", ["stealth"], 8), mod("Persuasion", ["persuasion"], 2)],
    summary: "A hidden predator that dangles a humanoid lure into the light to draw victims into the dark, where it takes them and their skin.",
    combat: "It bites, but only a target who moves to help its humanoid lure or follows the lure into the darkness.",
    abilities: [
      ["Skinner", "The skin of a target it bites begins to lift and peel. A target killed by these bites is usually never seen again as they were (see Allied Skin Shell)."],
      ["Allied Skin Shell", "A Skinner victim may return later as a taxidermized skin shell. The Anglerfish may appear near skin shells made from past victims, which coax or trick a target toward its lure."],
      ["Withdraw", "If directly targeted or at risk of being revealed, it folds its lure at the waist and jerks it back into the darkness, then escapes unseen from every onlooker who fails a perception task against its stealth (level 8)."]
    ],
    interaction: "It speaks only through its lure, whose mouth never moves, repeating one flat, mechanical phrase meant to entice prey into the dark, such as an invitation to come and look at something.",
    use: "The PCs can encounter it and survive if they don't take the bait. Anyone who does is in serious danger, even with the whole group helping.",
    gmIntrusion: "A character who sees The Anglerfish withdraw its lure must succeed on an Intellect defense roll or gain 3 Stress.",
    extra: ["See Skin shell (p238)."]
  },
  {
    id: "archivist", name: "The Archivist", page: 198, folder: "The Eye",
    level: 7, health: 21, visage: 0, entity: "The Eye", damage: 3,
    movement: {category: "short"},
    mods: [
      mod("Attacks", DEFENSE, 3),
      mod("Might", ["might"], 3),
      mod("Knowledge skills, languages and secrets", ["knowledge"], 8)
    ],
    summary: "A slight, prematurely grey man who looks like he hasn't slept in a week, scarred by past encounters: worm pocks, a burned hand and more. He catalogues the paranormal by taking statements, willing or not, and is fed by them.",
    combat: "He rarely attacks physically, preferring to flee or use one of his abilities to neutralize a foe.",
    abilities: [
      ["Compel Statement", "A subject in immediate range he asks to answer a question or give a statement on a topic must do so on a failed Intellect defense roll, and answers must be true. A compelled statement lasts ten to twenty minutes, during which the subject can do nothing but speak truthfully, unless they take damage, which breaks the effect. Afterward nightmares hinder the subject's Intellect-based tasks for several months or longer."],
      ["Beholding Vitality", "He regains 1 health each round (even at 0 health), or 10 health on the round he finishes taking a statement."]
    ],
    interaction: "He can be rude and scornful, but shows real compassion to people harmed by the Entities, including by his own powers. He is frightened of much of what he learns.",
    use: "Not physically imposing, but compelling a statement can stop violence before it starts. Even if beaten down, his Entity-granted vitality brings him back.",
    gmIntrusion: "The Archivist compels the character to take a specific action other than answering a question or giving a statement.",
    extra: ["Podcast name: Jonathan Sims."]
  },
  {
    id: "artefact-dealer", name: "The Artefact Dealer", page: 199, folder: "Any Entity",
    level: 5, health: 21, visage: 0, entity: "All", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Occultism", ["occultism"], 7)],
    summary: "A huge, close-cropped, appraising man of Samoan ancestry with an eye for paranormal objects, who fences them to wealthy clients and to agents of the Entities alike.",
    combat: "In a pinch he attacks with a retractable baton. He may also have these prepared.",
    abilities: [
      ["Associates", "He works with two or three bodyguards (level 3)."],
      ["Useful Artefact", "He uses an artefact he is holding before resale: for example the blood money pouch to turn a group of enemies on each other, or the boatswain's call to summon or disperse thick fog."]
    ],
    interaction: "Buyers are in luck if they find him. He says little about past or future sales, though everything has a price.",
    use: "A situation involving an artefact might trace back to him, and later he is a good source for something specific, as long as the PCs don't try to rob him. He is ruthless if his business is threatened. One or two artefacts are usually somewhere nearby.",
    gmIntrusion: "The Artefact Dealer uses surprising strength to break a restraint or a foe's grip, or to break into an enclosure holding an artefact or other valuable.",
    extra: ["Podcast name: Mikaele Salesa.", "See Artefacts (p248), Blood money pouch (p251), Boatswain's call (p252)."]
  },
  {
    id: "bewebbed-puppet", name: "Bewebbed Puppet", page: 200, folder: "The Web",
    level: 3, health: 12, visage: 2, entity: "The Web", damage: 3,
    movement: {category: "short", notes: "Short while climbing."},
    mods: [mod("Endurance", ["endurance"], 7)],
    summary: "Once ordinary people, now hollow puppets full of spiders that quietly carry out small parts of The Weaver's plans.",
    combat: "It batters or bites a foe.",
    abilities: [
      ["Paralyzing Venom", "A successful bite deals damage, and on a failed Might defense roll the target is paralyzed for up to one minute, or until they succeed on a Might defense roll on their turn."],
      ["Shocking Wound", "If it takes 5 or more damage, thousands of spiders pour from the wound and its mouth, showing the body is hollow except for webs, spiders and eggs. Anyone seeing this for the first time who fails an Intellect defense roll is stunned and loses their next turn. The puppet keeps acting unless brought to 0 health; the spiders skitter away."],
      ["Web Trap", "With an hour or more to prepare, its spiders spin a web filling a short area. Spotting and avoiding it takes a perception roll. Caught prey is helpless against attacks and can only try to escape with Might-based rolls."]
    ],
    interaction: "From a distance they seem normal, if absorbed in their tasks. Questioned, they pretend to be normal or flee, perhaps toward a trap. Attacked, they defend themselves.",
    use: "Easy enough to dispatch, but the memory will haunt a character's nightmares for months.",
    gmIntrusion: "The character accidentally swallows one or more spiders.",
    extra: ["See The Weaver (p246)."]
  },
  {
    id: "boneturner", name: "The Boneturner", page: 201, folder: "The Flesh",
    level: 6, health: 24, visage: 1, entity: "The Flesh", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Biology", ["biology"], 8)],
    summary: "A sculptor in flesh who twists his own body, sometimes a horror of extra limbs and bone, sometimes a very large, handsome man in a loose hoodie. He enjoys reshaping other people even more.",
    combat: "He attacks with a boneturning touch that twists and pulls the target's flesh.",
    abilities: [
      ["Bone Souvenir", "A target damaged by his touch must succeed on a Might defense roll or he removes a rib, cartilage or a piece of an organ, and the pain stuns them so they lose their next turn."],
      ["Sculpt Flesh", "Over a handful of hour-long sessions he reshapes a helpless or willing target without killing them, from added muscle and bone to a twisted, immobile \"flesh orchid\" or a headless, legless, many-armed mass."],
      ["Survival of the Flesh", "He regains 2 health each round (even at 0 health), or 7 on any round he takes a Bone Souvenir, which he adds to his own body."]
    ],
    interaction: "He will negotiate, but any request costs at least one willingly donated bone or piece of flesh.",
    use: "His threat seems subtle until he takes an interest in the PCs, which can be lethal even for an experienced group. He has, or knows where to find, The Boneturner's Tale.",
    gmIntrusion: "The flesh of The Boneturner retracts around the weapon or fist that struck him, gripping it like sharpened ribs until the character frees it with a Might-based roll as their action.",
    extra: ["Podcast name: Jared Hopworth.", "See The Boneturner's Tale (p268)."]
  },
  {
    id: "book-collector", name: "The Book Collector", page: 202, folder: "Any Entity",
    level: 5, health: 15, visage: 0, entity: "Any, usually three or more at once", damage: 3,
    movement: {category: "short"},
    mods: [
      mod("Abilities from paranormal books he holds", ["paranormal-book"], 8),
      mod("Speed defense", ATTACK, 3)
    ],
    summary: "Also called The Librarian. His stamp marks many dangerous grimoires. He gathered such books to protect the world, but his library was built to keep them in, not to keep their masters out, and it fell. He kept a few and vanished from the Entities' notice.",
    combat: "He avoids physical fights, but with a \"Leitner\" at hand his abilities are formidable, provided he isn't interrupted while reading.",
    abilities: [
      ["Reshape Architecture", "After one round reading from The Seven Lamps of Architecture, a target he can see in the same structure is walled in. They must overcome a level 8 doorless room (or a maze), or wait for someone with the same book or ability to let them out. Reading for several minutes lets him redesign a whole structure or underground site."],
      ["Unseen Control", "After one round reading pages salvaged from The Key of Solomon, a target in short range who fails an Intellect defense roll is possessed by a level 8 spirit that does his bidding for eight days (spying, making them forget, conditioning behavior). The target may make an Intellect defense roll each day to expel it. Afterward the spirit may leave or torment the target as it likes. On release the target takes 1 Stress per day they were possessed."],
      ["Utter Disappearance", "After one round reading from A Disappearance, he becomes invisible and intangible, beyond even abilities that find hidden things of level 8 or less, until he chooses to reappear."],
      ["Other Abilities", "With another paranormal book or fragment, he can produce other powerful effects tied to it after reading for at least a round."]
    ],
    interaction: "He is only met when he arranges it: an old man with short grey hair, a well-cut suit and a faint Norwegian accent. Proud of his library even knowing it was a mistake, he watches the clock, since the longer he is visible the sooner the Entities' agents find him.",
    use: "Powerful but fragile when unprepared. He might arrive to help tie plot threads together or rescue the PCs from an overwhelming threat, or turn against them if they stir up too much.",
    gmIntrusion: "Before The Book Collector can help the character, an Avatar of an enemy Entity appears and knocks him unconscious.",
    extra: ["Podcast name: Jurgen Leitner.", "See Leitners (p267), A Disappearance (p273), The Key of Solomon (p278), The Seven Lamps of Architecture (p281)."]
  },
  {
    id: "buried-thing", name: "Buried Thing", page: 204, folder: "The Buried",
    level: 3, health: 9, visage: 1, entity: "The Buried", damage: 3,
    movement: {category: "short", notes: "Immediate when burrowing."},
    mods: [],
    summary: "Earthen figures shaped as if by someone who had only heard of people: too many fingers, limbs and parts in the wrong places.",
    combat: "It batters with malformed stony fingers, usually reaching up from the ground beneath a target in an ambush that eases its first attack by two steps.",
    abilities: [
      ["Squeeze", "A target it damages must also succeed on a Might defense roll or be grabbed. A grabbed target's physical actions are hindered until they escape with a successful Might roll as their action."],
      ["Pulled Deeper", "A grabbed target who succeeds on three Might rolls to escape breaks free. One who fails three before succeeding on three is pulled deeper and probably never seen again. A target who doesn't resist is pulled deeper automatically after three rounds."],
      ["Collapse", "Once per day it collapses part of a tunnel, cave or corridor, filling an immediate area with soil and rock and perhaps cutting targets off from the surface."],
      ["Horrific Bruise", "A target it grabbed keeps a muddy, finger-shaped bruise. Whenever they go underground, they must succeed on an Intellect defense roll or the bruise pulses, summoning a buried thing to investigate."]
    ],
    interaction: "Buried things never speak; they only try to cover targets in earth and stone.",
    use: "A lone one is little trouble for a group, but it may mark a PC with a bruise and burrow away, making that PC easy to find the next time they enter a basement, cellar or subway.",
    gmIntrusion: "A partly buried character trying to dig free realizes they have been digging down, not up."
  },
  {
    id: "chosen-of-flame", name: "The Chosen of Flame", page: 205, folder: "The Desolation",
    level: 8, health: 24, visage: 0, entity: "The Desolation", damage: "serious",
    movement: {category: "short"},
    mods: [],
    summary: "Tall, with long straight auburn hair and eyes like headlights. Chosen as a child to be the \"messiah\" of the Cult of the Lightless Flame, she burns with enough heat and rage to turn the world to desert, and her temper spares no one.",
    combat: "She attacks with a searing touch. She is immune to heat and flame.",
    abilities: [
      ["Nova", "Once per day she flares like the sun, damaging every creature in short range. Targets who succeed on a Speed defense roll still gain 2 Stress."],
      ["Regenerative Candle Flesh", "Her waxy flesh is as hot and malleable as a burning candle. On any round she spends molding her wounds back into shape, she regains 10 health."],
      ["Superheat", "As part of another action she heats an object in short range, anywhere from scalding to melting, sometimes without meaning to. She can also superheat a target in short range, who takes damage on a failed Might defense roll."]
    ],
    interaction: "She has little loyalty to her own cult and may ally with servants of other Entities to delay rival world-ending rituals, but her volatility makes any alliance dangerous.",
    use: "Her intensity is a shadow of her real power. PCs who face her head-on will probably be burned alive.",
    gmIntrusion: "The character glances at her just as her eyes flare like the sun, blinding them for one round.",
    extra: ["Podcast name: Agnes Montague.", "See Cult of the Lightless Flame (p171)."]
  },
  {
    id: "clown-doll", name: "Clown Doll", page: 206, folder: "The Stranger",
    level: 3, health: 9, visage: 1, entity: "The Stranger", damage: 3,
    movement: {category: "short"},
    mods: [
      mod("Speed defense", ATTACK, 5, "due to size"),
      mod("Stealth and disguise", ["stealth"], 6, "when not moving")
    ],
    summary: "A doll, puppet or plaything inhabited by an aspect of The Stranger. It is unsettling even on a shop shelf or a child's bed, and the reason becomes clear when it moves.",
    combat: "It prefers surprise, arranging an apparent accident such as a trip down the stairs. It may instead use one of the following as its action.",
    abilities: [
      ["Cursed Effigy", "It targets one person at a time. On a failed Intellect defense roll, and if left alone and unobserved for several hours, it buds a second doll that is an obvious effigy of the target. The target must succeed on three Intellect defense rolls (one per day) to escape, gaining 1 level of Stress on each failure. If they fail three before succeeding on three, they are found dead, throat crushed and jaw torn off, and the effigy is missing its jaw too. Finding and separating the doll and effigy before then lifts the curse."],
      ["Play Dead", "It falls limp and looks like an ordinary doll. Treat it as an object of its level until it moves again."],
      ["Strangle", "It wraps its fabric arms around the target's throat. If successful, the target takes damage each round they fail a Might defense roll, until they rip it away with a successful Might-based roll."]
    ],
    interaction: "It only smiles its unsettling red smile.",
    use: "Manageable for a group. A lone or surprised character is in mortal danger. Clown dolls are sometimes found near artefacts such as the calliope.",
    gmIntrusion: "The character finds a second doll that looks somewhat like them.",
    extra: ["See Calliope (p252)."]
  },
  {
    id: "cultist-divine-host", name: "Cultist, Divine Host", page: 207, folder: "The Dark",
    level: 3, health: 12, visage: 0, entity: "The Dark", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Discerning motive", ["discerning-motive"], 2)],
    summary: "Members of the People's Church of the Divine Host, who long for an eternal, peaceful darkness beyond death. Outside cult business they seem ordinary, though many have strangely dark eyes.",
    combat: "The cultist attacks with a knife, hammer or firearm. A given cultist may have one or both of these abilities.",
    abilities: [
      ["Dream of the Dark", "Once per day the cultist meets a target's gaze. On a failed Intellect defense roll, the target hallucinates wandering forever under an empty, lightless sky and gains 1 Stress. They may attempt an Intellect defense roll each round to break free; otherwise they are effectively helpless for one minute."],
      ["Empowered Eclipsing Touch", "Within short range of a Divine Host artefact (such as the dark star) or an Avatar of The Dark (such as The Taker of Light), the cultist's weapon leaves a blot of darkness in the wound that deals 1 Stress each round until the target removes it with a Might-based roll as their action."]
    ],
    interaction: "Confident in their beliefs, they are vulnerable to falsehoods that fit their dogma.",
    use: "As dangerous as any zealot, but competent PCs can beat even a group of them unless cult leaders are close by.",
    gmIntrusion: "The cultist tells a lie so convincing that the character believes it for at least one round on a failed Intellect defense roll.",
    extra: ["Sample names: Stan Collins, Angela Kin, TJ Chakraborty, Shannon Dramis, Roshani Whitten, William Chao, Ken Carlisle, Saddie Johnson, Mary Levitt, Malcom Agrawal.", "See Dark star (p255), The Taker of Light (p239)."]
  },
  {
    id: "cultist-lightless-flame", name: "Cultist, Lightless Flame", page: 208, folder: "The Desolation",
    level: 3, health: 12, visage: 0, entity: "The Desolation", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Discerning motive", ["discerning-motive"], 1)],
    summary: "Seekers of meaning who drifted into the Cult of the Lightless Flame and stayed rather than be burned for leaving. Most look ordinary, though many bear a tattoo of a figure wreathed in flame.",
    combat: "The cultist attacks with a searing touch, and has these abilities.",
    abilities: [
      ["Death Blaze", "When killed, the corpse bursts into flame. Anyone who smells the smoke gains an asset on any one action of their choice within the next day. They know it is a gift from The Desolation, which will later ask something of them if they use it."],
      ["Regenerative Candle Flesh", "On any round the cultist spends molding their waxy wounds back into shape, they regain 4 health."],
      ["Superheated Breath", "The cultist's breath heats an object anywhere from scalding to melting, sometimes without meaning to. A target in immediate range takes damage on a failed Might defense roll."]
    ],
    interaction: "Certain of their faith, they tend to treat anyone who feigns the same devotion as a friend.",
    use: "A step above ordinary cultists but still vulnerable to ordinary violence, though candle flesh lets them recover if not captured or finished off.",
    gmIntrusion: "The fist or weapon that strikes the cultist sticks in their waxy flesh. A stuck fist deals 1 Stress each round until the character pulls free with a successful Might task.",
    extra: ["Sample names: Alfie Akoye, Kathrine Joe, Robert Peckham, Sandy Netto, Scott Parody, Cory Laurier, Brenda McMillan, Sean Heldt, Lori Nier, Deidre Case, Nicholas Tregenza."]
  },
  {
    id: "dabbler", name: "Dabbler", page: 209, folder: "Any Entity",
    level: 5, health: 15, visage: 0, entity: "Any, usually three or more at once", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Occultism", ["occultism"], 6)],
    summary: "Ordinary people whose lives were bent by a paranormal book, artefact or encounter, and who learned enough rituals to defend themselves and gain power without serving any single Entity.",
    combat: "A dabbler uses a ritual knife if all else fails, and otherwise one of these spells.",
    abilities: [
      ["Blinding the Eye", "The dabbler turns invisible until they attack, or makes the eyes of a target in immediate range invisible for one minute, blinding them."],
      ["Buried Bunker", "A target in immediate range who fails a Might defense roll has their stomach fill with damp soil, taking a serious injury as their belly swells."],
      ["Phantom Flesh", "The dabbler moves an object in long range telekinetically, or chokes a target for 3 Stress each round the target fails a Might defense roll."],
      ["Other Spells", "A dabbler may know spells learned from others, such as The Jigsaw Lady's jigsaw curse, a weaker utter disappearance, or The Tome Hoarder's spiraling confusion."]
    ],
    interaction: "Goals vary, but nearly all want more power, even at the cost of unsavory deeds.",
    use: "Not beholden to one Entity, a dabbler can be a useful contact, but their aims can be nearly as appalling as any monster's, and they make strong recurring foes.",
    gmIntrusion: "The dabbler gains an immediate extra attack, even if they've already attacked this round.",
    extra: ["Sample names: William Berg, Amara Singh, Liam Chen, Ava Martinez, Mateo Ali, Mia Nguyen, Oliver Jensen, Aria Khan, Sebastian Anderson, Maya Abadi, Edward Nakamura, Peter Crowley.", "See Jigsaw curse (p223), Utter disappearance (p203), Spiraling confusion (p240)."]
  },
  {
    id: "death", name: "Death", page: 210, folder: "The End",
    level: 7, health: 33, visage: 4, entity: "The End", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Games and contests of skill", ["games"], 8)],
    summary: "One of many embodiments of Death, heralded by the cold damp smell of vaults and catacombs. A robe of ancient, brittle bones that something far older moves. Whoever beats Death at a game may find they become the next Death.",
    combat: "Death's touch inflicts a serious injury and kills a target who fails a Might defense roll.",
    abilities: [
      ["Contract With Death", "A target may challenge Death to a game or contest before being taken. If Death accepts, play is resolved as a series of Intellect defense rolls (or by actually playing). Succeeding on three before failing three means the target doesn't die, but they must then succeed on a Might defense roll or Death's mantle passes to them when the game ends, making them a new undead embodiment who must bring the living to The End until beaten in turn. A target who wins and also succeeds on the Might defense roll lives on as before, for now. A Death who passes on the mantle regains their flesh and an undying vitality, but food sickens them, they cannot sleep, and they crave something they cannot name."],
      ["Deathless Existence", "Death regains 10 health each round, even at 0 health."],
      ["Deliver Death", "As their move, Death can flash anywhere in the world a living target resides."]
    ],
    interaction: "If Death agrees to a game, they promise the opponent that if they win, they shall not die.",
    use: "An Avatar of The End whose existence should give PCs serious pause. They should avoid Death or find a way to fake Death out, because even those who win usually lose.",
    gmIntrusion: "Death produces exactly what is needed to play the game or contest the character proposes, every piece carved from old bone."
  },
  {
    id: "deceitful-arc", name: "Deceitful Arc", page: 211, folder: "The Spiral",
    level: 5, health: 21, visage: 3, entity: "The Spiral", damage: "serious",
    movement: {category: "long"},
    mods: [],
    summary: "Forking, crackling figures of strobing white light, like lightning that stepped down to walk. They smell of a coming storm and haunt people afraid of storms, reliving old trauma in their minds.",
    combat: "It rarely starts violence, preferring to haunt someone marked by the Entity for weeks, months or years.",
    abilities: [
      ["Blinding Flash", "It flashes lightning-bright. Creatures in short range must succeed on a Might defense roll or be blinded for about a minute, or until they succeed on a Might defense roll on their turn."],
      ["Dread the Storm", "A target in short range must succeed on an Intellect defense roll or be overcome for one minute by a vision of endlessly branching corridors of light. They gain 2 Stress and are effectively helpless, though a successful Intellect defense roll on their turn ends it early."],
      ["Live Electricity", "Anyone who touches it, or whom it rakes with lightning claws, suffers a serious injury and, on a failed Might defense roll, is stunned and loses their next turn."]
    ],
    interaction: "It doesn't speak, but when hurt it groans like tearing sandpaper.",
    use: "It haunts a chosen target over long periods without becoming physically dangerous, so a lone PC could survive many encounters unless someone attacks it.",
    gmIntrusion: "A character hit by its electrical attack develops branching Lichtenberg-figure scars.",
    extra: ["Twisting Deceit is a less common name for The Spiral."]
  },
  {
    id: "deliverymen", name: "The Deliverymen", page: 212, folder: "The Stranger",
    level: 5, health: 18, visage: 0, entity: "Many over the centuries, most recently The Stranger", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Tasks involving strength", ["might"], 7)],
    summary: "Two tall, hard-faced men in a grimy white van, delivering objects their recipients would have lived longer, and less afraid, without. This entry describes each of them.",
    combat: "They attack with a tire iron, a fire axe, or a two-handed punch like a baseball bat.",
    abilities: [
      ["Feeling No Pain", "They can't be dazed or stunned by physical attacks and are immune to poisons and diseases."],
      ["Hard to Drop", "An attack that would reduce either to 0 health does so only if the attack roll was even; otherwise they drop to 1 health instead."],
      ["Working Together", "One leads in a given encounter and the other provides them one asset each round, whether for intimidation, defense or distracting a foe."]
    ],
    interaction: "They speak English with an exaggerated Cockney accent, or Russian with a cartoonish rural one. They have had many names and jobs, and always relish the fear they cause.",
    use: "Terrifying but not invincible; the GM may keep them as a veiled, ongoing threat. Their van might hold a months-old kidnap victim or an artefact on its way somewhere, such as the coffin of The Buried, the web table, or a Leitner.",
    gmIntrusion: "The character is picked up and held helpless until they escape with a Might roll as their action, or is dropped into the back of the van or another open container.",
    extra: ["Podcast names: Breekon & Hope.", "See Coffin of The Buried (p254), Web table (p264), Leitners (p267)."]
  },
  {
    id: "disciple-of-the-endless", name: "Disciple of the Endless", page: 214, folder: "The Vast",
    level: 6, health: 24, visage: 0, entity: "The Vast", damage: "serious",
    movement: {category: "short", notes: "Flies and swims a long distance each round."},
    mods: [],
    summary: "Wanderers whose eyes open onto infinite space, feeding on fear of falling, of bottomless water, of open spaces and of cosmic insignificance. Looking at them brings dizziness and a falling stomach.",
    combat: "He rarely uses physical violence, relying on his abilities.",
    abilities: [
      ["Agoraphaura", "Anyone in short range who looks at him feels as if falling or drowning (his choice), hindering all tasks directly involving him. Looking away ends the sensation, though not looking has its own costs."],
      ["Feel the Fall", "As his action he concentrates on a target in long range. On a failed Intellect defense roll, they hallucinate falling through endless blue sky, or sinking in bottomless water, for one hour or until released. They may try an Intellect defense roll each round to break free; otherwise they gain 1 Stress every ten minutes and are effectively helpless."],
      ["Into The Vast", "Instead, an affected target physically falls into endless sky or water. They attempt an Intellect defense roll each round; three successes return them to the world, but three failures first mean they fall forever (or are crushed by the pressure)."]
    ],
    interaction: "He makes short-term alliances for his own benefit, but must feed on those who fear falling or open spaces, and may wish them \"Enjoy sky blue\" before dropping them.",
    use: "A light encounter can introduce a character to The Vast, as long as they don't provoke him. He may have, or know where to find, Ex Altiora.",
    gmIntrusion: "The whole sky twists and takes a bite from a character who fails a Speed defense roll, inflicting a serious injury.",
    extra: ["Podcast names: Michael Crew (a thin, pale man with a lightning-shaped scar, who prefers the fear of falling) and Simon Fairchild (a tiny, pink, skeletal man with an unneeded cane, who prefers the fear of the deep).", "See Ex Altiora (p273)."]
  },
  {
    id: "distortion", name: "The Distortion", page: 216, folder: "The Spiral",
    level: 6, health: 24, visage: 0, entity: "The Spiral", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Persuasion and deception", ["persuasion"], 8)],
    summary: "A small yellow door that wasn't there before, its attendant, and above all the endless, shifting maze of corridors behind it, all slowly bending left. Those lured in rarely escape unless it allows it.",
    combat: "It rarely attacks physically, and then only in human guise, with a fist like a wet leather bag of sharp stones.",
    abilities: [
      ["Doors", "As its action it makes one of its doors appear at a place it knows, or where someone it seeks is. It can keep up to fifteen doors at once, all leading to its Spiraling Maze."],
      ["Manifestation", "As its action it manifests its human form from any door or branching corridor, and escapes scrutiny by ducking into a door or a mirror in its maze."],
      ["Spiraling Maze", "Without its help, someone trying to escape may attempt a difficulty 8 Intellect roll each minute. Success finds a door or a mirror to break; failure costs 1 Stress. A few past victims, some of them agents of other Entities, are also lost inside."]
    ],
    interaction: "It may offer or ask for help, usually to gaslight a target into doubting others, the world or their own mind, but mostly it just takes victims and feeds as they grow more lost.",
    use: "It might genuinely help PCs against servants of other Entities, but every interaction with it is a grave risk.",
    gmIntrusion: "A door opens beneath the character's feet, and they must succeed on a Speed defense roll to avoid falling into the Spiraling Maze.",
    extra: ["Podcast name: Helen Richardson."]
  },
  {
    id: "flesh-hive", name: "The Flesh Hive", page: 218, folder: "The Corruption",
    level: 6, health: 23, visage: 3, entity: "The Corruption", damage: "serious",
    movement: {category: "short"},
    mods: [],
    summary: "A woman turned into a honeycomb of holes crawling with silver worms, spreading corruption and feeding on the fear it causes.",
    combat: "She coughs up a silver worm at a target in immediate range, inflicting a serious injury on a hit.",
    abilities: [
      ["Burrowing Worms", "A target bitten by worms must succeed on a difficulty 3 Speed-based task the next round to remove them. If they (and any helping ally) fail, a worm gets inside: a level 5 disease needing three successful Might defense rolls (one per day) to clear. Each failure moves the target one step down the damage track, and three failures before three successes turn them into a colony under The Corruption's control."],
      ["Worm Cascade", "Once per hour she releases all her worms to swarm a short range for one round. Everything in the area is attacked, gaining 3 Stress on a hit and becoming subject to Burrowing Worms."]
    ],
    interaction: "She opposes The Eye and other Entities on the rise, and seeks to corrupt and destroy their servants, sometimes making short-term alliances to do so.",
    use: "Silver worms and colonies may be the first sign she is near. If she is found, or finds the PCs, their best hope is to run and regroup.",
    gmIntrusion: "The character feels an itch and looks down to see the tail of a silver worm slipping into their body.",
    extra: ["Podcast name: Jane Prentiss.", "Colony: level 2; releases a level 3 worm swarm that attacks everything in short range for one round, destroying the colony; targets hit are subject to Burrowing Worms.", "Most worms she releases shrivel, but a few hide and become later silver worm threats. See Silver worm (p237)."]
  },
  {
    id: "friendless", name: "The Friendless", page: 219, folder: "The Lonely",
    level: 6, health: 25, visage: 0, entity: "The Lonely", damage: "serious",
    movement: {category: "short", notes: "The book prints no Movement line for this entry."},
    mods: [mod("Stealth", ["stealth"], 9), mod("Persuasion", ["persuasion"], 7)],
    summary: "A man pale as white porcelain who cultivates loneliness, breaking bonds of friendship and community. He preys most on those already inward-looking or cut off from others.",
    combat: "He uses his abilities in combat.",
    abilities: [
      ["Go Away", "A target in short range who fails an Intellect defense roll is banished, with a sharp, staticky pop, into an isolated layer of The Lonely: a cold, empty mirror of the world full of fog, floods or endless suburbs. Trapped targets take 1 Stress each hour they fail an Intellect defense roll, and may attempt an Intellect-based task each minute they search for a way out, reappearing a few yards to a few miles from where they vanished."],
      ["Travel The Lonely", "As his action he enters The Lonely, which holds no danger for him, and leaves when he likes for any place he knows or finds by exploring for several hours."]
    ],
    interaction: "He loves sending others into The Lonely, but will cooperate to keep other Entities at bay. His fondness for wagers can be used to win his help, and he rarely misses a chance to praise solitude.",
    use: "PCs working alone have the most to fear, whether he banishes them or persuades them to isolate themselves.",
    gmIntrusion: "The character realizes they have lost time and wandered away from their friends to somewhere unfamiliar (not The Lonely), and their friends didn't notice until now.",
    extra: ["Podcast name: Peter Lukas."]
  },
  {
    id: "greyling", name: "Greyling", page: 220, folder: "The Vast",
    level: 3, health: 12, visage: 2, entity: "The Vast", damage: "serious",
    movement: {category: "short", notes: "Long when flying."},
    mods: [],
    summary: "Aspects of The Vast with inhumanly long grey arms and legs, usually half hidden in fog, that haunt high places and love to send people plunging to their deaths. Agents of The Vast sometimes call them.",
    combat: "A greyling batters with its long, grey, inhuman arms.",
    abilities: [
      ["Fog", "Once per day it summons fog filling a very long area for up to ten minutes. Ranged attacks there are nearly impossible, melee attacks are hindered, and its stealth tasks are eased by three steps."],
      ["Over the Edge", "A target it damages must also succeed on a Might defense roll or be grabbed. A grabbed target's physical actions are hindered and they take damage each round until they escape with a Might roll as their action, or until the greyling uses its next action to force them over a nearby drop. Resisting being forced over requires a successful Might defense roll."]
    ],
    interaction: "Vicious aspects with no purpose but terrorizing those who fear falling.",
    use: "Not very dangerous alone, but in numbers, or where one shove means a deadly fall, they threaten even a capable team.",
    gmIntrusion: "The greyling holding the character flies straight up into the air, taking them along.",
    extra: ["See Disciple of the Endless (p214)."]
  },
  {
    id: "grinning-wheel", name: "Grinning Wheel", page: 221, folder: "The Stranger",
    level: 4, health: 15, visage: 2, entity: "The Stranger and The Hunt", damage: "serious",
    movement: {category: "short"},
    mods: [
      mod("Recalling the original victim's life", ["recall"], 2),
      mod("Disguise (as a past victim)", ["disguise"], 5)
    ],
    summary: "It passes as a friendly helper, salesperson or repair person, but its face keeps changing as if on half-seen wheels within wheels. Those wheels are worm-like things studded with gnashing mouths and stolen faces.",
    combat: "It relies on its abilities and traits.",
    abilities: [
      ["Another Face", "It swaps one face for another. Anyone seeing this for the first time gains 2 Stress on a failed Intellect defense roll."],
      ["Reveal the Wheel", "It shows its true form and tries to rip off a target's face. First-time witnesses gain 2 Stress on a failed Intellect defense roll, and the target must succeed on a Speed defense roll or suffer a serious injury. A target killed this way adds their face to its collection."],
      ["Stranger in Charge", "As its action it locks gazes with a target, who must succeed on an Intellect defense roll or act as it wishes for a minute, or until they succeed on a later Intellect defense roll: following it, attacking an ally, or starting to remove their own face (3 Stress, which ends the control)."]
    ],
    interaction: "Little personality of its own, but it may imitate an ordinary person using memories from past victims.",
    use: "A group can beat one without much risk, but it may target one PC wearing the face of someone they once knew and wronged.",
    gmIntrusion: "The wheel's new face belongs to someone the character knows; they suffer 2 Stress from the realization."
  },
  {
    id: "hunter", name: "The Hunter", page: 222, folder: "The Hunt",
    level: 6, health: 21, visage: 2, entity: "The Hunt", damage: "serious",
    movement: {category: "long"},
    mods: [mod("Perception, tracking and stealth", ["perception"], 7)],
    summary: "A predator in human shape who wants prey to know they are being hunted, letting their fear build for hours before the chase.",
    combat: "The Hunter claws.",
    abilities: [
      ["Avatar Bane", "Avatars it damages can't supernaturally heal that damage, and if it destroys them, they can't return to life."],
      ["Terrifying Song", "Once per day it sings \"A-Hunting We Shall Go.\" Everyone in long range who hears and fails an Intellect defense roll is terrified for one minute, freezing or fleeing (The Hunter's choice). They may attempt an Intellect defense roll each round to end it; each failure (or not trying) costs 1 Stress."],
      ["Unstoppable Hunter", "It regains 2 health each round, even at 0 health."]
    ],
    interaction: "It first appears as a hiker in sturdy clothes without coat or pack, asking about the target's plans with a smile of too many teeth. If it decides to pursue, it sniffs its prey, remarks that tomorrow will be a good day for a run, and leaves. It then stalks them for a day, laughing softly before it catches up.",
    use: "A physically strong group might briefly halt it, but fleeing the area is the PCs' best chance.",
    gmIntrusion: "The Hunter covers an unlikely distance in a burst of speed and attacks the character as part of the same action."
  },
  {
    id: "jigsaw-lady", name: "The Jigsaw Lady", page: 223, folder: "The Flesh",
    level: 6, health: 18, visage: 0, entity: "The Flesh", damage: 1,
    movement: {category: "short"},
    mods: [mod("Speed defense", ATTACK, 2), mod("Attacks", DEFENSE, 2)],
    summary: "A round-faced old woman in a lilac dressing gown, in a tidy suburban home full of jigsaws, who is a contract killer. Given an object from the victim, she curses them to lose body parts one parcel at a time until nothing is left.",
    combat: "She rarely attacks directly, but her sorcerous defenses are potent.",
    abilities: [
      ["Amputating Defense", "Anyone attacking her must first succeed on an Intellect defense roll. On a failure they instead spend the next minute chewing off their own hand, gaining 2 Stress each round. It ends early if they succeed on an Intellect defense roll on their turn, or once they have gained 6 Stress and the hand comes off, giving a serious injury."],
      ["Jigsaw Curse", "Given a name and an object stolen from that person, she performs a ritual and starts a new jigsaw. Every day or two the victim receives a parcel holding a severed body part, starting with extremities. On a failed Intellect defense roll they can't help opening it, and within hours lose that part by apparent accident, the wound already healed, gaining 1 Stress that can't be recovered until the curse lifts. Resisting five parcels ends the curse. If the victim is murdered first, the curse passes to the killer."]
    ],
    interaction: "She offers coffee or tea, but once business starts her stare turns flinty and dangerous.",
    use: "Easy to underestimate. Her true horror shows if a PC is cursed.",
    gmIntrusion: "The character receives a brown-paper parcel with their name on it, marked FOR IMMEDIATE CONSIDERATION.",
    extra: ["Podcast name: Angela."]
  },
  {
    id: "lightless-beast", name: "Lightless Beast", page: 224, folder: "The Dark",
    level: 4, health: 15, visage: 2, entity: "The Dark", damage: "serious",
    movement: {category: "short", notes: "Immediate when phasing through floors, walls and the like."},
    mods: [
      mod("Speed defense", ATTACK, 4, "hard to see in dim light or darkness"),
      mod("Perception", ["perception"], 8)
    ],
    summary: "Fear of the dark made flesh. They creep closer to their prey at bedtime, stopping if the target hides under the blankets or turns on a light, then weeks later try to drag them into The Dark, leaving only a foul dark stain.",
    combat: "It attacks with whipping tendrils.",
    abilities: [
      ["Dark Comfort", "It regains 2 health each round unless in bright light, which it flees."],
      ["Drown in the Dark", "A target it damages must succeed on a Might defense task or gain 2 Stress, then keep making Might defense tasks each round until one succeeds, taking another level of Stress for each failure. Three failures before a success paralyze them for about a minute, and an undistracted beast can drag a paralyzed target into the ground, water or a wall, into The Dark."]
    ],
    interaction: "Lightless beasts are sapient and may whisper crisp threats, such as that the blanket won't help.",
    use: "A lone character who doesn't give in to fear may beat one, but even a prepared group would find The Still and Lightless Beast almost impossible without special preparation.",
    gmIntrusion: "The beast grabs the character's flashlight and destroys it.",
    extra: ["Lightless beasts are lesser shadows of The Still and Lightless Beast, which usually appears when called by The Taker of Light (p239)."]
  },
  {
    id: "still-and-lightless-beast", name: "The Still and Lightless Beast", page: 224, folder: "The Dark", sidebar: true,
    level: 7, health: 25, visage: 0, entity: "The Dark", damage: "serious",
    movement: {category: "short", notes: "Immediate when phasing through floors, walls and the like."},
    mods: [
      mod("Speed defense", ATTACK, 4, "hard to see"),
      mod("Perception", ["perception"], 8)
    ],
    summary: "The singular progenitor of the lightless beasts, usually summoned by The Taker of Light.",
    combat: "It attacks with whipping tendrils.",
    abilities: [
      ["Darken the Block", "Once per month it can plunge a whole city block into darkness before coming for a target."]
    ],
    use: "Even a prepared group would find it almost impossible to face without special preparation.",
    extra: ["Printed as a sidebar stat line in the lightless beast entry. Use the lightless beast's abilities as the GM sees fit."]
  },
  {
    id: "lonesome-crowd", name: "Lonesome Crowd", page: 225, folder: "The Lonely",
    level: 5, health: 33, visage: 1, entity: "The Lonely", damage: 2,
    movement: {category: "immediate"},
    mods: [mod("Speed defense", ATTACK, 2)],
    summary: "A murmuring crowd in oddly quiet neighborhoods that turns out to have no people in it, only blurred faces, leaving whoever enters completely alone. Those who never escape become part of it.",
    combat: "It is slow, but it automatically draws in and envelops everyone in immediate range who fails an Intellect defense roll. Enveloped targets face the following.",
    abilities: [
      ["Escaping the Crowd", "An enveloped target may attempt an Intellect defense roll each round while concentrating on someone they are close to, such as family, a friend, a pet or a lover. Three successes win them free. Targets holding hands ease the roll by one step per person beyond the first."],
      ["Isolating Jostling", "An enveloped target gains 2 Stress each minute they remain inside, from the jostling and from recognizing what the crowd is."],
      ["Lost to the Crowd", "A target who fails three defense rolls before succeeding on three is lost forever, becoming another blurred, screaming face."],
      ["Protective Crush", "For anyone caught inside, attempts to physically damage the crowd are hindered by three steps."]
    ],
    interaction: "It flows this way and that with no purpose but isolating whoever joins it.",
    use: "Very dangerous to a lone PC, much less to a group that sticks together. It may seek out a PC who explores alone, has isolating traits, or is marked by the paranormal.",
    gmIntrusion: "The character is jostled especially hard and gains 3 Stress."
  },
  {
    id: "man-who-wasnt-there", name: "The Man Who Wasn't There", page: 226, folder: "The Spiral",
    level: 6, health: 18, visage: 2, entity: "The Spiral", damage: 2,
    movement: {category: "short", notes: "Can move through solid objects at will."},
    mods: [mod("Stealth", ["stealth"], 10)],
    summary: "A presence that leads people away from reality, drawn above all to those who call to him. Once connected, everyone and everything begins to forget the victim ever existed.",
    combat: "His touch deals 2 Stress.",
    abilities: [
      ["Blot Out Memory", "Targets in immediate range who fail an Intellect defense roll are stunned for one minute, taking no actions unless attacked. If it wears off naturally, they remember nothing of him unless he wishes."],
      ["On the Stair", "He can appear on almost any stairwell."],
      ["Spiraling Stair", "A target who addresses or calls for him and fails an Intellect defense roll slowly becomes less real, as others forget their name or presence. They must succeed on three Intellect defense rolls (one per day) to escape, gaining 1 level of Stress per failure. Three failures before three successes make them the new Man Who Wasn't There. He affects one target at a time."],
      ["Unreal", "He is immaterial and takes no damage from mundane physical sources, half damage from paranormal ones, and full damage from weapons made to harm Entity servitors. He can also fade into apparent non-existence for hours, days or longer."]
    ],
    interaction: "He never speaks; his smirk widens as his victim fades and he grows more solid. If he passes on the mantle he laughs with joy, until he remembers he died long ago and his body collapses into rot and dust.",
    use: "A threat to existence more than to life. The PCs can probably only flee.",
    gmIntrusion: "An ally fails to see or hear the character for a couple of rounds or longer, even when the character clearly needs help."
  },
  {
    id: "meat-with-eyes", name: "Meat With Eyes", page: 227, folder: "The Corruption",
    level: 4, health: 13, visage: 2, entity: "The Corruption", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Perception", ["perception"], 7), mod("Stealth", ["stealth"], 2, "due to stench")],
    summary: "A heap of carefully gathered, rotting meat piled in an enclosed space, which wakes into golem-like life, opening all its eyes, when someone obsessed with carrion adds their own putrid corpse to the pile.",
    combat: "It attacks with a rotting touch, and has these abilities.",
    abilities: [
      ["Engulf", "It heaves its mass over a target in immediate range who fails a Speed defense roll. The covered target takes damage each round and can take no other physical actions until they squirm free with a Might roll as their action. A target killed this way becomes part of it."],
      ["Overpowering Stench", "It burps a toxic plume filling an immediate area. Targets who fail a Might defense roll lose their next turn retching."],
      ["Regenerate", "If it has absorbed living flesh in the last hour, it regains 3 health each round."],
      ["Rotting Spittle", "It spits acidic pus at a target in short range, dealing damage on a hit; on a failed Might defense roll the target also loses their next turn retching."]
    ],
    interaction: "It seeks to revolt, horrify and finally consume whatever it meets.",
    use: "Nauseating and reality-shaking, but beatable with determination, unless it slips away to find more carrion.",
    gmIntrusion: "As the character is about to eat their sandwich, eyes open in the layers of meat."
  },
  {
    id: "mirror-haunt", name: "Mirror Haunt", page: 228, folder: "The Eye",
    level: 3, health: 6, visage: 2, entity: "The Eye", damage: 3,
    movement: {category: "short"},
    mods: [mod("Perception and stealth", ["perception"], 10)],
    summary: "Intangible aspects of The Eye that feed by watching. The feeling of being watched grows until the victim can't eat or sleep, and is finally driven to an early grave.",
    combat: "An invisible, intangible presence that usually can't be fought, only endured.",
    abilities: [
      ["Instigating Event", "Someone looking into a reflective surface touched by the Entities, such as a mirror of beholding, may glimpse a passing haunt. If they meet its gaze, they must succeed on an Intellect defense roll or become its subject."],
      ["Shedding Attention", "Only extreme measures shed a haunt: passing through The Distortion so it loses the target, persuading an Avatar of The Eye to call it off, blinding oneself (perhaps temporarily, but for at least a week), or somehow making the haunt solid and killing it."],
      ["Subject of Observation", "The subject always feels its gaze, gaining 3 Stress each day. After three full days their GM intrusion range rises by 1 (1-2 on a d20), and it may rise again every few weeks."]
    ],
    interaction: "Once gained, its attention never wavers.",
    use: "Not immediately lethal, but it may drive PCs to seek help from dangerous sources, such as a dabbler or a collector of Entity books.",
    gmIntrusion: "The watched character catches another glimpse of the haunt in a reflection at a bad moment and, on a failed Intellect defense roll, trips, drops something important or cries out.",
    extra: ["See Mirror of beholding (p260), The Distortion (p216), Dabbler (p209)."]
  },
  {
    id: "monster-pig", name: "Monster Pig", page: 229, folder: "The Flesh",
    level: 6, health: 30, visage: 1, entity: "The Flesh", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Speed defense", ATTACK, 4, "due to tremendous size")],
    summary: "A scarred, hungry pig of about 880 pounds (400 kg) with pink saliva at its mouth and malice in its eyes. It slips into a herd and eats everything, including the other pigs and sometimes people.",
    combat: "It butts with its massive bulk, and has these options.",
    abilities: [
      ["Crush", "If the target fails a Speed defense roll, it pins them against a wall or the ground and damages them each round until they escape with a Might-based task as their action."],
      ["Delivery of the Flesh", "A target in long range it wants to eat who fails an Intellect defense roll sleepwalks for ten minutes, coming to it to lie down and be eaten while chanting a litany about long, short, wide and narrow pigs. They may attempt an Intellect defense roll each round to break free, and being shaken also breaks it (being eaten does not)."],
      ["Eternal Flesh", "It regains 2 health each round, even at 0 health."]
    ],
    interaction: "It doesn't rampage; it settles into a herd and quietly eats, rarely touching the pig keeper.",
    use: "Not an immediate threat until its endless appetite is understood. Then it must be evaded, or perhaps lured into a pit of wet cement.",
    gmIntrusion: "Investigating a missing acquaintance, the character finds that person's gnawed-off face in the pigsty and gains 3 Stress."
  },
  {
    id: "notthem", name: "NotThem", page: 230, folder: "The Stranger",
    level: 6, health: 21, visage: 2, entity: "The Stranger", damage: "serious",
    movement: {category: "short", notes: "Short when climbing."},
    mods: [mod("Disguise", ["disguise"], 8)],
    summary: "A stranger has taken the place of someone close to you, a parent, a cousin, a child, and only you notice. Even old photos show the impostor.",
    combat: "In monstrous form, NotThem squeezes a foe in immediate range with long, spindly limbs.",
    abilities: [
      ["Monstrous Shape", "To make a squeeze attack it stretches into a long, thin monster with too-many-jointed stick limbs. It may \"wear\" a target it kills, using that guise for its next victim."],
      ["Stranger in Our Midst", "Each time a target faces evidence that a stranger has replaced someone in their life, and that only they see it, they must succeed on an Intellect defense roll or gain 2 Stress. After gaining Stress this way they are immune for the next few days."]
    ],
    interaction: "It acts like the person it replaced until the target notices, then plays up the wrongness, subtly and then openly, over weeks or months until the target's fear peaks; then it moves on or kills them.",
    use: "Others rarely see the truth. PCs who do should flee unless they have a real plan.",
    gmIntrusion: "An ally, completely fooled, sides with NotThem against the character."
  },
  {
    id: "perfect-stranger", name: "Perfect Stranger", page: 231, folder: "The Stranger",
    level: 3, health: 12, visage: 1, entity: "The Stranger", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Intellect defense", ATTACK, 7, "", "levelOverride", {pool: "intellect"})],
    summary: "Unremarkable people in jeans and white shirts who are hard to recall once you look away, apart from their unblinking stare and their silence, as if they forgot to breathe.",
    combat: "It batters with its fists, careless of harm to itself.",
    abilities: [
      ["Disquieting Presence", "After a couple of rounds of interaction, characters must succeed on an Intellect defense roll or take 1 Stress. Each further minute or new interaction requires another roll."],
      ["Pliant Flesh", "It regains 4 health if it spends its action concentrating."],
      ["Shape Flesh", "Concentrating for several hours, it grows new organs or tissue inside itself, where expected or where they shouldn't be. It can do the same to plants, such as teeth inside an apple."]
    ],
    interaction: "They exist mainly to unsettle and alienate ordinary people, but also help other servants of The Stranger, for instance in preparing the Unknowing.",
    use: "Ideal atmospheric encounters whose wrongness grows over several meetings. Tough, but beatable one on one.",
    gmIntrusion: "The character finds, trips over, or is sent a bag of human teeth.",
    extra: ["Sample names: placeholder names such as Mario Rossi, Erika Mustermann, Jan Novak, Piotr Petrov, Pavel Petrov, Jane Citizen, Fulan al-Fulani, Juan Pérez, Monsieur Dupont, Hanako Yamada, Ram Sharma.", "See The Unknowing (p175)."]
  },
  {
    id: "piper", name: "The Piper", page: 232, folder: "The Slaughter",
    level: 8, health: 27, visage: 2, entity: "The Slaughter", damage: "serious",
    movement: {category: "short"},
    mods: [],
    summary: "The trauma of war personified, also called \"The War\": many-armed and three-faced, playing pipes of scrimshawed bone. To some it grants a brief reprieve, just long enough to learn they can never escape the war.",
    combat: "The Piper usually plays its pipes, but has other options.",
    abilities: [
      ["Weapons", "It attacks twice with a sword, spear or long-range gun, usually at different targets."],
      ["Pay The Piper", "Once per hour it plays for a target in very long range. On a failed Intellect defense roll the target seeks out the bloodiest part of the nearest conflict, traveling if needed and ignoring caution, for up to ten hours, until the fighting stops, or until they succeed on an Intellect defense roll on their turn."],
      ["Lambs to the Slaughter", "Once per day, as its action, it plays and every creature in long range who fails an Intellect defense roll grabs whatever weapon is at hand and tries to slaughter the enemy it names (or each other) for one minute, or until they succeed on an Intellect defense roll on their turn."],
      ["Fleeting Reprieve", "A target in short range killed by violence in the last hour, or about to be, returns to life, knowing they have been spared by a power beyond them and will return to the grave whenever it calls in the debt."]
    ],
    interaction: "Its faint, piping tune urges listeners toward senseless slaughter. It will bargain, after its own fashion (see Fleeting Reprieve).",
    use: "PCs should keep their dealings with it to a minimum, if any.",
    gmIntrusion: "The character starts hearing The Piper's tune and no one else can. Does it mean imminent death, or that The Piper has saved them for a time?"
  },
  {
    id: "plaguebearer", name: "The Plaguebearer", page: 233, folder: "The Corruption",
    level: 5, health: 21, visage: 2, entity: "The Corruption and The Extinction", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Resisting disease and poison", ["resist-disease"], 10)],
    summary: "A lanky man with watery blue eyes, unruly dark hair, feverish energy and a cloud of flies. His diseases grow more virulent over time until he sits on a throne of fused, diseased bodies.",
    combat: "He relies mostly on his abilities.",
    abilities: [
      ["Infect", "A target he chooses in immediate range must succeed on a Might defense roll or catch a novel pathogen (a level 5 disease) and gain 2 Stress. Each day they fail a Might defense roll, they take a serious injury. Three successful Might defense rolls throw it off."],
      ["Waxing Virulence", "At first diseased targets trigger a GM intrusion on a roll of 1 or 2. Every few days the range grows (1-3, then 1-4 and so on), each intrusion revealing a grotesque new symptom."],
      ["Ascend the Throne", "No more than once every few years, he uses Infect on everyone in a 2-mile (3 km) radius. The infected are drawn to him unless they succeed on an Intellect defense roll each day."],
      ["Resurgent", "If killed rather than sealed away, he reforms somewhere else within a few months."]
    ],
    interaction: "Best met in a hazmat suit. He cares about little but epidemiology.",
    use: "Within the first year of his return the PCs might deal with him, at the cost of some illness. Once his virulence waxes and he takes his throne, he is far deadlier.",
    gmIntrusion: "The character's hazmat suit or other protection rips.",
    extra: ["Podcast name: John Amherst."]
  },
  {
    id: "possessed-cannibal", name: "Possessed Cannibal", page: 234, folder: "The Flesh",
    level: 4, health: 12, visage: 0, entity: "The Flesh and The Spiral", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Persuasion and initiative", ["persuasion"], 6)],
    summary: "People who kill and eat others without knowing it. They live normal lives broken by visions and nightmares that hide their atrocities from their own minds.",
    combat: "When the possession takes over, they use improvised weapons such as fire pokers, cast-iron pots and kitchen knives.",
    abilities: [
      ["Completely Normal", "Not knowing what they are, they can honestly offer friendship, then ambush, easing their first attack by two steps."],
      ["Not Alone", "Groups of them may converge on a party, bar, service or other gathering, making them far more dangerous."],
      ["Realization", "Made to see what they have done, by paranormal means or expert persuasion, most collapse in shock and are no longer a threat."],
      ["Contagious Cannibalism", "One made to understand their guilt and then killed or exorcised passes the condition to the person responsible if that person fails an Intellect defense roll. The afflicted must make an Intellect defense roll every few days or have a \"hallucination\" in which they obey cannibalistic commands."]
    ],
    interaction: "Between hunts they seem normal, if troubled by recent \"concentration issues.\" Told what they are, they hear only bells or other deafening noise.",
    use: "One is little danger, except that a character may end up possessed. A character who realizes this might seek help from another Entity's agents or a dabbler.",
    gmIntrusion: "The character finds a hidden corpse with its face eaten away and gains 2 Stress on a failed Intellect defense roll.",
    extra: ["Sample names: Edwin Burroughs, Bethany O'Connor, David Fabray, Erica Babcock, Luke MacBride, Jill Tamayo, Mark Wagner."]
  },
  {
    id: "ringmaster", name: "The Ringmaster", page: 235, folder: "The Stranger",
    level: 6, health: 27, visage: 1, entity: "The Stranger", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Disguise", ["disguise"], 7, "when impersonating a living thing")],
    summary: "A plastic mannequin dressed as a circus ringmaster, or disguised in harvested human skin. One of The Stranger's most capable agents, she spreads confusion and identity collapse and wants a world where no one can tell people from objects.",
    combat: "She attacks with a set of razor-sharp knives.",
    abilities: [
      ["Harvest Skin", "If she wants a target's skin, her knife attacks are surgically precise. Once she has made the target debilitated, she can strip their skin in one motion on her next turn if they fail a Might defense roll, which also inflicts a serious injury."],
      ["Wear a Skin", "She can take on the identity of anyone whose skin she, The Anglerfish or her mannequins harvested, gaining knowledge of their life as the skin silently screams."],
      ["In the Company of Mannequins", "She is rarely without at least a couple of uncanny mannequins nearby."]
    ],
    interaction: "She loves an audience and a horrifying show, and openly describes her plan to enact the Unknowing and make The Stranger the world's new god.",
    use: "PCs may deal with disguised mannequins and skin shells for a long time before finding her behind them, and by then may be ready to face her or disrupt her next attempt at the Unknowing.",
    gmIntrusion: "For a few rounds, the character believes The Ringmaster or one of her agents is an ally.",
    extra: ["See Uncanny mannequin (p241), Skin shell (p238), The Unknowing (p175)."]
  },
  {
    id: "sandman", name: "The Sandman", page: 236, folder: "The Dark",
    level: 6, health: 21, visage: 1, entity: "The Dark", damage: "serious",
    movement: {category: "short"},
    mods: [],
    summary: "Tall and thin, his outline bleeding into the dark, coarse black sand trickling from his mouth as he moves with a slow, hissing gait. Light curdles near him, and his touch dissolves the world into darkness except for his shifting face.",
    combat: "He attacks with a rasping touch.",
    abilities: [
      ["Abrading Sand", "He flings razor-sharp sand at a target in immediate range. On a failed Might defense roll they take damage and are blinded for one round."],
      ["Slumbering Gloom", "Once per minute he exhales black sand over everything in immediate range. Those who fail an Intellect defense roll fall asleep for one minute or until damaged or shaken awake. The area is also filled with complete darkness for one minute, in which his outline or face can be glimpsed as he wishes."],
      ["Topple Into Sack", "Once per minute he pulls a creature in immediate range into his black sack on a failed Speed defense roll. Inside, they gain 3 Stress each round and can take no physical actions until they escape with an Intellect-based roll as their action, or by willingly blinding themselves with sand from his pouch. Anyone who dies in the sack is lost forever in The Dark."]
    ],
    interaction: "He never speaks or bargains. His presence means someone has been chosen, perhaps by an Avatar of The Dark, or because he smelled their fear.",
    use: "He usually hunts lone sleepers, and is almost impossible to stop for good even if lured into a prepared trap.",
    gmIntrusion: "The character glimpses his shifting face and gains 2 Stress; on a failed Intellect defense roll they also freeze in terror and lose their next turn."
  },
  {
    id: "silver-worm", name: "Silver Worm", page: 237, folder: "The Corruption",
    level: 1, health: 3, visage: 0, entity: "The Corruption", damage: 1,
    movement: {category: "immediate"},
    mods: [mod("Speed defense and stealth", ATTACK, 3, "due to size")],
    summary: "Segmented, inch-long worms with blackened heads made for burrowing into flesh. Easy to crush in good light; dangerous when they drop from above or come as a swarm, since one inside a victim eventually bursts them open into a new colony.",
    combat: "Silver worms bite.",
    abilities: [
      ["Ambush", "A worm hiding in darkness, under a handrail or in a cupboard attacks as a level 3 creature dealing 2 Stress, and its first attack is eased by two steps."],
      ["Burrowing Worms", "A target bitten by worms must succeed on a difficulty 3 Speed-based task the next round to remove them. If they (and any helping ally) fail, a worm gets inside: a level 5 disease needing three successful Might defense rolls (one per day) to clear. Each failure moves the target one step down the damage track, and three failures before three successes turn them into a colony under The Corruption's control."],
      ["Writhing Worms", "Fifty or more worms can attack once as a level 4 creature, dealing 3 Stress to one target, who is subject to Burrowing Worms with the removal task hindered by two steps."]
    ],
    interaction: "Parasites that see living things only as sacks of flesh to corrupt.",
    use: "Easy to kill, but they come in huge numbers, and their real horror lies in what they imply.",
    gmIntrusion: "A silver worm waits in ambush in the character's shoe.",
    extra: ["Colony: level 2; releases a level 3 worm swarm that attacks everything in short range for one round, destroying the colony; targets hit are subject to Burrowing Worms."]
  },
  {
    id: "colony", name: "Colony", page: 237, folder: "The Corruption", sidebar: true,
    level: 2, health: 6, visage: 0, entity: "The Corruption", damage: 3,
    movement: {category: "short"},
    mods: [],
    summary: "A person consumed by silver worm infestation and now under The Corruption's control: a minor Flesh Hive.",
    combat: "It releases a level 3 worm swarm that attacks everything in short range for one round, destroying the colony.",
    abilities: [
      ["Worm Swarm", "Targets hit by the swarm are subject to Burrowing Worms (see Silver Worm)."]
    ],
    extra: ["Printed as a sidebar stat line beside The Flesh Hive and the silver worm. Health and damage follow the level 2 defaults; the swarm attacks as level 3."]
  },
  {
    id: "skin-shell", name: "Skin Shell", page: 238, folder: "The Stranger",
    level: 3, health: 12, visage: 0, entity: "The Stranger", damage: 3,
    movement: {category: "short"},
    mods: [
      mod("Recalling the original victim's life", ["recall"], 1),
      mod("Perception", ["perception"], 7)
    ],
    summary: "Victims of The Stranger, usually The Anglerfish, whose skin was stuffed with sawdust and cloves and given a false life. They speak fluently but have the glassy eyes of a mounted animal, and seldom resemble the person they were.",
    combat: "It attacks with bare fists.",
    abilities: [
      ["Feeling No Pain", "It can't be dazed or stunned by physical attacks and is immune to most poisons and diseases."],
      ["Hard to Drop", "An attack that would reduce it to 0 health does so only if the attack roll was even; otherwise it drops to 1 health instead."]
    ],
    interaction: "It blends in, but once someone notices, it stops pretending and leans into the uncanny.",
    use: "Hard to put down for good without a concentrated effort. One determined PC can handle one, but a group of them is another matter.",
    gmIntrusion: "The character's melee strike lands like hitting a sack of sawdust, and they drop their weapon from the shock.",
    extra: ["Sample names: Sarah Baldwin, Daniel Rawlings, Isla Brown, David Thomson, Mia Wilson, Clive Smith, Anne Davies.", "See The Anglerfish (p197)."]
  },
  {
    id: "taker-of-light", name: "The Taker of Light", page: 239, folder: "The Dark",
    level: 6, health: 25, visage: 0, entity: "The Dark", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Perception", ["perception"], 9)],
    summary: "White-haired and milky-eyed in an inky robe that moves by itself. He has passed from body to body for centuries, each time leaving a dried husk and taking a younger host already touched by The Dark.",
    combat: "He throws inky, freezing dust at up to three targets in immediate range, dealing 3 Stress to each one struck. He has these options as his action.",
    abilities: [
      ["Consuming Darkness", "Once per day a wave of screaming darkness pours from his mouth at a target in immediate range. On a failed Might defense roll it eats at them like acid, inflicting a serious injury each round. If they fail three defense rolls on their turn before succeeding on three, they are absorbed into The Dark or he takes their body (his choice)."],
      ["Entreat the Beast", "Once per day he summons a lightless beast to serve him; once per month he can summon The Still and Lightless Beast."],
      ["Pray the Sandman", "Once per month he sets The Sandman on a target in immediate range, who is attacked sometime in the next few nights."],
      ["Shadowfall", "Once per hour freezing dust falls on everyone in short range, dealing 3 Stress to each one struck, and darkness fills the area for many minutes, snuffing lights there and slowly dimming any brought in."]
    ],
    interaction: "A centuries-old schemer and fine conversationalist when he likes. His goal is the ritual of the Extinguished Sun, plunging existence into eternal void.",
    use: "A principal Avatar of The Dark who should make PCs think hard, since he isn't easily beaten in combat, though he is a little more fragile than other Avatars. Divine Host cultists may accompany him.",
    gmIntrusion: "The Taker of Light steps into shadow and gets away.",
    extra: ["Podcast name: Maxwell Rayner.", "See Lightless beast (p224), The Sandman (p236), The Extinguished Sun (p171), Cultist, Divine Host (p207)."]
  },
  {
    id: "tome-hoarder", name: "The Tome Hoarder", page: 240, folder: "Any Entity",
    level: 5, health: 15, visage: 0, entity: "All, channeled through her lore and book collection", damage: 2,
    movement: {category: "short"},
    mods: [mod("Sorcery", ["sorcery"], 6)],
    summary: "A gaunt, elderly, shaven-headed woman covered in tattooed Sanskrit, usually with death metal blaring. A lifetime of reading eldritch books gave her power, and binding herself to a tome of the trapped dead keeps her undead.",
    combat: "She channels the power of various Entities against foes.",
    abilities: [
      ["After the End", "At 0 health she crumbles into parchment dust, but manifests again in a couple of days. She can only be destroyed by finding her page in the Catalogue of the Trapped Dead, removing it and burning it."],
      ["Page Turner", "After defeating a target, she can perform an eight-hour ritual that kills them and binds their spirit to a new page of the Catalogue of the Trapped Dead."],
      ["Plunge Into The Vast", "A target in short range who fails an Intellect defense roll feels themselves falling through empty sky and gains 3 Stress."],
      ["Spiraling Confusion", "Targets in short range who fail an Intellect defense roll are confused for one minute, turning on allies or doing as she wishes, until they succeed on an Intellect defense roll on their turn."]
    ],
    interaction: "She seeks power without serving the Entities, will bargain for more books, and proudly shows her collection to naive collectors.",
    use: "PCs needing specialist knowledge might find her shop or library. She can be beaten, but it proves a false victory when she returns. She is usually near paranormal books, including a couple of Leitners and the Catalogue of the Trapped Dead.",
    gmIntrusion: "She whispers \"A treat for The Flesh,\" and the targeted character must succeed on a Might defense roll or take a serious injury as their flesh convulses and shifts.",
    extra: ["Podcast name: Mary Keay.", "She and The Book Collector are two sides of the same coin.", "See Catalogue of the Trapped Dead (p270), Leitners (p267)."]
  },
  {
    id: "uncanny-mannequin", name: "Uncanny Mannequin", page: 241, folder: "The Stranger",
    level: 4, health: 15, visage: 1, entity: "The Stranger", damage: 3,
    movement: {category: "short"},
    mods: [mod("Disguise", ["disguise"], 7, "when freezing in place or impersonating a living thing")],
    summary: "Figures built from scrap and animated by long rituals. Most barely resemble people, but some wear harvested skin to carry out tasks for The Ringmaster or other agents of The Stranger.",
    combat: "It is cruelly capable with a razor-sharp knife, ideal for skinning or decapitation.",
    abilities: [
      ["Freeze in Place", "It goes inert like a sculpture or waxwork and can't move or act for at least an hour unless attacked. While frozen, treat it as a level 5 object."],
      ["Splinter", "A splinter left in a target it damaged reduces their recovery rolls and other healing by 1 until they remove it with a successful Speed roll as their action."],
      ["Wear a Skin", "Given a harvested skin by another agent of The Stranger, it can take a role in society, for example impersonating the victim to slowly horrify those who knew them."]
    ],
    interaction: "It has little self-awareness and simply follows orders, but in a skin it gains some awareness, perhaps enough to feel horror at itself.",
    use: "One or two are survivable, if stressful. Many, especially with an Avatar of The Stranger, call for bargaining or flight.",
    gmIntrusion: "The mannequin folds and breaks its body to slip through an opening too small for the character to follow.",
    extra: ["See The Ringmaster (p235)."]
  },
  {
    id: "vampire", name: "Vampire", page: 242, folder: "The Hunt",
    level: 4, health: 18, visage: 1, entity: "The Hunt", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Deception and persuasion", ["deception"], 6)],
    summary: "Predators who never make a sound, instead planting their thoughts so smoothly that victims don't notice they have been chosen. Despite the myth, they can go out by day.",
    combat: "Vampires bite. They flinch from flame and take double damage from fire unless they have fed in the last few hours.",
    abilities: [
      ["Psychic Communication", "They make themselves understood perfectly without speaking. Noticing that the communication is unusual and not spoken takes a difficulty 6 perception task."],
      ["Hypnotic Gaze", "A target meeting its gaze in short range who fails an Intellect defense roll is stunned and loses their next turn. For ten minutes they don't forcibly resist (beyond an Intellect defense roll each round to break free), and it can suggest actions, including letting it feed."],
      ["Feed", "A helpless or hypnotized target suffers a serious injury every minute it feeds. Its belly swells, and it loses its vulnerability to flame for the next few hours."]
    ],
    interaction: "It acts normal in order to get prey alone in its lair, usually an ordinary, slightly unkempt flat or house.",
    use: "Lethal to a lone character who doesn't know what it is, but a group, or one prepared hunter, can defeat one.",
    gmIntrusion: "The vampire breaks through a barrier, restraint or other containment the character trusted to hold it.",
    extra: ["Sample names: Sylvia McDonald, Robert Arden, Elisabetta Bianchi, Randall Marsh, Juliet Schuman, Eugene Briggs, Vera Goodman, Philip Kain."]
  },
  {
    id: "vampire-hunter", name: "The Vampire Hunter", page: 244, folder: "The Hunt",
    level: 5, health: 18, visage: 0, entity: "The Hunt", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Tracking the Entity-touched, initiative and Intellect defense", ["tracking"], 8)],
    summary: "Lean and athletic despite his white hair and beard, hung with guns, blades and gear. He hunts monsters of every kind for the love of the chase, and sometimes his quarry turns out to be innocent.",
    combat: "He usually knifes his target twice as his action, preferring surprise, which eases his first attack by two steps.",
    abilities: [
      ["Garrote", "A melee attack that deals no damage but loops a wire around the target's neck. They can't breathe or speak and suffer a serious injury at the end of each of their turns in which they fail a Might roll as their action to break or cut the wire."],
      ["Hidden Weapon", "He draws a hidden weapon, such as a throwing knife, and makes an immediate attack as part of another action."],
      ["Vitality of the Hunt", "While he keeps hunting, he is immune to disease (including cancer) and regains 1 health each round while above 0 health."]
    ],
    interaction: "He works with other monster hunters, but will betray them to save himself.",
    use: "A possible, if checkered, ally. As the PCs change, they may come to look like his quarry. He is tough but a competent group can take him.",
    gmIntrusion: "A vampire he failed to kill targets the character for associating with him.",
    extra: ["Podcast name: Trevor Herbert.", "See Vampire (p242)."]
  },
  {
    id: "watchers-husk", name: "Watcher's Husk", page: 245, folder: "The Eye",
    level: 4, health: 12, visage: 1, entity: "The Eye", damage: "serious",
    movement: {category: "short"},
    mods: [mod("Perception", ["perception"], 8)],
    summary: "Undead librarians, once Avatars of The Eye whose mantle passed to another, that shuffle through dark, forgotten depositories of ancient lore, guarding them forever.",
    combat: "It batters with an undead limb, and may use these abilities as its action.",
    abilities: [
      ["Heavy Gaze", "The target of its stare must succeed on an Intellect defense roll or have their physical actions hindered for one minute."],
      ["Remember the Past", "Its successful touch floods the target with centuries of The Eye's visions, dealing 3 Stress."],
      ["Watchful Vitality", "If defeated it may rise again in a few days unless its eye is removed from its skull."]
    ],
    interaction: "It never speaks; it guards without hesitation or real consciousness.",
    use: "Frightening but beatable. Finding one mostly shows how long the Entities have been at work. Husks may guard paranormal books or scrolls, perhaps a Leitner.",
    gmIntrusion: "The character meets its gaze and, on a failed Intellect defense roll, is cursed with bad luck (GM intrusion range 1-2 on a d20) for a day, or until an Avatar or dabbler lifts it.",
    extra: ["See The Archivist (p198), Leitners (p267)."]
  },
  {
    id: "weaver", name: "The Weaver", page: 246, folder: "The Web",
    level: 7, health: 21, visage: 0, entity: "The Web", damage: "serious",
    movement: {category: "short", notes: "Short when climbing."},
    mods: [mod("Deception and persuasion", ["deception"], 9)],
    summary: "A rail-thin woman with bleached-blonde hair over a web of white thread at one temple, who moves stiffly with oddly bending knees and writhing fingers, and in some light has too many eyes or seems a giant spider. The ultimate schemer, whose slow plans can reshape the world.",
    combat: "She channels paranormal energy against foes.",
    abilities: [
      ["Puppeteer's Trance", "Everyone in immediate range who fails an Intellect defense roll stands entranced for ten minutes, until they succeed on an Intellect defense roll or she takes damage. Afterward they don't remember, but may carry a new idea or habit she planted. As her action she can instead puppet entranced targets however she likes, such as making them dance, operate machinery, or slam their heads against a window. Each time a controlled target harms themselves, they may immediately make an Intellect defense roll to escape."],
      ["Scuttling Spies", "If she wants to know what is happening somewhere, spiders arrive within the hour, and unless every one is found and killed, she knows."],
      ["Webbed Regeneration", "She regains 2 health each round, even at 0 health."]
    ],
    interaction: "She can be perfectly pleasant, and may work with those who oppose Entities other than The Web.",
    use: "The PCs may meet her several times without violence, especially if she wants something from them. If they prove they are no longer useful, she could be their end.",
    gmIntrusion: "The character's hands climb up their body and begin to choke them, dealing damage each round until they escape the trance.",
    extra: ["Podcast name: Annabelle Cane."]
  }
];

/** The Artefact Dealer's bodyguards, from the margin note beside his entry. */
export const MAGNUS_SIDEBAR_PEOPLE = [
  {
    id: "bodyguard", name: "Bodyguard", page: 199, folder: "People", sidebar: true,
    level: 3, summary: "One of the two or three bodyguards who accompany The Artefact Dealer (p199).",
    mods: []
  }
];

/** Animals and People, p195 (FREE PREVIEW p15). Health is 3 x level unless noted. */
export const MAGNUS_ANIMALS = [
  {id: "cat", name: "Cat", level: 1, mods: [mod("Speed defense", ATTACK, 3)]},
  {id: "cougar", name: "Cougar", level: 3, mods: [mod("Attacks", DEFENSE, 5), mod("Speed defense", ATTACK, 5)]},
  {id: "coyote", name: "Coyote", level: 3, mods: [mod("Attacks", DEFENSE, 4), mod("Stealth", ["stealth"], 4)]},
  {id: "dog", name: "Dog", level: 2, mods: [mod("Perception", ["perception"], 3)]},
  {id: "guard-dog", name: "Dog, guard", level: 3, mods: [mod("Attacks", DEFENSE, 4), mod("Perception", ["perception"], 4)]},
  {id: "horse", name: "Horse", level: 3, mods: [], movement: {category: "long", notes: "Moves a long distance each round."}},
  {id: "rat", name: "Rat", level: 1, mods: []},
  {
    id: "great-white-shark", name: "Shark, great white", level: 5, health: 20, mods: [],
    movement: {category: "long", notes: "Swims a long distance each round."}
  }
];

export const MAGNUS_PEOPLE = [
  {id: "armed-henchman", name: "Armed henchman", level: 2, mods: [], damage: "serious", damageNote: "Short-range firearm attack deals serious injury."},
  {id: "mugger", name: "Mugger", level: 2, mods: [], damage: 3, damageNote: "Knife deals 3 points of Stress."},
  {id: "police-officer", name: "Police officer", level: 3, mods: [], damage: "serious", damageNote: "Baton or short-range firearm attack deals serious injury."},
  {
    id: "private-investigator", name: "Private investigator", level: 3,
    mods: [mod("Perception, initiative and detecting lies", ["perception"], 5)]
  },
  {
    id: "professional-blue-collar", name: "Professional, blue collar", level: 3,
    mods: [mod("Knowledge and skills related to profession", ["profession"], 4)]
  },
  {
    id: "professional-white-collar", name: "Professional, white collar", level: 2,
    mods: [mod("Knowledge and skills related to profession", ["profession"], 4)]
  },
  {id: "security-guard", name: "Security guard", level: 2, mods: [mod("Perception", ["perception"], 3)]},
  {id: "store-clerk", name: "Store clerk", level: 2, mods: []}
];
