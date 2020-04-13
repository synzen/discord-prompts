import { PromptRunner, PromptNode } from 'prompt-anything'
import { DiscordChannel } from './DiscordChannel'
import { TextChannel } from './interfaces/TextChannel'
import { User } from './interfaces/User'

/**
 * Runs a series of prompt nodes
 */
export class DiscordPromptRunner<T> extends PromptRunner<T> {
  /**
   * Channel IDs that are currently running prompts
   */
  static activeChannels: Set<string> = new Set()
  constructor(author: User, data: T) {
    super({
      ...data,
      authorID: author.id
    })
  }

  /**
   * Marks a channel as active
   * 
   * @param id Channel ID
   */
  static addActiveChannel (id: string): void {
    this.activeChannels.add(id)
  }

  /**
   * Unmarks a channel as active
   * 
   * @param id Channel ID
   */
  static deleteActiveChannel (id: string): void {
    this.activeChannels.delete(id)
  }

  /**
   * Check if a channel is currently running a prompt. This
   * should be called before running a prompt runner to
   * check if there are any active menus before running
   * a new one
   * 
   * @param id Channel ID
   */
  static isActiveChannel (id: string): boolean {
    return this.activeChannels.has(id)
  } 

  /**
   * Convert a TextChannel to a DiscordChannel for
   * compatibility with prompt-anything
   * 
   * @param channel
   */
  static convertTextChannel (channel: TextChannel): DiscordChannel {
    return new DiscordChannel(channel)
  }

  run (node: PromptNode<T>, channel: DiscordChannel): Promise<T>;
  run (node: PromptNode<T>, channel: TextChannel): Promise<T>;

  /**
   * Start running prompts with the root PromptNode
   * 
   * @param node Node that contains the starting prompt
   * @param channel Discord channel to send the prompts to
   */
  async run (node: PromptNode<T>, channel: TextChannel|DiscordChannel): Promise<T> {
    let compatibleChannel: DiscordChannel
    const channelID = channel.id
    if (channel instanceof DiscordChannel) {
      compatibleChannel = channel
    } else {
      compatibleChannel = DiscordPromptRunner.convertTextChannel(channel)
    }
    DiscordPromptRunner.addActiveChannel(channelID)
    const result = await super.run(node, compatibleChannel)
    DiscordPromptRunner.deleteActiveChannel(channelID)
    return result
  }
}
