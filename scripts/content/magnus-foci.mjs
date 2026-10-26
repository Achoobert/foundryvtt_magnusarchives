/**
 * The 18 character foci from The Magnus Archives Roleplaying Game, chapter 4
 * (p58-89), and the Avatar powers that close the chapter (p89-96).
 *
 * Prose is an original paraphrase, not the book's text: `summary`, the
 * connections and every ability description are rewritten short, and the
 * book's flavour stays in the book (`page` points at it). The mechanics are
 * reproduced faithfully: costs, numbers, ranges, durations, and whether an
 * ability is an Action or an Enabler.
 *
 * Ability fields:
 *   cost   "<n>[+] <Pool>[ + <n> Stress]", or "<n> Speed/Intellect" for a
 *          cost that may come from either Pool; omitted when free
 *   act    "action" or "enabler" (the book's "Action to initiate" is an action)
 *   text   the rules, paraphrased; [[skill name]] becomes a link to that Skill
 *
 * Tier fields:
 *   choice true when the book says "Choose either X or Y as your tier N ability"
 *   also   abilities gained alongside whichever choice is taken
 *
 * `extras` are abilities a focus offers outside its tier track (Helps Their
 * Friends lets you swap a type ability for one); they are linked from the
 * focus description but are not graph nodes.
 */

const SKILL_WITH_ATTACKS = {
  name: "Skill With Attacks",
  act: "enabler",
  text: "Pick one attack type you aren't trained in: light, medium or heavy, each bashing, bladed or ranged. You become trained in attacks with that type of weapon. You can take this ability more than once, choosing a different attack type each time."
};

const SKILL_WITH_DEFENSE = {
  name: "Skill With Defense",
  act: "enabler",
  text: "Pick one defense task you aren't trained in: [[Might defense]], [[Speed defense]] or [[Intellect defense]]. You become trained in it."
};

const GREATER_SKILL_WITH_DEFENSE = {
  name: "Greater Skill With Defense",
  act: "enabler",
  text: "Pick one defense task (Might, Speed or Intellect), even one you're trained in. You become trained in it, or specialized if you were already trained. You can take this up to three times, picking a different defense each time."
};

const GREATER_ENHANCED_POTENTIAL = {
  name: "Greater Enhanced Potential",
  act: "enabler",
  text: "Gain 6 points to split among your stat Pools however you like."
};

const GREATER_ENHANCED_SPEED = {
  name: "Greater Enhanced Speed",
  act: "enabler",
  text: "Gain 6 points to your Speed Pool."
};

const GREATER_ENHANCED_INTELLECT = {
  name: "Greater Enhanced Intellect",
  act: "enabler",
  text: "Gain 6 points to your Intellect Pool."
};

const ENHANCED_INTELLECT = {
  name: "Enhanced Intellect",
  act: "enabler",
  text: "Gain 3 points to your Intellect Pool."
};

const FLEX_SKILL = {
  name: "Flex Skill",
  act: "enabler",
  text: "At the start of each day, pick one task (not an attack or defense) to concentrate on. You're trained in it for the rest of the day. This can't raise a skill you're already trained in to specialized."
};

const QUICK_WITS = {
  name: "Quick Wits",
  act: "enabler",
  text: "When a task would normally cost points from your Intellect Pool, you can pay with Speed points instead."
};

const FISTS_OF_FURY = {
  name: "Fists of Fury",
  act: "enabler",
  text: "Your unarmed attacks deal 2 extra points of damage."
};

const KNOWLEDGE_IS_POWER = {
  name: "Knowledge Is Power",
  act: "enabler",
  text: "Pick two noncombat skills you aren't trained in. You become trained in both."
};

const LIFE_LESSONS = {
  name: "Life Lessons",
  act: "enabler",
  text: "Pick any two noncombat skills. You become trained in both."
};

