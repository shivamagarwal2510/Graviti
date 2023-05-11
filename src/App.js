import logo from "./images/Graviti Logo 1.svg";
import placeholder2 from "./images/placeholder 2.svg";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
// import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import { useState, useRef } from "react";
import "./App.css";

const center = {
  lat: 26.449923,
  lng: 80.331871,
};

function App() {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [ETA, setETA] = useState("");
  const [mapKey, setMapKey] = useState("1");
  console.log(ETA, distance);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <h1> Loading...</h1>;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    setMapKey(Date.now());
    setDirectionsResponse(null);
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setETA(results.routes[0].legs[0].duration.text);
  }
  function clearRoute() {
    setDistance("");
    setETA("");
  }
  console.log(directionsResponse);
  return (
    <div className="App">
      <div className="w-[100vw] h-[80px]">
        <img src={logo} alt="Graviti" className="ml-[20px] pt-[6px]" />
      </div>
      <div className="w-[100vw] md:h-[calc(100vh-80px)] font-['Work Sans'] bg-[#f4f9fb] ">
        <p className="text-[#1B31A8]  font-[400px] text-[20px] text-center pt-[33px]">
          Let's calculate <span className="font-bold">distance</span> from
          Google maps
        </p>
        <div className="flex flex-col-reverse md:flex-row md:justify-center md:items-center">
          <div className="w-auto  md:w-[50%]">
            <form className="md:w-[26vw]">
              <div className="text-left md:flex md:flex-row  md:items-center">
                <div className="m-[20px]">
                  <div className="">
                    <label
                      for="origin"
                      className=" font-[400px] mt-[121px] text-[14px] "
                    >
                      {" "}
                      Origin
                    </label>
                    <br />

                    <div className="w-[272px] h-[56px] bg-white rounded">
                      <Autocomplete>
                        <input
                          className={`p-1 w-[238px] font-bold text-[#4D6475]  text-[24px] h-[56px] rounded `}
                          style={{ backgroundImage: placeholder2 }}
                          ref={originRef}
                        />
                      </Autocomplete>
                    </div>
                  </div>
                  <br />
                  <div className="mt-[39px] ">
                    <label
                      className="font-[400px] text-[14px] "
                      for="destination"
                    >
                      {" "}
                      Destination
                    </label>
                    <br />

                    <div className=" w-[272px] h-[56px] bg-white rounded">
                      <Autocomplete>
                        <input
                          className="p-1 w-[238px] text-[#4D6475]  h-[56px] font-bold text-[24px] rounded"
                          ref={destiantionRef}
                        />
                      </Autocomplete>
                    </div>
                  </div>
                </div>
                <div className="w-auto text-center md:justify-center md:text-center pl-[40px] pr-[40px]">
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      clearRoute();
                      calculateRoute();
                    }}
                    className="w-[141px] h-[62px] bg-[#1B31A8] rounded-full text-white text-center"
                  >
                    Calculate
                  </button>
                </div>
              </div>
              <div>
                <div className="md:w-[100%] bg-white m-[20px] flex justify-between">
                  <h1 className=" font-bold text-lg p-[30px]">ETA</h1>
                  <div className="font-bold text-3xl flex items-center pr-[20px] text-[#0079FF]">
                    {ETA}
                  </div>
                </div>
                <div className="md:w-[100%] bg-white m-[20px] mb-0 flex justify-between">
                  <h1 className=" font-bold text-lg p-[30px]">Distance</h1>
                  <div className="font-bold text-3xl flex items-center pr-[20px] text-[#0079FF]">
                    {distance}
                  </div>
                </div>
                {distance && (
                  <div className="md:w-[100%] border-2 ml-[20px] p-[20px] border-solid border-t-0 border-[#e7e7e7]">
                    The distance between{" "}
                    <span className=" font-bold">
                      {originRef.current.value}
                    </span>{" "}
                    and{" "}
                    <span className="font-bold">
                      {destiantionRef.current.value}
                    </span>{" "}
                    via the seleted route is{" "}
                    <span className="font-bold">{distance}</span>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="w-auto h-[70vh] md:w-[35vw] md:h-[35vw] md:m-[70px]">
            {!isLoaded ? (
              <h1>Loading...</h1>
            ) : (
              <GoogleMap
                key={mapKey}
                mapContainerClassName="map-container"
                center={center}
                zoom={10}
                onLoad={(map) => setMap(map)}
              >
                <Marker position={center} />
                {directionsResponse && (
                  <DirectionsRenderer directions={directionsResponse} />
                )}
              </GoogleMap>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
