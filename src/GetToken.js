
export async function GetToken() {
          try {
            //const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal})
              // POST request using fetch inside useEffect React hook
              const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Username: process.env.REACT_APP_TOKEN_USR, Password: process.env.REACT_APP_TOKEN_PWD })
                };
                const res = await fetch(`${process.env.REACT_APP_BASE_API_URL}Fx/CreateToken`, requestOptions)
                    
                    //console.log(await res.text())
          
                // empty dependency array means this effect will only run once (like componentDidMount in classes)
          
            if(!res.ok) {
              throw new Error("Something went wrong with fetching token...")
            }
            const data = await res.text()
            if(data.Response === 'False') {
              throw new Error("Movie not found.")
            }
            return data
            //console.log(movies) // return empty as it is in stale(or previous value) state        
          } catch (err) {
            if(err.name !== "AbortError") {
              console.error(err.message)
            }
            return err.meesage
          }
}