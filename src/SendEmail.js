import { GetToken } from "./GetToken";

export async function SendEmail() {

  const tkn = await GetToken();
  
  console.log("!!!", tkn)

  async function Sendmail() {
    try {
      
      //const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {signal: controller.signal})
        // POST request using fetch inside useEffect React hook
        const requestOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tkn,
          },
          body: JSON.stringify({
            "FirstName": "Flx",
            "LastName": "Mtsn",
            "Mobile": "04993366",
            "Email": "felixm.jr01@gmail.com",
            "FormSubject": "From React Sample popcrn",
            "MessageBody": "test from sample react app (hardcoded)",
            "SAPRouteCode": "",
            "SourceInquiry": 101,
            "ZBrand_KUT": 101,
            "ZChannel_KUT": 104,
            "Remark1_KUT": ""
          })

          };
          const res = await fetch(`${process.env.REACT_APP_BASE_API_URL}Fx/SendEmail`, requestOptions)
              
              //console.log(await res.text())
    
          // empty dependency array means this effect will only run once (like componentDidMount in classes)
    
      if(!res.ok) {
        throw new Error("Something went wrong with fetching movies...")
      }
      const data = await res.json()
      if(data.Response === 'False') {
        throw new Error("Movie not found.")
      }
      console.log(data)
      //console.log(movies) // return empty as it is in stale(or previous value) state        
    } catch (err) {
      if(err.name !== "AbortError") {
      console.error(err.message)
      }
    } finally {
      console.log("finally...")
    }
  }
  Sendmail()
}