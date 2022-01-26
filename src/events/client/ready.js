/*

Criador: uZeus_#6777

*/





const hastebin = require('hastebin');
const Event = require('../../structures/Event')
const { MessageEmbed, MessageActionRow, MessageButton, Message } = require('discord.js')
const { Collection } = require('@discordjs/collection');
const { config } = require('dotenv');

const actionRow = new MessageActionRow()
    .addComponents(
        [
            new MessageButton()
                .setStyle('SUCCESS')
                .setLabel('📋 Inscrição')
                .setCustomId('inscricao'),
            new MessageButton()
                .setStyle('DANGER')
                .setLabel('☎️ Suporte')
                .setCustomId('suporte'),
            new MessageButton()
                .setStyle('PRIMARY')
                .setLabel('🤝 Partner')
                .setCustomId('partner'),
        ]
    )

const row = new MessageActionRow()
    .addComponents(
        [
            new MessageButton()
                .setStyle('DANGER')
                .setLabel('❌ Finalizar Ticket')
                .setCustomId('deletar')
        ]
    )

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = async (client, interaction) => {

        console.log(`Bot ${this.client.user.username} logado com sucesso!`)
        this.client.registryCommands()


        let canal = client.channels.cache.get(client.config.id_ticket)




        const embed = new MessageEmbed()
            .setColor(client.config.corembed)
            .setDescription(`Abra um ticket de **acordo** com a categoria.

        **1° Botão** - Para realizar a **INSCRIÇÃO** de equipe(s).
        **2° Botão** - Duvidas, denuncias e **suporte**.
        **2° Botão** - Assuntos relacionados a **Projetos/Partner**.`)
        embed.setFooter({
            text: client.config.rodape
        })
            .setTimestamp()
        embed.setAuthor({
            name: "Liga Brasileira de FiveM | Ticket"
        });
        var msg = await canal.send({ embeds: [embed], components: [actionRow] })



        const collector = msg.createMessageComponentCollector()
        collector.on('collect', (i) => {

            const inscricao = new MessageEmbed()
                .setColor(client.config.corembed)
                .setDescription(`Bem vindo(a) <@${i.user.id}> a LBF. Quantas equipes deseja colocar em nosso campeonato? `)
            inscricao.setFooter({
                text: client.config.rodape
            })
                .setTimestamp()
            inscricao.setAuthor({
                name: "Liga Brasileira de FiveM | Ticket"
            });

            const suporte = new MessageEmbed()
                .setColor(client.config.corembed)
                .setDescription(`Bem vindo(a) <@${i.user.id}> a LBF. Em o que podemos ajudar?`)
            suporte.setFooter({
                text: client.config.rodape
            })
                .setTimestamp()
            suporte.setAuthor({
                name: "Liga Brasileira de FiveM | Ticket"
            });

            const partner = new MessageEmbed()
                .setColor(client.config.corembed)
                .setDescription(`Bem vindo(a) <@${i.user.id}> a LBF. Qual tipo de parceria que deseja fazer conosco?`)
            partner.setFooter({
                text: client.config.rodape
            })
                .setTimestamp()
            partner.setAuthor({
                name: "Liga Brasileira de FiveM | Ticket"
            });












            switch (i.customId) {
                case 'inscricao':
                    let criador = i.user.id
                    if (client.guilds.cache.get(i.guildId).channels.cache.find(c => c.topic === `<:lbf1:912551506547474454> | Usuario: <@${i.user.id}>\n<:lbf1:912551506547474454> | Id do usuario: ${i.user.id}\n<:lbf1:912551506547474454> | Ticket: Inscrição`)) {
                        return i.reply({
                            content: 'Você já criou um ticket para esta categoria!',
                            ephemeral: true
                        });
                    }
                    i.guild.channels.create(`ticket-${i.user.username}`, {
                        parent: client.config.id_inscricao,
                        topic: `<:lbf1:912551506547474454> | Usuario: <@${i.user.id}>\n<:lbf1:912551506547474454> | Id do usuario: ${i.user.id}\n<:lbf1:912551506547474454> | Ticket: Inscrição`,
                        permissionOverwrites: [{
                            id: i.user.id,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                        },
                        {
                            id: client.config.cargo,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                        },
                        {
                            id: i.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        },
                        ],
                        type: 'text',
                    }).then(async c => {
                        i.reply({
                            content: `Ticket criado com sucesso! <#${c.id}>`,
                            ephemeral: true
                        })
                        var msg = await c.send({ embeds: [inscricao], components: [row] })
                        const collector = msg.createMessageComponentCollector()
                        collector.on('collect', (i) => {
                            switch (i.customId) {
                                case 'deletar':
                                    i.reply({
                                        content: 'Salvando mensagens e gerando logs...'
                                    });
                                    const guild = client.guilds.cache.get(i.guildId);

                                    const chan = guild.channels.cache.get(i.channelId);

                                    chan.messages.fetch().then(async (messages) => {
                                        let a = messages.filter(m => m.author.bot !== true).map(m =>
                                            `${new Date(m.createdTimestamp).toLocaleString('pt-BR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                                        ).reverse().join('\n');
                                        if (a.length < 1) a = "Infelizmente não tinha nenhuma mensagem no ticket."
                                        hastebin.createPaste(a, {
                                            contentType: 'text/plain',
                                            server: 'https://hastebin.com'
                                        }, {})
                                            .then(function (urlToPaste) {
                                                var canal1 = client.guilds.cache.get(i.guildId).channels.cache.find(c => c.topic === `logs`)
                                                const embedii = new MessageEmbed()
                                                embedii.setAuthor({
                                                    name: `LBF | Liga Brasileira de FiveM`
                                                })
                                                    .setColor(client.config.corembed)
                                                    .setDescription(`<:lbf1:912551506547474454> | Ticket aberto por: <@${criador}>\n<:lbf1:912551506547474454> | Ticket finalizado por: <@${i.user.id}>\n<:lbf1:912551506547474454> | Categoria: Inscrição\n<:lbf1:912551506547474454> | Logs: [**Clique aqui**](${urlToPaste})`)
                                                    .setFooter({
                                                        text: client.config.rodape
                                                    })

                                                canal1.send({ embeds: [embedii] })

                                                setTimeout(() => {
                                                    chan.delete();
                                                }, 5000);
                                            });
                                    });
                                //a

                            }


                        })
                    })
                    break;








                case 'suporte':
                    let criador1 = i.user.id
                    if (client.guilds.cache.get(i.guildId).channels.cache.find(c => c.topic === `<:lbf1:912551506547474454> | Usuario: <@${i.user.id}>\n<:lbf1:912551506547474454> | Id do usuario: ${i.user.id}\n<:lbf1:912551506547474454> | Ticket: Suporte`)) {
                        return i.reply({
                            content: 'Você já criou um ticket para esta categoria!',
                            ephemeral: true
                        });
                    }
                    i.guild.channels.create(`ticket-${i.user.username}`, {
                        parent: client.config.id_suporte,
                        topic: `<:lbf1:912551506547474454> | Usuario: <@${i.user.id}>\n<:lbf1:912551506547474454> | Id do usuario: ${i.user.id}\n<:lbf1:912551506547474454> | Ticket: Suporte`,
                        permissionOverwrites: [{
                            id: i.user.id,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                        },
                        {
                            id: client.config.cargo,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                        },
                        {
                            id: i.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        },
                        ],
                        type: 'text',
                    }).then(async c => {
                        i.reply({
                            content: `Ticket criado com sucesso! <#${c.id}>`,
                            ephemeral: true
                        })
                        var msg = await c.send({ embeds: [inscricao], components: [row] })
                        const collector = msg.createMessageComponentCollector()
                        collector.on('collect', (i) => {
                            switch (i.customId) {
                                case 'deletar':
                                    i.reply({
                                        content: 'Salvando mensagens e gerando logs...'
                                    });
                                    const guild = client.guilds.cache.get(i.guildId);

                                    const chan = guild.channels.cache.get(i.channelId);

                                    chan.messages.fetch().then(async (messages) => {
                                        let a = messages.filter(m => m.author.bot !== true).map(m =>
                                            `${new Date(m.createdTimestamp).toLocaleString('pt-BR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                                        ).reverse().join('\n');
                                        if (a.length < 1) a = "Infelizmente não tinha nenhuma mensagem no ticket."
                                        hastebin.createPaste(a, {
                                            contentType: 'text/plain',
                                            server: 'https://hastebin.com'
                                        }, {})
                                            .then(function (urlToPaste) {
                                                var canal1 = client.guilds.cache.get(i.guildId).channels.cache.find(c => c.topic === `logs`)
                                                const embedii = new MessageEmbed()
                                                embedii.setAuthor({
                                                    name: `LBF | Liga Brasileira de FiveM`
                                                })
                                                    .setColor(client.config.corembed)
                                                    .setDescription(`<:lbf1:912551506547474454> | Ticket aberto por: <@${criador1}>\n<:lbf1:912551506547474454> | Ticket finalizado por: <@${i.user.id}>\n<:lbf1:912551506547474454> | Categoria: Inscrição\n<:lbf1:912551506547474454> | Logs: [**Clique aqui**](${urlToPaste})`)
                                                    .setFooter({
                                                        text: client.config.rodape
                                                    })

                                                canal1.send({ embeds: [embedii] })

                                                setTimeout(() => {
                                                    chan.delete();
                                                }, 5000);
                                            });
                                    });
                                //a

                            }


                        })
                    })
                    break;













                case 'partner':
                    let criador2 = i.user.id
                    if (client.guilds.cache.get(i.guildId).channels.cache.find(c => c.topic === `<:lbf1:912551506547474454> | Usuario: <@${i.user.id}>\n<:lbf1:912551506547474454> | Id do usuario: ${i.user.id}\n<:lbf1:912551506547474454> | Ticket: Partner`)) {
                        return i.reply({
                            content: 'Você já criou um ticket para esta categoria!',
                            ephemeral: true
                        });
                    }
                    i.guild.channels.create(`ticket-${i.user.username}`, {
                        parent: client.config.id_partner,
                        topic: `<:lbf1:912551506547474454> | Usuario: <@${i.user.id}>\n<:lbf1:912551506547474454> | Id do usuario: ${i.user.id}\n<:lbf1:912551506547474454> | Ticket: Partner`,
                        permissionOverwrites: [{
                            id: i.user.id,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                        },
                        {
                            id: client.config.cargo,
                            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                        },
                        {
                            id: i.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        },
                        ],
                        type: 'text',
                    }).then(async c => {
                        i.reply({
                            content: `Ticket criado com sucesso! <#${c.id}>`,
                            ephemeral: true
                        })
                        var msg = await c.send({ embeds: [inscricao], components: [row] })
                        const collector = msg.createMessageComponentCollector()
                        collector.on('collect', (i) => {
                            switch (i.customId) {
                                case 'deletar':
                                    i.reply({
                                        content: 'Salvando mensagens e gerando logs...'
                                    });
                                    const guild = client.guilds.cache.get(i.guildId);

                                    const chan = guild.channels.cache.get(i.channelId);

                                    chan.messages.fetch().then(async (messages) => {
                                        let a = messages.filter(m => m.author.bot !== true).map(m =>
                                            `${new Date(m.createdTimestamp).toLocaleString('pt-BR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                                        ).reverse().join('\n');
                                        if (a.length < 1) a = "Infelizmente não tinha nenhuma mensagem no ticket."
                                        hastebin.createPaste(a, {
                                            contentType: 'text/plain',
                                            server: 'https://hastebin.com'
                                        }, {})
                                            .then(function (urlToPaste) {
                                                var canal1 = client.guilds.cache.get(i.guildId).channels.cache.find(c => c.topic === `logs`)
                                                const embedii = new MessageEmbed()
                                                embedii.setAuthor({
                                                    name: `LBF | Liga Brasileira de FiveM`
                                                })
                                                    .setColor(client.config.corembed)
                                                    .setDescription(`<:lbf1:912551506547474454> | Ticket aberto por: <@${criador2}>\n<:lbf1:912551506547474454> | Ticket finalizado por: <@${i.user.id}>\n<:lbf1:912551506547474454> | Categoria: Inscrição\n<:lbf1:912551506547474454> | Logs: [**Clique aqui**](${urlToPaste})`)
                                                    .setFooter({
                                                        text: client.config.rodape
                                                    })

                                                canal1.send({ embeds: [embedii] })

                                                setTimeout(() => {
                                                    chan.delete();
                                                }, 5000);
                                            });
                                    });
                                //a

                            }


                        })
                    })
                    break;
            }
        })

    }
}