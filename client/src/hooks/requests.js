const baseURL = "http://localhost:8080/v1";

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${baseURL}/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${baseURL}/launches`);
  const json = await response.json();
  return json.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    const response = await fetch(`${baseURL}/launches`, {
      method: "post",
      body: JSON.stringify(launch),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log("Return response for submitted launch: ", json);
    return response.status;
  } catch (err) {
    console.log("Error while submitted launch: ", err);
    // set status code as 500 indicating issue is with the network or server!
    return 500;
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    const response = await fetch(`${baseURL}/launches/${id}`, {
      method: "delete",
    });
    const json = await response.json();
    console.log("Return response for delete request: ", json);
    return response.status;
  } catch (err) {
    console.log(err);
    // set status code as 500 indicating issue is with the network or server!
    return 500;
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
