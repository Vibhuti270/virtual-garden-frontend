import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import {database} from "./services/firebase";

import { createContext, useContext, useEffect, useState } from "react";

//toastify
import { toast } from "react-toastify";

const herbContext = createContext();

//custom consumer
function useHerbValue(){
    const value = useContext(herbContext);
    return value;
}

