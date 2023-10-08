import { useEffect } from "react";

export function useMyKey(key, action) {

    useEffect(()=>{
        function callback(e) {
          if(e.code.toLowerCase() === key.toLowerCase()) {
            action()
            console.log("CLOSE movie details by pressing escape key")
          }
        }
        document.addEventListener("keydown", callback)
        return () => {
          document.removeEventListener("keydown", callback)
        }
      },[key, action])
}