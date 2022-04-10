const {
  fetchGeneralInfo,
  fetchCurrentTeam,
  fetchLiveEvent,
} = require("../helper/fetches");

module.exports.collectGeneralInfo = async () => {
  return await fetchGeneralInfo().then((res) => {
    if (res.status !== 200) return;
    const data = res.data;
    const currentEventId = data.events.find((e) => e.is_current)?.id ?? 0;
    const teams = data.teams.map((t) => {
      return { id: t.id, name: t.name };
    });
    const deadline =
      data.events.find((e) => e.is_next).deadline_time_epoch ?? 0;
    const types = data.element_types.map((t) => {
      return {
        id: t.id,
        plural_name_short: t.plural_name_short,
      };
    });
    const allPlayers = data.elements.map((p) => {
      return {
        id: p.id,
        first_name: p.first_name,
        second_name: p.second_name,
        web_name: p.web_name,
        team: teams.find((t) => t.id === p.team),
        type: types.find((t) => t.id === p.element_type),
      };
    });
    return [teams, allPlayers, currentEventId, deadline];
  });
};
module.exports.collectCurrentSquad = async (managerId, eventId, allPlayers) => {
  return await fetchCurrentTeam(managerId, eventId).then((res) => {
    if (res.status !== 200) return;
    const data = res.data;
    const players = data.picks.map((p) => {
      const pData = allPlayers.find((ap) => ap.id === p.element);
      return {
        id: pData.id,
        first_name: pData.first_name,
        web_name: pData.web_name,
        position: p.position,
        multiplier: p.multiplier,
        team: pData.team.name,
        type: pData.type.plural_name_short,
      };
    });
    return players;
  });
};
module.exports.collectPointsToCurrentSquad = async (eventId, currentSquad) => {
  return await fetchLiveEvent(eventId).then((res) => {
    if (res.status !== 200) return;
    const data = res.data.elements;
    const currentSquadData = data.filter((csd) =>
      currentSquad.map((cs) => cs.id).includes(csd.id)
    );
    const currentSquadStats = currentSquadData.map((c) => {
      let stats = c.stats;
      return {
        id: c.id,
        points: stats.total_points,
        in_dreamteam: stats.in_dreamteam,
      };
    });
    let sum = 0;
    currentSquad.forEach((c) => {
      const statsItem = currentSquadStats.find((cs) => c.id === cs.id);
      if (statsItem) {
        c["points"] = statsItem.points;
        c["in_dreamteam"] = statsItem.in_dreamteam;
        c.points *= c.multiplier;

        sum += statsItem.points * c.multiplier;
      }
    });
    currentSquad["total_points"] = sum;
    return currentSquad;
  });
};
