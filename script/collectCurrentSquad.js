const { getGeneralInfo } = require("../helper/fetches");

module.exports.collectCurrentSquad = async (managerId) => {
  await getGeneralInfo().then((res) => {
    if (res.status !== 200) return;
    const data = res.data;
    const teams = data.teams.map((t) => {
      return { id: t.id, name: t.name };
    });
    const gameWeeksDeadline = data.events.map((e) => {
      return { id: e.id, deadline_epoch: e.deadline_time_epoch };
    });
  });
};
