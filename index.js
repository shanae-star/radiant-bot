import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  verifyKeyMiddleware,
} from 'discord-interactions';

const resources = [
  {
    name: '2nd Floor Gallery (McKees Rocks)',
    keywords: ['2nd floor'],
    bookUrl: 'https://floor-gallery-radiant-mckees.youcanbook.me',
  },
  {
    name: 'Print Studio (McKees Rocks)',
    keywords: ['print'],
    bookUrl: 'https://print-radiant-mckees.youcanbook.me',
  },
  {
    name: 'Classroom (McKees Rocks)',
    keywords: ['classroom'],
    bookUrl: 'https://classrooms-radiant-mckees.youcanbook.me',
  },
  {
    name: 'Flex Space/Garage Gallery (McKees Rocks)',
    keywords: ['flex', 'garage'],
    bookUrl: 'https://flex-garage-radiant-mckees.youcanbook.me',
  },
  {
    name: 'Ceramics Studio (McKees Rocks)',
    keywords: ['ceramics'],
    bookUrl: 'https://ceramics-radiant-mckees.youcanbook.me',
  },
  {
    name: '202 Common Area (Homewood)',
    keywords: ['202'],
    bookUrl: 'https://202-radiant-homewood.youcanbook.me',
  },
  {
    name: '207 Common Area (Homewood)',
    keywords: ['207'],
    bookUrl: 'https://207-radiant-homewood.youcanbook.me',
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
            content: `**Here are all the spaces you can reserve:**\n${lines}\n--\nTo get the link for one specific space, type "/book" followed by its name. For example: "/book 2nd floorgallery" or "/book print"`,
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
            content: `Sorry, we couldn't find a space called "${nameOption.value}".\nTry a shorter word — for example, "/book 2nd floor gallery" or "/book print".\nType "/book" to see the full list of spaces.`,
          },
        });
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `**${match.name}**\nReserve it here: ${match.bookUrl}\n--\nType "/book" to see all spaces you can reserve.`,
        },
      });
    }

    if (interaction.data.name === 'helpme') {
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
            'Type `/helpme` to see this message again.',
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
