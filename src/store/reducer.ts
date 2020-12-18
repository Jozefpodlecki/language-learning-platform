import * as actions from "./actions";
import { ActionType, getType } from "typesafe-actions";
import { combineReducers } from "redux";
import {  } from "api";
import { State } from "./State";
import { MCQItem } from "models/Session";
import { generateItems, generateRecordAudioItem } from "appUtils";
import { unload } from "models/Loadable";

export type Action = ActionType<typeof actions>;