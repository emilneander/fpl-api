const axios = require("axios");

module.exports.fetchGeneralInfo = async () => {
  try {
    return await axios.get(
      "https://fantasy.premierleague.com/api/bootstrap-static/"
    );
  } catch (error) {
    console.error(error);
  }
};
module.exports.fetchCurrentTeam = async (managerId, eventId) => {
  try {
    eventId === 0 ? (eventId = 1) : "";
    return await axios.get(
      `https://fantasy.premierleague.com/api/entry/${managerId}/event/${eventId}/picks/`
    );
  } catch (error) {
    console.error(error);
  }
};
module.exports.fetchLiveEvent = async (eventId) => {
  try {
    return await axios.get(
      `https://fantasy.premierleague.com/api/event/${eventId}/live/`
    );
  } catch (error) {
    console.error(error);
  }
};
module.exports.fetchHistoryTeam = async (managerId) => {
  try {
    return await axios.get(
      `https://fantasy.premierleague.com/api/entry/${managerId}/history/`
    );
  } catch (error) {
    console.error(error);
  }
};
module.exports.fetchFixtures = async (eventId) => {
  try {
    return await axios.get(
      `https://fantasy.premierleague.com/api/fixtures?event=${eventId}`
    );
  } catch (error) {
    console.error(error);
  }
};
