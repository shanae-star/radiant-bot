import 'dotenv/config';

const commands = [
  {
    name: 'book',
    description: 'Get the booking link',
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
