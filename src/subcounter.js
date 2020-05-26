import colors from 'colors' // eslint-disable-line no-unused-vars
import fs from 'fs'
import path from 'path'
import tmi from 'tmi.js'

import config from './config.js'

function set(filename, val)
{
  fs.writeFileSync(path.resolve(__dirname, 'output', `${filename}.txt`), val)
}

function get(filename)
{
  return fs.readFileSync(path.resolve(__dirname, 'output', `${filename}.txt`), { encoding: 'utf-8' })
}

function add(filename)
{
  set(filename, (parseInt(get(filename))+1).toString())
}

function onSubscription()
{
  add('sub_counter')
  consoleLogUpdate()
}

function consoleLogUpdate()
{
  console.clear()
  console.log(` -----------------------------------------`)
  console.log(` Twitch            `, `connected`.green)
  console.log(` Channels          `, `${config.channels}`.green)
  console.log(` -----------------------------------------`)
  console.log(` Subs              `, `${get('sub_counter')}`.green)
}

const Twitch = new tmi.Client({
  connection: { secure: true, reconnect: true },
  channels: config.channels
})
      Twitch.on('connected', () => {
        // create output folder if it doesn't exist
        if (!fs.existsSync(path.resolve(__dirname, 'output')))
        {
          fs.mkdirSync(path.resolve(__dirname, 'output'))
        }

        // create sub_counter file if it doesn't exist
        if (!fs.existsSync(path.resolve(__dirname, 'output', `sub_counter.txt`)))
        {
          set('sub_counter', '0')
        }

        // update console log
        consoleLogUpdate()
      })
      Twitch.on('disconnected', reason => {
        console.log(` --------`.red)
        console.log(` Twitch disconnected`.red)
        console.log(` Reason:            `.red, reason)
        console.log(` --------`.red)
      })
      Twitch.on('anongiftpaidupgrade', onSubscription)
      Twitch.on('giftpaidupgrade', onSubscription)
      Twitch.on('submysterygift', onSubscription)
      Twitch.on('subgift', onSubscription)
      Twitch.on('subscription', onSubscription)
      Twitch.on('resub', onSubscription)
      Twitch.connect()