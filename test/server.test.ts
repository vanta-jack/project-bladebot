import { expect } from 'chai';
import {
  InteractionResponseType,
  InteractionType,
  InteractionResponseFlags,
} from 'discord-interactions';
import { AWW_COMMAND, INVITE_COMMAND } from '../src/commands/index.ts';
import sinon from 'sinon';
import * as server from '../src/server.ts';
import { redditUrl } from '../src/reddit.ts';

describe('Server', () => {
  describe('GET /', () => {
    it('should return a greeting message with the Discord application ID', async () => {
      const request = new Request('http://discordo.example/', {
        method: 'GET',
      });
      const env = { DISCORD_APPLICATION_ID: '123456789', DISCORD_PUBLIC_KEY: 'test' };

      const response = await server.handleRequest(request, env);
      const body = await response.text();

      expect(body).to.equal('👋 123456789');
    });
  });

  describe('POST /', () => {
    beforeEach(() => {
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should handle a PING interaction', async () => {
      const interaction = {
        type: InteractionType.PING,
      };

      const request = new Request('http://discordo.example/', {
        method: 'POST',
        headers: {
          'x-signature-ed25519': 'sig',
          'x-signature-timestamp': 'timestamp',
        },
        body: JSON.stringify(interaction),
      });

      const env = { DISCORD_APPLICATION_ID: 'test', DISCORD_PUBLIC_KEY: 'test' };

      sinon.stub(server.discordAuth, 'verifyKey').resolves(true);

      const response = await server.handleRequest(request, env);
      const body = await response.json();
      expect(body.type).to.equal(InteractionResponseType.PONG);
    });

    it('should handle an AWW command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: AWW_COMMAND.name,
        },
      };

      const request = new Request('http://discordo.example/', {
        method: 'POST',
        headers: {
          'x-signature-ed25519': 'sig',
          'x-signature-timestamp': 'timestamp',
        },
        body: JSON.stringify(interaction),
      });

      const env = { DISCORD_APPLICATION_ID: 'test', DISCORD_PUBLIC_KEY: 'test' };

      sinon.stub(server.discordAuth, 'verifyKey').resolves(true);

      // mock the fetch call to reddit
      const result = sinon
        // eslint-disable-next-line no-undef
        .stub(global, 'fetch')
        .withArgs(redditUrl)
        .resolves({
          status: 200,
          ok: true,
          json: sinon.fake.resolves({ data: { children: [] } }),
        } as unknown as Response);

      const response = await server.handleRequest(request, env);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(result.calledOnce);
    });

    it('should handle an invite command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: INVITE_COMMAND.name,
        },
      };

      const request = new Request('http://discordo.example/', {
        method: 'POST',
        headers: {
          'x-signature-ed25519': 'sig',
          'x-signature-timestamp': 'timestamp',
        },
        body: JSON.stringify(interaction),
      });

      const env = {
        DISCORD_APPLICATION_ID: '123456789',
        DISCORD_PUBLIC_KEY: 'test',
      };

      sinon.stub(server.discordAuth, 'verifyKey').resolves(true);

      const response = await server.handleRequest(request, env);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.content).to.include(
        'https://discord.com/oauth2/authorize?client_id=123456789&scope=applications.commands',
      );
      expect(body.data.flags).to.equal(InteractionResponseFlags.EPHEMERAL);
    });

    it('should handle an unknown command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: 'unknown',
        },
      };

      const request = new Request('http://discordo.example/', {
        method: 'POST',
        headers: {
          'x-signature-ed25519': 'sig',
          'x-signature-timestamp': 'timestamp',
        },
        body: JSON.stringify(interaction),
      });

      const env = { DISCORD_APPLICATION_ID: 'test', DISCORD_PUBLIC_KEY: 'test' };

      sinon.stub(server.discordAuth, 'verifyKey').resolves(true);

      const response = await server.handleRequest(request, env);
      const body = await response.json();
      expect(response.status).to.equal(400);
      expect(body.error).to.equal('Unknown Command');
    });
  });

  describe('All other routes', () => {
    it('should return a "Not Found" response', async () => {
      const request = new Request('http://discordo.example/unknown', {
        method: 'GET',
      });
      const response = await server.handleRequest(request, { DISCORD_APPLICATION_ID: 'test', DISCORD_PUBLIC_KEY: 'test' });
      expect(response.status).to.equal(404);
      const body = await response.text();
      expect(body).to.equal('Not Found.');
    });
  });
});
