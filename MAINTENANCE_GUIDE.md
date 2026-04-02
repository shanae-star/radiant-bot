# Radiant Bot — Maintenance Guide

This guide is written for Radiant Hall studio directors/staff who are maintaining the Discord bot.

If something breaks or you're unsure, this guide is your first stop. Read the relevant section carefully, or send this file to an AI assistant to help you troubleshoot.

---

## Table of Contents

1. [How the Bot Works — The Big Picture](#1-how-the-bot-works--the-big-picture)
2. [Understanding the Code File](#2-understanding-the-code-file)
3. [How to Update the Bot (Add, Edit, or Remove a Space)](#3-how-to-update-the-bot-add-edit-or-remove-a-space)
4. [How to Save and Publish Your Changes](#4-how-to-save-and-publish-your-changes)
5. [How to Verify Your Change Worked](#5-how-to-verify-your-change-worked)
6. [Troubleshooting — When Something Goes Wrong](#6-troubleshooting--when-something-goes-wrong)

---

## 1. How the Bot Works — The Big Picture

Before touching anything, it helps to understand how all the pieces connect.

### The three pieces

```
Your Code (VSCode + GitHub)
        |
        | You push a change
        v
   Railway (the host)
        |
        | Railway runs the code 24/7
        v
  Discord (the bot)
        |
        | Members type /book or /helpme
        v
   Bot responds
```

**VSCode** is the text editor on your computer where you make changes to the code.

**GitHub** is where the code is stored online. Think of it like Google Drive for code. When you push your changes from VSCode to GitHub, GitHub saves the updated version.

**Railway** is the service that actually runs the bot 24/7. It watches GitHub, and every time you push a change, Railway automatically picks it up and restarts the bot with the new version. You do not need to do anything on Railway when you make a change — it happens automatically.

**Discord** is where members interact with the bot. The bot receives commands like `/book` and responds with links.

### The golden rule

> **Whatever code is on GitHub is what Railway will run.**

If you make a change in VSCode but forget to push it to GitHub, nothing will change in the live bot.

---

## 2. Understanding the Code File

The bot has one file you will ever need to edit: **`index.js`**.

Open VSCode, open the `radiant-bot` folder, and click on `index.js` in the file list on the left.

### What you'll see

The file has two main parts:

**Part 1 — The list of spaces**

This is the part you will edit. It looks like this:

```js
const resources = [
  {
    name: '2nd Floor Gallery (McKees Rocks)',
    keywords: ['2nd floor'],
    availability: 'https://calendar.google.com/...',
    bookUrl: 'https://calendar.app.google/...',
  },
  {
    name: 'Print Studio (McKees Rocks)',
    keywords: ['print'],
    availability: 'https://calendar.google.com/...',
    bookUrl: 'https://calendar.app.google/...',
  },
  // ... more spaces ...
];
```

Each space is one "block" between `{` and `}`. Each block has four pieces of information:

| Field | What it is | Example |
|---|---|---|
| `name` | The full display name shown to members | `'Print Studio (McKees Rocks)'` |
| `keywords` | The shorthand word(s) members type after `/book` | `['print']` |
| `availability` | Link to the Google Calendar showing open times | `'https://calendar.google.com/...'` |
| `bookUrl` | Link to actually make a reservation | `'https://calendar.app.google/...'` |

**Part 2 — Everything else**

The rest of the file handles receiving Discord commands and sending responses. **Do not edit anything below the `];` that closes the resources list.** You will not need to.

### How keywords work

When a member types `/book print`, the bot searches the `keywords` list for a space that contains the word `print`. The match must be exact (but not case-sensitive). So:

- `/book print` → finds `Print Studio` because its keywords include `'print'`
- `/book gallery` → finds `2nd Floor Gallery` because its keywords include `'2nd floor'`... 

A space can have multiple keywords:

```js
keywords: ['flex', 'garage'],
```

This means both `/book flex` and `/book garage` will find that space.

---

## 3. How to Update the Bot (Add, Edit, or Remove a Space)

### Try AI first

GitHub Copilot is an AI assistant built into VSCode that can make code changes for you — just describe what you want in plain English.

**To open Copilot Chat:**

The easiest way is to click the **chat icon** in the left sidebar. [screenshot]

Alternatively:
1. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows) to open the command palette
2. Type `Copilot Chat` and press Enter
3. A chat panel will open — you can type in plain English

See **[COPILOT_PROMPTS.md](COPILOT_PROMPTS.md)** for ready-to-use prompts you can copy, fill in, and send — for adding spaces, updating links, changing command responses, and troubleshooting.

Once Copilot has made your changes, jump to [Section 4](#4-how-to-save-and-publish-your-changes) to push them live — you can skip the manual editing instructions below.

---

### Or update the code manually

If you'd like to understand the code structure or make edits yourself, see **[MANUAL_EDITING_GUIDE.md](MANUAL_EDITING_GUIDE.md)** for step-by-step instructions on adding, editing, and removing spaces.

---

### Adding a new slash command — one extra step required

Updating spaces, links, or response text only requires editing `index.js` and pushing to GitHub. But if you add a **brand new slash command** (e.g., `/contact`), Discord needs to be told that the command exists. This requires running a separate script once after your code is pushed.

**After pushing your new command to GitHub and Railway has deployed**, open the Terminal in VSCode (Terminal → New Terminal) and run:

```
node register-commands.js
```

You should see a response printed in the terminal confirming the commands were registered. After that, the new command will appear in Discord.

**You only need to do this when adding a new command name.** Changing what a command says, or editing spaces and links, does not require this step.

Use the AI prompt in **[COPILOT_PROMPTS.md](COPILOT_PROMPTS.md)** under *Add a new slash command* — it will guide you through both editing the code and running the registration step.

---

## 4. How to Save and Publish Your Changes

Making a change in VSCode is like editing a Google Doc that only exists on your computer. You need two more steps to make it live:

1. **Commit** — take a snapshot of your changes with a label describing what you did
2. **Push** — send that snapshot to GitHub, which triggers Railway to update the live bot

### Step-by-step

**Step 1: Save the file**

Press `Cmd+S` (Mac) or `Ctrl+S` (Windows) to save `index.js`.

**Step 2: Open the Source Control panel**

Click the branch icon on the left sidebar in VSCode. (screenshot) You can also press `Ctrl+Shift+G`.

You will see your edited files listed under **Changes**. This confirms VSCode detected your edit.

> **Important — check that `.env` is NOT listed here.**
>
> `.env` is a private file that holds your bot's secret credentials. It contains:
> - `PUBLIC_KEY` — your Discord app's public key
> - `APP_ID` — your Discord app's ID
> - `DISCORD_TOKEN` — the secret token that lets the bot connect to Discord
> - `PORT` — the port the server runs on
>
> This file must **never** be committed to GitHub — if it is, your credentials are exposed to the public. It should already be excluded automatically. But if you see `.env` listed under Changes, **do not commit**. Instead, open Copilot Chat and send this prompt:
>
> ```
> My .env file is showing up under Changes in the VSCode Source Control panel.
> It should be excluded from git. Please check my .gitignore file and add .env to it if it's missing.
> Make the edit directly in the file.
> ```
>
> After Copilot fixes it, `.env` should disappear from the Changes list. Then continue with your commit.

**Step 3: Write a commit message**

At the top of the Source Control panel, there is a text box that says *"Message (Ctrl+Enter to commit)"*.

Type a short description of what you changed.

Good examples:
- `add Dark Room space`
- `update Print Studio booking link`
- `remove Ceramics Studio`

**Step 4: Commit**

Click the blue **Commit** button (or press `Ctrl+Enter`).

If VSCode asks *"There are no staged changes to commit. Would you like to stage all your changes and commit them directly?"* — click **Yes**.

**Step 5: Push to GitHub**

After committing, the button will change to say **Sync Changes** with a number next to it (e.g., **Sync Changes ↑**).

Click **Sync Changes**.

VSCode will push your commit to GitHub. This usually takes a few seconds.

**Step 6: Wait for Railway to deploy**

Railway will automatically detect the new commit and redeploy the bot. This takes about 1–2 minutes.

To watch it happen: go to [railway.com](https://railway.com), open your project, and click **Deployments** in the left menu. You will see a new deployment appear with a yellow "building" status, then turn green when it's done.

You do not need to do anything — just wait for it to turn green.

---

## 5. How to Verify Your Change Worked

After the Railway deployment turns green, test your change directly in Discord.

1. Open the Radiant Hall Discord server
2. Go to any channel where the bot is active
3. Type the command and press Enter

**If you added a new space:**
- Type `/book` — your new space should appear in the full list
- Type `/book [keyword]` — the bot should respond with your new space's links

**If you updated a link:**
- Type `/book [keyword for that space]` — the bot should respond with the updated link. Click the link to confirm it goes to the right place.

**If you removed a space:**
- Type `/book` — the space should no longer appear in the list
- Type `/book [that space's keyword]` — the bot should respond with *"Sorry, we couldn't find a space called..."*

If the bot responds correctly, you're done.

---

## 6. Troubleshooting — When Something Goes Wrong

Work through these in order. Most problems are solved by step 1 or 2.

---

### The bot isn't responding to any commands

**What this looks like:** You type `/book` or `/helpme` in Discord and nothing happens at all — no response, not even an error.

**Step 1 — Check if Railway is running**

1. Go to [railway.com](https://railway.com) and open your project
2. Click **Deployments** in the left menu
3. Look at the most recent deployment:
   - Green checkmark = running normally → the problem is elsewhere
   - Red X or "Failed" = the bot crashed → go to Step 2
   - Yellow/spinning = still deploying → wait 2 minutes and try again

**Step 2 — Read the error in Railway logs**

1. Click on the most recent deployment (even if it's red)
2. Click **View Logs**
3. Scroll to the bottom — the last few lines usually describe what went wrong
4. Look for lines that start with `Error` or contain red text

If you see an error you don't understand, copy the full error message and go to [Section 7](#7-when-to-ask-the-developer-for-help).

**Step 3 — Roll back to the last working version**

If the bot was working before your last change and is now broken, you can undo by redeploying the previous version:

1. In Railway → Deployments, find the deployment just before your broken one (it should have a green checkmark)
2. Click the three-dot menu (`...`) next to it
3. Click **Redeploy**
4. Wait for it to turn green, then test in Discord

This reverts the bot to the previous working state. You can then figure out what went wrong in your change before trying again.

---

### The bot responds, but my new space isn't showing up

**What this looks like:** `/book` shows the full list but your new space is missing, or `/book [keyword]` returns "Sorry, we couldn't find a space..."

**Step 1 — Check that your change actually reached GitHub**

Go to (https://github.com/your-username/radiant-bot) and click on `index.js`. Does your new space appear in the file?

- If **no**: you forgot to push. Go back to VSCode → Source Control panel → click **Sync Changes**
- If **yes**: your change is on GitHub, so keep reading

**Step 2 — Check that Railway deployed the new version**

Go to Railway → Deployments. Is the most recent deployment green? Did it happen after you pushed your change?

- If the latest deployment is older than your push, try clicking **Deploy** manually in Railway
- If it deployed but the bot still doesn't show the space, keep reading

**Step 3 — Check your keyword spelling**

Open `index.js` and find your new space. Check the `keywords` field carefully.

What you typed in Discord must match a keyword exactly. If you typed `/book dark room` but the keyword is `'darkroom'` (no space), the bot won't find it.

Fix the keyword in `index.js`, save, commit, and push again.

**Step 4 — Check for formatting errors**

Open `index.js` and look carefully at your new block. Common mistakes:

- Missing comma after the closing `}` of your block
- A link that's missing the closing single quote `'`
- An extra or missing `{` or `}`

If VSCode shows any red underlines or red dots in the left margin near your change, that's a formatting error. Hover over the red underline to see what's wrong.

You can also ask GitHub Copilot: paste your new block into Copilot Chat and ask *"Does this look correctly formatted?"*

---

### The bot is responding with the wrong link

**What this looks like:** A member books a space and gets taken to the wrong calendar or wrong booking page.

1. Open `index.js` and find that space's entry
2. Check the `availability` and `bookUrl` values
3. Copy each URL and paste it into your browser to confirm it goes to the right place
4. If a URL is wrong, correct it in `index.js`, save, commit, and push

---

### I made a change and now the bot is completely broken

Don't panic. Roll back to the previous working version:

1. Go to Railway → Deployments
2. Find the last deployment with a green checkmark (before your change)
3. Click `...` → **Redeploy**
4. The bot will be back to normal in about 1 minute

Then, before trying your change again, open `index.js` and compare your new block carefully against an existing one. Look for missing commas, missing quotes, or extra characters.