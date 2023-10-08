import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating"
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useMyKey } from "./useMyKey";
import { SendEmail } from "./SendEmail";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


  const KEY = "5f5950c6"


export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)
  
  const {movies, isLoading, error} = useMovies(query)
  const [watched, setWatched] = useLocalStorageState([], "watched")

  // const [watched, setWatched] = useState(function() {
  //   const retValue = localStorage.getItem("watched")
  //   return JSON.parse(retValue)
  // });


  function handleSelectedMovie(id) {
    console.log(id);
    setSelectedId(selectedId => selectedId === id ? null : id)
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }
  function handleDeleteWatched(id) {
    setWatched(watch => watched.filter(movie => movie.imdbID !== id))
  }  

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          { isLoading && <Loader /> }
          { !isLoading && !error && <MovieList movies={movies} onSelectedMovie={handleSelectedMovie} /> }
          { error && <ErrorMessage message={error} /> }
        </Box>

        <Box>
          {selectedId ? 
          <MovieDetails selectedId={selectedId} 
            onCloseMovie={handleCloseMovie} 
            onAddWatched={handleAddWatched}
            watched={watched} />
          :
          <>
            <WatchedSummary watched={watched} />
            <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched}/>
          </>            
          }
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>
}

function ErrorMessage({message}) {
  return <p className="error">
    <span>|</span>{message}
  </p>
}

function NavBar({children}) {

  return(
    <nav className="nav-bar">
      {children}
    </nav>
  )
}
function Logo() {
  return (
    <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
  )
}
function Search({query, setQuery}) {
  const inputEl = useRef(null)

  useMyKey("Enter", function() {
      if (document.activeElement === inputEl.current) {
        return;
      }
      inputEl.current.focus();
      setQuery("");
  })

  return (
    <input
      ref={inputEl}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function NumResults({movies}) {
  return (
    <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
  )
}



function Main({children}) {




  return (
    <main className="main">
      {children}
    </main>
  );
}

function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      { isOpen && children }
    </div>
  );
}

function MovieList({movies, onSelectedMovie}) {

  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectedMovie={onSelectedMovie} />
      ))}
    </ul>
  );
}

function Movie({movie, onSelectedMovie}) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
  )
}

function MovieDetails({selectedId, onCloseMovie, onAddWatched, watched}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState("")

  const countClickRef = useRef(0)

  useEffect(() => {
    if(userRating) {
      countClickRef.current += 1
    }
  }, [userRating])

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)
  // destructure the return object from fetch api
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecissions: countClickRef.current
    }
    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setIsLoading(true)
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)

        if(!res.ok) {
          throw new Error("Something went wrong with fetching movie...")
        }
        const data = await res.json()
        if(data.Response === 'False') {
          throw new Error("Movie not found.")
        }
        setMovie(data)
        //console.log(movies) // return empty as it is in stale(or previous value) state    
      } catch (err) {
        console.error(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    getMovieDetails()
  }, [selectedId])

  useEffect(function(){
    if(!title) return
    document.title = `Movie | ${title}`

    return function() {
      document.title = "usePopcorn"
    }
  },[title])

  useMyKey("Escape", onCloseMovie)


  return (
    <div className="details">
      {isLoading ? <Loader />
        :
        <>
        <header className="">        
          <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
          <img src={poster} alt={`Poster of ${movie} movie`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p><span>⭐</span> {imdbRating} IMDb rating</p>
          </div>
        </header>
        <section>
          <div className="rating">
            {!isWatched ?
            <>            
              <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
              {userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>}
            </> 
            :
            <p>You rated with movie {watchedUserRating?.userRating} <span>⭐</span></p>
            }
          </div>
          <p><em>{plot}</em></p>
          <p>Staring: {actors}</p>
          <p>Directed by: {director}</p>
        </section>        
        </>
      }

    </div>
  )
}

// function WathcedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);



//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>

//           <WatchedSummary watched={watched} />

//           <WatchedMovieList watched={watched} />

//         </>
//       )}
//     </div>
//   );
// }

function WatchedSummary({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
    <h2>Movies you watched</h2>
    <div>
      <p onClick={() => SendEmail()}>
        <span>#️⃣</span>
        <span>{Number(watched.length)} movies</span>
      </p>
      <p>
        <span>⭐️</span>
        <span>{avgImdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{avgUserRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{avgRuntime} min</span>
      </p>
    </div>
  </div>
  )
}

function WatchedMovieList({watched, onDeleteWatched}) {

  return (
    <ul className="list">
    {watched.map((movie) => (

      <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />

    ))}
  </ul>
  )
}

function WatchedMovie({movie, onDeleteWatched}) {
  //console.log(movie)
  return (
    <li>
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <h3>{movie.title}</h3>
        <div>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
          <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}></button>
        </div>
      </li>
  )
}