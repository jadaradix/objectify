import Serialiser = require("./Serialiser");

import Creeper from "../classes/Creeper";
import CreeperType from "../classes/CreeperType";
import CreeperAction from "../classes/CreeperAction";
import CreeperActionType from "../classes/CreeperActionType";
import CreeperKeywords from "../classes/CreeperKeywords";
import CreeperFrequency from "../classes/CreeperFrequency";
import CreeperHandlesTweetedAt from "../classes/CreeperHandlesTweetedAt";

class CreeperSerialiser implements Serialiser {

  toRaw (creeper: Creeper): Object {
    const object: Object = {};
    if (creeper.name) object["name"] = creeper.name;
    object["type"] = creeper.type.value;
    object["keywords"] = creeper.keywords.toString();
    object["isEnabled"] = (creeper.isEnabled === true ? 1 : 0);
    object["isEnabledByUs"] = (creeper.isEnabledByUs === true ? 1 : 0);
    object["actionFrequency"] = creeper.frequency.value;
    object["delay"] = creeper.delay;
    object["handlesTweetedAt"] = creeper.handlesTweetedAt.toString();
    object["converterId"] = creeper.converterId;
    object["deepProfileOnFind"] = creeper.deepProfileOnFind;
    object["deepProfileOnAction"] = creeper.deepProfileOnAction;
    return object;
  }

  fromRaw (object): Creeper {
    const type: CreeperType = new CreeperType(object.type);
    let actions: Array<CreeperAction> = [];
    if (object.actions) {
      actions = object.actions.map((action) => {
        return new CreeperAction(
          action.creeperActionId,
          new CreeperActionType(action.type),
          action.data
        );
      });
    }
    const keywords: CreeperKeywords = new CreeperKeywords();
    keywords.fromString(object.keywords);
    const isEnabled: boolean = (object.isEnabled === 1 ? true : false);
    const isEnabledByUs: boolean = (object.isEnabledByUs === 1 ? true : false);
    const frequency: CreeperFrequency = new CreeperFrequency(object.actionFrequency);
    const delay = object.delay;
    const handlesTweetedAt = new CreeperHandlesTweetedAt();
    handlesTweetedAt.fromString(object.handlesTweetedAt);
    const converterId = object.converterId;
    const deepProfileOnFind = object.deepProfileOnFind;
    const deepProfileOnAction = object.deepProfileOnAction;
    const creeper = new Creeper(
      object.creeperId,
      object.name,
      type,
      keywords,
      actions,
      isEnabled,
      isEnabledByUs,
      frequency,
      delay,
      handlesTweetedAt,
      converterId,
      deepProfileOnFind,
      deepProfileOnAction
    );
    if (object.clientId) creeper.setClient({
      "clientId": object.clientId
    });
    return creeper;
  }

}

export = CreeperSerialiser;