export const MAGNUS_FOCI = [
  {
    name: "Carries a Gun",
    page: "60-61",
    summary: "You're dangerous with a firearm in hand. Long practice keeps you steady under fire. You might be a cop, a criminal, a hunter or someone who decided to protect themselves, and you dress so the gun is hidden, close at hand, or both.",
    connections: [
      "You once winged another PC during target practice and badly hurt them. They decide whether they resent, fear or forgive you.",
      "You overheard another PC say nobody should own a gun. You can prove them right or wrong.",
      "Another PC's mother gave you the gun you carry.",
      "Another PC thinks you're famous for something you never did. You decide whether to correct them."
    ],
    equipment: "A firearm and three magazines of ammunition.",
    minor: "A blow to the side of the head leaves the target deafened for a few minutes.",
    major: "You hit an artery. The foe bleeds for 1 point of damage each round until they bind the wound with a difficulty 3 Intellect or Speed task.",
    intrusions: "The gun misfires or jams: the attack fails, the action is lost, and another action is needed to clear it.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Gunner", act: "enabler", text: "Your attacks with guns deal 1 extra point of damage."},
        {name: "Practiced With Guns", act: "enabler", text: "You're practiced with guns and take no penalty when you use one."}
      ]},
      {tier: 2, abilities: [
        {name: "Careful Shot", act: "enabler", text: "You can pay for levels of Effort to increase gun damage from either your Speed Pool or your Intellect Pool. Each level adds 3 points of damage to a successful attack, or 5 points if you spent a turn lining up the shot."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Trained Gunner", act: "enabler", text: "Choose one: you become trained with guns, or you gain the Spray ability (cost 2 Speed points)."},
        {name: "Damage Dealer", act: "enabler", text: "Your gun attacks deal 3 extra points of damage."}
      ]},
      {tier: 4, abilities: [
        {name: "Snap Shot", act: "enabler", text: "You can make two gun attacks as one action. The second attack is hindered by two steps."}
      ]},
      {tier: 5, abilities: [
        {name: "Arc Spray", cost: "3 Speed", act: "action", text: "With a rapid-fire weapon, you shoot at up to three targets standing next to one another. Make a separate attack roll for each; every attack is hindered."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Special Shot", act: "enabler", text: "When you hit with a gun, you can deal 1 less point of damage to strike a precise spot. For example, you can knock an object out of a hand, hit a limb the target moves with so its top speed drops to immediate for a few days (or until it gets expert medical care), or sever a strap so a pack or worn device falls off."},
        {name: "Lethal Damage", act: "enabler", text: "Your standard gun attacks deal 5 extra points of damage when they hit."}
      ]}
    ]
  },
  {
    name: "Does a Bit of This and That",
    page: "61-62",
    summary: "You've drifted through plenty of jobs and nothing has stuck. You take life easy, pick things up, and move on when they get dull, so you know a little about a lot. You dress casually and might be fit or bookish, whichever suits you.",
    connections: [
      "Another PC has always been there for you and has bailed you out more than once.",
      "Another PC is far too uptight. You hope to be the one who teaches them to relax.",
      "You're a bit jealous of another PC, who beats you at your favourite hobby.",
      "You owe another PC money and fully mean to pay it back once things go your way."
    ],
    minor: "Something you've lived through eases your next action.",
    major: "You get a free recovery roll that takes no action.",
    intrusions: "New situations confuse and stress you. Past actions, or failures to act, come back to haunt you.",
    tiers: [
      {tier: 1, abilities: [LIFE_LESSONS]},
      {tier: 2, abilities: [
        {name: "Totally Chill", act: "enabler", text: "Your ten-minute recovery roll takes only one round."}
      ]},
      {tier: 3, choice: true, abilities: [
        SKILL_WITH_ATTACKS,
        {name: "Improvise", cost: "2 Intellect", act: "enabler", text: "When you attempt a task you're not trained in, you can improvise (a makeshift tool, a flash of insight, plain dumb luck) to gain an asset on it."}
      ]},
      {tier: 4, abilities: [LIFE_LESSONS, GREATER_SKILL_WITH_DEFENSE]},
      {tier: 5, abilities: [GREATER_ENHANCED_POTENTIAL]},
      {tier: 6, choice: true, abilities: [
        {name: "Drawing on Life's Experiences", cost: "6 Intellect", act: "action", text: "Ask the GM one question and get a general answer. The GM sets the task level by how obscure the answer is: something you could look up elsewhere is level 1, obscure knowledge of the past is level 7. The player is encouraged to describe the past experience that supplies the answer."},
        QUICK_WITS
      ]}
    ]
  },
  {
    name: "Explores Dark Places",
    page: "63-64",
    summary: "Cellars, empty houses, tunnels and caves feel like home to you, and open skies may make you uneasy. The dark is where lost things turn up. You wear dark clothes to blend in, or sensible gear for serious work below ground.",
    connections: [
      "Another PC has been your partner on past expeditions. When you both work on the same noncombat task, you each gain an asset.",
      "You think you once saw two other PCs doing something illegal through a keyhole. You choose whether to share it; they choose whether it was really them.",
      "One other PC always seems to hear you, however quietly you move.",
      "One other PC is so loud that you feel bound to teach them to move quietly, whether they want lessons or not."
    ],
    minor: "The target is dazed for a round, and all its tasks are hindered.",
    major: "The target is stunned and loses its next turn.",
    intrusions: "Belongings slip out of pockets in the dark and maps go missing. Information you gather leaves out something important.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Superb Explorer", act: "enabler", text: "You're trained in [[perception]], [[endurance]] and [[gymnastics]] tasks."}
      ]},
      {tier: 2, abilities: [
        {name: "Superb Infiltrator", act: "enabler", text: "You're trained in [[lockpicking]] and [[mechanics]]."},
        {name: "Eyes Adjusted", act: "enabler", text: "Darkness doesn't hinder you, and you can see faintly even in total darkness."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Nightstrike", act: "enabler", text: "Attacks you make in dim light or darkness get a free level of Effort."},
        {name: "Slippery Customer", act: "enabler", text: "When you apply Effort to escape bonds, squeeze through tight spaces or perform other contortions, you get a free level of Effort. You're also trained in [[Speed defense]] tasks."}
      ]},
      {tier: 4, abilities: [
        {name: "Hard-Won Resilience", act: "enabler", text: "Exposure to terrible things has toughened you. Reduce any Stress you gain, from any source, by 1 point."}
      ]},
      {tier: 5, abilities: [
        {name: "Dark Explorer", act: "enabler", text: "You ignore penalties for any action, including fighting, in very dim light or cramped spaces. With Eyes Adjusted, that holds even in total darkness. You're trained in [[stealth]] tasks while in dim light or none."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Blinding Attack", cost: "3 Speed", act: "action", text: "Using a light source, you make a melee attack. It deals no damage, but if it hits, the target is blinded for one minute."},
        {name: "Dark Flow", cost: "6 Intellect", act: "action", text: "For one hour you're immersed in working in the dark. When you apply a level of Effort to [[stealth]], [[lockpicking]], [[endurance]] or [[perception]] tasks in dim light or darkness, you get two free levels of Effort on that task. Action to initiate."}
      ]}
    ]
  },
  {
    name: "Fights Dirty",
    page: "64-65",
    summary: "The only thing that matters in a fight is who wins. You bite, trip, throw dirt, taunt and lie, and you keep a few nasty surprises hidden on you: a blade in a boot, a razor in a hem, powder in a secret pocket.",
    connections: [
      "Another PC is good in a fight, and a few of your tricks would make them great.",
      "Another PC taught you some of your tricks.",
      "Another PC doesn't seem to approve of your methods.",
      "You beat another PC in a fight long ago, using your tactics. They want a friendly rematch and say they're ready for you."
    ],
    equipment: "An easily hidden weapon and one dose of level 3 poison that inflicts 6 points of damage.",
    minor: "Your foe trips and falls prone.",
    major: "You tangle the foe's legs. They fall and lose their next turn.",
    intrusions: "People think poorly of cheats. Sometimes a dirty trick backfires.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Taking Advantage", act: "enabler", text: "When a foe is prone, weakened, dazed, stunned, moved down the damage track or otherwise at a disadvantage, your attacks against it are eased, on top of any other modifiers from that disadvantage."}
      ]},
      {tier: 2, abilities: [
        {name: "Eye Gouge", cost: "2 Might", act: "action", text: "You attack a creature that has an eye. The attack is hindered, but on a hit the creature struggles to see for the next hour, and its tasks that rely on sight (most of them) are hindered."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Spot Weakness", act: "enabler", text: "If a creature you can see has a special weakness, such as a vulnerability to fire or a poor perception, you know it. Ask and the GM tells you."},
        {name: "Surprise Attack", act: "enabler", text: "When you attack from hiding, with surprise, or before your opponent has acted, you gain an asset on the attack and deal 2 extra points of damage on a hit."}
      ]},
      {tier: 4, abilities: [
        {name: "Mind Games", cost: "3 Intellect", act: "action", text: "You hit a foe that understands you with lies, mockery or vile language. On a success it is stunned and can't act for one round, then dazed the following round, with its tasks hindered."},
        {name: "Capable Fighter", act: "enabler", text: "Your attacks deal 1 extra point of damage."}
      ]},
      {tier: 5, abilities: [
        {name: "Using the Environment", cost: "4 Intellect", act: "action", text: "You turn your surroundings to your advantage. For ten minutes, your attack rolls and [[Speed defense]] rolls are eased. Action to initiate."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Twisting the Knife", cost: "4 Might", act: "action", text: "In a round after you hit a foe with a melee weapon, you can automatically deal that weapon's standard damage to it again, with no modifiers: 2 points for a light weapon, 4 for medium, 6 for heavy."},
        {name: "Murderer", cost: "8+ Might", act: "action", text: "A sudden strike to a vital spot kills a target of level 4 or lower outright. Each extra level of Effort raises the maximum target level by 1."}
      ]}
    ]
  },
  {
    name: "Helps Their Friends",
    page: "66-67",
    summary: "Helping your friends with small things and big ones is simply who you are. Maybe you always had friends, maybe you never did until now, or maybe you lost them and want another chance. When a friend needs a hand, you offer it without thinking.",
    connections: [
      "The first time you saw a friend in trouble, you didn't help. You suspect another PC (that friend) doesn't know, and you're thinking of telling them.",
      "You helped another PC with something mildly illegal. You feel guilty, and a little angry at them, though it was your choice.",
      "Another PC has always been there for you when you couldn't help yourself.",
      "You and another PC tried to help a mutual friend and failed. That friend is gone now, and you feel it's your fault. You don't know if they blame you."
    ],
    equipment: "A photo of you and your friends.",
    extrasNote: "You can swap one ability from your type for Advice From a Friend.",
    extras: [
      {name: "Advice From a Friend", cost: "1 Intellect", act: "action", text: "You know your friends' strengths and how to motivate them. When you suggest something about an ally's next action, they are trained in that action for one round."}
    ],
    minor: "Your coaching eases a friend's next action.",
    major: "Your help gives a friend a free recovery roll that takes no action.",
    intrusions: "Others sometimes have hidden motives. The law takes too much interest. Even when everything goes right, there are repercussions.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Friendly Help", act: "enabler", text: "If a friend fails a task and you help, they can retry it without spending Effort for the retry. This works even if you're not trained in the task."},
        {name: "Courageous", act: "enabler", text: "You're trained in [[Intellect defense]] and [[initiative]] tasks."}
      ]},
      {tier: 2, abilities: [
        {name: "Weather the Vicissitudes", act: "enabler", text: "Ignore the first point of Stress you gain each day. This resets after your ten-hour rest."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Buddy System", cost: "3 Intellect", act: "action", text: "Pick a character next to you to be your buddy for ten minutes. You're trained in all tasks to find, heal, interact with or protect them, and while you stand next to each other you both have an asset on [[Speed defense]] tasks. You can have only one buddy at a time. Action to initiate."},
        SKILL_WITH_ATTACKS
      ]},
      {tier: 4, abilities: [
        {name: "In Harm's Way", cost: "3 Might", act: "enabler", text: "When you spend your action putting your friends first, defense tasks are eased for any adjacent characters you choose until the end of your next turn. During that time, if one of those friends gains Stress you can take up to half of it (rounded up) instead, and if one would suffer a serious injury you can take it instead, as long as you're not already impaired or debilitated."},
        {name: "Enhanced Physique", act: "enabler", text: "Gain 3 points to split between your Might and Speed Pools however you like."}
      ]},
      {tier: 5, abilities: [
        {name: "Inspire Action", cost: "4 Intellect", act: "action", text: "Tell one ally who can see and understand you to take an action. If they take exactly that action, they do it immediately as an extra action, and it doesn't use up their normal action on their turn."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Deep Consideration", cost: "6 Intellect", act: "action", text: "When you plan with your friends to reach a goal together, ask the GM one very general question about how the plan is likely to go and get a short answer. Each of you also gains an asset on one roll that carries out the plan, if you act on it within a few days."},
        SKILL_WITH_DEFENSE
      ]}
    ]
  },
  {
    name: "Infiltrates",
    page: "68-69",
    summary: "Subtlety, guile and stealth are your trade, honed over years of practice. You use disguises and tools, but your training matters most. Infiltrators are often spies, agents or undercover officers, and sometimes thieves or assassins.",
    connections: [
      "You watched another PC from a distance for a while before you met and became allies. You decide whether to tell them.",
      "However hard you try, you can't hide from one other PC.",
      "You and two other PCs once worked a mission together, then fell out.",
      "Another PC is your sibling (if their player agrees), and you look very alike."
    ],
    minor: "Your moves startle the opponent so much that they're dazed and their tasks are hindered.",
    major: "Every opponent within short range is startled and dazed, with their tasks hindered.",
    intrusions: "Spies are punished harshly when caught, and allies disown infiltrators who get caught. Some secrets are better left buried.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Stealthy", act: "enabler", text: "You're trained in two of these skills of your choice: [[deception]], [[disguise]], [[lockpicking]], [[pickpocketing]] or [[stealth]]. You can take this ability more than once, choosing different skills each time."},
        {name: "Sense Attitudes", act: "enabler", text: "You're trained in [[discerning motive]]."}
      ]},
      {tier: 2, abilities: [
        {name: "Impersonate", cost: "2 Intellect", act: "action", text: "For one hour you change your voice, posture and mannerisms and throw together a disguise, gaining an asset to pass as someone else, either a specific person or a general role. Action to initiate."},
        {name: "Flight Not Fight", act: "enabler", text: "If you use your action only to move, your [[Speed defense]] tasks are eased."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Awareness", act: "action", text: "When you spend a level of Effort on a [[perception]] task, you get one extra free level of Effort on it."},
        SKILL_WITH_ATTACKS
      ]},
      {tier: 4, abilities: [
        {name: "Nearly Invisible", cost: "3 Speed", act: "action", text: "For ten minutes you commit fully to staying unseen. While hiding, you're specialized in [[stealth]] and [[Speed defense]] tasks. The effect ends if you reveal yourself (attacking, using an ability, moving something large), but you can take an action to hide again and restore it. Action to initiate or reinitiate."}
      ]},
      {tier: 5, abilities: [
        {name: "Evasion", act: "enabler", text: "You're trained in all defense tasks."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Brainwashing", cost: "5+ Intellect", act: "action", text: "With trickery and smooth lies, you make a target of level 3 or lower do as you say. On a successful Intellect attack, you direct the actions of a target you speak to for one minute, letting them act freely or overriding them case by case, as long as you can see and direct them. If someone challenges what they're doing, you need another successful Intellect attack to reassure them or they stop. Each extra level of Effort can raise the target's maximum level by 1 or add a minute. Action to initiate. The book advises handling this with care and never using it on PCs."},
        {name: "Spring Away", cost: "5 Speed", act: "enabler", text: "Whenever you succeed on a [[Speed defense]] roll, you can immediately move up to a short distance. Once per round."}
      ]}
    ]
  },
  {
    name: "Leads",
    page: "70-71",
    summary: "Through charisma, natural authority and maybe some training, you get others to follow you willingly. You might be a politician, captain or manager. You carry yourself to inspire, charm or intimidate, and your voice carries over any noise.",
    connections: [
      "Another PC used to follow you, but now you see them as an equal.",
      "Another PC recently mocked you in a way that really hurt. How you deal with it is up to you.",
      "Another PC introduces you to the follower you gain at tier 2.",
      "Another PC looks so much like you that you suspect you're half-siblings."
    ],
    minor: "The next time you try to influence the same foe, the task is eased.",
    major: "The foe stays persuaded, deceived, intimidated or otherwise influenced for twice as long.",
    intrusions: "Followers fail, betray you, lie, become corrupted, get kidnapped or die.",
    notes: [
      "<strong>Followers (p71):</strong> Followers don't need pay, food or housing. The PC usually rolls for a follower. A follower's level is how many tasks they have a modification in, chosen when you gain them. When helping you, a follower grants an asset on a task they have a modification for, and acts as if they had an inability in everything else. Acting on their own, a modification raises their effective level by one for that task.",
      "A follower can't grant an asset to attacks or defense until they're level 3, and then only with a matching modification. A follower gains a level (and a new modification) each time you advance two tiers after gaining them. The GM may occasionally offer an exceptional follower, one level higher than normal. A follower can be a pet if it makes sense.",
      "The GM may ask you to actually go and find a suitable follower when you take Basic Follower."
    ],
    tiers: [
      {tier: 1, abilities: [
        {name: "Natural Charisma", act: "enabler", text: "You're trained in all social interactions, including [[persuasion]], [[deception]], [[intimidation]] and [[discerning motive]]."},
        {name: "Good Advice", act: "enabler", text: "When you help another character with a task, they gain an additional asset on top of the normal benefit of help."}
      ]},
      // The book prints two "Tier 2" headings here; both abilities are tier 2.
      {tier: 2, abilities: [
        {name: "Enhanced Potential", act: "enabler", text: "Gain 3 points to split among your stat Pools however you like."},
        {name: "Basic Follower", act: "enabler", text: "You gain a level 2 follower, and one of their modifications must be [[persuasion]]. You can take this ability more than once, gaining another level 2 follower each time."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Advanced Command", cost: "7 Intellect", act: "action", text: "On a successful Intellect attack, a target within short range who can hear and understand you obeys any command you give. While you keep doing nothing but issue commands, you can give that target a new one each turn. It ends when you stop or they leave short range. Action to initiate."},
        {name: "Expert Follower", act: "enabler", text: "You gain a level 3 follower with no restriction on their modifications. You can take this more than once. Instead of a new level 3 follower, you can raise an existing level 2 follower to level 3 and gain a new level 2 follower."}
      ]},
      {tier: 4, abilities: [
        {name: "Captivate or Inspire", act: "action", text: "Use your words one of two ways. Either all NPCs of level 2 or lower who hear you stay fixed on you for as long as you keep talking, or all NPCs who hear you act as one level higher for the next hour. You pick which NPCs are affected. Attacking anyone in the crowd breaks their attention. Action to initiate."}
      ]},
      {tier: 5, abilities: [GREATER_ENHANCED_POTENTIAL]},
      {tier: 6, choice: true, abilities: [
        {name: "Band of Followers", act: "enabler", text: "You gain four level 3 followers with no restriction on their modifications."},
        {name: "Mind of a Leader", cost: "6 Intellect", act: "action", text: "When you plan how to handle a future situation, ask the GM one very general question about how the plan is likely to go and get a short answer."}
      ]}
    ]
  },
  {
    name: "Learns Quickly",
    page: "72-73",
    summary: "You don't have your dream job, but you get by. Events may have pushed you here, or your break just hasn't come yet. You work hard, handle trouble as it comes and pick things up fast. You dress to blend in, because standing out draws the wrong attention.",
    connections: [
      "Another PC helped you land your current job.",
      "Through no fault of their own, another PC got you fired from your last job.",
      "Another PC is your cousin.",
      "You're fairly sure another PC hates you, though you don't know why."
    ],
    equipment: "Two tickets to a show at a local cinema.",
    minor: "Your next task, attack or defense roll within one minute is eased.",
    major: "Treat your next task, attack or defense roll within one minute as a natural 18.",
    intrusions: "Accidents and mistakes are great teachers.",
    tiers: [
      {tier: 1, abilities: [
        ENHANCED_INTELLECT,
        {name: "Picked Up a Few Things", act: "enabler", text: "You're trained in one noncombat task you aren't already trained in."}
      ]},
      {tier: 2, abilities: [
        {name: "Quick Study", act: "enabler", text: "After the first attempt, you gain an asset on repeated similar tasks, like working the same device again or attacking the same foe. The benefit fades once you move to a different task, until you return to it."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Enhanced Intellect Edge", act: "enabler", text: "Gain +1 to your Intellect Edge."},
        FLEX_SKILL
      ], also: [
        {name: "Hard to Distract", act: "enabler", text: "You're trained in [[Intellect defense]] tasks. You gain this alongside whichever tier 3 ability you choose."}
      ]},
      {tier: 4, abilities: [
        {name: "Pay It Forward", cost: "3 Intellect", act: "action", text: "When you suggest something about another character's next action (not an attack), their action is eased for one minute."}
      ]},
      {tier: 5, abilities: [
        ENHANCED_INTELLECT,
        {name: "Learned a Few Things", act: "enabler", text: "You're trained in two areas of knowledge of your choice, or specialized in one."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Two Things at Once", cost: "6 Intellect", act: "enabler", text: "You split your attention and take two separate actions this round."},
        SKILL_WITH_DEFENSE
      ]}
    ]
  },
  {
    name: "Looks for Trouble",
    page: "74-75",
    summary: "You're a scrapper who meets problems head-on and physically. You don't hide or back down, and your friends feel safer heading into danger with you beside them. You probably dress loud so you stand out.",
    connections: [
      "Past events made you watch over another PC. They're your default charge for your tier 2 Protector ability.",
      "One or two other PCs seem tough, and you secretly hope to find out who's tougher.",
      "When another PC is within immediate range during a fight, they sometimes ease your attacks and sometimes accidentally hinder them (50% chance each way, rolled per fight).",
      "You used to be in a relationship with another PC. It ended long ago."
    ],
    equipment: "A melee weapon of your choice.",
    minor: "The target is dazed for a round, with all its tasks hindered.",
    major: "A piece of equipment your opponent wears or holds is destroyed.",
    intrusions: "Weapons break or fly out of your grip. Brawlers trip. Things on the battlefield fall or collapse.",
    tiers: [
      {tier: 1, abilities: [
        FISTS_OF_FURY,
        {name: "Wound Tender", act: "enabler", text: "You're trained in [[healing]]."}
      ]},
      {tier: 2, abilities: [
        {name: "Protector", act: "enabler", text: "Name one character as your charge. You can change who it is every round, but you have only one at a time. While your charge is within immediate range, they gain an asset on [[Speed defense]] tasks."},
        {name: "Breaking", act: "enabler", text: "Your tasks to smash doors, containers and other objects are eased."}
      ]},
      {tier: 3, choice: true, abilities: [SKILL_WITH_ATTACKS, GREATER_ENHANCED_POTENTIAL]},
      {tier: 4, abilities: [
        {name: "Knock Out", cost: "5+ Might", act: "action", text: "Make a melee attack that deals no damage. If it hits, make a second Might-based roll; on a success a foe of level 3 or lower is knocked unconscious for one minute. Each level of Effort can raise the foe level you can affect by one or add a minute to the duration."}
      ]},
      {tier: 5, abilities: [
        {name: "Mastery With Attacks", act: "enabler", text: "Pick one attack type you're trained in (light, medium or heavy; bashing, bladed or ranged). You become specialized in it. If you aren't trained in any attack type yet, take Skill With Attacks instead to become trained."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Greater Enhanced Might", act: "enabler", text: "Gain 6 points to your Might Pool."},
        {name: "Lethal Damage", act: "enabler", text: "Pick one of your attacks that deals points of damage: a weapon, your unarmed attacks or a supernatural ability. It deals 5 extra points of damage when it hits."}
      ]}
    ]
  },
  {
    name: "Moves Like a Cat",
    page: "75-76",
    summary: "You have uncanny balance and coordination. You move with grace, rarely knock anything over, land well when you fall and often avoid danger altogether. You wear close-fitting clothes and carry little.",
    connections: [
      "Another PC's clumsiness and noise annoy you.",
      "Another PC comes from the same place as you, and you knew each other as children.",
      "You help another PC with advice and a steadying hand. When you're next to each other, their [[gymnastics]] tasks are eased.",
      "Another PC owes you a lot of money."
    ],
    minor: "You restore 2 points to your Speed Pool.",
    major: "You can take a second action this round.",
    intrusions: "Even a cat can be clumsy. A jump is harder than it looks, or an escape move overshoots straight into danger.",
    tiers: [
      {tier: 1, abilities: [
        GREATER_ENHANCED_SPEED,
        {name: "Balance", act: "enabler", text: "You're trained in [[gymnastics]]."}
      ]},
      {tier: 2, abilities: [
        {name: "Grit", act: "enabler", text: "You're trained in [[endurance]] tasks."},
        {name: "Safe Fall", act: "enabler", text: "Falls cause you no Stress, though a fall of more than 10 feet (3.5 m) can still cause a serious injury."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Enhanced Speed Edge", act: "enabler", text: "Gain +1 to your Speed Edge."},
        GREATER_ENHANCED_SPEED
      ], also: [
        {name: "Hard to Hit", act: "enabler", text: "You're trained in [[Speed defense]] tasks. You gain this alongside whichever tier 3 ability you choose."}
      ]},
      {tier: 4, abilities: [
        {name: "Quick Strike", cost: "4 Speed", act: "action", text: "You make a melee attack so fast it's hard to defend against. The attack is eased by two steps, and a foe you hit takes normal damage and is dazed, with its tasks hindered next round."}
      ]},
      {tier: 5, abilities: [
        {name: "Slippery", act: "enabler", text: "Tasks to escape any bond or grasp are eased."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Perfect Speed Burst", cost: "6 Speed", act: "enabler", text: "You take two separate actions this round."},
        GREATER_ENHANCED_SPEED
      ]}
    ]
  },
  {
    name: "Needs No Weapon",
    page: "76-77",
    summary: "You are the weapon. Punches, kicks and full-body moves let you hurt foes badly without draining yourself. You learned through training, the military or a rough upbringing, and you keep your body in top shape. You wear loose clothes and rarely carry anything but maybe knuckle or boot weapons.",
    connections: [
      "Another PC thinks a real weapon is something you hold, and may look down on you.",
      "Another PC is so unaware of their body that they keep getting in your way. If you miss and hit someone nearby by accident, it's likely them.",
      "You once trained with a close friend of another PC, and you owe that friend a great deal.",
      "Two other PCs asked to become your students, but only one shows any talent."
    ],
    minor: "You trip the target and knock it prone.",
    major: "You strike a limb, making it useless for the next minute.",
    intrusions: "Hitting some foes hurts you as much as them. Armed opponents have longer reach. Complicated moves can throw you off balance.",
    tiers: [
      {tier: 1, abilities: [
        FISTS_OF_FURY,
        {name: "Scarred and Hardened", act: "enabler", text: "Reduce the Stress you suffer from physical injury by 1 (by 2 if your type already gives you this ability). Stress from mental shock or despair is unaffected."}
      ]},
      {tier: 2, abilities: [
        {name: "Advantage to Disadvantage", cost: "3 Speed", act: "action", text: "You attack an armed foe with a flurry of moves, dealing damage and disarming them. Their weapon ends up in your hands or 10 feet (3.5 m) away on the ground, your choice. This attack is hindered."},
        {name: "Unarmed Fighting Style", act: "enabler", text: "You're trained in unarmed attacks."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Moving Like Water", cost: "3 Speed", act: "enabler", text: "You flow and spin so that for one minute all your attacks and [[Speed defense]] tasks gain an asset."},
        GREATER_ENHANCED_POTENTIAL
      ]},
      {tier: 4, abilities: [
        {name: "Stand Like Iron", cost: "5 Might", act: "enabler", text: "The next attack this encounter that would give you a serious injury gives you 2 points of Stress instead."}
      ]},
      {tier: 5, abilities: [
        {name: "Stun Attack", cost: "6 Speed", act: "action", text: "As part of a melee or ranged attack, attempt a difficulty 5 Speed task. On a success, your attack deals normal damage and the creature is stunned and loses its next turn. On a failure you still roll the attack normally but can't stun."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Master of Unarmed Fighting Style", act: "enabler", text: "You're specialized in unarmed attacks. If you already are, your unarmed attacks deal 2 extra points of damage instead."},
        {name: "Lethal Damage", act: "enabler", text: "Your unarmed attacks deal 5 extra points of damage when they hit."}
      ]}
    ]
  },
  {
    name: "Never Says Die",
    page: "78-79",
    summary: "When others give up, you're only getting started. Resilience and stubborn determination carry you through. You don't fuss over your appearance and you're not much of a talker. You act.",
    connections: [
      "You feel an overwhelming need to impress another PC, and you're not sure why.",
      "Another PC is capable but needs motivating, and you keep urging them to keep going.",
      "You feel protective of another PC and don't want to see them hurt.",
      "Another PC says they've known you for years, but you barely remember them."
    ],
    minor: "You restore 2 points to your Might Pool.",
    major: "Your next action is eased by two steps.",
    intrusions: "Sometimes it's your equipment or weapons that give out.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Improved Recovery", act: "enabler", text: "Your ten-minute recovery roll takes one action instead, so your first two recovery rolls take one action each, the third one hour and the fourth ten hours."},
        {name: "Push on Through", cost: "2 Might", act: "enabler", text: "For one hour you ignore the effects of terrain while moving."}
      ]},
      {tier: 2, abilities: [
        {name: "Tough", act: "enabler", text: "You gain an extra step on your damage track, called hurt, between hale and impaired. Hurt has no other effect; you're sore and bruised but fine."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Stand Like Iron", cost: "4 Might", act: "enabler", text: "The next attack this encounter that would give you a serious injury gives you 2 points of Stress instead."},
        {name: "Hidden Reserves", act: "enabler", text: "When you make a recovery roll, you also gain +1 to your Might Edge and your Speed Edge for the next ten minutes."}
      ]},
      {tier: 4, abilities: [
        {name: "Outlast the Foe", act: "enabler", text: "After five full rounds of combat, you have an asset on all tasks for the rest of that combat and deal 1 extra point of damage per attack."}
      ]},
      {tier: 5, abilities: [
        {name: "Not Dead Yet", act: "enabler", text: "While debilitated, you can act as if you were only impaired. You're still one step from death."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Final Defiance", act: "enabler", text: "When you would die, you stay conscious and active, debilitated, for one more round, plus another round each time you succeed on a difficulty 5 Might task. If someone else succeeds on a difficulty 5 healing task on you during that time, you survive, still debilitated. If you reach dead again while in this state, you can't be saved."},
        {name: "Ignore Affliction", cost: "5 Might", act: "action", text: "Ignore an unwanted condition or affliction (disease, paralysis, mind control, a broken limb and so on, but not Stress or the damage track) and act as if it doesn't affect you for one hour. A condition that would last less than an hour is negated entirely."}
      ]}
    ]
  },
  {
    name: "Practically Lives Online",
    page: "79-80",
    summary: "The internet has been your home since you first opened a browser. Websites, social media, gaming, streaming, forums, apps: you know the latest news, jokes and places that matter. You dress so casually it's sometimes inappropriate, and you may forget mirrors exist.",
    connections: [
      "You knew another PC online long before you met in person.",
      "Another PC says you spend too much time online and tells you to go outside. Charming or just annoying? You decide.",
      "Another PC believes you've dug up their personal information. You decide whether they're right.",
      "Another PC is hopeless with tech and keeps asking you to fix their computer or explain things."
    ],
    equipment: "A top-of-the-line laptop and smartphone, beyond what an average character could afford.",
    minor: "Your next attempt at anything involving computers is eased.",
    major: "Thinking about how you'll brag online about this, you immediately restore 1d6 + 1 points to your Intellect Pool.",
    intrusions: "Hackers get hacked. Paying attention to the internet leads to doing or saying exactly the wrong thing in real life.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Online Research", cost: "1 Intellect", act: "enabler", text: "All [[researching]] tasks are eased when you have internet access."},
        {name: "Tech Skill", act: "enabler", text: "You're trained in one of these skills of your choice: [[electronics]], [[engineering]], [[programming]] or [[researching]]."}
      ]},
      {tier: 2, abilities: [
        {name: "Hacking", cost: "3 Intellect", act: "enabler", text: "You can pose as someone else online, which might get you into their information, money or credit cards, or let you tip off the authorities about crimes they (probably didn't) commit. Less harmfully, you can learn about them: address, routine, current location. It takes from a minute to many hours, and the difficulty depends on the person's level and their online security; reading someone's email is harder than tracing their family history, and their bank account harder still."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Online Contacts", act: "enabler", text: "You have three contacts you know only online, each with an area of expertise you choose. With online access you can ask them about their field and get a detailed answer within an hour, and answers to follow-up questions within another hour."},
        {name: "Crowdsourcing", cost: "3 Intellect", act: "action", text: "You post a question online and let others help. If you wait for the answers (up to 24 hours), any information-related task, research included, is eased by two steps. Action to initiate."}
      ]},
      {tier: 4, abilities: [
        {name: "Deep Dive", cost: "6 Intellect", act: "action", text: "Through the internet, ask the GM one question and get a general answer. The GM sets the level by how obscure it is: something findable elsewhere is level 1, obscure knowledge of the past is level 7. Knowledge of the future is impossible."}
      ]},
      {tier: 5, abilities: [
        {name: "Better Hacking", cost: "5 Intellect", act: "action", text: "With electronic access to a system, you try to take control of it: cameras, alarms, electronic locks, tracking, whole email servers, website back ends, databases and so on. The difficulty depends on its protections, usually 3 to 9, and it may take one action or hours."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Read It Somewhere", cost: "6 Intellect", act: "action", text: "After a round of concentration, you recall obscure facts from the internet that ease the task you attempt next round by three steps."},
        {name: "Brain Food", act: "enabler", text: "Gain 6 points to your Intellect Pool."}
      ]}
    ]
  },
  {
    name: "Runs Away",
    page: "81-82",
    summary: "Running isn't always your answer, but it's your first instinct, and it has saved you more than once. Caution is an art form to you. Once you've judged a threat from somewhere safe, you'll deal with it. You're no coward; you just choose when to engage. You wear comfortable, neutral clothes you can run and hide in.",
    connections: [
      "While fleeing a threat, you left another PC to fend for themselves. They barely survived. Their player decides whether they resent or forgive you.",
      "Another PC recently put you in danger, by accident or not. You're fine now, but wary of them.",
      "Another PC seems even more nervous than you about something. You'd like to teach them your measured approach to fear.",
      "Another PC doubts your caution is thoughtful and laughs when you explain it. They may have called you a coward."
    ],
    equipment: "A pair of running shoes that fit perfectly.",
    minor: "You can attempt a stealth task any time before the end of next round.",
    major: "You take an extra action, used only to move a short distance, attempt a stealth action, or move an immediate distance and attempt a stealth action.",
    intrusions: "Quick movements lead to dropped items, slips on uneven ground or wrong turns.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Go Defensive", cost: "1 Intellect", act: "enabler", text: "In combat, you can enter a state of heightened alertness whenever you like. While in it you can't use Intellect points, but you gain +1 to your Speed Edge and two assets on [[Speed defense]] tasks. It lasts until you choose to end it, you attack a foe, or no combat is going on within range of your senses. After it ends, you can't use it again until you've made a recovery roll."}
      ]},
      {tier: 2, abilities: [
        {name: "Enhanced Speed", act: "enabler", text: "Gain 3 points to your Speed Pool."},
        {name: "Quick to Flee", act: "enabler", text: "You're trained in [[stealth]] and [[gymnastics]]."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Incredible Running Speed", act: "enabler", text: "You can move up to a long distance as part of another action. As an action, you can move up to 200 feet (60 m), or up to 500 feet (150 m) with a successful difficulty 4 Speed-based roll."},
        GREATER_ENHANCED_SPEED
      ]},
      {tier: 4, abilities: [
        {name: "Increasing Determination", act: "enabler", text: "If you fail a noncombat physical task (forcing a door, climbing a cliff) and retry it, you don't need to apply a level of Effort to retry, but the retry is still eased. A second failure gives no special benefit."},
        QUICK_WITS
      ]},
      {tier: 5, abilities: [
        {name: "Go to Ground", cost: "4 Speed", act: "action", text: "You move up to a long distance and try to hide, gaining an asset on the stealth task to vanish from everyone who knew you were there."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Burst of Escape", cost: "5 Speed", act: "enabler", text: "You take two separate actions this round, as long as one of them is hiding or moving in a direction that isn't toward a foe."},
        SKILL_WITH_DEFENSE
      ]}
    ]
  },
  {
    name: "Solves Mysteries",
    page: "82-83",
    summary: "You're a master of deduction. A sharp eye and quick wit let you piece clues together while others are stumped. You might be a detective, but a professor or scientist fits too. You dress practically with a touch of style, maybe carrying a briefcase of tools.",
    connections: [
      "Another PC is the friend who got you reading detective fiction, which became your obsession.",
      "Another PC doesn't seem to trust or like you, and you feel you must win them over.",
      "Another PC is a great sounding board. After an hour talking with them, you gain an asset on any knowledge-based task you're trained in.",
      "You and another PC were rivals in some past endeavour."
    ],
    minor: "You find an additional clue about the mystery you're working on.",
    major: "When you reveal a solution in front of its subject, they're stunned by your brilliance and can't move or act for a round.",
    intrusions: "Evidence disappears, red herrings confuse, witnesses lie, and early research is wrong.",
    tiers: [
      {tier: 1, abilities: [
        {name: "Investigate", act: "enabler", text: "You can pay for levels of Effort on any Intellect-based task from your Might, Speed or Intellect Pool."},
        {name: "Sleuth", act: "enabler", text: "You're trained in [[perception]]."}
      ]},
      {tier: 2, abilities: [
        {name: "Out of Harm's Way", act: "enabler", text: "You're trained in [[Speed defense]] tasks."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "You Studied", act: "enabler", text: "You're trained in two areas of knowledge of your choice (not physical or combat skills), or specialized in one."},
        SKILL_WITH_ATTACKS
      ]},
      {tier: 4, abilities: [
        {name: "Draw Conclusion", cost: "3 Intellect", act: "action", text: "After a few minutes of careful observation and investigation (questioning NPCs, searching a room or file), a difficulty 3 Intellect task teaches you a pertinent fact. Each further use is hindered by an extra step, until you rest for ten hours and the difficulty resets to 3."}
      ]},
      {tier: 5, abilities: [
        {name: "Defuse Situation", act: "action", text: "When questioning provokes anger or violence, you deflect with distraction or evasion. On a successful Intellect attack, a living foe can't attack anyone or anything for one round."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Seize the Initiative", cost: "5 Intellect", act: "enabler", text: "Within one minute of successfully using Draw Conclusion, you can take one extra, immediate action, even out of turn. You can't use this again until you've rested for ten hours."},
        GREATER_SKILL_WITH_DEFENSE
      ]}
    ]
  },
  {
    name: "Wears a Badge",
    page: "84-85",
    summary: "You're a police officer. It's a hard and often thankless job, made worse when bad apples abuse their power, but you take enforcing the law and keeping the peace seriously. Hard questions and your commanding presence often get confessions. On duty you're in uniform with your badge or warrant card on show; off duty you still carry them.",
    connections: [
      "Another PC once trained under you as a cadet (if they agree they were in law enforcement), but has since moved on.",
      "You know another PC spent several months in prison, but not why.",
      "Another PC is an old friend who hates that you're a cop and keeps trying to get you to quit.",
      "There's a warrant on record for another PC, probably unpaid parking fines. You've chosen not to raise it, for now."
    ],
    equipment: "Police uniform and duty belt (handcuffs, radio, holster, torch), a badge, a gun (medium ranged weapon you're licensed to carry) and a baton (light melee weapon).",
    minor: "The next time you command the same foe, the task is eased.",
    major: "The foe surrenders, or your ability affects them for twice as long.",
    intrusions: "Bystanders react badly when you reveal your authority. A more urgent situation demands your attention.",
    notes: [
      "<strong>Badge or warrant card:</strong> a real one requires ongoing employment with a police force, though leave, sabbaticals and holidays don't put it at risk. If it's taken away and you use a fake, someone may spot the fraud, though most NPCs won't.",
      "Taking Close to the Chief makes you part of the problem: special treatment is likely a sign of corruption."
    ],
    tiers: [
      {tier: 1, abilities: [
        {name: "Authority", act: "enabler", text: "Your air of authority is an asset on all social interactions. Some people react the opposite way, such as criminals or those the police have wronged, and your interactions with them are hindered instead."},
        {name: "Driver", act: "enabler", text: "You're trained in [[driving]]."},
        {name: "Armed Response", act: "enabler", text: "You're practiced with guns and take no penalty when you use one."}
      ]},
      {tier: 2, abilities: [
        {name: "Command", cost: "3 Intellect", act: "action", text: "Using your authority as an officer, you give one simple command to a target within short range who can understand you. On a successful Intellect attack, they try to carry it out as their next action. The command can't directly harm them or their allies (\"Flee\" might work, \"Stab yourself\" won't) and must be a single action. They can still defend themselves and strike back if attacked."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Cool Under Fire", act: "enabler", text: "You're trained in [[Speed defense]] tasks."},
        {name: "Insider", act: "enabler", text: "You can get information only law enforcement has: past cases and crimes, identities from licence plates, missing persons details and so on."}
      ]},
      {tier: 4, abilities: [
        {name: "Rapid Attack", cost: "3 Speed", act: "enabler", text: "Once per round, you can make an extra attack with your gun."}
      ]},
      {tier: 5, abilities: [
        {name: "Encouraging Presence", cost: "2 Intellect", act: "action", text: "For one minute, allies within short range gain an asset on defense rolls."},
        SKILL_WITH_DEFENSE
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Greater Enhanced Might or Speed", act: "enabler", text: "Gain 6 points to your Might Pool, 6 to your Speed Pool, or split 6 points between them."},
        {name: "Close to the Chief", act: "enabler", text: "The chief of police (or equivalent) respects and likes you. Beyond sharing information, they give you room to bend or break the rules. Through them you can see almost any case file, in your department or other agencies (national police, Interpol and the like), and call in backup or help, kept confidential if needed."}
      ]}
    ]
  },
  {
    name: "Works the Back Alleys",
    page: "86-87",
    summary: "Thief, burglar, pickpocket: you've made a living in the back alleys at the expense of the rich and careless, whether out of danger or desperation. Those talents serve you well in plenty of other work too. You dress to blend in, and in black when you're on a job.",
    connections: [
      "Another PC knew you before and helped you leave crime behind, at least for now.",
      "You once tried to steal from another PC, and they caught you.",
      "You can never hide from one particular PC.",
      "Another PC knows your real identity or that you work undercover (if either is secret), and has kept quiet so far."
    ],
    equipment: "A bag of light tools, including lockpicks.",
    minor: "You can immediately try to hide after this action.",
    major: "You can immediately take a second action this turn.",
    intrusions: "Thieves end up in jail. Powerful enemies are made.",
    notes: [
      "Underworld contacts are lasting additions to the campaign, limited to what those people know and can do. I Know a Guy is deliberately more open-ended, but its help is temporary."
    ],
    tiers: [
      {tier: 1, abilities: [
        {name: "Stealthy", act: "enabler", text: "You're trained in two of these skills of your choice: [[deception]], [[discerning motive]], [[disguise]], [[lockpicking]], [[pickpocketing]] or [[stealth]]. You can take this ability more than once, choosing different skills each time."}
      ]},
      {tier: 2, abilities: [
        {name: "Underworld Contacts", act: "enabler", text: "You know many people involved in illegal activity. They aren't necessarily friends or trustworthy, but they see you as one of their own and may owe you a favour. Work out three or four of these contacts with the GM."}
      ]},
      {tier: 3, choice: true, abilities: [
        {name: "Pull a Fast One", cost: "3 Intellect", act: "enabler", text: "When you run a con, pick a pocket, trick a mark, sneak something past a guard and the like, you gain an asset on the task."},
        {name: "I Know a Guy", cost: "4 Intellect", act: "enabler", text: "Facing a difficult problem that isn't urgent, you reach someone you know, or know of, who might solve it. They're nearly always on the edges of society: criminals, ex-convicts and the like. Typical help includes fencing or buying illegal goods, forgeries and fake IDs, breaking into computers or phones, getting confidential information, or hiring criminals from burglars to hitmen. Finding them, meeting and agreeing terms usually takes three to seven days, and they expect payment or a favour."}
      ]},
      {tier: 4, abilities: [
        {name: "Master Thief", act: "enabler", text: "You're trained in [[gymnastics]] and [[lockpicking]]."}
      ]},
      {tier: 5, abilities: [
        {name: "Dirty Fighter", cost: "2 Speed", act: "action", text: "You distract, blind, annoy or otherwise hamper a foe, hindering their attacks and defenses for one minute."}
      ]},
      {tier: 6, choice: true, abilities: [
        {name: "Alley Rat", cost: "6 Intellect", act: "action", text: "In a city, you find or make a major shortcut, secret way in or emergency escape route where none seemed to exist. It takes a successful Intellect action at a difficulty the GM sets. Work out the details with the GM."},
        {name: "All-Out Con", cost: "7 Intellect", act: "action", text: "You put everything in: add three free levels of Effort to your next task. You can't use this again until after a ten-hour recovery."}
      ]}
    ]
  },
  {
    name: "Would Rather Be Reading",
    page: "88-89",
    summary: "People have always asked why you read so much, and whether you'd rather read about life than live it. Yes, you think. Books are your friends, fiction for escape and nonfiction for knowledge, and nothing matters more than learning. You always have something to read on you.",
    connections: [
      "Another PC understands that you need time and space alone to read.",
      "Another PC gave you a book that became a favourite.",
      "Another PC reminds you of the hero of a favourite book, and you can't help liking them.",
      "Another PC borrowed a book, never returned it, and has no good story about what happened."
    ],
    equipment: "A couple of books on topics of your choice.",
    minor: "Something you've read eases your next action.",
    major: "A book trips up the foe somehow (they slip on it, or are too startled to act) and they're stunned, losing their next turn.",
    intrusions: "Books burn, get wet or go missing. Devices break or run out of power. Glasses break.",
    tiers: [
      {tier: 1, abilities: [KNOWLEDGE_IS_POWER]},
      {tier: 2, abilities: [GREATER_ENHANCED_INTELLECT]},
      {tier: 3, choice: true, abilities: [
        {name: "Applying Your Knowledge", act: "action", text: "When you help another character with an action you're untrained in, you count as trained, so they gain two assets instead of one."},
        FLEX_SKILL
      ]},
      {tier: 4, abilities: [
        KNOWLEDGE_IS_POWER,
        {name: "Knowing the Unknown", cost: "6 Intellect", act: "action", text: "Using resources suited to your character, ask the GM one question and get a general answer. The GM sets the level by how obscure it is: findable elsewhere is level 1, obscure knowledge of the past is level 7. Knowledge of the future is impossible."}
      ]},
      {tier: 5, abilities: [GREATER_ENHANCED_INTELLECT]},
      {tier: 6, choice: true, abilities: [
        {name: "Tower of Intellect", act: "enabler", text: "You're trained in [[Intellect defense]] tasks, or specialized if you're already trained."},
        {name: "Credible Hypothesis", cost: "4 Intellect", act: "action", text: "You examine an area. With a successful difficulty 3 Intellect-based roll you learn precise, useful details about its past, if there are any. You can ask the GM up to four questions about the immediate area, each needing its own roll."}
      ], also: [KNOWLEDGE_IS_POWER]}
    ]
  }
];

/**
 * Becoming an Avatar (p89-96).
 *
 * The book calls "Serves as an Avatar" a sort of additional focus whose
 * abilities add to the character's normal focus. Every Avatar gets Sense
 * Avatar and Sense Supernatural Activity, plus one power tied to their Entity
 * (or a custom one agreed with the GM). So each Entity becomes its own focus
 * Item, "Serves as an Avatar: <Entity>", attached alongside the normal focus.
 *
 * Graph modelling: the two shared powers are Tier 1 nodes so they are available
 * as soon as the GM attaches the focus (becoming an Avatar is a narrative gate
 * at Tier 4+, not something the Tier graph can express). The Entity powers are
 * Tier 4 nodes, each reached from Sense Avatar, and the player takes one.
 * Sense Avatar and Sense Supernatural Activity are single shared Ability
 * documents referenced by every Avatar focus. The Extinction has no Avatars
 * yet, so it has no focus.
 */
export const AVATAR = {
  page: "89-96",
  summary: "The Entities sometimes give a person a share of their power, spreading fear in the world. That person is an Avatar. Each Entity makes its own Avatars, directly or not, and may have several or none. The Avatar chooses to accept the gift, even without grasping what it means. Some serve their Entity like a god; unwilling ones hold great power knowing each use feeds something malevolent.",
  requirements: [
    "Tier 4 or higher.",
    "Has gained 10 levels of Stress from paranormal experiences over time.",
    "Has at least one supernatural ability from their type.",
    "Has died and been reborn, physically or metaphorically: something drastic has changed them in body or mind. A character who seems to die in play and meets the other requirements may return changed, likely only once."
  ],
  feeding: "An Avatar must feed their Entity or be fed upon. If you don't use your Entity power at least once a week, you gain 3 points of Stress, and 3 more each following day you go without using it.",
  customNote: "The Entity powers are suggestions. Work with the GM to customise your Entity-specific power to fit your idea of the Avatar.",
  common: [
    {name: "Sense Avatar", act: "enabler", text: "You can tell another Avatar is one if you can perceive them normally and are nearby, usually with no roll or action. An Avatar can try to hide what they are, but you can still spend an action on an Intellect-based task to identify them."},
    {name: "Sense Supernatural Activity", cost: "2 Intellect + 2 Stress", act: "action", text: "You sense the presence of any supernatural creature, artefact, book or effect within immediate range."}
  ],
  entities: [
    {entity: "The Buried", page: "91", powers: [
      {name: "Claustrophobia", cost: "4 Intellect + 3 Stress", act: "action", text: "A creature you touch feels everything around them closing in until suffocation seems real. They suffer 3 points of Stress (3 points of damage for an NPC), and 3 more each round you keep making successful rolls against them. You must use your action each round to concentrate."},
      {name: "Crushing Debt", cost: "4 Intellect + 3 Stress", act: "action", text: "A creature you touch is suddenly pursued by a convincing debt-collection agency, by text, email or in person, and believes ruin is imminent, every other worry crowding in. They suffer 3 points of Stress (3 points of damage for an NPC), and 3 more each round you keep making successful rolls against them. You must use your action each round to concentrate. When it ends, the agency drops the matter, perhaps admitting a mistake. Action to initiate."},
      {name: "Drown", cost: "4 Intellect + 3 Stress", act: "action", text: "A creature you touch who holds a liquid or is within immediate range of even a little has an accident: tea goes down wrong, they fall face-first into a sink or into a river. They suffer 3 points of Stress (3 points of damage for an NPC), and 3 more each round you keep making successful rolls against them. You must use your action each round to concentrate. Action to initiate."}
    ]},
    {entity: "The Corruption", page: "91", powers: [
      {name: "Crawling Corruption", cost: "4 Intellect + 3 Stress", act: "action", text: "Insects associated with rot burst from a creature's body where you touch it. It suffers a serious injury (6 points of damage for an NPC)."},
      {name: "Touch of Decay", cost: "4 Intellect + 3 Stress", act: "action", text: "An object no larger than you that you touch decays as if five hundred years passed at once: wood and cloth crumble, metal corrodes, stone weathers a little. A living creature you touch suffers a serious injury (6 points of damage for an NPC)."},
      {name: "Vile Fondness", cost: "4 Intellect + 3 Stress", act: "action", text: "A creature you touch becomes drawn to something most find vile, like an infectious disease ward or a toxic former lover. They seek it out as soon as their circumstances reasonably allow, and stay infatuated for about a day or until the fondness causes them a serious consequence."}
    ]},
    {entity: "The Dark", page: "92", powers: [
      {name: "Blinding Touch", cost: "4 Intellect + 3 Stress", act: "action", text: "A creature you touch is blinded for one minute. During that time it suffers 1 point of Stress every few rounds, up to 3 (damage instead for an NPC), from fear or from stumbling into things."},
      {name: "Brackish Gloom", cost: "4 Intellect + 3 Stress", act: "action", text: "Cold, black, salty water seeps from you into a small pool around you. It doesn't slow you, but foes' attacks against you are hindered by two steps while it lasts: up to ten minutes, until you end it, or until you move more than an immediate distance. Action to initiate."},
      {name: "The Unseen", cost: "4 Intellect + 3 Stress", act: "action", text: "Invisible hands reach from the shadows to attack up to five targets. Those struck are frozen by cold and terror for the next two rounds."}
    ]},
    {entity: "The Desolation", page: "92", powers: [
      {name: "Candle Flesh", cost: "4 Intellect + 3 Stress", act: "action", text: "Your flesh turns warm and soft as candle wax. You spend this round reshaping your wounds and move one step up the damage track."},
      {name: "Conflagration", cost: "4 Intellect + 3 Stress", act: "action", text: "Heat and flame burst at a point near you. Everything within an immediate area of it suffers 5 points of damage (a serious injury for a PC). Flammable things may catch fire."},
      {name: "Fiery Shimmer", cost: "4 Intellect + 3 Stress", act: "action", text: "For one hour your skin glows like a thin screen over a bonfire. You gain an extra step on the damage track (like the Tough ability) and are immune to fire and heat damage."}
    ]},
    {entity: "The End", page: "92", powers: [
      {name: "Deathless Avatar", cost: "4 Intellect + 3 Stress", act: "enabler", text: "If you go all the way down the damage track and die, you return to life next round at debilitated, provided you have at least 4 points in your Intellect Pool and spend 4 of them to trigger it. Each use permanently reduces your Intellect Pool by 2."},
      {name: "The Inevitable", cost: "4+ Intellect + 3 Stress", act: "action", text: "A creature of level 3 or lower that you touch takes 5 points of damage, and 5 more each round you keep making successful rolls against it. You must use your action each round to concentrate. Each extra level of Effort raises the maximum target level by 1."},
      {name: "Skull Visage", cost: "4 Intellect + 3 Stress", act: "action", text: "Your face briefly flickers into a terrifying animated skull. Up to five chosen targets who see you and are affected by your attack are frozen by fear of death for the next two rounds."}
    ]},
    {entity: "The Eye", page: "93", powers: [
      {name: "Hypercognizance", cost: "4 Intellect + 3 Stress", act: "action", text: "For ten minutes you're aware of everything around you. You can see things that are normally invisible, and attacks and other tasks relying on sight are eased by two steps. Action to initiate."},
      {name: "Modify Memory", cost: "4 Intellect + 3 Stress", act: "action", text: "On a successful Intellect attack, a target within short range gains a brief memory that isn't theirs, or a piece of information or disinformation. Alternatively, you insert up to one round of visual footage into a surveillance recording."},
      {name: "Truth", cost: "4 Intellect + 3 Stress", act: "action", text: "You learn a pertinent fact you didn't know about a nearby creature. No roll needed."}
    ]},
    {entity: "The Flesh", page: "93", powers: [
      {name: "Crawling Form", cost: "4 Intellect + 3 Stress", act: "action", text: "A creature you touch has its limbs fuse together for at least ten minutes. It can only move by squirming and rolling."},
      {name: "Twisted Form", cost: "4 Intellect + 3 Stress", act: "action", text: "You reshape a creature you touch however you choose. The change is mostly cosmetic but agonising: 4 points of damage (a serious injury for a PC). Improving, or at least not worsening, its looks takes a full minute and a difficulty 6 Intellect-based roll. Action (or action to initiate)."},
      {name: "Unholy Hunger", cost: "4+ Intellect + 3 Stress", act: "action", text: "A creature of level 4 or lower that you touch bites into its own flesh, taking 3 points of damage, and 3 more each round you keep making successful rolls against it. You must use your action each round to concentrate. Each extra level of Effort raises the maximum target level by 1. Action to initiate."}
    ]},
    {entity: "The Hunt", page: "93", powers: [
      {name: "Hairy on the Inside", cost: "4 Intellect + 3 Stress", act: "action", text: "For ten minutes you become more beast-like: +8 to your Might Pool, +1 Might Edge, +2 to your Speed Pool and +1 Speed Edge. Meanwhile you can't spend Intellect points except to try to change back early (a difficulty 2 task). Action to change; action to change back."},
      {name: "Hunting Scream", cost: "4 Intellect + 3 Stress", act: "action", text: "Up to three targets within long range who hear your scream, whistle or song and whom you successfully attack are terrified for two rounds, freezing or fleeing as fast as they can (your choice)."},
      {name: "Stalk and Kill", cost: "4 Intellect + 3 Stress", act: "action", text: "You mark a nearby creature as your prey. For the next hour, tasks to find, follow or attack it are eased."}
    ]},
    {entity: "The Lonely", page: "94", powers: [
      {name: "Call the Crowd", cost: "4 Intellect + 3 Stress", act: "action", text: "You summon a lonesome crowd (p225) to a sparsely populated place within long distance. It behaves according to its nature but never targets you, and usually disperses within about ten minutes."},
      {name: "The Fog", cost: "4 Intellect + 3 Stress", act: "action", text: "A heavy, rolling fog fills a very long area for one hour. Visibility inside drops to immediate range."},
      {name: "Isolation", cost: "4 Intellect + 3 Stress", act: "action", text: "For one hour a creature you touch is completely unaware of anyone around them and can't sense other people or creatures at all, unless someone spends a few rounds slapping them and calling their name, or they take damage."}
    ]},
    {entity: "The Slaughter", page: "94", powers: [
      {name: "Fatigue of Battle", cost: "4 Intellect + 3 Stress", act: "action", text: "A target you touch relives a past trauma (or someone else's, if they have none) for about a minute. Their tasks are hindered, and they suffer 1 point of Stress every round or two, up to 4 (damage instead for an NPC)."},
      {name: "March to the Pipes", cost: "4+ Intellect + 3 Stress", act: "action", text: "You make music (whistling, singing, bagpipes) and up to five targets of level 3 or lower within long range march in a regimented way in the direction you choose, doing nothing else on their turn. They keep marching each round you keep making successful rolls; you must use your action each round to concentrate. Each extra level of Effort raises the maximum target level by 1. Marching someone straight to their doom, such as off a cliff, takes one more successful roll. Action to initiate."},
      {name: "The Spirit of War", cost: "4 Intellect + 3 Stress", act: "action", text: "A creature within short range is overcome by rage and, as its next action, attacks the nearest creature (you, if no one is nearer) by the most harmful means it has. Each creature near it already engaged in violence adds a round, up to three rounds in total."}
    ]},
    {entity: "The Spiral", page: "95", powers: [
      {name: "Door to Elsewhere", cost: "4 Intellect + 3 Stress", act: "action", text: "A door appears within immediate range and another at a place you know about. They last one minute or until you step through as another action. If no door forms, the place may be protected, too little known to you, or gone."},
      {name: "Inverted World", cost: "4 Intellect + 3 Stress", act: "action", text: "For one minute (six rounds) you control every sense of a creature you touch. If what you show them is hindering or distracting, their actions are hindered; otherwise you can make them experience horrors for 1 point of Stress per round (1 point of damage for an NPC)."},
      {name: "Send to the Maze", cost: "4+ Intellect + 3 Stress", act: "action", text: "A creature of level 3 or lower that you touch is banished into The Spiral's realm, taking 3 points of damage, and 3 more each round you keep making successful rolls against it. You must use your action each round to concentrate. Each extra level of Effort raises the maximum target level by 1. When it ends, the target reappears where it vanished or somewhere you've met it before."}
    ]},
    {entity: "The Stranger", page: "95", powers: [
      {name: "Embracing the Unknown", cost: "4+ Intellect + 3 Stress", act: "action", text: "Every creature within short range loses the ability to recognise, tell apart or remember anyone they see, friend or foe, for one round. Each extra level of Effort adds a round."},
      {name: "Monstrous Stranger", cost: "4 Intellect + 3 Stress", act: "action", text: "For one minute your body stretches into a tall, thin thing with too-many-jointed limbs. You're practiced in unarmed combat, your unarmed attacks deal 2 extra points of damage, and your unarmed melee attacks are eased."},
      {name: "Stranger to Pain", cost: "4 Intellect + 3 Stress", act: "action", text: "For one day, physical attacks can't daze or stun you, and you're immune to most poisons and diseases."}
    ]},
    {entity: "The Vast", page: "96", powers: [
      {name: "Hurl Into the Void", cost: "4 Intellect + 3 Stress", act: "action", text: "A close creature that you can see, and that can see you, believes it's been flung backward into an endless fall. It loses its next action flailing and takes 3 points of damage from the shock (3 points of Stress for a PC)."},
      {name: "Image of a Colossus", cost: "4 Intellect + 3 Stress", act: "action", text: "A creature you touch sees an impossibly huge being in the distance. Terrified, it freezes or flees at full speed (your choice) this round, and keeps doing so each round you keep making successful rolls against it. You must use your action each round to concentrate. Action to initiate."},
      {name: "Wings of The Vast", cost: "4 Intellect + 3 Stress", act: "action", text: "You're snatched into the sky as if by an invisible giant. For ten minutes you can fly a long distance each round."}
    ]},
    {entity: "The Web", page: "96", powers: [
      {name: "Friend to the Bewebbed", cost: "4 Intellect + 3 Stress", act: "action", text: "You summon a bewebbed puppet (p200). It arrives within a few rounds, as if it was already nearby, and obeys you for one hour or until you dismiss it or it's destroyed."},
      {name: "Many-eyed Spies", cost: "4 Intellect + 3 Stress", act: "action", text: "Extra spiders gather within the hour at a place you're familiar with. Unless every one is found and killed, you know what happens there for the next day. If they can't find the place, it may be protected, too little known to you, or gone."},
      {name: "Puppet on a String", cost: "4 Intellect + 3 Stress", act: "action", text: "You silently implant a command in a creature you touch, set to fire on a trigger you can sum up in one short sentence. When it happens, the target carries out the command as best it can. The command can be fairly complex and take up to 24 hours, but can't directly harm the target or anyone important to it, or be obviously impossible."}
    ]}
  ]
};
