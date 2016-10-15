import CreeperType from "../classes/CreeperType";
import CreeperAction from "../classes/CreeperAction";
import CreeperKeywords from "../classes/CreeperKeywords";
import CreeperFrequency from "../classes/CreeperFrequency";

export default class Creeper {

  creeperId: number;
  clientId: number;
  name: string;
  type: CreeperType;
  actions: Array<CreeperAction>;
  keywords: CreeperKeywords;
  isEnabled: boolean;
  frequency: CreeperFrequency;
  delay: number;

  // from vo-runners
  actionsCountStore: Object;
  autochirp: Object;
  genderSplit: Object;

  constructor (creeperId: number, name: string, type: CreeperType, keywords: CreeperKeywords, actions: Array<CreeperAction> = [], isEnabled: boolean = true, frequency: CreeperFrequency = new CreeperFrequency(30), delay: number = 5 * 60) {
    this.creeperId = creeperId;
    this.name = name;
    this.type = type;
    this.keywords = keywords;
    this.isEnabled = isEnabled;
    this.frequency = frequency;
    this.delay = delay;
    if (actions) {
      this.actions = actions;
      this.actionsCountStore = {};
      this.actions.map(action => action.type.toString()).forEach(actionTypeString => {
        this.actionsCountStore["unique-action-current-" + actionTypeString] = Math.floor(Math.random() * this.actions.length);
      });
    }
    // from vo-runners
    this.autochirp = {
      handlesTweetedAt: [],
      // from vo-outcomes
      replies: []
    };
  }

  setClientId (clientId: number): void {
    this.clientId = clientId;
  }

  toString (): string {
    return `${this.name} (${this.keywords})`;
  }

  bumpAction (type): number {
    if (this.actionsCountStore["unique-action-current-" + type] === this.actions.length - 1) {
      console.log(" -> lastActionCount in creeperBumpAction is at upper bound; changing...");
      return (this.actionsCountStore["unique-action-current-" + type] = 0);
    } else {
      console.log(" -> lastActionCount in creeperBumpAction is NOT at upper bound; incrementing...");
      return (this.actionsCountStore["unique-action-current-" + type] += 1);
    }
  };

}