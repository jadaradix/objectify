import Serialiser = require("./Serialiser");

import CreeperAction from "../classes/CreeperAction";
import CreeperActionType from "../classes/CreeperActionType";

class CreeperActionSerialiser implements Serialiser {

  toRaw (creeperAction: CreeperAction): Object {
    return {
      "type": creeperAction.type.value,
      "data": creeperAction.data
    };
  }

  fromRaw (object): CreeperAction {
    const id = object.creeperActionId;
    const type: CreeperActionType = new CreeperActionType(object.value);
    const data: string = object.data;
    return new CreeperAction(
      id,
      type,
      data
    );
  }

}

export = CreeperActionSerialiser;