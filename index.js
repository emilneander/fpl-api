const express = require("express");
const {
  collectGeneralInfo,
  collectCurrentSquad,
  collectPointsToCurrentSquad,
  collectRankChange,
} = require("./script/collectData");
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

app.get("/current-squad/:manager/", async (req, res) => {
  const managerId = parseInt(req.params.manager);
  let teams,
    allPlayers,
    currentEventId,
    deadline,
    currentSquad,
    currentRank,
    rankChange;
  await collectGeneralInfo()
    .then((data) => {
      [teams, allPlayers, currentEventId, deadline] = data;
    })
    .then(async () => {
      await collectCurrentSquad(managerId, currentEventId, allPlayers)
        .then((data) => {
          [currentSquad, currentRank] = data;
        })

        .then(async () => {
          await collectPointsToCurrentSquad(currentEventId, currentSquad)
            .then((data) => {
              currentSquad = data;
            })
            .then(async () => {
              await collectRankChange(
                managerId,
                currentEventId,
                currentRank
              ).then((data) => {
                rankChange = data;
                res.status(200).send({
                  gameweek: currentEventId,
                  total_points: currentSquad.total_points,
                  currentRank: currentRank,
                  rankChange: rankChange,
                  deadline: deadline,
                  currentSquad: currentSquad,
                });
              });
            });
        });
    });
});
