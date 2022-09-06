const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const clientId = process.env.DISCORD_BOT_CLIENT_ID;
const guildId = process.env.DISCORD_BOT_GUILD_ID;
const token = process.env.DISCORD_BOT_TOKEN;

const commands = [
	new SlashCommandBuilder().setName('compile').setDescription('Compile C code from Discord!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Commands registered.'))
	.catch(console.error);