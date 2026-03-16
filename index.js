import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';

const AVAILABILITIES_URL = 'https://lanternfish-lily-54gz.squarespace.com/config/pages';

const resources = [
  {
    name: '2nd Floor Gallery (McKees Rocks)',
    keywords: ['2nd floor'],
    availability: 'https://calendar.google.com/calendar/u/0?cid=Y181Y2YwZjAzMjg5MTAxNThiZWRkYTY1YWRhYmQxNTFlN2E3ZTZjNmY1ZmFlY2M0Yzg2YWVlZGI5MWI2YTYyYWU2QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
    bookUrl: 'https://calendar.app.google/fd5Si8Kr5DYK1Wko8',
  },
  {
    name: 'Print Studio (McKees Rocks)',
    keywords: ['print'],
    availability: 'https://calendar.google.com/calendar/u/0?cid=Y19mZjY4MTA4ZjU1MzI4MTUxYWVhODlhM2Q0N2EyZTBjY2FlYjlmYWIxYjkyYjY3YjkxMzA3ODA5NmIwMjdhZTUxQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
    bookUrl: 'https://calendar.app.google/fGRWn9Ch4NhCAvKU8',
  },
  {
    name: 'Classroom (McKees Rocks)',
    keywords: ['classroom'],
    availability: 'https://calendar.google.com/calendar/u/0?cid=Y185MmE0NzdiYTMzM2ZhYjM5Y2E3ZTllZjcyMmFiNmU2NTRkYThjNjdiM2RmODYyZDBlNWI0YWZjNmUxZWFlMjlmQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
    bookUrl: 'https://calendar.app.google/QptF5wQmaHQqkirM7',
  },
  {
    name: 'Flex Space/Garage Gallery (McKees Rocks)',
    keywords: ['flex', 'garage'],
    availability: 'https://calendar.google.com/calendar/u/0?cid=Y19lYjU3ZjI2MjkzMGZmZDdiYTZmM2RiNDM3MmVjYWYyZmVlZWJjNDc0ZDcwNjVjNmUwMjMwNjE1YjU4NGNlMjU2QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
    bookUrl: 'https://calendar.app.google/LUKE21qbXKRCnRM77',
  },
  {
    name: 'Ceramics Studio (McKees Rocks)',
    keywords: ['ceramics'],
    availability: 'https://calendar.google.com/calendar/u/0?cid=Y19jNDI1MTg2NThjZGMwNDEzNWJkZjg5ODU5YmUzNWM0YzY4OGM3NDc0YTI4MTllMTZkNDA4MWYwYjA5MzVhMWU5QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
    bookUrl: 'https://calendar.app.google/GupPSe5Lc95sa13z9',
  },
  {
    name: '202 Common Area (Homewood)',
    keywords: ['202'],
    availability: 'https://calendar.google.com/calendar/u/0?cid=Y180MTFlZDg5NTZlYTFkMmIwNmZiZTk4NmE2OWY4M2Y2ZDQ2OWFhNjc4ZmQ1MDc5ODViNjhlZjcwZmFjMTg5YmQzQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
    bookUrl: 'https://calendar.app.google/F6qmp3qYDcFWika7A',
  },
  {
    name: '207 Common Area (Homewood)',
    keywords: ['207'],
    availability: 'https://calendar.google.com/calendar/u/0?cid=Y18wNDZkZDU4ZTM1MWRhNWVkNzFjYmIwYTc3NDM4YzFhNWI0NDAzNTRjNWYzOTVlZmYwYzVmMGNkNjc0ZmU0M2M0QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20',
    bookUrl: 'https://calendar.app.google/zn22N4vXMBsyLjzT8',
  },
];

const app = express();

app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name === 'book') {
      const nameOption = interaction.data.options?.find(o => o.name === 'name');

      // /book (no argument) — list all resources
      if (!nameOption) {
        const lines = resources.map(r => `- ${r.name}: ${r.bookUrl}`).join('\n');
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `**Here are all the spaces you can reserve:**\n${lines}\n\nNot sure which dates are open? Check the availability calendar here: ${AVAILABILITIES_URL}\n--\nTo get the link for one specific space, type "/book" followed by its name. For example: "/book gallery" or "/book print"`,
          },
        });
      }

      // /book <name> — find matching resource
      const query = nameOption.value.toLowerCase();
      const match = resources.find(r =>
        r.keywords.some(kw => query.includes(kw))
      );

      if (!match) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Sorry, we couldn't find a space called "${nameOption.value}".\nTry a shorter word — for example, "/book gallery" or "/book print".\nType "/book" to see the full list of spaces.`,
          },
        });
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `**${match.name}**\nSee when it's available: ${match.availability}\nReserve it here: ${match.bookUrl}\n--\nType "/book" to see all spaces you can reserve.`,
        },
      });
    }

    if (interaction.data.name === 'help') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: [
            '**Here\'s what you can do:**',
            '',
            'Type `/book` to see a list of all spaces you can reserve.',
            '',
            'Type `/book` followed by the space name to get the link for that specific space.',
            'For example: `/book gallery`, `/book print`, `/book ceramics`',
            '',
            'Type `/help` to see this message again.',
          ].join('\n'),
        },
      });
    }
  }

  return res.status(400).send('Unknown interaction');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Bot running on port ${process.env.PORT || 3000}`);
});
