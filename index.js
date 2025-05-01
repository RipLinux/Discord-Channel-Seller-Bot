require('dotenv').config()
const { ChannelType, Client, PermissionsBitField, ButtonBuilder } = require("discord.js");
const client = new Client({intents:[131071]});

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const Data = require("./Models/Channels.js");
const Data2 = require("./Models/GuildData.js");
const ms = require("ms");
const { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('@discordjs/builders');
const db = require("pro.db");
const talkedRecently = new Set();
client.on("ready", () => {
    const commands = [
      {
        name: "buy-channle",
        description: "Buy TempChannels",
      },
    ];
    const rest = new REST({ version: "10" }).setToken(process.env.token);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: commands,
        });
        
        console.log(client.user.tag);
        console.log("
		    ");
        console.log('')
      } catch (error) {
        console.error(error);
      }
    })();
  });
client.on("interactionCreate", async interaction =>{
if(!interaction.isCommand())return;
if(interaction.commandName === "buy-channle"){
  let data = db.fetch(`ChannelTime_${interaction.user.id}`)
  if(data)return interaction.reply({content:"> **ايمكنك شراء روم في الوقت الحالي انت تمتلك روم بالفعل :red_circle:  **"})
  let data2 = db.fetch(`ChannelTime2_${interaction.user.id}`)
  if(data2)return interaction.reply({content:"> **ايمكنك شراء روم في الوقت الحالي انت تمتلك روم بالفعل :red_circle:  **"})
  let data3 = db.fetch(`ChannelTime3_${interaction.user.id}`)
  if(data3)return interaction.reply({content:"> **ايمكنك شراء روم في الوقت الحالي انت تمتلك روم بالفعل :red_circle:  **"})
  let data4 = db.fetch(`ChannelTime4_${interaction.user.id}`)
  if(data4)return interaction.reply({content:"> **ايمكنك شراء روم في الوقت الحالي انت تمتلك روم بالفعل :red_circle:  **"})
  let data5 = db.fetch(`ChannelTime5_${interaction.user.id}`)
  if(data5)return interaction.reply({content:"> **ايمكنك شراء روم في الوقت الحالي انت تمتلك روم بالفعل :red_circle:  **"})
  if (talkedRecently.has(interaction.user.id)) {
    let embed = new EmbedBuilder()
      .setDescription(
`
من فضلك انتظر <t:${Math.floor((Date.now() + ms(Data2.Channels.CoolDown)) / 1000)}:R>
للشراء مره اخرى
`)
    interaction.reply({ embeds: [embed] });
  } else {
    talkedRecently.add(interaction.user.id);
    setTimeout(() => {
      talkedRecently.delete(interaction.user.id);
    }, ms(Data2.Channels.CoolDown));
    const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('اختر من قائمة')
            .addOptions(
                {
                    label: Data.Channels.Time1,
                    description: 'مدة الروم الذي سوف تشتريها',
                    value: 'OneTime',
                },
                {
                    label: Data.Channels.Time2,
                    description: 'مدة الروم الذي سوف تشتريها',
                    value: 'TwoTime',
                },{
                    label: Data.Channels.Time3,
                    description: 'مدة الروم الذي سوف تشتريها',
                    value: 'ThreeTime',
                },{
                    label: Data.Channels.Time4,
                    description: 'مدة الروم الذي سوف تشتريها',
                    value: 'FourTime',
                },{
                    label: Data.Channels.Time5,
                    description: 'مدة الروم الذي سوف تشتريها',
                    value: 'FiveTime',
                },
            ),
    );
    interaction.reply({content:"> **يرجى اختيار مدة الروم المراد شرائها** :shopping_cart:",components:[row]})
}
}
})
client.on("interactionCreate",async interaction =>{
    if(!interaction.isStringSelectMenu())return;
	const selected = interaction.values[0];
    let resulting = Math.floor(Data.Price.Time1 * (20) / (19) + (1))
	if(selected === 'OneTime') {
        let embedme = new EmbedBuilder()
        .setDescription(
          `> **للحصول على الروم برجاء تحويل :** ${resulting} ، **الى :** <@${Data2.Guild.Owner}> **عن طريق الامر التالي :**
\`\`\`c ${Data2.Guild.Owner} ${resulting}\`\`\`
`
        )
        .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
        .setTitle("> **عملية التحويل**")
        .setTimestamp()  
      await interaction.update({ embeds: [embedme] ,components:[],content:""}).then(async (message) =>{
            const filter = (response) =>
            response.content.startsWith(
              `**:moneybag: | ${interaction.user.username}, has transferred \`$${Data.Price.Time1}\``
            ) &&
            response.content.includes(`${Data2.Guild.Owner}`) &&
            response.author.id === Data2.Guild.Probot &&
            response.content.includes(Number(Data.Price.Time1));
          const filteruser = (i) => i.user.id === interaction.user.id;
          const collector = interaction.channel.createMessageCollector({
            filter,
            filteruser,
          });
          collector.on("collect", async i =>{
            interaction.guild.channels.create({
                name: interaction.user.username,
                type: ChannelType.GuildText,
                parent:Data.Channels.CategoryId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.MentionEveryone,PermissionsBitField.Flags.SendMessages],
                    },
                ],
            }).then(gg =>{
               db.set(`ChannelTime_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
               db.set(`Channel_${interaction.user.id}`,gg.id)
                let embed = new EmbedBuilder()
                .setTitle(`لقد تمت عملية الشراء بنجاح - ✔️`)
                .addFields(
                  { name: "سعر الروم :", value: `${Data.Price.Time1}` },
                  { name: "مدة الروم :", value: `<t:${Math.floor((Date.now() + ms(Data.Channels.Time1)) / 1000)}:R>` },
                  { name: "الروم :", value: `<#${gg.id}>` }
                )
               
              message.edit({ embeds: [embed] }).then(async() =>{
                let embed = new EmbedBuilder()
                .addFields(
                {name:`> صاحب الروم :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
                {name:"> مدة الروم :",value:`${Data.Channels.Time1}`,inline:false},
                {name:"> تبقي من مدة الروم :",value:`<t:${Math.floor((Date.now() + ms(Data.Channels.Time1)) / 1000)}:R>`,inline:false})
                .setThumbnail(interaction.guild.iconURL({dynamic:true}))
                .setTimestamp()
                .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
                let channellog = interaction.guild.channels.cache.get(Data2.Channels.Log)
                let embed3 = new EmbedBuilder()
               .setTitle("> هناك روم جديدة تم شرائها :")
              .setURL("https://discord.gg/3WpsPXFQjH")
              .addFields(
                {name:`> من طريف :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
                {name:"> مدة الروم :",value:`${Data.Channels.Time1}`,inline:false},
                {name:"> الروم :",value:`${gg}`,inline:false})
                .setThumbnail(interaction.user.avatarURL({dynamic:true}))
                .setTimestamp()
                  .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
                channellog.send({embeds:[embed3]})
                setTimeout(() =>{
                  gg.delete()
                  db.delete(`ChannelTime_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
                  db.delete(`Channel_${interaction.user.id}`,gg.id)
                },ms(Data.Channels.Time1))
                gg.send({embeds:[embed]}).then(() =>{
                    setTimeout(() => {
                    interaction.user.send({content:`
الروم الخاصة بك سوف تنتهي 
بعد : <t:${Math.floor((Date.now() + ms(Data.Channels.Time1)/2) / 1000)}:R>
الروم : ${gg}`})
                  }, ms(Data.Channels.Time1)/2);
                })
              })
            })
          })
        })
    } else 
    if(selected === 'TwoTime') {
      let resulting = Math.floor(Data.Price.Time2 * (20) / (19) + (1))
      let embedme = new EmbedBuilder()
      .setDescription(
        `> **للحصول على الروم برجاء تحويل :** ${resulting} ، **الى :** <@${Data2.Guild.Owner}> **عن طريق الامر التالي :**
\`\`\`c ${Data2.Guild.Owner} ${resulting}\`\`\`
`
      )
      .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
      .setTitle("> **عملية التحويل**")
      .setTimestamp()
    await interaction.update({ embeds: [embedme] ,components:[],content:""}).then(async (message) =>{
          const filter = (response) =>
          response.content.startsWith(
            `**:moneybag: | ${interaction.user.username}, has transferred \`$${Data.Price.Time2}\``
          ) &&
          response.content.includes(`${Data2.Guild.Owner}`) &&
          response.author.id === Data2.Guild.Probot &&
          response.content.includes(Number(Data.Price.Time2));
        const filteruser = (i) => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter,
          filteruser,
        });
        collector.on("collect", async i =>{
          interaction.guild.channels.create({
              name: interaction.user.username,
              type: ChannelType.GuildText,
              parent:Data.Channels.CategoryId,
              permissionOverwrites: [
                  {
                      id: interaction.guild.id,
                      deny: [PermissionsBitField.Flags.SendMessages],
                  },
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.MentionEveryone,PermissionsBitField.Flags.SendMessages],
                  },
              ],
          }).then(gg =>{
            db.set(`ChannelTime2_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
            db.set(`Channel2_${interaction.user.id}`,gg.id)
              let embed = new EmbedBuilder()
              .setTitle(`لقد تمت عملية الشراء بنجاح - ✔️`)
              .addFields(
                { name: "سعر الروم :", value: `${Data.Price.Time2}` },
                { name: "مدة الروم :", value: `<t:${Math.floor((Date.now() + ms(Data.Channels.Time2)) / 1000)}:R>` },
                { name: "الروم :", value: `<#${gg.id}>` }
              )
            message.edit({ embeds: [embed] }).then(async() =>{
              let embed = new EmbedBuilder()
              .addFields(
              {name:`> صاحب الروم :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
              {name:"> مدة الروم :",value:`${Data.Channels.Time2}`,inline:false},
              {name:"> تبقي من مدة الروم :",value:`<t:${Math.floor((Date.now() + ms(Data.Channels.Time2)) / 1000)}:R>`,inline:false})
              .setThumbnail(interaction.guild.iconURL({dynamic:true}))
              .setTimestamp()
              .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
              let channellog = interaction.guild.channels.cache.get(Data2.Channels.Log)
              let embed3 = new EmbedBuilder()
              .setTitle("> هناك روم جديدة تم شرائها :")
              .setURL("https://discord.gg/3WpsPXFQjH")
              .addFields(
                {name:`> من طريف :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
                {name:"> مدة الروم :",value:`${Data.Channels.Time1}`,inline:false},
                {name:"> الروم :",value:`${gg}`,inline:false})
                .setThumbnail(interaction.user.avatarURL({dynamic:true}))
                .setTimestamp()
                .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
              channellog.send({embeds:[embed3]})
              setTimeout(() =>{
                gg.delete()
                db.delete(`ChannelTime2_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
                db.delete(`Channel2_${interaction.user.id}`,gg.id)
              },ms(Data.Channels.Time2))
              gg.send({embeds:[embed]}).then(() =>{
                  setTimeout(() => {
                  interaction.user.send({content:`
الروم الخاصة بك سوف تنتهي 
بعد : <t:${Math.floor((Date.now() + ms(Data.Channels.Time2)/2) / 1000)}:R>
الروم : ${gg}`})
                }, ms(Data.Channels.Time2)/2);
              })
            })
          })
        })
      })
	}else 
    if(selected === 'ThreeTime') {
      let resulting = Math.floor(Data.Price.Time3 * (20) / (19) + (1))
      let embedme = new EmbedBuilder()
      .setDescription(
        `> **للحصول على الروم برجاء تحويل :** ${resulting} ، **الى :** <@${Data2.Guild.Owner}> **عن طريق الامر التالي :**
\`\`\`c ${Data2.Guild.Owner} ${resulting}\`\`\`
`
      )
      .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
      .setTitle("عملية التحويل")
      .setTimestamp()
    await interaction.update({ embeds: [embedme] ,components:[],content:""}).then(async (message) =>{
          const filter = (response) =>
          response.content.startsWith(
            `**:moneybag: | ${interaction.user.username}, has transferred \`$${Data.Price.Time3}\``
          ) &&
          response.content.includes(`${Data2.Guild.Owner}`) &&
          response.author.id === Data2.Guild.Probot &&
          response.content.includes(Number(Data.Price.Time3));
        const filteruser = (i) => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter,
          filteruser,
        });
        collector.on("collect", async i =>{
          interaction.guild.channels.create({
              name: interaction.user.username,
              type: ChannelType.GuildText,
              parent:Data.Channels.CategoryId,
              permissionOverwrites: [
                  {
                      id: interaction.guild.id,
                      deny: [PermissionsBitField.Flags.SendMessages],
                  },
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.MentionEveryone,PermissionsBitField.Flags.SendMessages],
                  },
              ],
          }).then(gg =>{
            db.set(`ChannelTime3_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
            db.set(`Channel3_${interaction.user.id}`,gg.id)
              let embed = new EmbedBuilder()
              .setTitle(`لقد تمت عملية الشراء بنجاح - ✔️`)
              .addFields(
                { name: "سعر الروم :", value: `${Data.Price.Time3}` },
                { name: "مدة الروم :", value: `<t:${Math.floor((Date.now() + ms(Data.Channels.Time3)) / 1000)}:R>` },
                { name: "الروم :", value: `<#${gg.id}>` }
              )
            message.edit({ embeds: [embed] }).then(async() =>{
              let embed = new EmbedBuilder()
              .addFields(
              {name:`> صاحب الروم :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
              {name:"> مدة الروم :",value:`${Data.Channels.Time3}`,inline:false},
              {name:"> تبقي من مدة الروم :",value:`<t:${Math.floor((Date.now() + ms(Data.Channels.Time3)) / 1000)}:R>`,inline:false})
              .setThumbnail(interaction.guild.iconURL({dynamic:true}))
              .setTimestamp()
              .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
              let channellog = interaction.guild.channels.cache.get(Data2.Channels.Log)
              let embed3 = new EmbedBuilder()
               .setTitle("> هناك روم جديدة تم شرائها :")
              .setURL("https://discord.gg/3WpsPXFQjH")
              .addFields(
                {name:`> من طريف :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
                {name:"> مدة الروم :",value:`${Data.Channels.Time1}`,inline:false},
                {name:"> الروم :",value:`${gg}`,inline:false})
                .setThumbnail(interaction.user.avatarURL({dynamic:true}))
                .setTimestamp()
                .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
              channellog.send({embeds:[embed3]})
              setTimeout(() =>{
                gg.delete()
                db.delete(`ChannelTime3_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
                db.delete(`Channel3_${interaction.user.id}`,gg.id)
              },ms(Data.Channels.Time3))
              gg.send({embeds:[embed]}).then(() =>{
                  setTimeout(() => {
                  interaction.user.send({content:`
الروم الخاصة بك سوف تنتهي 
بعد : <t:${Math.floor((Date.now() + ms(Data.Channels.Time3)/2) / 1000)}:R>
الروم : ${gg}`})
                }, ms(Data.Channels.Time3)/2);
              })
            })
          })
        })
      })
    }else 
    if(selected === 'FourTime') {
      let resulting = Math.floor(Data.Price.Time4 * (20) / (19) + (1))
      let embedme = new EmbedBuilder()
      .setDescription(
        `> **للحصول على الروم برجاء تحويل :** ${resulting} ، **الى :** <@${Data2.Guild.Owner}> **عن طريق الامر التالي :**
\`\`\`c ${Data2.Guild.Owner} ${resulting}\`\`\`
`
      )
      .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
      .setTitle("عملية التحويل")
      .setTimestamp()
    await interaction.update({ embeds: [embedme] ,components:[],content:""}).then(async (message) =>{
          const filter = (response) =>
          response.content.startsWith(
            `**:moneybag: | ${interaction.user.username}, has transferred \`$${Data.Price.Time4}\``
          ) &&
          response.content.includes(`${Data2.Guild.Owner}`) &&
          response.author.id === Data2.Guild.Probot &&
          response.content.includes(Number(Data.Price.Time4));
        const filteruser = (i) => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter,
          filteruser,
        });
        collector.on("collect", async i =>{
          interaction.guild.channels.create({
              name: interaction.user.username,
              type: ChannelType.GuildText,
              parent:Data.Channels.CategoryId,
              permissionOverwrites: [
                  {
                      id: interaction.guild.id,
                      deny: [PermissionsBitField.Flags.SendMessages],
                  },
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.MentionEveryone,PermissionsBitField.Flags.SendMessages],
                  },
              ],
          }).then(gg =>{
            db.set(`ChannelTime4_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
            db.set(`Channel4_${interaction.user.id}`,gg.id)
              let embed = new EmbedBuilder()
              .setTitle(`لقد تمت عملية الشراء بنجاح - ✔️`)
              .addFields(
                { name: "سعر الروم :", value: `${Data.Price.Time4}` },
                { name: "مدة الروم :", value: `<t:${Math.floor((Date.now() + ms(Data.Channels.Time4)) / 1000)}:R>` },
                { name: "الروم :", value: `<#${gg.id}>` }
              )
            message.edit({ embeds: [embed] }).then(async() =>{
              let embed = new EmbedBuilder()
              .addFields(
              {name:`> صاحب الروم :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
              {name:"> مدة الروم :",value:`${Data.Channels.Time4}`,inline:false},
              {name:"> تبقي من مدة الروم :",value:`<t:${Math.floor((Date.now() + ms(Data.Channels.Time4)) / 1000)}:R>`,inline:false})
              .setThumbnail(interaction.guild.iconURL({dynamic:true}))
              .setTimestamp()
              .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
              let channellog = interaction.guild.channels.cache.get(Data2.Channels.Log)
              let embed3 = new EmbedBuilder()
               .setTitle("> هناك روم جديدة تم شرائها :")
              .setURL("https://discord.gg/3WpsPXFQjH")
              .addFields(
                {name:`> من طريف :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
                {name:"> مدة الروم :",value:`${Data.Channels.Time1}`,inline:false},
                {name:"> الروم :",value:`${gg}`,inline:false})
                .setThumbnail(interaction.user.avatarURL({dynamic:true}))
                .setTimestamp()
                .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
              channellog.send({embeds:[embed3]})
              setTimeout(() =>{
                gg.delete()
                db.delete(`ChannelTime4_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
                db.delete(`Channel4_${interaction.user.id}`,gg.id)
              },ms(Data.Channels.Time4))
              gg.send({embeds:[embed]}).then(() =>{
                  setTimeout(() => {
                  interaction.user.send({content:`
الروم الخاصة بك سوف تنتهي 
بعد : <t:${Math.floor((Date.now() + ms(Data.Channels.Time4)/2) / 1000)}:R>
الروم : ${gg}`})
                }, ms(Data.Channels.Time4)/2);
              })
            })
          })
        })
      })
    }else 
    if(selected === 'FiveTime') {
      let resulting = Math.floor(Data.Price.Time5 * (20) / (19) + (1))
      let embedme = new EmbedBuilder()
      .setDescription(
        `> **للحصول على الروم برجاء تحويل :** ${resulting} ، **الى :** <@${Data2.Guild.Owner}> **عن طريق الامر التالي :**
\`\`\`c ${Data2.Guild.Owner} ${resulting}\`\`\`
`
      )
      .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
      .setTitle("عملية التحويل")
      .setTimestamp()
    await interaction.update({ embeds: [embedme] ,components:[],content:""}).then(async (message) =>{
          const filter = (response) =>
          response.content.startsWith(
            `**:moneybag: | ${interaction.user.username}, has transferred \`$${Data.Price.Time5}\``
          ) &&
          response.content.includes(`${Data2.Guild.Owner}`) &&
          response.author.id === Data2.Guild.Probot &&
          response.content.includes(Number(Data.Price.Time5));
        const filteruser = (i) => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter,
          filteruser,
        });
        collector.on("collect", async i =>{
          interaction.guild.channels.create({
              name: interaction.user.username,
              type: ChannelType.GuildText,
              parent:Data.Channels.CategoryId,
              permissionOverwrites: [
                  {
                      id: interaction.guild.id,
                      deny: [PermissionsBitField.Flags.SendMessages],
                  },
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.ViewChannel,PermissionsBitField.Flags.MentionEveryone,PermissionsBitField.Flags.SendMessages],
                  },
              ],
          }).then(gg =>{
            db.set(`ChannelTime5_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
            db.set(`Channel5_${interaction.user.id}`,gg.id)
              let embed = new EmbedBuilder()
              .setTitle(`لقد تمت عملية الشراء بنجاح - ✔️`)
              .addFields(
                { name: "سعر الروم :", value: `${Data.Price.Time5}` },
                { name: "مدة الروم :", value: `<t:${Math.floor((Date.now() + ms(Data.Channels.Time5)) / 1000)}:R>` },
                { name: "الروم :", value: `<#${gg.id}>` }
              )
            message.edit({ embeds: [embed] }).then(async() =>{
              let embed = new EmbedBuilder()
              .addFields(
              {name:`> صاحب الروم :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
              {name:"> مدة الروم :",value:`${Data.Channels.Time5}`,inline:false},
              {name:"> تبقي من مدة الروم :",value:`<t:${Math.floor((Date.now() + ms(Data.Channels.Time5)) / 1000)}:R>`,inline:false})
              .setThumbnail(interaction.guild.iconURL({dynamic:true}))
              .setTimestamp()
              .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
              let channellog = interaction.guild.channels.cache.get(Data2.Channels.Log)
              let embed3 = new EmbedBuilder()
               .setTitle("> هناك روم جديدة تم شرائها :")
              .setURL("https://discord.gg/3WpsPXFQjH")
              .addFields(
                {name:`> من طريف :`,value:`${interaction.user} | ${interaction.user.id}`,inline:false},
                {name:"> مدة الروم :",value:`${Data.Channels.Time1}`,inline:false},
                {name:"> الروم :",value:`${gg}`,inline:false})
                .setThumbnail(interaction.user.avatarURL({dynamic:true}))
                .setTimestamp()
                .setAuthor({name:interaction.user.tag,iconURL:interaction.user.avatarURL({dynamic:true})})
              channellog.send({embeds:[embed3]})
              setTimeout(() =>{
                gg.delete()
                db.delete(`ChannelTime5_${interaction.user.id}`,`${Date.now() + ms(Data.Channels.Time1)}`)
                db.delete(`Channel5_${interaction.user.id}`,gg.id)
              },ms(Data.Channels.Time5))
              gg.send({embeds:[embed]}).then(() =>{
                  setTimeout(() => {
                  interaction.user.send({content:`
الروم الخاصة بك سوف تنتهي 
بعد : <t:${Math.floor((Date.now() + ms(Data.Channels.Time5)/2) / 1000)}:R>
الروم : ${gg}`})
                }, ms(Data.Channels.Time5)/2);
              })
            })
          })
        })
      })
    }
});



client.on('ready', () => {
  let data = db.all().map(data => data.filter(d => data[0].includes("ChannelTime")))
  let filteredData = data.filter(array => array.length > 0)
  for(let i=0 ; i < filteredData.length ; i++){
    let array = filteredData[i]
    let id = array[0]
    let idd = array[0].replace("DATA = ChannelTime_" , "")
    let time = array[1].replace("VALUE = " , "")
    async function checkTime(date , user){
     if((date - Date.now()) < 0){
       db.delete(`ChannelTime_${user}`)
       let guild = client.guilds.cache.get(Data2.Guild.GuildId)
       guild.channels.cache.get(db.get(`Channel_${user}`)).delete().then(async() => {
       db.delete(`Channel_${user}`)
       })
     }
    }

    checkTime(time , idd)

  }
 })


 client.on('ready', () => {
  let data = db.all().map(data => data.filter(d => data[0].includes("ChannelTime2")))
  let filteredData = data.filter(array => array.length > 0)
  for(let i=0 ; i < filteredData.length ; i++){
    let array = filteredData[i]
    let id = array[0]
    let idd = array[0].replace("DATA = ChannelTime2_" , "")
    let time = array[1].replace("VALUE = " , "")
    async function checkTime(date , user){
     if((date - Date.now()) < 0){
       db.delete(`ChannelTime_${user}`)
       let guild = client.guilds.cache.get(Data2.Guild.GuildId)
       guild.channels.cache.get(db.get(`Channel2_${user}`)).delete().then(async() => {
       db.delete(`Channel_${user}`)
       })
     }
    }

    checkTime(time , idd)

  }
 })

 client.on('ready', () => {
  let data = db.all().map(data => data.filter(d => data[0].includes("ChannelTime3")))
  let filteredData = data.filter(array => array.length > 0)
  for(let i=0 ; i < filteredData.length ; i++){
    let array = filteredData[i]
    let id = array[0]
    let idd = array[0].replace("DATA = ChannelTime3_" , "")
    let time = array[1].replace("VALUE = " , "")
    async function checkTime(date , user){
     if((date - Date.now()) < 0){
       db.delete(`ChannelTime_${user}`)
       let guild = client.guilds.cache.get(Data2.Guild.GuildId)
       guild.channels.cache.get(db.get(`Channel3_${user}`)).delete().then(async() => {
       db.delete(`Channel_${user}`)
       })
     }
    }

    checkTime(time , idd)

  }
 })

 client.on('ready', () => {
  let data = db.all().map(data => data.filter(d => data[0].includes("ChannelTime4")))
  let filteredData = data.filter(array => array.length > 0)
  for(let i=0 ; i < filteredData.length ; i++){
    let array = filteredData[i]
    let id = array[0]
    let idd = array[0].replace("DATA = ChannelTime4_" , "")
    let time = array[1].replace("VALUE = " , "")
    async function checkTime(date , user){
     if((date - Date.now()) < 0){
       db.delete(`ChannelTime_${user}`)
       let guild = client.guilds.cache.get(Data2.Guild.GuildId)
       guild.channels.cache.get(db.get(`Channel4_${user}`)).delete().then(async() => {
       db.delete(`Channel_${user}`)
       })
     }
    }

    checkTime(time , idd)

  }
 })

 client.on('ready', () => {
  let data = db.all().map(data => data.filter(d => data[0].includes("ChannelTime5")))
  let filteredData = data.filter(array => array.length > 0)
  for(let i=0 ; i < filteredData.length ; i++){
    let array = filteredData[i]
    let id = array[0]
    let idd = array[0].replace("DATA = ChannelTime5_" , "")
    let time = array[1].replace("VALUE = " , "")
    async function checkTime(date , user){
     if((date - Date.now()) < 0){
       db.delete(`ChannelTime_${user}`)
       let guild = client.guilds.cache.get(Data2.Guild.GuildId)
       guild.channels.cache.get(db.get(`Channel5_${user}`)).delete().then(async() => {
       db.delete(`Channel_${user}`)
       })
     }
    }

    checkTime(time , idd)

  }
 })


client.login(process.env.token)
