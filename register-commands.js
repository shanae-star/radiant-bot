import 'dotenv/config';

const commands = [
  {
    name: 'book',
    description: 'See all spaces you can reserve, or look up a specific one',
    type: 1,
    options: [
      {
        name: 'name',
        description: 'Space name, e.g. "gallery", "print", "ceramics", "207"',
        type: 3, // STRING
        required: false,
      },
    ],
  },
  {
    name: 'help',
    description: 'Not sure where to start? See what this bot can do for you',
    type: 1,
  },
];

const response = await fetch(
  `https://discord.com/api/v10/applications/${process.env.APP_ID}/commands`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  }
);

const data = await response.json();
console.log('Commands registered:', data);
