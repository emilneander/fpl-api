const { getGeneralInfo } = require("../helper/fetches");

module.exports.collectManagerInfo.js = async () => {
  getGeneralInfo().then((res) => {
    console.log(res);
  });
};
