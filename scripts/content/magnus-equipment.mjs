/**
 * Equipment and weapons from The Magnus Archives Roleplaying Game, chapter 5
 * (p97-104): the six price categories and the tables of goods inside them.
 *
 * `notes` is the book's own Notes column, which is mechanical rather than
 * flavour. Mundane equipment is about level 4 (p99).
 */

/** Weapons from the price tables (p102-104). */
export const MAGNUS_WEAPONS = [
  {name: "Unarmed strike", category: "light", attackType: "melee", range: "immediate", price: "inexpensive", notes: "Punches, kicks, elbows and the like.", practiced: true},
  {name: "Improvised weapon", category: "light", attackType: "melee", range: "immediate", price: "inexpensive", notes: "Kitchen pans, umbrellas, keys, big flashlights. Most people are not practiced with them, so the attack is not eased."},
  {name: "Knife", category: "light", attackType: "melee", range: "immediate", price: "inexpensive", notes: "Prone to breaking."},
  {name: "Pepper spray", category: "light", attackType: "ranged", range: "immediate", price: "inexpensive", notes: "Hinders the target's tasks for one round."},
  {name: "Baton/nightstick", category: "light", attackType: "melee", range: "immediate", price: "moderate"},
  {name: "Hand axe", category: "medium", attackType: "melee", range: "immediate", price: "moderate"},
  {name: "Hunting knife", category: "light", attackType: "melee", range: "immediate", price: "moderate"},
  {name: "Machete", category: "medium", attackType: "melee", range: "immediate", price: "moderate"},
  {name: "Slingshot", category: "light", attackType: "ranged", range: "short", price: "moderate", notes: "Medium range."},
  {name: "Bow", category: "medium", attackType: "ranged", range: "long", price: "expensive"},
  {name: "Extendable baton", category: "light", attackType: "melee", range: "immediate", price: "expensive", notes: "Collapses to a size ideal for a pocket or purse."},
  {name: "Handgun", category: "medium", attackType: "ranged", range: "long", price: "expensive"},
  {name: "Pocket handgun", category: "light", attackType: "ranged", range: "short", price: "expensive"},
  {name: "Rifle", category: "medium", attackType: "ranged", range: "long", price: "expensive"},
  {name: "Shotgun", category: "heavy", attackType: "ranged", range: "immediate", price: "expensive"},
  {name: "Sawed-off shotgun", category: "medium", attackType: "ranged", range: "immediate", price: "expensive", notes: "Can be used one-handed. Illegal in almost any jurisdiction."},
  {name: "Assault rifle", category: "heavy", attackType: "ranged", range: "long", price: "veryExpensive", rapidFire: true},
  {name: "Heavy rifle", category: "heavy", attackType: "ranged", range: "specified", rangeNotes: "300 feet (90 m)", price: "veryExpensive"},
  {name: "Katana", category: "heavy", attackType: "melee", range: "immediate", price: "veryExpensive"},
  {name: "Large-caliber handgun", category: "heavy", attackType: "ranged", range: "long", price: "veryExpensive"},
  {name: "Submachine gun", category: "medium", attackType: "ranged", range: "short", price: "veryExpensive", rapidFire: true}
];

