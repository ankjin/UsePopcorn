import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
      const [value, setValue] = useState(function () {
        const retValue = localStorage.getItem(key)
        return retValue ? JSON.parse(retValue) : initialState
      });

    useEffect(function() {
        localStorage.setItem(key, JSON.stringify(value))
      },[value, key])

      return [value, setValue]
}