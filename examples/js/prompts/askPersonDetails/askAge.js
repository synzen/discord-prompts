/* eslint-disable @typescript-eslint/no-var-requires */
const {
  MessageVisual,
  DiscordPrompt,
  Rejection
} = require('discord.js-prompts')

// Prompt to ask age
export const askAgeVisual = async (data) => {
  return new MessageVisual(`How old are you, ${data.name}?`)
}

export const askAgeFn = async (m, data) => {
  const age = Number(m.content)
  if (isNaN(age)) {
    throw new Rejection(`That's not a valid number. Try again.`)
  }
  return {
    ...data,
    age
  }
}

export const askAgePrompt = new DiscordPrompt(askAgeVisual, askAgeFn)
