import { RootState } from "reducers";
import {
    createSelectorHook,
} from "react-redux";

export const useSelector = createSelectorHook<RootState>();
