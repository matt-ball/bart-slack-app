const axios = require('axios')
const moment = require('moment')
const config = require('../config')
const stations = require('./helpers/stations')

module.exports = async function next (req, res) {
  const { text } = req.body
  const stringArr = text.split(' ')
  const orig = getStation(stringArr[3])
  const dest = getStation(stringArr[1])

  const url = [
    `https://api.bart.gov/api/sched.aspx`,
    `?cmd=depart`,
    `&orig=${orig.abbr}`,
    `&dest=${dest.abbr}`,
    `&b=0`,
    `&key=${config.key}`,
    `&json=y`
  ].join('')

  const result = await axios.get(url)

  if (result) {
    const { schedule } = result.data.root
    const { date, time, request } = schedule
    const requestDateTime = moment(`${date} ${time}`, 'MMM-DD-YYYY hh:mm A')
    const nextTrain = request.trip[0]
    const nextTrainDateTime = moment(`${nextTrain['@origTimeDate'].trim()} ${nextTrain['@origTimeMin'].trim()}`, 'MM/DD/YYYY hh:mm A')
    const minutesUntilTrain = moment.duration(nextTrainDateTime.diff(requestDateTime)).asMinutes()

    res.send(`The next train to ${dest.name} from ${orig.name} is in ${minutesUntilTrain} minutes.`)
  }
}

function getStation (station) {
  const stationDetail = stations.filter((stn) => new RegExp(station, 'i').test(stn.name))

  if (stationDetail.length) {
    return {
      abbr: stationDetail[0].abbr,
      name: stationDetail[0].name
    }
  }
}
