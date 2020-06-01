const FrSocket = function(host){
  this.socket = new WebSocket(`ws://${host}`)
  this.subscriptionObservers = {}
  this.messageObservers = {}
  this.socket.onmessage = (nessage) => {
    const events = {
      accept_connection: (payload) => {
        this.onConnected(payload)
      },
      deny_connection: (_) => {
        this.onDisconnected()
      },
      accept_subscription: (payload) => {
        this.onSubscribed(payload)
      },
      deny_subscription: (payload) => {
        this.onUnsubscribe(payload)
      } ,
      message: (payload) => {
        this.onMessage(payload)
      }
    }
    const mes = JSON.parse(message.data)
    events[mes["type"]](mes.payload)
  }
  this.onConneted = (payload) => {}
  this.broadcast = ({subscription, message}) => {
    this.socket.send(JSON.stringify({type: 'message', payload: {sub_uuid: subscription}}))
  }
  this.subscribe = ({connection, channel, room, params}) => {
    return new Promise((res, rej) => {
      this.subscriptionObservers[room] = (subscription) => {
        res({
          subscription,
          onMessage: (callback) => {
            this.messageObservers[subscription] = (message) => {
              callback(message)
            }
          }
        })
      }
      this.socket.send(JSON.stringify({type: 'subscribe', payload: {room}}))
    })
  }
  this.onDisconnected = (payload) => {}
  this.onUnsubscribed = (payload) => {}
  this.onSubscribed = ({subscription, room, connection}) => {
    this.subscriptionObservers[room](subscription)
  }
  this.onMessage = ({subscription, message}) => {
    this.messageObservers[subscription](message)
  }
}

module.exports = {
  connect(host){
    return new Promise((res, rej) => {
      let frSocket = new FrSocket(host)
      frSocket.onConnected = (connection) => {
        res({
          subscribe: ({channel, room, params}) => {
            return new Promise((res, rej) => {
              frSocket.subscribe({connection, room: `${channel}:${room}`, params})
              .then(({subscription, onMessage}) => {
                const sub = {
                  broadcast: (message) => {
                    frSocket.broadcast({subscription, message})
                  }
                }
                onMessage((message) => {
                  sub.onMessage(message)
                })
                res(sub)
              })
            })
          }
        })
      }
    })
  }
}