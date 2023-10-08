import { useEffect, useState } from "react";

const KEY = "5f5950c6"

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {

        //callback()
        // this is a browser api (not from React)
        const controller = new AbortController()
    
        async function fetchMovies() {
          try {
            setIsLoading(true)
            setError("")
            const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal})
    
            if(!res.ok) {
              throw new Error("Something went wrong with fetching movies...")
            }
            const data = await res.json()
            if(data.Response === 'False') {
              throw new Error("Movie not found.")
            }
            setMovies(data.Search)
            setError("")
            //console.log(movies) // return empty as it is in stale(or previous value) state        
          } catch (err) {
            if(err.name !== "AbortError") {
            console.error(err.message)
              setError(err.message)
            }
          } finally {
            setIsLoading(false)
          }
        }
    
        if(query < 3) {
          setMovies([])
          setError("")
          return
        }
        
        //handleCloseMovie()
        fetchMovies()
        return function() {
          controller.abort()  
        }
      }, [query])

      return {movies, isLoading, error}
}