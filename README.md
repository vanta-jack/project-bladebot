# BladesBot: Yet another Blades in the Dark Bot

Discord bot for tracking stats in Blades in the Dark and commands for the game.
## Core Features

- **Dice rolling**: Blades in the Dark dice rolls for actions and resistance rolls.
- **Standard dice rolling**: use dice of standard configuration such as d2, d3, d6, d10, d20, or any custom dice configuration. 
- **Generating progress clocks**: Procedurally generated progress clocks to ensure any values are accounted for.
## Planned Features
- **Dashboard:** A per-server dashboard to manage 
- **Providing Devil’s Bargain cards and rolling Entanglements**: Now fully customizable via dashboard!
- **Wiki**: a mini wiki accessible via commands

## Player and Crew Stats
BladesBot is designed for tracking multiple player characters and their character sheet stats and crew stats for quick lookups.

BladesBot can persistently track players.

Users can claim a playable character (one at a time) and have it bound to their User ID, provided the character is unowned.

## Dice
BladesBot has built-in d20, d12, d8, d6, and d4. The graphics and results are procedurally generated.

The underlying code was inspired by Benji's `/bladesroll` command and accounts for the special dice system used in Blades in the Dark.

The dice system recognizes successes, partial successes, failures, criticals, and handling rolls when a player has zero dice in an action.

## Devil’s Bargain and Entanglements
Using a command, the bot sends a random Devil's Bargain card to inspire the GM.

## Progress Clocks
BladesBot allows creation, ticking, and display of progress clocks.

Clocks are procedurally generated and can adjust dynamically.

## Wiki
The bot has a selection of entries for all Blades in the Dark specific items and stats that users can look up. Use `/wiki` to see a general list of entries. Use arguments to refine the selection further.

The entries are fully customizable. These entries are for:
- Standard Items
- Playbook Items
- Created Items/Leech Alchemicals
- Playbook Overviews
- Actions
- Custom Entries (NPC Cards)
Entries can be added either via commands and the dashboard (simple items) or injected as files (NPC cards from markdown).

## Setup and Installation
For a full guide on setting up the Discord application, configuring the `.env` file, and running the bot (including testing with GitHub Codespaces), see the **[Setup Guide](docs/setup.md)**.

## Disclaimers and Credits

**Disclaimer:** I am not associated with Evil Hat or John Harper; I only love John Harper's games. I do not own the copyright for any playbook images.

### Assets Used
- **Devil's Bargain Card Deck**: Created by reddit user *[u/Consistent-Tie-4394][db_user]*. The user was asked for their consent and agreed to the use of their asset. You can look at their reddit post on the [BitD reddit][db_reddit] or directly download the deck from their [google drive][db_drive].
- **Expanded Entanglements Table**: Created by the reddit user *[u/Lupo_1982][exp_ent_user]*. The user was asked for their consent and agreed to the use of their asset. Check out their reddit post on the [BitD reddit][exp_ent_reddit] or directly download the table from their [google drive][exp_ent_drive].
- **Playbook Images**: Official material from Evil Hat and John Harper.

<!-- links -->
[exp_ent_user]: https://www.reddit.com/user/Lupo_1982/
[exp_ent_reddit]: https://www.reddit.com/r/bladesinthedark/comments/mrzj9x/just_created_an_expanded_entanglements_table/
[exp_ent_drive]: https://drive.google.com/file/d/1mUHHYdV0VU8Ey69oUzMxeLc1lMavFohC/view?usp=sharing
[db_user]: https://www.reddit.com/user/Consistent-Tie-4394/
[db_reddit]: https://www.reddit.com/r/bladesinthedark/comments/qh43y6/devils_bargains_card_deck/
[db_drive]: https://drive.google.com/drive/folders/14vCEjWrja7fE4dtpP89vS6RZpcdGjmpH?usp=sharing