/** Everything else on the price tables (p102-104). */
export const MAGNUS_EQUIPMENT = [
  // Inexpensive
  {name: "Ammo (box of 50 rounds)", price: "inexpensive"},
  {name: "Car or rideshare fare", price: "inexpensive"},
  {name: "Duct tape roll", price: "inexpensive", notes: "Useful and ubiquitous."},
  {name: "Energy bars, handful", price: "inexpensive", notes: "Feeds a person for one day."},
  {name: "Flashlight", price: "inexpensive"},
  {name: "Gloves", price: "inexpensive"},
  {name: "Journal and pen", price: "inexpensive"},
  {name: "Lockpick set", price: "inexpensive", notes: "Asset for lockpicking tasks."},
  {name: "Multitool", price: "inexpensive"},
  {name: "Padlock with keys", price: "inexpensive"},
  {name: "Purse", price: "inexpensive"},
  {name: "Secure briefcase", price: "inexpensive", notes: "Level 5 lock.", level: 5},
  {name: "Sunglasses", price: "inexpensive"},
  {name: "Thrift clothing", price: "inexpensive"},
  {name: "Wallet", price: "inexpensive"},
  // Moderately priced
  {name: "Backpack", price: "moderate"},
  {name: "Bee suit", price: "moderate", notes: "Prevents wasp and bee stings."},
  {name: "Binoculars", price: "moderate", notes: "Asset for perception tasks at range."},
  {name: "Bolt cutters", price: "moderate"},
  {name: "Budget cell phone", price: "moderate"},
  {name: "Case of heavy tools", price: "moderate", notes: "Suitable for plumbing, electrical work, construction, and similar."},
  {name: "Case of light tools", price: "moderate", notes: "Suitable for electronic repair, watch repair, lockpicking, and similar."},
  {name: "Chainsaw", price: "moderate"},
  {name: "Climbing gear", price: "moderate", notes: "Asset for climbing tasks."},
  {name: "Crowbar", price: "moderate"},
  {name: "Digital audio recorder", price: "moderate"},
  {name: "Disguise kit", price: "moderate", notes: "Asset for disguise tasks."},
  {name: "Electric lantern", price: "moderate"},
  {name: "EMF detector", price: "moderate"},
  {name: "Everyday clothing", price: "moderate"},
  {name: "First aid kit", price: "moderate", notes: "Asset for healing tasks."},
  {name: "Handcuffs", price: "moderate", notes: "Level 5.", level: 5},
  {name: "Professional clothing", price: "moderate"},
  {name: "Rope", price: "moderate", notes: "Nylon, 50 feet (16 m)."},
  {name: "Sleeping bag", price: "moderate"},
  {name: "Survival kit", price: "moderate", notes: "Includes emergency blanket, 2 flares, flashlight, 50-ft. (16 m) rope, rubber gloves, sewing kit, cheap knife."},
  {name: "Tent", price: "moderate"},
  {name: "Train ticket", price: "moderate"},
  // Expensive
  {name: "Airline ticket", price: "expensive"},
  {name: "Camera designed to be concealed", price: "expensive", notes: "Transmits over wifi."},
  {name: "Cold weather camping gear", price: "expensive"},
  {name: "Hazmat suit (with respirator)", price: "expensive"},
  {name: "Laptop", price: "expensive"},
  {name: "Microphone designed to be concealed", price: "expensive", notes: "Transmits over wifi."},
  {name: "Nightvision goggles", price: "expensive", notes: "See in darkness, but perception tasks are hindered."},
  {name: "Scuba gear", price: "expensive"},
  {name: "Smartphone", price: "expensive"},
  {name: "Straightjacket", price: "expensive"},
  {name: "Stylish clothing", price: "expensive"},
  // Very expensive
  {name: "Designer/bespoke clothing", price: "veryExpensive"},
  {name: "Modest vehicle", price: "veryExpensive", notes: "Level 3.", level: 3},
  {name: "Small boat", price: "veryExpensive", notes: "Level 3.", level: 3},
  // Exorbitant
  {name: "Luxury vehicle", price: "exorbitant", notes: "Level 5 or 6.", level: 5},
  {name: "Private plane", price: "exorbitant", notes: "Level 5.", level: 5},
  {name: "Yacht", price: "exorbitant", notes: "Level 5.", level: 5},
  // Priceless
  {name: "Orbital space station", price: "priceless", notes: "Useful for running experiments in weightless, isolated environments."}
];

/** Body armor has no damage reduction in this game (p100). */
export const MAGNUS_ARMOR = [
  {
    name: "Body armor",
    category: "medium",
    price: "expensive",
    notes: "Military vest or police Kevlar. Treat the wearer as having an extra step in their damage track, like the Tough ability. All their Speed-based tasks are hindered."
  }
];
