# Manual Code Editing Guide

This guide walks you through editing `index.js` directly. Use this if you want to understand the code structure or make changes yourself without AI assistance.

When you're done making changes, go to [Section 4 of the Maintenance Guide](MAINTENANCE_GUIDE.md#4-how-to-save-and-publish-your-changes) to save and push your changes live.

---

## Before you start

1. Open VSCode on your computer
2. Open the `radiant-bot` folder (File → Open Folder → find `radiant-bot`)
3. Click on `index.js` in the left panel
4. Make sure you're looking at the `resources` list at the top of the file

---

## To add a new space

Find the closing `];` at the end of the resources list. It looks like this:

```js
  },
];
```

Click just before that `];` line and add a new block. Copy the format exactly from an existing space:

```js
  {
    name: 'Your Space Name (Location)',
    keywords: ['keyword'],
    availability: 'paste the google calendar link here',
    bookUrl: 'paste the booking link here',
  },
```

**Important formatting rules:**
- Every line inside the block ends with a comma except the last `}`
- The block itself ends with `},` (comma after the closing brace) unless it's the very last item — then no comma is needed. To be safe, always add the comma and the file will still work fine.
- Text values (names, links, keywords) must always be wrapped in single quotes `'like this'`
- Do not delete any `{`, `}`, `[`, `]`, or `,` symbols

**Example — adding a new Dark Room space:**

```js
  {
    name: 'Dark Room (McKees Rocks)',
    keywords: ['dark room', 'darkroom'],
    availability: 'https://calendar.google.com/your-link-here',
    bookUrl: 'https://calendar.app.google/your-link-here',
  },
```

After adding, your resources list will look like:

```js
const resources = [
  {
    name: '2nd Floor Gallery (McKees Rocks)',
    ...
  },
  // ... other spaces ...
  {
    name: 'Dark Room (McKees Rocks)',
    keywords: ['dark room', 'darkroom'],
    availability: 'https://...',
    bookUrl: 'https://...',
  },
];
```

---

## To edit an existing space

Find the space you want to change in the list. Change only the value inside the quotes. For example, to update the booking link for Print Studio:

**Before:**
```js
bookUrl: 'https://calendar.app.google/oldlink',
```

**After:**
```js
bookUrl: 'https://calendar.app.google/newlink',
```

Only change what's inside the single quotes. Do not delete the quotes, the colon, or the comma.

---

## To remove a space

Find the entire block for that space — from the opening `{` to the closing `},` — and delete all of those lines.

**Before:**
```js
  {
    name: 'Ceramics Studio (McKees Rocks)',
    keywords: ['ceramics'],
    availability: 'https://...',
    bookUrl: 'https://...',
  },
  {
    name: '202 Common Area (Homewood)',
```

**After (Ceramics removed):**
```js
  {
    name: '202 Common Area (Homewood)',
```

Make sure you delete the full block including both curly braces and all four lines inside.

---

## To edit what a command says

Each command's response text lives in `index.js` below the resources list. Here is what the `/helpme` response looks like:

```js
if (interaction.data.name === 'helpme') {
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: [
        '**Here\'s what you can do:**',
        '',
        'Type `/book` to see a list of all spaces you can reserve.',
        '',
        'Type `/helpme` to see this message again.',
      ].join('\n'),
    },
  });
}
```

The text members see is everything inside the `content: [ ... ]` block. Each line of the message is a separate item in the list, wrapped in single quotes and separated by commas.

**To change the response text:**

1. Find the command block in `index.js` (search for the command name, e.g. `'helpme'`)
2. Edit the text inside the single quotes
3. To add a new line to the message, add a new item: `'Your new line here',`
4. To add a blank line between paragraphs, add an empty item: `'',`

**Formatting rules:**
- Every line of text must be wrapped in single quotes `'like this'`
- Every item in the list must end with a comma `,`
- Do not delete the `[` or `]` that wrap the list, or the `.join('\n')` at the end

---

## To add a new slash command

**Step 1 — Add the response code to `index.js`**

Find the `/helpme` block in `index.js` — it starts with `if (interaction.data.name === 'helpme')`. Add your new command block directly after the closing `}` of that block, before the closing `}` of the `APPLICATION_COMMAND` check. Copy this template exactly:

```js
    if (interaction.data.name === 'your-command-name') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: [
            'Your response line 1',
            '',
            'Your response line 2',
          ].join('\n'),
        },
      });
    }
```

Replace `your-command-name` with the command name (lowercase, no slash), and replace the content lines with what the bot should say.

**Step 2 — Register the command name in `register-commands.js`**

Open `register-commands.js`. You will see a list of command definitions that looks like this:

```js
const commands = [
  {
    name: 'book',
    description: 'See all spaces you can reserve, or look up a specific one',
    type: 1,
    // ...
  },
  {
    name: 'helpme',
    description: 'Not sure where to start? See what this bot can do for you',
    type: 1,
  },
];
```

Add a new entry for your command:

```js
  {
    name: 'your-command-name',
    description: 'A short description of what this command does',
    type: 1,
  },
```

**Step 3 — Push your changes, then register with Discord**

Save both files, commit, and push to GitHub (see [Section 4 of the Maintenance Guide](MAINTENANCE_GUIDE.md#4-how-to-save-and-publish-your-changes)). Wait for Railway to deploy.

Then open the Terminal in VSCode (Terminal → New Terminal) and run:

```
node register-commands.js
```

(screenshot)

You should see a confirmation printed in the terminal. After that, the new command will appear in Discord.

**You only need to run this when adding a new command name.** Editing what a command says, or making any changes to spaces and links, does not require this step.
