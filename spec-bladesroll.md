# /bladesroll specifications

Syntax: 
`/bladesroll dots: 0-4 push_yourself: true/false assist: true/false devils_bargain: true/false`


| Property       | Required? | Default Value | Description                                                                                                                                               |
| -------------- | --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dots           | optional  | 0, up to 4    | the dots of a character in a specific action                                                                                                              |
| push_yourself  | optional  | false         | +1 bonus die, acknowledge player pushing themselves and remind to take 2 stress. cannot be used with devils_bargain                                       |
| devils_bargain | optional  | false         | +1 bonus die, acknowledge the player took the devils bargain. cannot be used with push_yourself                                                           |
| assist         | optional  | false         | +1 bonus die, acknowledge player is being assisted. remind the assisting player to take 1 stress. can be used with either push_yourself or devils_bargain |


```mermaid 
flowchart LR

A[**bladesroll**
dots
push_yourself
devils_bargain
assist] -->|get number of dice|B{dice = 0}
B -->|yes| C[roll 2 dice] -->|Record lower dice| E
B -->|no| D[roll the dice equivalent to the number]
D -->|Record highest roll and its instances| E{is roll==6 AND instances==2?}
E -->|yes| X[Critical Success]
E -->|no| F{is roll==6?}
F -->|yes| Y[Success]
F -->|no| G{is roll 4 or 5?}
G -->|yes| Z[Partial success]
G -->|no| W[fail]
```

For testing, the output should be in an embed look like this for 4d6

[3, 2, 4, 5] Partial Success
You pushed yourself! Remember to mark 2 stress
Your teammate helped you! Remind them to mark 1 stress

## Refactoring Changes
**What changed and why**
The previously monolithic `execute()` function within `bladesroll.ts` was refactored by extracting code into three named functions:
* `parseInputs(interaction)` handles reading user options and resolving the total `diceCount`.
* `rollDice({ diceCount })` manages generating dice roll values and determining the result based on Blades in the Dark rules.
* `buildEmbed({ rolls, resultTitle, push_yourself, devils_bargain, assist })` formats the outcomes and descriptions into a Discord Embed message.

**Separation of Concerns**
Separation of concerns is a design principle of dividing a program into distinct sections, each addressing a separate responsibility. By delegating individual tasks (input parsing, business logic, output generation), each refactored block can be updated or tested independently without affecting unrelated logic.

**Code Comparison**

*Before (Monolithic `execute()`)*:
```typescript
async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const dots = interaction.options.getInteger('dots') ?? 0;
    // ... all input parsing

    if (push_yourself && devils_bargain) { ... }

    // ... all dice calculation

    // ... all embed formatting

    await interaction.reply({ embeds: [embed] });
}
```

*After (Refactored `execute()`)*:
```typescript
async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const { dots, push_yourself, devils_bargain, assist, diceCount } = parseInputs(interaction);

    if (push_yourself && devils_bargain) {
        await interaction.reply({ content: 'You cannot use both Push Yourself and a Devil\'s Bargain simultaneously!', ephemeral: true });
        return;
    }

    const { rolls, resultTitle } = rollDice({ diceCount });

    const embed = buildEmbed({ rolls, resultTitle, push_yourself, devils_bargain, assist });

    await interaction.reply({ embeds: [embed] });
}
```
