# AI Prompts for Radiant Bot

Use these prompts in GitHub Copilot Chat inside VSCode. Copy a prompt, fill in the blanks, and send it.

After you send a prompt, Copilot will either insert the code directly into your file, or show you the code in the chat.

**If Copilot inserts the code directly into the file:**

You will see the file change in VSCode — new or updated lines will be highlighted. Review what changed, then go to [Section 4 of the Maintenance Guide](MAINTENANCE_GUIDE.md#4-how-to-save-and-publish-your-changes) to save and publish.

**If Copilot shows the code in the chat instead of inserting it:**

Copilot sometimes shows code in the chat window rather than editing the file directly. If this happens:

1. Look for an **Insert into file** or **Apply** button above the code block in the chat — click it if you see one
2. If there's no such button, reply with:
   ```
   Can you insert that directly into index.js instead of showing it in the chat?
   ```
3. If Copilot still only shows the code in chat, you can copy it manually:
   - Click the copy icon on the code block in the chat
   - Go to `index.js` and place your cursor in the right spot
   - Paste with `Cmd+V` (Mac) or `Ctrl+V` (Windows)

Once the file is updated, go to [Section 4 of the Maintenance Guide](MAINTENANCE_GUIDE.md#4-how-to-save-and-publish-your-changes) to save and publish your changes.

---

## Type 1: Update the Code

**Add a new space:**
```
I have index.js open. Please make the edit directly in the file.

I need to add a new space to the resources list.

Space name: [e.g. Rooftop Terrace (McKees Rocks)]
Keywords members will type after /book: [e.g. rooftop, terrace]
Availability calendar link: [paste Google Calendar link]
Booking link: [paste booking link]

Add it as the last item in the resources array, following the same format as the existing entries.
```

**Update an existing space (name, links, or keywords):**
```
I have index.js open. Please make the edit directly in the file.

I need to update an existing space in the resources list.

Space I'm updating: [e.g. Print Studio (McKees Rocks)]
What I'm changing: [e.g. the booking link / the name / the keywords]
New value: [paste the new link, name, or keywords]

Find that entry in the file and update it.
```

**Change what the bot says in response to a command:**
```
I have index.js open. Please make the edit directly in the file.

When a member types /helpme, the bot replies with a message. I want to change that message.

Here is what I want the new message to say:
[write your new message here]

Find where that response is written in the file and update it.
```

**Add a new slash command:**
```
I have index.js open. Please make the edit directly in the file.

I want to add a new slash command called /[command name].
When a member types /[command name], the bot should reply with:
[write the response text here]

Add the necessary code to index.js following the same pattern as the existing /helpme command.
Note: I am not a developer — please insert the code directly into the file in the right place.
```

> **After pushing this change to GitHub and Railway has deployed**, you must register the new command with Discord. Open the Terminal in VSCode (Terminal → New Terminal) and run:
> ```
> node register-commands.js
> ```
> (screenshot)
>
> You should see a confirmation printed in the terminal. After that, the new command will appear in Discord. You only need to do this when adding a new command — not for any other changes.

---

## Type 2: Check Your Work

**Check formatting before pushing:**
```
I have index.js open. Please review the file.

I just made an edit to the resources list. Can you check the entire resources array for any formatting errors — missing commas, missing quotes, mismatched brackets, or anything else that would break the bot?

If you find any errors, please fix them directly in the file.
```

---

## Type 3: Troubleshoot Railway

**Understand an error from Railway logs:**
```
My Discord bot is broken. I found this error in the Railway deployment logs:

[paste the full error message here]

I'm not a developer. Please explain in plain English what this error means.
Then, if the fix is in index.js, please open the file and make the fix directly.
If the fix requires something outside the file, tell me exactly what steps to take.
```

**Bot deployed successfully but isn't responding correctly:**
```
My Discord bot deployed successfully on Railway (no errors in the logs), but it's not behaving correctly.

I have index.js open. Please review it.

What I changed: [describe what you edited]
What I expected: [e.g. /book darkroom should return the Dark Room space]
What's actually happening: [e.g. the bot says it can't find the space]

Can you find what's wrong and fix it directly in the file?
```

---

## Type 4: Fix a .gitignore Issue

**`.env` is showing up in the Source Control changes list:**
```
My .env file is showing up under Changes in the VSCode Source Control panel.
It should be excluded from git. Please check my .gitignore file and add .env to it if it's missing.
Make the edit directly in the file.
```

After Copilot fixes it, `.env` should disappear from the Changes list and you can continue with your commit normally.
