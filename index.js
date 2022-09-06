const { Client, GatewayIntentBits } = require('discord.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
const { codeBlock } = require('@discordjs/builders');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

const api_config = require('./api_config.json');
const JdoodleAPI = require('./api_client');

const lims = [0,0,0];
const apis = [new JdoodleAPI(api_config["client1"], new JdoodleAPI(api_config["client2"]), new JdoodleAPI(api_config["client3"]))];

function find_min_index(lims){
	var result = 0;
	for(let i = 0; i < lims.length; i++){
		if(lims[i] < lims[result]) result = i;
	}
	return result;
}

function answerFormatter(code, output, memory, cpu){
	const highlighted = codeBlock('c', code);
	var answer = `${highlighted}\n\nOutput: ${output}\nMemory Usage: ${memory}\nCpu Time: ${cpu}`;
	return answer;
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'compile'){
		const modal = new ModalBuilder()
			.setCustomId('codeModalEN')
			.setTitle('Discord C Compiler');

		const codeInput = new TextInputBuilder()
			.setCustomId('codeInput')
			.setLabel('Type your CLang Code')
			.setStyle(TextInputStyle.Paragraph)

		const actionRow = new ActionRowBuilder().addComponents(codeInput);
		modal.addComponents(actionRow);
		await interaction.showModal(modal);
	}
});

client.on('interactionCreate', interaction => {
	if(interaction.type !== InteractionType.ModalSubmit) return;

	const CODE = interaction.fields.getTextInputValue('codeInput');
	var api_index = find_min_index(lims);
	apis[api_index].call(CODE, (response) => {
		console.log(response);
		const { output, statusCode, memory, cpuTime } = response.data;
		interaction.reply(answerFormatter(CODE, output, memory, cpuTime));
	}, (error) => {
		interaction.reply(`There was an error`);
		console.log(error);
	})
});


client.login(token);