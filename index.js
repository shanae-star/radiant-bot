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
    availability: 'https://calendar.google.com/calendar/embed?src=c_5cf0f0328910158bedda65adabd151e7a7e6c6f5faecc4c86aeedb91b6a62ae6%40group.calendar.google.com&ctz=America%2FNew_York',
    bookUrl: 'https://floor-gallery-radiant-mckees.youcanbook.me',
  },
  {
    name: 'Print Studio (McKees Rocks)',
    keywords: ['print'],
    availability: 'https://calendar.google.com/calendar/embed?src=c_ff68108f55328151aea89a3d47a2e0ccaeb9fab1b92b67b913078096b027ae51%40group.calendar.google.com&ctz=America%2FNew_York',
    bookUrl: 'https://print-radiant-mckees.youcanbook.me',
  },
  {
    name: 'Classroom (McKees Rocks)',
    keywords: ['classroom'],
    availability: 'https://calendar.google.com/calendar/embed?src=c_92a477ba333fab39ca7e9ef722ab6e654da8c67b3df862d0e5b4afc6e1eae29f%40group.calendar.google.com&ctz=America%2FNew_York',
    bookUrl: 'https://classrooms-radiant-mckees.youcanbook.me',
  },
  {
    name: 'Flex Space/Garage Gallery (McKees Rocks)',
    keywords: ['flex', 'garage'],
    availability: 'https://calendar.google.com/calendar/embed?src=c_eb57f262930ffd7ba6f3db4372ecaf2feeebc474d7065c6e0230615b584ce256%40group.calendar.google.com&ctz=America%2FNew_York',
    bookUrl: 'https://flex-garage-radiant-mckees.youcanbook.me',
  },
  {
    name: 'Ceramics Studio (McKees Rocks)',
    keywords: ['ceramics'],
    availability: 'https://calendar.google.com/calendar/embed?src=c_c42518658cdc04135bdf89859be35c4c688c7474a2819e16d4081f0b0935a1e9%40group.calendar.google.com&ctz=America%2FNew_York',
    bookUrl: 'https://ceramics-radiant-mckees.youcanbook.me',
  },
  {
    name: '202 Common Area (Homewood)',
    keywords: ['202'],
    availability: 'https://calendar.google.com/calendar/embed?src=c_411ed8956ea1d2b06fbe986a69f83f6d469aa678fd507985b68ef70fac189bd3%40group.calendar.google.com&ctz=America%2FNew_York',
    bookUrl: 'https://202-radiant-homewood.youcanbook.me',
  },
  {
    name: '207 Common Area (Homewood)',
    keywords: ['207'],
    availability: 'https://calendar.google.com/calendar/embed?src=c_046dd58e351da5ed71cbb0a77438c1a5b440354c5f395eff0c5f0cd674fe43c4%40group.calendar.google.com&ctz=America%2FNew_York',
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
            content: `**Here are all the spaces you can reserve:**\n${lines}\n\nNot sure which dates are open? Check the availability calendar here: ${AVAILABILITIES_URL}\n--\nTo get the link for one specific space, type "/book" followed by its name. For example: "/book 2nd floorgallery" or "/book print"`,
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
          content: `**${match.name}**\nSee when it's available: ${match.availability}\nReserve it here: ${match.bookUrl}\n--\nType "/book" to see all spaces you can reserve.`,
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
