import { MessageOptions } from 'discord.js'
import { VisualInterface } from "prompt-anything";

export class MessageFormat implements VisualInterface {
  text: string;
  options?: MessageOptions

  constructor (text: string, options?: MessageOptions) {
    this.text = text
    this.options = options;
  }
}